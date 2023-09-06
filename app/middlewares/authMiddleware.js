// middlewares/authMiddleware.js
const config = require('../config/config');
const UserService = require('../services/auth-service/userServices');
const TokenService = require('../services/auth-service/tokensService');

async function authMiddleware(req ,res , next) {
  
  const token = req.header('Authorization');

  if (!token) {
    
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let decodedToken = {};

  const url = req.url;

  const { 
    LOGIN_SECRET , 
    REFRESH_SECRET , 
    EMAIL_SECRET , 
    RESET_PASS_SECRET 
  } = config.constants;

  let secrectID = '';


  try{

    switch (url) {
    
      case '/forgotPassword':
        secrectID = RESET_PASS_SECRET;
        break;
  
      case '/token/refresh':
        secrectID = REFRESH_SECRET;
        break;
  
      default:
        secrectID = LOGIN_SECRET;
        break;
    }
    
    decodedToken = await TokenService.validateToken(secrectID, token);

    if(decodedToken == false) {

      res.status(401).json({ error: 'Invalid token' });

    } else {

      let isLogged = false;

      if(url == '/forgotPassword') {
        isLogged = true;
      } else {
        isLogged = await TokenService.checkLogin(decodedToken.session, secrectID , token);
      }

      const user = await UserService.getUserById(decodedToken.userId);
      
      if(isLogged) {
        req.user = user;
        req.session = decodedToken.session;
        next();
      } else {
        res.status(401).json({ error: 'Invalid token' });
      }

    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;