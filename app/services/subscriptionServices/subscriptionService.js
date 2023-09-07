const {SubscriptionPlan, SubscriptionPlanFeatures} = require('../../config/database');



class SubscriptionsService {
    static async newPlan(name , isRecommended, order, price, discounts) {
        await SubscriptionPlan.create({name , isRecommended, planOrder:order, price, discounts})
    }
    static async newFeature(name , description) {
        await SubscriptionPlanFeatures.create({featureName:name , description});
    }

    static async associateFeatureToPlan(planId , featureId) {
        const plan = await SubscriptionPlan.findOne({where:{id:planId}});
        if(plan){
            const feature = await SubscriptionPlanFeatures.findOne({where:{id: featureId}});
            if(feature) {
                plan.addSubscriptionPlanFeatures(feature);
            }
        }
    }

    static async getPlanFeatures(planId) {
        const plan = await SubscriptionPlan.findOne({where:{id:planId}});
        if(plan){
            return await plan.getSubscriptionPlanFeatures();
        }
    }

    static async getPlan(planId) {
        return await SubscriptionPlan.findOne({where:{id:planId}});
    }

    static async getPlanByName(name) {
        return await SubscriptionPlan.findOne({where:{name}});
    }
}

module.exports = SubscriptionsService;