// Packages and Dependencies
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { useEffect } from "react";
import { Input, Modal } from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import { Button, Grid } from "@mui/material";

import { trTR } from "@mui/x-data-grid";
// Context
import { useContext } from "react";
// Styles
import styles from "./OrderTable.module.css";
import { Store } from "../../../../redux/store";

const OrderTable = (props) => {
  const [orders, setOrders] = useState(props.orders);
  const [id, setId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [productId, setProductId] = useState("");
  const [lastName, setLastName] = useState("");
  const [planExpiry, setPlanExpiry] = useState(null);
  const [productName, setProductName] = useState("");
  const { state } = useContext(Store);
  const [orderExpiry, setOrderExpiry] = useState(null);
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [quantity, setQuantity] = useState([]);
  const { userInfo } = state;
  let date = new Date();
  date?.setDate(date?.getDate() + planExpiry);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [newOrderDate, setNewOrderDate] = useState(null);
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setOrderExpiry(null);
    setPlanExpiry(null);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setId(null);
    setFirstName("");
    setLastName("");
    setProductName("");
  };
  const handleCloseNew = () => {
    setOpenNew(false);
    setId(null);
    setProductId(null);
    setPlanExpiry(null);
    date = new Date();
  };

  useEffect(() => {
    setNewOrderDate(
      new Date(
        new Date(orderExpiry)?.setDate(
          new Date(orderExpiry)?.getDate() + planExpiry
        )
      )
    );
  }, [planExpiry, orderExpiry]);

  const columns = [
    {
      field: "_id",
      headerName: "Sipari?? No.",
      flex: 2,
    },
    {
      field: "firstName",
      headerName: "Ad",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className={styles.userListItem}>
            {params.row.user?.firstName}
          </div>
        );
      },
    },
    {
      field: "lastName",
      headerName: "Soyad",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className={styles.userListItem}>{params.row.user?.lastName}</div>
        );
      },
    },
    {
      field: "email",
      headerName: "E-mail",
      flex: 2,
      renderCell: (params) => {
        return (
          <div className={styles.userListItem}>{params.row.user?.email}</div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Plan Ba??lang???? Tarihi",
      flex: 2,
      renderCell: (params) => {
        return (
          <div className={styles.userListItem}>
            {new Date(params.row.createdAt).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      field: "expiry",
      headerName: "Plan Biti?? Tarihi",
      flex: 2,
      renderCell: (params) => {
        return (
          <div className={styles.userListItem}>
            {new Date(params.row.expiry).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      field: "quantity",
      headerName: "S??reler",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className={styles.userListItem}>
            {params.row.quantity.map((q) => (
              <span key={Math.random() + q}>{q} </span>
            ))}
          </div>
        );
      },
    },
    {
      field: "productName",
      headerName: "Plan Ad??",
      width: 60,
      renderCell: (params) => {
        return (
          <div className={styles.userListItem}>
            {params.row.product?.name.split("-")[1]}
          </div>
        );
      },
    },
    {
      field: "storeName",
      headerName: "????letme Ad??",
      flex: 2,
      renderCell: (params) => {
        return (
          <div className={styles.userListItem}>
            {params.row.menuv1?.storeName ||
              params.row.menuv2?.storeName ||
              "Hen??z Olu??turulmad??"}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "????lem",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => {
                setOpenUpdate(true);
                setId(params.row._id);
                setOrderExpiry(
                  new Date(new Date(params.row.expiry?.toString()).getTime())
                );
              }}
            >
              <span
                style={{
                  margin: "0",
                  padding: "0",
                  fontSize: "12px",
                  width: "3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                D??zenle
              </span>
            </Button>
            {/*     <Button
              variant="outlined"
              color="error"
              style={{ marginLeft: "6px" }}
              onClick={() => {
                setId(params.row._id);
                setFirstName(params.row.user?.firstName);
                setLastName(params.row.user?.lastName);
                setProductName(params.row.product?.name);
                setOpenDelete(true);
              }}
            >
              <span
                style={{
                  margin: "0",
                  padding: "0",
                  fontSize: "12px",
                  width: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Sil
              </span>
            </Button> */}
          </div>
        );
      },
    },
  ];

  const handleDelete = async (id) => {
    try {
      const orders = await axios.delete("/api/orders/" + id, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      setOrders(orders?.data?.orders);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNewOrder = async (e) => {
    e.preventDefault();
    try {
      const orders = await axios.post(
        "/api/order",
        {
          product: productId,
          user: id,
          expiry: date,
          quantity: [planExpiry],
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setOrders(orders?.data?.orders);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      const orders = await axios.patch(
        "/api/order",
        {
          id,
          quantity: planExpiry,
          expiry: newOrderDate,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setOrders(orders?.data?.orders);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={styles.datatable}>
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        style={{ padding: "12px" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Modal.Header>
          <h1 style={{ textAlign: "start", width: "100%" }}>Emin misiniz?</h1>
        </Modal.Header>
        <Modal.Body style={{ margin: " 12px 0" }}>
          <p>
            Sipari?? ({firstName} {lastName}) ({productName}) silinecek.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" onClick={handleCloseDelete}>
            Vazge??
          </Button>
          <Button
            variant="contained"
            color="error"
            style={{ marginLeft: "1rem" }}
            onClick={() => {
              handleDelete(id);
              handleCloseDelete();
            }}
          >
            Onayla
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        style={{ padding: "12px" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Modal.Header>
          <h1 style={{ textAlign: "start", width: "100%" }}>
            Sipari??i D??zenle
          </h1>
        </Modal.Header>
        <Modal.Body style={{ margin: " 12px 0" }}>
          <Input
            underlined
            label="Plan Biti?? Tarihi"
            disabled
            style={{ color: "black" }}
            initialValue={
              new Date(new Date(orderExpiry?.toString()).getTime())
                ?.toLocaleString()
                .split(" ")[0]
            }
          />
          <h3>S??re Ekle</h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setPlanExpiry(30);
              }}
            >
              1 AY
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setPlanExpiry(90);
              }}
            >
              3 AY
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setPlanExpiry(180);
              }}
            >
              6 AY
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setPlanExpiry(365);
              }}
            >
              12 AY
            </Button>
          </div>
          <div>
            <h3>??zet</h3>
            <Input
              underlined
              label="Yeni Plan Biti?? Tarihi"
              disabled
              style={{ color: "black" }}
              value={
                new Date(
                  new Date(orderExpiry)?.setDate(
                    new Date(orderExpiry)?.getDate() + planExpiry
                  )
                )
                  .toLocaleString()
                  .split(" ")[0]
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" onClick={handleCloseUpdate}>
            Vazge??
          </Button>
          <Button
            variant="contained"
            color="error"
            style={{ marginLeft: "1rem" }}
            onClick={(e) => {
              handleUpdateOrder(e);
              handleCloseUpdate();
            }}
          >
            Onayla
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        open={openNew}
        onClose={handleCloseNew}
        style={{ padding: "12px" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Modal.Header>
          <h1 style={{ textAlign: "start", width: "100%" }}>Sipari?? Olu??tur</h1>
        </Modal.Header>
        <Modal.Body style={{ margin: " 12px 0" }}>
          <Input
            underlined
            label="Kullan??c?? ID"
            onChange={(e) => setId(e.target.value)}
          />
          <h3>Paket</h3>
          <Grid>
            <Button
              variant="contained"
              onClick={() => setProductId("6258375f9e1d43dfdd2eb688")}
            >
              Dijital Men?? V1
            </Button>
            <Button
              variant="contained"
              onClick={() => setProductId("625d3a6821c87548216f71e0")}
              style={{ marginLeft: "1rem" }}
            >
              Dijital Men?? V2
            </Button>
          </Grid>
          <h3>S??re</h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button variant="outlined" onClick={() => setPlanExpiry(30)}>
              1 Ay
            </Button>
            <Button variant="outlined" onClick={() => setPlanExpiry(90)}>
              3 Ay
            </Button>
            <Button variant="outlined" onClick={() => setPlanExpiry(180)}>
              6 Ay
            </Button>
            <Button variant="outlined" onClick={() => setPlanExpiry(360)}>
              12 Ay
            </Button>
          </div>
          <div>
            <h3>??zet</h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: "2rem",
              }}
            >
              <Input
                underlined
                label="Paket"
                disabled
                style={{ color: "black" }}
                initialValue={
                  productId === "6258375f9e1d43dfdd2eb688"
                    ? "Dijital Men?? V1"
                    : productId === "625d3a6821c87548216f71e0"
                    ? "Dijital Men?? V2"
                    : ""
                }
              />
              <Input
                underlined
                label="S??re"
                disabled
                style={{ color: "black" }}
                initialValue={
                  planExpiry === 30
                    ? "1 Ay"
                    : planExpiry === 90
                    ? "3 Ay"
                    : planExpiry === 180
                    ? "6 Ay"
                    : planExpiry === 360
                    ? "12 Ay"
                    : ""
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" onClick={handleCloseNew}>
            Vazge??
          </Button>
          <Button
            variant="contained"
            color="error"
            style={{ marginLeft: "1rem" }}
            onClick={(e) => {
              handleNewOrder(e);
              handleCloseNew();
            }}
          >
            Onayla
          </Button>
        </Modal.Footer>
      </Modal>
      <div className={styles.datatableTitle}>
        <h5 className={styles.title}>Sipari??ler</h5>
        <Button
          variant="outlined"
          onClick={() => {
            setOpenNew(true);
          }}
        >
          Sipari?? Ekle
        </Button>
      </div>
      <div className={styles.tableDiv}>
        <DataGrid
          rows={orders}
          columns={columns}
          getRowId={(row) => row._id}
          localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
          disableSelectionOnClick
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[20, 40, 60]}
          pagination
          className={styles.table}
        />
      </div>
    </div>
  );
};

export default OrderTable;
