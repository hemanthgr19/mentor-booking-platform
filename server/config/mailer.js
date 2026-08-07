// Import Nodemailer to handle email sending
const nodemailer = require("nodemailer");


// Create a temporary email transporter for testing
const createTransporter = async () => {
  // Create a temporary Ethereal email account
  // This lets us test emails without using a real email account
  const testAccount = await nodemailer.createTestAccount();


  // Configure the email transporter using the Ethereal SMTP details
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,

    // Use the temporary account credentials
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });


  // Return the transporter so other files can send test emails
  return transporter;
};


// Export the function so it can be used in the booking controller
module.exports = createTransporter;