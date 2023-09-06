// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const UserService = require('../services/auth-service/userServices');

function proRoleMiddleware(req, res, next) { 
  try {
    const { user , session } = req;
    const { organization_id } = req.body;
    let granted = false;
    user.Roles.forEach( role => {
      if( 
          role.name == config.roles.superAdmin || 
          ( 
            role.name == config.roles.admin && 
            role.hasRole.organization == organization_id 
          ) 
        ) {
        granted = true;
      }
    });

    if( granted == true ) {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden: Higher Privilege Required' });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Something went wrong' });
  }
  
}

module.exports = proRoleMiddleware;