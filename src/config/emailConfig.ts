import nodemailer from "nodemailer";

const userName = process.env.GOOGLE_USERNAME;
const password = process.env.GOOGLE_PASSWORD;
const tranporter=nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: userName,
    pass: password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
export { tranporter };
