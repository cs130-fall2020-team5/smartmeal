const app = require('../app');
const request = require('supertest')
const db = require("../db/db");
const { MongoClient } = require('mongodb');

describe('users route endpoints', () => {
    let newUsername = "myusername";
    let newPassword = "myPassword";
    
    let connection;
    let test_db;
    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        test_db = await connection.db();
        db.set(test_db);
    });

    afterAll(async () => {
        await connection.close();
    });

    it('be able to create a new user', async () => {
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
            })
    })

    let token;
    it('be able to log in to this new user and get a token', async () => {
        // log in
        await request(app)
            .post('/users/login')
            .send({ username: newUsername, password: newPassword })
            .expect(200)
            .then((response) => {
                expect(response.body.jwt).toBeDefined();
                token = response.body.jwt;
            })
    })

    it('fail to create a user with an existing name', async () => {
        await request(app)
            .post('/users/new')
            .send({ username: newUsername, password: newPassword })
            .expect(400)
    })

    it('fail to authenticate with bad password', async () => {
        await request(app)
            .post('/users/login')
            .send({ username: newUsername, password: "bad pwd" })
            .expect(401)
    })

    it('fail to authenticate with bad username', async () => {
        await request(app)
            .post('/users/login')
            .send({ username: "bad username", password: newPassword })
            .expect(401)
    })
})