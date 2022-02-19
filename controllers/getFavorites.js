const handleGetFavorites = (req, res, db) => {
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
}

module.exports = {
    handleGetFavorites: handleGetFavorites
};