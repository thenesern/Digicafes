// Dependencies
import React, { useState, useContext } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Store } from "../../redux/store";
import Router from "next/router";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";

// Styles
import styles from "./Nav.module.css";
import { AccountCircleRounded } from "@material-ui/icons";
import LogoutIcon from "@mui/icons-material/Logout";
import Fade from "@mui/material/Fade";
import { Button, TextField, List, ListItem, Menu } from "@material-ui/core";
import { Loading, Modal, Spacer } from "@nextui-org/react";

const Nav = () => {
  const [visible, setVisible] = useState(false);
  const { state, dispatch } = useContext(Store);
  const [isFetching, setIsFetching] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let user;
  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Router.push("/");
  };

  const closeHandler = () => {
    setVisible(false);
  };
  const loginHandler = async ({ email, password }) => {
    closeSnackbar();
    const signedIn = new Date().toLocaleString();
    try {
      setIsFetching(true);
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
        signedIn,
      });
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      setIsFetching(false);
      setVisible(false);
    } catch (err) {
      setIsFetching(false);
      enqueueSnackbar("Geçersiz E-mail veya Şifre", { variant: "error" });
    }
  };

  return (
    <navbar className={styles.container}>
      <Modal
        closeButton
        className={styles.modal}
        onClose={closeHandler}
        open={visible}
      >
        <>
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
              <Loading size="xl" />
              <Spacer />
            </Modal.Body>
          </Modal>
          <div className={styles.wrapper}>
            <h1 className={styles.title}>Giriş Yap</h1>
            <div className={styles.signup}>
              <p>Hesabınız yok mu?</p>
              <span style={{ fontWeight: "600", cursor: "pointer" }}>
                Üye Olun
              </span>
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
                        label="Şifre"
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
        </>
      </Modal>
      <ul className={styles.list}>
        <li className={styles.left}>
          <Link href="/" passHref>
            <h6 className={styles.logo}>Logo</h6>
          </Link>
          <div className={styles.headers}>
            <Link href="/dijital-menu" passHref>
              <h5 className={styles.link}>Dijital Menü</h5>
            </Link>
          </div>
        </li>
        {user ? (
          <>
            <Button
              id="fade-button"
              aria-controls={open ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              className={styles.dropdown}
              style={{ color: "white" }}
            >
              <AccountCircleRounded />
              <div className={styles.username}>
                <h6>{user?.firstName}</h6>
                <h6>{user?.lastName}</h6>
              </div>
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
              style={{
                display: "flex",
                alingItems: "center",
                justifyContent: "center",
                marginTop: "3rem",
                marginLeft: "2rem",
              }}
            >
              <button className={styles.button}>
                <Link href="/hesabim" className={styles["menu-link"]} passHref>
                  <div className={styles["link-item"]}>Hesabım</div>
                </Link>
              </button>
              <button className={styles.button}>
                <Link href="/panel" className={styles["menu-link"]} passHref>
                  <div className={styles["link-item"]}>Yönetim Paneli</div>
                </Link>
              </button>

              <button className={styles.button} onClick={logoutHandler}>
                <Link href="/" passHref className={styles["menu-link"]}>
                  <div className={styles["link-item"]}>
                    <span>Çıkış Yap</span>
                    <LogoutIcon className={styles.icon} />
                  </div>
                </Link>
              </button>
            </Menu>
          </>
        ) : (
          <li className={styles.right}>
            <button className={styles.signIn} onClick={() => setVisible(true)}>
              Giriş Yap
            </button>
            <Link href="/kayit" passHref>
              <button className={styles.signUp}>Üye Ol</button>
            </Link>
          </li>
        )}
      </ul>
    </navbar>
  );
};

export default Nav;
