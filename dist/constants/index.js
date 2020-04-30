"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subTypes = exports.DEFAULT_AVATARS = exports.STATUS = void 0;
const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive"
};
exports.STATUS = STATUS;
const DEFAULT_AVATARS = ["linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)", "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)", "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)", "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)", "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)", "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)"];
exports.DEFAULT_AVATARS = DEFAULT_AVATARS;
const subTypes = {
  NEW_MESSAGE: "NEW_MESSAGE",
  DELETE_MESSAGE: "DELETE_MESSAGE",
  NEW_DIRECT: "NEW_DIRECT",
  DELETE_DIRECT: "DELETE_DIRECT",
  ONLINE_USER: "ONLINE_USER",
  USER_TYPING: "USER_TYPING"
};
exports.subTypes = subTypes;