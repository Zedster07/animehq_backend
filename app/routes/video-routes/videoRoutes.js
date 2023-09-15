const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const validationMiddleware = require('../../middlewares/validationMiddleware');
const VideoController = require('../../controllers/video-controller/videoController');

const router = express.Router();


router.get('/stream/:dcpath',VideoController.streamFile);

router.get('/download/:dcpath',VideoController.downloadFile);

module.exports = router;