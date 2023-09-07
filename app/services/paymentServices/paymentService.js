

const { Payment, SubscriptionPlan, User, MemberSubscription } = require('../../config/database');
const MemberSubscriptionService = require('../subscriptionServices/memberSubscriptionService');
const SubscriptionsService = require('../subscriptionServices/subscriptionService');

class PaymentsService {
    
    static async addPayment({ UserId ,subscription_id , member_subscription_id , paymentMethod , coupon , amount , transaction_id , ip_address }){
        const payment = await Payment.create({
            amount,
            paymentStatus:'completed',
            payment_gateway:paymentMethod,
            discount_code:coupon,
            transaction_id,
            currency: 'USD',
            ip_address,
            MemberSubscriptionId:member_subscription_id,
            SubscriptionPlanId: subscription_id,
            UserId
        });
    }

    static async getPaymentById() {
        return await Payment.findOne({
            where:{id}
        });
    }

    static async getPayments() {
        return await Payment.findAll();
    }

    static async getMemberPayment(UserId) {
        return await Payment.findAll({
            where:{
                UserId
            },
            include: [{ model: SubscriptionPlan }, { model: User }, {model: MemberSubscription}]
        })
    }
}


module.exports = PaymentsService;