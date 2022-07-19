import nc from "next-connect";
import bcrypt from "bcryptjs";
import User from "../../../models/UserModel";
import db from "../../../utils/db";
import { signToken } from "../../../utils/auth";

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  await User.findByIdAndUpdate(user._id, {
    signedIn: req.body.signedIn,
  });
  await db.disconnect();
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    res.send({
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user._id,
      isAdmin: user.isAdmin,
      signedIn: user.signedIn,
      createdAt: user.createdAt,
      phoneNumber: user.phoneNumber,
      bookings: user.bookings,
      userType: user.userType,
      taxOffice: user.taxOffice,
      taxNumber: user.taxNumber,
      legalCompanyTitle: user.legalCompanyTitle,
      IBAN: user.IBAN,
      identityNumber: user.identityNumber,
      subMerchantType: user.subMerchantType,
    });
  } else {
    res.status(401).send({ message: "Invalid email or password" });
  }
});

export default handler;
