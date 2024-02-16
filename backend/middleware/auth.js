const { getToken } = require("../auth/handleJwt");
const User = require("../model/user");

async function checkAuth(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        const id = getToken(token)
        if (id.id) {
            const user = await User.findById(id.id);
            if (user) {
                res.json({ msg: "authorized",user:id.id })
            } else {
                res.json({ msg: "unauthorized" })
            }
        } else {
            res.json({ msg: "unauthorized" })

        }
    } else {
        res.json({ msg: "unauthorized" })
    }
}

module.exports = {
    checkAuth
}