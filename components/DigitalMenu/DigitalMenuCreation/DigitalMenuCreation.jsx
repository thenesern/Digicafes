// Dependencies
import React, { useEffect, useState } from "react";
import Radium, { StyleRoot } from "radium";
import axios from "axios";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import { Button, List, ListItem, TextField } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import { Country, State, City } from "country-state-city";
// Styles
import styles from "../DigitalMenuDashboard/DigitalMenuDashboard.module.css";
// Animation
import { fadeInRight } from "react-animations";
const animate = {
  fadeInRight: {
    animation: "x 2s",
    animationName: Radium.keyframes(fadeInRight, "fadeInRight"),
    animationName: Radium.keyframes(fadeInRight, "fadeInRight"),
  },
};
// Translation
import useTranslation from "next-translate/useTranslation";

const DigitalMenuCreation = (props) => {
  const { t } = useTranslation();
  const [isFetchingForFirst, setIsFetchingForFirst] = useState(false);
  const [secondStep, setSecondStep] = useState(false);
  const [thirdStep, setThirdStep] = useState(false);
  const [stateName, setStateName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const allStates = State.getAllStates();
  const [address, setAddress] = useState("");
  const [stateCities, setStateCities] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const allCountries = Country.getAllCountries();
  const [cityName, setCityName] = useState("");
  const [stateCode, setStateCode] = useState("");

  function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }

  const handleChangeState = (event) => {
    setStateName(event.target.value);
  };

  const handleChangeCity = (event) => {
    setCityName(event.target.value);
  };

  const firstTimeHandler = async (e) => {
    e.preventDefault();
    const createdAt = new Date();

    try {
      setIsFetchingForFirst(true);
      const { data } = await axios.post(
        `/api/qr/${props.version}/${props.storeName}/menu`,
        {
          storeName: props.storeName,
          storeLinkName: props.storeLinkName,
          tableNum: props.tableNum,
          listType: "text",
          address: {
            country: countryName,
            state: stateName,
            city: cityName,
            address: address,
          },
          createdAt,
          owner: props.order?.user?._id,
        },
        {
          headers: { authorization: `Bearer ${props.user.token}` },
        }
      );
      const attachedOrder = await axios.patch(
        "/api/order/attachMenu",
        {
          orderId: props.order?._id,
          menuId: data?.menu?._id,
          orderProduct: props.order?.product?.name,
        },
        {
          headers: { authorization: `Bearer ${props.user?.token}` },
        }
      );
      props.setOrder(attachedOrder?.data?.order);
      setIsFetchingForFirst(false);
      props.setIsFirst(false);
    } catch (err) {
      console.log(err);
      setIsFetchingForFirst(false);
    }
  };

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

  return (
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
      {props.isFirst && !secondStep && !thirdStep && (
        <StyleRoot>
          <form className={styles.formFirst} style={animate.fadeInRight}>
            <h2 className={styles.headerFirst}>{t("panel:enterStoreName")}</h2>
            <List className={styles.list}>
              <ListItem>
                <TextField
                  variant="outlined"
                  disabled={props.isFirst ? false : true}
                  id="brandName"
                  autoFocus="true"
                  rules={{
                    required: true,
                  }}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    props.setStoreName(e.target.value.trim());
                    props.setStoreLinkName(
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
                    props.storeName?.length === 0
                      ? t("panel:proveName")
                      : props.storeName?.length < 3
                      ? t("panel:minLength")
                      : containsSpecialChars(props.storeName) === true
                      ? t("panel:notSpecial")
                      : props.menusv1.filter(
                          (s) => s.storeName === props.storeName
                        ).length > 0 ||
                        props.menusv2.filter(
                          (s) => s.storeName === props.storeName
                        ).length > 0
                      ? t("panel:nameIsInUse")
                      : ""
                  }
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
                      props.storeName?.length > 2 &&
                      !containsSpecialChars(props.storeName) &&
                      props.menusv1.filter(
                        (s) => s.storeName === props.storeName
                      ).length === 0 &&
                      props.menusv2.filter(
                        (s) => s.storeName === props.storeName
                      ).length === 0
                    ) {
                      setSecondStep(true);
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
      {secondStep && !thirdStep && (
        <StyleRoot>
          <form className={styles.formFirst} style={animate.fadeInRight}>
            <h2 className={styles.headerFirst}>{t("panel:enterTableNum")}</h2>
            <List className={styles.list}>
              <ListItem>
                <TextField
                  variant="outlined"
                  disabled={props.isFirst ? false : true}
                  id="tableNum"
                  type="number"
                  autoFocus="true"
                  rules={{
                    required: true,
                  }}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    e.preventDefault();
                    props.setTableNum(+e.target.value);
                  }}
                  helperText={
                    props.tableNum === undefined
                      ? t("panel:enterTableNum")
                      : props.tableNum === 0
                      ? t("panel:tableZero")
                      : props.tableNum < 0
                      ? t("panel:tableNeg")
                      : props.tableNum > 200
                      ? t("panel:tableNumMax")
                      : ""
                  }
                  label={t("panel:numTable")}
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
                      props.tableNum !== undefined &&
                      props.tableNum < 201 &&
                      props.tableNum > 0 &&
                      props.tableNum !== 0
                    ) {
                      setThirdStep(true);
                      setSecondStep(false);
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
      {thirdStep && !secondStep && (
        <StyleRoot>
          <form className={styles.formFirst} style={animate.fadeInRight}>
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
  );
};

export default DigitalMenuCreation;
