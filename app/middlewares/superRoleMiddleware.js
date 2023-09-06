// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function superRoleMiddleware(req, res, next) { 
  try {
    let granted = false;
    let user = req.user;
    user.Roles.forEach( role => {
      if( role.name == config.roles.superAdmin ) {
        granted = true;
      }
    });

    if( granted == true ) {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden: Higher Privilege Required' });
    }

  } catch (error) {
    return res.status(400).json({ error: 'Something went wrong' });
  }
}

module.exports = superRoleMiddleware;