const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const axios = require('axios');
// const knex = require('knex');

// const { database } = require('pg/lib/defaults');

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '0',
            name: 'Robert',
            email: 'robert@gmail.com',
            password: 'robert',
            joined: new Date(),
            favoriteFacts: [
                {
                    id: 'asdasdasggf',
                    value: `A cab driver in Paris received a near fatal roundhouse to his face from Chuck Norris. It was Chuck Norris' way of saying Hi in French.`
                },
                {
                    id: 'qwepoopii',
                    value: `Chuck Norris once ran a quarter mile in 3.7 seconds, while pulling an 18-wheeler in wet cement.`            
                }
            ]
        },
        {
            id: '1',
            name: 'Jane',
            email: 'jane@gmail.com',
            password: 'jane',
            joined: new Date(),
            favoriteFacts: [
                {
                    id: 'asdasdasggf',
                    value: `A cab driver in Paris received a near fatal roundhouse to his face from Chuck Norris. It was Chuck Norris' way of saying Hi in French.`
                },
                {
                    id: 'qwepoopii',
                    value: `Chuck Norris once ran a quarter mile in 3.7 seconds, while pulling an 18-wheeler in wet cement.`            
                }
            ]
        },
        {
            id: '2',
            name: 'Gary',
            email: 'gary@gmail.com',
            password: 'gary',
            joined: new Date(),
            favoriteFacts: [
                {
                    id: 'asdasdasggf',
                    value: `A cab driver in Paris received a near fatal roundhouse to his face from Chuck Norris. It was Chuck Norris' way of saying Hi in French.`
                },
                {
                    id: 'qwepoopii',
                    value: `Chuck Norris once ran a quarter mile in 3.7 seconds, while pulling an 18-wheeler in wet cement.`            
                }
            ]
        }
    ]
}

// const db = knex({
//     client: 'pg',
//     connection: {
//       host : '127.0.0.1',
//       port : 5432,
//       user : 'postgres',
//       password : 'perazarivera1998',
//       database : 'chuckDB'
//     }
// });

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
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json(database.users[0]);        
    } else {
        res.status(400).json('error logging in');
    }
})

//Register new account
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash);
    // });
    const newUser = {
        id: (Number(database.users[database.users.length-1].id) + 1).toString(),
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    }
    database.users.push(newUser)
    res.json(database.users[database.users.length-1]); //res.json() is almost equal to res.send()
})

app.get('/getFavorites', (req, res) => {
    // const { userID } = req.params;
    res.json(database.users[0].favoriteFacts); //res.json() is almost equal to res.send()
})


app.post('/addFavorite', (req, res) => {
    // const { userID } = req.params;
    const { fact } = req.body;
    database.users[0].favoriteFacts.unshift(fact)
    res.json(database.users[0].favoriteFacts); //res.json() is almost equal to res.send()
})

app.delete('/removeFavorite', (req, res) => {
    // const { userID } = req.params;
    const { id } = req.body;
    let facts = database.users[0].favoriteFacts.filter(fact => fact.id !== id)
    database.users[0].favoriteFacts = facts
    res.json(database.users[0].favoriteFacts); //res.json() is almost equal to res.send()
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
