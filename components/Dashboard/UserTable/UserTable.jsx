// Packages and Dependencies
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { Input, Modal } from "@nextui-org/react";
import { Grid } from "@material-ui/core";
// Context
import { Store } from "../../../redux/store";
import { useContext } from "react";
// Styles
import styles from "./UserTable.module.css";
// Icons
import { AccountBox, Delete } from "@material-ui/icons";

const UserTable = (props) => {
  const [users, setUsers] = useState(
    props.users.filter((user) => user.isAdmin === false)
  );
  const [id, setId] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setId("");
    setFirstName("");
    setLastName("");
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setId("");
    setFirstName("");
    setLastName("");
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 2,
    },
    {
      field: "firstName",
      headerName: "Ad",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className={styles.userListItem}>
            <img className={styles.userListImg} src={params.row.image} alt="" />
            {params.row.firstName}
          </div>
        );
      },
    },
    {
      field: "lastName",
      headerName: "Soyad",
      flex: 1,
      renderCell: (params) => {
        return <div className={styles.userListItem}>{params.row.lastName}</div>;
      },
    },
    {
      field: "createdAt",
      headerName: "Kayıt Tarihi",
      flex: 1.5,
      renderCell: (params) => {
        return (
          <div className={styles.userListItem}>{params.row.createdAt}</div>
        );
      },
    },
    {
      field: "signedIn",
      headerName: "Son Giriş",
      flex: 1.5,
      renderCell: (params) => {
        return <div className={styles.userListItem}>{params.row.signedIn}</div>;
      },
    },
    {
      field: "email",
      headerName: "E-mail",
      width: 200,
    },

    {
      field: "action",
      headerName: "İşlem",
      width: 180,
      renderCell: (params) => {
        return (
          <div className={styles.actions}>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => {
                setId(params.row._id);
                setFirstName(params.row.firstName);
                setLastName(params.row.lastName);
                setOpenUpdate(true);
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
                Düzenle
              </span>
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setId(params.row._id);
                setFirstName(params.row.firstName);
                setLastName(params.row.lastName);
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
            </Button>
          </div>
        );
      },
    },
  ];

  const handleDelete = async (id) => {
    try {
      const users = await axios.delete("/api/users/" + id, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      setUsers(users?.data?.users.filter((user) => user.isAdmin === false));
    } catch (err) {
      console.log(err);
    }
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    const users = await axios.patch(
      "/api/users/" + id + "/update",
      {
        firstName,
        lastName,
        id,
        sender: "admin",
      },
      {
        headers: { authorization: `Bearer ${userInfo.token}` },
      }
    );
    setUsers(users?.data?.users.filter((user) => user.isAdmin === false));
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
        <Modal.Body style={{ margin: " 6px 0" }}>
          <p>
            Kullanıcı ({firstName} {lastName}) silinecek.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" onClick={handleCloseDelete}>
            Vazgeç
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
        style={{ padding: "12px" }}
        open={openUpdate}
        onClose={handleCloseUpdate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Modal.Header>
          <h1>Kullanıcıyı Düzenle</h1>
        </Modal.Header>
        <Modal.Body
          style={{
            margin: " 12px 0",
          }}
        >
          <Grid
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyItems: "center",
              width: "100%",
              gap: "2rem",
            }}
          >
            <Input
              underlined
              label="Ad"
              initialValue={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              underlined
              label="Soyad"
              initialValue={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" onClick={handleCloseUpdate}>
            Vazgeç
          </Button>
          <Button
            variant="contained"
            color="error"
            style={{ marginLeft: "1rem" }}
            onClick={(e) => {
              updateHandler(e);
              handleCloseUpdate();
            }}
          >
            Onayla
          </Button>
        </Modal.Footer>
      </Modal>
      <div className={styles.tableDiv}>
        <span className={styles.datatableTitle}>Kullanıcılar</span>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row._id}
          className={styles.table}
          disableSelectionOnClick
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 30]}
          pagination
        />
      </div>
    </div>
  );
};

export default UserTable;
