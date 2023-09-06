const { hasRole } = require("./config/database");
const UserService = require("./services/auth-service/userServices");
const CouponService = require("./services/coupon-service/CouponService");

const getDevice = (userAgentString) => {
    console.log(userAgentString);
    const deviceRegex = /(?:[^;]+;\s){2}([^;\s]+)/; // Matches content after the 2nd semicolon and space
    const deviceMatch = userAgentString.match(deviceRegex);
    const deviceInfo = deviceMatch ? deviceMatch[1] : "UnknownDevice";
    return deviceInfo;
}



const calculateTotalPrice = async ( plan , duration , coupon) => {
    let price = plan.price * duration;
    if(coupon) {
        price = await CouponService.applyCoupon(plan ,coupon);
    }
    return price;
}

const getExpirationDate = (start_date, duration) => {
  // Parse the start_date to a Date object
  const startDate = start_date;

  // Calculate the expiration date by adding the duration in months to the start date
  const expirationDate = start_date;
  expirationDate.setMonth(startDate.getMonth() + duration);

  // Return the expiration date as a string in ISO format (e.g., "2023-12-31T00:00:00.000Z")
  return expirationDate;

};


const initial_data = async () => {
    const check = await UserService.getUserByName('Admin');
    if(!check) {
        await UserService.createUser({
            username: 'Admin',
            password: 'P@ssw0rd',
            email: 'admin@example.com'
        });
        const user = await UserService.getUserByName('Admin');
        await hasRole.create({UserId: user.id, RoleId: 1});
    }
    
}


const validateInput = (obj, item,body = null ,) => {
    let error = null;
    if(body) {
        if(body.hasOwnProperty(item.name)) {
            // check req.body[item.name] if it respects item.regex
            if(item.checkRegex){

                const propertyValue = body[item.name];
                const regex = new RegExp(item.type.regex);

                if (!regex.test(propertyValue)) {
                    error = {[item.name]: item.type.regexError };
                }

            }

        } else {
            error = {[item.name]: "Missing property" };
        }

    } else {
        const propertyValue = obj.value;
        const regex = new RegExp(item.type.regex);

        if (!regex.test(propertyValue)) {
            error = {[item.name]: item.type.regexError };
        }
    }

    return error;

}


module.exports = {getDevice,validateInput ,getExpirationDate , calculateTotalPrice , initial_data};