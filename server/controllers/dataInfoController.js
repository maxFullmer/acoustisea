module.exports = {
    getDataInfo: async (req, res) => {
        const db = req.app.get('db');
        // either from req.session or req.body
        const { user_id } = req.params;

        const userDataInfo = await db.get_user_data_info([user_id]).catch(err => console.log(err));
        console.log(userDataInfo)
        res.status(200).send(userDataInfo);
    },

    addDataInfo: async (req, res) => {
        const db = req.app.get('db');
        const { username, user_id, title, file_type, subtopicArray, dataSummary } = req.body;
        const [newPost] = await db.add_data_info([username, user_id, title, file_type, ...subtopicArray, dataSummary])
        .catch(err => console.log(err));
        console.log(newPost)
        res.status(200).send(newPost)
    }
}