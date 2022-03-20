// Dependencies
import React, { useContext, useEffect } from "react";
import { Button, TextField, List, ListItem } from "@material-ui/core";
import Link from "next/link";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { Controller, useForm } from "react-hook-form";
import { Store } from "../../redux/store";
// Styles
import styles from "./Login.module.css";

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);

  const loginHandler = async ({ email, password }) => {
    closeSnackbar();
    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      router.push("/");
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Giriş Yap</h1>
        <div className={styles.signup}>
          <p>Hesabınız yok mu?</p>
          <Link href="/register" className={styles.signupLink} passHref>
            <span style={{ fontWeight: "600", cursor: "pointer" }}>
              Üye Olun
            </span>
          </Link>
        </div>
        <form className={styles.form} onSubmit={handleSubmit(loginHandler)}>
          <List>
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
                    label="E-mail"
                    inputProps={{ type: "email" }}
                    error={Boolean(errors.email)}
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
                    fullWidth
                    id="password"
                    label="Password"
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
                  ></TextField>
                )}
              ></Controller>
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                color="primary"
                onSubmit={handleSubmit(loginHandler)}
              >
                Giriş Yap
              </Button>
            </ListItem>
          </List>
        </form>
      </div>
    </div>
  );
};

export default Login;
