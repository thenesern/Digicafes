import { Button, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./StoreBookingShowcase.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import InstagramIcon from "@mui/icons-material/Instagram";
import ProgressBar from "./components/ProgressBar";

const StoreBookingShowcase = ({ store }) => {
  const [activeNavBar, setActiveNavBar] = useState("aboutUs");
  const [value, setValue] = useState(new Date());
  const [people, setPeople] = useState("");
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div className={styles.container}>
      <div className={styles.app}>
        <div className={styles.left}>
          {store?.storeLogo ? (
            <>
              <div className={styles.titleAndLogo}>
                <img src={store?.storeLogo} className={styles.logo} />
                <div>
                  <h1 className={styles.storeName}>
                    {store?.storeName.split(" ")[0][0] ===
                    store?.storeName[0][0].toLowerCase()
                      ? store?.storeName
                          .split(" ")
                          .map((item) =>
                            item.replace(
                              item[0],
                              item[0].toLowerCase().toUpperCase()
                            )
                          )
                      : store?.storeName}
                  </h1>
                  <p
                    className={styles.address}
                  >{`${store?.address?.city} / ${store?.address?.state}, ${store?.address?.country}`}</p>
                </div>
              </div>
            </>
          ) : (
            <div>
              <h1 className={styles.storeName}>
                {store?.storeName.split(" ")[0][0] ===
                store?.storeName[0][0].toLowerCase()
                  ? store?.storeName
                      .split(" ")
                      .map((item) =>
                        item.replace(
                          item[0],
                          item[0].toLowerCase().toUpperCase()
                        )
                      )
                  : store?.storeName}
              </h1>
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
                {store?.workingTimes && (
                  <div>
                    <h3>Çalışma Saatleri</h3>
                    <ul>
                      {store?.workingTimes?.monday?.isActive ? (
                        <li className={styles.workingTimes}>
                          <h4 className={styles.day}>Pazartesi</h4>
                          <span className={styles.hours}>
                            {`${store?.workingTimes?.monday?.workingHours?.starts}`}
                            <span> - </span>
                            {`${store?.workingTimes?.monday?.workingHours?.ends}`}
                          </span>
                        </li>
                      ) : (
                        ""
                      )}
                      {store?.workingTimes?.tuesday?.isActive ? (
                        <li className={styles.workingTimes}>
                          <h4 className={styles.day}>Salı</h4>
                          <span className={styles.hours}>
                            {`${store?.workingTimes?.tuesday?.workingHours?.starts}`}
                            <span> - </span>
                            {`${store?.workingTimes?.tuesday?.workingHours?.ends}`}
                          </span>
                        </li>
                      ) : (
                        ""
                      )}
                      {store?.workingTimes?.wednesday?.isActive ? (
                        <li className={styles.workingTimes}>
                          <h4 className={styles.day}>Çarşamba</h4>
                          <span className={styles.hours}>
                            {`${store?.workingTimes?.wednesday?.workingHours?.starts}`}
                            <span> - </span>
                            {`${store?.workingTimes?.wednesday?.workingHours?.ends}`}
                          </span>
                        </li>
                      ) : (
                        ""
                      )}
                      {store?.workingTimes?.thursday?.isActive ? (
                        <li className={styles.workingTimes}>
                          <h4 className={styles.day}>Perşembe</h4>
                          <span className={styles.hours}>
                            {`${store?.workingTimes?.thursday?.workingHours?.starts}`}
                            <span> - </span>
                            {`${store?.workingTimes?.thursday?.workingHours?.ends}`}
                          </span>
                        </li>
                      ) : (
                        ""
                      )}
                      {store?.workingTimes?.friday?.isActive ? (
                        <li className={styles.workingTimes}>
                          <h4 className={styles.day}>Cuma</h4>
                          <span className={styles.hours}>
                            {`${store?.workingTimes?.friday?.workingHours?.starts}`}
                            <span> - </span>
                            {`${store?.workingTimes?.friday?.workingHours?.ends}`}
                          </span>
                        </li>
                      ) : (
                        ""
                      )}
                      {store?.workingTimes?.saturday?.isActive ? (
                        <li className={styles.workingTimes}>
                          <h4 className={styles.day}>Cumartesi</h4>
                          <span className={styles.hours}>
                            {`${store?.workingTimes?.saturday?.workingHours?.starts}`}
                            <span> - </span>
                            {`${store?.workingTimes?.saturday?.workingHours?.ends}`}
                          </span>
                        </li>
                      ) : (
                        ""
                      )}
                      {store?.workingTimes?.sunday?.isActive ? (
                        <li className={styles.workingTimes}>
                          <h4 className={styles.day}>Pazar</h4>
                          <span className={styles.hours}>
                            {`${store?.workingTimes?.sunday?.workingHours?.starts}`}
                            <span> - </span>
                            {`${store?.workingTimes?.sunday?.workingHours?.ends}`}
                          </span>
                        </li>
                      ) : (
                        ""
                      )}
                    </ul>
                  </div>
                )}
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
          <div style={{ margin: "4rem 0" }}>
            <h3 style={{ margin: "1rem 0 0 0", color: "#001219" }}>
              Yerinizi Ayırtın
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: "2rem",
                margin: "1rem 0",
                flexDirection: "column",
              }}
            >
              <TextField
                id="standard-basic"
                label="Kişi Sayısı"
                type="number"
                sx={{ width: "100%" }}
                variant="standard"
                onChange={(e) => setPeople(e.target.value)}
              />
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                sx={{ width: "100%" }}
              >
                <Stack spacing={3} sx={{ width: "100%" }}>
                  <DesktopDatePicker
                    sx={{ width: "100%" }}
                    label="Tarih Seçiniz"
                    inputFormat="dd/MM/yyyy"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  {/*     <MobileDatePicker
                  label="Date mobile"
                  inputFormat="MM/dd/yyyy"
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                /> */}
                  <TimePicker
                    label="Zaman Seçiniz"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
              <Button variant="contained" fullWidth color="warning">
                {people} Kişi için {value.getUTCDate()}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreBookingShowcase;
