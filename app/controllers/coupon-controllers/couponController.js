const CouponService = require("../../services/coupon-service/CouponService");
const SubscriptionsService = require("../../services/subscriptionServices/subscriptionService");

class CouponController {
    static async createCoupon(req , res) {
        try {
            const {code , type , value, status , startDate , endDate , planIncluded, maxUses , maxUsesPerUser} = req.body;
            await CouponService.createCoupon({code , type , value, status , startDate , endDate , planIncluded, maxUses , maxUsesPerUser});
            res.status(200).json('added success');
        } catch (error) {
            console.log(error);
            res.status(400).json('something went wrong');
        }
    }

    static async updateCoupon(req , res) {
        try {
            const {code , type , value, status , startDate , endDate , planIncluded, maxUses , maxUsesPerUser}  = req.body;
            await CouponService.updateCoupon({code , type , value, status , startDate , endDate , planIncluded, maxUses , maxUsesPerUser} );
            res.status(200).json('update success');
        } catch (error) {
            console.log(error);
            res.status(400).json('something went wrong');
        }
    }

    static async getCoupon(req , res) {
        try {
            const {code} = req.body;
            const coupon = await CouponService.getCouponByCode(code);
            res.status(200).json(coupon);
        } catch (error) {
            console.log(error);
            res.status(400).json('something went wrong');
        }
    }

    static async applyCoupon(req , res) {
        try {
            const { planId , code , duration } = req.body;
            const plan = await SubscriptionsService.getPlan(planId);
            const result = await CouponService.applyCoupon(plan , code , duration);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json('something went wrong');
        }
    }
}

module.exports = CouponController;