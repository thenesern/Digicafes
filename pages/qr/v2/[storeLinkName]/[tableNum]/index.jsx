// Packages and Dependencies
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Loading, Modal, Spacer, Textarea, Link } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import {
  Button,
  Divider,
  IconButton,
  SwipeableDrawer,
} from "@material-ui/core";
// Styles
import styles from "./store.module.css";
// Icons
import { Badge } from "@material-ui/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { ShoppingCartOutlined } from "@material-ui/icons";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import Rating from "@mui/material/Rating";
import FmdBadIcon from "@mui/icons-material/FmdBad";
import ModalMui from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
// Images
import digicafes from "../../../../../assets/digi_logo.svg";
// Utils
import db from "../../../../../utils/db.js";
import QRMenu from "../../../../../models/QRMenu2Model.js";
import Order from "../../../../../models/OrderModel";
// Context
import { useContext } from "react";
import { Store } from "../../../../../redux/store";
// Translation
import useTranslation from "next-translate/useTranslation";
import i18nConfig from "../../../../../i18n.json";

const StoreMenu = ({ menu, number }) => {
  // States
  const [storeName, setStoreName] = useState(menu?.storeName);
  const [tableNum, setTableNum] = useState(number);
  const [listType, setListType] = useState(menu?.listType);
  const sorted = menu.categories.sort((a, b) => {
    if (a.order < b.order) return -1;
    return a.order > b.order ? 1 : 0;
  });
  const [filteredOrders, setFilteredOrders] = useState(
    menu?.orders.filter((o) => o.cartItems.length === 1)
  );
  const [favs, setFavs] = useState(
    filteredOrders.map((o) => o.cartItems.map((a) => a.name).toString())
  );
  const [open, setOpen] = useState(false);
  const [openIsSure, setOpenIsSure] = useState(false);
  const [isSure, setIsSure] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessRating, setIsSuccessRating] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isNote, setIsNote] = useState(false);
  const [note, setNote] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  // Favs
  const duplicates = favs.filter((item, index) => index !== favs.indexOf(item));
  const trinity = Array.from(new Set(duplicates));
  const [favItem, setFavItem] = useState(trinity[trinity.length - 1]);
  const [favItem2, setFavItem2] = useState(trinity[trinity.length - 2]);
  const [favItem3, setFavItem3] = useState(trinity[trinity.length - 3]);
  // Router
  const Router = useRouter();
  // Translation
  const { locales } = i18nConfig;
  const { t, lang } = useTranslation();
  // Context
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [waiterModal, setWaiterModal] = useState(false);
  const [taste, setTaste] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [service, setService] = useState(null);
  const [tableModal, setTableModal] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const [cartTotal, setCartTotal] = useState(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [callName, setCallName] = useState("");
  const [cartItems, setCartItems] = useState([...cart]);
  const quantity = cart?.length;

  useEffect(() => {
    if (window.innerWidth <= 1000) {
      setIsMobile(true);
    }
  }, []);
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isSuccessRating) {
      setTimeout(() => {
        setIsSuccessRating(false);
      }, 2000);
    }
  }, [isSuccessRating]);
  useEffect(() => {
    if (isEmpty) {
      setTimeout(() => {
        setIsEmpty(false);
      }, 2000);
    }
  }, [isEmpty]);

  useEffect(() => {
    setCartTotal(
      cartItems.reduce(function (a, b) {
        return a + b.price * b.quantity;
      }, 0)
    );
  }, [cartItems]);
  useEffect(() => {
    if (isSure) {
      handleCartOrder();
      setIsSure(false);
      dispatch({ type: "CART", payload: [] });
      setCartItems([]);
      handleCloseOpenIsSure();
    }
  }, [isSure]);

  const handleOpenCart = () => {
    setOpenCart(true);
  };
  const handleOpenIsSure = () => {
    setOpenCart(false);
    setOpenIsSure(true);
  };
  const handleOpenWaiterModal = () => setWaiterModal(true);
  const handleOpenTableModal = () => setTableModal(true);
  const handleOpenRating = () => {
    setOpenRating(true);
    setOpen(false);
  };
  const handleCloseRating = () => {
    setOpenRating(false);
    setTaste(null);
    setSpeed(null);
    setService(null);
    setIsNote(false);
    setNote("");
  };
  const handleCloseWaiterModal = () => setWaiterModal(false);
  const handleCloseTableModal = () => setTableModal(false);
  const handleCloseOpenIsSure = () => setOpenIsSure(false);
  const handleCloseCart = () => {
    setOpenCart(false);
    setOrderNotes("");
  };
  const handleRating = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    try {
      const response = await axios.patch(`/api/qr/v2/${storeName}/ratings`, {
        storeName,
        ratings: {
          taste,
          speed,
          service,
          note,
        },
      });
      handleCloseRating();
      setIsFetching(false);
      setIsSuccessRating(true);
    } catch (err) {
      console.log(err);
      setIsSuccessRating(false);
      handleCloseRating();
      setIsFetching(false);
    }
  };
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

  const handleCalls = async ({ callName }) => {
    setIsFetching(true);
    const createdAt = new Date();
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
    <div>
      <Head>
        <title>
          {Router.locale === "tr"
            ? storeName.toLowerCase().toUpperCase() +
              " - " +
              "powered by Digicafes."
            : storeName.toLowerCase().toUpperCase() +
              " - " +
              "Digicafes tarafından deskteklenmektedir. "}
        </title>
        <meta charset="UTF-8" />
        <meta name="keywords" content="titla, meta, nextjs" />
        <meta name="author" content="Syamlal CM" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {isMobile ? (
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
              <h3>{t("common:request")}</h3>
            </Modal.Body>
          </Modal>
          <Modal
            style={{ width: "90%", margin: "0 auto" }}
            open={isSuccessRating}
            onClose={() => setIsSuccessRating(false)}
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
              <h3 style={{ textAlign: "center" }}>{t("common:reviewSent")}</h3>
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
              <h3 style={{ padding: "0", margin: "0" }}>
                {t("common:attention")}
              </h3>
              <p>{t("common:order")}</p>
            </Modal.Header>
            <Modal.Body>
              <h5>{t("common:note")}</h5>
              <Textarea
                style={{ fontSize: "12px" }}
                placeholder={t("common:message")}
                onChange={(e) => setOrderNotes(e.target.value)}
              ></Textarea>
            </Modal.Body>
            <Modal.Footer
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="outlined" onClick={handleCloseOpenIsSure}>
                {t("common:discard")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setIsSure(true)}
              >
                {t("common:confirm")}
              </Button>
            </Modal.Footer>
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
              margin: "0 auto",
              maxHeight: "24rem",
              overFlow: "auto",
            }}
          >
            <Modal.Header>
              <h2>{t("common:summary")}</h2>
            </Modal.Header>
            <Modal.Body style={{ padding: "1rem 0" }}>
              {listType === "image"
                ? cartItems?.map((item) => (
                    <>
                      <div key={Math.random()} className={styles.cart}>
                        <div className={styles.cartHeader}>
                          <Image
                            src={item?.img}
                            alt=""
                            className={styles.cartImg}
                          />
                          <h4
                            style={{
                              maxWidth: "8rem",
                              overflow: "auto",
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
                                  cartItems.filter(
                                    (product) => product !== item
                                  )
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
                  ))
                : cartItems?.map((item) => (
                    <>
                      <div key={Math.random()} className={styles.cart}>
                        <div className={styles.cartHeader}>
                          <h4
                            style={{
                              maxWidth: "8rem",
                              overflow: "auto",
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
                                  cartItems.filter(
                                    (product) => product !== item
                                  )
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
                <p style={{ padding: "1rem" }}>{t("common:empty")}</p>
              )}
            </Modal.Body>
            <Modal.Footer className={styles.cartFooter}>
              {cart.length > 0 && (
                <div>
                  Toplam:
                  {menu?.currency === "dolar"
                    ? "$"
                    : menu?.currency === "euro"
                    ? "€"
                    : menu?.currency === "lira"
                    ? "₺"
                    : ""}
                  {cartTotal}
                </div>
              )}
              {cart.length > 0 && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleOpenIsSure}
                >
                  {t("common:sendOrder")}
                </Button>
              )}
            </Modal.Footer>
          </Modal>
          <navbar className={styles.navbar}>
            <IconButton onClick={() => setOpen(true)}>
              <MenuIcon style={{ color: "white", fontSize: "2rem" }} />
            </IconButton>
            {menu?.storeLogo?.includes("cloudinary") ? (
              <Image src={menu?.storeLogo} alt="Logo" width="80" height="80" />
            ) : (
              <h4 className={styles.storeName}>
                {menu?.storeName.toUpperCase()}
              </h4>
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
            <SwipeableDrawer
              anchor="right"
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
            >
              <ul className={styles.navList}>
                {locales.map((lng) => {
                  if (lng === lang) return null;
                  return (
                    <div className={styles.int} key={lng}>
                      <Link href={`/${lng}/${Router.asPath}`} locale={lng}>
                        <span className={styles.lang}>
                          {t(`nav:language-name-${lng}`)}
                        </span>
                      </Link>
                    </div>
                  );
                })}
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
                  {t("common:waiter")}
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
                  {t("common:bill")}
                </Button>
                <Button
                  variant="outlined"
                  style={{
                    margin: "10px auto",
                    minWidth: "10rem",
                    color: "#eee",
                    border: "1px solid #eee",
                  }}
                  color="secondary"
                  onClick={handleOpenRating}
                >
                  {t("common:review")}
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
                    {t("common:menu")}
                  </h3>
                )}

                {menu &&
                  sorted?.map((m) => (
                    <li
                      onClick={() => {
                        try {
                          setIsFetching(true);
                          Router.push(
                            `/qr/v2/${menu?.storeLinkName}/${tableNum}/products/${m?.name}`
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
              <h3>{t("common:warning")}</h3>
            </div>
          )}
          {menu?.categories.length > 0 && (
            <>
              {menu?.orders.length >= 3 && (
                <div className={styles.favsBox}>
                  <h3 className={styles.favsHeader}>{t("common:favs")}</h3>
                  <div className={styles.favs}>
                    {menu?.products
                      .filter(
                        (p) =>
                          p?.name?.toLowerCase() === favItem2?.toLowerCase()
                      )
                      .map((a) => (
                        <div
                          key={a?._id}
                          onClick={() => {
                            try {
                              setIsFetching(true);
                              Router.push(
                                `/qr/v2/${menu?.storeLinkName}/${tableNum}/products/${a?.category[0]}`
                              );
                            } catch (err) {
                              console.log(err);
                              setIsFetching(false);
                            }
                          }}
                          className={styles.favsItem}
                        >
                          {a?.image ? (
                            <img
                              src={a?.image || ""}
                              width="90"
                              height="70"
                              alt="Favs"
                              className={styles.favsImage}
                            />
                          ) : (
                            ""
                          )}
                          <h4 className={styles.favsName}>{a?.name}</h4>
                        </div>
                      ))}
                    {menu?.products
                      .filter(
                        (p) => p?.name?.toLowerCase() === favItem?.toLowerCase()
                      )
                      .map((a) => (
                        <div
                          key={a?._id}
                          className={styles.favsItem}
                          onClick={() => {
                            try {
                              setIsFetching(true);
                              Router.push(
                                `/qr/v2/${menu?.storeLinkName}/${tableNum}/products/${a?.category[0]}`
                              );
                            } catch (err) {
                              console.log(err);
                              setIsFetching(false);
                            }
                          }}
                        >
                          {a?.image ? (
                            <img
                              src={a?.image || ""}
                              width="90"
                              height="70"
                              alt="Favs"
                              className={styles.favsImage}
                            />
                          ) : (
                            ""
                          )}
                          <h4 className={styles.favsName}>{a?.name}</h4>
                        </div>
                      ))}
                    {menu?.products
                      .filter(
                        (p) =>
                          p?.name?.toLowerCase() === favItem3?.toLowerCase()
                      )
                      .map((a) => (
                        <div
                          key={a?._id}
                          className={styles.favsItem}
                          onClick={() => {
                            try {
                              setIsFetching(true);
                              Router.push(
                                `/qr/v2/${menu?.storeLinkName}/${tableNum}/products/${a?.category[0]}`
                              );
                            } catch (err) {
                              console.log(err);
                              setIsFetching(false);
                            }
                          }}
                        >
                          {a?.image ? (
                            <img
                              src={a?.image || ""}
                              width="90"
                              height="70"
                              alt="Favs"
                              className={styles.favsImage}
                            />
                          ) : (
                            ""
                          )}
                          <h4 className={styles.favsName}>{a?.name}</h4>
                        </div>
                      ))}
                  </div>
                </div>
              )}
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
                    <h1>{t("common:isSure")}</h1>
                  </Modal.Header>
                  <Modal.Body
                    style={{ margin: "1rem 10px", textAlign: "center" }}
                  >
                    <p>{t("common:requestWaiter")}</p>
                  </Modal.Body>
                  <Modal.Footer
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCloseWaiterModal}
                    >
                      {t("panel:discard")}
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
                      {t("common:confirm")}
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal
                  style={{ width: "90%", margin: "0 auto", padding: "1rem" }}
                  onClose={handleCloseRating}
                  open={openRating}
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                >
                  <Modal.Header
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <h1>{t("common:review")}</h1>
                  </Modal.Header>
                  <Modal.Body
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      padding: "1rem 0",
                    }}
                  >
                    {isEmpty && <p>{t("common:completeRatings")}</p>}
                    {!isNote && (
                      <>
                        <h3>{t("common:taste")}</h3>
                        <Rating
                          name="simple-controlled"
                          value={taste}
                          onChange={(event, newValue) => {
                            setTaste(newValue);
                          }}
                        />
                        <h3>{t("common:speed")}</h3>
                        <Rating
                          name="simple-controlled"
                          value={speed}
                          onChange={(event, newValue) => {
                            setSpeed(newValue);
                          }}
                        />
                        <h3>{t("common:service")}</h3>
                        <Rating
                          name="simple-controlled"
                          value={service}
                          onChange={(event, newValue) => {
                            setService(newValue);
                          }}
                        />
                      </>
                    )}
                    {isNote && (
                      <Textarea
                        style={{ fontSize: "12px", width: "16rem" }}
                        placeholder={t("common:message")}
                        onChange={(e) => setNote(e.target.value)}
                      ></Textarea>
                    )}
                  </Modal.Body>
                  <Modal.Footer
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCloseRating}
                    >
                      {t("common:discard")}
                    </Button>
                    {!isNote && (
                      <Button
                        style={{ marginLeft: "2rem " }}
                        variant="contained"
                        color="secondary"
                        onClick={(e) => {
                          if (speed && taste && service) {
                            setIsNote(true);
                          } else {
                            setIsEmpty(true);
                          }
                        }}
                      >
                        {t("common:next")}
                      </Button>
                    )}
                    {isNote && (
                      <Button
                        style={{ marginLeft: "2rem " }}
                        variant="contained"
                        color="secondary"
                        onClick={(e) => {
                          if (speed && taste && service) {
                            handleRating(e);
                          } else {
                            handleCloseRating();
                          }
                        }}
                      >
                        {t("common:confirm")}
                      </Button>
                    )}
                  </Modal.Footer>
                </Modal>

                <Modal
                  style={{ width: "90%", margin: "0 auto" }}
                  onClose={handleCloseTableModal}
                  aria-labelledby="modal-title"
                  open={tableModal}
                >
                  <Modal.Header>
                    <h1>{t("common:isSure")}</h1>
                  </Modal.Header>
                  <Modal.Body style={{ margin: "1rem 10px" }}>
                    <p style={{ textAlign: "center" }}>
                      {t("common:requestBill")}
                    </p>
                  </Modal.Body>
                  <Modal.Footer
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCloseTableModal}
                    >
                      {t("common:discard")}
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
                      {t("common:confirm")}
                    </Button>
                  </Modal.Footer>
                </Modal>
                {menu &&
                  sorted?.map((m) => (
                    <div
                      key={m?.name}
                      className={styles.listItem}
                      onClick={() => {
                        try {
                          setIsFetching(true);
                          Router.push(
                            `/qr/v2/${menu?.storeLinkName}/${tableNum}/products/${m?.name}`
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
            </>
          )}
          <footer className={styles.footer}>
            <p>{t("common:footer")}</p>
            <a
              href="https://www.digicafes.com"
              rel="noreferrer"
              target="_blank"
            >
              <Image src={digicafes} width={160} height={160} alt="Digicafes" />
            </a>
            <span>
              ©{new Date().getFullYear()} {t("common:rights")}
            </span>
          </footer>
        </div>
      ) : (
        <div className={styles.desktopBox}>
          <iframe
            width="380"
            height="790"
            className={styles.iframe}
            src={
              Router.locale === "tr"
                ? `https://www.digicafes.com/qr/v2/${menu?.storeLinkName}/${tableNum}`
                : `https://www.digicafes.com/en/qr/v2/${menu?.storeLinkName}/${tableNum}`
            }
            title="W3Schools Free Online Web Tutorials"
          ></iframe>
          <p>{t("common:warning2")}</p>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  // Router Query
  const { storeLinkName } = context.query;
  const { tableNum } = context.query;

  // DB
  await db.connect();
  const menu = await QRMenu.findOne({
    storeLinkName,
  });
  const order = await Order.findOne({ menuv2: menu?._id });
  const newDate = new Date();
  await db.disconnect();

  // Security
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

  return {
    props: {
      menu: JSON.parse(JSON.stringify(menu)),
      number: tableNum,
    },
  };
}
export default StoreMenu;
