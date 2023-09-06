const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const validationMiddleware = require('../../middlewares/validationMiddleware');
const isAdmin = require('../../middlewares/isAdmin');

const config = require('../../config/config');
const PaymentController = require('../../controllers/payment-controllers/paymentController');

const router = express.Router();
router.use(config.routes.payment.prefix , router);

module.exports = router;



router.post('/createOrder', authMiddleware , validationMiddleware ,  PaymentController.createOrder );

router.post('/addPayment', authMiddleware , validationMiddleware , PaymentController.addPayment);


router.post('/deletePayment', authMiddleware , isAdmin, validationMiddleware , PaymentController.deletePayment);


router.post('/getPayment', authMiddleware , validationMiddleware , PaymentController.getPayment);
router.get('/user', authMiddleware , validationMiddleware , PaymentController.getUserPayments);
router.get('/', authMiddleware , isAdmin, validationMiddleware , PaymentController.getPayments);