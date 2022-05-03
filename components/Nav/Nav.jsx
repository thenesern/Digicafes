// Packages and Dependencies
import React, { useState, useContext, useEffect } from "react";
import LinkRouter from "next/link";
import Cookies from "js-cookie";
import { Store } from "../../redux/store";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Backdrop from "@mui/material/Backdrop";
import { Link } from "react-scroll";
import { useRouter } from "next/router";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import ModalMui from "@mui/material/Modal";
import { Divider, Hidden, IconButton, SwipeableDrawer } from "@mui/material";
// Styles
import styles from "./Nav.module.css";
import { AccountCircleRounded } from "@material-ui/icons";
import LogoutIcon from "@mui/icons-material/Logout";
import Fade from "@mui/material/Fade";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MenuIcon from "@material-ui/icons/Menu";
import { Box } from "@mui/system";
import { List, ListItem, TextField } from "@material-ui/core";

const Nav = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [isFetching, setIsFetching] = useState(false);
  const [openMuiLogin, setOpenMuiLogin] = useState(false);
  const [openMuiRegister, setOpenMuiRegister] = useState(false);
  const handleOpenMuiLogin = () => setOpenMuiLogin(true);
  const handleOpenMuiRegister = () => setOpenMuiRegister(true);
  const handleCloseMuiLogin = () => setOpenMuiLogin(false);
  const handleCloseMuiRegister = () => setOpenMuiRegister(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [openMenu, setOpenMenu] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  let user;

  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
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

  const loginHandler = async ({ email, password }) => {
    closeSnackbar();
    const signedIn = new Date().toLocaleString("tr-TR");
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
      handleCloseMuiLogin();
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
    const signedIn = new Date().toLocaleString("tr-TR");
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
    const createdAt = new Date().toLocaleString("tr-TR");
    try {
      setIsFetching(true);
      const { data } = await axios.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        signedIn,
        createdAt,
        quantity: [14],
      });
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      setIsFetching(false);
      handleCloseMuiRegister();
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
              right: "3%",
              top: "3%",
              cursor: "pointer",
            }}
          >
            X
          </span>
          <div className={styles.wrapper}>
            <h1 className={styles.title}>Giriş Yap</h1>
            <div className={styles.signup}>
              <p>Hesabınız yok mu?</p>
              <span
                style={{ fontWeight: "600", cursor: "pointer" }}
                onClick={() => {
                  handleCloseMuiLogin();
                  handleOpenMuiRegister();
                }}
              >
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
                    variant="outlined"
                    color="secondary"
                    type="submit"
                    fullWidth
                    style={{ outline: "none" }}
                    onSubmit={handleSubmit(loginHandler)}
                  >
                    Giriş Yap
                  </Button>
                </ListItem>
              </List>
            </form>
          </div>
        </Box>
      </ModalMui>
      <ModalMui
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openMuiRegister}
        onClose={handleCloseMuiRegister}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box className={styles.registerBox}>
          {" "}
          <span
            onClick={handleCloseMuiRegister}
            style={{
              position: "absolute",
              right: "3%",
              top: "3%",
              cursor: "pointer",
            }}
          >
            X
          </span>
          <h1 className={styles.title}>Üye Ol</h1>
          <div className={styles.signin}>
            <p>Hesabınız var mı?</p>
            <span
              style={{ fontWeight: "600", cursor: "pointer" }}
              onClick={() => {
                handleCloseMuiRegister();
                handleOpenMuiLogin();
              }}
            >
              Giriş Yapın
            </span>
          </div>
          <form
            onSubmit={handleSubmit(registerHandler)}
            className={styles.form}
          >
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
              </div>
              <ListItem>
                <Button
                  variant="outlined"
                  color="secondary"
                  type="submit"
                  fullWidth
                  onSubmit={handleSubmit(registerHandler)}
                >
                  Üye Ol
                </Button>
              </ListItem>
            </List>
          </form>
        </Box>
      </ModalMui>
      <ul className={styles.list}>
        <li className={styles.left}>
          <LinkRouter href="/" passHref>
            <h6 className={styles.logo}>Logo</h6>
          </LinkRouter>
          {router.pathname === "/" && (
            <div className={styles.headers}>
              <Link
                to="features"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>Özellikler</h5>
              </Link>
              <Link
                to="process"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>İşleyiş</h5>
              </Link>
              <Link
                to="faq"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>Sıkça Sorulan Sorular</h5>
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>İletişim</h5>
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
                                if (router?.pathname !== "/hesap/[userId]") {
                                  setIsFetching(true);
                                }
                              }}
                            >
                              <LinkRouter
                                href={"/hesap/" + user?.id}
                                className={styles["menu-link"]}
                                passHref
                              >
                                <button className={styles["link-item"]}>
                                  Hesabım
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
                              <LinkRouter
                                href={"/dashboard/" + user.id}
                                passHref
                                className={styles["menu-link"]}
                              >
                                <button className={styles["link-item"]}>
                                  <span>Yönetim Paneli</span>
                                </button>
                              </LinkRouter>
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
                                  Panel
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
                              <span>Çıkış Yap</span>
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
          </div>
        ) : (
          <li className={styles.rightXL}>
            <button
              className={styles.signIn}
              onClick={() => handleOpenMuiLogin(true)}
            >
              Giriş Yap
            </button>
            <button
              className={styles.signUp}
              onClick={() => handleOpenMuiRegister(true)}
            >
              Ücretsiz Dene
            </button>
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
                                  if (router?.pathname !== "/hesap/[userId]") {
                                    setIsFetching(true);
                                  }
                                }}
                              >
                                <LinkRouter
                                  href={"/hesap/" + user?.id}
                                  className={styles["menu-link"]}
                                  passHref
                                >
                                  <button className={styles["link-item"]}>
                                    Hesabım
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
                                <LinkRouter
                                  href={"/dashboard/" + user.id}
                                  passHref
                                  className={styles["menu-link"]}
                                >
                                  <button className={styles["link-item"]}>
                                    <span>Yönetim Paneli</span>
                                  </button>
                                </LinkRouter>
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
                                    Panel
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
                                <span>Çıkış Yap</span>
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
            </div>
          ) : (
            <div className={styles.buttons}>
              <button className={styles.signIn} onClick={handleOpenMuiLogin}>
                Giriş Yap
              </button>
              <button className={styles.signUp} onClick={handleOpenMuiRegister}>
                Ücretsiz Dene
              </button>
            </div>
          )}
          {router.pathname === "/" && (
            <div>
              <Link
                to="features"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>Özellikler</h5>
              </Link>
              <Link
                to="process"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>İşleyiş</h5>
              </Link>

              <Link
                to="faq"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>Sıkça Sorulan Sorular</h5>
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-80}
                duration={200}
              >
                <h5 className={styles.link}>İletişim</h5>
              </Link>
            </div>
          )}
        </div>
      </SwipeableDrawer>
    </navbar>
  );
};

export default Nav;
