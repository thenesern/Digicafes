// Dependencies
import React from "react";
import { Button, TextField, Checkbox, List, ListItem } from "@material-ui/core";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
// Styles
import styles from "./RegisterForm.module.css";
import axios from "axios";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [signedIn, setSignedIn] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const registerHandler = async (e) => {
    e.preventDefault();
    closeSnackbar();
    if (password !== passwordConfirm) {
      return enqueueSnackbar("Şifreler eşleşmiyor", { variant: "error" });
    }
    setSignedIn(new Date().toLocaleString());

    const lowerFirst = firstName?.toLowerCase();
    const betterFirst = lowerFirst?.replace(
      lowerFirst[0],
      lowerFirst[0]?.toUpperCase()
    );
    setFirstName(betterFirst);

    const lowerLast = lastName?.toLowerCase();
    const betterLast = lowerLast?.replace(
      lowerLast[0],
      lowerLast[0]?.toUpperCase()
    );
    setLastName(betterLast);

    try {
      await axios.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        signedIn,
      });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Üye Ol</h1>
        <div className={styles.signin}>
          <p>Hesabınız var mı?</p>
          <Link href="/login" passHref>
            <span style={{ fontWeight: "600", cursor: "pointer" }}>
              Giriş Yapın
            </span>
          </Link>
        </div>
        <form onSubmit={handleSubmit(registerHandler)} className={styles.form}>
          <List>
            <div style={{ display: "flex" }}>
              <ListItem>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    minLength: 2,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="name"
                      label="Ad"
                      onChange={(e) => setFirstName(e.target.value)}
                      error={Boolean(errors.name)}
                      helperText={
                        errors.name
                          ? errors.name.type === "minLength"
                            ? "Lütfen geçerli bir Ad giriniz"
                            : "Lütfen Adınızı giriniz"
                          : ""
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>
              <ListItem>
                <Controller
                  name="lastName"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    minLength: 2,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="lastName"
                      label="Soyad"
                      onChange={(e) => setLastName(e.target.value)}
                      error={Boolean(errors.lastName)}
                      helperText={
                        errors.lastName
                          ? errors.lastName.type === "minLength"
                            ? "Lütfen geçerli bir Soyad giriniz"
                            : "Lütfen Soyadınızı giriniz"
                          : ""
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>
            </div>
            <ListItem>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="Email"
                    inputProps={{ type: "email" }}
                    error={Boolean(errors.email)}
                    onChange={(e) => setEmail(e.target.value)}
                    helperText={
                      errors.email
                        ? errors.email.type === "pattern"
                          ? "Lütfen geçerli bir E-Mail adresi giriniz"
                          : "Lütfen E-Mail adresinizi giriniz"
                        : ""
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>
            <div style={{ display: "flex" }}>
              <ListItem>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      id="password"
                      label="Şifre"
                      inputProps={{ type: "password" }}
                      error={Boolean(errors.password)}
                      onChange={(e) => setPassword(e.target.value)}
                      helperText={
                        errors.password
                          ? errors.password.type === "minLength"
                            ? "Şifreniz minimum 5 karakter olmalıdır"
                            : "Lütfen bir şifre giriniz"
                          : ""
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>
              <ListItem>
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      id="confirmPassword"
                      label="Confirm Password"
                      inputProps={{ type: "password" }}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      error={Boolean(errors.confirmPassword)}
                      helperText={
                        errors.confirmPassword
                          ? errors.confirmPassword.type === "minLength"
                            ? "Şifreniz minimum 5 karakter olmalıdır"
                            : "Lütfen bir şifre giriniz"
                          : ""
                      }
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>
            </div>
            <div className={styles.aggreement}>
              <div className={styles.privacy}>
                <p>
                  Kişisel verileriniz,
                  <Link href="/" passHref>
                    <span
                      style={{
                        fontWeight: "600",
                        cursor: "pointer",
                        margin: "0 4px",
                      }}
                    >
                      Aydınlatma Metni
                    </span>
                  </Link>
                  kapsamında işlenmektedir. “Üye ol” butonuna basarak
                  <Link href="/" passHref>
                    <span
                      style={{
                        fontWeight: "600",
                        cursor: "pointer",
                        margin: "0 4px",
                      }}
                    >
                      Üyelik Sözleşmesi
                    </span>
                  </Link>
                  ’ni, ve
                  <Link href="/" passHref>
                    <span
                      style={{
                        fontWeight: "600",
                        cursor: "pointer",
                        margin: "0 4px",
                      }}
                    >
                      Çerez Politikası
                    </span>
                  </Link>
                  ’nı okuduğunuzu ve kabul ettiğinizi onaylıyorsunuz.
                </p>
              </div>
            </div>
            <ListItem>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                color="primary"
              >
                Üye Ol
              </Button>
            </ListItem>
          </List>
        </form>
      </div>
    </div>
  );
};

export default Register;
