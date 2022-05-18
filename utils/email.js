const sgMail = require("@sendgrid/mail");

const sgMailApiKey =
  "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";

sgMail.setApiKey(sgMailApiKey);

module.exports.sendEmail = (email) => {
  sgMail
    .send({
      to: email,
      from: "info@digicafes.com",
      subject: "Password Rest",
      text: "Hello",
      html: `<p>hello</p>`,
    })
    .then(
      () => {},
      (err) => {
        console.log(err);
      }
    );
};
