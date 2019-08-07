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
        const { username, user_id, title, file_type, subtopicArray, dataSummary } = req.body;
        console.log(req.body)
        const newPost = await db.add_user_data_info([username, user_id, title, file_type, ...subtopicArray, dataSummary])
        .catch(err => console.log(err));
        console.log(newPost)
        res.status(200).send(newPost[newPost.length - 1])
    },

    // updateDataInfo: async (req, res) => {
    //     const db = req.app.get('db');
    //     const { user_id, }
    // }

    getSubtopicDataInfo: async (req, res) => {
        const db = req.app.get('db');
        const { subtopicSelected } = req.params;
        console.log(subtopicSelected)

        //error within sql statement VVV
        const subtopicData = await db.get_subtopic_data_info([subtopicSelected])
        .catch(err => console.log(err));
        console.log(subtopicData)

        res.status(200).send(subtopicData);
    }
}