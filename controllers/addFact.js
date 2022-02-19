const axios = require('axios');

const handleAddFact = (req, res) => {
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
}

module.exports = {
    handleAddFact: handleAddFact
};