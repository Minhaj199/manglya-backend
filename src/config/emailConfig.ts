import nodemailer from "nodemailer";

const userName = process.env.GOOGLE_USERNAME;
const password = process.env.GOOGLE_PASSWORD;
const messageService=process.env.MESSAGE_SERVICE
const tranporter = nodemailer.createTransport({
  service: messageService,
  auth: {
    user: userName,
    pass: password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
export { tranporter };
