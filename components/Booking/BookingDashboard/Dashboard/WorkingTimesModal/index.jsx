import React, { useEffect, useState } from "react";
import { Button, List, ListItem } from "@material-ui/core";
import styles from "../BookingDashboard.module.css";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import useTranslation from "next-translate/useTranslation";
import { useSnackbar } from "notistack";
import axios from "axios";
import Cookies from "js-cookie";

const WorkingTimes = (props) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isMondayValid, setIsMondayValid] = useState(true);
  const [isTuesdayValid, setIsTuesdayValid] = useState(true);
  const [isWednesdayValid, setIsWednesdayValid] = useState(true);
  const [isThursdayValid, setIsThursdayValid] = useState(true);
  const [isFridayValid, setIsFridayValid] = useState(true);
  const [isSaturdayValid, setIsSaturdayValid] = useState(true);
  const [isSundayValid, setIsSundayValid] = useState(true);
  const { t } = useTranslation();
  const [monday, setMonday] = useState(
    props.store?.workingTimes?.monday?.isActive || false
  );
  const [tuesday, setTuesday] = useState(
    props.store?.workingTimes?.tuesday?.isActive || false
  );
  const [wednesday, setWednesday] = useState(
    props.store?.workingTimes?.wednesday?.isActive || false
  );
  const [thursday, setThursday] = useState(
    props.store?.workingTimes?.thursday?.isActive || false
  );
  const [friday, setFriday] = useState(
    props.store?.workingTimes?.friday?.isActive || false
  );
  const [saturday, setSaturday] = useState(
    props.store?.workingTimes?.saturday?.isActive || false
  );
  const [sunday, setSunday] = useState(
    props.store?.workingTimes?.sunday?.isActive || false
  );
  const [mondayStarts, setMondayStarts] = useState(
    props.store?.workingTimes?.monday?.workingHours?.mondayStarts || "09:00"
  );
  const [mondayEnds, setMondayEnds] = useState(
    props.store?.workingTimes?.monday?.workingHours?.mondayEnds || "24:00"
  );
  const [tuesdayStarts, setTuesdayStarts] = useState(
    props.store?.workingTimes?.tuesday?.workingHours?.tuesdayStarts || "09:00"
  );
  const [tuesdayEnds, setTuesdayEnds] = useState(
    props.store?.workingTimes?.tuesday?.workingHours?.tuesdayEnds || "24:00"
  );
  const [wednesdayStarts, setWednesdayStarts] = useState(
    props.store?.workingTimes?.wednesday?.workingHours?.wednesdayStarts ||
      "09:00"
  );
  const [wednesdayEnds, setWednesdayEnds] = useState(
    props.store?.workingTimes?.wednesday?.workingHours?.wednesdayEnds || "24:00"
  );
  const [thursdayStarts, setThursdayStarts] = useState(
    props.store?.workingTimes?.thursday?.workingHours?.thursdayStarts || "09:00"
  );
  const [thursdayEnds, setThursdayEnds] = useState(
    props.store?.workingTimes?.thursday?.workingHours?.thursdayEnds || "24:00"
  );
  const [fridayStarts, setFridayStarts] = useState(
    props.store?.workingTimes?.friday?.workingHours?.fridayStarts || "09:00"
  );
  const [fridayEnds, setFridayEnds] = useState(
    props.store?.workingTimes?.friday?.workingHours?.fridayEnds || "24:00"
  );
  const [saturdayStarts, setSaturdayStarts] = useState(
    props.store?.workingTimes?.saturday.workingHours?.saturdayStarts || "09:00"
  );
  const [saturdayEnds, setSaturdayEnds] = useState(
    props.store?.workingTimes?.saturday?.workingHours?.saturdayEnds || "24:00"
  );
  const [sundayStarts, setSundayStarts] = useState(
    props.store?.workingTimes?.sunday?.workingHours?.sundayStarts || "09:00"
  );
  const [sundayEnds, setSundayEnds] = useState(
    props.store?.workingTimes?.sunday?.workingHours?.sundayEnds || "24:00"
  );

  let user;
  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }

  useEffect(() => {
    setIsMondayValid(
      Number(mondayStarts?.split(":")[0]) > Number(mondayEnds?.split(":")[0])
    );
  }, [mondayStarts, mondayEnds]);

  useEffect(() => {
    setIsTuesdayValid(
      Number(tuesdayStarts?.split(":")[0]) > Number(tuesdayEnds?.split(":")[0])
    );
  }, [tuesdayStarts, tuesdayEnds]);

  useEffect(() => {
    if (wednesdayEnds !== "00:00") {
      setIsWednesdayValid(
        Number(wednesdayStarts.split(":")[0]) >
          Number(wednesdayEnds.split(":")[0])
      );
    }
  }, [wednesdayStarts, wednesdayEnds]);

  useEffect(() => {
    setIsThursdayValid(
      Number(thursdayStarts.split(":")[0]) > Number(thursdayEnds.split(":")[0])
    );
  }, [thursdayStarts, thursdayEnds]);

  useEffect(() => {
    setIsFridayValid(
      Number(fridayStarts.split(":")[0]) > Number(fridayEnds.split(":")[0])
    );
  }, [fridayStarts, fridayEnds]);

  useEffect(() => {
    setIsSaturdayValid(
      Number(saturdayStarts.split(":")[0]) > Number(saturdayEnds.split(":")[0])
    );
  }, [saturdayStarts, saturdayEnds]);

  useEffect(() => {
    setIsSundayValid(
      Number(sundayStarts.split(":")[0]) > Number(sundayEnds.split(":")[0])
    );
  }, [sundayStarts, sundayEnds]);

  const handleUpdateWorkingTimes = async (e) => {
    e.preventDefault();
    try {
      props.setIsFetching(true);
      await axios.post(
        `/api/booking/${props.store?.storeName}/workingTimes`,
        {
          storeName: props.store?.storeName,
          workingTimes: {
            monday: {
              isActive: monday,
              workingHours: {
                starts: mondayStarts,
                ends: mondayEnds,
              },
            },
            tuesday: {
              isActive: tuesday,
              workingHours: {
                starts: tuesdayStarts,
                ends: tuesdayEnds,
              },
            },
            wednesday: {
              isActive: wednesday,
              workingHours: {
                starts: wednesdayStarts,
                ends: wednesdayEnds,
              },
            },
            thursday: {
              isActive: thursday,
              workingHours: {
                starts: thursdayStarts,
                ends: thursdayEnds,
              },
            },
            friday: {
              isActive: friday,
              workingHours: {
                starts: fridayStarts,
                ends: fridayEnds,
              },
            },
            saturday: {
              isActive: saturday,
              workingHours: {
                starts: saturdayStarts,
                ends: saturdayEnds,
              },
            },
            sunday: {
              isActive: sunday,
              workingHours: {
                starts: sundayStarts,
                ends: sundayEnds,
              },
            },
          },
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      props.setOpenWorkingTimes(false);
      props.setIsFetching(false);
      enqueueSnackbar("Çalışma Günü ve Saatleri güncellendi.", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      props.setIsFetching(false);
      enqueueSnackbar("Çalışma Günü ve Saatleri güncellenemedi.", {
        variant: "error",
      });
    }
  };

  return (
    <Modal
      open={props.openWorkingTimes}
      onClose={() => props.setOpenWorkingTimes(false)}
    >
      <Box className={styles.modal}>
        <h2 style={{ textAlign: "center", padding: "1rem", color: "#000814" }}>
          Çalışma Günü ve Saatleri
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
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: "1rem",
              }}
            >
              <FormGroup
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Pazartesi"
                    sx={{ minWidth: "6rem" }}
                    checked={monday}
                    onChange={(e) => setMonday(e.target.checked)}
                  />
                  {monday ? (
                    <>
                      <TextField
                        id="standard-basic"
                        label="Açılış"
                        sx={{ width: "5rem" }}
                        variant="standard"
                        defaultValue={mondayStarts}
                        onChange={(e) => setMondayStarts(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Kapanış"
                        error={isMondayValid}
                        sx={{ width: "5rem" }}
                        variant="standard"
                        defaultValue={mondayEnds}
                        helperText={
                          isMondayValid
                            ? "Kapanış Saati Başlangıç Saatinden Erken Olamaz."
                            : ""
                        }
                        onChange={(e) => setMondayEnds(e.target.value)}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Salı"
                    sx={{ minWidth: "6rem" }}
                    checked={tuesday}
                    onChange={(e) => setTuesday(e.target.checked)}
                  />

                  {tuesday ? (
                    <>
                      <TextField
                        id="standard-basic"
                        label="Açılış"
                        sx={{ width: "5rem" }}
                        variant="standard"
                        defaultValue={tuesdayStarts}
                        onChange={(e) => setTuesdayStarts(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Kapanış"
                        error={isTuesdayValid}
                        helperText={
                          isTuesdayValid
                            ? "Kapanış Saati Başlangıç Saatinden Erken Olamaz."
                            : ""
                        }
                        sx={{ width: "5rem" }}
                        variant="standard"
                        defaultValue={tuesdayEnds}
                        onChange={(e) => setTuesdayEnds(e.target.value)}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Çarşamba"
                    sx={{ minWidth: "6rem" }}
                    checked={wednesday}
                    onChange={(e) => setWednesday(e.target.checked)}
                  />

                  {wednesday ? (
                    <>
                      <TextField
                        id="standard-basic"
                        label="Açılış"
                        sx={{ width: "5rem" }}
                        variant="standard"
                        defaultValue={wednesdayStarts}
                        onChange={(e) => setWednesdayStarts(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Kapanış"
                        error={isWednesdayValid}
                        helperText={
                          isWednesdayValid
                            ? "Kapanış Saati Başlangıç Saatinden Erken Olamaz."
                            : ""
                        }
                        sx={{ width: "5rem" }}
                        variant="standard"
                        defaultValue={wednesdayEnds}
                        onChange={(e) => setWednesdayEnds(e.target.value)}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Perşembe"
                    sx={{ minWidth: "6rem" }}
                    checked={thursday}
                    onChange={(e) => setThursday(e.target.checked)}
                  />

                  {thursday ? (
                    <>
                      <TextField
                        id="standard-basic"
                        label="Açılış"
                        sx={{ width: "5rem" }}
                        variant="standard"
                        defaultValue={thursdayStarts}
                        onChange={(e) => setThursdayStarts(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Kapanış"
                        sx={{ width: "5rem" }}
                        variant="standard"
                        error={isThursdayValid}
                        helperText={
                          isThursdayValid
                            ? "Kapanış Saati Başlangıç Saatinden Erken Olamaz."
                            : ""
                        }
                        defaultValue={thursdayEnds}
                        onChange={(e) => setThursdayEnds(e.target.value)}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Cuma"
                    sx={{ minWidth: "6rem" }}
                    checked={friday}
                    onChange={(e) => setFriday(e.target.checked)}
                  />

                  {friday ? (
                    <>
                      <TextField
                        id="standard-basic"
                        label="Açılış"
                        sx={{ width: "5rem" }}
                        variant="standard"
                        defaultValue={fridayStarts}
                        onChange={(e) => setFridayStarts(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Kapanış"
                        sx={{ width: "5rem" }}
                        error={isFridayValid}
                        helperText={
                          isFridayValid
                            ? "Kapanış Saati Başlangıç Saatinden Erken Olamaz."
                            : ""
                        }
                        variant="standard"
                        defaultValue={fridayEnds}
                        onChange={(e) => setFridayEnd(e.target.value)}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Cumartesi"
                    sx={{ minWidth: "6rem" }}
                    checked={saturday}
                    onChange={(e) => setSaturday(e.target.checked)}
                  />

                  {saturday ? (
                    <>
                      <TextField
                        id="standard-basic"
                        label="Açılış"
                        sx={{ width: "5rem" }}
                        variant="standard"
                        defaultValue={saturdayStarts}
                        onChange={(e) => setSaturdayStarts(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Kapanış"
                        sx={{ width: "5rem" }}
                        variant="standard"
                        error={isSaturdayValid}
                        helperText={
                          isSaturdayValid
                            ? "Kapanış Saati Başlangıç Saatinden Erken Olamaz."
                            : ""
                        }
                        defaultValue={saturdayEnds}
                        onChange={(e) => setSaturdayEnds(e.target.value)}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Pazar"
                    sx={{ minWidth: "6rem" }}
                    checked={sunday}
                    onChange={(e) => setSunday(e.target.checked)}
                  />

                  {sunday ? (
                    <>
                      <TextField
                        id="standard-basic"
                        label="Açılış"
                        sx={{ width: "5rem" }}
                        variant="standard"
                        defaultValue={sundayStarts}
                        onChange={(e) => setSundayStarts(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Kapanış"
                        sx={{ width: "5rem" }}
                        variant="standard"
                        error={isSundayValid}
                        helperText={
                          isSundayValid
                            ? "Kapanış Saati Başlangıç Saatinden Erken Olamaz."
                            : ""
                        }
                        defaultValue={sundayEnds}
                        onChange={(e) => setSundayEnds(e.target.value)}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </FormGroup>
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
              onClick={() => props.setOpenWorkingTimes(false)}
            >
              {t("panel:discard")}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUpdateWorkingTimes}
            >
              {t("panel:confirm")}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default WorkingTimes;
