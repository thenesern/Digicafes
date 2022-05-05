import { Router, useRouter } from "next/router";
import React, { useContext } from "react";
import styles from "./products.module.css";
import db from "../../../../../../utils/db.js";
import QRMenu from "../../../../../../models/QRMenu2Model.js";
import Link from "next/link";
import { Badge, Button } from "@material-ui/core";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Loading, Modal, Spacer, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { Box, Divider, IconButton, SwipeableDrawer } from "@material-ui/core";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ShoppingCartOutlined } from "@material-ui/icons";
import { Store } from "../../../../../../redux/store";
import Order from "../../../../../../models/OrderModel";
import Product from "../../../../../../models/ProductModel";
import { useEffect } from "react";
import axios from "axios";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { GridCheckCircleIcon } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const StoreMenu = ({ menu, category, order, number }) => {
  const [storeName, setStoreName] = useState(menu?.storeName);
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const quantity = cart?.length;
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [tableNum, setTableNum] = useState(number);
  const [cartTotal, setCartTotal] = useState(null);
  const [cartItems, setCartItems] = useState([...cart]);
  const [openIsSure, setOpenIsSure] = useState(false);
  const [isSure, setIsSure] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleOpenIsSure = () => {
    setOpenCart(false);
    setOpenIsSure(true);
  };
  const handleOpenCart = () => setOpenCart(true);
  const handleCloseCart = () => {
    setOpenCart(false);
    setOrderNotes("");
  };
  const handleCloseOpenIsSure = () => setOpenIsSure(false);
  const handleCloseModal = () => {
    setOpenModal(false);
    setProductName("");
    setProductImage("");
    setProductPrice(null);
    setProductDescription("");
    setOrderNotes("");
  };
  const [isFetching, setIsFetching] = useState(false);
  const filtered = menu?.products.filter((a) => a.category.includes(category));
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSure) {
      handleCartOrder();
      setIsSure(false);
      handleCloseOpenIsSure();
    }
  }, [isSure]);
  const handleCartOrder = async () => {
    setIsFetching(true);
    const createdAt = new Date();
    try {
      const response = await axios.patch(`/api/qr/v2/${storeName}/orders`, {
        orders: [{ cartItems, tableNum, createdAt, orderNotes }],
        storeName,
      });
      if (response.data.status === "success") {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
      setIsFetching(false);
      handleCloseCart();
    } catch (err) {
      setIsFetching(false);
      handleCloseCart();
      console.log(err);
    }
  };

  const addToCartHandler = ({ name, price, quantity, img }) => {
    if (cartItems.find((a) => a.name === name)) {
      cartItems.find((item) => item.name === name).quantity += quantity;
    } else {
      cartItems.push({ name, price, quantity, img });
    }
    setCartTotal(
      cartItems.reduce(function (a, b) {
        return a + b.price * b.quantity;
      }, 0)
    );
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
        <Link
          href={`/qr/${version}/` + menu?.storeName + "/" + tableNum}
          passHref
        >
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
            onClick={handleOpenCart}
            style={{ padding: "6px" }}
          >
            <ShoppingCartOutlined style={{ color: "#f7ede2" }} />
          </Badge>
        </div>
      </navbar>
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
      <ul className={styles.list}>
        <Modal
          open={openModal}
          className={styles.modal}
          animated="true"
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
            <p className={styles.modalDesc}>{productDescription}</p>
          </Box>
        </Modal>
        <Modal
          open={openCart}
          className={styles.cartModal}
          onClose={handleCloseCart}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{
            padding: "4px",
            width: "92%",
            maxHeight: "24rem",
            overFlow: "auto",
          }}
        >
          <Modal.Header>
            <h2>Sepet Özeti</h2>
          </Modal.Header>
          <Modal.Body style={{ padding: "1rem 0" }}>
            {cartItems?.map((item) => (
              <>
                <div key={Math.random()} className={styles.cart}>
                  <div className={styles.cartHeader}>
                    <img src={item?.img} alt="" className={styles.cartImg} />
                    <h4
                      style={{
                        maxWidth: "8rem",
                        overflow: "scroll",
                        fontSize: "14px",
                      }}
                    >
                      {item?.name}
                    </h4>
                  </div>
                  <div className={styles.productQuantity}>
                    <Button
                      className={styles.buttons}
                      variant="outlined"
                      style={{
                        minWidth: "1rem",
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                      onClick={() => {
                        if (item.quantity > 1) {
                          item.quantity -= 1;
                          setCartItems([...cartItems]);
                          setCartTotal(
                            cartItems.reduce(function (a, b) {
                              return a + b.price * b.quantity;
                            }, 0)
                          );
                          dispatch({ type: "CART", payload: cartItems });
                        } else if (
                          item.quantity - 1 === 0 &&
                          cartItems.length - 1 !== 0
                        ) {
                          setCartItems(
                            cartItems.filter((product) => product !== item)
                          );
                          setCartTotal(
                            cart.reduce(function (a, b) {
                              return a + b.price * b.quantity;
                            }, 0)
                          );
                          dispatch({ type: "CART", payload: cartItems });
                        } else {
                          {
                            setCartItems([]);
                            setCartTotal(0);
                            dispatch({ type: "CART", payload: [] });
                          }
                        }
                      }}
                    >
                      <ArrowCircleDownIcon style={{ fontSize: "2rem" }} />
                    </Button>
                    <h4>x{item?.quantity}</h4>
                    <Button
                      style={{
                        minWidth: "1rem",
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                      variant="outlined"
                      className={styles.buttons}
                      onClick={() => {
                        item.quantity += 1;
                        setCartItems([...cartItems]);
                        setCartTotal(
                          cartItems.reduce(function (a, b) {
                            return a + b.price * b.quantity;
                          }, 0)
                        );
                        dispatch({ type: "CART", payload: cartItems });
                      }}
                    >
                      <ArrowCircleUpIcon style={{ fontSize: "2rem" }} />
                    </Button>
                  </div>
                </div>
              </>
            ))}
            {cart.length === 0 && (
              <p style={{ padding: "1rem" }}>Sepetiniz boş.</p>
            )}
          </Modal.Body>
          <Modal.Footer className={styles.cartFooter}>
            {cart.length > 0 && <div>Toplam: ₺{cartTotal}</div>}
            {cart.length > 0 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenIsSure}
              >
                Siparişi Onayla
              </Button>
            )}
          </Modal.Footer>
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

        <Modal
          style={{ width: "92%", margin: "0 auto", padding: "4px" }}
          open={openIsSure}
          onClose={handleCloseOpenIsSure}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Modal.Header style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{ padding: "0", margin: "0" }}>Dikkat</h3>
            <p>Siparişiniz iletilecek.</p>
          </Modal.Header>
          <Modal.Body>
            <h5>Not Ekle</h5>
            <Textarea
              placeholder="Mesajınız. (Boş Bırakabilirsiniz)"
              onChange={(e) => setOrderNotes(e.target.value)}
            ></Textarea>
          </Modal.Body>
          <Modal.Footer style={{ display: "flex", gap: "2rem" }}>
            <Button variant="outlined" onClick={handleCloseOpenIsSure}>
              Vazgeç
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setIsSure(true)}
            >
              Onayla
            </Button>
          </Modal.Footer>
        </Modal>
        {menu &&
          filtered?.map((m) => (
            <li
              key={m?.name}
              className={styles.listItem}
              onClick={() => {
                setProductName(m?.name);
                setProductImage(m?.image);
                setProductPrice(m?.price);
                setProductDescription(m?.description);
                handleOpenModal();
              }}
            >
              <img className={styles.img} src={m?.image} alt="" />
              <h3 className={styles.name}>{m?.name}</h3>
              <p className={styles.price}>₺{m?.price}</p>
              <Button
                variant="outlined"
                color="primary"
                style={{
                  borderRadius: " 0",
                  backgroundColor: "#073b4c",
                  color: "#f7ede2",
                }}
                fullWidth
                onClick={() =>
                  addToCartHandler({
                    name: m?.name,
                    price: m?.price,
                    img: m?.image,
                    quantity: 1,
                  })
                }
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
  const { tableNum } = context.query;
  await db.connect();
  const menu = await QRMenu.findOne({
    storeName: storeName,
  }).lean();
  const order = await Order.findOne({ menuv2: menu?._id }).populate({
    path: "product",
    model: Product,
  });

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
      category,
      order: JSON.parse(JSON.stringify(order)),
      number: tableNum,
    },
  };
}
export default StoreMenu;
