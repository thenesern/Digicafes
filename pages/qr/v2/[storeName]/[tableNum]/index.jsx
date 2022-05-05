import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./store.module.css";
import db from "../../../../../utils/db.js";
import QRMenu from "../../../../../models/QRMenu2Model.js";
import { Link, Loading, Modal, Spacer } from "@nextui-org/react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  SwipeableDrawer,
} from "@material-ui/core";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect } from "react";
import Order from "../../../../../models/OrderModel";
import Image from "next/image";
import FmdBadIcon from "@mui/icons-material/FmdBad";

const StoreMenu = ({ menu, number }) => {
  const [open, setOpen] = useState(false);
  const [storeName, setStoreName] = useState(menu?.storeName);
  const Router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [waiterModal, setWaiterModal] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const handleOpenWaiterModal = () => setWaiterModal(true);
  const handleOpenTableModal = () => setTableModal(true);
  const handleCloseWaiterModal = () => setWaiterModal(false);
  const handleCloseTableModal = () => setTableModal(false);
  const [callName, setCallName] = useState("");
  const [tableNum, setTableNum] = useState(number);
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }
  }, [isSuccess]);
  const handleCalls = async ({ callName }) => {
    setIsFetching(true);
    const createdAt = new Date().toLocaleString("tr-TR");
    try {
      const response = await axios.patch(`/api/qr/v2/${storeName}/calls`, {
        calls: [{ tableNum, createdAt, callName }],
        storeName,
      });
      if (response.data.status === "success") {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
      setIsFetching(false);
      setCallName("");
    } catch (err) {
      setIsFetching(false);
      console.log(err);
    }
  };
  return (
    <div className={styles.container}>
      <Modal
        style={{ width: "90%", margin: "0 auto" }}
        open={isSuccess}
        onClose={() => setIsSuccess(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Modal.Body
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem",
          }}
        >
          <CheckCircleIcon style={{ fontSize: "8rem" }} color="success" />
          <h1>Talebiniz iletildi.</h1>
        </Modal.Body>
      </Modal>
      <navbar className={styles.navbar}>
        {menu?.storeLogo?.includes("cloudinary") ? (
          <img src={menu?.storeLogo} alt="Logo" className={styles.logo} />
        ) : (
          <h4 className={styles.storeName}>{menu?.storeName.toUpperCase()}</h4>
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
              style={{
                margin: "10px auto",
                minWidth: "10rem",
                backgroundColor: "#457b9d",
              }}
              color="primary"
              onClick={handleOpenWaiterModal}
            >
              Garson Çağır
            </Button>
            <Button
              variant="contained"
              style={{
                margin: "10px auto",
                minWidth: "10rem",
                backgroundColor: "#457b9d",
              }}
              color="primary"
              onClick={handleOpenTableModal}
            >
              Hesap İste
            </Button>
            {!menu?.categories.length == 0 && (
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
            )}
            {menu &&
              menu?.categories?.map((m) => (
                <li
                  onClick={() => {
                    try {
                      setIsFetching(true);
                      Router.push(
                        `/qr/v2/${menu?.storeName}/${tableNum}/products/${m?.name}`
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
      {menu?.categories.length == 0 && (
        <div className={styles.notFound}>
          <FmdBadIcon style={{ fontSize: "3rem", color: "#001219" }} />
          <h3>Bu iş yerinde Dijital Menü henüz düzenlenmedi.</h3>
        </div>
      )}
      {menu?.categories.length > 0 && (
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
          <Modal
            style={{ width: "90%", margin: "0 auto" }}
            onClose={handleCloseWaiterModal}
            aria-labelledby="modal-title"
            open={waiterModal}
          >
            <Modal.Header>
              <h1>Emin misiniz?</h1>
            </Modal.Header>
            <Modal.Body style={{ margin: "1rem 10px" }}>
              <p>Garson Çağrınız iletilecek.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="contained" onClick={handleCloseWaiterModal}>
                Vazgeç
              </Button>
              <Button
                style={{ marginLeft: "2rem " }}
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleCalls({ callName: "Garson Çağrısı" });
                  handleCloseWaiterModal();
                }}
              >
                Onayla
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            style={{ width: "90%", margin: "0 auto" }}
            onClose={handleCloseTableModal}
            aria-labelledby="modal-title"
            open={tableModal}
          >
            <Modal.Header>
              <h1>Emin misiniz?</h1>
            </Modal.Header>
            <Modal.Body style={{ margin: "1rem 10px" }}>
              <p>Hesap İsteğiniz iletilecek.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="contained" onClick={handleCloseTableModal}>
                Vazgeç
              </Button>
              <Button
                style={{ marginLeft: "2rem " }}
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleCalls({ callName: "Hesap Çağrısı" });
                  handleCloseTableModal();
                }}
              >
                Onayla
              </Button>
            </Modal.Footer>
          </Modal>
          {menu &&
            menu?.categories?.map((m) => (
              <div
                key={m?.name}
                className={styles.listItem}
                onClick={() => {
                  try {
                    setIsFetching(true);
                    Router.push(
                      `/qr/v2/${menu?.storeName}/${tableNum}/products/${m?.name}`
                    );
                  } catch (err) {
                    console.log(err);
                    setIsFetching(false);
                  }
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <Image
                    priority
                    layout="fill"
                    src={m?.image}
                    className={styles.img}
                    alt={m?.name}
                  ></Image>
                </div>
                <div className={styles.titleBack}>
                  <h3 className={styles.title}>{m?.name}</h3>
                </div>
              </div>
            ))}
        </ul>
      )}

      <footer></footer>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { storeName } = context.query;
  const { tableNum } = context.query;
  await db.connect();
  const menu = await QRMenu.findOne({
    storeName,
  });

  const order = await Order.findOne({ menuv2: menu?._id });
  const newDate = new Date();
  if (
    new Date(order?.expiry?.toString()).getTime() > newDate.getTime() ===
    false
  ) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  await db.disconnect();
  return {
    props: {
      menu: JSON.parse(JSON.stringify(menu)),
      number: tableNum,
    },
  };
}
export default StoreMenu;
