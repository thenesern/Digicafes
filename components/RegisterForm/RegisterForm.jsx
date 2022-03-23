// Dependencies
import React, { useContext, useEffect } from "react";
import { Button, TextField, List, ListItem } from "@material-ui/core";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { Store } from "../../redux/store";
// Styles
import styles from "./RegisterForm.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Loading, Modal, Spacer } from "@nextui-org/react";

const Register = () => {
  const [visible, setVisible] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);
  const registerHandler = async ({
    fName,
    lName,
    email,
    password,
    passwordConfirm,
  }) => {
    closeSnackbar();
    if (password !== passwordConfirm) {
      return enqueueSnackbar("Şifreler eşleşmiyor", { variant: "error" });
    }
    const signedIn = new Date().toLocaleString();

    const lowerFirst = fName?.toLowerCase();
    const betterFirst = lowerFirst?.replace(
      lowerFirst[0],
      lowerFirst[0]?.toUpperCase()
    );

    const lowerLast = lName?.toLowerCase();
    const betterLast = lowerLast?.replace(
      lowerLast[0],
      lowerLast[0]?.toUpperCase()
    );
    const firstName = betterFirst;
    const lastName = betterLast;
    try {
      setVisible(true);
      const { data } = await axios.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        signedIn,
      });
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      router.push("/");
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
      setVisible(false);
    }
  };

  return (
    <div className={styles.container}>
      {visible && (
        <Modal
          style={{
            background: "transparent",
            boxShadow: "none",
          }}
          preventClose
          aria-labelledby="modal-title"
          open={visible}
        >
          <Modal.Body>
            <Loading size="xl" />
            <Spacer />
          </Modal.Body>
        </Modal>
      )}
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Üye Ol</h1>
        <div className={styles.signin}>
          <p>Hesabınız var mı?</p>
          <Link href="/giris" passHref>
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
                  name="fName"
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
                      id="fName"
                      label="Ad"
                      error={Boolean(errors.fName)}
                      helperText={
                        errors.fName
                          ? errors.fName.type === "minLength"
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
                  name="lName"
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
                      id="lName"
                      label="Soyad"
                      error={Boolean(errors.lName)}
                      helperText={
                        errors.lName
                          ? errors.lName.type === "minLength"
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
                  name="passwordConfirm"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      id="passwordConfirm"
                      label="Şifre Onay"
                      inputProps={{ type: "password" }}
                      error={Boolean(errors.passwordConfirm)}
                      helperText={
                        errors.passwordConfirm
                          ? errors.passwordConfirm.type === "minLength"
                            ? "Şifreniz minimum 5 karakterden oluşmalıdır"
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
                onSubmit={handleSubmit(registerHandler)}
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
