const validator = require('../config/requestsValidation').validator;
const { validateInput } = require('../utils');

async function validationMiddleware(req ,res , next) {
    
    let errors = []; 
    let error = null;
    if(validator.hasOwnProperty(req.originalUrl)) {

        validator[req.originalUrl].expects.body.forEach( item => {

            error = validateInput( null, item, req.body);
            if(error) {
                errors.push(error);
            }
            
        });

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        } else {
            next();
        }

    } else {
        next();
    }
}

module.exports = validationMiddleware;