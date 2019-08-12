module.exports = {
    getUserInfo: async (req, res) => {
        const db = req.app.get('db');
        const { user_id } = req.params;

        const [userInfo] = await db.get_user_info([user_id]);
        res.status(200).send(userInfo);
    },

    updateUserBio: async (req, res) => {
        const db = req.app.get('db');
        const { user_id } = req.params;
        const { biography } = req.body;

        const newBio = await db.update_user_bio([user_id, biography]);
        res.status(200).send(newBio);
    },

    updateUserPic: async (req, res) => {
        const db = req.app.get('db');
        const { user_id } = req.params;
        console.log(req.body)
        const { profile_picture } = req.body;
        console.log(profile_picture)

        const [newProfPic] = await db.update_profile_picture([user_id, profile_picture]);
        console.log(newProfPic);
        res.status(200).send(newProfPic);
    }
}