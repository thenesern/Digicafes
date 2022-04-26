import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./store.module.css";
import db from "../../../../utils/db.js";
import QRMenu from "../../../../models/QRMenu2Model.js";
import { Link, Loading, Modal, Spacer } from "@nextui-org/react";
import {
  Button,
  Divider,
  IconButton,
  SwipeableDrawer,
} from "@material-ui/core";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const StoreMenu = ({ menu }) => {
  const [open, setOpen] = useState(false);

  const Router = useRouter();
  const [isFetching, setIsFetching] = useState(false);

  return (
    <div className={styles.container}>
      <navbar className={styles.navbar}>
        {menu?.storeLogo?.includes("cloudinary") ? (
          <img src={menu?.storeLogo} alt="Logo" className={styles.logo} />
        ) : (
          <h6 className={styles.logo}>{menu?.storeLogo}</h6>
        )}
        <IconButton onClick={() => setOpen(true)}>
          <MenuIcon style={{ color: "white", fontSize: "2rem" }} />
        </IconButton>
        <SwipeableDrawer
          anchor="right"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
        >
          <IconButton>
            <ChevronRightIcon onClick={() => setOpen(true)} />
            <Divider />
          </IconButton>
          <ul className={styles.navList}>
            {menu &&
              menu?.categories?.map((m) => (
                <li
                  onClick={() => {
                    try {
                      setIsFetching(true);
                      Router.push(
                        `/qr/v2/${menu?.storeName}/products/${m?.name}`
                      );
                    } catch (err) {
                      console.log(err);
                      setIsFetching(false);
                    }
                  }}
                  key={m?.name}
                >
                  <h3>{m?.name}</h3>
                </li>
              ))}
          </ul>
        </SwipeableDrawer>
      </navbar>

      <ul className={styles.list}>
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
        {menu &&
          menu?.categories?.map((m) => (
            <div
              onClick={() => {
                try {
                  setIsFetching(true);
                  Router.push(`/qr/v2/${menu?.storeName}/products/${m?.name}`);
                } catch (err) {
                  console.log(err);
                  setIsFetching(false);
                }
              }}
              key={m?.name}
              className={styles.listItem}
              style={{ backgroundImage: `url(${m?.image})` }}
            >
              <div className={styles.titleBack}>
                <h3 className={styles.title}>{m?.name}</h3>
              </div>
            </div>
          ))}
      </ul>

      <footer></footer>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { storeName } = context.query;
  await db.connect();
  const menu = await QRMenu.findOne({
    storeName,
  });
  await db.disconnect();
  return {
    props: {
      menu: JSON.parse(JSON.stringify(menu)),
    },
  };
}
export default StoreMenu;
