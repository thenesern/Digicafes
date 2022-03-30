import { Button } from "@mui/material";
import axios from "axios";
import { HmacSHA256 } from "crypto-js";
import Cookies from "js-cookie";
import Nav from "../../components/Nav/Nav";
import Product from "../../models/ProductModel";
import db from "../../utils/db";
import styles from "./checkout.module.css";
import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

const checkout = ({ product }) => {
  let user;
  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }
  const steps = ["Siparişi Gözden Geçir", "Ödemeyi Tamamla", "Sonuç"];
  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#784af4",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#784af4",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));

  const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#784af4",
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  }));

  function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }

  QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
  };

  const paymentHandler = async () => {
    try {
      await axios.post(
        "/api/order",
        { product: product._id, user: user.id },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      /*  await axios.post("/api/payments", { hello: "hi" }); */
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <Stack sx={{ width: "100%" }} spacing={4}>
          <Stepper
            alternativeLabel
            activeStep={0}
            connector={<QontoConnector />}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
        <div className={styles.box}>
          <div className={styles.left}>
            <h1 className={styles.title}>Sepet Bilgisi</h1>
            <div className={styles.informations}>
              <div>
                <h5 className={styles.title}>Ürün Adı</h5>
                <p>{product.name}</p>
              </div>
              <div>
                <h5 className={styles.title}>Adet / Süre</h5>
                <p>{product.period}lık Hizmet</p>
              </div>
              <div>
                <h5 className={styles.title}>Fiyat</h5>
                <p>{product.price}₺</p>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.summary}>
              <h1 className={styles.title}>Özet</h1>
              <div>
                <p>Toplam Tutar: {product.price}₺</p>
              </div>
            </div>
            {user ? (
              <div className={styles.footer}>
                <Button
                  className={styles.button}
                  variant="contained"
                  type="submit"
                  onClick={paymentHandler}
                  fullWidth
                  style={{ backgroundColor: "#264653" }}
                >
                  Siparişi Tamamla
                </Button>
              </div>
            ) : (
              <h6>Siparişi tamamlamak için lütfen giriş yapınız.</h6>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  await db.connect();
  const products = await Product.find();
  await db.disconnect();
  return {
    paths: products.map((product) => {
      return {
        params: { id: JSON.parse(JSON.stringify(product._id)) },
      };
    }),
    fallback: false, // false or 'blocking'
  };
}
export async function getStaticProps({ params }) {
  await db.connect();
  const product = await Product.findById(params.id).lean();
  await db.disconnect();
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}

export default checkout;
