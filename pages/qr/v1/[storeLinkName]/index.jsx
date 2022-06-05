// Packages and Dependencies
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import { Link, Loading, Modal, Spacer, Textarea } from "@nextui-org/react";
import { Button, IconButton, SwipeableDrawer } from "@material-ui/core";
import Head from "next/head";
import Image from "next/image";
import Rating from "@mui/material/Rating";
// Utils
import db from "../../../../utils/db.js";
import QRMenu from "../../../../models/QRMenu1Model.js";
import Order from "../../../../models/OrderModel.js";
// Styles
import styles from "./store.module.css";
// Icons
import MenuIcon from "@mui/icons-material/Menu";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FmdBadIcon from "@mui/icons-material/FmdBad";
// Images
import digicafes from "../../../../assets/digi_logo.svg";
// Translation
import i18nConfig from "../../../../i18n.json";
import useTranslation from "next-translate/useTranslation";
import axios from "axios";

const StoreMenu = ({ menu }) => {
  // States
  const sorted = menu?.categories?.sort((a, b) => {
    if (a.order < b.order) return -1;
    return a.order > b.order ? 1 : 0;
  });
  const [storeName, setStoreName] = useState(menu?.storeName);
  const [open, setOpen] = useState(false);
  const Router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [listType, setListType] = useState(menu?.listType);
  const [taste, setTaste] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [isSuccessRating, setIsSuccessRating] = useState(false);
  const [service, setService] = useState(null);
  const [tableModal, setTableModal] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const [isNote, setIsNote] = useState(false);
  const [note, setNote] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [categories, setCategories] = useState(menu?.categories);
  const [isMobile, setIsMobile] = useState();
  const [array, setArray] = useState([]);
  // Translation
  const { locales } = i18nConfig;
  const { t, lang } = useTranslation();

  useLayoutEffect(() => {
    if (window.innerWidth <= 1000) {
      setIsMobile(true);
    }
  }, []);
  useEffect(() => {
    if (isSuccessRating) {
      setTimeout(() => {
        setIsSuccessRating(false);
      }, 2000);
    }
  }, [isSuccessRating]);
  useEffect(() => {
    setArray(menu?.products?.sort(() => Math.random() - 0.5).splice(0, 3));
  }, [menu?.products]);
  const handleRating = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    try {
      const response = await axios.patch(`/api/qr/v1/${storeName}/ratings`, {
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

  return (
    <>
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
          <navbar className={styles.navbar}>
            {menu?.storeLogo?.includes("cloudinary") ? (
              <Image
                src={menu?.storeLogo}
                alt="Logo"
                className={styles.logo}
                width="80"
                height="80"
              />
            ) : (
              <h4 className={styles.storeName}>
                {menu?.storeName.toUpperCase()}
              </h4>
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
          </navbar>
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

          {categories.length == 0 && (
            <div className={styles.notFound}>
              <FmdBadIcon style={{ fontSize: "3rem", color: "#001219" }} />
              <h3>{t("common:warning")}</h3>
            </div>
          )}
          {categories.length > 0 && (
            <>
              {array?.length > 2 && (
                <div className={styles.favsBox}>
                  <h3 className={styles.favsHeader}>{t("common:favs")}</h3>
                  <div className={styles.favs}>
                    {listType === "image"
                      ? array?.map((fav) => (
                          <div
                            key={fav?._id}
                            onClick={() => {
                              try {
                                setIsFetching(true);
                                Router.push(
                                  `/qr/v1/${menu?.storeLinkName}/products/${fav?.category[0]}`
                                );
                              } catch (err) {
                                console.log(err);
                                setIsFetching(false);
                              }
                            }}
                            className={styles.favsItem}
                          >
                            <Image
                              src={fav?.image}
                              width="90"
                              height="70"
                              alt="Favs"
                              className={styles.favsImage}
                            />
                            <h4 className={styles.favsName}>{fav?.name}</h4>
                          </div>
                        ))
                      : array?.map((fav) => (
                          <div
                            key={fav?._id}
                            onClick={() => {
                              try {
                                setIsFetching(true);
                                Router.push(
                                  `/qr/v1/${menu?.storeLinkName}/products/${fav?.category[0]}`
                                );
                              } catch (err) {
                                console.log(err);
                                setIsFetching(false);
                              }
                            }}
                            className={styles.favsItem}
                          >
                            <h4
                              className={styles.favsName}
                              style={{ marginTop: "0", padding: "0" }}
                            >
                              {fav?.name}
                            </h4>
                          </div>
                        ))}
                  </div>
                </div>
              )}
              {menu?.gallery?.isActive ? (
                <div
                  className={styles.listItem}
                  style={{ margin: "10px auto", width: "97%" }}
                  onClick={() => {
                    try {
                      setIsFetching(true);
                      Router.push(
                        `/qr/v1/${menu?.storeLinkName}/products/gallery`
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
                      src={menu?.gallery?.galleryImage || ""}
                      className={styles.img}
                      alt={menu?.gallery?.name}
                    ></Image>
                  </div>
                  <div className={styles.titleBack}>
                    <h3 className={styles.title}>{menu?.gallery?.name}</h3>
                  </div>
                </div>
              ) : (
                ""
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

                {menu &&
                  sorted?.map((m) => (
                    <div
                      key={m?.name}
                      className={styles.listItem}
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
                        />
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
            width="360"
            height="700"
            className={styles.iframe}
            src={`https://www.digicafes.com/qr/v1/${menu?.storeLinkName}`}
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
  await db.connect();
  const menu = await QRMenu.findOne({
    storeLinkName,
  });

  const order = await Order.findOne({ menuv1: menu?._id });
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
    },
  };
}
export default StoreMenu;
