const app = require('../app');
const request = require('supertest')
const db = require("../db/db");
const { MongoClient, ObjectId } = require('mongodb');

describe('mealplan route endpoints', () => {
    let jwt;
    let mealPlanId;
    let newUsername = "mealplan";
    let newPassword = "test-password";

    let connection;
    let test_db;
    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        test_db = await connection.db();
        db.set(test_db);

        // create the user for this test suite
        await request(app)
            .post('/users/new')
            .send({ username: newUsername, password: newPassword })
            .expect(200)

        // get our login token for this test suite
        await request(app)
            .post('/users/login')
            .send({ username: newUsername, password: newPassword })
            .expect(200)
            .then((response) => {
                expect(response.body.jwt).toBeDefined();
                jwt = response.body.jwt;
            })
    });

    afterAll(async () => {
        await connection.close();
    });

    it('add a blank new meal plan', async () => {
        
        // add the meal plan
        await request(app)
            .post('/mealplan')
            .set('Authorization', 'Bearer ' + jwt)
            .send({ startdate: new Date(Date.now()).getTime() })
            .expect(201)
            .then((response) => {
                expect(response.body.id).toBeDefined();
                mealPlanId = response.body.id;
            })

        // check the database for this new meal plan
        await db
            .get()
            .collection("mealplans")
            .find({ username: newUsername })
            .toArray()
            .then(doc => {
                // we inserted 1 meal plan for this user who started out with 0
                expect(doc).toBeDefined();
                expect(doc.length).toEqual(1);
                expect(doc[0]._id).toEqual(ObjectId(mealPlanId))
            })
    })

    it('get all the meal plans and check they\'re properly formatted', async () => {

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
            })
    })

    let mondayUpdateJSON = { monday: { breakfast: [ { name: "cereal", ingredientList: [ { name: "milk" }, { name: "cereal" } ] } ], 
    lunch: [ { name: "sandwich", ingredientList: [ { name: "bread" }, { name: "cheese" }, { name: "ham" } ] } ], 
    dinner: [ { name: "pasta", ingredientList: [ { name: "noodles" }, { name: "tomato sauce"} ] } ] } }
    it('update monday\'s meals', async () => {

        // make a change to the inserted meal plan
        await request(app)
            .put('/mealplan/' + mealPlanId)
            .set('Authorization', 'Bearer ' + jwt)
            .set('Content-Type', 'application/json')
            .send(mondayUpdateJSON)
            .expect(201)
            .then((response) => {
                expect(response.body.length).toEqual(1); // response.body should be an array of mealplans
                let mealplans = response.body;
                for (let mp of mealplans) {
                    if (mp._id === mealPlanId) {
                        expect(mp.monday).toEqual(mondayUpdateJSON.monday); // check that we get updated information back
                    }
                }
            })

        // check the database ourselves to verify the change was made
        await db
            .get()
            .collection("mealplans")
            .findOne({ _id: ObjectId(mealPlanId) })
            .then(doc => {
                expect(doc.monday).toEqual(mondayUpdateJSON.monday); // check that the database was correctly updated
            })
    })

    it('update tuesday\'s meals and leave monday untouched', async() => {
        let tuesdayUpdateJSON = { tuesday: { breakfast: [ { name: "toast", ingredientList: [ { name: "bread" }, { name: "butter" } ] } ], 
                                     dinner: [ { name: "lasagna", ingredientList: [ { name: "noodles" }, { name: "marinara sauce"}, { name: "ground beef"} ] } ] } }

        // make a change to the inserted meal plan
        await request(app)
            .put('/mealplan/' + mealPlanId)
            .set('Authorization', 'Bearer ' + jwt)
            .set('Content-Type', 'application/json')
            .send(tuesdayUpdateJSON)
            .expect(201)
            .then((response) => {
                expect(response.body.length).toEqual(1); // response.body should be an array of mealplans
                let mealplans = response.body;
                for (let mp of mealplans) {
                    if (mp._id === mealPlanId) {
                        expect(mp.monday).toEqual(mondayUpdateJSON.monday); // monday should be untouched
                        expect(mp.tuesday).toEqual(tuesdayUpdateJSON.tuesday); // check that we get updated information back
                    }
                }
            })

        // check the database ourselves to verify the change was made
        await db
            .get()
            .collection("mealplans")
            .findOne({ _id: ObjectId(mealPlanId) })
            .then(doc => {
                expect(doc.monday).toEqual(mondayUpdateJSON.monday); // monday should be untouched
                expect(doc.tuesday).toEqual(tuesdayUpdateJSON.tuesday); // check that the database was correctly updated
            })
    })

    it('check off items in a user\'s grocery list', async() => {
        const checked = [ "marinara sauce", "cereal", "butter", "noodles" ]

        // make a change to the inserted meal plan
        await request(app)
            .post('/mealplan/' + mealPlanId + "/check-grocery-items")
            .set('Authorization', 'Bearer ' + jwt)
            .set('Content-Type', 'application/json')
            .send({ checked: checked })
            .expect(200)

        // check the database ourselves to verify the change was made
        await db
            .get()
            .collection("mealplans")
            .findOne({ _id: ObjectId(mealPlanId) })
            .then(mealplan => {
                expect(mealplan).toBeDefined();
                
                const days = [ "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday" ];
                const times = [ "breakfast", "lunch", "dinner" ];
                for (let day of days) {
                    for (let time of times) {
                        for (let meal in mealplan[day][time]) {
                            const ingList = mealplan[day][time][meal].ingredientList;
                            for (let ing in ingList) {
                                if (checked.includes(ingList[ing].name)) {
                                    expect(mealplan[day][time][meal].ingredientList[ing]["checked"]).toBeTruthy();
                                } else {
                                    expect(mealplan[day][time][meal].ingredientList[ing]["checked"]).toBeFalsy();
                                }
                            }
                        }
                    }
                }
            })
    })

    it('uncheck 1 item in a user\'s grocery list that we previously checked', async() => {
        const unchecked = [ "marinara sauce" ]

        // make a change to the inserted meal plan
        await request(app)
            .post('/mealplan/' + mealPlanId + "/check-grocery-items")
            .set('Authorization', 'Bearer ' + jwt)
            .set('Content-Type', 'application/json')
            .send({ unchecked: unchecked })
            .expect(200)

        // check the database ourselves to verify the change was made
        await db
            .get()
            .collection("mealplans")
            .findOne({ _id: ObjectId(mealPlanId) })
            .then(mealplan => {
                expect(mealplan).toBeDefined();
                
                const days = [ "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday" ];
                const times = [ "breakfast", "lunch", "dinner" ];
                const checked = [ "cereal", "butter", "noodles" ] // these are the only ingredients that should be checked
                for (let day of days) {
                    for (let time of times) {
                        for (let meal in mealplan[day][time]) {
                            const ingList = mealplan[day][time][meal].ingredientList;
                            for (let ing in ingList) {
                                if (checked.includes(ingList[ing].name)) {
                                    expect(mealplan[day][time][meal].ingredientList[ing]["checked"]).toBeTruthy();
                                } else {
                                    expect(mealplan[day][time][meal].ingredientList[ing]["checked"]).toBeFalsy();
                                }
                            }
                        }
                    }
                }
            })
    })

    it('fail to add new meal plan due to being unauthenticated', async () => {
        await request(app)
            .post('/mealplan')
            .set('Authorization', 'Bearer ' + "bad jwt")
            .send({ startdate: new Date(Date.now()).getTime() })
            .expect(401)
    })

    it('fail to add new meal plan due to missing start date', async () => {
        await request(app)
            .post('/mealplan')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(400)
    })
})