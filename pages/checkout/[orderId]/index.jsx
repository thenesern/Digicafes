import { Button } from "@mui/material";
import axios from "axios";
import Nav from "../../../components/Nav/Nav";
import db from "../../../utils/db";
import styles from "./checkout.module.css";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Check from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { Modal } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import useCard from "../../../components/Card/card";
import { useContext } from "react";
import { Store } from "../../../redux/store";
import { LoadingButton } from "@mui/lab";
import Order from "../../../models/OrderModel";
import Product from "../../../models/ProductModel";
import User from "../../../models/UserModel";
const base64 = require("base-64");

const Checkout = ({ order }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const handler = () => setVisible(true);
  const [stepper, setStepper] = useState(0);
  const { render, name, number, cvc, expiry } = useCard();
  const [is3DsModal, setIs3DsModal] = useState(false);
  const [html, setHTML] = useState("");
  const closeHandler = () => {
    setVisible(false);
  };
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const paymentHandler = async (res) => {
    setLoading(true);
    let signedIn =
      order.user.signedIn.split("T")[0] +
      " " +
      order.user.signedIn.split("T")[1].split(".")[0];
    let registered =
      order.user.createdAt.split("T")[0] +
      " " +
      order.user.createdAt.split("T")[1].split(".")[0];
    try {
      const connection = await axios.get("/api/remote-address");
      const payment = await axios.post("/api/checkout/payment/init-3ds", {
        order: {
          id: order?._id,
        },
        product: {
          price: order.product.price,
          paidPrice: order.product.price,
        },
        card: {
          name,
          number,
          month: expiry.split("/")[0],
          year: expiry.split("/")[1],
          cvc,
        },
        user: {
          id: order.user._id,
          firstName: order.user.firstName,
          lastName: order.user.lastName,
          email: order.user.email,
          identityNumber: order.user.identityNumber,
          lastLoginDate: signedIn,
          registrationDate: registered,
          ip: connection.ip,
        },
        basketItems: [
          {
            id: order.product._id,
            name: order.product.nameTR,
            category1: order.product.category,
            itemType: "VIRTUAL",
            price: order.product.price,
          },
        ],
      });

      if (payment?.data?.status === "success") {
        setPaymentId(payment?.data?.paymentId);
        setIs3DsModal(true);
        let form;
        form = base64.decode(payment?.data["threeDSHtmlContent"]);
        setHTML(form);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const [refreshToken, setRefreshToken] = useState(Math.random());

  const retrieveData = async () => {
    try {
      const result = await axios.post(
        "/api/order/findById",
        {
          id: order?._id,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (
        result?.order?.payments?.filter(
          (payment) => payment?.paymentId === paymentId
        )[0]?.status === "success"
      ) {
        setIs3DsModal(false);
        setIsSuccess(true);
      }
      if (
        result?.order?.payments?.filter(
          (payment) => payment?.paymentId === paymentId
        )[0]?.status === "fail"
      ) {
        setIs3DsModal(false);
        setIsSuccess(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    retrieveData().finally(() => {
      setTimeout(() => setRefreshToken(Math.random()), 3000);
    });
  }, [refreshToken]);

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

  return (
    <div>
      <Nav color={"#c9184a"} />
      <div className={styles.container}>
        <Modal
          closeButton
          preventClose
          width="46rem"
          aria-labelledby="modal-title"
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <h3>Kart Bilgilerini Giriniz</h3>
          </Modal.Header>
          <Modal.Body>{render}</Modal.Body>
          <Modal.Footer style={{ margin: "0", paddingTop: "0" }}>
            <LoadingButton
              size="medium"
              onClick={() => {
                setStepper(2);
                setVisible(false);
                paymentHandler();
              }}
              loading={loading}
              style={{ margin: "1rem 2rem" }}
              color="primary"
              variant="contained"
              disabled={loading}
            >
              Ödemeyi Tamamla
            </LoadingButton>
          </Modal.Footer>
        </Modal>
        <Modal
          preventClose
          aria-labelledby="modal-title"
          open={is3DsModal}
          onClose={() => setIs3DsModal(false)}
        >
          <iframe
            onSubmit={() => setIs3DsModal(false)}
            srcDoc={html}
            style={{
              minHeight: "36rem",
              minwidth: "12rem",
              padding: "2rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
            }}
            frameBorder="0"
            scrolling="yes"
          ></iframe>
        </Modal>

        <Stack sx={{ width: "100%" }} spacing={4} className={styles.stepper}>
          <Stepper
            alternativeLabel
            activeStep={stepper}
            connector={<QontoConnector />}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={QontoStepIcon}>
                  <h6 className={styles.stepperLabel}> {label} </h6>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
        <div className={styles.box}>
          <div className={styles.left}>
            <h1 className={styles.header}>Sepet Bilgisi</h1>
            <div className={styles.informations}>
              <div className={styles.cells}>
                <h5 className={styles.title}>Ürün Adı</h5>
                <p>{order.product.nameTR}</p>
              </div>
              <div className={styles.cells}>
                <h5 className={styles.title}>Adet / Süre</h5>
                <p>{order.product.periodTR} Hizmet</p>
              </div>
              <div className={styles.cells}>
                <h5 className={styles.title}>Fiyat</h5>
                <p>{order.product.price}₺</p>
              </div>
            </div>
          </div>
          {isSuccess === null ? (
            <div className={styles.right}>
              <div className={styles.summary}>
                <h1 className={styles.header}>Özet</h1>
                <div>
                  <p className={styles.SummaryDescription}>
                    Toplam Tutar: {order.product.price}₺
                  </p>
                </div>
              </div>
              {userInfo ? (
                <div className={styles.footer}>
                  <LoadingButton
                    style={{ backgroundColor: "#264653" }}
                    size="medium"
                    variant="contained"
                    type="submit"
                    onClick={() => {
                      setLoader(true);
                      handler();
                      setStepper(1);
                    }}
                    fullWidth
                    loading={loader}
                    className={styles.button}
                    color="primary"
                    disabled={loader}
                  >
                    Siparişi Tamamla
                  </LoadingButton>
                </div>
              ) : (
                <h6>Siparişi tamamlamak için lütfen giriş yapınız.</h6>
              )}
            </div>
          ) : isSuccess === "success" && isSuccess !== null ? (
            <div
              className={styles.right}
              style={{
                dispaly: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <h3 style={{ color: "#000814" }} align="center">
                Satın aldığınız için teşekkür ederiz.
              </h3>
              <CheckCircleOutlineIcon
                color="success"
                style={{ fontSize: "7rem" }}
              />
            </div>
          ) : (
            <div
              className={styles.right}
              style={{
                dispaly: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <h3 style={{ color: "#000814" }} align="center">
                Ödeme gerçekleştirilemedi.
              </h3>
              <ErrorOutlineIcon color="error" style={{ fontSize: "7rem" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { orderId, req, res } = context.query;
  await db.connect();
  const order = await Order.findById(orderId)
    .populate({
      path: "product",
      model: Product,
    })
    .populate({ path: "user", model: User });

  await db.disconnect();
  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}

export default Checkout;
