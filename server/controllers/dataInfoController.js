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
    //     const { user_id, title, file_type, subtopicArray, dataSummary, data_id} = req.body;
    // },

    deleteUserDataInfo: async (req, res) => {
        const db = req.app.get('db');
        const { user_id, data_id } = req.body;
        
        const diminishedUserData = await db.delete_user_data_info([user_id, data_id])
        .catch(err => console.log(err));

        res.status(200).send(diminishedUserData)
    },

    getSubtopicDataInfo: async (req, res) => {
        const db = req.app.get('db');
        const { subtopicSelected } = req.params;
        console.log(subtopicSelected)

        //error within sql statement VVV
        const subtopicData = await db.get_subtopic_data_info([subtopicSelected])
        .catch(err => console.log(err));

        const publicData = subtopicData.filter(element => {
            console.log(element.subtopicSelected)
            return element[subtopicSelected] === true
        })
        
        // console.log(subtopicData)
        // console.log(publicData)

        res.status(200).send(publicData);
    }
}