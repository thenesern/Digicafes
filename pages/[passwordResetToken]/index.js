// Packages and Dependencies
import React, { useState, useEffect } from "react";
import crypto from "crypto";
import { ListItem, TextField } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import { Input } from "@nextui-org/react";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import bcrypt from "bcryptjs";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
// Utils
import User from "../../models/UserModel";
import db from "../../utils/db";
// Components
import Nav from "../../components/Nav2/Nav";
import Footer from "../../components/Footer/Footer";
// Styles
import styles from "./passwordResetToken.module.css";

// Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
// Translation
import useTranslation from "next-translate/useTranslation";

const PasswordResetToken = ({ user }) => {
  const [isFetching, setIsFetching] = useState(false);
  const Router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [sentPasswordMail, setSentPasswordMail] = useState(null);
  // Translation
  const { t } = useTranslation();

  useEffect(() => {
    if (sentPasswordMail === true) {
      setTimeout(() => {
        Router.push("/");
      }, 3000);
    }
  }, [sentPasswordMail]);

  const handleUpdatePassword = async ({ password }) => {
    setIsFetching(true);
    try {
      const res = await axios.post("/api/auth/updatePassword", {
        password,
        email: user?.email,
      });

      if (res?.data?.status === "success") {
        setIsFetching(false);
        return setSentPasswordMail(true);
      } else if (res?.data?.status === "fail") {
        setIsFetching(false);
        return setSentPasswordMail(false);
      }
    } catch (err) {
      console.log(err);
      return setIsFetching(false);
    }
  };

  return (
    <div>
      <Nav />
      <Modal
        style={{
          background: "transparent",
          boxShadow: "none",
        }}
        preventClose
        aria-labelledby="modal-title"
        open={isFetching}
      >
        <Modal.Body>
          <Loading color="white" size="xl" />
          <Spacer />
        </Modal.Body>
      </Modal>
      <div className={styles.container}>
        {sentPasswordMail === null ? (
          <form
            className={styles.form}
            onSubmit={handleSubmit(handleUpdatePassword)}
          >
            <h2>{t("common:newPass")}</h2>
            <ListItem
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <label>{t("common:password")}</label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 6,
                }}
                render={({ field }) => (
                  <Input.Password
                    variant="outlined"
                    fullWidth
                    id="password"
                    color="secondary"
                    inputProps={{ type: "password" }}
                    error={Boolean(errors.password)}
                    helperText={
                      errors.password
                        ? errors.password.type === "minLength"
                          ? t("common:passwordMin")
                          : t("common:enterPassword")
                        : ""
                    }
                    {...field}
                  />
                )}
              ></Controller>
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                style={{ outline: "none", backgroundColor: "#c9184a" }}
                onSubmit={handleSubmit(handleUpdatePassword)}
              >
                {t("common:save")}
              </Button>
            </ListItem>
          </form>
        ) : sentPasswordMail === true ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <CheckCircleIcon style={{ fontSize: "6rem" }} color="success" />
            <h4 style={{ textAlign: "center" }}>
              {t("common:passwordUpdated")}
            </h4>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <ErrorIcon style={{ fontSize: "6rem" }} color="error" />
            <h4 style={{ textAlign: "center" }}>
              {t("common:passwordNotUpdated")}
            </h4>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export async function getServerSideProps(context) {
  const { passwordResetToken } = context.query;
  const hashedToken = crypto
    .createHash("sha256")
    .update(passwordResetToken)
    .digest("hex");

  await db.connect();

  const user = await User.findOne({
    passwordResetToken: hashedToken,
  });
  if (!user || Date.now() > user?.passwordResetExpires.getTime()) {
    return {
      redirect: {
        destination: `/${[passwordResetToken]}/expired`,
        permanent: false,
      },
    };
  }
  await db.disconnect();
  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}

export default PasswordResetToken;
