const sgMail = require('@sendgrid/mail');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const sendEmail = async (req, res) => {
  const {to, phoneNumber, toEmail, emailContent, emailTotal} = req.body;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: toEmail,
    from: 'pizzaoclock69@gmail.com',
    subject: 'Order Confirmation',
    text: 'test email',
    html: `
      <html>
        <h1>Thank you for shopping in our store!</h1>
        <h3>Here are your contact details: </h3>
        <ul>
          <li><strong>Name: </strong>${to}</li>
          <li><strong>Phone number: </strong>${phoneNumber}</li>
          <li><strong>Email: </strong>${toEmail}</li>
        </ul>
        <h3>Here are your order details</h3>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Price</th>
              <th>Amount</th>
            </tr> 
          </thead>
          ${emailContent}
          </tbody>
          <hr>
          <p><strong>Total: £${emailTotal}</strong></p>
        </table>
        <h4>Expect a phone call from our operators to inquire about delivery.</h4>
        <h2 style="text-align: center; margin: 1rem 0; font-style: italic;">Happy Pizza Time!:)</h2>
      </html>
      `,
  };

  if (toEmail === '' || to === '' || phoneNumber === '' 
    || emailContent === '' || emailTotal <= 0) {
      throw new BadRequestError('Order form must contain valid values');
  }
  const info = await sgMail.send(msg);
  res.status(StatusCodes.ACCEPTED).json(info);
}

module.exports = sendEmail;