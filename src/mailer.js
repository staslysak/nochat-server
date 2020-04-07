import config from "./config";
import nodemailer from "nodemailer";
import { getHost } from "./utils";

const transporter = nodemailer.createTransport(
  {
    pool: true,
    maxConnections: 10,
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.SMTP_CLIENT_USER,
      pass: config.SMTP_CLIENT_PW,
    },
    // debug: true, // show debug output
    // logger: true // log information in console
  },
  {
    from: `NoChat <${config.SMTP_CLIENT_USER}>`,
  }
);

export const send = (message) =>
  transporter.sendMail({ ...message }, (err, info) =>
    console.log(err ? err : `Email sent: ${JSON.stringify(info)}`)
  );

export const sendVerificationEmail = async (email, token) => {
  const url = getHost(`verify?token=${token}`);
  const message = {
    to: email,
    subject: "Email Verification",
    html: `
      <p>
        Follow this link to verify your email:
        <a href='${url} target='_blank'>Click here</a>
     </p>`,
  };

  await send(message);
};
