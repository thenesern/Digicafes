// Packages and Dependencies
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { trTR } from "@mui/x-data-grid";
// Styles
import classes from "./StoreOrders.module.css";

const StoreOrders = (props) => {
  const callColumns = [
    {
      field: "tableNum",
      headerName: "Masa No.",
      headerClassName: "dark",
      flex: 2,
      editable: false,
    },
    {
      field: "createdAt",
      headerClassName: "dark",
      hide: true,
      editable: false,
      renderCell: (params) => {
        return (
          <span>{new Date(params.row.createdAt).toLocaleDateString()}</span>
        );
      },
    },
    {
      field: "date",
      headerName: "Çağrı Zamanı",
      flex: 3,
      headerClassName: "dark",
      editable: false,
      renderCell: (params) => {
        return (
          <div className={classes.gridDates}>
            <span>
              {new Date(params.row.createdAt).toLocaleString().split(" ")[0]}
            </span>
            <span>
              {new Date(params.row.createdAt).toLocaleString().split(" ")[1]}
            </span>
          </div>
        );
      },
    },
    {
      field: "callName",
      headerName: "Çağrı Türü",
      headerClassName: "dark",
      flex: 3,
      editable: false,
    },
  ];

  const columns = [
    {
      field: "name",
      headerName: "Sipariş",
      flex: 3,
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
      field: "orderNotes",
      headerName: "Not",
      flex: 3,
      headerClassName: "dark",
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
      headerClassName: "dark",
      hide: true,
      editable: false,
      renderCell: (params) => {
        return (
          <span>{new Date(params.row.createdAt).toLocaleDateString()}</span>
        );
      },
    },
    {
      field: "date",
      headerName: "Sipariş Zamanı",
      flex: 2,
      headerClassName: "dark",
      editable: false,
      renderCell: (params) => {
        return (
          <div className={classes.gridDates}>
            <span>
              {new Date(params.row.createdAt).toLocaleString().split(" ")[0]}
            </span>
            <span>
              {new Date(params.row.createdAt).toLocaleString().split(" ")[1]}
            </span>
          </div>
        );
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
            rowHeight={50}
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
                backgroundColor: "#264653",
                color: "#fbeee0",
              },
            }}
            pageSize={13}
            rowsPerPageOptions={[10, 15, 20]}
            getRowId={(row) => row?._id}
            disableSelectionOnClick
            localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
          />
          <DataGrid
            rows={props.calls}
            columns={callColumns}
            className={classes.grid}
            initialState={{
              sorting: {
                sortModel: [{ field: "createdAt", sort: "desc" }],
              },
            }}
            rowHeight={36}
            sx={{
              height: 1,
              width: 1,
              "& .dark": {
                backgroundColor: "#264653",
                color: "#fbeee0",
              },
            }}
            pageSize={18}
            rowsPerPageOptions={[3]}
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
