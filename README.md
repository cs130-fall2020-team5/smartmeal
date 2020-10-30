# smartmeal
Meal planning web app that shows you the nutritional and budgetary impact of your planned meals

## Directory setup:
* `frontend`: React webapp
* `backend`: Node.js server running Express and MongoDB

## Setting up:
1. Run `npm install` the root directory
2. Load sample database with `cd backend/ && mongo < db/load_db.sh`

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
  * there's currently 1 endpoint to support logging in: `POST http://localhost:4000/users/login`
* Frontend runs on port 3000 (app viewable at `localhost:3000`)
* Backend runs on port 4000

## Priority to-dos:
* Enable storage of user's login session jwt in localstorage so you don't have to relog in every time you refresh
