import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Button, List, ListItem } from "@material-ui/core";
import { Box, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import useTranslation from "next-translate/useTranslation";
import styles from "../../BookingDashboard.module.css";
import axios from "axios";

const DescriptionModal = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [description, setDescription] = useState(props?.store?.description);

  const handleUpdateDescription = async (e) => {
    e.preventDefault();
    try {
      props.setIsFetching(true);
      const result = await axios.post(
        `/api/booking/${props?.store?.storeName}/description`,
        {
          storeName: props?.store?.storeName,
          description: description,
        },
        {
          headers: { authorization: `Bearer ${props?.user?.token}` },
        }
      );
      props.setOpenDescription(false);
      props.setIsFetching(false);
      enqueueSnackbar("Hakkımızda kısmı güncellendi.", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      props.setOpenDescription(false);
      props.setIsFetching(false);
      enqueueSnackbar("Hakkımızda kısmı güncellenemedi.", {
        variant: "error",
      });
    }
  };

  return (
    <Modal
      open={props.openDescription}
      onClose={() => {
        props.setOpenDescription(false);
        setDescription(props?.store?.description);
      }}
    >
      <Box className={styles.modal}>
        <h2 style={{ textAlign: "center", padding: "1rem", color: "#000814" }}>
          İşletme Hakkında
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
              <TextField
                id="standard-basic"
                label="Açıklama Giriniz"
                style={{ width: "24rem" }}
                value={description}
                onChange={(e) => setDescription(e.target.value.trim())}
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
              onClick={() => {
                setDescription(props?.store?.description);
                props.setOpenDescription(false);
              }}
            >
              {t("panel:discard")}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUpdateDescription}
            >
              {t("panel:confirm")}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default DescriptionModal;
