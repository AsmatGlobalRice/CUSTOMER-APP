const express = require('express');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config();

// Configure the storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append current timestamp to the file name
  }
});

// Initialize multer with the custom storage configuration
const upload = multer({ storage: storage });

//nodemailer configuration for sending emails
const transporter = nodemailer.createTransport({
service: 'gmail',
auth:{
  user: process.env.GMAIL_USER,
  pass: process.env.GMAIL_PASS
}
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Handling POST requests to /upload for files
app.post("/upload", upload.any(), (req, res) => {
  
  // Log uploaded files
  console.log(req.files);
  //Extract uploaded files
  const files = req.files.map(file => ({
    filename: file.originalname,
    path: file.path
   }));
  // Log other form data
  console.log('ASSSSSSSSSSSSSSS', req.body);
  //Email information
const mailOptions = {
  from:  'asmat@globalriceusa.com',
  to: 'anam@globalriceusa.com',
  cc: 'billal@globalriceusa.com, rose@globalriceusa.com',
  subject: 'Uploaded Files and Form Data',
  text: `Form Data: ${JSON.stringify(req.body)}`,
  attachments: files // attach the files
};
transporter.sendMail(mailOptions, (error, info) => {
if(error){
  console.error("Error sending email:", error);
  return res.status(500).json({message: 'Failed to send email', error});
}
console.log('Email sent: ' + info.response);

  // Respond with a success message
  res.json({
    message: 'Files uploaded successfully!',
    files: req.files, // Include the uploaded files in the response
    body: req.body // Include any other form data in the response
  });
});
});



// Start the server on port 3001
app.listen(3001, () => {
  console.log("Server is running on port 3001.");
});
