const MemberSubscriptionService = require("../../services/subscriptionServices/memberSubscriptionService");


/**
 * Controller class handling member-subscriptions-related functionalities.
 * @class
 */

class MemberSubscriptionController {
    static async subscribe_user(req ,res) {
        try {
            const { subscription_plan_id , duration } = req.body;
            await MemberSubscriptionService.subscribe( subscription_plan_id , req.user.id , duration );
            res.status(200).json('subscribed successfully');
        } catch (error) {
            console.log(error);
            res.status(401).json('something went wrong');
        }
    }

    static async abandon_subscription(req , res) {
        try {
            const {subscription_id} = req.body;
            await MemberSubscriptionService.abandon(subscription_id, req.user.id);
            res.status(200).json('abandoned successfully');
        } catch (error) {
            console.log(error);
            res.status(401).json('something went wrong');
        }
    }
    static async renew_subscription(req, res ){
        try {
            const {subscription_id} = req.body;
            await MemberSubscriptionService.renew(subscription_id, req.user.id);
            res.status(200).json('renewed successfully');
        } catch (error) {
            console.log(error);
            res.status(401).json('something went wrong');
        }
    }

    static async getSubscriptions(req , res) {
        try {
            const result = await MemberSubscriptionService.getSubscriptions(req.body?.args);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(401).json('something went wrong');
        }
    }

    static async getMemberSubscription(req , res) {
        try {
            const {userId} = req.params;
            const result = await MemberSubscriptionService.getMemberSubscription(userId);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(401).json('something went wrong');
        }
    }

    static async getMySubscription(req , res ) {
        try {
            const result = await MemberSubscriptionService.getMySubscription(req.user.id);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(401).json('something went wrong');
        }
    }
}


module.exports = MemberSubscriptionController;