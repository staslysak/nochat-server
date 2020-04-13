"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendVerificationEmail = exports.send = void 0;

var _config = _interopRequireDefault(require("./config"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const transporter = _nodemailer.default.createTransport({
  pool: true,
  maxConnections: 10,
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // true for 465, false for other ports
  auth: {
    user: _config.default.SMTP_CLIENT_USER,
    pass: _config.default.SMTP_CLIENT_PW
  } // debug: true, // show debug output
  // logger: true // log information in console

}, {
  from: `NoChat <${_config.default.SMTP_CLIENT_USER}>`
});

const send = message => transporter.sendMail({ ...message
}, (err, info) => console.log(err ? err : `Email sent: ${JSON.stringify(info)}`));

exports.send = send;

const sendVerificationEmail = async (email, token) => {
  const url = (0, _utils.getHost)(`verify?token=${token}`);
  const message = {
    to: email,
    subject: "Email Verification",
    html: `
      <p>
        Follow this link to verify your email:
        <a href='${url}' target='_blank'>Click here</a>
     </p>`
  };
  await send(message);
};

exports.sendVerificationEmail = sendVerificationEmail;