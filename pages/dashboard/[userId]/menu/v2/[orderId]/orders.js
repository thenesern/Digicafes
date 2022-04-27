import axios from "axios";
import { useSnackbar } from "notistack";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Nav from "../../../../../../components/Nav/Nav";
import OrderNav from "../../../../../../components/OrderNav/OrderNav";
import StoreOrders from "../../../../../../components/StoreOrders/StoreOrders";
import Order from "../../../../../../models/OrderModel";
import QRMenu from "../../../../../../models/QRMenu2Model";
import db from "../../../../../../utils/db";
import styles from "./orders.module.css";
import ReactAudioPlayer from "react-audio-player";
import { useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { trTR } from "@mui/x-data-grid";

const StoreOrderPanel = ({ data, order }) => {
  const [storeLogo, setStoreLogo] = useState(data?.storeLogo);
  const [storeName, setStoreName] = useState(data?.storeName);
  const [menuv2Id, setMenuv2Id] = useState(order?.menuv2);
  const [orders, setOrders] = useState(data?.orders);
  const [calls, setCalls] = useState(data?.calls);
  const [refreshToken, setRefreshToken] = useState(Math.random());
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isNew, setIsNew] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const audioRef = useRef();
  const alertRef = useRef();

  const audio = audioRef?.current?.audioEl?.current;
  const alert = alertRef?.current?.audioEl?.current;

  useEffect(() => {
    retrieveData().finally(() => {
      setTimeout(() => setRefreshToken(Math.random()), 15000);
    });
  }, [refreshToken]);

  async function retrieveData() {
    try {
      const menus = await axios.post(`/api/qr/v2/${storeName}/orders`, {
        menuv2Id,
      });
      if (orders.length < menus?.data?.menu?.orders.length) {
        setIsNew(true);
      } else if (calls.length < menus?.data?.menu?.calls.length) {
        setIsNotification(true);
      }
      setOrders(menus?.data?.menu?.orders);
      setCalls(menus?.data?.menu?.calls);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    if (isNew) {
      enqueueSnackbar("Yeni Sipariş", { variant: "success" });
      audio.play();
      setIsNew(false);
    } else if (isNotification) {
      enqueueSnackbar("Yeni Çağrı", { variant: "success" });
      alert.play();
      setIsNotification(false);
    } else {
      return;
    }
  }, [isNew, isNotification]);
  const columns = [
    {
      field: "tableNum",
      headerName: "Masa No.",
      headerClassName: "dark",
      flex: 1,
      editable: false,
    },
    {
      field: "createdAt",
      headerName: "Sipariş Zamanı",
      headerClassName: "dark",
      flex: 1,
      editable: false,
    },
    {
      field: "callName",
      headerName: "Çağrı Türü",
      headerClassName: "dark",
      flex: 1,
      editable: false,
    },
  ];

  return (
    <div className={styles.container}>
      <OrderNav orders={orders} storeLogo={storeLogo} />
      <StoreOrders orders={orders} />
      <div>
        <ReactAudioPlayer
          src="https://res.cloudinary.com/dlyjd3mnb/video/upload/v1650899563/orderAlert_ltwbxs.mp3"
          ref={audioRef}
        />
        <ReactAudioPlayer
          src="https://res.cloudinary.com/dlyjd3mnb/video/upload/v1651068677/bell_sr3k8n.mp3"
          ref={alertRef}
        />
      </div>
      <div style={{ padding: "0 2rem" }}>
        <div className={styles.grids}>
          <DataGrid
            rows={calls}
            columns={columns}
            className={styles.grid}
            initialState={{
              sorting: {
                sortModel: [{ field: "createdAt", sort: "desc" }],
              },
            }}
            rowHeight={36}
            sx={{
              height: 1,
              width: 1,
              "& .dark": {
                backgroundColor: "#1d3557",
                color: "#fbeee0",
              },
            }}
            pageSize={3}
            rowsPerPageOptions={[3]}
            getRowId={(row) => row?._id}
            disableSelectionOnClick
            localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
          />
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { orderId } = context.query;
  const { userId } = context.query;
  const signedUserId = JSON.parse(context.req.cookies["userInfo"])?.id || null;
  await db.connect();

  const order = await Order.findOne({ _id: orderId });
  const menu = await QRMenu.findOne({ _id: order?.menuv2 });
  await db.disconnect();
  if (signedUserId !== userId) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  return {
    props: {
      data: JSON.parse(JSON.stringify(menu)),
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}
export default StoreOrderPanel;
