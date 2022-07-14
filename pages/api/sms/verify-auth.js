import nc from "next-connect";

const handler = nc();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;
const client = require("twilio")(accountSid, authToken);

handler.post(async (req, res) => {
  client.verify.v2
    .services(process.env.TWILIO_SERVICE_SID)
    .verificationChecks.create({
      to: req.body.to,
      code: req.body.code,
    })
    .then((check) => {
      if (check.status === "approved") {
        res.send({ status: "success" });
      } else {
        res.send({ status: "incorrect token" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.send({ status: "fail", error });
    });
});

export default handler;
