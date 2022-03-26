// Dependencies
import React, { useState, useContext } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Store } from "../../redux/store";
import Router from "next/router";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

// Styles
import styles from "./Nav.module.css";
import { AccountCircleRounded } from "@material-ui/icons";
import LogoutIcon from "@mui/icons-material/Logout";
import Fade from "@mui/material/Fade";
import { Button, TextField, List, ListItem, Menu } from "@material-ui/core";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import { useEffect } from "react";
import { Divider, Hidden, IconButton, SwipeableDrawer } from "@mui/material";
import MenuIcon from "@material-ui/icons/Menu";

const Nav = () => {
  const [visibleLogin, setVisibleLogin] = useState(false);
  const [visibleRegister, setVisibleRegister] = useState(false);
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
  const [openMenu, setOpenMenu] = useState(false);
  const logoutHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Router.push("/");
  };

  const closeHandler = () => {
    setVisibleLogin(false);
    setVisibleRegister(false);
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
      setVisibleLogin(false);
    } catch (err) {
      setIsFetching(false);
      enqueueSnackbar("Geçersiz E-mail veya Şifre", { variant: "error" });
    }
  };

  const [fix, setFix] = useState(false);
  function setFixed() {
    if (window.scrollY >= 200) {
      setFix(true);
    } else {
      setFix(false);
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", setFixed);
  });

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
      setIsFetching(true);
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
      setIsFetching(false);
      enqueueSnackbar("E-mail adresi zaten kayıtlı.", { variant: "error" });
    }
  };

  return (
    <navbar
      className={
        !fix ? `${styles.container}` : `${styles.container} ${styles.fixed}`
      }
    >
      <Modal
        closeButton
        className={styles.modal}
        onClose={closeHandler}
        open={visibleLogin}
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
      <Modal
        closeButton
        className={styles.modalRegister}
        onClose={closeHandler}
        open={visibleRegister}
      >
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
        <h1 className={styles.title}>Üye Ol</h1>
        <div className={styles.signin}>
          <p>Hesabınız var mı?</p>
          <span style={{ fontWeight: "600", cursor: "pointer" }}>
            Giriş Yapın
          </span>
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
          <li className={styles.rightXL}>
            <button
              className={styles.signIn}
              onClick={() => setVisibleLogin(true)}
            >
              Giriş Yap
            </button>
            <button
              className={styles.signUp}
              onClick={() => setVisibleRegister(true)}
            >
              Üye Ol
            </button>
          </li>
        )}
        <Hidden smUp>
          <IconButton style={{ padding: "0", margin: "0" }}>
            <MenuIcon
              onClick={() => setOpenMenu(true)}
              className={styles.menuButton}
            />
          </IconButton>
        </Hidden>
      </ul>
      <SwipeableDrawer
        anchor="right"
        open={openMenu}
        onOpen={() => setOpenMenu(true)}
        onClose={() => setOpenMenu(false)}
      >
        <div>
          <IconButton>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <div className={styles.right}>
          <div className={styles.buttons}>
            <button
              className={styles.signIn}
              onClick={() => setVisibleLogin(true)}
            >
              Giriş Yap
            </button>
            <button
              className={styles.signUp}
              onClick={() => setVisibleRegister(true)}
            >
              Üye Ol
            </button>
          </div>

          <Link href="/dijital-menu" passHref>
            <h5 className={styles.link}>Dijital Menü</h5>
          </Link>
        </div>
      </SwipeableDrawer>
    </navbar>
  );
};

export default Nav;
