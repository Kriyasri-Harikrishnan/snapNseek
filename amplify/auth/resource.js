const { defineAuth } = require("@aws-amplify/backend");

exports.auth = defineAuth({
  loginWith: { email: true },
});
