import nc from "next-connect";

const handler = nc();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;
const client = require("twilio")(accountSid, authToken);

handler.post(async (req, res) => {
  client.verify.v2
    .services(process.env.TWILIO_SERVICE_SID)
    .verifications.create({
      to: req.body.to,
      channel: "sms",
      friendlyName: "Digicafes",
      locale: "tr",
    })
    .then((verification) => {
      console.log(`Sent verification: '${verification.sid}'`);
      res.send({ status: "success" });
    })
    .catch((error) => {
      console.log(error);
      res.send({ status: "fail" });
    });
});

export default handler;
