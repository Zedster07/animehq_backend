const config = require('../config/config');

async function isAdmin(req ,res , next) {
   try {
    const { user } = req;
    let granted = false;
    user.Roles.forEach( role => {
      if(role.name == config.roles.admin) {
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

module.exports = isAdmin;