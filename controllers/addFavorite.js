const handleAddFavorite = (req, res, db) => {
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
}

module.exports = {
    handleAddFavorite: handleAddFavorite
};