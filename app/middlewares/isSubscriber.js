const MemberSubscriptionService = require("../services/subscriptionServices/memberSubscriptionService");


async function isSubscriber(req ,res , next) {
    try {
        const { user } = req;
        let granted = false;
        user.Roles.forEach( async role => {
            if(role.name == config.roles.subscriber) {
                const sub = await MemberSubscriptionService.getMemberSubscription(req.user.id);
                if(sub && sub.subscription_status == "active") {
                    req.subscription = sub;
                    granted = true;
                }   
            }
        });

        if( granted == true ) {
            next();
        } else {
            return res.status(403).json({ error: 'Forbidden: Higher Privilege Required' });
        }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Something went wrong' });
  }
}

module.exports = isSubscriber;