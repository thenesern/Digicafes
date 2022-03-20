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
  console.log(user);
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
    console.log("ğ");
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
              <h6 className={styles.username}>
                {user?.firstName} {user?.lastName}
              </h6>
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
              }}
            >
              <button className={styles.button}>
                <Link href="/profile" className={styles["menu-link"]} passHref>
                  <div className={styles["link-item"]}>Profile</div>
                </Link>
              </button>

              <button className={styles.button} onClick={logoutHandler}>
                <Link href="/" passHref className={styles["menu-link"]}>
                  <div className={styles["link-item"]}>
                    <span>Log out</span>
                    <LogoutIcon className={styles.icon} />
                  </div>
                </Link>
              </button>
            </Menu>
          </>
        ) : (
          <li className={styles.right}>
            <Link href="/login" passHref>
              <button className={styles.signIn}>Giriş Yap</button>
            </Link>
            <Link href="/register" passHref>
              <button className={styles.signUp}>Üye Ol</button>
            </Link>
          </li>
        )}
      </ul>
    </navbar>
  );
};

export default Navbar;
