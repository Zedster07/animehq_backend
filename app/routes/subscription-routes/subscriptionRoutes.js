const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const validationMiddleware = require('../../middlewares/validationMiddleware');

const router = express.Router();
// Controllers
const SubscriptionController = require('../../controllers/subscription-controllers/subscriptionController');
const MemberSubscriptionController = require('../../controllers/subscription-controllers/memberSubscriptionController');
//





const config = require('../../config/config');
const isAdmin = require('../../middlewares/isAdmin');
const isSubscriber = require('../../middlewares/isSubscriber');
router.use(config.routes.subscription.prefix , router);


router.post('/newplan', authMiddleware , isAdmin, validationMiddleware , SubscriptionController.createPlan);
router.post('/newfeature',authMiddleware , isAdmin, validationMiddleware , SubscriptionController.createFeature);
router.post('/associatepf',authMiddleware , isAdmin, validationMiddleware , SubscriptionController.associateFeatureToPlan);
router.post('/getplanfeatures', validationMiddleware , SubscriptionController.getPlanFeatures);



router.post('/subscribe',authMiddleware , validationMiddleware , MemberSubscriptionController.subscribe_user);
router.post('/abandon',authMiddleware , isSubscriber, validationMiddleware , MemberSubscriptionController.abandon_subscription);
router.post('/renew', authMiddleware , validationMiddleware , MemberSubscriptionController.renew_subscription );


router.post('/', authMiddleware , isAdmin,  validationMiddleware , MemberSubscriptionController.getSubscriptions );

router.get('/mysubscription', authMiddleware , validationMiddleware , MemberSubscriptionController.getMySubscription );

router.get('/:userId', authMiddleware , isAdmin, validationMiddleware , MemberSubscriptionController.getMemberSubscription );


module.exports = router;