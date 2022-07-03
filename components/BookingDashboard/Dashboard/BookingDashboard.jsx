import React, { useState } from "react";
import styles from "./BookingDashboard.module.css";
import DragDrop from "../DragDrop";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import DashboardIcon from "@mui/icons-material/Dashboard";
import useTranslation from "next-translate/useTranslation";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Button, IconButton, Input, List, ListItem } from "@material-ui/core";
import ModalMui from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { PhotoCamera } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";

const BookingDashboard = ({ userOrder }) => {
  const [store, setStore] = useState(userOrder?.booking);
  const [isFetching, setIsFetching] = useState(false);
  const [file, setFile] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [openUploadLogo, setOpenUploadLogo] = useState(false);
  const [openColumns, setOpenColumns] = useState(false);
  const [openStage, setOpenStage] = useState(false);
  const [openGate, setOpenGate] = useState(false);
  const [openSavedColumns, setOpenSavedColumns] = useState(false);
  const [order, setOrder] = useState([]);
  const { t } = useTranslation();
  const [gate, setGate] = useState(store?.bookingSchema?.gate || "none");
  const [stage, setStage] = useState(store?.bookingSchema?.stage || "none");
  const [columns, setColumns] = useState(store?.bookingSchema?.columns || null);
  const [signalToColumns, setSignalToColumns] = useState(false);
  const [signalReturned, setSignalReturned] = useState(false);
  const [savedColumns, setSavedColumns] = useState(
    store?.bookingSchema?.savedColumns || {}
  );
  let user;
  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }
  const [storeLogo, setStoreLogo] = useState(
    store?.storeLogo ||
      "https://res.cloudinary.com/dlyjd3mnb/image/upload/v1650137521/uploads/logoDefault_ez8obk.png"
  );
  const handleOpenUploadLogo = () => setOpenUploadLogo(true);
  const handleCloseUploadLogo = () => setOpenUploadLogo(false);
  const handleOpenColumns = () => setOpenColumns(true);
  const handleCloseColumns = () => setOpenColumns(false);
  const handleOpenGate = () => setOpenGate(true);
  const handleCloseGate = () => setOpenGate(false);
  const handleOpenSavedColumns = () => setOpenSavedColumns(true);
  const handleCloseSavedColumns = () => setOpenSavedColumns(false);
  const handleOpenStage = () => setOpenStage(true);
  const handleCloseStage = () => {
    setOpenStage(false);

    if (stage !== store?.bookingSchema?.stage) {
      setStage(store?.bookingSchema?.stage);
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

  const handleUpdateStage = async (e) => {
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
      setIsFetching(false);
      setFile(null);
      enqueueSnackbar("Sahne güncellemesi başarısız.", { variant: "error" });
    }
  };

  const handleUpdateColumns = async (e) => {
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
  };

  const handleUpdateSavedColumns = async () => {
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
  };

  useEffect(() => {
    if (signalReturned === true) {
      setSignalReturned(false);
      handleUpdateSavedColumns();
    }
  }, [signalReturned]);

  return (
    <div className={styles.container}>
      <div className={styles.sideBar}>
        <div className={styles.sidebar}>
          <img src={storeLogo} alt="Logo" className={styles.logo} />
          <div>
            <h3 className={styles.sidebarHeader}>
              <DashboardIcon />
            </h3>
            <ul className={styles.sidebarList}>
              <li>
                <Button
                  variant="outlined"
                  style={{
                    height: "2rem",
                    minWidth: "11rem",
                    fontSize: "13px",
                    color: "#fbeee0",
                    border: "1px solid #fbeee0",
                  }}
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
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.app}>
        <DragDrop
          stage={store?.bookingSchema?.stage}
          storeName={store?.storeName}
          tableNum={store?.tableNum}
          setSignalReturned={setSignalReturned}
          gate={store?.bookingSchema?.gate}
          signalToColumns={signalToColumns}
          savedColumns={savedColumns}
          setSavedColumns={setSavedColumns}
          bookingColumns={store?.bookingSchema?.columns}
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
      <ModalMui
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
      </ModalMui>
      <ModalMui
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
      </ModalMui>
      <ModalMui
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
      </ModalMui>
      <ModalMui
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
