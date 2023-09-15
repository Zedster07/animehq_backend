const bcrypt = require('bcrypt');
const config = require('../../config/config');
const TokenService = require('./tokensService');
const { User , Role , hasRole} = require('../../config/database');
const RoleService = require('./roleServices');


class UserService {

    static async createUser(user) {
        
        const { username, password, email } = user;
        const checkEmail = await this.getUserByEmail(email);
        if(checkEmail) {
            throw new Error('emailExists');
        }
        const checkUsername = await this.getUserByName(username);
        if(checkUsername) {
            throw new Error('usernameExists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, email });

        const role = await RoleService.getRoleByName('User');
        await hasRole.create({UserId: newUser.id,  RoleId: role.id});
        
        return { message: 'User registered successfully' };
    }

    static async deactivateAccount(id, isDeactivated) {
        const check = await getUserById(id);
        if(!check) {
            throw new Error('userNotFound');
        } else {
            await User.update({isDeactivated},{where:{id}});
        }
    }

    static async userHasRole(userId , roleId) {

    }

    static async addUserRole() {

    }

    /**
     * Delete a user's account.
     * @function
     * @async
     * @param {number} id - User ID.
     */
    static async deleteAccount(id) {
        const check = await this.getUserById(id);
        if (!check) {
            throw new Error('userNotFound');
        } else {
        await User.update({ isDeleted: true }, { where: { id } });
        }
    }


    /**
     * Verify user email with a token.
     * @function
     * @async
     * @param {number} id - User ID.
     * @param {string} token - the verification token sent by email.
     */
    static async verifyEmail(id, token){

        const emailSession = await TokenService.validateToken(config.constants.EMAIL_SECRET, token);
        if(emailSession) {
            TokenService.deleteSession(emailSession.session);
            await User.update({emailVerified: true} , {where:{id}});
        } else {
            throw new Error( "Invalid Token");
        }
        
    }

    /**
     * Logout a user's sepcific session.
     * @function
     * @async
     * @param {number} session - session id.
     */
    static async logOutSession(session){
        await TokenService.deleteSession(session);
    }


    /**
     * fetch a user by email.
     * @function
     * @async
     * @param {string} email - user's email.
     */
    static async getUserByEmail(email) {
        return await User.findOne({where:{email}});
    }


    /**
     * Login a User.
     * @function
     * @async
     * @param {number} id - the user's id
     * @param {object} req - the request object from which we extract ip and device
     */
    static async loginUser(id, req) {
        const {ip , device} = req;
        let newSession = await TokenService.getNextSession();
        while(!(await TokenService.createSession(newSession, config.constants.LOGIN_SECRET)) || !(await TokenService.createSession(newSession, config.constants.REFRESH_SECRET))){
            newSession = await TokenService.getNextSession();
        }
        const loginToken = await TokenService.generateToken(id , config.constants.LOGIN_SECRET, newSession);
        const refreshToken = await TokenService.generateToken(id , config.constants.REFRESH_SECRET, newSession);
        await TokenService.storeToken(config.constants.LOGIN_SECRET, id , newSession ,loginToken, null, ip, device ,false);
        await TokenService.storeToken(config.constants.REFRESH_SECRET, id , newSession ,refreshToken, null,ip, device, false);
        return {token: loginToken, refresh: refreshToken};
    }
    
    
    
    
    
    
    /**
     * Update a user's profile information.
     * @function
     * @async
     * @param {object} payload - Updated user profile data.
     * @param {number} id - User ID.
     */
    static async updateProfile(payload, id) {
        const check = await this.getUserById(id);
        if (!check) {
        throw new Error('userNotFound');
        } else {
        await User.update(payload, { where: { id } });
        }
    }

    
    
    /**
     * fetch a user by username.
     * @function
     * @async
     * @param {string} username - user's username.
     */
    static async getUserByName(username) {
        return await User.findOne({ where: { username } })
    }



    /**
     * fetch a user by id.
     * @function
     * @async
     * @param {number} id - user's id.
     */
    static async getUserById(id) {
        return await User.findOne({ where: { id }, 
            include: {
                model: Role,
                through: hasRole,
            }, 
        })
    }

    
    
    
    
    
    
    /**
     * Update a token value in a specific session.
     * @function
     * @async
     * @param {string} token - the new token value.
     * @param {string} type  - the token types in config.constants.
     * @param {number} session - the session id.
     */
    static async updateToken(token, type, session) {
        await TokenService.updateSession(session, type , token);
    }
    
    
    
    
    
    
    
   /**
   * Update a user's password.
   * @function
   * @async
   * @param {number} userid - User ID.
   * @param {string} password - New password.
   * @returns {boolean} - True if password is updated successfully.
   */
  static async updatePassword(userid, password) {
    const check = await this.getUserById(userid);
    if (!check) {
      throw new Error('userNotFound');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.update({ password: hashedPassword }, { where: { id: userid } });
      return true;
    }
  }
    
    
    
   /**
   * Refresh a user's authentication tokens.
   * @function
   * @async
   * @param {number} id - User ID.
   * @param {number} session - Session identifier (optional).
   * @returns {object} - New authentication tokens.
   */
  static async refreshToken(id, session = 0) {
    const check = await this.getUserById(id);
    if (!check) {
      throw new Error('userNotFound');
    } else {
      const token = await TokenService.generateToken(id, config.constants.LOGIN_SECRET, session);
      const refreshtoken = await TokenService.generateToken(id, config.constants.REFRESH_SECRET, session);
      await this.updateToken(token, refreshtoken, session);
      return { token, refresh: refreshtoken };
    }
  }
    
    
    /**
   * Retrieve a list of users.
   * @function
   * @async
   */
    static async getUsers() {
        try {
            const users = await User.findAll({include:{model:Role, through: hasRole}});
            return users;
        } catch (error) {
            throw new Error(error);
        }        
    }
}

module.exports = UserService;