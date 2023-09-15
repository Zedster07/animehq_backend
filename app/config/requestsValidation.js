const config = require('./config');
const { user, role, meta , subscription } = config.routes;

const dataTypes = {

    email: {
        regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        regexError: ['Please enter a valid email']
    }, 
    password: {
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$!%*?&]{8,}$/,
        regexError: [
            'At least 8 characters long',
            'Contains at least one lowercase letter',
            'Contains at least one uppercase letter',
            'Contains at least one digit',
            'Can contain special characters @$!%*?&'
        ]
    },
    username: {
        regex: /^[a-zA-Z0-9_-]{4,16}$/,
        regexError:[
            'Are 4 to 16 characters long',
            'Can contain lowercase and uppercase letters, digits, underscores, and hyphens',
        ]
    },
    id:{
        regex: /^[0-9]+$/,
        regexError: ['Invalid id value']
    },
    string: {
        regex: /^[\s\S]+$/,
        regexError: ['Invalid string']
    },
    phone: {
        regex: /^[0-9]{10}$/,
        regexError: ['Please enter a valid 10-digit phone number']
    },
    date: {
        regex: /^(\d{4})-(\d{2})-(\d{2})$/,
        regexError: ['Please enter a valid date in the format YYYY-MM-DD']
    },
    url: {
        regex: /^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(\/\S*)?$/,
        regexError: ['Please enter a valid URL']
    },
    zipcode: {
        regex: /^\d{5}(-\d{4})?$/,
        regexError: ['Please enter a valid ZIP code']
    },
    double: {
        regex: /^[+-]?([0-9]*[.])?[0-9]+$/,
        regexError: ['Please enter a valid double value'],
    },
};

const validator = {

    // Users Routes
    [`${subscription.prefix}/newplan`]: {
        expects:{
            body:[
                {
                    name: 'name',
                    checkRegex: true,
                    type: dataTypes.string,
                },
                {
                    name: 'price',
                    checkRegex: true,
                    type: dataTypes.double,
                },
            ]
        }
    },
    [`${subscription.prefix}/newfeature`]: {
        expects:{
            body:[
                {
                    name: 'name',
                    checkRegex: true,
                    type: dataTypes.string,
                },
                {
                    name: 'description',
                    checkRegex: true,
                    type: dataTypes.string,
                },
            ]
        }
    },
    [`${subscription.prefix}/associatepf`]: {
        expects:{
            body:[
                {
                    name: 'planId',
                    checkRegex: true,
                    type: dataTypes.id,
                },
                {
                    name: 'featureId',
                    checkRegex: true,
                    type: dataTypes.id,
                },
            ]
        }
    },
    [`${subscription.prefix}/getplanfeatures`]: {
        expects:{
            body:[
                {
                    name: 'planId',
                    checkRegex: true,
                    type: dataTypes.id,
                },
            ]
        }
    },
    [`${subscription.prefix}/subscribe`]: {
        expects:{
            body:[
                {
                    name: 'subscription_plan_id',
                    checkRegex: true,
                    type: dataTypes.id,
                },
                {
                    name: 'duration',
                    checkRegex: true,
                    type: dataTypes.id,
                },
            ]
        }
    },

    [`${subscription.prefix}/abandon`]: {
        expects:{
            body:[
                {
                    name: 'subscription_id',
                    checkRegex: true,
                    type: dataTypes.id,
                },
            ]
        }
    },

    [`${subscription.prefix}/renew`]: {
        expects:{
            body:[
                {
                    name: 'subscription_id',
                    checkRegex: true,
                    type: dataTypes.id,
                },
            ]
        }
    },

    // user routes validation

  [`${user.prefix}/register`]: {
    expects:{
        body:[
            {
                name: 'email',
                checkRegex: true,
                type: dataTypes.email,
            },
            {
                name: 'password',
                checkRegex: true,
                type:  dataTypes.password,  
            },
            {
                name: 'username',
                checkRegex: true,
                type: dataTypes.username,
            }
        ],
    }
  }, 
  [`${user.prefix}/login`]: {
    expects:{
        body: [
            { 
                name: 'password',
                checkRegex: false,
                type:  dataTypes.password,  
            },
            {
                name: 'username',
                checkRegex: false,
                type: dataTypes.username,
            }
        ]
    }
  }, 
  [`${user.prefix}/requestResetPassword`]: {
    expects:{
        body:[
            {
                name: "email",
                checkRegex: true,
                type: dataTypes.email,
            }
        ]
    }
  },

  [`${user.prefix}/logoutSession`]:{
    expects:{
        body:[
            {
                name: "session",
                checkRegex: true,
                type: dataTypes.id,
            }
        ]
    }
  },

  [`${user.prefix}/forgotPassword`]:{
    expects:{
        body:[
            {
                name: "new_password",
                checkRegex: true,
                type: dataTypes.password,
            }
        ]
    }
  },

  [`${user.prefix}/resetpassword`]:{
    expects:{
        body:[
            {
                name: "new_password",
                checkRegex: true,
                type: dataTypes.password,
            },
            {
                name: "current_password",
                checkRegex: false,
                type: dataTypes.password,
            }
        ]
    }
  },

  [`${user.prefix}/update`]:{
    expects:{
        body:[
            {
                name: "fname",
                checkRegex: true,
                type: dataTypes.string,
            },
            {
                name: "lname",
                checkRegex: true,
                type: dataTypes.string,
            },
            {
                name: "dob",
                checkRegex: true,
                type: dataTypes.date,
            },
            {
                name: "mobile",
                checkRegex: true,
                type: dataTypes.phone,
            },
            {
                name: "gender",
                checkRegex: true,
                type: dataTypes.string,
            },
        ]
    }
  },

  // Roles Routes
  
  [`${role.prefix}/assign`]:{
    expects:{
        body:[
            {
                name: "userid",
                checkRegex: true,
                type: dataTypes.id,
            },
            {
                name: "organization_id",
                checkRegex: true,
                type: dataTypes.id,
            },
            {
                name: "roleid",
                checkRegex: true,
                type: dataTypes.id,
            },
            {
                name: "permissions",
                checkRegex: false,
            },
        ]
    }
  },

  [`${role.prefix}/revoke`]:{
    expects:{
        body:[
            {
                name: "userid",
                checkRegex: true,
                type: dataTypes.id,
            },
            {
                name: "organization_id",
                checkRegex: true,
                type: dataTypes.id,
            },
            {
                name: "roleid",
                checkRegex: true,
                type: dataTypes.id,
            },
        ]
    }
  },

  [`${role.prefix}/update`]:{
    expects:{
        body:[
            {
                name: "userid",
                checkRegex: true,
                type: dataTypes.id,
            },
            {
                name: "organization_id",
                checkRegex: true,
                type: dataTypes.id,
            },
            {
                name: "roleid",
                checkRegex: true,
                type: dataTypes.id,
            },
            {
                name: "permissions",
                checkRegex: false,
            },
        ]
    }
  },

  [`${role.prefix}/create`]:{
    expects:{
        body:[
            {
                name: "name",
                checkRegex: true,
                type: dataTypes.string,
            },
        ]
    }
  },

  [`${role.prefix}/update`]:{
    expects:{
        body:[
            {
                name: "name",
                checkRegex: true,
                type: dataTypes.string,
            },
            {
                name: "roleid",
                checkRegex: true,
                type: dataTypes.id,
            },
        ]
    }
  },
};


module.exports = {validator, dataTypes};