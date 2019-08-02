const bcrypt = require('bcrypt');

module.exports = {
    userSession: (req, res) => {
        res.status(200).send(req.session.user)
    },

    register: async (req, res) => {
        const db = req.app.get('db');
        const {username, password, email} = req.body;

        const foundUser = await db.find_username_email([username,email]).catch(err => console.log(err));
        if (foundUser.length) {
            res.status(409).send('Registration conflict occurred, enter different username or email');
        } else {
            const saltRounds = 12;

            bcrypt.genSalt(saltRounds).then(salt => {
                bcrypt.hash(password, salt).then(hashedPassword => {
                    db.create_user([username, hashedPassword, email]).then(([newUser]) => {
                        req.session.user = newUser;
                        res.status(200).send(req.session.user);
                    })
                })
            })
        }
    },

    login: async (req, res) => {
        const db = req.app.get('db');

        let {password, email} = req.body;
        const foundUser = await db.find_user_by_email([email]).catch(err => console.log(err));
        if (!foundUser.length) {
            res.status(401).send('Login credentials resulted in denial of access')
        } else {
            const matchedPasswords = await bcrypt
            .compare(password, foundUser[0].password)

            if (matchedPasswords) {
                req.session.user = {
                    username: foundUser[0].username,
                    user_id: foundUser[0].user_id,

                }
                res.status(200).send(req.session.user)
            } else {
                res.status(401).send('Login credentials resulted in denial of access')
            }
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.status(200).send([]);
    }
}