const app = require('../app');
const request = require('supertest')
const db = require("../db/db");
const { MongoClient } = require('mongodb');

describe('users route', () => {
    let connection;
    let newUsername = "myusername";
    let newPassword = "myPassword";
    
    beforeAll(async () => {
        connection = await MongoClient.connect("mongodb://localhost:27017", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db.set(await connection.db("SmartMeal"));
        
    });
    
    afterAll(async () => {
        await db.get()
            .collection("users")
            .deleteOne({ username: newUsername })

        await connection.close();
        await db.close();
    });

    it('should be able to create a new user', async (done) => {
        await request(app)
            .post('/users/new')
            .send({ username: newUsername, password: newPassword })
            .expect(200)

        await db
            .get()
            .collection("users")
            .find({ username: newUsername })
            .toArray()
            .then((response) => {
                expect(response.length).toBeDefined(); // array
                expect(response.length).toEqual(1); // user exists and has unique username
                done();
            })
    })

    let token;
    it('should be able to log in to this new user and get a token', async (done) => {
        // log in
        await request(app)
            .post('/users/login')
            .send({ username: newUsername, password: newPassword })
            .expect(200)
            .then((response) => {
                expect(response.body.jwt).toBeDefined();
                token = response.body.jwt;
                done();
            })
    })

    it('should be able to use this token to authenticate', async (done) => {
        // dummy request to verify jwt
        await request(app)
            .get('/users/example')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then((response) => {
                expect(response.body.message).toEqual("authenticated");
                done();
            })
    })
})