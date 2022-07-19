import mongoose from "mongoose";
import validator from "validator";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    taxOffice: {
      type: String,
      required: true,
    },
    taxNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    legalCompanyTitle: {
      type: String,
      required: true,
    },
    IBAN: {
      type: String,
      required: true,
    },
    subMerchantType: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    identityNumber: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    bookings: [
      {
        createdAt: {
          type: Date,
        },
        date: {
          type: String,
        },
        people: {
          type: Number,
        },
        userName: {
          type: String,
        },
        userEmail: {
          type: String,
        },
        storename: {
          type: String,
        },
        phoneNumber: {
          type: String,
        },
        isPaid: {
          type: Boolean,
        },
      },
    ],
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
      },
    },
    signedIn: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
