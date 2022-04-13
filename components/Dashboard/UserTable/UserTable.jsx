import styles from "./UserTable.module.css";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { AccountBox, Delete } from "@material-ui/icons";
import { useEffect } from "react";
import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { Store } from "../../../redux/store";
import { useContext } from "react";

const UserTable = (props) => {
  const [id, setId] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const { state } = useContext(Store);
  const { userInfo } = state;
  const handleDelete = async (id) => {
    if (!isAdmin) {
      try {
        await axios.delete(`/api/users/${id}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      width: 300,
    },
    {
      field: "firstName",
      headerName: "Ad",
      width: 200,
      renderCell: (params) => {
        return (
          <div className={styles.userListItem}>
            <img
              lazyOnload
              className={styles.userListImg}
              src={params.row.image}
              alt=""
            />
            {params.row.firstName}
          </div>
        );
      },
    },
    {
      field: "lastName",
      headerName: "Soyad",
      width: 200,
      renderCell: (params) => {
        return <div className={styles.userListItem}>{params.row.lastName}</div>;
      },
    },
    {
      field: "createdAt",
      headerName: "Kayıt Tarihi",
      width: 220,
      renderCell: (params) => {
        return (
          <div className={styles.userListItem}>{params.row.createdAt}</div>
        );
      },
    },
    {
      field: "signedIn",
      headerName: "Son Giriş",
      width: 220,
      renderCell: (params) => {
        return <div className={styles.userListItem}>{params.row.signedIn}</div>;
      },
    },
    {
      field: "email",
      headerName: "E-mail",
      width: 220,
    },

    {
      field: "action",
      headerName: "İşlem",
      width: 200,
      renderCell: (params) => {
        return (
          <div className={styles.actions}>
            <Link
              passHref
              href={`/admin/dashboard/users/${params.row._id}`}
              style={{ textDecoration: "none" }}
            >
              <button className={styles.viewButton}>
                <AccountBox className={styles.viewIcon} />
                Profil
              </button>
            </Link>
            <button
              className={styles.deleteButton}
              onClick={() => {
                setId(params.row._id);
                setFirstName(params.row.firstName);
                setLastName(params.row.lastName);
                setIsAdmin(params.row.isAdmin);
                setOpen(true);
              }}
            >
              <Delete className={styles.deleteIcon} />
            </button>
          </div>
        );
      },
    },
  ];
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const handleClose = () => setOpen(false);
  return (
    <div className={styles.datatable}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.box}>
          <div className={styles.modalHeader}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{ fontWeight: "600", color: "#001219" }}
            >
              Emin misiniz?
            </Typography>
          </div>
          <div className={styles.modalBody}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Kullanıcı, ({firstName} {lastName}) silinecek.
            </Typography>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.discard} onClick={handleClose}>
              Vazgeç
            </button>
            <button
              className={styles.delete}
              onClick={() => {
                handleDelete(id);
                handleClose();
              }}
            >
              Onayla
            </button>
          </div>
        </Box>
      </Modal>
      <div className={styles.datatableTitle}>Kullanıcılar</div>
      <DataGrid
        rows={props.users}
        columns={columns}
        getRowId={(row) => row._id}
        disableSelectionOnClick
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 20, 30]}
        pagination
      />
    </div>
  );
};

export default UserTable;
