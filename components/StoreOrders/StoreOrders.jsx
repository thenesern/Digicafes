import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import styles from "./StoreOrders.module.css";
import { trTR } from "@mui/x-data-grid";

const columns = [
  {
    field: "name",
    headerName: "Ürün Adı",
    flex: 1,
    renderCell: (params) => {
      return (
        <div className={styles.gridHeader}>
          <img src={params?.row?.img} className={styles.gridImage} />
          <p>{params?.row?.name}</p>
        </div>
      );
    },
  },
  {
    field: "quantity",
    headerName: "Miktar / Adet",
    flex: 1,
    editable: false,
  },
  {
    field: "price",
    headerName: "Birim Fiyat",
    flex: 1,
    editable: false,
    renderCell: (params) => {
      return <span>₺{params?.row?.price}</span>;
    },
  },
];

const StoreOrders = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.orders}>
        <div className={styles.grids}>
          {props.orders?.map((order) => (
            <DataGrid
              key={order?._id}
              rows={order?.cartItems}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row?._id}
              disableSelectionOnClick
              localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
            />
          ))}
          {props.orders?.map((order) => (
            <DataGrid
              key={order?._id}
              rows={order}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row?._id}
              disableSelectionOnClick
              localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreOrders;
