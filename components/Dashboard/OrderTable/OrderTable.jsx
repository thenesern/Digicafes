import styles from "./OrderTable.module.css";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { AccountBox, Delete } from "@material-ui/icons";
import { useEffect } from "react";
import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { Store } from "../../../redux/store";
import { useContext } from "react";

const OrderTable = (props) => {
  const [id, setId] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const { state } = useContext(Store);
  const { userInfo } = state;

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
  ];
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const handleClose = () => setOpen(false);
  return (
    <div className={styles.datatable}>
      <div className={styles.datatableTitle}>Siparişler</div>
      <DataGrid
        rows={props.orders}
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

export default OrderTable;
