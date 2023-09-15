// services/userService.js
const UserService = require('../../services/auth-service/userServices');
const bcrypt = require('bcrypt');
const utils = require('../../utils');
const config = require('../../config/config');
const TokenService = require('../../services/auth-service/tokensService');
const { dataTypes } = require('../../config/requestsValidation');



/**
 * Controller class handling user-related functionalities.
 * @class
 */

class UserController {
  
  
  /**
   * Register a new user.
   * @function
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  
  static async register(req, res) {
    // #swagger.tags = ['Users']

    const { username, email, password } = req.body;
    try {
      let result = await UserService.createUser({username, email, password });
      res.status(200).json(result);
    } catch (error) {
      switch (error.message) {
        case 'emailExists':
          res.status(400).json({ error: 'Email already exists' });
          break;

        case 'usernameExists':
          res.status(400).json({ error: 'username already exists' });
          break;

        default:
          res.status(500).json({ error: 'An error occurred' });
          break;
      }
    }
  };


  /**
   * Log in a user.
   * @function
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  static async login(req, res){
    // #swagger.tags = ['Users']
    try {
      const { username, password } = req.body;
      const user = await UserService.getUserByName(username);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if(user.isDeleted) {
        res.status(400).json({ error: 'Account Deleted' });
      } else {
        if(user.isDeactivated) {
          UserService.deactivateAccount(user.id , false);
        }
        
        let result = await UserService.loginUser(user.id, {ip:req.ip , device : utils.getDevice(req.useragent.source)});
        res.cookie("fdm", result.refresh, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({token: result.token, user});
      }
      

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };


  /**
   * Generate a password reset token for a user.
   * @function
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  static async generatePasswordResetToken(req, res){
    // #swagger.tags = ['Users']
    try {
      const { email } = req.body;
      const user = await UserService.getUserByEmail(email);
      if(user){
        let isValid = false;
        const check = await TokenService.userSessionExists(user.id, config.constants.RESET_PASS_SECRET);
        if(check){
           isValid = await TokenService.validateToken(config.constants.RESET_PASS_SECRET, check.tvalue);
        }

        if(check && isValid) {
          res.status(200).json({token:check.tvalue});
        } else {
          if(check) {
            TokenService.deleteSession(check.session);
          }
          const newSession = await TokenService.getNextSession();
          const device = utils.getDevice(req.useragent.source);
          const passToken = await TokenService.generateToken( user.id , config.constants.RESET_PASS_SECRET, newSession);
          await TokenService.storeToken( config.constants.RESET_PASS_SECRET , user.id , newSession , passToken , null , req.ip , device);
          res.status(200).json({token:passToken});
        }
      } else {
        res.status(400).json({message:"Email not found!"});
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("Something Wrong happened");
    }
  }

  /**
   * Log out a user session.
   * @function
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  static async logout(req, res) {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    try {
      await UserService.logOutSession(req.session);
      res.status(200).json({message: "Logged Out"});
    } catch (error) {
      switch (error.message) {
        case 'sessionNotFound':
          res.status(500).json({message: "Session not found!"});
          break;
      
        default:
          res.status(500).json({message: "Something went wrong"});
          break;
      }
      
    }
    
  }


  /**
   * Retrieve a list of users.
   * @function
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  static async getUsers(req, res) {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    try {
      const users = await UserService.getUsers();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error retrieving users' });
    }
  }

  /**
   * Reset a forgotten password.
   * @function
   * @async
   * @param {object} req - Express request object { new_password } .
   * @param {object} res - Express response object .
   */
  static async forgotPassword(req , res) {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    try {
      const user = req.user;
      const { new_password } = req.body;
      await UserService.updatePassword(user.id , new_password);
      await TokenService.deleteSession(req.session);
      res.status(200).json({message: "Updated!"});
    } catch (error) {
      console.log(error);
      res.status(401).json({message: "Something wrong happened!"});
    }

  }


  /**
   * Reset user's password.
   * @function
   * @async
   * @param {object} req - Express request object {current_password , new_password } .
   * @param {object} res - Express response object .
   */
  static async resetpassword(req, res) {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    try {
      
      const user = req.user; 
      const {current_password , new_password } = req.body;
      
      const validPassword = await bcrypt.compare(current_password, user.password);

      if (!validPassword) {
        return res.status(400).json({ error: 'Password Incorrect!' });
      }

      await UserService.updatePassword(user.id , new_password);
      res.status(200).json({message: "Updated!"});
      

    } catch (error) {
      
      res.status(500).json({message: "Something wrong happened!"});
    }
    
  }

    /**
   * Deactivate user's account.
   * @function
   * @async
   * @param {object} req - Express request object { user , session } .
   * @param {object} res - Express response object .
   */
  static async deactivateAccount(req , res) {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    try {
      await UserService.deactivateAccount(req.user.id , true);
      await UserService.logOutSession(req.session);
      res.status(200).json({message: "deactivated!"});
    } catch (error) {
      switch (error.message) {
        case 'userNotFound':
          res.status(404).json("User Not Found");
          break;

        default:
          res.status(500).json("Something Wrong happened");
          break;
      }
      
    }
    
  }



    /**
   * Soft delete a user's account.
   * @function
   * @async
   * @param {object} req - Express request object { user , session } .
   * @param {object} res - Express response object .
   */
  static async deleteAccount(req , res) {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    try {
      await UserService.deleteAccount(req.user.id);
      await UserService.logOutSession(req.session);
      res.status(200).json({message: "deleted!"});
    } catch (error) {
      switch (error.message) {
        case 'userNotFound':
          res.status(404).json("User Not Found");
          break;
          
        default:
          res.status(500).json("Something Wrong happened");
          break;
      }
    }
    
  }


  /**
   * Verify a user's email address using a verification token.
   * @function
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  static async verifyEmail(req,res) {
    // #swagger.tags = ['Users']
    
    try {
      const token = req.params.token;
      const decodedToken = TokenService.validateToken(config.constants.EMAIL_SECRET , token);
      if(decodedToken.userId == req.user.id) {
        if(req.user.emailVerified){
          res.status(200).json({message: "Email already verified!"});
        } else {
          await UserService.verifyEmail(req.user.id , token);
          res.status(200).json({message: "Verification Successfull"});
        }
      } else {
        res.status(401).json("Unauthorized");
      }
      
    } catch (error) {
      switch (error.message) {
        case 'userNotFound':
          res.status(404).json("User Not Found");
          break;
          
        default:
          res.status(500).json("Something Wrong happened");
          break;
      }
    }
  }



  /**
   * Generate an email verification token. 
   * @function
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  static async generateEmailVerificationToken(req, res){
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    try {
      if(!req.user.emailVerified) {
        const newSession = await TokenService.getNextSession();
        const emailToken = await TokenService.generateToken(req.user.id, config.constants.EMAIL_SECRET, newSession);
        const device = utils.getDevice(req.useragent.source);
        await TokenService.storeToken( config.constants.EMAIL_SECRET , req.user.id , newSession , emailToken ,null , req.ip , device );
        res.status(200).json({token:emailToken});
      } else {
        res.status(200).json({message: "Email already verified!"});
      }

    } catch (error) {
      switch (error.message) {
        case 'userNotFound':
          res.status(404).json("User Not Found");
          break;
          
        default:
          res.status(500).json("Something Wrong happened");
          break;
      }
    }
    
  }

  
  /**
   * Logout a specific user session by session_id
   * @function
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  static async logOutSession(req , res) {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    try {
      await UserService.logOutSession(req.body.session);
      res.status(200).json({message: "Logged Out!"});
    } catch (error) {
      switch (error.message) {
        case 'sessionNotFound':
          res.status(404).json("Session Not Found");
          break;
          
        default:
          res.status(500).json("Something Wrong happened");
          break;
      }
    }
  }


  /**
   * Logout all user's sessions except the currently used session.
   * @function
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  static async logoutEverywhere(req ,res){
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    try {
      await TokenService.deleteAllExceptOne(req.session , req.user.id );
      res.status(200).json({message: "Logged Out!"});
    } catch (error) {
      console.log(error);
      res.status(500).json("Something Wrong happened");
    }
  }


  /**
   * Update a user's profile information.
   * @function
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  static async updateProfile(req, res) {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    try{
      const { fname, lname, dob, gender, mobile, profilePicture } = req.body;
      const id = req.user.id;
      await UserService.updateProfile({ fname, lname, dob, gender, mobile, profilePicture } , id); 
      res.status(200).json({message: "Profile Updated!"});
    } catch(error) {
      switch (error.message) {
        case 'userNotFound':
          res.status(404).json("User Not Found");
          break;
          
        default:
          res.status(500).json("Something Wrong happened");
          break;
      }
    }
    
  }


  /**
   * Refresh a user's authentication tokens.
   * @function
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  static async refreshToken(req, res) {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    try{
      const tokens = await UserService.refreshToken(req.user.id, req.session); 

      res.cookie("fdm", tokens.refresh, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json(tokens);
    } catch(error) {
      res.status(500).json("Something Wrong happened");
    }
  }



  static async getUserProfile(req, res) {

      try {
      let id = req.user.id;

      const result = await UserService.getUserById(id);
      if(result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({error: 'User not found'});
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  }


  /**
   * Get user information by user ID.
   * @function
   * @async
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  static async getUser(req , res) {
    // #swagger.tags = ['Users']
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    // req.params.id 
    try {
      let id = req.params.id;
      const error = utils.validateInput({value: id} , { name:'id', checkRegex: true, type: dataTypes.id });

      if(error){
        res.status(400).json(error);
      } else {
        const result = await UserService.getUserById(id);
        if(result) {
          res.status(201).json(result);
        } else {
          res.status(404).json({error: 'User not found'});
        }
        
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  }
  
}

module.exports = UserController;