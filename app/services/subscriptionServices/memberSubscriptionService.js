const {MemberSubscription , User , SubscriptionPlan , hasRole } = require('../../config/database');
const UserService = require('../auth-service/userServices');
const { getExpirationDate } = require('../../utils');
const RoleService = require('../auth-service/roleServices');

class MemberSubscriptionService {
    static async subscribe( subscription_plan_id , user_id , duration , coupon = null)  {
        
        // Find the user and subscription plan
        const user = await User.findByPk(user_id);
        const subscriptionPlan = await SubscriptionPlan.findByPk(subscription_plan_id);

        // Set the associations between User and MemberSubscription, SubscriptionPlan and MemberSubscription
        if (user && subscriptionPlan) {
            const newSubscription = await MemberSubscription.create({
                startDate: new Date(), // Replace with the actual start date
                endDate: getExpirationDate(new Date(), duration), 
                months: duration,   
                discountCode: coupon
            });
            await user.addMemberSubscription(newSubscription);
            await subscriptionPlan.addMemberSubscription(newSubscription);

            const role = await RoleService.getRoleByName('Subscriber');
            await hasRole.create({UserId: user.id,  RoleId: role.id});
        }
    }

    static async abandon(SubscriptionPlanId  , userId) {
        await MemberSubscription.destroy({where:{userId,SubscriptionPlanId }});
        const role = await RoleService.getRoleByName('Subscriber');
        await hasRole.destroy({where:{UserId: userId,  RoleId: role.id}});
    }

    static async checkExpiration(member_sub_id) {
        const subscription = await MemberSubscription.findOne({where:{id: member_sub_id}});
        if (!subscription) {
            return false;
        }

        const currentDate = new Date();
        const expirationDate = new Date(subscription.endDate);

        if (currentDate > expirationDate) {
            await subscription.update({subscription_status: 'expired'},{where:{ id: member_sub_id}});
            const role = await RoleService.getRoleByName('Subscriber');
            await hasRole.destroy({where:{UserId: subscription.userId,  RoleId: role.id}});
        }
        return subscription;
    }

    static async renew(SubscriptionPlanId  , userId) {
        const sub = await MemberSubscription.findOne({where:{userId,SubscriptionPlanId }});
        if(sub) {
            await sub.update({
                startDate: new Date(),
                endDate: getExpirationDate(new Date(), sub.months),
                subscription_status: 'active'
            });
        }
    }

    static async getSubscriptions(args) {
        let whereClause = {};
        if(args) {
            if(args['subscription_status']) {
                whereClause["subscription_status"] = args['subscription_status'];
            }
        }
        const subscriptions = await MemberSubscription.findAll({
            where: whereClause,
            include: [{ model: User }],
        });

        return subscriptions;
    }
    static async getMemberSubscription(user_id) {
        const subscription = await MemberSubscription.findOne({
            where: {
                userId: user_id,
                subscription_status: 'active'
            },
            include: [{ model: User }],
        });

        
        return await this.checkExpiration(subscription.id) ;
    }

    static async getMySubscription(user_id) {
        const subscription = await MemberSubscription.findOne({
            where: {
                userId: user_id,
            },
            include: [{ model: User }],
        });

        return subscription;
        // return await this.checkExpiration(subscription.id) ;
    }
}

module.exports = MemberSubscriptionService;