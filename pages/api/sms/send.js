import nc from "next-connect";

const handler = nc();
const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

handler.post(async (req, res) => {
  client.messages
    .create({
      body: req.body.text,
      from: "+14582245784",
      to: req.body.to,
    })
    .then((message) =>
      res.json({
        success: true,
      })
    )
    .catch((error) => {
      console.log(error);
      res.json({
        success: false,
      });
    });
});

export default handler;
