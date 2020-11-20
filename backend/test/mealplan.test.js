const app = require('../app');
const request = require('supertest')
const db = require("../db/db");
const { MongoClient, ObjectId } = require('mongodb');

describe('mealplan route', () => {
    let connection;
    let jwt;
    let mealPlanId;
    
    beforeAll(async () => {
        connection = await MongoClient.connect("mongodb://localhost:27017", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db.set(await connection.db("SmartMeal"));

        // log in
        await request(app)
            .post('/users/login')
            .send({ username: 'eggert', password: 'engineering' })
            .expect(200)
            .then((response) => {
                expect(response.body.jwt).toBeDefined();
                jwt = response.body.jwt;
            })

        await db.get()
            .collection("mealplans")
            .deleteMany({ username: 'eggert' })
        
    });
    
    afterAll(async () => {
        await db.get()
            .collection("mealplans")
            .deleteOne({ _id: ObjectId(mealPlanId) })

        await connection.close();
        await db.close();
    });

    it('should add a blank new meal plan', async (done) => {
        
        // add the meal plan
        await request(app)
            .post('/mealplan')
            .set('Authorization', 'Bearer ' + jwt)
            .send({ startdate: new Date(Date.now()).getTime() })
            .expect(201)
            .then((response) => {
                expect(response.body.id).toBeDefined();
                mealPlanId = response.body.id;
                done();
            })

        // check the database for this new meal plan
        await db
            .get()
            .collection("mealplans")
            .find({ username: 'eggert' })
            .toArray()
            .then(doc => {
                // we inserted 1 meal plan for this user who started out with 0
                expect(doc.length).toEqual(1);
                expect(doc[0]._id).toEqual(ObjectId(mealPlanId))
            })
    })

    it('should get all the meal plans and check they\'re properly formatted', async (done) => {

        // make a change to the inserted meal plan
        await request(app)
            .get('/mealplan/')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then((response) => {
                expect(response.body.length).toEqual(1); // response.body should be an array of mealplans
                let mealplans = response.body;
                for (let mp of mealplans) {
                    // meal plans consist days of the week
                    expect(mp.monday).toBeDefined();
                    expect(mp.tuesday).toBeDefined();
                    expect(mp.wednesday).toBeDefined();
                    expect(mp.thursday).toBeDefined();
                    expect(mp.friday).toBeDefined();
                    expect(mp.saturday).toBeDefined();
                    expect(mp.sunday).toBeDefined();

                    // meal plans also have a start date
                    expect(mp.date).toBeDefined();
                }
                done();
            })
    })

    it('should update monday\'s meals', async (done) => {
        let updateJSON = { monday: { breakfast: [ { name: "cereal", ingredientList: [ { name: "milk" }, { name: "cereal" } ] } ], 
                                     lunch: [ { name: "sandwich", ingredientList: [ { name: "bread" }, { name: "cheese" }, { name: "ham" } ] } ], 
                                     dinner: [ { name: "pasta", ingredientList: [ { name: "noodles" }, { name: "tomato sauce"} ] } ] } }

        // make a change to the inserted meal plan
        await request(app)
            .put('/mealplan/' + mealPlanId)
            .set('Authorization', 'Bearer ' + jwt)
            .set('Content-Type', 'application/json')
            .send(updateJSON)
            .expect(201)
            .then((response) => {
                expect(response.body.length).toEqual(1); // response.body should be an array of mealplans
                let mealplans = response.body;
                for (let mp of mealplans) {
                    if (mp._id === mealPlanId) {
                        expect(mp.monday).toEqual(updateJSON.monday); // check that we get updated information back
                    }
                }
                done();
            })

        // check the database ourselves to verify the change was made
        await db
            .get()
            .collection("mealplans")
            .findOne({ _id: ObjectId(mealPlanId) })
            .then(doc => {
                expect(doc.monday).toEqual(updateJSON.monday); // check that the database was correctly updated
            })
    })
})