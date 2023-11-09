var express = require('express');
var nodemailer = require('nodemailer');
var app = express();
app.use(express.json());

/*
app.get('/hello', function (req, res) {
   res.send("Hello world!");
});

app.post('/hello', function (req, res) {
   res.send("You just called the post method at '/hello'!\n");
});
*/

let nextBootcampDate = null;
app.post('/set-bootcamp-date', (req, res) => {
   const { date } = req.body;

   if (!date) {
      return res.status(400).json({ message: 'Date is required.' });
   }

   nextBootcampDate = date;
   res.status(200).json({ message: 'Next bootcamp date has been set.' });
});

app.get('/get-bootcamp-date', (req, res) => {
   if (nextBootcampDate) {
      return res.status(200).json({ nextBootcampDate });
   } else {
      return res.status(404).json({ message: 'Next bootcamp date has not been set.' });
   }
});

app.post('/send-email', async (req, res) => {
   const { email, content } = req.body;

   if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
   }

   // Create a nodemailer transporter using Ethereal's SMTP server  
   let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
         user: 'katelynn.zboncak@ethereal.email',
         pass: '1K4HPZcDzvc9SSXk65',
      },
   });

   // Compose the email  
   let info = await transporter.sendMail({
      from: email,
      to: 'info@opherlabs.co.za',
      subject: 'Contact form',
      text: ` ${content} `,
      html: `<p> ${content} </p>`,
   });

   console.log('Message sent: %s', info.messageId);
   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

   res.status(200).json({ message: 'Next bootcamp date has been set and email sent.' });
});

app.post('/enrol-bootcamp', async (req, res) => {
   const { firstName, lastName, email, phone, dateOfBirth, streetAddress, city, state, zipCode, country, educationLevel, bootcampInterest, coverletter } = req.body;

   if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
   }

   // Create a nodemailer transporter using Ethereal's SMTP server  
   let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
         user: 'katelynn.zboncak@ethereal.email',
         pass: '1K4HPZcDzvc9SSXk65',
      },
   });

   // Compose the email  
   let info = await transporter.sendMail({

      from: email,

      to: 'info@opherlabs.co.za',

      subject: 'Enrol bootcamp',

      text: ` Thank you for your enrollment of the bootcamp. We will contact you. `,

      html: `<p> Thank you for your enrollment of the bootcamp. We will contact you. </p>`,

   });

   console.log('Message sent: %s', info.messageId);

   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


   res.status(200).json({ message: 'Enrolment confirmation successful' });

});

app.listen(1000, () => {
   console.log('Server is running at http://localhost:1000');
});
