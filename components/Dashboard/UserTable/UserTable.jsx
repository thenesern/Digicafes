import styles from "./UserTable.module.css";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { AccountBox, Delete } from "@material-ui/icons";
import { useEffect } from "react";
/* import { deleteUser, getUsers } from "../../../redux/apiCalls"; */
import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";

const UserTable = (props) => {
  const [id, setId] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleDelete = (id) => {
    if (!isAdmin) {
      deleteUser(id, dispatch);
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
            <img className={styles.userListImg} src={params.row.image} alt="" />
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
      width: 200,
      renderCell: (params) => {
        return <div className={styles.userListItem}>{params.row.signedIn}</div>;
      },
    },
    {
      field: "signedIn",
      headerName: "Son Giriş",
      width: 200,
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
      width: 200,
      renderCell: (params) => {
        return (
          <div className={styles.actions}>
            <Link
              passHref
              href={`/dashboard/users/${params.row._id}`}
              style={{ textDecoration: "none" }}
            >
              <button className={styles.viewButton}>
                <AccountBox className={styles.viewIcon} />
                View
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
              Are you sure?
            </Typography>
          </div>
          <div className={styles.modalBody}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              The user ({firstName} {lastName}) will be deleted.
            </Typography>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.discard} onClick={handleClose}>
              Discard
            </button>
            <button
              className={styles.delete}
              onClick={() => {
                handleDelete(id);
                handleClose();
              }}
            >
              DELETE
            </button>
          </div>
        </Box>
      </Modal>
      <div className={styles.datatableTitle}>User List</div>
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
