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
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

    await sgMail
      .send({
        to: req.body.email,
        from: "info@digicafes.com",
        subject: `${req.body.storeName.toUpperCase()} Rezervasyon Bilgileri`,
        html: `<h2>Rezervasyon bilgileriniz;</h2>
        <br />
        <div style={{display: "flex"}}>
        <span><h3  style={{color :"#00171f"}}>Rezervasyon Yapılan Yer: </h3>${req.body.storeName.toUpperCase()}</span>
        </div>

        <div style={{display: "flex"}}>
        <span><h3  style={{color :"#00171f"}}>Adres: </h3>${
          req.body.address
        }</span>
        </div>

        <div style={{display: "flex"}}>
        <span><h3 style={{color :"#00171f"}}>Rezervasyon Yapılan Tarih: </h3>${new Date(
          req.body.date
        ).toLocaleString()}</span>
        </div>

        <div style={{display: "flex"}}>
        <span><h3  style={{color :"#00171f"}}>Kişi Sayısı: </h3>
      
        ${req.body.people}
        </span>
        </div>
        <br />
        <br/>
        Eğer rezervasyonu iptal etmek isterseniz rezervasyon tarihinden 6 saat öncesine kadar profil sayfanız üzerinden iptal edebilirsiniz. 
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
