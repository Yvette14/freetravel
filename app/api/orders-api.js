import express from 'express';
const router = express.Router();
import {Order} from '../db/schema';
import {validateEmail, validatePhone} from '../shared/user-field-validation';


// router.post('/', (req, res, next) => {
//   const orderData = req.body;
//   console.log('=======' + orderData.name);
//   console.log('=======' + orderData.phone);
//   console.log('=======' + orderData.address);
//   console.log('=======' + orderData.otherMessage);
//
// });
//


function existEmpty(orderData) {
  return !(orderData.name === '' || orderData.otherMessage === '' || orderData.address === '' || orderData.phone === '');
}

// function isEmailRight(orderData) {
//   return validateEmail(orderData) !== false;
// }

function isPhoneRight(orderData) {
  return validatePhone(orderData) !== false;
}

function isOrderInformationLegal(orderData) {
  const isEmpty = existEmpty(orderData);
  // const isEmail = isEmailRight(orderData);
  const isPhone = isPhoneRight(orderData);

  if (isEmpty === false) {
    return {type: false, message: 'Please finish the form'};
  }
  // else if (isEmail === false) {
  //   return {type: false, message: 'The address is error'};
  // }
  else if (isPhone === false) {
    return {type: false, message: 'The phone number is error'};
  }
  return {type: true, message: 'type is true'};
}


function isExist(orderData, next, callback) {
  Order.findOne({name: orderData.name}, function (err, doc) {
    if (err) return next(err);

    callback(null, doc);
  });
}

router.post('/', function (req, res, next) {
  const orderData = req.body;
  const legal = isOrderInformationLegal(orderData);


  if (legal.type === true) {

    isExist(orderData, next, function (err, doc) {
      if (err) return next(err);
      if (doc === null) {
        var order = new Order({
          name: orderData.name,
          otherMessage: orderData.otherMessage,
          address: orderData.address,
          phone: orderData.phone,
          orderProductId:orderData.orderProductId
        });
        order.save(function (err) {
          if (err) return next(err);
          console.log('save status:', err ? 'failed' : 'success');
          res.status(201).send('order success');
        });
      }
      else if (doc !== null) {
        res.status(409).send('is exist');
      }
    });


  }
  else {
    res.status(400).send(legal.message);
  }
});
export default router;
