// routes/userRoutes.js
const express = require('express');
const UserController = require('../../controllers/auth-controllers/userController');
const authMiddleware = require('../../middlewares/authMiddleware');
const validationMiddleware = require('../../middlewares/validationMiddleware');

const router = express.Router();

// payload validator
router.use(validationMiddleware);


const config = require('../../config/config');

router.use(config.routes.user.prefix , router);


router.post('/register', UserController.register);


// Login user , req : { username, password } 
router.post('/login', UserController.login);


// Request Token for password reset  , req : { email } 
router.post('/requestResetPassword', UserController.generatePasswordResetToken);



// request a refresh Token
router.get('/token/refresh', authMiddleware ,  UserController.refreshToken);

// Logout user
router.get('/logout', authMiddleware ,  UserController.logout);


// req { session }
router.post('/logoutSession', authMiddleware , UserController.logOutSession);


// Logout all sessions 
router.get('/logoutEverywhere', authMiddleware , UserController.logoutEverywhere);


// Request Token for password reset  , req : { new_password } 
router.post('/forgotPassword', authMiddleware , UserController.forgotPassword);

// reset password , req : { current_password , new_password }
router.post('/resetpassword', authMiddleware , UserController.resetpassword);


// Request Token for password reset 
router.get('/requestEmailVerification', authMiddleware,  UserController.generateEmailVerificationToken);


// Request Token for password reset  , req : { email } 
router.get('/verifyEmail/:token', authMiddleware , UserController.verifyEmail);


// Update user profile 
router.post('/update/' , authMiddleware , UserController.updateProfile);


// Delete Account
router.get('/deactivate', authMiddleware , UserController.deactivateAccount);


// Deactivate Account
router.get('/deleteAccount', authMiddleware , UserController.deleteAccount);





router.get('/profile', authMiddleware,  UserController.getUserProfile);



// get a User by id
router.get('/:id',   UserController.getUser);


// get all users 
router.get('/', UserController.getUsers);





module.exports = router;