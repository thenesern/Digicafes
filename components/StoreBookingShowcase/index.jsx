import { Button, Typography } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./StoreBookingShowcase.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const StoreBookingShowcase = ({ store }) => {
  const [activeNavBar, setActiveNavBar] = useState("aboutUs");
  console.log(store);
  return (
    <div className={styles.container}>
      <div className={styles.app}>
        <div className={styles.left}>
          {store?.storeLogo ? (
            <>
              <div className={styles.titleAndLogo}>
                <img src={store?.storeLogo} className={styles.logo} />
                <h1 className={styles.storeName}>{store?.storeName}</h1>
              </div>
              <p
                className={styles.address}
              >{`${store?.address?.city} / ${store?.address?.state}, ${store?.address?.country}`}</p>
            </>
          ) : (
            <h1 className={styles.storeName}>{store?.storeName}</h1>
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
              <>
                {store?.address?.address && (
                  <div className={styles.storeAddress}>
                    <h3 className={styles.centeredHeader}>Adres</h3>
                    <Button sx={{ height: "3rem" }}>
                      <LocationOnIcon />
                      <p>{store?.address?.address}</p>
                    </Button>
                  </div>
                )}
              </>
            )}
            {activeNavBar === "menu" && <p>b</p>}
            {activeNavBar === "photos" && (
              <div>
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
        <div className={styles.right}>asdasd</div>
      </div>
    </div>
  );
};

export default StoreBookingShowcase;
