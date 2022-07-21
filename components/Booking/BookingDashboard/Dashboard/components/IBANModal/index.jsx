import React, { useContext, useState } from "react";
import Modal from "@mui/material/Modal";
import { Button, List, ListItem } from "@material-ui/core";
import { Box, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import useTranslation from "next-translate/useTranslation";
import styles from "../../BookingDashboard.module.css";
import axios from "axios";
import { Store } from "../../../../../../redux/store";

const IBANModal = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const [IBAN, setIBAN] = useState(props?.user?.IBAN);

  const handleUpdateIBAN = async (e) => {
    e.preventDefault();
    try {
      props.setIsFetching(true);
      const result = await axios.post(
        `/api/user/iban`,
        {
          id: props?.user?.id,
          iban: IBAN,
        },
        {
          headers: { authorization: `Bearer ${props?.user?.token}` },
        }
      );
      dispatch({ type: "USER_LOGIN", payload: result?.data?.newUser });
      await axios.post(`/api/booking/iyzico/company/update`, {
        conversationId: props?.orderId,
        subMerchantKey: props?.store?.subMerchantKey,
        address: props?.store?.address?.address,
        taxOffice: props?.user?.taxOffice,
        legalCompanyTitle: props?.user?.legalCompanyTitle,
        email: props?.user?.email,
        gsmNumber: props?.user?.phoneNumber,
        name: props?.store?.storeName,
        iban: IBAN,
        identityNumber: props?.user?.identityNumber,
      });
      props.setOpenIBAN(false);
      props.setIsFetching(false);
      enqueueSnackbar("IBAN güncellendi.", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      props.setOpenIBAN(false);
      props.setIsFetching(false);
      enqueueSnackbar("IBAN güncellenemedi.", {
        variant: "error",
      });
    }
  };

  return (
    <Modal
      open={props.openIBAN}
      onClose={() => {
        props.setOpenIBAN(false);
        setIBAN(props?.user?.IBAN);
      }}
    >
      <Box className={styles.modal}>
        <h2 style={{ textAlign: "center", padding: "1rem", color: "#000814" }}>
          IBAN
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
                label="IBAN Giriniz"
                style={{ width: "24rem" }}
                value={IBAN}
                onChange={(e) => setIBAN(e.target.value.trim())}
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
                props.setOpenIBAN(false);
                setIBAN(props?.user?.IBAN);
              }}
            >
              {t("panel:discard")}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUpdateIBAN}
            >
              {t("panel:confirm")}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default IBANModal;
