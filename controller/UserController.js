const {user} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('../helper/jwt');

module.exports = class {
    static async getAllUsers(req, res) {
        try {
            const result = await user.findAll()
            res.status(200).json({
                status: 200,
                data: result
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    static async getOneUser(req, res) {
        try {
            const result = await user.findOne({where: {id: req.params.id}})
            res.status(200).json({
                status: 200,
                data: result
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async addUser(req, res) {
        const hashing = await bcrypt.hashSync(req.body.password, 10)
        try {
            const result = await user.create({...req.body, type: "member"})
            res.status(201).json({
                status: 201,
                message: "user data has been created",
                data: result
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    static async addUserAdmin(req, res) {
        try {
            const result = await user.create({...req.body, type: "admin"})
            res.status(201).json({
                status: 201,
                message: "user admin data has been created",
                data: result
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    static async deleteUser(req, res) {
        try {
            const result = await user.destroy({where: {id: req.params.id}})
            res.status(201).json({
                status: 201,
                message: "user data has been deleted",
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async login(req, res, next) {
        try {
            const result = await user.findOne({ where: { email: req.body.email } })

            if(!result) {
                res.status(404).json({
                    status: 404,
                    message: "user not found"
                })
            }

            const isPasswordValid = await bcrypt.compareSync(req.body.password, result.password)
            console.log(result.password);
            if (!isPasswordValid) {
                res.status(404).json({
                    status: 404,
                    message: "password not match"
                })
            }

            const token = jwt.generateToken({ email: result.email, password: result.password, type: result.type });
            const secureUser = result.dataValues
            delete secureUser.password
            res.status(200).json({
                status: 200,
                message: "user found",
                data: {
                    secureUser,
                    token: token
                }
                
            })

        } catch (error) {
            res.status(400).send(error)
        }
    }

    static async checkUserLogin(req, res) {
        try {
            res.status(202).json(req.userLogin)
        } catch (error) {
            res.status(404).send(error)
        }
    }
}