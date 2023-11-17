axios.post('http://localhost:3000/api/customer/coupons/6/redeem', {}, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
})
.then(response => {
  // handle success
})
.catch(error => {
  // handle error
});
