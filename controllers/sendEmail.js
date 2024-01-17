const Pizza = require('../models/pizza');
const sgMail = require('@sendgrid/mail');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const sizeNamings = {
  s: 'small',
  m: 'medium',
  l: 'large'
}

const sendEmail = async (req, res) => {
  const {to, phoneNumber, toEmail, order, emailTotal} = req.body;
  if (toEmail === '' || to === '' || phoneNumber === '' || !emailTotal || !order) {
    throw new BadRequestError('Order form must contain valid values');
  }

  // names without numbers and special symbols aside from "."
  const nameRegex = /[^a-zа-яіїє\. ]/i;
  const phoneRegex = /^[\+]380\d{9}$/;
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  if (nameRegex.test(to)) {
    throw new BadRequestError('Invalid receiver name');
  }
  if (!phoneRegex.test(phoneNumber)) {
    throw new BadRequestError('Invalid phone number format. Should be +380XXXXXXXXX.');
  }
  if (!emailRegex.test(toEmail)) {
    throw new BadRequestError('Invalid email format.');
  }
  if (emailTotal <= 0) {
    throw new BadRequestError('Invalid total cost value. Try creating the order again.');
  }

  const serverCost = await validateTotalCost(order);
  if (Number(emailTotal) !== serverCost) {
    console.log(emailTotal, serverCost);
    throw new BadRequestError({msg: 'Invalid total cost value(2). Try creating the order again.', serverCost, emailTotal});
  }

  const emailOrder = formEmail(order);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: toEmail,
    from: 'pizzaoclock69@gmail.com',
    subject: 'Order Confirmation',
    text: 'test email',
    html: `
      <html>
        <h1 style="margin-bottom: 2rem;">Thank you for shopping in our store!</h1>
        <h3>Here are your contact details: </h3>
        <ul style="list-style: none">
          <li><strong>Name: </strong>${to}</li>
          <li><strong>Phone number: </strong>${phoneNumber}</li>
          <li><strong>Email: </strong>${toEmail}</li>
        </ul>
        <h3 style="margin-bottom: 2rem">Here are your order details:</h3>
        <table style="width: 100%">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Price</th>
              <th>Amount</th>
            </tr> 
          </thead>
          ${emailOrder}
          <tfoot>
            <tr>
              <th style="border-top: 1px solid gray; padding: 15px" scope="row">Total:</th>
              <td style="border-top: 1px solid gray" colspan="3">£${emailTotal}</td>
            </tr>
          </tfoot>
        </table>
        <h4>Expect a phone call from our operators to inquire about the delivery.</h4>
        <h2 style="text-align: center; margin: 1rem 0; font-style: italic;">Happy Pizza Time!:)</h2>
        <p style="font-size: 12px; color: gray; text-align: center; margin: 1rem 0;">This is not a real order email. This is for demonstrational purposes only!</p>
      </html>
      `,
  };
  const info = await sgMail.send(msg);
  res.status(StatusCodes.ACCEPTED).json({ msg: 'Order email has been succesfully sent.'});
}

async function validateTotalCost(order) {
  let total = 0;

  for (const pizza of order) {
    if (pizza.title !== 'Custom pizza') {
      const pizzaFromDb = await Pizza.findOne({title: pizza.title}).select(`discount price.${pizza.size}`).exec();
      const price = await pizzaFromDb.price[pizza.size];
      total += (pizza.discount > 0) ? pizza.amount * price * pizza.discount / 100 : pizza.amount * price;
    } else {
      total += (pizza.discount > 0) ? pizza.amount * pizza.price * pizza.discount / 100 : pizza.amount * pizza.price;
    }
  }
  return total;
}

function formEmail(order) {
  let emailContent = '<tbody>';
  order.map(pizza => {
      const pizzaElem = `<tr><td style="text-align:center;padding:3px"><img style="max-width:50px" src=${pizza.imgUrl} alt="pizza-img"></td>
      <td style="text-align:center;padding:3px"><span style="font-weight: bold">${pizza.title}</span> (${sizeNamings[pizza.size]})</td>
      <td style="text-align:center;padding:3px">£${pizza.price}</td>
      <td style="text-align:center;padding:3px">${pizza.amount}</td></tr>`
    emailContent += pizzaElem;
  });
  emailContent += '</tbody>';
  return emailContent;
}

module.exports = sendEmail;