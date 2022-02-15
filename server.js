const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
                `A cab driver in Paris received a near fatal roundhouse to his face from Chuck Norris. It was Chuck Norris' way of saying Hi in French.`,
                `Chuck Norris once ran a quarter mile in 3.7 seconds, while pulling an 18-wheeler in wet cement.`            
            ]
        },
        {
            id: '1',
            name: 'Jane',
            email: 'jane@gmail.com',
            password: 'jane',
            joined: new Date(),
            favoriteFacts: [
                `A cab driver in Paris received a near fatal roundhouse to his face from Chuck Norris. It was Chuck Norris' way of saying Hi in French.`,
                `Chuck Norris once ran a quarter mile in 3.7 seconds, while pulling an 18-wheeler in wet cement.`            
            ]
        },
        {
            id: '2',
            name: 'Gary',
            email: 'gary@gmail.com',
            password: 'gary',
            joined: new Date(),
            favoriteFacts: [
                `A cab driver in Paris received a near fatal roundhouse to his face from Chuck Norris. It was Chuck Norris' way of saying Hi in French.`,
                `Chuck Norris once ran a quarter mile in 3.7 seconds, while pulling an 18-wheeler in wet cement.`            
            ]
        }
    ]
}
//Get users
app.get('/', (req, res) => {
    res.send(database.users);
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

app.get('/getFavorites/:userID', (req, res) => {
    const { userID } = req.params;
    res.json(database.users[userID].favoriteFacts); //res.json() is almost equal to res.send()
})


app.post('/addFavorite/:userID', (req, res) => {
    const { userID } = req.params;
    const { fact } = req.body;
    database.users[userID].favoriteFacts.push(fact)
    res.json(database.users[userID].favoriteFacts); //res.json() is almost equal to res.send()
})

app.delete('/removeFavorite/:userID', (req, res) => {
    const { userID } = req.params;
    const { factID } = req.body;
    let favoriteFacts = database.users[userID].favoriteFacts;
    database.users[userID].favoriteFacts = favoriteFacts.splice(factID, 1)
    res.json(database.users[userID].favoriteFacts); //res.json() is almost equal to res.send()
})



// V  / => Get users
// V  /signin => Log in to account
// V  /register => Register new account
// V  /profile/:id => Get user profile // Probably removed in the future
// V  /getFavorites => Returns the array with favourite facts
// V  /addFavorite => Adds a new fact to the favourite facts array
// V  /removeFavorite => Removes a fact from the favourite facts array


app.listen(3001, () => {
    console.log('App is running successfully')
})
