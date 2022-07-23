import React, { useContext, useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { Loading, Modal, Spacer, Button as ButtonMui } from "@nextui-org/react";
import Radium, { StyleRoot } from "radium";
import { Button, List, ListItem, TextField } from "@material-ui/core";
import styles from "./StoreCreation.module.css";
import { fadeInRightBig } from "react-animations";
import useTranslation from "next-translate/useTranslation";
import axios from "axios";
import Cookies from "js-cookie";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import { Store } from "../../../../redux/store";

const StoreCreation = ({ userOrder, booking }) => {
  const [order, setOrder] = useState(userOrder[0] || null);
  const { state, dispatch } = useContext(Store);
  const [isFetchingForFirst, setIsFetchingForFirst] = useState(false);
  const [storeName, setStoreName] = useState(booking?.storeName || "");
  const [allStoreNames, setAllStoreNames] = useState([]);
  const [stateName, setStateName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const allStates = State.getAllStates();
  const [address, setAddress] = useState("");
  const [stateCities, setStateCities] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const allCountries = Country.getAllCountries();
  const [cityName, setCityName] = useState("");
  const [capacity, setCapacity] = useState(booking?.capacity || null);
  const [storeLinkName, setStoreLinkName] = useState(
    booking?.storeLinkName || ""
  );
  const [stateCode, setStateCode] = useState("");
  const [secondStep, setSecondStep] = useState(false);
  const [thirdStep, setThirdStep] = useState(false);
  const { t } = useTranslation();
  const { userInfo } = state;
  const animate = {
    fadeInRightBig: {
      animation: "x 2s",
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
    },
  };

  const handleChangeState = (event) => {
    setStateName(event.target.value);
  };
  const handleChangeCity = (event) => {
    setCityName(event.target.value);
  };

  function containsSpecialChars(str) {
    const specialChars = /[`@#$%^&*()+\=\[\]{};"\\|<>\/~]/;
    return specialChars.test(str);
  }

  useEffect(() => {
    const getMenus = async () => {
      await axios
        .get("/api/booking", {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        })
        .then((response) => {
          setAllStoreNames(response?.data?.bookings?.map((s) => s?.storeName));
        });
    };
    getMenus();
  }, []);

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

  const firstTimeHandler = async (e) => {
    e.preventDefault();
    const createdAt = new Date();

    try {
      setIsFetchingForFirst(true);
      let newStateName;
      if (stateName?.includes("Province")) {
        newStateName = stateName?.split(" ")[0];
      } else {
        newStateName = stateName;
      }
      const company = await axios.post(
        `/api/booking/iyzico/company/${
          userInfo?.subMerchantType === "PRIVATE_COMPANY"
            ? "private"
            : "limitedOrStock"
        }`,
        {
          orderId: order?._id + "1",
          address: address,
          taxOffice: userInfo?.taxOffice,
          taxNumber: userInfo?.taxNumber,
          legalCompanyTitle: userInfo?.legalCompanyTitle,
          email: userInfo?.email,
          gsmNumber: userInfo?.phoneNumber,
          name: storeName?.trim(),
          iban: userInfo?.IBAN,
          identityNumber: userInfo?.identityNumber,
        },
        {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        }
      );
      const { data } = await axios.post(
        `/api/booking/${storeName}`,
        {
          storeName: storeName?.trim(),
          capacity: capacity,
          storeLinkName: storeLinkName,
          subMerchantKey: company?.data?.subMerchantKey,
          createdAt,
          address: {
            country: countryName,
            state: newStateName,
            city: cityName,
            address: address,
          },
          owner: order?.user?._id,
        },
        {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        }
      );

      const attachedOrder = await axios.patch(
        "/api/order/attachBooking",
        {
          orderId: order?._id,
          bookingId: data?.store?._id,
          orderProduct: order?.product?.name,
        },
        {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        }
      );

      setOrder(attachedOrder?.data?.order);
      dispatch({ type: "STORE_CREATED", payload: true });
      setIsFetchingForFirst(false);
    } catch (err) {
      console.log(err);
      setIsFetchingForFirst(false);
    }
  };

  return (
    <div>
      <div className={styles.firstContainer}>
        <Modal
          style={{
            background: "transparent",
            boxShadow: "none",
          }}
          preventClose
          aria-labelledby="modal-title"
          open={isFetchingForFirst}
        >
          <Loading color="white" size="xl" />
          <Spacer />
        </Modal>
        {!secondStep && (
          <StyleRoot>
            <form className={styles.formFirst} style={animate.fadeInRightBig}>
              <h2 className={styles.headerFirst}>
                {t("panel:enterStoreName")}
              </h2>
              <List className={styles.list}>
                <ListItem>
                  <TextField
                    variant="outlined"
                    id="brandName"
                    autoFocus="true"
                    value={storeName}
                    rules={{
                      required: true,
                    }}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      setStoreName(
                        e.target.value
                          ?.split(" ")
                          .map((item) =>
                            item?.replace(
                              item[0],
                              item[0]?.toLowerCase().toUpperCase()
                            )
                          )
                          .join(" ")
                      );
                      setStoreLinkName(
                        e.target.value
                          .trim()
                          .toLowerCase()
                          .replaceAll(" ", "-")
                          .replaceAll("ç", "c")
                          .replaceAll("ı", "i")
                          .replaceAll("ü", "u")
                          .replaceAll("ğ", "g")
                          .replaceAll("ö", "o")
                          .replaceAll("ş", "s")
                      );
                    }}
                    label={t("panel:storeName")}
                    helperText={
                      storeName?.length === 0
                        ? t("panel:proveName")
                        : storeName?.length < 3
                        ? t("panel:minLength")
                        : containsSpecialChars(storeName) === true
                        ? t("panel:notSpecial")
                        : allStoreNames?.includes(storeName)
                        ? t("panel:nameIsInUse")
                        : ""
                    }
                  ></TextField>
                </ListItem>
                {!secondStep && (
                  <ListItem>
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          storeName?.length > 2 &&
                          !containsSpecialChars(storeName) &&
                          !allStoreNames?.includes(storeName)
                        ) {
                          setSecondStep(true);
                        }
                      }}
                    >
                      {t("panel:next")}
                    </Button>
                  </ListItem>
                )}
              </List>
            </form>
          </StyleRoot>
        )}
        {secondStep && !thirdStep && (
          <StyleRoot>
            <form className={styles.formFirst} style={animate.fadeInRightBig}>
              <h2 className={styles.headerFirst}>Maksimum Kapasite (Kişi)</h2>
              <List className={styles.list}>
                <ListItem>
                  <TextField
                    variant="outlined"
                    id="capacity"
                    type="number"
                    autoFocus="true"
                    rules={{
                      required: true,
                    }}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      e.preventDefault();
                      setCapacity(+e.target.value);
                    }}
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
                    label="Kapasite"
                  ></TextField>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        capacity !== undefined &&
                        capacity < 1000 &&
                        capacity > 0 &&
                        capacity !== 0
                      ) {
                        setThirdStep(true);
                      }
                    }}
                  >
                    {t("panel:next")}
                  </Button>
                </ListItem>
              </List>
            </form>
          </StyleRoot>
        )}
        {thirdStep && (
          <StyleRoot>
            <form className={styles.formFirst} style={animate.fadeInRightBig}>
              <h2 className={styles.headerFirst}>
                İşletmenizin Adresini Giriniz
              </h2>
              <List className={styles.list}>
                <ListItem>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Ülke Seçiniz
                    </InputLabel>
                    <NativeSelect
                      defaultValue=""
                      onChange={(e) => {
                        setCountryName(e.target.value);
                      }}
                      inputProps={{
                        name: "Ülke Seçiniz",
                      }}
                    >
                      {allCountries?.length > 0 &&
                        allCountries?.map((country) => (
                          <option key={country?.name} value={country?.name}>
                            {country?.name}
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
                      defaultValue=""
                      disabled={countryName ? false : true}
                      onChange={handleChangeState}
                      inputProps={{
                        name: "Şehir Seçiniz",
                      }}
                    >
                      {countryStates?.length > 0 &&
                        countryStates?.map((state) =>
                          state?.name?.includes("Province") ? (
                            <option key={state?.name} value={state?.name}>
                              {state?.name?.split(" ")[0]}
                            </option>
                          ) : (
                            <option key={state?.name} value={state?.name}>
                              {state?.name}
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
                      defaultValue=""
                      disabled={stateName ? false : true}
                      onChange={handleChangeCity}
                      inputProps={{
                        name: "İlçe Seçiniz",
                      }}
                    >
                      {stateCities?.length > 0 &&
                        stateCities?.map((city) => (
                          <option key={city?.name} value={city?.name}>
                            {city?.name}
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
                    autoFocus="true"
                    rules={{
                      required: true,
                    }}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      e.preventDefault();
                      setAddress(e.target.value);
                    }}
                    label="Açık Adresiniz"
                  ></TextField>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      if (countryName && stateName && cityName && address) {
                        firstTimeHandler(e);
                      }
                    }}
                  >
                    {t("panel:save")}
                  </Button>
                </ListItem>
              </List>
            </form>
          </StyleRoot>
        )}
      </div>
    </div>
  );
};

export default StoreCreation;
