import nc from "next-connect";

const handler = nc();
const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

handler.post(async (req, res) => {
  client.verify.v2
    .services(process.env.NEXT_PUBLIC_TWILIO_SERVICE_SID)
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
