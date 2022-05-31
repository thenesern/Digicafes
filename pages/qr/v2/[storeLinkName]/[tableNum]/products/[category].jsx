// Packages and Dependencies
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Box } from "@material-ui/core";
import { Loading, Modal, Spacer, Textarea } from "@nextui-org/react";
import Image from "next/image";
import { Badge, Button } from "@material-ui/core";
// Utils
import db from "../../../../../../utils/db.js";
import QRMenu from "../../../../../../models/QRMenu2Model.js";
import Product from "../../../../../../models/ProductModel";
import Order from "../../../../../../models/OrderModel";
// Styles
import styles from "./products.module.css";
// Icons
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ShoppingCartOutlined } from "@material-ui/icons";
// Context
import { Store } from "../../../../../../redux/store";
// Translation
import useTranslation from "next-translate/useTranslation";

const StoreMenu = ({ menu, category, order, number }) => {
  // States
  const [listType, setListType] = useState(menu?.listType);
  const [storeName, setStoreName] = useState(menu?.storeName);
  const [hasSubCategories, setHasSubCategories] = useState(
    menu?.products.filter(
      (p) => p?.category?.includes(category) && p?.subCategory
    )
  );
  const [subCategories, setSubCategories] = useState(
    hasSubCategories.map((c) => c.subCategory)
  );
  const [uniqueSubCategories, setUniqueSubCategories] = useState([
    ...new Set(subCategories),
  ]);
  const filtered = menu?.products.filter(
    (a) => a?.category?.includes(category) && !a.subCategory
  );
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [productName, setProductName] = useState("");
  const [version, setVersion] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [tableNum, setTableNum] = useState(number);
  const [cartTotal, setCartTotal] = useState(null);
  const [openIsSure, setOpenIsSure] = useState(false);
  const [isSure, setIsSure] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // Context
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const quantity = cart?.length;
  const [cartItems, setCartItems] = useState([...cart]);
  // Translation
  const { t } = useTranslation();

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

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }
  }, [isSuccess]);

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

  useEffect(() => {
    if (order[0]?.product?.name === "Dijital Menü - V1") {
      setVersion("v1");
    } else {
      setVersion("v2");
    }
  }, [order]);

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

  return (
    <div className={styles.container}>
      <navbar className={styles.navbar}>
        <Link
          href={`/qr/${version}/` + menu?.storeLinkName + "/" + tableNum}
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
            <p className={styles.back}>{t("common:back")}</p>
          </Button>
        </Link>
        {menu?.storeLogo?.includes("cloudinary") ? (
          <Image
            src={menu?.storeLogo}
            alt="Logo"
            className={styles.logo}
            width="80"
            height="80"
          />
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
          <h1>{t("common:request")}</h1>
        </Modal.Body>
      </Modal>
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
            <h3 className={styles.descHeader}>{productName}</h3>
            <span>
              {menu?.currency === "dolar"
                ? "$"
                : menu?.currency === "euro"
                ? "€"
                : menu?.currency === "lira"
                ? "₺"
                : ""}
              {productPrice}
            </span>
          </div>
          {productImage && (
            <Image
              src={productImage || ""}
              alt="Menu"
              className={styles.modalImage}
              width="500"
              height="300"
            />
          )}
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
                        width="60"
                        height="60"
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
            <p style={{ padding: "1rem" }}>{t("common:empty")}</p>
          )}
        </Modal.Body>
        <Modal.Footer className={styles.cartFooter}>
          {cart.length > 0 && (
            <div>
              {t("common:total")}:
              {menu?.currency === "dolar"
                ? " $"
                : menu?.currency === "euro"
                ? " €"
                : menu?.currency === "lira"
                ? " ₺"
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
          <h3 style={{ padding: "0", margin: "0" }}>{t("common:attention")}</h3>
          <p>{t("common:order")}</p>
        </Modal.Header>
        <Modal.Body>
          <h5>{t("common:note")}</h5>
          <Textarea
            placeholder={t("common:message")}
            onChange={(e) => setOrderNotes(e.target.value)}
          ></Textarea>
        </Modal.Body>
        <Modal.Footer style={{ display: "flex", gap: "2rem" }}>
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
      {listType === "image" ? (
        <>
          <h2 style={{ textAlign: "center", width: "100%" }}>{category}</h2>
          <ul className={styles.list}>
            {menu &&
              filtered?.map((m) => (
                <li key={m?.name} className={styles.listItem}>
                  <Image
                    className={styles.img}
                    src={m?.image}
                    width="200"
                    height="160"
                    alt=""
                    onClick={() => {
                      setProductName(m?.name);
                      setProductImage(m?.image);
                      setProductPrice(m?.price);
                      setProductDescription(m?.description);
                      handleOpenModal();
                    }}
                  />
                  <h3 className={styles.name}>{m?.name}</h3>
                  <p className={styles.price}>
                    {menu?.currency === "dolar"
                      ? "$"
                      : menu?.currency === "euro"
                      ? "€"
                      : menu?.currency === "lira"
                      ? "₺"
                      : ""}
                    {m?.price}
                  </p>
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
                    {t("common:addToCart")}
                  </Button>
                </li>
              ))}
          </ul>

          {hasSubCategories.filter((c) => c?.category?.includes(category))
            .length > 0
            ? uniqueSubCategories.map((s) => (
                <div
                  key={s.name}
                  style={{
                    width: "90%",
                    margin: "0 auto",
                  }}
                >
                  <h3
                    key={s}
                    style={{
                      width: "100%",
                      padding: "1rem 0",
                      margin: "0",
                      textAlign: "center",
                    }}
                  >
                    {s}
                  </h3>
                  {hasSubCategories
                    .filter((c) => c.subCategory === s)
                    .map((c) => (
                      <li className={styles.listItem} key={c?.name}>
                        <img
                          className={styles.img}
                          src={c?.image}
                          alt=""
                          onClick={() => {
                            setProductName(c?.name);
                            setProductImage(c?.image);
                            setProductPrice(c?.price);
                            setProductDescription(c?.description);
                            handleOpenModal();
                          }}
                        />
                        <h3 className={styles.name}>{c?.name}</h3>
                        <p className={styles.price}>
                          {menu?.currency === "dolar"
                            ? "$"
                            : menu?.currency === "euro"
                            ? "€"
                            : menu?.currency === "lira"
                            ? "₺"
                            : ""}
                          {c?.price}
                        </p>
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
                              name: c?.name,
                              price: c?.price,
                              img: c?.image,
                              quantity: 1,
                            })
                          }
                        >
                          {t("common:addToCart")}
                        </Button>
                      </li>
                    ))}
                </div>
              ))
            : ""}
        </>
      ) : (
        <ul className={styles.textList}>
          {category === "gallery" ? (
            <h2 style={{ textAlign: "center" }}>{menu?.gallery?.name}</h2>
          ) : (
            <h2
              style={{ textAlign: "center", marginTop: "0", color: "#001219" }}
            >
              {category}
            </h2>
          )}

          {menu &&
            filtered?.map((m) => (
              <li key={m?.name} className={styles.textListItem}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: "1rem",
                    paddingBottom: "4px",
                    borderBottom: "1px solid lightgray",
                  }}
                >
                  <div>
                    <h3 className={styles.textListName}>{m?.name}</h3>
                    {m?.description && (
                      <p className={styles.textListDesc}>{m?.description}</p>
                    )}
                  </div>
                  <p className={styles.textListPrice}>
                    {menu?.currency === "dolar"
                      ? "$"
                      : menu?.currency === "euro"
                      ? "€"
                      : menu?.currency === "lira"
                      ? "₺"
                      : ""}
                    {m?.price}
                  </p>
                </div>
                <button
                  style={{
                    borderRadius: " 0",
                    backgroundColor: "#073b4c",
                    color: "#f7ede2",
                    minWidth: "2rem",
                    height: "2rem",
                    margin: "0",
                    borderRadius: "1rem",
                    padding: "0",
                    border: "none",
                  }}
                  onClick={() =>
                    addToCartHandler({
                      name: m?.name,
                      price: m?.price,
                      img: m?.image,
                      quantity: 1,
                    })
                  }
                >
                  <span>+</span>
                </button>
              </li>
            ))}
          {hasSubCategories.filter((c) => c?.category?.includes(category))
            .length > 0
            ? uniqueSubCategories.map((s) => (
                <div key={s.name}>
                  <h3
                    key={s}
                    style={{
                      width: "100%",
                      padding: "1rem 0",
                      margin: "0",
                      textAlign: "center",
                    }}
                  >
                    {s}
                  </h3>
                  {hasSubCategories
                    .filter((c) => c.subCategory === s)
                    .map((c) => (
                      <div
                        key={c.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                          paddingBottom: "4px",
                          gap: "10px",
                          borderBottom: "1px solid lightgray",
                        }}
                      >
                        <div>
                          <h3 className={styles.textListName}>{c?.name}</h3>
                          {c?.description && (
                            <p className={styles.textListDesc}>
                              {c?.description}
                            </p>
                          )}
                        </div>
                        <p className={styles.textListPrice}>
                          {menu?.currency === "dolar"
                            ? "$"
                            : menu?.currency === "euro"
                            ? "€"
                            : menu?.currency === "lira"
                            ? "₺"
                            : ""}
                          {c?.price}
                        </p>
                        <button
                          style={{
                            borderRadius: " 0",
                            backgroundColor: "#073b4c",
                            color: "#f7ede2",
                            minWidth: "2rem",
                            height: "2rem",
                            margin: "0",
                            borderRadius: "1rem",
                            padding: "0",
                            border: "none",
                          }}
                          onClick={() =>
                            addToCartHandler({
                              name: c?.name,
                              price: c?.price,
                              img: c?.image,
                              quantity: 1,
                            })
                          }
                        >
                          <span>+</span>
                        </button>
                      </div>
                    ))}
                </div>
              ))
            : ""}
        </ul>
      )}
      {category === "gallery" ? (
        <div className={styles.gallery}>
          {menu?.gallery?.images.map((i) => (
            <img
              key={i?.image}
              className={styles.galleryImages}
              src={i?.image}
            ></img>
          ))}
        </div>
      ) : (
        ""
      )}
      <footer></footer>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { category } = context.query;
  const { storeLinkName } = context.query;
  const { tableNum } = context.query;
  await db.connect();
  const menu = await QRMenu.findOne({
    storeLinkName,
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
