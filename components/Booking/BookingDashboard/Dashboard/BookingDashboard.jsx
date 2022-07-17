import React, { useState, useEffect, useRef } from "react";
import styles from "./BookingDashboard.module.css";
import { Country, State, City } from "country-state-city";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import DashboardIcon from "@mui/icons-material/Dashboard";
import useTranslation from "next-translate/useTranslation";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Button, IconButton, Input, List, ListItem } from "@material-ui/core";
import ModalMui from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { PhotoCamera } from "@material-ui/icons";
import ReactAudioPlayer from "react-audio-player";
import { useSnackbar } from "notistack";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { v4 as uuidv4 } from "uuid";
import { DataGrid } from "@mui/x-data-grid";
import { trTR } from "@mui/x-data-grid";
import { InputLabel, NativeSelect, Select, Stack } from "@mui/material";
import { Switch } from "@nextui-org/react";
import TextField from "@mui/material/TextField";
import CallIcon from "@mui/icons-material/Call";
import InstagramIcon from "@mui/icons-material/Instagram";
import Image from "next/image";
import WorkingTimesModal from "./WorkingTimesModal";

const BookingDashboard = ({ userOrder }) => {
  const [store, setStore] = useState(userOrder?.booking);
  const [isFetching, setIsFetching] = useState(false);
  const [file, setFile] = useState(null);
  const [address, setAddress] = useState(store?.address?.address);
  const [countryName, setCountryName] = useState(store?.address?.country);
  const [tableDate, setTableDate] = useState(new Date());
  const [stateName, setStateName] = useState(store?.address?.state);
  const [cityName, setCityName] = useState(store?.address?.city);
  const [phoneNumber, setPhoneNumber] = useState(
    store?.contact?.phoneNumber || ""
  );
  const [instagramLink, setInstagramLink] = useState(
    store?.contact?.instagramLink || ""
  );
  const [pageSize, setPageSize] = useState(20);
  const [countryCode, setCountryCode] = useState("");
  const [openPrices, setOpenPrices] = useState(false);
  const [stateCities, setStateCities] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [navbarColor, setNavbarColor] = useState(store?.navbar?.color || "");
  const [openUploadLogo, setOpenUploadLogo] = useState(false);
  const [capacity, setCapacity] = useState(store?.capacity || []);
  const [openAddress, setOpenAddress] = useState(false);
  const [openColumns, setOpenColumns] = useState(false);
  const [openStage, setOpenStage] = useState(false);
  const [openGate, setOpenGate] = useState(false);
  const [openNavbarColor, setOpenNavbarColor] = useState(false);
  const [openSavedColumns, setOpenSavedColumns] = useState(false);
  const [order, setOrder] = useState([]);
  const [stateCode, setStateCode] = useState("");
  const [price, setPrice] = useState(store?.prices?.price || null);
  const [isPricesActive, setIsPricesActive] = useState(
    store?.prices?.isActive || false
  );
  const { t } = useTranslation();
  /*   const [gate, setGate] = useState(store?.bookingSchema.gate || "none");
  const [stage, setStage] = useState(store?.bookingSchema.stage || "none");
  const [columns, setColumns] = useState(store?.bookingSchema.columns || null);
  const [signalToColumns, setSignalToColumns] = useState(false);
  const [signalReturned, setSignalReturned] = useState(false); */
  const [gallery, setGallery] = useState(store?.gallery || null);
  const [openWorkingTimes, setOpenWorkingTimes] = useState(false);
  const [tableSize, setTableSize] = useState(null);
  const [tableQuantity, setTableQuantity] = useState(null);
  const [maxCap, setMaxCap] = useState(null);
  const [remainTables, setRemainTables] = useState(null);
  const [images, setImages] = useState(store?.gallery?.images || []);
  const [reserved, setReserved] = useState(0);
  const [remains, setRemains] = useState(+maxCap - +reserved || 0);
  const [tableData, setTableData] = useState(store?.bookings || []);
  const [galleryImage, setGalleryImage] = useState(
    store?.gallery?.galleryImage || null
  );
  /*   const [savedColumns, setSavedColumns] = useState(
    store?.bookingSchema?.savedColumns || {}
  ); */
  const allCountries = Country.getAllCountries();
  const allStates = State.getAllStates();
  const [openContact, setOpenContact] = useState(false);
  let user;
  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }
  const [storeLogo, setStoreLogo] = useState(
    store?.storeLogo ||
      "https://res.cloudinary.com/dlyjd3mnb/image/upload/v1650137521/uploads/logoDefault_ez8obk.png"
  );
  const [openGallery, setOpenGallery] = useState(false);
  const [openCapacity, setOpenCapacity] = useState(false);
  const handleChangeState = (event) => {
    setStateName(event.target.value);
  };
  const handleChangeCity = (event) => {
    setCityName(event.target.value);
  };

  const handleCloseGallery = () => {
    setOpenGallery(false);
  };
  const handleOpenGallery = () => setOpenGallery(true);
  const handleOpenAddress = () => setOpenAddress(true);
  const handleCloseAddress = () => {
    setOpenAddress(false);
    setAddress(store?.address?.address);
    setCountryName(store?.address?.country);
    setStateName(store?.address?.state);
    setCityName(store?.address?.city);
  };
  const handleOpenPrices = () => setOpenPrices(true);
  const handleClosePrices = () => {
    setIsPricesActive(store?.prices?.isActive);
    setPrice(store?.prices?.price);
    setOpenPrices(false);
  };
  const handleOpenNavbarColor = () => setOpenNavbarColor(true);
  const handleCloseNavbarColor = () => {
    setNavbarColor(store?.navbar?.color);
    setOpenNavbarColor(false);
  };
  const handleOpenCapacity = () => setOpenCapacity(true);
  const handleCloseCapacity = () => {
    setCapacity(store?.capacity || []);

    setOpenCapacity(false);
  };
  const handleOpenUploadLogo = () => setOpenUploadLogo(true);
  const handleCloseUploadLogo = () => setOpenUploadLogo(false);
  const handleOpenContact = () => setOpenContact(true);

  const handleCloseContact = () => setOpenContact(false);
  /*   const handleOpenColumns = () => setOpenColumns(true);
  const handleCloseColumns = () => setOpenColumns(false);
  const handleOpenGate = () => setOpenGate(true);
  const handleCloseGate = () => setOpenGate(false);
  const handleOpenSavedColumns = () => setOpenSavedColumns(true);
  const handleCloseSavedColumns = () => setOpenSavedColumns(false); */
  /*   const handleOpenStage = () => setOpenStage(true);
  const handleCloseStage = () => {
    setOpenStage(false);

    if (stage !== store?.bookingSchema?.stage) {
      setStage(store?.bookingSchema?.stage);
    }
  }; */
  const [isNew, setIsNew] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [refreshToken, setRefreshToken] = useState(Math.random());
  const audioRef = useRef();
  const audio = audioRef?.current?.audioEl?.current;

  useEffect(() => {
    let people = 0;
    store?.bookings
      .filter(
        (booking) =>
          new Date(booking?.createdAt)?.toLocaleDateString() ===
          new Date(tableDate).toLocaleDateString()
      )
      .map((booking) => (people += booking?.people));

    setReserved(people);
  }, [store?.bookings, tableDate]);

  useEffect(() => {
    setRemains(+maxCap - +reserved);
  }, [reserved, maxCap]);

  useEffect(() => {
    retrieveData().finally(() => {
      setTimeout(() => setRefreshToken(Math.random()), 15000);
    });
  }, [refreshToken]);
  const retrieveData = async () => {
    const storeName = store?.storeName;
    try {
      const newStore = await axios.post(
        `/api/booking/${storeName}/getStore`,
        {
          storeName,
        },
        {
          headers: { authorization: `Bearer ${user?.token}` },
        }
      );
      if (store?.bookings?.length < newStore?.data?.store?.bookings?.length) {
        setIsNew(true);
        setStore(newStore?.data?.store);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setTableData(
      store?.bookings?.filter(
        (booking) =>
          new Date(booking?.createdAt)?.toLocaleDateString() ===
          new Date(tableDate)?.toLocaleDateString()
      )
    );
  }, [tableDate, store?.bookings]);

  useEffect(() => {
    if (isNew) {
      enqueueSnackbar("Yeni Rezervasyon", { variant: "success" });
      audio.play();
      setIsNew(false);
    } else {
      return;
    }
  }, [isNew]);

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess(true);
    } catch (err) {
      setCopySuccess(false);
    }
  };
  useEffect(() => {
    let tables = 0;
    let maxCap = 0;
    capacity?.map(
      (table) => (maxCap += table?.tableSize * table?.tableQuantity)
    );
    setMaxCap(maxCap);
    capacity?.map((table) => (tables += table?.tableQuantity));
    setRemainTables(tables);
  }, [capacity]);

  useEffect(() => {
    if (copySuccess) {
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    }
  }, [copySuccess]);

  useEffect(() => {
    if ((countryCode, stateCode)) {
      setStateCities(City.getCitiesOfState(countryCode, stateCode));
    }
  }, [countryCode, stateCode]);

  useEffect(() => {
    if (countryCode) {
      setCountryStates(State.getStatesOfCountry(countryCode));
    }
  }, [countryCode]);

  useEffect(() => {
    if (countryName) {
      setCountryCode(
        allCountries?.filter((country) => country?.name === countryName)[0]
          ?.isoCode
      );
    }
  }, [countryName]);

  useEffect(() => {
    setStateCode(
      allStates?.filter((state) => state?.name === stateName)[0]?.isoCode
    );
  }, [stateName]);

  const columns = [
    {
      field: "userName",
      headerName: "Ad Soyad",
      flex: 1,
    },
    {
      field: "userEmail",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "people",
      headerName: "Kişi Sayısı",
      flex: 1,
    },
    {
      field: "isPaid",
      headerName: "Kapora",
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            {params.row.isPaid === true ? (
              <p
                style={{
                  backgroundColor: "#a3b18a",
                  padding: "2rem",
                  minWidth: "8rem",
                }}
              >
                Ödendi
              </p>
            ) : (
              <p style={{ padding: "2rem", minWidth: "8rem" }}>Ödenmedi</p>
            )}
          </div>
        );
      },
    },

    {
      field: "date",
      headerName: "Rezervasyon Tarihi",
      flex: 2,
      renderCell: (params) => {
        return (
          <div
            style={
              new Date(params.row.date).toLocaleDateString() ===
              new Date().toLocaleDateString()
                ? { backgroundColor: "#f2cc8f", padding: "2rem" }
                : { backgroundColor: "", padding: "2rem" }
            }
          >
            {new Date(params.row.date).toLocaleString()}
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Oluşturulma Tarihi",
      hide: false,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return <span> {new Date(params.row.createdAt).toLocaleString()}</span>;
      },
    },
  ];

  const handleUpdateGallery = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const data2 = new FormData();
    data.append("file", file);
    data2.append("file", galleryImage);
    data.append("upload_preset", "uploads");
    data2.append("upload_preset", "uploads");
    try {
      setIsFetching(true);
      let storeName = store?.storeName;
      let uploadRes;
      if (file) {
        uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
          data
        );
      }
      let uploadImage;
      if (typeof galleryImage === "object") {
        uploadImage = await axios.post(
          "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
          data2
        );
      }
      if (uploadRes) {
        images.push({
          image: uploadRes?.data.url,
        });
      }
      if (uploadImage) {
        uploadImage = uploadImage?.data?.url;
      }
      if (uploadImage) {
        const newGallery = await axios.patch(
          `/api/booking/${storeName}/gallery`,
          {
            storeName,
            gallery: {
              images,
              galleryImage: uploadImage,
            },
          },
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        );
        setGalleryImage(newGallery?.data?.gallery?.galleryImage);
        setImages(newGallery?.data?.gallery?.images);
      } else {
        const newGallery = await axios.patch(
          `/api/booking/${storeName}/gallery`,
          {
            storeName,
            gallery: {
              images,
              galleryImage,
              isActive: isGalleryActive,
            },
          },
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        );
        setGalleryImage(newGallery?.data?.gallery?.galleryImage);
        setImages(newGallery?.data?.gallery?.images);
      }
      handleCloseGallery();
      setIsFetching(false);
      return enqueueSnackbar(t("panel:galleryUpdated"), {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      handleCloseGallery();
    }
  };

  const uploadLogoHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploads");
    try {
      setIsFetching(true);
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
        data
      );
      await axios.post(
        `/api/booking/${store?.storeName}/logo`,
        {
          storeName: store?.storeName,
          storeLogo: uploadRes?.data?.url,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      setStoreLogo(uploadRes?.data?.url);
      handleCloseUploadLogo();
      setFile(null);
      setIsFetching(false);
      enqueueSnackbar(t("panel:uploadedLogo"), { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setFile(null);
      enqueueSnackbar(t("panel:notUploadedLogo"), { variant: "error" });
    }
  };

  /*  const handleUpdateStage = async (e) => {
    e.preventDefault();
    try {
      setIsFetching(true);
      await axios
        .post(
          `/api/booking/${store?.storeName}/stage`,
          {
            storeName: store?.storeName,
            bookingSchema: {
              stage,
              columns: store?.bookingSchema?.columns,
              gate: store?.bookingSchema?.gate,
            },
          },
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        )
        .then((res) => {
          setStore(res.data.store);
        });
      setOpenStage(false);
      setIsFetching(false);
      enqueueSnackbar("Sahne başarıyla güncellendi.", { variant: "success" });
    } catch (err) {
      console.log(err);
      setOpenStage(false);
      setIsFetching(false);
      enqueueSnackbar("Sahne güncellemesi başarısız.", { variant: "error" });
    }
  };
 */
  const handleUpdateNavbarColor = async (e) => {
    e.preventDefault();
    try {
      setIsFetching(true);
      await axios.post(
        `/api/booking/${store?.storeName}/color`,
        {
          storeName: store?.storeName,
          navbar: {
            color: navbarColor,
          },
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );

      setIsFetching(false);
      setOpenNavbarColor(false);
      enqueueSnackbar("Renkler başarıyla güncellendi.", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      setOpenNavbarColor(false);
      setIsFetching(false);
      enqueueSnackbar("Renkler güncellemesi başarısız.", {
        variant: "error",
      });
    }
  };
  const handleUpdateCapacity = async (e) => {
    e.preventDefault();
    try {
      setIsFetching(true);
      await axios.post(
        `/api/booking/${store?.storeName}/capacity`,
        {
          storeName: store?.storeName,
          capacity,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );

      setIsFetching(false);
      setOpenCapacity(false);
      enqueueSnackbar("Kapasite başarıyla güncellendi.", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      setOpenCapacity(false);
      setIsFetching(false);
      enqueueSnackbar("Kapasite güncellemesi başarısız.", {
        variant: "error",
      });
    }
  };
  const handleUpdatePrices = async (e) => {
    e.preventDefault();
    try {
      setIsFetching(true);
      const res = await axios.post(
        `/api/booking/${store?.storeName}/prices`,
        {
          storeName: store?.storeName,
          prices: {
            isActive: isPricesActive,
            price,
          },
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      setStore(res.data.store);
      setIsFetching(false);
      setOpenPrices(false);
      enqueueSnackbar("Kapora Fiyatları başarıyla güncellendi.", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      setOpenPrices(false);
      setIsFetching(false);
      enqueueSnackbar("Kapora Fiyatları güncellemesi başarısız.", {
        variant: "error",
      });
    }
  };

  /* const handleUpdateColumns = async (e) => {
    e.preventDefault();
    try {
      setIsFetching(true);
      await axios
        .post(
          `/api/booking/${store?.storeName}/columns`,
          {
            storeName: store?.storeName,
            bookingSchema: {
              stage: store?.bookingSchema?.stage,
              columns,
              gate: store?.bookingSchema?.gate,
            },
          },
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        )
        .then((res) => {
          setStore(res.data.store);
        });
      setOpenColumns(false);
      setIsFetching(false);
      enqueueSnackbar("Sütun başarıyla güncellendi.", { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setFile(null);
      enqueueSnackbar("Sütun güncellemesi başarısız.", { variant: "error" });
    }
  };

  const handleUpdateGate = async (e) => {
    e.preventDefault();
    try {
      setIsFetching(true);
      await axios
        .post(
          `/api/booking/${store?.storeName}/gate`,
          {
            storeName: store?.storeName,
            bookingSchema: {
              stage: store?.bookingSchema?.stage,
              columns: store?.bookingSchema?.columns,
              gate,
            },
          },
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        )
        .then((res) => {
          setStore(res.data.store);
        });
      setOpenGate(false);
      setIsFetching(false);
      enqueueSnackbar("Giriş noktası başarıyla güncellendi.", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setFile(null);
      enqueueSnackbar("Giriş noktası güncellemesi başarısız.", {
        variant: "error",
      });
    }
  }; */

  const handleUpdateContact = async () => {
    try {
      setIsFetching(true);
      await axios.post(
        `/api/booking/${store?.storeName}/contact`,
        {
          storeName: store?.storeName,
          contact: {
            phoneNumber,
            instagramLink,
          },
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );

      setOpenContact(false);
      setIsFetching(false);
      enqueueSnackbar("İletişim Bilgileri başarıyla güncellendi.", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      enqueueSnackbar("İletişim Bilgileri güncellemesi başarısız.", {
        variant: "error",
      });
    }
  };

  const handleUpdateAddressInfos = async () => {
    try {
      setIsFetching(true);
      await axios.post(
        `/api/booking/${store?.storeName}/address`,
        {
          storeName: store?.storeName,
          address: {
            address,
            country: countryName,
            state: stateName,
            city: cityName,
          },
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );

      setOpenAddress(false);
      setIsFetching(false);
      enqueueSnackbar("Adres başarıyla güncellendi.", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      enqueueSnackbar("Adres güncellemesi başarısız.", {
        variant: "error",
      });
    }
  };

  /* const handleUpdateSavedColumns = async () => {
    try {
      setIsFetching(true);
      await axios
        .post(
          `/api/booking/${store?.storeName}/savedColumns`,
          {
            storeName: store?.storeName,
            bookingSchema: {
              stage: store?.bookingSchema?.stage,
              columns: store?.bookingSchema?.columns,
              gate: store?.bookingSchema?.gate,
              savedColumns,
            },
          },
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        )
        .then((res) => {
          setStore(res.data.store);
        });
      setOpenSavedColumns(false);
      setIsFetching(false);
      enqueueSnackbar("Düzen başarıyla güncellendi.", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setFile(null);
      enqueueSnackbar("Düzen güncellemesi başarısız.", {
        variant: "error",
      });
    }
  }; */

  /*   useEffect(() => {
    if (signalReturned === true) {
      setSignalReturned(false);
      handleUpdateSavedColumns();
    }
  }, [signalReturned]); */

  return (
    <div className={styles.container}>
      <div className={styles.sideBar}>
        <div className={styles.sidebar}>
          <Image
            src={storeLogo}
            alt="Logo"
            width="70"
            height="70"
            objectFit="contain"
            className={styles.logo}
          />
          <div className={styles.side}>
            <h3 className={styles.header} style={{ color: "#fff" }}>
              Paylaş
            </h3>
            <Button
              className={styles.copy}
              onClick={(e) =>
                copyToClipBoard(
                  `https://www.digicafes.com/booking/${store?.storeName}`
                )
              }
              variant="outlined"
            >
              {copySuccess ? (
                <span>Kopyalandı!</span>
              ) : (
                <span style={{ textTransform: "lowercase" }}>
                  {`https://www.digicafes.com/booking/${store?.storeName}`}
                </span>
              )}
            </Button>
          </div>
          <div>
            <h3 className={styles.sidebarHeader}>
              <DashboardIcon />
            </h3>
            <ul className={styles.sidebarList}>
              <li className={styles.li}>
                <Link href={`/booking/${store?.storeLinkName}`} passHref>
                  <a target="_blank">
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" className={styles.buttons}>
                        İşletme Sayfası
                      </Button>
                    </Stack>
                  </a>
                </Link>
              </li>
              <li>
                <Button
                  variant="outlined"
                  className={styles.buttons}
                  type="submit"
                  onClick={handleOpenAddress}
                >
                  Adres Bilgileri
                </Button>
              </li>
              <li>
                <Button
                  variant="outlined"
                  className={styles.buttons}
                  type="submit"
                  onClick={handleOpenContact}
                >
                  İletişim Bilgileri
                </Button>
              </li>
              <li>
                <Button
                  variant="outlined"
                  className={styles.buttons}
                  type="submit"
                  onClick={() => setOpenWorkingTimes(true)}
                >
                  Çalışma Saatleri
                </Button>
              </li>
              <li>
                <Button
                  variant="outlined"
                  className={styles.buttons}
                  type="submit"
                  onClick={handleOpenCapacity}
                >
                  Toplam Kapasite
                </Button>
              </li>
              <li>
                <Button
                  variant="outlined"
                  className={styles.buttons}
                  type="submit"
                  onClick={handleOpenUploadLogo}
                >
                  {t("panel:uploadLogo")}
                </Button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className={styles.sidebarHeader}>
              <DashboardCustomizeIcon />
            </h3>
            <ul className={styles.sidebarList}>
              <li>
                <Button
                  variant="contained"
                  type="submit"
                  className={styles.actionButtons}
                  color="primary"
                  onClick={handleOpenGallery}
                >
                  {t("panel:gallery")}
                </Button>
              </li>
              <li>
                <Button
                  className={styles.actionButtons}
                  variant="contained"
                  type="submit"
                  color="primary"
                  onClick={handleOpenPrices}
                >
                  Kapora
                </Button>
              </li>
              <li>
                <Button
                  className={styles.actionButtons}
                  variant="contained"
                  type="submit"
                  color="primary"
                  onClick={handleOpenNavbarColor}
                >
                  Renkler
                </Button>
              </li>
              {/*   <li>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    height: "2rem",
                    minWidth: "11rem",
                    fontSize: "13px",
                    color: "#fbeee0",
                  }}
                  type="submit"
                  onClick={handleOpenStage}
                >
                  Sahne
                </Button>
              </li>
              <li>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    height: "2rem",
                    minWidth: "11rem",
                    fontSize: "13px",
                    color: "#fbeee0",
                  }}
                  type="submit"
                  onClick={handleOpenColumns}
                >
                  Sütun
                </Button>
              </li>
              <li>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    height: "2rem",
                    minWidth: "11rem",
                    fontSize: "13px",
                    color: "#fbeee0",
                  }}
                  type="submit"
                  onClick={handleOpenGate}
                >
                  Giriş Noktası
                </Button>
              </li>
              <li>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    height: "2rem",
                    minWidth: "11rem",
                    fontSize: "13px",
                    color: "#fbeee0",
                  }}
                  type="submit"
                  onClick={handleOpenSavedColumns}
                >
                  Düzeni Kaydet
                </Button>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.app}>
        <div className={styles.topBar}>
          <div className={styles.side}>
            <h3 className={styles.header}>İşletme Adı</h3>
            <p className={styles.desc}>{store?.storeName}</p>
          </div>
          <div className={styles.side}>
            <h3 className={styles.header}>Masa Sayısı</h3>
            <p className={styles.desc}>{store?.tableNum}</p>
          </div>
          <div className={styles.side}>
            <h3 className={styles.header}>Maksimum Kapasite (Kişi)</h3>
            <p className={styles.desc}>{maxCap}</p>
          </div>
          <div className={styles.side}>
            <h3 className={styles.header}>Kalan Yer (Kişi)</h3>
            <p className={styles.desc}> {remains}</p>
          </div>
          <div className={styles.side}>
            <h3 className={styles.header}>Tablo</h3>
            <TextField
              id="date"
              label="Tarih Seçiniz"
              type="date"
              defaultValue={tableDate}
              onChange={(e) => setTableDate(new Date(e.target.value))}
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </div>
        <div className={styles.body}>
          <DataGrid
            rows={tableData || []}
            classnName={styles.table}
            density="compact"
            sx={{ padding: "0 1rem" }}
            columns={columns}
            initialState={{
              sorting: {
                sortModel: [{ field: "createdAt", sort: "desc" }],
              },
            }}
            getRowId={(row) => row?._id}
            localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
            disableSelectionOnClick
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[20, 40, 60]}
            pagination
          />
        </div>
        {/*   <DragDrop
          stage={store?.bookingSchema?.stage}
          storeName={store?.storeName}
          tableNum={store?.tableNum}
          setSignalReturned={setSignalReturned}
          gate={store?.bookingSchema?.gate}
          signalToColumns={signalToColumns}
          savedColumns={savedColumns}
          setSavedColumns={setSavedColumns}
          bookingColumns={store?.bookingSchema?.columns}
        /> */}
      </div>
      <ModalMui
        open={openUploadLogo}
        onClose={handleCloseUploadLogo}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
          <form>
            <List className={styles.list}>
              <h3 className={styles.header}>{t("panel:uploadLogo")}</h3>

              <ListItem>
                <label htmlFor="icon-button-file">
                  <Input
                    accept="image/*"
                    id="icon-button-file"
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </ListItem>
              <ListItem
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "1rem",
                  paddingTop: "1rem",
                }}
              >
                <Button
                  variant="outlined"
                  type="submit"
                  onClick={handleCloseUploadLogo}
                  color="primary"
                >
                  {t("panel:discard")}
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={uploadLogoHandler}
                  color="secondary"
                >
                  {t("panel:upload")}
                </Button>
              </ListItem>
            </List>
          </form>
        </Box>
      </ModalMui>
      <WorkingTimesModal
        store={store}
        openWorkingTimes={openWorkingTimes}
        setOpenWorkingTimes={(boolean) => setOpenWorkingTimes(boolean)}
        setIsFetching={(boolean) => setIsFetching(boolean)}
      />
      {/*  <ModalMui
        open={openSavedColumns}
        onClose={handleCloseSavedColumns}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
          <List className={styles.list}>
            <h3 className={styles.header}>Emin misiniz?</h3>
            <p style={{ margin: "1rem" }}>Masa düzeni kaydedilecek.</p>
            <ListItem
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "1rem",
                paddingTop: "1rem",
              }}
            >
              <Button
                variant="outlined"
                type="submit"
                onClick={handleCloseSavedColumns}
                color="primary"
              >
                {t("panel:discard")}
              </Button>
              <Button
                variant="contained"
                type="submit"
                onClick={(e) => {
                  setSignalToColumns(true);
                }}
                color="secondary"
              >
                {t("panel:save")}
              </Button>
            </ListItem>
          </List>
        </Box>
      </ModalMui> */}
      {/*   <ModalMui
        open={openStage}
        onClose={handleCloseStage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
          <form>
            <List className={styles.list}>
              <h3 className={styles.header}>Sahne Ayarı</h3>
              <ListItem style={{ margin: "0 auto" }}>
                <FormControl
                  style={{
                    margin: "1rem auto",
                  }}
                >
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value="yes"
                      checked={stage === "yes" ? true : false}
                      control={<Radio />}
                      onClick={(e) => setStage(e.target.value)}
                      label="Sahne Var"
                    />
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value="no"
                      checked={stage === "no" ? true : false}
                      control={<Radio />}
                      onClick={(e) => setStage(e.target.value)}
                      label="Sahne Yok"
                    />
                  </RadioGroup>
                </FormControl>
              </ListItem>

              <ListItem
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  paddingTop: "2rem",
                }}
              >
                <Button
                  variant="outlined"
                  type="submit"
                  onClick={handleCloseStage}
                  color="primary"
                >
                  {t("panel:discard")}
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={(e) => {
                    if (stage !== null) {
                      handleUpdateStage(e);
                    }
                  }}
                  color="secondary"
                >
                  {t("panel:save")}
                </Button>
              </ListItem>
            </List>
          </form>
        </Box>
      </ModalMui> */}
      {/*  <ModalMui
        open={openGate}
        onClose={handleCloseGate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
          <form>
            <List className={styles.list}>
              <h3 className={styles.header}>
                Mekan&apos;a Giriş Noktası (Kuş Bakışı)
              </h3>
              <ListItem style={{ margin: "0 auto" }}>
                <FormControl
                  style={{
                    margin: "0 auto",
                  }}
                >
                  <RadioGroup
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      width: "100%",
                      gap: "6px",
                    }}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value="left-up"
                      control={<Radio />}
                      checked={gate === "left-up" ? true : false}
                      label="Sol Üst"
                      onClick={(e) => setGate(e.target.value)}
                    />
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value="up"
                      checked={gate === "up" ? true : false}
                      control={<Radio />}
                      label="Üst"
                      onClick={(e) => setGate(e.target.value)}
                    />
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value="right-up"
                      checked={gate === "right-up" ? true : false}
                      control={<Radio />}
                      label="Sağ Üst"
                      onClick={(e) => setGate(e.target.value)}
                    />
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value="left"
                      checked={gate === "left" ? true : false}
                      control={<Radio />}
                      label="Sol"
                      onClick={(e) => setGate(e.target.value)}
                    />
                    <div />
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value="right"
                      control={<Radio />}
                      checked={gate === "right" ? true : false}
                      label="Sağ"
                      onClick={(e) => setGate(e.target.value)}
                    />
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value="left-down"
                      control={<Radio />}
                      checked={gate === "left-down" ? true : false}
                      label="Sol Alt"
                      onClick={(e) => setGate(e.target.value)}
                    />
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value="down"
                      control={<Radio />}
                      checked={gate === "down" ? true : false}
                      label="Alt"
                      onClick={(e) => setGate(e.target.value)}
                    />
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value="right-down"
                      control={<Radio />}
                      checked={gate === "right-down" ? true : false}
                      label="Sağ Alt"
                      onClick={(e) => setGate(e.target.value)}
                    />
                  </RadioGroup>
                </FormControl>
              </ListItem>

              <ListItem
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  paddingTop: "2rem",
                }}
              >
                <Button
                  variant="outlined"
                  type="submit"
                  onClick={handleCloseGate}
                  color="primary"
                >
                  {t("panel:discard")}
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={(e) => {
                    if (gate !== null) {
                      handleUpdateGate(e);
                    }
                  }}
                  color="secondary"
                >
                  {t("panel:save")}
                </Button>
              </ListItem>
            </List>
          </form>
        </Box>
      </ModalMui> */}
      {/*  <ModalMui
        open={openColumns}
        onClose={handleCloseColumns}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
          <form>
            <List className={styles.list}>
              <h3 className={styles.header}>Sütun Ayarı</h3>
              <ListItem style={{ margin: "0 auto" }}>
                <FormControl
                  style={{
                    margin: "1rem auto",
                  }}
                >
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value={3}
                      checked={columns === 3 ? true : false}
                      control={<Radio />}
                      onClick={(e) => setColumns(Number(e.target.value))}
                      label="3"
                    />
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value={6}
                      checked={columns === 6 ? true : false}
                      control={<Radio />}
                      onClick={(e) => setColumns(Number(e.target.value))}
                      label="6"
                    />
                    <FormControlLabel
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "4px",
                        minWidth: "6rem",
                      }}
                      value={9}
                      checked={columns === 9 ? true : false}
                      control={<Radio />}
                      onClick={(e) => setColumns(Number(e.target.value))}
                      label="9"
                    />
                  </RadioGroup>
                </FormControl>
              </ListItem>

              <ListItem
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  paddingTop: "2rem",
                }}
              >
                <Button
                  variant="outlined"
                  type="submit"
                  onClick={handleCloseColumns}
                  color="primary"
                >
                  {t("panel:discard")}
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={(e) => {
                    if (columns !== null) {
                      handleUpdateColumns(e);
                    }
                  }}
                  color="secondary"
                >
                  {t("panel:save")}
                </Button>
              </ListItem>
            </List>
          </form>
        </Box>
      </ModalMui> */}
      <Modal
        style={{
          background: "transparent",
          boxShadow: "none",
        }}
        preventClose
        aria-labelledby="modal-title"
        open={isFetching}
      >
        <Loading color="white" size="xl" />
        <Spacer />
      </Modal>
      <ModalMui open={openGallery} onClose={handleCloseGallery}>
        <Box className={styles.modal}>
          <h2 style={{ textAlign: "center", padding: "1rem" }}>
            {t("panel:gallery")}
          </h2>
          <form
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              padding: "0 1rem",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <h3 style={{ marginBottom: "0" }}>Öne Çıkar</h3>
            <div>
              {galleryImage ? (
                <img
                  style={{
                    width: "7rem",
                    height: "5rem",
                    objectFit: "contain",
                  }}
                  src={galleryImage}
                ></img>
              ) : (
                <p>{t("common:notFoundImage")}</p>
              )}
            </div>
            <Input
              accept="image/*"
              id="icon-button-file"
              onChange={(e) => {
                setGalleryImage(e.target.files[0]);
              }}
              type="file"
            />
            <h3 style={{ marginBottom: "0" }}>{t("panel:gallery")}</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
              }}
            >
              {images?.length > 0 ? (
                images.map((g) => (
                  <img
                    onMouseEnter={(e) => {
                      e.target.style.border = "1px solid gray";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.border = "none";
                    }}
                    onClick={() => {
                      setImages(images.filter((i) => i.image !== g?.image));
                    }}
                    alt={g?.image}
                    style={{
                      width: "7rem",
                      height: "5rem",
                      objectFit: "contain",
                      cursor: "pointer",
                    }}
                    key={g?.image}
                    src={g?.image}
                  ></img>
                ))
              ) : (
                <p>{t("panel:imageNotFound")}</p>
              )}
            </div>
            <Input
              accept="image/*"
              id="icon-button-file"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
              type="file"
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "92%",
                justifyContent: "flex-end",
                gap: "1rem",
                margin: "1rem",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCloseGallery}
              >
                {t("panel:discard")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdateGallery}
              >
                {t("panel:confirm")}
              </Button>
            </div>
          </form>
        </Box>
      </ModalMui>
      <ModalMui open={openNavbarColor} onClose={handleCloseNavbarColor}>
        <Box className={styles.modal}>
          <h2 style={{ textAlign: "center", padding: "1rem" }}>Renkler</h2>
          <form
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              padding: "0 1rem",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <h3 style={{ marginBottom: "0" }}>Üst Bar Rengi</h3>
            <input
              type="color"
              value={navbarColor}
              onChange={(e) => setNavbarColor(e.target.value)}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "92%",
                justifyContent: "flex-end",
                gap: "1rem",
                margin: "1rem",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCloseNavbarColor}
              >
                {t("panel:discard")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdateNavbarColor}
              >
                {t("panel:confirm")}
              </Button>
            </div>
          </form>
        </Box>
      </ModalMui>

      <ModalMui open={openAddress} onClose={handleCloseAddress}>
        <Box className={styles.modal}>
          <h2
            style={{ textAlign: "center", padding: "1rem", color: "#000814" }}
          >
            Adres Bilgileri
          </h2>
          <form
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0 1rem",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <List
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Ülke Seçiniz
                  </InputLabel>
                  <NativeSelect
                    defaultValue={countryName ? countryName : ""}
                    onChange={(e) => {
                      setCountryName(e.target.value);
                    }}
                    inputProps={{
                      name: "Ülke Seçiniz",
                    }}
                  >
                    {allCountries?.length > 0 &&
                      allCountries?.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                  </NativeSelect>
                </FormControl>
              </ListItem>
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Şehir Seçiniz
                  </InputLabel>
                  <NativeSelect
                    defaultValue={stateName ? stateName : ""}
                    disabled={countryName ? false : true}
                    onChange={handleChangeState}
                    inputProps={{
                      name: "Şehir Seçiniz",
                    }}
                  >
                    {countryStates?.length > 0 &&
                      countryStates?.map((state) =>
                        state.name.includes("Province") ? (
                          <option key={state.name} value={state.name}>
                            {state.name.split(" ")[0]}
                          </option>
                        ) : (
                          <option key={state.name} value={state.name}>
                            {state.name}
                          </option>
                        )
                      )}
                  </NativeSelect>
                </FormControl>
              </ListItem>
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    İlçe Seçiniz
                  </InputLabel>
                  <NativeSelect
                    defaultValue={cityName ? cityName : ""}
                    disabled={stateName ? false : true}
                    onChange={handleChangeCity}
                    inputProps={{
                      name: "İlçe Seçiniz",
                    }}
                  >
                    {stateCities?.length > 0 &&
                      stateCities?.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                  </NativeSelect>
                </FormControl>
              </ListItem>
              <ListItem>
                <TextField
                  variant="outlined"
                  id="address"
                  type="text"
                  value={address}
                  rules={{
                    required: true,
                  }}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    e.preventDefault();
                    setAddress(e.target.value);
                  }}
                  /*  helperText={
                      tableNum === undefined
                        ? t("panel:tableQuantity")
                        : tableNum === 0
                        ? t("panel:tableZero")
                        : tableNum < 0
                        ? t("panel:tableNeg")
                        : tableNum > 100
                        ? t("panel:tableNumMax2")
                        : ""
                    } */
                  label="Açık Adresiniz"
                ></TextField>
              </ListItem>
            </List>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "92%",
                justifyContent: "flex-end",
                gap: "1rem",
                margin: "1rem",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCloseAddress}
              >
                {t("panel:discard")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdateAddressInfos}
              >
                {t("panel:confirm")}
              </Button>
            </div>
          </form>
        </Box>
      </ModalMui>
      <ModalMui open={openCapacity} onClose={handleCloseCapacity}>
        <Box className={styles.modal}>
          <h2
            style={{ textAlign: "center", padding: "1rem", color: "#000814" }}
          >
            Toplam Kapasite
          </h2>
          <form
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0 1rem",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <List
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  textAlign: "center",
                }}
              >
                <div>
                  <h5 align="center">Toplam Masa Sayısı</h5>
                  <span
                    align="center"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {store?.tableNum}
                  </span>
                </div>
                <div>
                  <h5 align="center">Kalan Masa Sayısı</h5>
                  <span
                    align="center"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {Number(store?.tableNum) - Number(remainTables)}
                  </span>
                </div>
                <div>
                  <h5 align="center">Maksimum Kişi Sayısı</h5>
                  <span
                    align="center"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {maxCap}
                  </span>
                </div>
              </div>
              <ListItem
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "14rem",
                  overflow: "auto",
                  margin: "1rem 0",
                  flexDirection: "column",
                }}
              >
                {capacity.map((table, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setCapacity(capacity.filter((c) => c._id !== table._id));
                    }}
                    className={styles.cell}
                  >
                    <div>
                      <h5 style={{ margin: "0", padding: "6px 0" }}>
                        Kaç Kişilik
                      </h5>
                      <p style={{ margin: "0", padding: "6px 0" }}>
                        {table.tableSize}
                      </p>
                    </div>
                    <div>
                      <h5 style={{ margin: "0", padding: "6px 0" }}>
                        Kaç Adet Masa
                      </h5>
                      <p style={{ margin: "0", padding: "6px 0" }}>
                        {table.tableQuantity}
                      </p>
                    </div>
                    <DeleteOutlineIcon
                      color="error"
                      style={{ display: "none" }}
                      className={styles.deleteIcon}
                    />
                  </div>
                ))}
              </ListItem>
              <ListItem>
                <TextField
                  value={tableSize}
                  label="Kaç Kişilik"
                  onChange={(e) => setTableSize(e.target.value)}
                ></TextField>
              </ListItem>
              <ListItem>
                <TextField
                  value={tableQuantity}
                  label="Kaç Adet Masa"
                  onChange={(e) => setTableQuantity(e.target.value)}
                ></TextField>
              </ListItem>
              <ListItem>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={() => {
                    setCapacity((oldItem) => [
                      ...oldItem,
                      {
                        id: uuidv4(),
                        tableSize: Number(tableSize),
                        tableQuantity: Number(tableQuantity),
                      },
                    ]);
                    setTableSize(0);
                    setTableQuantity(0);
                  }}
                >
                  Ekle
                </Button>
              </ListItem>
            </List>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "92%",
                justifyContent: "flex-end",
                gap: "1rem",
                margin: "1rem",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCloseCapacity}
              >
                {t("panel:discard")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdateCapacity}
              >
                {t("panel:confirm")}
              </Button>
            </div>
          </form>
        </Box>
      </ModalMui>
      <ModalMui open={openContact} onClose={handleCloseContact}>
        <Box className={styles.modal}>
          <h2
            style={{ textAlign: "center", padding: "1rem", color: "#000814" }}
          >
            İletişim Bilgileri
          </h2>
          <form
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0 1rem",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <List
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <ListItem
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <CallIcon color="primary" />
                <TextField
                  variant="outlined"
                  id="phone"
                  type="number"
                  value={phoneNumber}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    e.preventDefault();
                    setPhoneNumber(e.target.value);
                  }}
                  label="Telefon Numarası"
                ></TextField>
              </ListItem>
              <ListItem
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <InstagramIcon color="primary" />
                <TextField
                  variant="outlined"
                  id="instagram"
                  type="text"
                  value={instagramLink}
                  style={{ width: "100%", height: "100%" }}
                  onChange={(e) => {
                    e.preventDefault();
                    setInstagramLink(e.target.value);
                  }}
                  label="Instagram Linki"
                ></TextField>
              </ListItem>
            </List>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "92%",
                justifyContent: "flex-end",
                gap: "1rem",
                margin: "1rem",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCloseContact}
              >
                {t("panel:discard")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdateContact}
              >
                {t("panel:confirm")}
              </Button>
            </div>
          </form>
        </Box>
      </ModalMui>
      <ModalMui open={openPrices} onClose={handleClosePrices}>
        <Box className={styles.modal}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                padding: "1rem",
                color: "#000814",
              }}
            >
              Kapora
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <h5>Kapalı</h5>
              <Switch
                checked={isPricesActive}
                onChange={() => setIsPricesActive(!isPricesActive)}
              />
              <h5>Açık</h5>
            </div>
          </div>

          <form
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              justifyContent: "flex-start",
              flexDirection: "column",
            }}
          >
            <List
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                justifyContent: "flex-start",
                flexDirection: "column",
              }}
            >
              <ListItem>
                <TextField
                  type="number"
                  label="Bir Fiyat Giriniz"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                ></TextField>
              </ListItem>
            </List>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "92%",
                justifyContent: "flex-end",
                gap: "1rem",
                margin: "1rem",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClosePrices}
              >
                {t("panel:discard")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={(e) => {
                  if (price) {
                    handleUpdatePrices(e);
                  }
                }}
              >
                {t("panel:confirm")}
              </Button>
            </div>
          </form>
        </Box>
      </ModalMui>
      <Modal
        style={{
          background: "transparent",
          boxShadow: "none",
        }}
        preventClose
        aria-labelledby="modal-title"
        open={isFetching}
      >
        <Loading color="white" size="xl" />
        <Spacer />
      </Modal>
      <div>
        <ReactAudioPlayer
          src="https://res.cloudinary.com/dlyjd3mnb/video/upload/v1650899563/orderAlert_ltwbxs.mp3"
          ref={audioRef}
        />
      </div>
    </div>
  );
};

export default BookingDashboard;
