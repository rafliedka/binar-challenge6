const jwt = require('../helper/jwt');
const {user} = require('../models');

module.exports = async (req, res, next) => {
    try {
        console.log(req.body);
        const payload = await jwt.verifyToken(req.headers.token)
        if (!payload) {
            res.status(404).json({message: "user not found"})
        } else if (payload.type !== "superadmin") {
            res.status(401).send({message: "not authorize"})
        }

        const result = await user.findOne({ where: { email: payload.email, password: payload.password, type: payload.type } })
        if (!result) {
            res.status(404).json({message: "user not found"})
        } else {
            req.userLogin = result.dataValues;
            
            next()
        }

    } catch (error) {
        res.status(500).send(error)
    }
}