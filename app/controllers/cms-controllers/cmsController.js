const CmsService = require("../../services/cms-service/CmsService");

class CmsController {
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
            res.status(500).json('Something went wrong');
        }
    }

    static async updateMessage(req,res) {
        try {
            const {data} = req.body;
            const result = await CmsService.updateMessage(data);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json('Something went wrong');
        }
    }
}

module.exports = CmsController;