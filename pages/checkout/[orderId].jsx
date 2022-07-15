import { Button } from "@mui/material";
import axios from "axios";
import Nav from "../../components/Nav/Nav";
import db from "../../utils/db";
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
import { useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import useCard from "../../components/Card/card";
import { useContext } from "react";
import { Store } from "../../redux/store";
import { LoadingButton } from "@mui/lab";
import Order from "../../models/OrderModel";
import Product from "../../models/ProductModel";
import User from "../../models/UserModel";

const Checkout = ({ order }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const handler = () => setVisible(true);
  const [stepper, setStepper] = useState(0);
  const { render, name, number, cvc, expiry } = useCard();
  const closeHandler = () => {
    setVisible(false);
  };
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);

  const paymentHandler = async () => {
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
      const payment = await axios.post("/api/checkout/payment", {
        order: {
          id: order._id,
        },
        product: {
          price: order.product.price,
          paidPrice: order.product.price,
        },
        /*       card: {
              name,
            number,
                expireMonth: expiry.split("/")[0],
                expireYear: expiry.split("/")[1],
               cvc,
                registerCard: 0,
              }, */
        card: {
          name: "Enes Eren",
          number: "4987490000000002",
          month: "12",
          year: "24",
          cvc: "200",
        },
        user: {
          id: order.user._id,
          firstName: order.user.firstName,
          lastName: order.user.lastName,
          email: order.user.email,
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
      setIsSuccess(payment.data.status);
      if (payment.data.status === "success") {
        await axios.patch(
          "/api/order",
          {
            id: order._id,
            quantity: 365,
            expiry: new Date(
              new Date(order.expiry)?.setDate(
                new Date(order.expiry)?.getDate() + 360
              )
            ),
          },
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

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
          width="46rem"
          height="46rem"
          aria-labelledby="modal-title"
          open={modal}
          onClose={() => setModal(false)}
        ></Modal>
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
                  <Button
                    className={styles.button}
                    variant="contained"
                    type="submit"
                    onClick={() => {
                      handler();
                      setStepper(1);
                    }}
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
  const { orderId } = context.query;
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
