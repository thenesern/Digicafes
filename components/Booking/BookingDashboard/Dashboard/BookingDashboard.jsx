import React, { useState, useEffect, useContext } from "react";
import styles from "./BookingDashboard.module.css";
import { Country, State, City } from "country-state-city";
import DashboardIcon from "@mui/icons-material/Dashboard";
import useTranslation from "next-translate/useTranslation";
import { Card, Loading, Modal, Spacer, Text } from "@nextui-org/react";
import FormControl from "@mui/material/FormControl";
import { Button, IconButton, Input, List, ListItem } from "@material-ui/core";
import ModalMui from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { PhotoCamera } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { InputLabel, NativeSelect, Select, Stack } from "@mui/material";
import { Switch } from "@nextui-org/react";
import TextField from "@mui/material/TextField";
import CallIcon from "@mui/icons-material/Call";
import InstagramIcon from "@mui/icons-material/Instagram";
import Image from "next/image";
import WorkingTimesModal from "./components/WorkingTimesModal";
import { Button as NextButton, Grid } from "@nextui-org/react";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CollectionsIcon from "@mui/icons-material/Collections";
import PaymentIcon from "@mui/icons-material/Payment";
import PaletteIcon from "@mui/icons-material/Palette";
import StoreIcon from "@mui/icons-material/Store";
import EditIcon from "@mui/icons-material/Edit";
import BookingTable from "./components/BookingTable";
import IBANModal from "./components/IBANModal";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Store } from "../../../../redux/store";

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
  const [countryCode, setCountryCode] = useState("");
  const [openPrices, setOpenPrices] = useState(false);
  const [stateCities, setStateCities] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [navbarColor, setNavbarColor] = useState(store?.navbar?.color || "");
  const [openUploadLogo, setOpenUploadLogo] = useState(false);
  const [capacity, setCapacity] = useState(store?.capacity || []);
  const [openAddress, setOpenAddress] = useState(false);
  const [openNavbarColor, setOpenNavbarColor] = useState(false);
  const [stateCode, setStateCode] = useState("");
  const [price, setPrice] = useState(store?.prices?.price || null);
  const [isPricesActive, setIsPricesActive] = useState(
    store?.prices?.isActive || false
  );
  const { t } = useTranslation();
  const [gallery, setGallery] = useState(store?.gallery || null);
  const [openWorkingTimes, setOpenWorkingTimes] = useState(false);
  const [images, setImages] = useState(store?.gallery?.images || []);
  const [reserved, setReserved] = useState(0);
  const [remains, setRemains] = useState(+capacity - +reserved || 0);
  const [selectedHour, setSelectedHour] = useState(null);
  const [tableData, setTableData] = useState(store?.bookings || []);
  const [galleryImage, setGalleryImage] = useState(
    store?.gallery?.galleryImage || null
  );
  const allCountries = Country.getAllCountries();
  const [openCapacity, setOpenCapacity] = useState(false);
  const allStates = State.getAllStates();
  const [openContact, setOpenContact] = useState(false);
  const [openIBAN, setOpenIBAN] = useState(false);
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [storeLogo, setStoreLogo] = useState(
    store?.storeLogo ||
      "https://res.cloudinary.com/dlyjd3mnb/image/upload/v1650137521/uploads/logoDefault_ez8obk.png"
  );
  const [openGallery, setOpenGallery] = useState(false);
  const handleOpenIBAN = () => setOpenIBAN(true);
  const handleCloseIBAN = () => setOpenIBAN(false);
  const handleChangeState = (event) => {
    setStateName(event.target.value);
  };
  const handleChangeCity = (event) => {
    setCityName(event.target.value);
  };
  const handleOpenCapacity = () => setOpenCapacity(true);
  const handleCloseCapacity = () => {
    setCapacity(store?.capacity);
    setOpenCapacity(false);
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
  const handleOpenUploadLogo = () => setOpenUploadLogo(true);
  const handleCloseUploadLogo = () => setOpenUploadLogo(false);
  const handleOpenContact = () => setOpenContact(true);

  const handleCloseContact = () => setOpenContact(false);

  const [copySuccess, setCopySuccess] = useState(false);
  const [isNotification, setIsNotification] = useState(false);

  useEffect(() => {
    if (selectedHour) {
      setTableDate(
        new Date(
          tableDate?.setHours(
            selectedHour?.split(":")[0],
            selectedHour?.split(":")[1],
            "00"
          )
        )
      );
    }
  }, [selectedHour]);

  useEffect(() => {
    let people = 0;
    if (tableDate && selectedHour) {
      store?.bookings
        .filter(
          (booking) =>
            new Date(booking?.date).toLocaleString() ===
            new Date(tableDate).toLocaleString()
        )
        .map((booking) => (people += booking?.people));
    }
    if (tableDate && !selectedHour) {
      store?.bookings
        .filter(
          (booking) =>
            new Date(booking?.date).toLocaleDateString() ===
            new Date(tableDate).toLocaleDateString()
        )
        .map((booking) => (people += booking?.people));
    }
    setReserved(people);
  }, [store?.bookings, tableDate]);

  useEffect(() => {
    if (tableDate && selectedHour) {
      setRemains(+capacity - +reserved);
    }
    if (tableDate && !selectedHour) {
      setRemains("*");
    }
  }, [capacity, reserved]);

  useEffect(() => {
    setTableData(
      store?.bookings?.filter(
        (booking) =>
          new Date(booking?.date)?.toLocaleDateString() ===
          new Date(tableDate)?.toLocaleDateString()
      )
    );
  }, [tableDate, store?.bookings]);

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess(true);
    } catch (err) {
      setCopySuccess(false);
    }
  };

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
              images: images,
              galleryImage: uploadImage,
            },
          },
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
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
            },
          },
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
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
          headers: { authorization: `Bearer ${userInfo.token}` },
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
          headers: { authorization: `Bearer ${userInfo.token}` },
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
          headers: { authorization: `Bearer ${userInfo.token}` },
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
          headers: { authorization: `Bearer ${userInfo.token}` },
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
          headers: { authorization: `Bearer ${userInfo.token}` },
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
    let newStateName;
    if (stateName.includes("Province")) {
      newStateName = stateName.split(" ")[0];
    }
    try {
      setIsFetching(true);
      await axios.post(
        `/api/booking/${store?.storeName}/address`,
        {
          storeName: store?.storeName,
          address: {
            address,
            country: countryName,
            state: newStateName,
            city: cityName,
          },
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
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

  return (
    <div className={styles.container}>
      <div className={styles.sideBar}>
        <div className={styles.sidebar}>
          <div className={styles.logoDiv} onClick={handleOpenUploadLogo}>
            <Image
              src={storeLogo}
              alt="Logo"
              width="70"
              height="70"
              objectFit="contain"
              className={styles.logo}
            />
            <PhotoCameraIcon
              style={{ display: "none" }}
              className={styles.cameraIcon}
            />
          </div>
          <div className={styles.side}>
            <h3 className={styles.header} style={{ color: "#fff" }}>
              Paylaş
            </h3>
            <Button
              className={styles.copy}
              onClick={(e) =>
                copyToClipBoard(
                  `https://www.digicafes.com/booking/${store?.storeLinkName}`
                )
              }
              variant="outlined"
            >
              {copySuccess ? (
                <span>Kopyalandı!</span>
              ) : (
                <span style={{ textTransform: "lowercase" }}>
                  {`https://www.digicafes.com/booking/${store?.storeLinkName}`}
                </span>
              )}
            </Button>
          </div>
          <div>
            <h3 className={styles.sidebarHeader}>
              <DashboardIcon />
            </h3>
            <ul className={styles.sidebarList}>
              <li>
                <NextButton
                  bordered
                  icon={<RoomIcon />}
                  className={styles.buttons}
                  onClick={handleOpenAddress}
                  auto
                >
                  <span className={styles.buttonHeader}>Adres Bilgileri</span>
                </NextButton>
              </li>
              <li>
                <NextButton
                  bordered
                  icon={<PhoneIcon />}
                  className={styles.buttons}
                  onClick={handleOpenContact}
                  auto
                >
                  <span className={styles.buttonHeader}>
                    İletişim Bilgileri
                  </span>
                </NextButton>
              </li>
              <li>
                <NextButton
                  bordered
                  icon={<AccessTimeIcon />}
                  className={styles.buttons}
                  onClick={() => setOpenWorkingTimes(true)}
                  auto
                >
                  <span className={styles.buttonHeader}>Çalışma Saatleri</span>
                </NextButton>
              </li>
              <li>
                <NextButton
                  bordered
                  icon={<PaymentIcon />}
                  className={styles.buttons}
                  onClick={() => setOpenIBAN(true)}
                  auto
                >
                  <span className={styles.buttonHeader}>IBAN</span>
                </NextButton>
              </li>
              <li>
                <NextButton
                  bordered
                  icon={<CollectionsIcon />}
                  className={styles.buttons}
                  onClick={handleOpenGallery}
                  auto
                >
                  <span className={styles.buttonHeader}>
                    {t("panel:gallery")}
                  </span>
                </NextButton>
              </li>
              <li>
                <NextButton
                  bordered
                  icon={<ShoppingBasketIcon />}
                  className={styles.buttons}
                  onClick={handleOpenPrices}
                  auto
                >
                  <span className={styles.buttonHeader}>Kapora</span>
                </NextButton>
              </li>
              <li>
                <NextButton
                  bordered
                  icon={<PaletteIcon />}
                  className={styles.buttons}
                  onClick={handleOpenNavbarColor}
                  auto
                >
                  <span className={styles.buttonHeader}> Renkler</span>
                </NextButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.app}>
        <div className={styles.topBar}>
          <Link href={`/booking/${store?.storeLinkName}`} passHref>
            <a target="_blank">
              <NextButton
                bordered
                icon={<StoreIcon />}
                style={{ height: "5rem", width: "12rem" }}
                auto
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "0" }}
                >
                  <h4 style={{ margin: "0", padding: "0", height: "26px" }}>
                    İşletme Adı
                  </h4>
                  <p style={{ margin: "0", padding: "0" }}>
                    {store?.storeName}
                  </p>
                </div>
              </NextButton>
            </a>
          </Link>
          <div style={{ display: "flex", flexDirection: "column" }}></div>
          <div className={styles.capacity} onClick={handleOpenCapacity}>
            <h3 className={styles.capacityHeader}>Maksimum Kapasite (Kişi)</h3>
            <p className={styles.capacityDesc}>{capacity}</p>
            <EditIcon style={{ display: "none" }} className={styles.editIcon} />
          </div>

          <div className={styles.side}>
            <h3 className={styles.header}>Kalan Yer (Kişi)</h3>
            <p className={styles.desc}> {remains}</p>
          </div>
          <div className={styles.side}>
            <h3 className={styles.header}>Rezerve (Kişi)</h3>
            <p className={styles.desc}> {reserved}</p>
          </div>
          <div
            className={styles.side}
            style={{ flexDirection: "row", gap: "1rem" }}
          >
            <TextField
              id="time"
              label="Saat Seçiniz"
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: 120 }}
              onChange={(e) => setSelectedHour(e.target.value)}
            />
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
        <BookingTable
          tableData={tableData}
          store={store}
          isFetching={isFetching}
          user={userInfo}
          setStore={(data) => {
            setStore(data);
          }}
        />
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
      <IBANModal
        openIBAN={openIBAN}
        user={userInfo}
        orderId={userOrder?._id}
        store={store}
        setOpenIBAN={(boolean) => setOpenIBAN(boolean)}
        setIsFetching={(boolean) => setIsFetching(boolean)}
      />
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
                    defaultValue={stateName}
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
                    defaultValue={cityName}
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
      <ModalMui open={openCapacity} onClose={handleCloseCapacity}>
        <Box className={styles.modal}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <h2
              style={{
                padding: "1rem",
                color: "#000814",
              }}
            >
              Maksimum Kapasite (Kişi)
            </h2>
          </div>
          <form
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
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
                <TextField
                  type="number"
                  inputProps={{ maxLength: 1 }}
                  label="Bir Sayı Giriniz"
                  helperText={
                    capacity === undefined
                      ? "Lütfen kapasite sayısı giriniz"
                      : capacity === 0
                      ? "Kapatise sıfır olamaz"
                      : capacity < 0
                      ? "Kapasite negatif bir değer olamaz"
                      : capacity > 999
                      ? "Kapasite 999'dan fazla olamaz"
                      : ""
                  }
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
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
                onClick={handleCloseCapacity}
              >
                {t("panel:discard")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={(e) => {
                  if (
                    capacity !== undefined &&
                    capacity < 1000 &&
                    capacity > 0 &&
                    capacity !== 0
                  ) {
                    handleUpdateCapacity(e);
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
    </div>
  );
};

export default BookingDashboard;
