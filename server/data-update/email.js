/* Send emails from the application 
 * Uses email settings from environment in /server/.env file 
 */

require('dotenv').config({path: '../.env'})
var debug = require('debug')('dwb:email');
var nodemailer = require('nodemailer');
var sendAdminEmails = process.env.SEND_ADMIN_EMAILS === "1";

var transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

function sendAdminEmail(subject, text) {
  if (!sendAdminEmails) return;
  
  var mailOptions = {
    from: {
      name: "DWB Timeline Admin",
      address: process.env.EMAIL_USERNAME,
    },
    to: process.env.EMAIL_RECIPIENTS,
    subject: subject,
    text: text
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      debug('Error sending email from application, check .env file settings ❌');
    } else {
      debug('Admin email sent:', subject, ' ✔️');
    }
  });
}

function sendDataUpdateLog(logData) {
  var subject;
  var message = `Stage Reached: ${logData.stage} \n`
  if (logData.error) {
    subject = "Timeline data update FAIL!!";
    message += `\n${logData.error}`;
  } else {
    subject = "Timeline data update SUCCESS";
    message += `
ENGLISH DATA COUNTS
  - Timeline entries: ${logData.articleCountEn}
  - Item labels: ${logData.itemLabelCountEn}
   
WELSH DATA COUNTS
  - Timeline entries: ${logData.articleCountCy}
  - Item labels: ${logData.itemLabelCountCy}`
  }

  sendAdminEmail(subject, message);
}

module.exports = {
  sendAdmin: sendAdminEmail,
  sendDataUpdateLog: sendDataUpdateLog
}



