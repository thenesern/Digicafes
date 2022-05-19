import nc from "next-connect";
import bcrypt from "bcryptjs";
import User from "../../../models/UserModel";
import db from "../../../utils/db";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
const handler = nc();

handler.post(async (req, res) => {
  await db.connect();

  try {
    const isUserThere = await User.findOne({ email: req.body.email });
    if (!isUserThere) {
      return res.send({
        status: "fail",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await User.findOneAndUpdate(
      { email: req.body.email },
      { passwordResetToken, passwordResetExpires }
    );

    const sgMailApiKey = process.env.SG_API_KEY;
    sgMail.setApiKey(sgMailApiKey);

    sgMail
      .send({
        to: req.body.email,
        from: "info@digicafes.com",
        subject: "Digicafes şifreni sıfırla",
        html: `<h3>Şifrenizi sıfırlamak için aşağıdaki linke tıklayınız.</h3>
        <br />
        <a href="https://www.digicafes.com/${resetToken}" target="_blank">Şifremi Sıfırla</a>
        <br />
        <br />
        Bu link 10 dakika sonra geçerliliğini kaybedecektir.
        <br/>
        Eğer şifrenizi yenilemek istemiyorsanız bu linki görmezden geliniz.
                `,
      })
      .then(
        () => {},
        (err) => {
          console.log(err);
        }
      );
    await db.disconnect();
    res.send({
      status: "success",
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: "fail",
    });
    await db.disconnect();
  }
});

export default handler;
