import React, { useEffect, useRef, useState } from "react";
import { Button as NextButton, Modal, Text } from "@nextui-org/react";
import { DataGrid } from "@mui/x-data-grid";
import { trTR } from "@mui/x-data-grid";
import axios from "axios";
import { useSnackbar } from "notistack";
import ReactAudioPlayer from "react-audio-player";
import styles from "../../BookingDashboard.module.css";

const BookingTable = (props) => {
  const [bookings, setBookings] = useState(props?.tableData);
  const [pageSize, setPageSize] = useState(20);
  const [refreshToken, setRefreshToken] = useState(Math.random());
  const [isNew, setIsNew] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedUserPayment, setSelectedUserPayment] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserInfos, setSelectedUserInfos] = useState(null);

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
    setSelectedConversationId("");
    setSelectedUser("");
    setSelectedUserInfos(null);
  };
  const handleCloseCancelModal = () => {
    setOpenCancelModal(false);
    setSelectedConversationId("");
    setSelectedUser("");
    setSelectedUserInfos(null);
  };
  const handleOpenConfirmModal = () => setOpenConfirmModal(true);
  const handleOpenCancelModal = () => setOpenCancelModal(true);
  const audioRef = useRef();
  const audio = audioRef?.current?.audioEl?.current;

  const handleConfirmBooking = async (e) => {
    props?.setIsFetching(true);
    bookings.filter(
      (booking) => booking?.conversationId === selectedConversationId
    )[0].status = "Confirm";
    try {
      await axios.post("/api/booking/deposit/confirm", {
        conversationId: selectedConversationId,
        paymentTransactionId:
          selectedUserPayment?.payment?.itemTransactions[0]
            ?.paymentTransactionId,
      });

      const updatedStore = await axios.patch("/api/booking/bookings", {
        bookings: bookings,
        id: props?.storeId,
      });
      handleCloseConfirmModal();
      props?.setIsFetching(false);
    } catch (err) {
      props?.setIsFetching(false);
      console.log(err);
    }
  };

  const handleCancelBooking = async (e) => {
    props?.setIsFetching(true);
    bookings.filter(
      (booking) => booking?.conversationId === selectedConversationId
    )[0].status = "Cancel";
    try {
      await axios.post("/api/booking/deposit/cancel", {
        conversationId: selectedConversationId,
        paymentTransactionId:
          selectedUserPayment?.payment?.itemTransactions[0]
            ?.paymentTransactionId,
      });

      const updatedStore = await axios.patch("/api/booking/bookings", {
        bookings: bookings,
        id: props?.storeId,
      });
      handleCloseCancelModal();
      props?.setIsFetching(false);
    } catch (err) {
      props?.setIsFetching(false);
      console.log(err);
    }
  };

  useEffect(() => {
    setSelectedUserInfos(
      bookings?.filter((booking) => booking?.user === selectedUser)[0]
    );
  }, [selectedUser]);

  useEffect(() => {
    setSelectedUserPayment(
      props?.payments?.filter(
        (payment) => payment?.payment?.conversationId === selectedConversationId
      )[0]
    );
  }, [selectedConversationId]);

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
            {params.row.isPaid ? (
              <p
                style={{
                  backgroundColor: "#cfe1b9",
                  padding: "2rem",
                  minWidth: "8rem",
                }}
              >
                {params.row.isPaid}₺
              </p>
            ) : (
              <p style={{ padding: "2rem", minWidth: "8rem" }}>Ücretsiz</p>
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
                ? { backgroundColor: "#fcefb4", padding: "2rem" }
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
    {
      field: "status",
      headerName: "Durum",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            {params.row.status === "Waiting" && (
              <p
                align="center"
                style={{
                  backgroundColor: "#e5e5e5",
                  padding: "2rem 1rem",
                  minWidth: "8rem",
                }}
              >
                Beklemede
              </p>
            )}
            {params.row.status === "Confirm" && (
              <p
                align="center"
                style={{
                  backgroundColor: "#cfe1b9",
                  padding: "2rem 1rem",
                  minWidth: "8rem",
                }}
              >
                Onaylandı
              </p>
            )}
            {params.row.status === "Cancel" && (
              <p
                align="center"
                style={{
                  backgroundColor: "#e39695",
                  padding: "2rem 1rem",
                  minWidth: "8rem",
                }}
              >
                İptal Edildi
              </p>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Yönet",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <NextButton
              flat
              rounded
              color="success"
              auto
              style={{ height: "2rem", padding: "1rem" }}
              onClick={() => {
                setSelectedConversationId(params.row.conversationId);
                setSelectedUser(params.row.user);
                handleOpenConfirmModal();
              }}
            >
              Onayla
            </NextButton>
            <NextButton
              flat
              rounded
              color="error"
              auto
              style={{ height: "2rem", padding: "1rem" }}
              onClick={() => {
                setSelectedConversationId(params.row.conversationId);
                setSelectedUser(params.row.user);
                handleOpenCancelModal();
              }}
            >
              İptal Et
            </NextButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.body}>
      <DataGrid
        rows={bookings || []}
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
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={openConfirmModal}
        width={500}
        onClose={handleCloseConfirmModal}
      >
        <Modal.Header>
          <Text b size={18}>
            Emin misiniz?
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text>
            <Text b>{selectedUserInfos?.userName} </Text>adlı kullanıcının
            rezervasyonu{" "}
            <Text b color="success">
              onaylanacak.
            </Text>
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <NextButton
            color="default"
            flat
            auto
            style={{ height: "2rem", padding: "1rem" }}
            onClick={handleCloseConfirmModal}
          >
            Vazgeç
          </NextButton>
          <NextButton
            color="warning"
            auto
            style={{ height: "2rem", padding: "1rem" }}
            onClick={handleConfirmBooking}
          >
            Onayla
          </NextButton>
        </Modal.Footer>
      </Modal>
      <Modal
        closeButton
        aria-labelledby="cancel-modal"
        open={openCancelModal}
        width={500}
        onClose={handleCloseCancelModal}
      >
        <Modal.Header>
          <Text b size={18}>
            Emin misiniz?
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text>
            <Text b>{selectedUserInfos?.userName} </Text>adlı kullanıcının
            rezervasyonu{" "}
            <Text b color="error">
              iptal edilecek.
            </Text>
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <NextButton
            color="default"
            flat
            auto
            style={{ height: "2rem", padding: "1rem" }}
            onClick={handleCloseCancelModal}
          >
            Vazgeç
          </NextButton>
          <NextButton
            color="warning"
            auto
            style={{ height: "2rem", padding: "1rem" }}
            onClick={handleCancelBooking}
          >
            Onayla
          </NextButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingTable;
