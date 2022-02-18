const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const axios = require('axios');
const knex = require('knex');

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


//Get users
app.get('/', (req, res) => {
    res.send(database.users);
})

// Get Fact from the Chuck Norris API
app.post('/addFact', (req, res) => {
    const {category} = req.body;
    if (category === 'All'){
        axios.get('https://api.chucknorris.io/jokes/random')
        .then(response => res.json(response.data))
        .catch(error => res.status(400).json(`Error: ${error}`))
    } else {
        axios.get(`https://api.chucknorris.io/jokes/random?category=${category}`)
        .then(response => res.json(response.data))
        .catch(error => res.status(400).json(`Error: ${error}`))
    }
})

//Log in to account
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json('Incorrect form submission');
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid){
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        console.log('Success')
                        res.json(user[0])
                    })
                    .catch(error => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Wrong credentials');
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'));
})

//Register new account
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    if(!email || !name || !password){
        return res.status(400).json('Incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email, 
                name: name,
                joined: new Date()})
            .then(user => {
                res.json(user[0]); 
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    }).catch(err => res.status(400).json('Unable to register'));
})

app.get('/getFavorites/:userid', (req, res) => {
    const {userid} = req.params;
    db.select('facts.factid', 'facts.facttext')
    .from('users')
    .where('users.id', userid) 
    .joinRaw('left join facts on facts.factid = any (users.favoritefacts)')
    .then(favoritefacts => {
        if (favoritefacts[0].factid === null) {//User has no favorite facts     
            res.json('No favorite facts')
        } else {
            const formatedResp = favoritefacts.map(fact => {
                return {
                    id: fact.factid,
                    value: fact.facttext 
                }
            })
            res.json(formatedResp)
        }
    })
    .catch(err => res.status(400).json('Unable to get account'));
})

app.post('/addFavorite', (req, res) => {
    const { factid, userid, text } = req.body;
    db.select('facts.facttext')
    .from('facts')
    .where('factid','=',factid)
    .then(data => {
        if (data.length) { // The fact is already in the FACTS TABLE
            db('facts')
            .where('factid', factid)
            .update({
                users: db.raw('array_append(users, ?)', [userid])
            })
            .catch(err => res.status(400).json('Unable to update the FACTS table'));
        } else { // The fact is not in the FACTS TABLE
            db('facts')
            .insert({
                factid: factid,
                users: [userid],
                facttext: text
            })
            .catch(err => res.status(400).json('Unable to create a new Fact'));
        }
        db('users')
        .where('id', userid)
        .update({
            favoritefacts: db.raw('array_append(favoritefacts, ?)', [factid])
        })
        .then(resp => res.json(resp))
        .catch(err => res.status(400).json('Unable to update the USERS table'));
    })
})

app.delete('/removeFavorite', (req, res) => {
    const { factid, userid } = req.body;
    db.select('facts.users')
    .from('facts')
    .where('factid', factid)
    .then(data => {
        if (data[0].users.length === 1) { // The fact has only one user
            db('facts')
            .where('factid', factid)
            .del()
            .catch(err => res.status(400).json(`Unable to delete: ${err}`));
        } else { // The fact has more than one user
            db('facts')
            .where('factid', factid)
            .update({
                users: db.raw('array_remove(users, ?)', [userid])
            })
            .catch(err => res.status(400).json('Unable to update the FACTS table'));
        }
        db('users')
        .where('id', userid)
        .update({
            favoritefacts: db.raw('array_remove(favoritefacts, ?)', [factid])
        })
        .then(resp => res.json(resp))
        .catch(err => res.status(400).json('Unable to update the USERS table'));
    })
})



// V  / => Get users
// V  /signin => Log in to account
// V  /register => Register new account
// V  /profile/:id => Get user profile // Probably removed in the future
// V  /addFact => Get a fact from Chuck Norris API
// V  /getFavorites => Returns the array with favourite facts
// V  /addFavorite => Adds a new fact to the favourite facts array
// V  /removeFavorite => Removes a fact from the favourite facts array


app.listen(3001, () => {
    console.log('App is running successfully')
})
