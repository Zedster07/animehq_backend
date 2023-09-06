const CouponService = require("../../services/coupon-service/CouponService");
const PaymentsService = require("../../services/paymentServices/paymentService");
const SubscriptionsService = require("../../services/subscriptionServices/subscriptionService");
const { calculateTotalPrice } = require("../../utils");


class PaymentController {
    static async createOrder(req , res ) {
        try {
            const { subscription_id , duration , coupon } = req.body;
            const plan = await SubscriptionsService.getPlan(subscription_id);
            // res.status(200).json(cp);
            if(plan) {
                let total_price = await CouponService.applyCoupon(plan , coupon , duration);
                res.status(200).json([{
                    amount: {value: total_price.toFixed(2), currency_code: 'USD'},
                    description: plan.name
                }]);
            } else {
                res.status(400).json(false);
            }
        } catch (error) {
            console.log(error);
            res.status(400).json('Something went wrong');
        }
    }

    static async addPayment(req ,res)  {
        try {
            const { subscription_id , member_subscription_id , paymentMethod , coupon , amount , transaction_id } = req.body;

        } catch (error) {
            console.log(error);
            res.status(400).json('Something went wrong');
        }
    }

    static async deletePayment(req ,res)  {

    }

    static async getPayment(req ,res)  {

    }

    static async getPayments(req ,res)  {

    }

    static async getUserPayments(req , res) {

    }
}

module.exports = PaymentController;