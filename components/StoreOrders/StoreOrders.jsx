import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import classes from "./StoreOrders.module.css";
import { trTR } from "@mui/x-data-grid";

const StoreOrders = (props) => {
  const columns = [
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
                <div className={classes.orderDetails}>
                  <p>{i.name}</p>
                  <p>x</p>
                  <p>{i.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      field: "tableNum",
      headerName: "Masa No.",
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
              "& .MuiDataGrid-renderingZone": {
                maxHeight: "none !important",
              },
              "& .MuiDataGrid-cell": {
                lineHeight: "unset !important",
                maxHeight: "none !important",
                whiteSpace: "normal",
                wordWrap: "break-word",
              },
              "& .MuiDataGrid-row": {
                maxHeight: "none !important",
              },
              virtualScrollerContent: {
                height: "100% !important",
                overflow: "scroll",
              },
              height: 1,
              width: 1,
              "& .dark": {
                backgroundColor: "#1d3557",
                color: "#fbeee0",
              },
            }}
            pageSize={5}
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
