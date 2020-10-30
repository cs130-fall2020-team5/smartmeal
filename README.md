# smartmeal
Meal planning web app that shows you the nutritional and budgetary impact of your planned meals

Directory setup:
* `frontend`: React webapp
* `backend`: Node.js server running Express and MongoDB

Setup instructions:
1. Run `npm install` in `frontend/` and `backend/` separately

To run: 
1. Start mongo: `mongod`
2. Start both components: `cd frontend/ && npm start` and `cd backend/ && npm start`

Test backend server:
```
$ curl -d "username=eggert&password=engineering" -X POST http://localhost:4000/users/login
```
will return `200`
```
$ curl -d "username=bad&password=user" -X POST http://localhost:4000/users/login
```
will return `401`

Extra useful information:
* Frontend runs on port 3000 (app viewable at `localhost:3000`)
* Backend runs on port 4000
