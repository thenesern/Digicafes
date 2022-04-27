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
import axios from "axios";

const StoreMenu = ({ menu }) => {
  const [open, setOpen] = useState(false);
  const [storeName, setStoreName] = useState(menu?.storeName);
  const Router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [callName, setCallName] = useState("");
  const [tableNum, setTableNum] = useState(1);

  const handleCalls = async ({ callName }) => {
    setIsFetching(true);
    const createdAt = new Date().toLocaleString("tr-TR");
    try {
      await axios.patch(`/api/qr/v2/${storeName}/calls`, {
        calls: [{ tableNum, createdAt, callName }],
        storeName,
      });
      setIsFetching(false);
      setCallName("");
    } catch (err) {
      setIsFetching(false);
      console.log(err);
    }
  };

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
          <ul className={styles.navList}>
            <Button
              variant="contained"
              style={{ margin: "10px auto", minWidth: "10rem" }}
              color="primary"
              onClick={() => {
                handleCalls({ callName: "Garson Çağrısı" });
              }}
            >
              Garson Çağır
            </Button>
            <Button
              variant="contained"
              style={{ margin: "10px auto", minWidth: "10rem" }}
              color="primary"
              onClick={() => {
                handleCalls({ callName: "Hesap İsteği" });
              }}
            >
              Hesap İste
            </Button>
            <h3
              style={{
                borderBottom: "1px solid #f1faee",
                color: "#f1faee",
                width: "100%",
                paddingBottom: "10px",
                textAlign: "center",
              }}
            >
              Menü
            </h3>
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
