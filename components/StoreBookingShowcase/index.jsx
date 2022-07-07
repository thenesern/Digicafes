import { Button, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./StoreBookingShowcase.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import InstagramIcon from "@mui/icons-material/Instagram";
import ProgressBar from "./components/ProgressBar";

const StoreBookingShowcase = ({ store }) => {
  const [activeNavBar, setActiveNavBar] = useState("aboutUs");

  return (
    <div className={styles.container}>
      <div className={styles.app}>
        <div className={styles.left}>
          {store?.storeLogo ? (
            <>
              <div className={styles.titleAndLogo}>
                <img src={store?.storeLogo} className={styles.logo} />
                <div>
                  <h1 className={styles.storeName}>{store?.storeName}</h1>
                  <p
                    className={styles.address}
                  >{`${store?.address?.city} / ${store?.address?.state}, ${store?.address?.country}`}</p>
                </div>
              </div>
            </>
          ) : (
            <div>
              <h1 className={styles.storeName}>{store?.storeName}</h1>
              <p
                className={styles.address}
              >{`${store?.address?.city} / ${store?.address?.state}, ${store?.address?.country}`}</p>
            </div>
          )}
          <div className={styles.gallery}>
            <img
              src={store?.gallery?.galleryImage}
              className={styles.galleryImage}
            />
          </div>
          <div className={styles.storeNavBar}>
            <ul className={styles.list}>
              <li className={styles.li}>
                <Button
                  href=""
                  variant={activeNavBar === "aboutUs" ? "contained" : ""}
                  color="primary"
                  onClick={() => setActiveNavBar("aboutUs")}
                >
                  Hakkımızda
                </Button>
              </li>
              <li className={styles.li}>
                <Button
                  variant={activeNavBar === "menu" ? "contained" : ""}
                  href=""
                  color="primary"
                  onClick={() => setActiveNavBar("menu")}
                >
                  Menü
                </Button>
              </li>
              <li className={styles.li}>
                <Button
                  variant={activeNavBar === "photos" ? "contained" : ""}
                  href=""
                  color="primary"
                  onClick={() => setActiveNavBar("photos")}
                >
                  Fotoğraflar
                </Button>
              </li>
            </ul>
          </div>
          <div className={styles.content}>
            {activeNavBar === "aboutUs" && (
              <div className={styles.aboutUs}>
                {store?.contact?.phoneNumber && (
                  <div className={styles.storeContact}>
                    <h3 className={styles.centeredHeader}>İletişim</h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "2rem",
                        margin: "6px 0",
                      }}
                    >
                      <Button
                        sx={{
                          height: "3rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                        }}
                      >
                        <CallIcon color="success" />
                        <p
                          style={{
                            color: "rgba(58, 67, 84, 0.9)",
                            fontWeight: "600",
                          }}
                        >
                          {store?.contact?.phoneNumber}
                        </p>
                      </Button>
                      <Button
                        sx={{
                          height: "3rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                        }}
                      >
                        <InstagramIcon color="secondary" />
                        <a
                          href={store?.contact?.instagramLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <p
                            style={{
                              color: "rgba(58, 67, 84, 0.9)",
                              fontWeight: "600",
                            }}
                          >
                            {store?.contact?.instagramLink.split("/")[3]}
                          </p>
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
                {store?.address?.address && (
                  <div className={styles.storeAddress}>
                    <h3 className={styles.centeredHeader}>Adres</h3>
                    <Button
                      sx={{
                        height: "3rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        margin: "6px 0",
                      }}
                    >
                      <LocationOnIcon color="primary" />
                      <p
                        style={{
                          color: "rgba(58, 67, 84, 0.9)",
                          fontWeight: "600",
                        }}
                      >
                        {store?.address?.address}
                      </p>
                    </Button>
                  </div>
                )}
              </div>
            )}
            {activeNavBar === "menu" && <div className={styles.menu}></div>}
            {activeNavBar === "photos" && (
              <div className={styles.photos}>
                {store?.gallery?.images.length > 0 ? (
                  <div className={styles.galleryBottomImages}>
                    {store?.gallery?.images.map((img) => (
                      <img
                        className={styles.galleryBottomImage}
                        key={img?.id}
                        src={img?.image}
                        alt=""
                      />
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.quota}>
            <h3>Doluluk Oranı</h3>
            <ProgressBar value={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreBookingShowcase;
