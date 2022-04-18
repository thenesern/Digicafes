import { Router, useRouter } from "next/router";
import React, { useContext } from "react";
import styles from "./products.module.css";
import db from "../../../../../utils/db.js";
import QRMenu from "../../../../../models/QRMenu2Model.js";
import Link from "next/link";
import { Badge, Button } from "@material-ui/core";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import { useState } from "react";
import { Box, Divider, IconButton, SwipeableDrawer } from "@material-ui/core";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ShoppingCartOutlined } from "@material-ui/icons";
import { Store } from "../../../../../redux/store";
import Order from "../../../../../models/OrderModel";
import Product from "../../../../../models/ProductModel";
import { useEffect } from "react";

const StoreMenu = ({ menu, category, order }) => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const quantity = cart?.length;
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState(null);
  const cartItems = [...cart];
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setProductName("");
    setProductImage("");
    setProductPrice(null);
  };
  const [isFetching, setIsFetching] = useState(false);
  const filtered = menu?.products.filter((a) => a.category.includes(category));
  const addToCartHandler = (name) => {
    cartItems.push({ name });
    dispatch({ type: "CART", payload: cartItems });
  };
  const [version, setVersion] = useState("");
  useEffect(() => {
    if (order[0]?.product?.name === "Dijital Menü - V1") {
      setVersion("v1");
    } else {
      setVersion("v2");
    }
  }, [order]);

  return (
    <div className={styles.container}>
      <navbar className={styles.navbar}>
        <Link href={`/qr/${version}/` + menu?.storeName} passHref>
          <Button
            onClick={() => {
              try {
                setIsFetching(true);
              } catch (err) {
                console.log(err);
                setIsFetching(false);
              }
            }}
          >
            <ArrowBackIosNewIcon
              style={{ color: "f7ede2", fontSize: "14px" }}
            />
            <p className={styles.back}>Geri</p>
          </Button>
        </Link>
        {menu?.storeLogo?.includes("cloudinary") ? (
          <img src={menu?.storeLogo} alt="Logo" className={styles.logo} />
        ) : (
          <span className={styles.logo}>{menu?.storeLogo}</span>
        )}

        <div className={styles.cart}>
          <Badge
            badgeContent={quantity}
            color="primary"
            style={{ transform: "scale(0.9)" }}
          >
            <ShoppingCartOutlined style={{ color: "#f7ede2" }} />
          </Badge>
        </div>
      </navbar>
      <ul className={styles.list}>
        <Modal
          open={openModal}
          style={{
            width: "92%",
            margin: "0 auto",
          }}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box>
            <div className={styles.modalHeader}>
              <h3>{productName}</h3>
              <span>₺{productPrice}</span>
            </div>
            <img src={productImage} alt="Menu" className={styles.modalImage} />
            <p className={styles.modalDesc}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium porro natus sequi eaque accusantium molestiae
              blanditiis consectetur est vero accusamus ipsam officiis ipsum.
            </p>
          </Box>
        </Modal>
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
          filtered?.map((m) => (
            <li key={m?.name}>
              <div
                className={styles.listItem}
                onClick={() => {
                  setProductName(m?.name);
                  setProductImage(m?.image);
                  setProductPrice(m?.price);
                  handleOpenModal();
                }}
              >
                <img className={styles.img} src={m?.image} alt="" />
                <div className={styles.bottom}>
                  <h3 className={styles.name}>{m?.name}</h3>
                  <p className={styles.price}>₺{m?.price}</p>
                </div>
              </div>
              <Button
                variant="outlined"
                color="primary"
                style={{
                  borderRadius: " 0",
                  backgroundColor: "#023047",
                  color: "#f7ede2",
                }}
                fullWidth
                onClick={() => addToCartHandler(m?.name)}
              >
                Sepete Ekle
              </Button>
            </li>
          ))}
      </ul>
      <footer></footer>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { category } = context.query;
  const { storeName } = context.query;
  await db.connect();
  const menu = await QRMenu.findOne({
    storeName: storeName,
  }).lean();
  const order = await Order.findOne({ menuv2: menu?._id }).populate({
    path: "product",
    model: Product,
  });
  await db.disconnect();
  return {
    props: {
      menu: JSON.parse(JSON.stringify(menu)),
      category,
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}
export default StoreMenu;
