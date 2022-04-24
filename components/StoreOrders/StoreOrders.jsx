import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import styles from "./StoreOrders.module.css";
import { trTR } from "@mui/x-data-grid";

const columns = [
  {
    field: "_id",
    headerName: "Ürün Kodu",
    flex: 1,
  },
  {
    field: "name",
    headerName: "Sipariş",
    flex: 1,
    renderCell: (params) => {
      return (
        <div className={styles.gridHeader}>
          {params.row.cartItems.map((i) => (
            <div key={Math.random()} className={styles.gridOrders}>
              <p>{i.name}</p>
              <p>x</p>
              <p>{i.quantity}</p>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    field: "tableNum",
    headerName: "Masa Numarası",
    flex: 1,
    editable: false,
  },
  {
    field: "price",
    headerName: "Toplam Tutar",
    flex: 1,
    editable: false,
    renderCell: (params) => {
      return (
        <span>₺{params?.row?.cartItems.map((a) => a.quantity * a.price)}</span>
      );
    },
  },
];

const StoreOrders = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.orders}>
        <div className={styles.grids}>
          <DataGrid
            rows={props.orders}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row?._id}
            disableSelectionOnClick
            localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
          />
        </div>
      </div>
    </div>
  );
};

export default StoreOrders;
