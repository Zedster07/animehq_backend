const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const validationMiddleware = require('../../middlewares/validationMiddleware');

const config = require('../../config/config');
const isAdmin = require('../../middlewares/isAdmin');
const CouponController = require('../../controllers/coupon-controllers/couponController');

const router = express.Router();

router.use(config.routes.coupon.prefix , router);


router.post('/create', authMiddleware , isAdmin, validationMiddleware , CouponController.createCoupon);
router.post('/update', authMiddleware , isAdmin, validationMiddleware , CouponController.updateCoupon);
router.post('/get', authMiddleware , isAdmin, validationMiddleware , CouponController.getCoupon);
router.post('/apply', authMiddleware , isAdmin, validationMiddleware , CouponController.applyCoupon);

module.exports = router;