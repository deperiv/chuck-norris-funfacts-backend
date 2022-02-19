const handleRemoveFavorite = (req, res, db) => {
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
}

module.exports = {
    handleRemoveFavorite: handleRemoveFavorite
};