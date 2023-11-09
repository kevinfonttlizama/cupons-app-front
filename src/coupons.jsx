import axios from 'axios';

const API_URL = 'http://localhost:3000/coupons/';

class CouponService {
  static createCoupon(couponData, token) {
    return axios.post(API_URL, couponData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

 
}

export default CouponService;
