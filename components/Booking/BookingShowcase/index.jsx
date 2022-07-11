import { Button, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import enLocale from "date-fns/locale/en-US";
import trLocale from "date-fns/locale/tr";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./StoreBookingShowcase.module.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import InstagramIcon from "@mui/icons-material/Instagram";
import ProgressBar from "./components/ProgressBar";
import Image from "next/image";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "notistack";
import axios from "axios";
import Cookies from "js-cookie";
const localeMap = {
  en: enLocale,
  tr: trLocale,
};

const StoreBookingShowcase = ({ store }) => {
  const [locale, setLocale] = useState("tr");
  const [hours, setHours] = useState([]);
  const [activeNavBar, setActiveNavBar] = useState("aboutUs");
  const [date, setDate] = useState(new Date());
  const [people, setPeople] = useState(1);
  const [dayName, setDayName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [difference, setDifference] = useState(null);
  const [selectedHour, setSelectedHour] = useState("");
  const [isPeopleValid, setIsPeopleValid] = useState(true);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [isDateValid, setIsDateValid] = useState(true);
  let user;
  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }

  useEffect(() => {
    if (date) {
      setIsDateValid(true);
    } else {
      setIsDateValid(false);
    }
  }, [date]);

  useEffect(() => {
    if (!people || people < 1 || people > 99) {
      setIsPeopleValid(false);
    } else {
      setIsPeopleValid(true);
    }
  }, [people]);

  useEffect(() => {
    if (selectedHour) {
      setDate(
        new Date(
          date.setHours(
            selectedHour?.split(":")[0],
            selectedHour?.split(":")[1],
            "00"
          )
        )
      );
    }
  }, [selectedHour]);

  useEffect(() => {
    let number =
      Number(endTime?.split(":")[0]) - Number(startTime?.split(":")[0]);
    setDifference(number * 2);
  }, [startTime, endTime]);
  const handleChange = (newDate) => {
    setDate(newDate);
  };

  useEffect(() => {
    if (date) {
      setDayName(
        date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
      );
    }
  }, [date]);

  useEffect(() => {
    if (dayName) {
      setStartTime(
        store?.workingTimes[`${dayName?.toLowerCase()}`]?.workingHours.starts
      );
      setEndTime(
        store?.workingTimes[`${dayName?.toLowerCase()}`]?.workingHours.ends ===
          "00:00"
          ? "24:00"
          : store?.workingTimes[`${dayName?.toLowerCase()}`]?.workingHours.ends
      );
    }
  }, [dayName, store]);

  useEffect(() => {
    if (startTime) {
      setStartDate(
        new Date(
          date.setHours(
            startTime?.split(":")[0],
            startTime?.split(":")[1],
            "00"
          )
        )
      );
    }
  }, [startTime]);

  useEffect(() => {
    if (startDate) {
      let max = difference * 30;
      for (let i = 0; i <= max; i += 30) {
        setHours((oldDate) => [
          ...oldDate,
          new Date(startDate.getTime() + i * 60000).getHours() +
            ":" +
            new Date(startDate.getTime() + i * 60000).getMinutes(),
        ]);
      }
    }
  }, [startDate]);

  const handleSendBooking = async (e) => {
    e.preventDefault();
    const createdAt = new Date();
    try {
      setLoading(true);
      await axios.post(
        `/api/booking/${store?.storeName}/booking`,
        {
          storeName: store?.storeName,
          bookings: [
            {
              createdAt,
              people: Number(people),
              date,
              userName: user.firstName + " " + user.lastName,
              userEmail: user.email,
            },
          ],
          userId: user?.id,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );

      setLoading(false);
      enqueueSnackbar("Rezervasyon başarılı.", { variant: "success" });
    } catch (err) {
      console.log(err);
      setLoading(false);
      enqueueSnackbar("Rezervasyon başarısız.", { variant: "error" });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.app}>
        <div className={styles.left}>
          {store?.storeLogo ? (
            <>
              <div className={styles.titleAndLogo}>
                <Image
                  src={store?.storeLogo}
                  className={styles.logo}
                  alt={store?.storeName}
                  objectFit="contain"
                  width="70"
                  height="70"
                />
                <div>
                  <h1 className={styles.storeName}>
                    {store?.storeName?.split(" ")[0][0] ===
                    store?.storeName[0][0].toLowerCase()
                      ? store?.storeName
                          ?.split(" ")
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
                {store?.storeName?.split(" ")[0][0] ===
                store?.storeName[0][0].toLowerCase()
                  ? store?.storeName
                      ?.split(" ")
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
            <Image
              src={store?.gallery?.galleryImage}
              className={styles.galleryImage}
              alt={store?.storeName}
              width="100%"
              height="60"
              layout="responsive"
              objectFit="contain"
            />
          </div>
          <div className={styles.storeNavBar}>
            <ul className={styles.list}>
              <li className={styles.li}>
                <Button
                  href=""
                  variant={activeNavBar === "aboutUs" ? "contained" : ""}
                  color="primary"
                  className={styles.menuButtons}
                  onClick={() => setActiveNavBar("aboutUs")}
                >
                  Hakkımızda
                </Button>
              </li>
              <li className={styles.li}>
                <Button
                  variant={activeNavBar === "menu" ? "contained" : ""}
                  href=""
                  className={styles.menuButtons}
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
                  className={styles.menuButtons}
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
                <div className={styles.aboutUs}>
                  <div style={{ width: "100%" }}>
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
                          <Button className={styles.buttons}>
                            <CallIcon color="success" />
                            <p
                              style={{
                                color: "#006d77",
                                fontWeight: "600",
                              }}
                            >
                              {store?.contact?.phoneNumber}
                            </p>
                          </Button>
                          <Button className={styles.buttons}>
                            <InstagramIcon color="secondary" />
                            <a
                              href={store?.contact?.instagramLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <p
                                style={{
                                  color: "#006d77",
                                  fontWeight: "600",
                                }}
                              >
                                {store?.contact?.instagramLink?.split("/")[3]}
                              </p>
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                    {store?.address?.address && (
                      <div className={styles.storeAddress}>
                        <h3 className={styles.centeredHeader}>Adres</h3>
                        <Button className={styles.buttons}>
                          <LocationOnIcon color="primary" />
                          <p
                            style={{
                              color: "#006d77",
                              fontWeight: "600",
                            }}
                          >
                            {store?.address?.address}
                          </p>
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className={styles.bodyRight}>
                    {store?.workingTimes && (
                      <div className={styles.workingTimesTable}>
                        <h3 className={styles.workingTimesHeader}>
                          Çalışma Saatleri
                        </h3>
                        <ul style={{ margin: "0", padding: "0" }}>
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
                            <li className={styles.workingTimes}>
                              <h4 className={styles.dayClose}>Pazartesi</h4>
                              <span className={styles.hoursClose}>
                                <span align="center" style={{ width: "100%" }}>
                                  {" "}
                                  -{" "}
                                </span>
                              </span>
                            </li>
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
                            <li className={styles.workingTimes}>
                              <h4 className={styles.dayClose}>Salı</h4>
                              <span className={styles.hoursClose}>
                                <span align="center" style={{ width: "100%" }}>
                                  {" "}
                                  -{" "}
                                </span>
                              </span>
                            </li>
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
                            <li className={styles.workingTimes}>
                              <h4 className={styles.dayClose}>Çarşamba</h4>
                              <span className={styles.hoursClose}>
                                <span align="center" style={{ width: "100%" }}>
                                  {" "}
                                  -{" "}
                                </span>
                              </span>
                            </li>
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
                            <li className={styles.workingTimes}>
                              <h4 className={styles.dayClose}>Cuma</h4>
                              <span className={styles.hoursClose}>
                                <span align="center" style={{ width: "100%" }}>
                                  {" "}
                                  -{" "}
                                </span>
                              </span>
                            </li>
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
                            <li className={styles.workingTimes}>
                              <h4 className={styles.dayClose}>Cumartesi</h4>
                              <span className={styles.hoursClose}>
                                <span align="center" style={{ width: "100%" }}>
                                  {" "}
                                  -{" "}
                                </span>
                              </span>
                            </li>
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
                            <li className={styles.workingTimes}>
                              <h4 className={styles.dayClose}>Pazar</h4>
                              <span className={styles.hoursClose}>
                                <span align="center" style={{ width: "100%" }}>
                                  {" "}
                                  -{" "}
                                </span>
                              </span>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeNavBar === "menu" && <div className={styles.menu}></div>}
            {activeNavBar === "photos" && (
              <div className={styles.photos}>
                {store?.gallery?.images.length > 0 ? (
                  <div className={styles.galleryBottomImages}>
                    {store?.gallery?.images.map((img) => (
                      <Image
                        key={img?.id}
                        src={img?.image}
                        alt={store?.storeName}
                        width="360"
                        height="200"
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
          <div style={{ margin: "2rem 0" }}>
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
                error={!isPeopleValid}
                helperText={
                  !isPeopleValid ? "Lütfen geçerli bir sayı giriniz." : ""
                }
                defaultValue={people}
                sx={{ width: "100%" }}
                variant="standard"
                onChange={(e) => setPeople(e.target.value)}
              />
              <LocalizationProvider
                locale={localeMap[locale]}
                dateAdapter={AdapterDateFns}
                sx={{ width: "100%" }}
              >
                <Stack spacing={3} sx={{ width: "100%" }}>
                  <DesktopDatePicker
                    sx={{ width: "100%" }}
                    label="Tarih Seçiniz"
                    inputFormat="dd/MM/yyyy"
                    value={date}
                    onChange={handleChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!isDateValid}
                        helperText={
                          isDateValid ? "" : "Lütfen bir tarih seçiniz."
                        }
                      />
                    )}
                  />

                  {date ? (
                    <div className={styles.hourButtons}>
                      {hours.map((hour, i) => (
                        <Button
                          key={i}
                          variant={
                            (hour?.split(":")[0].length === 1
                              ? "0" + `${hour?.split(":")[0]}`
                              : hour?.split(":")[0]) +
                              ":" +
                              (hour?.split(":")[1].length === 1
                                ? "0" + `${hour?.split(":")[1]}`
                                : hour?.split(":")[1]) ===
                            selectedHour
                              ? "contained"
                              : "outlined"
                          }
                          color="primary"
                          onClick={(e) =>
                            setSelectedHour(
                              (hour?.split(":")[0].length === 1
                                ? "0" + `${hour?.split(":")[0]}`
                                : hour?.split(":")[0]) +
                                ":" +
                                (hour?.split(":")[1].length === 1
                                  ? "0" + `${hour?.split(":")[1]}`
                                  : hour?.split(":")[1])
                            )
                          }
                        >
                          {hour?.split(":")[0].length === 1
                            ? "0" + `${hour?.split(":")[0]}`
                            : hour?.split(":")[0]}
                          <span> : </span>
                          {hour?.split(":")[1].length === 1
                            ? "0" + `${hour?.split(":")[1]}`
                            : hour?.split(":")[1]}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    ""
                  )}
                </Stack>
              </LocalizationProvider>
              <LoadingButton
                size="medium"
                fullWidth
                onClick={(e) => {
                  if (isPeopleValid && isDateValid && selectedHour) {
                    handleSendBooking(e);
                  }
                }}
                loading={loading}
                color="warning"
                variant="contained"
                disabled={loading}
              >
                Rezervasyon Yap
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreBookingShowcase;
