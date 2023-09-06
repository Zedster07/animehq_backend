const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const {sequelize , Tokens} = require('../../config/database');
class TokenService {


    static getTypeSecret(type) {
        
        let pass = '';
        let exp = '';
        switch (type) {
            case config.constants.LOGIN_SECRET:
                pass = config.secret;
                exp = '1h';
                break;
            case config.constants.REFRESH_SECRET:
                pass = config.refreshSecret;
                exp = '7d';
                break;
            case config.constants.EMAIL_SECRET:
                pass = config.vemailSecret;
                exp = '7d';
                break;
            case config.constants.RESET_PASS_SECRET:
                pass = config.resetPassSecret;
                exp = '1d';
                break;
            default:
                break;
        }

        return {pass ,exp};
    }


    static async checkLogin(session , type , token) {
        return await Tokens.findOne({where: {session , ttype: type, tvalue: token}});
    }

    static async generateToken( userid , type , session ) {
        
        const { pass, exp } = this.getTypeSecret(type);

        const token = jwt.sign({ userId: userid, session }, pass , {
            expiresIn: exp, 
        });

        return token;
    }

    static async validateToken(type, token) {
        const { pass } = this.getTypeSecret(type);
        try{
            const decodedToken = jwt.verify(token, pass);
            return decodedToken;
        } catch (error){
            return false;
        }
    }

    static async createSession(session, type){
        const check = await Tokens.findOne({where: {session, ttype:type}});
        if(!check) {
            await Tokens.create({session, ttype: type});
            return true;
        }
        return false;        
    }

    static async updateSession(session, type, token ){
        await Tokens.update({tvalue: token}, {where:{session, ttype: type}});
    }

    static async storeToken(type ,UserId , session , token , geoloc , ipaddress, device='',newSession = true) {
        if(newSession) {
            await Tokens.create({UserId, ttype: type, session , tvalue: token, geoloc , ipaddress, device });
        } else {
            await Tokens.update({UserId,  tvalue: token, geoloc , ipaddress, device }, {where:{session, ttype: type }});
        }
    }

    static async deleteSession(sessionId) {
        const check = Tokens.findOne({where: {session:sessionId}});
        if(check) {
            await Tokens.destroy({where:{session: sessionId}});
        } else {
            throw new Error('sessionNotFound');
        }
    }

    static async deleteAllExceptOne( session, userid ) {
        await sequelize.query(`DELETE FROM Tokens where (ttype = 'loginToken' or ttype = 'refreshToken') AND UserId=${userid} AND session NOT IN (${session}) `);
    }

    static async getNextSession(){
        const [results, metadata] = await sequelize.query('SELECT max(session) as maxSession FROM Tokens');
        // console.log(results);
        return results[0].maxSession + 1;
    }


    static async sessionExists(session , ttype) {
        return await Tokens.findOne({where: {session, ttype}});
    }
    static async userSessionExists(UserId , ttype) {
        return await Tokens.findOne({where: {UserId, ttype}});
    }
}

module.exports = TokenService;