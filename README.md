# smartmeal
Meal planning web app that shows you the nutritional and budgetary impact of your planned meals

## Directory setup:
* `frontend`: React webapp
* `backend`: Node.js server running Express and MongoDB

## Setting up:
1. Run `npm install` the root directory
2. Load sample database with `cd backend/ && mongo < db/load_db.sh`

(To run mongo on the background for MAC user:
start a server: brew services start mongodb-community@4.4
stop a server: brew services stop mongodb-community@4.4)
 
## Running: 
### Option 1: start frontend and backend separately
1. Start mongo: `mongod`
2. Run `npm start` in the `frontend/` and `backend/` folders separately

### Option 2 (preferred): start everything at once
1. Start mongo: `mongod`
2. Run `npm start` in the root directory
   * This requires you have `nodemon` installed globally: `npm install nodemon -g` (I manually added nodemon to an npm script for the node server)

## Extra useful information:
* Database loading script sets up 2 users
  * username: "smallberg", password: "software"
  * username: "eggert", password: "engineering"
  * frontend requires that you login with one of these two accounts before gaining access to the app
  * there's currently 1 endpoint to support logging in: `POST http://localhost:3000/users/login`
* Frontend runs on port 4000 (app viewable at `localhost:4000`)
* Backend runs on port 3000

## Thoughts/Todos
* I made some dummy data in `./frontend/sample-data/plan.json` using the class diagram

List of endpoints needed:
(this is all I could come up with, feel free to add or change these)

* `GET /mealplan`: get all meal plans for the user
* `POST /mealplan`: create new meal plan for the user, return all meal plans for user including the new one
* `PUT /mealplan/:mealplanid`: update the meal plan with id `mealplanid`

* `POST /users/new`: create a new user
* `POST /users/login`: attempt to login, returns session token to authenticate with for /mealplan/*


