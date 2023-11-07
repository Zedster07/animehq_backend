const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const validationMiddleware = require('../../middlewares/validationMiddleware');
const isAdmin = require('../../middlewares/isAdmin');

const config = require('../../config/config');
const CmsController = require('../../controllers/cms-controllers/cmsController');

const router = express.Router();

router.use(config.routes.cms.prefix , router);

router.post('/addMessages' , validationMiddleware ,  CmsController.addMessage );

router.post('/updateMessages' , validationMiddleware , CmsController.updateMessage);

router.post('/getMessages' , validationMiddleware , CmsController.getMessage);

router.post('/getUnseen' , validationMiddleware , CmsController.getUnseen);

module.exports = router;

