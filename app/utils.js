const { hasRole } = require("./config/database");
const RoleService = require("./services/auth-service/roleServices");
const UserService = require("./services/auth-service/userServices");
const CouponService = require("./services/coupon-service/CouponService");
const SubscriptionsService = require("./services/subscriptionServices/subscriptionService");

const getDevice = (userAgentString) => {
    console.log(userAgentString);
    const deviceRegex = /(?:[^;]+;\s){2}([^;\s]+)/; // Matches content after the 2nd semicolon and space
    const deviceMatch = userAgentString.match(deviceRegex);
    const deviceInfo = deviceMatch ? deviceMatch[1] : "UnknownDevice";
    return deviceInfo;
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



    let check = await RoleService.getRoleByName('Admin');
    if(!check) {
        await RoleService.new("Admin");
        await RoleService.new("User");
        await RoleService.new("Subscriber");
    }

    
    check = await UserService.getUserByName('Admin');
    if(!check) {
        await UserService.createUser({
            username: 'Admin',
            password: 'P@ssw0rd',
            email: 'admin@example.com'
        });
        const user = await UserService.getUserByName('Admin');
        await hasRole.create({UserId: user.id, RoleId: 1});
    }

    // create plans 
    check = await SubscriptionsService.getPlanByName('Sama');
    if(!check) {
        await SubscriptionsService.newPlan('Senpai',false, 1,2.99,null);
        await SubscriptionsService.newPlan('Sensei',false, 2,7.99,null);
        await SubscriptionsService.newPlan('Sama',false, 3,19.99,null);
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


function customDecrypt(encryptedLink) {
  const key = "125812d5a33b9b1e78871c14e3c52579";
  // Replace '_' with '/' and '-' with '+' to revert the custom encoding
  const customBase64 = encryptedLink.replace(/_/g, '/').replace(/-/g, '+');
  const data = Buffer.from(customBase64, 'base64');
  let decrypted = '';
  for (let i = 0; i < data.length; i++) {
    decrypted += String.fromCharCode(data[i] ^ key.charCodeAt(i % key.length));
  }
  return decrypted;
}


module.exports = {getDevice,validateInput ,getExpirationDate  , initial_data , customDecrypt};