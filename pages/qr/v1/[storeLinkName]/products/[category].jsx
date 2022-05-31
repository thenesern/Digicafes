import { Router, useRouter } from "next/router";
import React from "react";
import styles from "./products.module.css";
import db from "../../../../../utils/db.js";
import QRMenu from "../../../../../models/QRMenu1Model.js";
import Link from "next/link";
import { Badge, Button } from "@material-ui/core";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import { useState } from "react";
import { Box, Divider, IconButton, SwipeableDrawer } from "@material-ui/core";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ShoppingCartOutlined } from "@material-ui/icons";
import Order from "../../../../../models/OrderModel";
import { useEffect } from "react";
import useTranslation from "next-translate/useTranslation";

const StoreMenu = ({ menu, category }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [listType, setListType] = useState(menu?.listType);
  const Router = useRouter();
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState(null);
  const handleOpenModal = () => setOpenModal(true);
  const [hasSubCategories, setHasSubCategories] = useState(
    menu?.products?.filter(
      (p) => p?.category?.includes(category) && p?.subCategory
    )
  );
  const [subCategories, setSubCategories] = useState(
    hasSubCategories.map((c) => c.subCategory)
  );

  const [uniqueSubCategories, setUniqueSubCategories] = useState([
    ...new Set(subCategories),
  ]);
  const handleCloseModal = () => {
    setOpenModal(false);
    setProductName("");
    setProductImage("");
    setProductPrice(null);
    setProductDescription("");
  };
  const [isFetching, setIsFetching] = useState(false);
  const filtered = menu?.products.filter(
    (a) => a?.category?.includes(category) && !a.subCategory
  );
  return (
    <div className={styles.container}>
      <navbar className={styles.navbar}>
        <Link href={"/qr/v1/" + menu?.storeLinkName} passHref>
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
          <img src={menu?.storeLogo} alt="Logo" className={styles.logo} />
        ) : (
          <span className={styles.logo}>{menu?.storeLogo}</span>
        )}

        <div className={styles["menu-item"]}>
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
              {menu &&
                menu?.categories?.map((m) => (
                  <li
                    onClick={() => {
                      try {
                        setIsFetching(true);
                        Router.push(
                          `/qr/v1/${menu?.storeLinkName}/products/${m?.name}`
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
        </div>
      </navbar>
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
          <img src={productImage} alt="Menu" className={styles.modalImage} />
          <p className={styles.modalDesc}>{productDescription}</p>
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
      {listType === "image" ? (
        <>
          <h2 style={{ textAlign: "center", width: "100%" }}>{category}</h2>
          <ul className={styles.list}>
            {menu &&
              filtered?.map((m) => (
                <li
                  className={styles.listItem}
                  key={m?.name}
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
                </li>
              ))}
          </ul>
          {hasSubCategories.filter((c) => c?.category?.includes(category))
            .length > 0
            ? uniqueSubCategories?.map((s) => (
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
                      <li
                        className={styles.listItem}
                        key={c?.name}
                        onClick={() => {
                          setProductName(c?.name);
                          setProductImage(c?.image);
                          setProductPrice(c?.price);
                          setProductDescription(c?.description);
                          handleOpenModal();
                        }}
                      >
                        <img className={styles.img} src={c?.image} alt="" />
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
                    gap: "10px",
                    marginBottom: "10px",
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
              </li>
            ))}
          {hasSubCategories.filter((c) => c?.category?.includes(category))
            .length > 0
            ? uniqueSubCategories?.map((s) => (
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
                          alignItems: "flex-start",
                          width: "100%",
                          justifyContent: "space-between",
                          marginBottom: "20px",
                          paddingBottom: "4px",
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
  await db.connect();
  const menu = await QRMenu.findOne({
    storeLinkName,
  }).lean();

  const order = await Order.findOne({ menuv1: menu?._id });
  await db.disconnect();
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

  return {
    props: {
      menu: JSON.parse(JSON.stringify(menu)),
      category,
    },
  };
}
export default StoreMenu;
