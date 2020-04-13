"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendVerificationEmail = exports.send = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _config = _interopRequireDefault(require("./config"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  from: "NoChat <".concat(_config.default.SMTP_CLIENT_USER, ">")
});

const send = message => transporter.sendMail(_objectSpread({}, message), (err, info) => console.log(err ? err : "Email sent: ".concat(JSON.stringify(info))));

exports.send = send;

const sendVerificationEmail = async (email, token) => {
  const url = (0, _utils.getHost)("verify?token=".concat(token));
  const message = {
    to: email,
    subject: "Email Verification",
    html: "\n      <p>\n        Follow this link to verify your email:\n        <a href='".concat(url, "' target='_blank'>Click here</a>\n     </p>")
  };
  await send(message);
};

exports.sendVerificationEmail = sendVerificationEmail;