import React, { useState, useContext } from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import Cookies from "js-cookie";
import { Button, Menu } from "@material-ui/core";
import LogoutIcon from "@mui/icons-material/Logout";
import { AccountCircleRounded } from "@material-ui/icons";
import Fade from "@mui/material/Fade";
import { Store } from "../../redux/store";
import { useRouter } from "next/router";

const Navbar = () => {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { useInfo } = state;
  let user;
  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
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
    router.push("/");
  };
  return (
    <navbar className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.left}>
          <Link href="/" passHref>
            <h6 className={styles.logo}>Logo</h6>
          </Link>
          <div className={styles.headers}>
            <Link href="/services">Çözümlerimiz</Link>
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
            <Link href="/giris" passHref>
              <button className={styles.signIn}>Giriş Yap</button>
            </Link>
            <Link href="/kayit" passHref>
              <button className={styles.signUp}>Üye Ol</button>
            </Link>
          </li>
        )}
      </ul>
    </navbar>
  );
};

export default Navbar;
