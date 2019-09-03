module.exports = {
    getUserDataInfo: async (req, res) => {
        const db = req.app.get('db');
        const { user_id } = req.params;

        const userDataInfo = await db.get_user_data_info([user_id])
        .catch(err => console.log(err));
        
        res.status(200).send(userDataInfo);
    },

    addUserDataInfo: async (req, res) => {
        const db = req.app.get('db');
        const { username, user_id, title, file_type, subtopic, dataSummary, s3link, s3key } = req.body;
        
        const newPost = await db.add_user_data_info([username, user_id, title, file_type, subtopic, dataSummary, s3link, s3key])
        .catch(err => console.log(err));

        res.status(200).send(newPost[newPost.length - 1])
    },

    updateUserDataInfo: async (req, res) => {
        const db = req.app.get('db');
        const { title, file_type, subtopic, dataSummary, data_id, user_id } = req.body;

        const [updatedDataInfo] = await db.update_user_data_info([data_id, title, file_type, subtopic, dataSummary, user_id])
        .catch(err => console.log(err));

        res.status(200).send(updatedDataInfo)
    },

    deleteUserDataInfo: async (req, res) => {
        const db = req.app.get('db');
        const { user_id } = req.params;
        const { data_id } = req.query;
        
        const diminishedUserData = await db.delete_user_data_info([user_id, data_id])
        .catch(err => console.log(err));

        res.status(200).send(diminishedUserData)
    },

    getSubtopicDataInfo: async (req, res) => {
        const db = req.app.get('db');
        const { subtopicSelected } = req.params;

        const subtopicData = await db.get_subtopic_data_info([subtopicSelected])
        .catch(err => console.log(err));

        res.status(200).send(subtopicData);
    }
}