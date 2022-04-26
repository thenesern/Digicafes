import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import classes from "./StoreOrders.module.css";
import { trTR } from "@mui/x-data-grid";

const StoreOrders = (props) => {
  const columns = [
    {
      field: "_id",
      headerName: "Ürün Kodu",
      flex: 1,
      headerClassName: "dark",
    },
    {
      field: "name",
      headerName: "Sipariş",
      flex: 1,
      headerClassName: "dark",
      renderCell: (params) => {
        return (
          <div className={classes.gridHeader}>
            {params.row.cartItems.map((i) => (
              <div key={Math.random()} className={classes.gridOrders}>
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
      headerClassName: "dark",
      editable: false,
    },
    {
      field: "createdAt",
      headerName: "Sipariş Zamanı",
      flex: 1,
      headerClassName: "dark",
      editable: false,
      renderCell: (params) => {
        return <span>{params.row.createdAt}</span>;
      },
    },
    {
      field: "price",
      headerName: "Toplam Tutar",
      flex: 1,
      headerClassName: "dark",
      editable: false,
      renderCell: (params) => {
        return (
          <span>
            <span>₺</span>
            {params?.row?.cartItems.reduce(function (a, b) {
              return a + b.price * b.quantity;
            }, 0)}
          </span>
        );
      },
    },
  ];

  return (
    <div className={classes.container}>
      <div className={classes.orders}>
        <div className={classes.grids}>
          <DataGrid
            rows={props.orders}
            columns={columns}
            className={classes.grid}
            initialState={{
              sorting: {
                sortModel: [{ field: "createdAt", sort: "desc" }],
              },
            }}
            rowHeight={100}
            sx={{
              height: 720,
              width: 1,
              "& .dark": {
                backgroundColor: "#1d3557",
                color: "#fbeee0",
              },
            }}
            pageSize={6}
            rowsPerPageOptions={[10, 15, 20]}
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
