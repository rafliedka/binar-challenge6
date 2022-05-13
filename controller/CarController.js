const { car } = require('../models');
const auth = require('../middleware/authAdmin');

module.exports = class {
    static async getCar(req, res){
        try {
            const result = await car.findAll({where: {availavle: true}})
            res.status(201).json({
                status: 201,
                data: result
            })
        } catch (error) {
            res.status(400).send(error)
        }
    }
    
    static async getOneCar(req, res) {
        try {
            const result = await car.findOne({where: {id: req.params.id}})
            res.status(201).json({
                status: 201,
                data: result
            })
        } catch (error) {
            res.status(400).send(error)
        }
    }
    
    static async addCar(req, res) {
        try {
            const result = await car.create({...req.body, createdBy: req.userLogin.id})

            res.status(201).json({
                status: 201,
                message: "car data has beem created",
                data: result
            })
        } catch (error) {
            res.status(400).send(error)
        }
    }
    
    static async updateCar(req, res) {
        try {
            const result = await car.update({...req.body, updatedBy: req.userLogin.id}, { where: { id: req.params.id } })
            
            res.status(201).json({
                status: 201,
                message: "car data has been update",
                data: result.body
            })
        } catch (error) {
            res.status(400).send(error)
        }
    }
    
    static async deleteCar(req, res) {
        try {
            const result = await car.update({deletedBy: req.userLogin.id, availavle: false}, { where: { id: req.params.id } })
            
            res.status(201).json({
                status: 201,
                message: "car data has beem deleted",
                data: result.body
            })
        } catch (error) {
            res.status(400).send(error)
        }
    }
}