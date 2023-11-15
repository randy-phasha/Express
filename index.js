var express = require('express');
var nodemailer = require('nodemailer');
const { Pool } = require('pg');
var app = express();
app.use(express.json());

// Create a PostgreSQL pool
const pool = new Pool({
   user: 'postgres',
   host: 'localhost',
   database: 'postgres',
   password: 'adminpass',
   port: 5432,
});

// Function to create the users table if it doesn't existasync 
async function createUsersTable() {
   const client = await pool.connect();
   try {
      const queryText = `CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL)`;
      await client.query(queryText);
      console.log('Users table created successfully');
   } catch (error) {
      console.error('Error creating users table:', error);
   } finally { client.release(); }
} // Call the function to create the table when the application 
createUsersTable();

app.post('/add-user', async (req, res) => {
   const { username, email } = req.body;
   try {
      const client = await pool.connect();
      const queryText = 'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *';
      const values = [username, email];
      const result = await client.query(queryText, values);
      client.release();
      res.json({ success: true, user: result.rows[0] });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Example route to fetch data from PostgreSQL
app.get('/users', async (req, res) => {
   try {
      const client = await pool.connect();
      //const result = await client.query('SELECT * FROM users');
      client.release();

      //res.json(result.rows);*/
      res.status(200).json({ error: 'Success connecting to database' });

   } catch (error) {
      "Connection terminated unexpectedly"
      res.status(500).json({ error: error.message });
   }
});

const PORT = process.env.PORT || 5432;

app.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`);
});

let nextBootcampDate = null;
app.post('/set-bootcamp-date', async (req, res) => {
   const { date } = req.body;

   const client = await pool.connect();
   try {

      const queryText = `CREATE TABLE IF NOT EXISTS bootcamp_date (id SERIAL PRIMARY KEY, date VARCHAR(50) NOT NULL)`;
      await client.query(queryText);
      console.log('bootcamp_date table created successfully');

      //const insertText = 'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *';

      const insertText = `INSERT INTO bootcamp_date (date) VALUES ($1) RETURNING *`;
      const values = [date];
      const result = await client.query(insertText, values);
      console.log('bootcamp date inserted successfully');
      return res.status(200).json({ message: 'Bootcamp date updated successfully.' });
   } catch (error) {
      console.error('Error creating bootcamp_date table:', error);
   } finally { client.release(); }
});

app.get('/get-bootcamp-date', async (req, res) => {
   const client = await pool.connect();
   try {
      const getText = `SELECT date FROM bootcamp_date`;
      const result = await client.query(getText);
      return res.status(200).json({ message: 'Bootcamp date returned successfully.', result });
   }
   catch (error) {
      console.error({ error: error.message });
   }
   finally {
      client.release();
   }

   /*if (nextBootcampDate) {
      return res.status(200).json({ nextBootcampDate });
   } else {
      return res.status(404).json({ message: 'Next bootcamp date has not been set.' });
   }*/
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

app.listen(3500, () => {
   console.log('Server is running at http://localhost:3500');
});
