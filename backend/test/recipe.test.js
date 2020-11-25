const app = require('../app');
const request = require('supertest')
const db = require("../db/db");
const { MongoClient, ObjectId } = require('mongodb');

describe('recipe route endpoints', () => {
    let jwt;
    let recipeId;
    let newUsername = "recipe";
    let newPassword = "test-password";
    let numRecipes = 0;

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

    it('add a new recipe for this user', async () => {
        // add the recipe
        const ingredientList = [ { name: "noodles"}, { name: "marinara sauce"}, { name: "ground beef" } ];
        await request(app)
            .post('/recipe')
            .set('Authorization', 'Bearer ' + jwt)
            .send({ name: "lasagna", ingredients: JSON.stringify(ingredientList) })
            .expect(201)
            .then((response) => {
                expect(response.body.id).toBeDefined();
                recipeId = response.body.id;
                numRecipes++;
            })

        // check the database for this new recipe
        await db
            .get()
            .collection("recipes")
            .find({ username: newUsername })
            .toArray()
            .then(doc => {
                expect(doc).toBeDefined();
                expect(doc.length).toEqual(1);
                expect(doc[0]._id).toEqual(ObjectId(recipeId));
                expect(doc[0].name).toEqual("lasagna");
                expect(doc[0].ingredients).toEqual(ingredientList);
            })
    })

    it('fails to add a new recipe for unauthenticated user', async () => {
        // add the recipe
        const ingredientList = [ { name: "noodles"}, { name: "marinara sauce"}, { name: "ground beef" } ];
        await request(app)
            .post('/recipe')
            .set('Authorization', 'Bearer ' + "bad jwt")
            .send({ name: "lasagna", ingredients: JSON.stringify(ingredientList) })
            .expect(401)
    })

    it('fails to add a new recipe if required data is missing', async () => {
        // add the recipe
        const ingredientList = [ { name: "noodles"}, { name: "marinara sauce"}, { name: "ground beef" } ];
        await request(app)
            .post('/recipe')
            .set('Authorization', 'Bearer ' + jwt)
            .send({ ingredients: JSON.stringify(ingredientList) })
            .expect(400)

        await request(app)
            .post('/recipe')
            .set('Authorization', 'Bearer ' + jwt)
            .send({ name: "lasagna" })
            .expect(400)

        await request(app)
            .post('/recipe')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(400)
    })

    const newIngredient = { name: "bell peppers" };
    const ingredientList = [ newIngredient, { name: "noodles"}, { name: "marinara sauce"}, { name: "ground beef" } ];
    it('updates a recipe for this user', async () => {
        // add the recipe
        await request(app)
            .put('/recipe/' + recipeId)
            .set('Authorization', 'Bearer ' + jwt)
            .send({ name: "lasagna", ingredients: JSON.stringify(ingredientList) })
            .expect(200)
            .then((response) => {
                const recipes = response.body;
                expect(recipes).toBeDefined();
                expect(recipes.length).toEqual(1); // update, not insert
                expect(recipes[0].name).toEqual("lasagna")
                expect(recipes[0].ingredients).toEqual(ingredientList)
            })

        // check the database for this new recipe
        await db
            .get()
            .collection("recipes")
            .find({ username: newUsername })
            .toArray()
            .then(doc => {
                expect(doc).toBeDefined();
                expect(doc.length).toEqual(1);
                expect(doc[0]._id).toEqual(ObjectId(recipeId));
                expect(doc[0].name).toEqual("lasagna");
                expect(doc[0].ingredients).toEqual(ingredientList);
            })
    })

    it('gets a specific recipe for this user', async () => {
        await request(app)
            .get('/recipe/' + recipeId)
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then((response) => {
                const recipes = response.body;
                expect(recipes).toBeDefined();
                expect(recipes.name).toEqual("lasagna")
                expect(recipes.ingredients).toEqual(ingredientList)
                expect(recipes._id).toEqual(recipeId)
            })
    })

    it('returns nothing but succeeds when searching for non-existant recipe id', async () => {
        await request(app)
            .get('/recipe/' + new ObjectId())
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then((response) => {
                const recipes = response.body;
                expect(recipes).toBeNull();
            })
    })


    it('add new recipe then gets all recipes', async () => {
        const newRecipe = { name: "sandwich", ingredients: [ { name: "bread" }, { name: "cheese"}, { name: "ham" } ] };
        await request(app)
            .post('/recipe')
            .set('Authorization', 'Bearer ' + jwt)
            .send({ name: "lasagna", ingredients: JSON.stringify(newRecipe) })
            .expect(201)
            .then(() => {
                numRecipes++;
            })

        await request(app)
            .get('/recipe')
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then((response) => {
                const recipes = response.body;
                expect(recipes).toBeDefined();
                expect(recipes.length).toEqual(2);
            })
    })


    it('delete 1 recipe for this user', async () => {
        // add the recipe
        await request(app)
            .delete('/recipe/' + recipeId)
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .then(() => {
                numRecipes--;
            })

        // check the database to make sure it no longer exists
        await db
            .get()
            .collection("recipes")
            .find({ username: newUsername })
            .toArray()
            .then(doc => {
                expect(doc).toBeDefined();
                expect(doc.length).toEqual(numRecipes); // we have 1 left over from previous test
            })
    })
})