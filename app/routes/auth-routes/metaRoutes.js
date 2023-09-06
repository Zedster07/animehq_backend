const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const router = express.Router();


router.use(authMiddleware);

const config = require('../../config/config');
router.use(config.routes.meta.prefix , router);

router.get('/user', (req , res) => {
    // #swagger.tags = ['Meta']
    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */
    res.status(200).json(req.user);
});

router.get('/check', (req , res) => {
    // #swagger.tags = ['Meta']
    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */
    res.status(200).json();
});

module.exports = router;