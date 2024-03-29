const CmsService = require("../../services/cms-service/CmsService");

class CmsController {



    static async getUnseen(req,res) {
        try {
            const {data} = req.body;
            const result = await CmsService.getUnseenCount(data);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json('Something went wrong');
        }
    }

    static async getSenders(req,res) {
        try {
            const {type} = req.body;
            const result = await CmsService.getSenders(type);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json('Something went wrong');
        }
    }

    static async addMessage(req, res) {
        try {
            const {data} = req.body;
            const result = await CmsService.addMessage(data);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json('Something went wrong');
        }
    }

    static async getMessage(req,res) {
        try {
            const {data} = req.body;
            const result = await CmsService.getMessage(data);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json('Something went wrong');
        }
    }

    static async updateMessage(req,res) {
        try {
            const {data} = req.body;
            console.log(data);
            const result = await CmsService.updateMessage(data);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json('Something went wrong');
        }
    }
}

module.exports = CmsController;