module.exports = {
    development: {
        dialect: 'mysql', // Specify your database dialect here
        // Other database connection settings
        username: 'root',
        password: '',
        database: 'animehq_express',
        host: 'localhost', 
    },

    constants: {
        LOGIN_SECRET: 'secret',
        REFRESH_SECRET: 'refreshSecret',
        EMAIL_SECRET: 'vemailSecret',
        RESET_PASS_SECRET: 'resetPassSecret'
    },

    roles : {
        superAdmin: "Super-Admin",
        admin: "Admin",
        user: "User",
        subscriber: "Subscriber"
    },

    permissions: {
        calendar: "100",
        stuff: "100",
        appointements: "",
        patients: ""
    },

    // Token Secrets 
    
    secret: 'b843e14d901e6ab7a789e2c8a7f3a605c47f903f3f4d3e5f0e2c65a5e4f7b9c1',
    refreshSecret: 'b843e14d901e6ab7a789e2c8a7f3a605c47f903f3f4d3e5f0e2c65a5e4f7b9c2',
    vemailSecret: 'b843e14d901e6ab7a789e2c8a7f3a605c47f903f3f4d3e5f0e2c65a5e4f7b9c3',
    resetPassSecret: 'b843e14d901e6ab7a789e2c8a7f3a605c47f903f3f4d3e5f0e2c65a5e4f7b9c4',
    
    port: 5555,
    env: 'dev', // dev or prod 
    hosting: 'local', // local or docker
    db_setups: {
        local: {
            username: 'root',
            password: '',
            database: 'animehq_express',
            host: 'localhost', 
        },
        docker: {
            username: 'root',
            password: 'Biskra@07',
            database: 'animehq_express',
            host: 'db', 
        }
    },
    routes: {
        user:{
            prefix: '/api/users'
        },
        role: {
            prefix: '/api/roles'
        },
        meta: {
            prefix: '/api/meta'
        },
        subscription:{
            prefix: '/api/subscription'
        },
        payment: {
            prefix: '/api/payment'
        }, 
        coupon:{
            prefix: '/api/coupon'
        }
    }
};