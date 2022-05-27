import { useRouter } from "next/router";
import React, { useState, useLayoutEffect } from "react";
import styles from "./store.module.css";
import db from "../../../../../utils/db.js";
import { Loading, Modal, Spacer, Textarea, Link } from "@nextui-org/react";
import { Badge } from "@material-ui/core";
import digicafes from "../../../../../assets/digi_logo.svg";
import QRMenu from "../../../../../models/QRMenu2Model.js";
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
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import FmdBadIcon from "@mui/icons-material/FmdBad";
import { useContext } from "react";
import { Store } from "../../../../../redux/store";
import { ShoppingCartOutlined } from "@material-ui/icons";
import useTranslation from "next-translate/useTranslation";
import i18nConfig from "../../../../../i18n.json";

const StoreMenu = ({ menu, number }) => {
  const [open, setOpen] = useState(false);
  const [storeName, setStoreName] = useState(menu?.storeName);
  const { locales } = i18nConfig;
  const Router = useRouter();
  const { t, lang } = useTranslation();
  const [isFetching, setIsFetching] = useState(false);
  const [waiterModal, setWaiterModal] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const handleOpenWaiterModal = () => setWaiterModal(true);
  const handleOpenTableModal = () => setTableModal(true);
  const [cartTotal, setCartTotal] = useState(null);
  const [orderNotes, setOrderNotes] = useState("");
  const handleCloseWaiterModal = () => setWaiterModal(false);
  const handleCloseTableModal = () => setTableModal(false);
  const { state, dispatch } = useContext(Store);
  const [isSure, setIsSure] = useState(false);
  const [callName, setCallName] = useState("");
  const { cart } = state;
  const [cartItems, setCartItems] = useState([...cart]);
  const [tableNum, setTableNum] = useState(number);
  const [openIsSure, setOpenIsSure] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [listType, setListType] = useState(menu?.listType);
  const [favs, setFavs] = useState(
    menu?.orders?.map((o) => o.cartItems.map((a) => a.name).toString())
  );
  const [favItem, setFavItem] = useState();
  const [favItem2, setFavItem2] = useState();
  const [favItem3, setFavItem3] = useState();
  const [isMobile, setIsMobile] = useState();
  useLayoutEffect(() => {
    if (window.innerWidth <= 1000) {
      setIsMobile(true);
    }
  }, []);
  let m = 0;
  const [favItemCount, setFavItemCount] = useState(null);
  const sorted = menu.categories.sort((a, b) => {
    if (a.order < b.order) return -1;
    return a.order > b.order ? 1 : 0;
  });

  function setFavItems() {
    for (let i = 0; i < favs?.length; i++) {
      for (let j = i; j < favs?.length; j++) {
        if (favs[i] == favs[j]) m++;
        if (favItemCount < m) {
          favItemCount = m;
          if (favs[i].split(",")) {
            setFavItem(favs[i].split(",")[0]);
          }
          if (favs[i - 1]?.split(",")) {
            setFavItem2(favs[i - 1]?.split(",")[0]);
            setFavItem3(favs[i - 1]?.split(",")[1]);
          } else {
            setFavItem(favs[i]);
            setFavItem2(favs[i - 1]);
            setFavItem2(favs[i - 2]);
          }
          if (
            menu?.products.filter(
              (p) =>
                p?.name?.toLowerCase() === favs[i]?.split(",")[0]?.toLowerCase()
            ).length === 0
          ) {
            setFavItem(menu?.products[1].name);
          }
          if (
            menu?.products.filter(
              (p) =>
                p?.name?.toLowerCase() ===
                favs[i - 1]?.split(",")[0]?.toLowerCase()
            ).length === 0
          ) {
            setFavItem2(menu?.products[1].name);
          }
          if (
            menu?.products.filter(
              (p) =>
                p?.name?.toLowerCase() ===
                favs[i - 1]?.split(",")[1]?.toLowerCase()
            ).length === 0
          ) {
            setFavItem3(menu?.products[1].name);
          }
          setFavItemCount(favItemCount);
        }
      }
      m = 0;
    }
  }
  useLayoutEffect(() => {
    setFavItems();
  }, []);

  const quantity = cart?.length;
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }
  }, [isSuccess]);
  const handleOpenCart = () => {
    setOpenCart(true);
  };
  useEffect(() => {
    setCartTotal(
      cartItems.reduce(function (a, b) {
        return a + b.price * b.quantity;
      }, 0)
    );
  }, [cartItems]);
  const handleCloseCart = () => {
    setOpenCart(false);
    setOrderNotes("");
  };
  const handleCloseOpenIsSure = () => setOpenIsSure(false);
  const handleOpenIsSure = () => {
    setOpenCart(false);
    setOpenIsSure(true);
  };

  useEffect(() => {
    if (isSure) {
      handleCartOrder();
      setIsSure(false);
      dispatch({ type: "CART", payload: [] });
      setCartItems([]);
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
    <>
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
              <h1>{t("common:request")}</h1>
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
                placeholder="Mesajınız. (Boş Bırakabilirsiniz)"
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
                          <img
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
              <img src={menu?.storeLogo} alt="Logo" className={styles.logo} />
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
                          <img src={a?.image} className={styles.favsImage} />
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
                          <img src={a?.image} className={styles.favsImage} />
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
                          {a?.image && (
                            <img src={a?.image} className={styles.favsImage} />
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
                      variant="contained"
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
                    <Button variant="contained" onClick={handleCloseTableModal}>
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
              <Image src={digicafes} width={160} height={160} />
            </a>
            <span>
              ©{new Date().getFullYear()} {t("common:rights")}
            </span>
          </footer>
        </div>
      ) : (
        <div className={styles.desktopBox}>
          <iframe
            width="360"
            height="700"
            className={styles.iframe}
            src={`https://www.digicafes.com/qr/v2/${menu?.storeLinkName}/${tableNum}`}
            title="W3Schools Free Online Web Tutorials"
          ></iframe>
          <p>{t("common:warning2")}</p>
        </div>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const { storeLinkName } = context.query;
  const { tableNum } = context.query;
  await db.connect();
  const menu = await QRMenu.findOne({
    storeLinkName,
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
