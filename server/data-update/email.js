/* Send emails from the application 
 * Uses email settings from environment in /server/.env file 
 */

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

function sendDataUpdateLog(timelineData) {
  var subject, message;
  if (timelineData instanceof Error) {
    subject = "Timeline data update FAIL!!";
    message = `\n${timelineData.name}: \n${timelineData.message}`;
  } else {
    subject = "Timeline data update SUCCESS";
    message = `
ENGLISH DATA COUNTS
  - Timeline entries: ${timelineData['en'].articles.length}
  - Item labels: ${Object.keys(timelineData['en'].labels.items).length}
   
WELSH DATA COUNTS
  - Timeline entries: ${timelineData['cy'].articles.length}
  - Item labels: ${Object.keys(timelineData['cy'].labels.items).length}`
  }
  sendAdminEmail(subject, message);
}

module.exports = {
  sendAdmin: sendAdminEmail,
  sendDataUpdateLog: sendDataUpdateLog
}



