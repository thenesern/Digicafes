import nc from "next-connect";

const handler = nc();
const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

handler.post(async (req, res) => {
  client.verify.v2
    .services(process.env.NEXT_PUBLIC_TWILIO_SERVICE_SID)
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
