const SubscriptionsService = require("../../services/subscriptionServices/subscriptionService");



/**
 * Controller class handling subscriptions-related functionalities.
 * @class
 */

class SubscriptionController {
    static async createPlan(req, res) {
        try {
            const {name , isRecommended, order, price, discounts} = req.body;
            await SubscriptionsService.newPlan(name , isRecommended, order, price, discounts);
            res.status(200).json('Added Success');
        } catch (error) {
            res.status(401).json('Something went wrong');
        }
    }

    static async createFeature(req, res) {
        try {
            const {name , description} = req.body;   
            await SubscriptionsService.newFeature(name , description);
            res.status(200).json('Added Success');
        } catch (error) {
            console.log(error);
            res.status(401).json('Something went wrong');
        }
    }

    static async associateFeatureToPlan(req, res) {
        try {
            const {planId , featureId} = req.body;   
            await SubscriptionsService.associateFeatureToPlan(planId , featureId);
            res.status(200).json('Association Success');
        } catch (error) {
            console.log(error);
            res.status(401).json('Something went wrong');
        }
    }

    static async getPlanFeatures(req , res) {
        try {
            const {planId} = req.body;   
            const result = await SubscriptionsService.getPlanFeatures(planId);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(401).json('Something went wrong');
        }
    }

    
}


module.exports = SubscriptionController;