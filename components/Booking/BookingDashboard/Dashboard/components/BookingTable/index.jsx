import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../BookingDashboard.module.css";
import { trTR } from "@mui/x-data-grid";
import axios from "axios";
import { useSnackbar } from "notistack";
import ReactAudioPlayer from "react-audio-player";

const BookingTable = (props) => {
  const [pageSize, setPageSize] = useState(20);
  const [refreshToken, setRefreshToken] = useState(Math.random());
  const [isNew, setIsNew] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const audioRef = useRef();
  const audio = audioRef?.current?.audioEl?.current;

  useEffect(() => {
    retrieveData().finally(() => {
      setTimeout(() => setRefreshToken(Math.random()), 15000);
    });
  }, [refreshToken]);

  useEffect(() => {
    if (isNew) {
      enqueueSnackbar("Yeni Rezervasyon", { variant: "success" });
      audio.play();
      setIsNew(false);
    } else {
      return;
    }
  }, [isNew]);

  const retrieveData = async () => {
    const storeName = props.store?.storeName;
    if (props?.isFetching) {
      return;
    }
    try {
      const newStore = await axios.post(
        `/api/booking/${storeName}/getStore`,
        {
          storeName,
        },
        {
          headers: { authorization: `Bearer ${props?.user?.token}` },
        }
      );
      if (
        props?.store?.bookings?.length < newStore?.data?.store?.bookings?.length
      ) {
        setIsNew(true);
        props.setStore(newStore?.data?.store);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      field: "userName",
      headerName: "Ad Soyad",
      flex: 1,
    },
    {
      field: "userEmail",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Telefon Numarası",
      flex: 1,
      renderCell: (params) => {
        return <div>+90 {params.row.phoneNumber.split("90")[1]}</div>;
      },
    },
    {
      field: "people",
      headerName: "Kişi Sayısı",
      flex: 1,
    },
    {
      field: "isPaid",
      headerName: "Kapora",
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            {params.row.isPaid === true ? (
              <p
                style={{
                  backgroundColor: "#a3b18a",
                  padding: "2rem",
                  minWidth: "8rem",
                }}
              >
                Ödendi
              </p>
            ) : (
              <p style={{ padding: "2rem", minWidth: "8rem" }}>Ödenmedi</p>
            )}
          </div>
        );
      },
    },

    {
      field: "date",
      headerName: "Rezervasyon Tarihi",
      flex: 2,
      renderCell: (params) => {
        return (
          <div
            style={
              new Date(params.row.date).toLocaleDateString() ===
              new Date().toLocaleDateString()
                ? { backgroundColor: "#f2cc8f", padding: "2rem" }
                : { backgroundColor: "", padding: "2rem" }
            }
          >
            {new Date(params.row.date).toLocaleString()}
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Oluşturulma Tarihi",
      hide: false,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return <span> {new Date(params.row.createdAt).toLocaleString()}</span>;
      },
    },
  ];

  return (
    <div className={styles.body}>
      <DataGrid
        rows={props?.tableData || []}
        classnName={styles.table}
        density="compact"
        sx={{ padding: "0 1rem" }}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: "date", sort: "desc" }],
          },
        }}
        getRowId={(row) => row?._id}
        localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
        disableSelectionOnClick
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[20, 40, 60]}
        pagination
      />
      <div>
        <ReactAudioPlayer
          src="https://res.cloudinary.com/dlyjd3mnb/video/upload/v1650899563/orderAlert_ltwbxs.mp3"
          ref={audioRef}
        />
      </div>
    </div>
  );
};

export default BookingTable;
