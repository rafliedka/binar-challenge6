const jwt = require('../helper/jwt');
const {user} = require('../models');

module.exports = async (req, res, next) => {
    try {
        const payload = await jwt.verifyToken(req.headers.token)
        if (!payload) {
            res.status(404).json({message: "user not found"})
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