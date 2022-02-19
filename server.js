const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const signIn =require('./controllers/signIn')
const register = require('./controllers/register')
const addFact = require('./controllers/addFact') 
const getFavorite = require('./controllers/getFavorites');
const addFavorite = require('./controllers/addFavorite'); 
const removeFavorite = require('./controllers/removeFavorite');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'perazarivera1998',
      database : 'chuckDB'
    }
});

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.post('/signin', (req, res) => {signIn.handleSignIn(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.post('/addFact', (req, res) => {addFact.handleAddFact(req, res, db)})

app.get('/getFavorites/:userid', (req, res) => {getFavorite.handleGetFavorites(req, res, db)})

app.post('/addFavorite', (req, res) => {addFavorite.handleAddFavorite(req, res, db)})

app.delete('/removeFavorite', (req, res) => {removeFavorite.handleRemoveFavorite(req, res, db)})

app.listen(3001, () => {
    console.log('App is running successfully')
})
