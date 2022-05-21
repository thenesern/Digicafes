import React from "react";
import User from "../../models/UserModel";
import db from "../../utils/db";
import crypto from "crypto";
import { ListItem, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Nav from "../../components/Nav2/Nav";
import Footer from "../../components/Footer/Footer";
import styles from "./passwordResetToken.module.css";
import { Input } from "@nextui-org/react";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import bcrypt from "bcryptjs";
import axios from "axios";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useEffect } from "react";
import { useRouter } from "next/router";

const PasswordResetToken = ({ user }) => {
  const [isFetching, setIsFetching] = useState(false);
  const Router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [sentPasswordMail, setSentPasswordMail] = useState(null);

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
            <h2>Yeni Şifrenizi Girin</h2>
            <ListItem
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <label>Şifre</label>
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
                          ? "Şifreniz minimum 5 karakterden oluşmalıdır"
                          : "Lütfen bir şifre giriniz"
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
                Kaydet
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
              Şifreniz Başarıyla Değiştirildi.
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
            <h4 style={{ textAlign: "center" }}>Şifre Değiştirilemedi.</h4>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export async function getServerSideProps(context) {
  const { passwordResetToken } = context.query;
  await db.connect();
  const hashedToken = crypto
    .createHash("sha256")
    .update(passwordResetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
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
