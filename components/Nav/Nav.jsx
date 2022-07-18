// Packages and Dependencies
import React, { useState, useContext, useEffect } from "react";
import LinkRouter from "next/link";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import Backdrop from "@mui/material/Backdrop";
import { Link } from "react-scroll";
import { useRouter } from "next/router";
import { Loading, Modal, Spacer, Text } from "@nextui-org/react";
import ModalMui from "@mui/material/Modal";
import Image from "next/image";
import {
  Divider,
  FormControlLabel,
  FormLabel,
  Hidden,
  IconButton,
  Radio,
  RadioGroup,
  SwipeableDrawer,
} from "@mui/material";
import { Box } from "@mui/system";
import { Button as ButtonNext } from "@nextui-org/react";
import { List, ListItem, TextField } from "@material-ui/core";
import Fade from "@mui/material/Fade";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import VerifiedIcon from "@mui/icons-material/Verified";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// Cookies
import Cookies from "js-cookie";
// Context
import { Store } from "../../redux/store";
// Styles
import styles from "./Nav.module.css";
// Icons
import ErrorIcon from "@mui/icons-material/Error";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AccountCircleRounded } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
// Images
import logoDark from "../../assets/digi_dark_logo.svg";
import logo from "../../assets/digi_logo.svg";
// Translation
import i18nConfig from "../../i18n.json";
const { locales } = i18nConfig;
import useTranslation from "next-translate/useTranslation";

const Nav = ({ color }) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [isFetching, setIsFetching] = useState(false);
  const [openMuiLogin, setOpenMuiLogin] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [openMuiRegisterBooking, setOpenMuiRegisterBooking] = useState(false);
  const [openMuiRegisterDigitalMenu, setOpenMuiRegisterDigitalMenu] =
    useState(false);
  const [isBookingDashboard, setIsBookingDashboard] = useState(false);
  const [openMuiRegisterDefault, setOpenMuiRegisterDefault] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [openMenu, setOpenMenu] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [OTPResult, setOTPResult] = useState(null);
  const [taxOffice, setTaxOffice] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [legalCompanyTitle, setLegalCompanyTitle] = useState("");
  const [address, setAddress] = useState("");
  const [IBAN, setIBAN] = useState("");
  const [subMerchantType, setSubMerchantType] = useState("");
  const [isSubMerchantTypeError, setIsSubMerchantTypeError] = useState(false);
  const [fix, setFix] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorOTP, setErrorOTP] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState(null);
  const [isSentFormWithNotOTP, setIsSentFormWithNotOTP] = useState(false);
  const [sentPasswordMail, setSentPasswordMail] = useState(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  let user;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const prevOpen = React.useRef(open);
  // Translation
  const { t, lang } = useTranslation();

  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  const handleOpenMuiLogin = () => setOpenMuiLogin(true);
  const handleOpenForgotPassword = () => setOpenForgotPassword(true);
  const handleOpenMuiRegisterBooking = () => setOpenMuiRegisterBooking(true);
  const handleOpenMuiRegisterDigitalMenu = () =>
    setOpenMuiRegisterDigitalMenu(true);
  const handleOpenMuiRegisterDefault = () => setOpenMuiRegisterDefault(true);
  const handleCloseMuiLogin = () => setOpenMuiLogin(false);
  const handleCloseMuiRegisterBooking = () => setOpenMuiRegisterBooking(false);
  const handleCloseMuiRegisterDigitalMenu = () =>
    setOpenMuiRegisterDigitalMenu(false);
  const handleCloseMuiRegisterDefault = () => setOpenMuiRegisterDefault(false);
  const handleCloseForgotPassword = () => {
    setOpenForgotPassword(false);
    setSentPasswordMail(null);
  };
  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }
  useEffect(() => {
    if (sentPasswordMail === true || sentPasswordMail === false) {
      setTimeout(() => {
        handleCloseForgotPassword();
      }, 3000);
    }
  }, [sentPasswordMail]);
  // return focus to the button when we transitioned from !open -> open
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  const logoutHandler = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    router.push("/");
  };

  const handleCheckOTP = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    try {
      const result = await axios.post("/api/sms/verify-auth", {
        to: "+" + phoneNumber,
        code: enteredOTP,
      });
      setOTPResult(result.data.status);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      return;
    }
    setIsOTPSent(true);

    try {
      await axios.post("/api/sms/start-auth", { to: "+" + phoneNumber });
    } catch (err) {
      console.log(err);
    }
  };
  const resetPasswordHandler = async ({ email }) => {
    setIsFetching(true);
    try {
      const isUserThere = await axios.post("/api/auth/resetPassword", {
        email,
      });
      if (isUserThere?.data?.status === "success") {
        setSentPasswordMail(true);
      } else if (isUserThere?.data?.status === "fail") {
        setSentPasswordMail(false);
      }
      return setIsFetching(false);
    } catch (err) {
      console.log(err);
      return setIsFetching(false);
    }
  };
  const loginHandler = async ({ email, password }) => {
    closeSnackbar();
    const signedIn = new Date();
    try {
      setIsFetching(true);
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
        signedIn,
      });
      Cookies.remove("userInfo");
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      setIsFetching(false);
      handleCloseMuiLogin();
    } catch (err) {
      setIsFetching(false);
      enqueueSnackbar(t("nav:loginError"), { variant: "error" });
    }
  };

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
    if (OTPResult !== "success") {
      return setIsSentFormWithNotOTP(true);
    }
    if (password !== passwordConfirm) {
      return enqueueSnackbar(t("nav:passwordError"), { variant: "error" });
    }
    const signedIn = new Date();
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
    const createdAt = new Date();
    try {
      setIsFetching(true);
      const { data } = await axios.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        signedIn,
        phoneNumber: phoneNumber,
        createdAt,
        quantity: [14],
        userType: "Store Owner",
      });
      Cookies.remove("userInfo");
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      setIsFetching(false);
      handleCloseMuiRegister();
    } catch (err) {
      setIsFetching(false);
      enqueueSnackbar(t("nav:emailError"), { variant: "error" });
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setIsSentFormWithNotOTP(false);
    }, 3000);
  }, [isSentFormWithNotOTP]);

  const registerHandlerBooking = async ({
    fName,
    lName,
    email,
    password,
    passwordConfirm,
    IBAN,
    legalCompanyTitle,
    taxNumber,
    taxOffice,
  }) => {
    closeSnackbar();
    if (!subMerchantType) {
      return setIsSubMerchantTypeError(true);
    }
    if (OTPResult !== "success") {
      return setIsSentFormWithNotOTP(true);
    }

    if (password !== passwordConfirm) {
      return enqueueSnackbar(t("nav:passwordError"), { variant: "error" });
    }
    const signedIn = new Date();
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
    const createdAt = new Date();
    try {
      setIsFetching(true);
      const { data } = await axios.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        taxOffice: taxOffice,
        taxNumber: taxNumber,
        legalCompanyTitle: legalCompanyTitle,
        IBAN: IBAN,
        subMerchantType: subMerchantType,
        signedIn,
        phoneNumber: phoneNumber,
        createdAt,
        from: "Booking",
        quantity: [14],
        userType: "Store Owner",
      });
      Cookies.remove("userInfo");
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      setIsFetching(false);
      handleCloseMuiRegisterBooking();
    } catch (err) {
      setIsFetching(false);
      enqueueSnackbar(t("nav:emailError"), { variant: "error" });
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setIsSentFormWithNotOTP(false);
    }, 3000);
  }, [isSentFormWithNotOTP]);
  const registerHandlerDigitalMenu = async ({
    fName,
    lName,
    email,
    password,
    passwordConfirm,
  }) => {
    closeSnackbar();
    if (OTPResult !== "success") {
      return setIsSentFormWithNotOTP(true);
    }
    if (password !== passwordConfirm) {
      return enqueueSnackbar(t("nav:passwordError"), { variant: "error" });
    }
    const signedIn = new Date();
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
    const createdAt = new Date();
    try {
      setIsFetching(true);
      const { data } = await axios.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        signedIn,
        phoneNumber: phoneNumber,
        createdAt,
        from: "Digital Menu",
        quantity: [14],
        userType: "Store Owner",
      });
      Cookies.remove("userInfo");
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      setIsFetching(false);
      handleCloseMuiRegisterDigitalMenu();
    } catch (err) {
      setIsFetching(false);
      enqueueSnackbar(t("nav:emailError"), { variant: "error" });
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setIsSentFormWithNotOTP(false);
    }, 3000);
  }, [isSentFormWithNotOTP]);

  const registerHandlerDefault = async ({
    fName,
    lName,
    email,
    password,
    passwordConfirm,
  }) => {
    closeSnackbar();
    if (OTPResult !== "success") {
      return setIsSentFormWithNotOTP(true);
    }
    if (password !== passwordConfirm) {
      return enqueueSnackbar(t("nav:passwordError"), { variant: "error" });
    }
    const signedIn = new Date();
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
    const createdAt = new Date();
    try {
      setIsFetching(true);
      const { data } = await axios.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        phoneNumber: phoneNumber,
        signedIn,
        createdAt,
        quantity: [14],
        userType: "Default",
      });
      Cookies.remove("userInfo");
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      setIsFetching(false);
      handleCloseMuiRegisterDefault();
    } catch (err) {
      setIsFetching(false);
      enqueueSnackbar(t("nav:emailError"), { variant: "error" });
    }
  };
  useEffect(() => {
    if (
      router.pathname.includes("dashboard") &&
      router.pathname.includes("booking")
    ) {
      setIsBookingDashboard(true);
    }
  }, []);
  return (
    <navbar
      className={
        !fix ? `${styles.container}` : `${styles.container} ${styles.fixed}`
      }
      style={
        color
          ? {
              backgroundColor: color,
              position: "relative",
              padding: "0",
              height: "7vh",
            }
          : { height: "10vh" }
      }
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
          <Loading color="white" size="xl" />
          <Spacer />
        </Modal.Body>
      </Modal>
      <ModalMui
        className={styles.modals}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openMuiLogin}
        onClose={handleCloseMuiLogin}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box className={styles.loginBox}>
          <span
            onClick={handleCloseMuiLogin}
            style={{
              position: "absolute",
              right: "5%",
              top: "3%",
              cursor: "pointer",
            }}
          >
            X
          </span>
          <div className={styles.wrapper}>
            <h1 className={styles.title}>{t("nav:signIn")}</h1>
            <div className={styles.signup}>
              <p>{t("nav:noAccount")}</p>
              <span
                style={{ fontWeight: "600", cursor: "pointer" }}
                onClick={() => {
                  handleCloseMuiLogin();
                  if (router.pathname === "/booking") {
                    handleOpenMuiRegisterBooking();
                  }
                  if (router.pathname === "/digital-menu") {
                    handleOpenMuiRegisterDigitalMenu();
                  }
                  if (router.pathname === "/") {
                    handleOpenMuiRegisterDefault();
                  }
                }}
              >
                {t("nav:createAccount")}
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
                              ? t("nav:validEmail")
                              : t("nav:proveEmail")
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
                        label={t("nav:password")}
                        inputProps={{ type: "password" }}
                        error={Boolean(errors.password)}
                        helperText={
                          errors.password
                            ? errors.password.type === "minLength"
                              ? t("nav:passwordMin")
                              : t("nav:enterAPassword")
                            : ""
                        }
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
                <p
                  className={styles.forgotPassword}
                  onClick={() => {
                    handleCloseMuiLogin();
                    handleOpenForgotPassword();
                  }}
                >
                  {t("nav:forgotYourPassword")}
                </p>
                <ListItem>
                  <ButtonNext
                    flat
                    color="primary"
                    auto
                    style={{ width: "100%" }}
                    onSubmit={handleSubmit(loginHandler)}
                  >
                    {t("nav:signIn")}
                  </ButtonNext>
                </ListItem>
              </List>
            </form>
          </div>
        </Box>
      </ModalMui>
      <ModalMui
        className={styles.modals}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openForgotPassword}
        onClose={handleCloseForgotPassword}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box className={styles.loginBox}>
          <span
            onClick={handleCloseForgotPassword}
            style={{
              position: "absolute",
              right: "5%",
              top: "3%",
              cursor: "pointer",
            }}
          >
            X
          </span>
          {sentPasswordMail === null ? (
            <div className={styles.wrapper}>
              <h1 className={styles.title}>{t("nav:forgotYourPassword")}</h1>
              <div className={styles.signup}>
                <p style={{ textAlign: "center" }}>
                  {t("nav:forgotPasswordDescription")}
                </p>
              </div>
              <form
                className={styles.form}
                onSubmit={handleSubmit(resetPasswordHandler)}
              >
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
                                ? t("nav:validEmail")
                                : t("nav:proveEmail")
                              : ""
                          }
                          {...field}
                        ></TextField>
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Button
                      variant="outlined"
                      color="secondary"
                      type="submit"
                      fullWidth
                      style={{ outline: "none" }}
                      onSubmit={handleSubmit(resetPasswordHandler)}
                    >
                      {t("nav:send")}
                    </Button>
                  </ListItem>
                </List>
              </form>
            </div>
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
              <h4 style={{ textAlign: "center" }}>{t("nav:eMailSent")}</h4>
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
              <h4 style={{ textAlign: "center" }}>{t("nav:noUserFound")}</h4>
            </div>
          )}
        </Box>
      </ModalMui>
      <ModalMui
        className={styles.modals}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openMuiRegisterDigitalMenu}
        onClose={handleCloseMuiRegisterDigitalMenu}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box className={styles.registerBox}>
          <span
            onClick={handleCloseMuiRegisterDigitalMenu}
            style={{
              position: "absolute",
              right: "5%",
              top: "3%",
              cursor: "pointer",
            }}
          >
            X
          </span>
          <h1 className={styles.title}>{t("nav:signUp")}</h1>
          <div className={styles.signin}>
            <p>{t("nav:haveAccount")}</p>
            <span
              style={{ fontWeight: "600", cursor: "pointer" }}
              onClick={() => {
                handleCloseMuiRegisterDigitalMenu();
                handleOpenMuiLogin();
              }}
            >
              {t("nav:signIn")}
            </span>
          </div>
          <form className={styles.form}>
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
                        label={t("nav:name")}
                        error={Boolean(errors.fName)}
                        helperText={
                          errors.fName
                            ? errors.fName.type === "minLength"
                              ? t("nav:validName")
                              : t("nav:proveName")
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
                        label={t("nav:surName")}
                        error={Boolean(errors.lName)}
                        helperText={
                          errors.lName
                            ? errors.lName.type === "minLength"
                              ? t("nav:validSurName")
                              : t("nav:proveSurName")
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
                            ? t("nav:validEmail")
                            : t("nav:proveEmail")
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
                    fullWidth
                    defaultValue=""
                    rules={{
                      required: true,
                      minLength: 6,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        id="password"
                        fullWidth
                        label={t("nav:password")}
                        inputProps={{ type: "password" }}
                        error={Boolean(errors.password)}
                        helperText={
                          errors.password
                            ? errors.password.type === "minLength"
                              ? t("nav:passwordMin")
                              : t("nav:enterAPassword")
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
                        label={t("nav:passwordConfirm")}
                        inputProps={{ type: "password" }}
                        error={Boolean(errors.passwordConfirm)}
                        helperText={
                          errors.passwordConfirm
                            ? errors.passwordConfirm.type === "minLength"
                              ? t("nav:passwordMin")
                              : t("nav:enterAPassword")
                            : ""
                        }
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
              </div>
              <ListItem
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2rem",
                }}
              >
                <PhoneInput
                  country={"tr"}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  disabled={OTPResult === "success" ? true : false}
                  inputStyle={{
                    height: "3rem",
                    fontSize: "1rem",
                    width: "100%",
                  }}
                />
                {isOTPSent ? (
                  <>
                    {OTPResult !== "success" ? (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "2rem",
                        }}
                      >
                        <TextField
                          fullWidth
                          type="number"
                          id="otp"
                          label="Kodu Giriniz"
                          error={errorOTP}
                          helperText={
                            errorOTP ? "Lütfen Onay Kodunu Giriniz" : ""
                          }
                          value={enteredOTP}
                          onChange={(e) => setEnteredOTP(e.target.value)}
                        ></TextField>
                        <ButtonNext
                          bordered
                          auto
                          onClick={(e) => {
                            if (enteredOTP?.toString().length === 4) {
                              setErrorOTP(false);
                              handleCheckOTP(e);
                            } else {
                              setErrorOTP(true);
                            }
                          }}
                        >
                          Gönder
                        </ButtonNext>
                      </div>
                    ) : (
                      <VerifiedIcon color="success" />
                    )}
                  </>
                ) : (
                  <ButtonNext
                    bordered
                    disabled={phoneNumber ? false : true}
                    onClick={handleSendOTP}
                    style={{ width: "90%" }}
                  >
                    <span>Kod Gönder</span>
                  </ButtonNext>
                )}
              </ListItem>
              {isSentFormWithNotOTP && (
                <p
                  align="center"
                  style={{ color: "#d90429", fontSize: "14px" }}
                >
                  Lütfen Telefon Numaranızı Onaylayınız.
                </p>
              )}

              <div className={styles.aggreement}>
                {router.locale === "tr" ? (
                  <div className={styles.privacy}>
                    <p>
                      Kişisel verileriniz,
                      <a
                        href="/gizlilik-politikasi"
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                        target="_blank"
                      >
                        Gizlilik Politikası
                      </a>
                      kapsamında işlenmektedir. “Üye ol” butonuna basarak
                      <a
                        href="/uyelik-sozlesmesi"
                        target="_blank"
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                      >
                        Üyelik Sözleşmesi
                      </a>
                      ’ni, ve
                      <a
                        href="/cerez-politikasi"
                        target="_blank"
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                      >
                        Çerez Politikası
                      </a>
                      ’nı okuduğunuzu ve kabul ettiğinizi onaylıyorsunuz.
                    </p>
                  </div>
                ) : (
                  <p style={{ textAlign: "center" }}>
                    Click “Sign Up” to agree to Digicafes&apos;
                    <LinkRouter href="/terms-of-service" passHref>
                      <span
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                      >
                        Terms of Service
                      </span>
                    </LinkRouter>
                    and acknowledge that Digicafes&apos;
                    <LinkRouter href="/privacy-policy" passHref>
                      <span
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                      >
                        Privacy Policy
                      </span>
                    </LinkRouter>
                    applies to you.
                  </p>
                )}
              </div>
              <ListItem>
                <ButtonNext
                  flat
                  color="primary"
                  auto
                  style={{ width: "100%" }}
                  onClick={handleSubmit(registerHandlerDigitalMenu)}
                >
                  {t("nav:signUp")}
                </ButtonNext>
              </ListItem>
            </List>
          </form>
        </Box>
      </ModalMui>
      <ModalMui
        className={styles.modals}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openMuiRegisterBooking}
        onClose={handleCloseMuiRegisterBooking}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box className={styles.registerBox}>
          <span
            onClick={handleCloseMuiRegisterBooking}
            style={{
              position: "absolute",
              right: "5%",
              top: "3%",
              cursor: "pointer",
            }}
          >
            X
          </span>
          <h1 className={styles.title}>{t("nav:signUp")}</h1>
          <div className={styles.signin}>
            <p>{t("nav:haveAccount")}</p>
            <span
              style={{ fontWeight: "600", cursor: "pointer" }}
              onClick={() => {
                handleCloseMuiRegisterBooking();
                handleOpenMuiLogin();
              }}
            >
              {t("nav:signIn")}
            </span>
          </div>
          <form className={styles.form}>
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
                        label={t("nav:name")}
                        error={Boolean(errors.fName)}
                        helperText={
                          errors.fName
                            ? errors.fName.type === "minLength"
                              ? t("nav:validName")
                              : t("nav:proveName")
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
                        label={t("nav:surName")}
                        error={Boolean(errors.lName)}
                        helperText={
                          errors.lName
                            ? errors.lName.type === "minLength"
                              ? t("nav:validSurName")
                              : t("nav:proveSurName")
                            : ""
                        }
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
              </div>
              <div style={{ display: "flex" }}>
                <ListItem>
                  <Controller
                    name="taxOffice"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="taxOffice"
                        label="Vergi Daireniz"
                        error={Boolean(errors.taxOffice)}
                        onChange={(e) => setTaxOffice(e.target.value.trim())}
                        helperText={
                          errors.taxOffice
                            ? "Lütfen Vergi Dairenizi Giriniz"
                            : ""
                        }
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
                <ListItem>
                  <Controller
                    name="taxNumber"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                      minLength: 10,
                      maxLength: 10,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        type="number"
                        id="taxNumber"
                        label="Vergi Numarası"
                        inputProps={{ type: "number" }}
                        error={Boolean(errors.taxNumber)}
                        onChange={(e) => setTaxNumber(e.target.value.trim())}
                        helperText={
                          errors.taxNumber
                            ? "Lütfen Vergi Numaranızı Giriniz"
                            : ""
                        }
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
              </div>
              <div style={{ display: "flex" }}>
                <ListItem>
                  <Controller
                    name="legalCompanyTitle"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="legalCompanyTitle"
                        label="Şirket Unvanı"
                        inputProps={{ type: "text" }}
                        error={Boolean(errors.legalCompanyTitle)}
                        onChange={(e) => setLegalCompanyTitle(e.target.value)}
                        helperText={
                          errors.legalCompanyTitle
                            ? "Lütfen Şirket Unvanınızı Giriniz"
                            : ""
                        }
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
                <ListItem>
                  <Controller
                    name="IBAN"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                      minLength: 26,
                      maxLength: 26,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="legalCompanyTitle"
                        label="IBAN"
                        error={Boolean(errors.IBAN)}
                        onChange={(e) => setIBAN(e.target.value.trim())}
                        helperText={
                          errors.IBAN
                            ? "Lütfen Şirket Unvanı ile Uyumlu bir IBAN Giriniz"
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
                            ? t("nav:validEmail")
                            : t("nav:proveEmail")
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
                    fullWidth
                    defaultValue=""
                    rules={{
                      required: true,
                      minLength: 6,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        id="password"
                        fullWidth
                        label={t("nav:password")}
                        inputProps={{ type: "password" }}
                        error={Boolean(errors.password)}
                        helperText={
                          errors.password
                            ? errors.password.type === "minLength"
                              ? t("nav:passwordMin")
                              : t("nav:enterAPassword")
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
                        label={t("nav:passwordConfirm")}
                        inputProps={{ type: "password" }}
                        error={Boolean(errors.passwordConfirm)}
                        helperText={
                          errors.passwordConfirm
                            ? errors.passwordConfirm.type === "minLength"
                              ? t("nav:passwordMin")
                              : t("nav:enterAPassword")
                            : ""
                        }
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
              </div>
              <ListItem
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2rem",
                }}
              >
                <PhoneInput
                  country={"tr"}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  disabled={OTPResult === "success" ? true : false}
                  inputStyle={{
                    height: "3rem",
                    fontSize: "1rem",
                    width: "100%",
                  }}
                />
                {isOTPSent ? (
                  <>
                    {OTPResult !== "success" ? (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "2rem",
                        }}
                      >
                        <TextField
                          fullWidth
                          type="number"
                          id="otp"
                          label="Kodu Giriniz"
                          error={errorOTP}
                          helperText={
                            errorOTP ? "Lütfen Onay Kodunu Giriniz" : ""
                          }
                          value={enteredOTP}
                          onChange={(e) => setEnteredOTP(e.target.value)}
                        ></TextField>
                        <ButtonNext
                          bordered
                          auto
                          onClick={(e) => {
                            if (enteredOTP?.toString().length === 4) {
                              setErrorOTP(false);
                              handleCheckOTP(e);
                            } else {
                              setErrorOTP(true);
                            }
                          }}
                        >
                          Gönder
                        </ButtonNext>
                      </div>
                    ) : (
                      <VerifiedIcon color="success" />
                    )}
                  </>
                ) : (
                  <ButtonNext
                    bordered
                    disabled={phoneNumber ? false : true}
                    onClick={handleSendOTP}
                    style={{ width: "90%" }}
                  >
                    <span>Kod Gönder</span>
                  </ButtonNext>
                )}
              </ListItem>
              {isSentFormWithNotOTP && (
                <p
                  align="center"
                  style={{ color: "#d90429", fontSize: "14px" }}
                >
                  Lütfen Telefon Numaranızı Onaylayınız.
                </p>
              )}
              <ListItem
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FormLabel
                  id="demo-row-radio-buttons-group-label"
                  style={{ padding: "1rem 0 10px 0" }}
                >
                  Şirket Türü
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    id="PRIVATE_COMPANY"
                    value="PRIVATE_COMPANY"
                    control={<Radio />}
                    onChange={() => setSubMerchantType("PRIVATE_COMPANY")}
                    label="Şahıs Şirketi"
                  />
                  <FormControlLabel
                    id="LIMITED_OR_JOINT_STOCK_COMPANY"
                    value="LIMITED_OR_JOINT_STOCK_COMPANY"
                    control={<Radio />}
                    onChange={() =>
                      setSubMerchantType("LIMITED_OR_JOINT_STOCK_COMPANY")
                    }
                    label="Limited veya Anonim Şirket"
                  />
                </RadioGroup>
                {isSubMerchantTypeError ? (
                  <Text color="error">Lütfen Şirket Türünü Seçiniz</Text>
                ) : (
                  ""
                )}
              </ListItem>
              <div className={styles.aggreement}>
                {router.locale === "tr" ? (
                  <div className={styles.privacy}>
                    <p>
                      Kişisel verileriniz,
                      <a
                        href="/gizlilik-politikasi"
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                        target="_blank"
                      >
                        Gizlilik Politikası
                      </a>
                      kapsamında işlenmektedir. “Üye ol” butonuna basarak
                      <a
                        href="/uyelik-sozlesmesi"
                        target="_blank"
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                      >
                        Üyelik Sözleşmesi
                      </a>
                      ’ni, ve
                      <a
                        href="/cerez-politikasi"
                        target="_blank"
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                      >
                        Çerez Politikası
                      </a>
                      ’nı okuduğunuzu ve kabul ettiğinizi onaylıyorsunuz.
                    </p>
                  </div>
                ) : (
                  <p style={{ textAlign: "center" }}>
                    Click “Sign Up” to agree to Digicafes&apos;
                    <LinkRouter href="/terms-of-service" passHref>
                      <span
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                      >
                        Terms of Service
                      </span>
                    </LinkRouter>
                    and acknowledge that Digicafes&apos;
                    <LinkRouter href="/privacy-policy" passHref>
                      <span
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                      >
                        Privacy Policy
                      </span>
                    </LinkRouter>
                    applies to you.
                  </p>
                )}
              </div>
              <ListItem>
                <ButtonNext
                  flat
                  color="primary"
                  auto
                  style={{ width: "100%" }}
                  onClick={handleSubmit(registerHandlerBooking)}
                >
                  {t("nav:signUp")}
                </ButtonNext>
              </ListItem>
            </List>
          </form>
        </Box>
      </ModalMui>
      <ModalMui
        className={styles.modals}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openMuiRegisterDefault}
        onClose={handleCloseMuiRegisterDefault}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box className={styles.registerBox}>
          <span
            onClick={handleCloseMuiRegisterDefault}
            style={{
              position: "absolute",
              right: "5%",
              top: "3%",
              cursor: "pointer",
            }}
          >
            X
          </span>
          <h1 className={styles.title}>{t("nav:signUp")}</h1>
          <div className={styles.signin}>
            <p>{t("nav:haveAccount")}</p>
            <span
              style={{ fontWeight: "600", cursor: "pointer" }}
              onClick={() => {
                handleCloseMuiRegisterDefault();
                handleOpenMuiLogin();
              }}
            >
              {t("nav:signIn")}
            </span>
          </div>
          <form className={styles.form}>
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
                        label={t("nav:name")}
                        error={Boolean(errors.fName)}
                        helperText={
                          errors.fName
                            ? errors.fName.type === "minLength"
                              ? t("nav:validName")
                              : t("nav:proveName")
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
                        label={t("nav:surName")}
                        error={Boolean(errors.lName)}
                        helperText={
                          errors.lName
                            ? errors.lName.type === "minLength"
                              ? t("nav:validSurName")
                              : t("nav:proveSurName")
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
                            ? t("nav:validEmail")
                            : t("nav:proveEmail")
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
                    fullWidth
                    defaultValue=""
                    rules={{
                      required: true,
                      minLength: 6,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        id="password"
                        fullWidth
                        label={t("nav:password")}
                        inputProps={{ type: "password" }}
                        error={Boolean(errors.password)}
                        helperText={
                          errors.password
                            ? errors.password.type === "minLength"
                              ? t("nav:passwordMin")
                              : t("nav:enterAPassword")
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
                        label={t("nav:passwordConfirm")}
                        inputProps={{ type: "password" }}
                        error={Boolean(errors.passwordConfirm)}
                        helperText={
                          errors.passwordConfirm
                            ? errors.passwordConfirm.type === "minLength"
                              ? t("nav:passwordMin")
                              : t("nav:enterAPassword")
                            : ""
                        }
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
              </div>
              <ListItem
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2rem",
                }}
              >
                <PhoneInput
                  country={"tr"}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  disabled={OTPResult === "success" ? true : false}
                  inputStyle={{
                    height: "3rem",
                    fontSize: "1rem",
                    width: "100%",
                  }}
                />
                {isOTPSent ? (
                  <>
                    {OTPResult !== "success" ? (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "2rem",
                        }}
                      >
                        <TextField
                          fullWidth
                          type="number"
                          id="otp"
                          label="Kodu Giriniz"
                          error={errorOTP}
                          helperText={
                            errorOTP ? "Lütfen Onay Kodunu Giriniz" : ""
                          }
                          value={enteredOTP}
                          onChange={(e) => setEnteredOTP(e.target.value)}
                        ></TextField>
                        <ButtonNext
                          bordered
                          auto
                          onClick={(e) => {
                            if (enteredOTP?.toString().length === 4) {
                              setErrorOTP(false);
                              handleCheckOTP(e);
                            } else {
                              setErrorOTP(true);
                            }
                          }}
                        >
                          Gönder
                        </ButtonNext>
                      </div>
                    ) : (
                      <VerifiedIcon color="success" />
                    )}
                  </>
                ) : (
                  <ButtonNext
                    bordered
                    disabled={phoneNumber ? false : true}
                    onClick={handleSendOTP}
                    style={{ width: "90%" }}
                  >
                    <span>Kod Gönder</span>
                  </ButtonNext>
                )}
              </ListItem>
              {isSentFormWithNotOTP && (
                <p
                  align="center"
                  style={{ color: "#d90429", fontSize: "14px" }}
                >
                  Lütfen Telefon Numaranızı Onaylayınız.
                </p>
              )}

              <div className={styles.aggreement}>
                {router.locale === "tr" ? (
                  <div className={styles.privacy}>
                    <p>
                      Kişisel verileriniz,
                      <a
                        href="/gizlilik-politikasi"
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                        target="_blank"
                      >
                        Gizlilik Politikası
                      </a>
                      kapsamında işlenmektedir. “Üye ol” butonuna basarak
                      <a
                        href="/uyelik-sozlesmesi"
                        target="_blank"
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                      >
                        Üyelik Sözleşmesi
                      </a>
                      ’ni, ve
                      <a
                        href="/cerez-politikasi"
                        target="_blank"
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                      >
                        Çerez Politikası
                      </a>
                      ’nı okuduğunuzu ve kabul ettiğinizi onaylıyorsunuz.
                    </p>
                  </div>
                ) : (
                  <p style={{ textAlign: "center" }}>
                    Click “Sign Up” to agree to Digicafes&apos;
                    <LinkRouter href="/terms-of-service" passHref>
                      <span
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                      >
                        Terms of Service
                      </span>
                    </LinkRouter>
                    and acknowledge that Digicafes&apos;
                    <LinkRouter href="/privacy-policy" passHref>
                      <span
                        style={{
                          fontWeight: "600",
                          cursor: "pointer",
                          margin: "0 4px",
                        }}
                      >
                        Privacy Policy
                      </span>
                    </LinkRouter>
                    applies to you.
                  </p>
                )}
              </div>
              <ListItem>
                <ButtonNext
                  flat
                  color="primary"
                  auto
                  style={{ width: "100%" }}
                  onClick={handleSubmit(registerHandlerDefault)}
                >
                  {t("nav:signUp")}
                </ButtonNext>
              </ListItem>
            </List>
          </form>
        </Box>
      </ModalMui>
      <ul className={styles.list}>
        <li className={styles.left}>
          <LinkRouter href="/" passHref>
            {!fix ? (
              <Image
                src={logoDark}
                objectFit="contain"
                width="160px"
                height="100px"
              ></Image>
            ) : (
              <Image
                src={logo}
                width="160px"
                objectFit="contain"
                height="100px"
              ></Image>
            )}
          </LinkRouter>

          {router.pathname === "/digital-menu" && (
            <div className={styles.headers}>
              <Link
                to="features"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:features")}</h5>
              </Link>
              <Link
                to="process"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:process")}</h5>
              </Link>
              <Link
                to="paketler"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:services")}</h5>
              </Link>
              <Link
                to="faq"
                spy={true}
                smooth={true}
                offset={-200}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:faq")}</h5>
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:contact")}</h5>
              </Link>
            </div>
          )}
          {router.pathname === "/booking" && (
            <div className={styles.headers}>
              <Link
                to="features"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:features")}</h5>
              </Link>
              <Link
                to="process"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:process")}</h5>
              </Link>
              <Link
                to="paketler"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:services")}</h5>
              </Link>
              <Link
                to="faq"
                spy={true}
                smooth={true}
                offset={-200}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:faq")}</h5>
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:contact")}</h5>
              </Link>
            </div>
          )}
          {router.pathname === "/" && (
            <div className={styles.headers}>
              <Link
                to="faq"
                spy={true}
                smooth={true}
                offset={-200}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:faq")}</h5>
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:contact")}</h5>
              </Link>
            </div>
          )}
        </li>
        {user ? (
          <div className={styles.profileMenu}>
            <Button
              id="composition-button"
              aria-controls={open ? "composition-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              className={styles.dropdown}
              ref={anchorRef}
              onClick={handleToggle}
            >
              <AccountCircleRounded />
              <div className={styles.username}>
                <h6>{user?.firstName}</h6>
                <h6>{user?.lastName}</h6>
              </div>
            </Button>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "left top" : "left bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                      >
                        {user?.isAdmin === false ? (
                          <>
                            <button
                              className={styles.button}
                              onClick={() => {
                                if (router?.pathname !== "/account/[userId]") {
                                  setIsFetching(true);
                                }
                              }}
                            >
                              <LinkRouter
                                href={"/account/" + user?.id}
                                className={styles["menu-link"]}
                                passHref
                              >
                                <button className={styles["link-item"]}>
                                  {t("nav:myAccount")}
                                </button>
                              </LinkRouter>
                            </button>
                            <button
                              className={styles.button}
                              onClick={() => {
                                if (
                                  router?.pathname !== "/dashboard/[userId]"
                                ) {
                                  setIsFetching(true);
                                }
                              }}
                            >
                              {user?.userType === "Store Owner" && (
                                <LinkRouter
                                  href={"/dashboard/" + user.id}
                                  passHref
                                  className={styles["menu-link"]}
                                >
                                  <button className={styles["link-item"]}>
                                    <span>{t("nav:dashboard")}</span>
                                  </button>
                                </LinkRouter>
                              )}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={styles.button}
                              onClick={() => {
                                if (router?.pathname !== "/admin/dashboard") {
                                  setIsFetching(true);
                                }
                              }}
                            >
                              <LinkRouter
                                href="/admin/dashboard"
                                className={styles["menu-link"]}
                                passHref
                              >
                                <button className={styles["link-item"]}>
                                  Admin Panel
                                </button>
                              </LinkRouter>
                            </button>
                          </>
                        )}
                        <button
                          className={styles.button}
                          onClick={logoutHandler}
                        >
                          <LinkRouter
                            href="/"
                            passHref
                            className={styles["menu-link"]}
                          >
                            <button className={styles["link-item"]}>
                              <span>{t("nav:logout")}</span>
                              <LogoutIcon className={styles.icon} />
                            </button>
                          </LinkRouter>
                        </button>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            {locales.map((lng) => {
              if (lng === lang) return null;
              return (
                <div className={styles.int} key={lng}>
                  <LinkRouter href={`/${lng}/${router.asPath}`} locale={lng}>
                    <span className={styles.lang}>
                      {t(`nav:language-name-${lng}`)}
                    </span>
                  </LinkRouter>
                </div>
              );
            })}
          </div>
        ) : (
          <li className={styles.rightXL}>
            <button
              className={styles.signIn}
              onClick={() => handleOpenMuiLogin(true)}
            >
              {t("nav:signIn")}
            </button>
            {router.pathname === "/digital-menu" && (
              <button
                className={styles.signUp}
                onClick={() => handleOpenMuiRegisterDigitalMenu(true)}
              >
                {t("nav:tryForFree")}
              </button>
            )}
            {router.pathname === "/booking" && (
              <button
                className={styles.signUp}
                onClick={() => handleOpenMuiRegisterBooking(true)}
              >
                {t("nav:tryForFree")}
              </button>
            )}
            {router.pathname === "/booking/[storeLinkName]" && (
              <button
                className={styles.signUp}
                onClick={() => handleOpenMuiRegisterDefault(true)}
              >
                Üye Ol
              </button>
            )}
            {router.pathname === "/" && (
              <button
                className={styles.signUp}
                onClick={() => handleOpenMuiRegisterDefault(true)}
              >
                Üye Ol
              </button>
            )}
            {locales.map((lng) => {
              if (lng === lang) return null;
              return (
                <div className={styles.int} key={lng}>
                  <LinkRouter href={`/${lng}/${router.asPath}`} locale={lng}>
                    <span className={styles.lang}>
                      {t(`nav:language-name-${lng}`)}
                    </span>
                  </LinkRouter>
                </div>
              );
            })}
          </li>
        )}
        <Hidden mdUp>
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
        <div className={styles.right}>
          {user ? (
            <div className={styles.profileMenuMobile}>
              <Button
                id="composition-button"
                aria-controls={open ? "composition-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                className={styles.dropdown}
                ref={anchorRef}
                onClick={handleToggle}
              >
                <AccountCircleRounded />
                <div className={styles.username}>
                  <h6>{user?.firstName}</h6>
                  <h6>{user?.lastName}</h6>
                </div>
              </Button>

              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom-start"
                          ? "left top"
                          : "left bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                          onKeyDown={handleListKeyDown}
                        >
                          {user?.isAdmin === false ? (
                            <>
                              <button
                                className={styles.button}
                                onClick={() => {
                                  if (
                                    router?.pathname !== "/account/[userId]"
                                  ) {
                                    setIsFetching(true);
                                  }
                                }}
                              >
                                <LinkRouter
                                  href={"/account/" + user?.id}
                                  className={styles["menu-link"]}
                                  passHref
                                >
                                  <button className={styles["link-item"]}>
                                    {t("nav:myAccount")}
                                  </button>
                                </LinkRouter>
                              </button>
                              <button
                                className={styles.button}
                                onClick={() => {
                                  if (
                                    router?.pathname !== "/dashboard/[userId]"
                                  ) {
                                    setIsFetching(true);
                                  }
                                }}
                              >
                                {user?.userType === "Store Owner" && (
                                  <LinkRouter
                                    href={"/dashboard/" + user.id}
                                    passHref
                                    className={styles["menu-link"]}
                                  >
                                    <button className={styles["link-item"]}>
                                      <span>{t("nav:dashboard")}</span>
                                    </button>
                                  </LinkRouter>
                                )}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className={styles.button}
                                onClick={() => {
                                  if (router?.pathname !== "/admin/dashboard") {
                                    setIsFetching(true);
                                  }
                                }}
                              >
                                <LinkRouter
                                  href="/admin/dashboard"
                                  className={styles["menu-link"]}
                                  passHref
                                >
                                  <button className={styles["link-item"]}>
                                    Admin Panel
                                  </button>
                                </LinkRouter>
                              </button>
                            </>
                          )}
                          <button
                            className={styles.button}
                            onClick={logoutHandler}
                          >
                            <LinkRouter
                              href="/"
                              passHref
                              className={styles["menu-link"]}
                            >
                              <button className={styles["link-item"]}>
                                <span>{t("nav:logout")}</span>
                                <LogoutIcon className={styles.icon} />
                              </button>
                            </LinkRouter>
                          </button>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
              {locales.map((lng) => {
                if (lng === lang) return null;
                return (
                  <div className={styles.int} key={lng}>
                    <LinkRouter href={`/${lng}/${router.asPath}`} locale={lng}>
                      <span className={styles.lang}>
                        {t(`nav:language-name-${lng}`)}
                      </span>
                    </LinkRouter>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.buttons}>
              {locales.map((lng) => {
                if (lng === lang) return null;
                return (
                  <div className={styles.int} key={lng}>
                    <LinkRouter href={`/${lng}/${router.asPath}`} locale={lng}>
                      <span className={styles.lang}>
                        {t(`nav:language-name-${lng}`)}
                      </span>
                    </LinkRouter>
                  </div>
                );
              })}
              <button className={styles.signIn} onClick={handleOpenMuiLogin}>
                {t("nav:signIn")}
              </button>
              {router.pathname === "/digital-menu" && (
                <button
                  className={styles.signUp}
                  onClick={() => registerHandlerDigitalMenu(true)}
                >
                  {t("nav:tryForFree")}
                </button>
              )}
              {router.pathname === "/booking" && (
                <button
                  className={styles.signUp}
                  onClick={() => handleOpenMuiRegisterBooking(true)}
                >
                  {t("nav:tryForFree")}
                </button>
              )}
              {router.pathname === "/" && (
                <button
                  className={styles.signUp}
                  onClick={() => handleOpenMuiRegisterDefault(true)}
                >
                  Üye Ol
                </button>
              )}
            </div>
          )}
          {router.pathname === "/digital-menu" && (
            <div>
              <Link
                to="features"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:features")}</h5>
              </Link>
              <Link
                to="process"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:process")}</h5>
              </Link>
              <Link
                to="paketler"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:services")}</h5>
              </Link>
              <Link
                to="faq"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:faq")}</h5>
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:contact")}</h5>
              </Link>
            </div>
          )}
          {router.pathname === "/booking" && (
            <div>
              <Link
                to="features"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:features")}</h5>
              </Link>
              <Link
                to="process"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:process")}</h5>
              </Link>
              <Link
                to="paketler"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:services")}</h5>
              </Link>
              <Link
                to="faq"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:faq")}</h5>
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>{t("nav:contact")}</h5>
              </Link>
            </div>
          )}
        </div>
      </SwipeableDrawer>
    </navbar>
  );
};

export default Nav;
