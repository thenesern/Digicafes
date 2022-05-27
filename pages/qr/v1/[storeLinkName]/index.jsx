import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./store.module.css";
import db from "../../../../utils/db.js";
import QRMenu from "../../../../models/QRMenu1Model.js";
import { Link, Loading, Modal, Spacer } from "@nextui-org/react";
import { Divider, IconButton, SwipeableDrawer } from "@material-ui/core";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Order from "../../../../models/OrderModel.js";
import Image from "next/image";
import FmdBadIcon from "@mui/icons-material/FmdBad";
import digicafes from "../../../../assets/digi_logo.svg";
import { useEffect, useLayoutEffect } from "react";
import i18nConfig from "../../../../i18n.json";
import useTranslation from "next-translate/useTranslation";

const StoreMenu = ({ menu }) => {
  const { locales } = i18nConfig;
  const { t, lang } = useTranslation();
  const [open, setOpen] = useState(false);
  const Router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [listType, setListType] = useState(menu?.listType);
  const [isMobile, setIsMobile] = useState();
  useLayoutEffect(() => {
    if (window.innerWidth <= 1000) {
      setIsMobile(true);
    }
  }, []);
  const sorted = menu?.categories?.sort((a, b) => {
    if (a.order < b.order) return -1;
    return a.order > b.order ? 1 : 0;
  });
  const [array, setArray] = useState([]);
  useEffect(() => {
    setArray(menu?.products?.sort(() => Math.random() - 0.5).splice(0, 3));
  }, []);
  return (
    <>
      {isMobile ? (
        <div className={styles.container}>
          <navbar className={styles.navbar}>
            {menu?.storeLogo?.includes("cloudinary") ? (
              <img src={menu?.storeLogo} alt="Logo" className={styles.logo} />
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
          {menu?.categories.length == 0 && (
            <div className={styles.notFound}>
              <FmdBadIcon style={{ fontSize: "3rem", color: "#001219" }} />
              <h3>{t("common:warning")}</h3>
            </div>
          )}
          {menu?.categories.length > 0 && (
            <>
              {menu?.products.length > 3 && (
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
                            <img
                              src={fav?.image}
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
