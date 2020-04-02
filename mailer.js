import config from "./config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport(
  {
    pool: true,
    maxConnections: 10,
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.CLIENT_SMPT_EMAIL,
      pass: config.CLIENT_SMPT_PW
    }
    // debug: true, // show debug output
    // logger: true // log information in console
  },
  {
    from: `NoChat <${config.CLIENT_SMPT_EMAIL}>`
  }
);

export const send = message =>
  transporter.sendMail({ ...message }, (err, info) =>
    console.log(err ? err : `Email sent: ${JSON.stringify(info)}`)
  );

export const sendVerificationEmail = async (email, token) => {
  const host = "http://localhost:3000";
  const message = {
    to: email,
    subject: "Email Verification",
    html: `
      <p>
        Follow this link to verify your email:
        <a href='${host}/verify?token=${token}'>Click here</a>
     </p>`
  };

  await send(message);
};
