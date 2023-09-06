const { Coupon } = require('../../config/database');
class CouponService {
    static async createCoupon({code , type , value, status , startDate , endDate , planIncluded, maxUses , maxUsesPerUser}) {
        await Coupon.create({
            code, coupon_type: type, coupon_value: value,coupon_status: status??0,startDate,endDate,planIncluded ,maxUses:maxUses??0, maxUsesPerUser:maxUsesPerUser??0
        });
    }

    static async getCouponByCode(code) {
        return await Coupon.findOne({where:{code}});
    }

    static async getCouponById(couponId) {
        return await Coupon.findOne({where:{id:couponId}});
    }

    static async useCoupon(payment , coupon) {
        await coupon.addPayment(payment.id);
    }

    static async updateCoupon(couponId , {code , type , value, status , startDate , endDate , maxUses , maxUsesPerUser}) {
        await Coupon.update({
            code, coupon_type: type, coupon_value: value,coupon_status: status??0,startDate,endDate,maxUses:maxUses??0, maxUsesPerUser:maxUsesPerUser??0
        },{where: {id:couponId}});
    }

    static async applyCoupon(plan, couponCode, duration) {
        const coupon = await this.getCouponByCode(couponCode);
        let price = plan.price * duration;
        if (coupon.planIncluded && JSON.parse(coupon.planIncluded).includes(plan.id)) {

            if (coupon.coupon_type == "percent") {
                price = price - (price * (coupon.coupon_value/100));
            } else {
                price = price - coupon.coupon_value;
            }
        }

        if (price < 0) return 0;
        return price;
    }

}

module.exports = CouponService;