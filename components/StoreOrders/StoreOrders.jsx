// Packages and Dependencies
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { trTR, enUS } from "@mui/x-data-grid";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useRouter } from "next/router";
// Styles
import classes from "./StoreOrders.module.css";
// Mmoent
import moment from "moment";
// Translation
import useTranslation from "next-translate/useTranslation";

const StoreOrders = (props) => {
  const now = new Date();
  const router = useRouter();

  // Translation
  const { t } = useTranslation();
  const callColumns = [
    {
      field: "tableNum",
      headerName: t("panel:number"),
      headerClassName: "dark",
      flex: 1.5,
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
      headerName: t("panel:callTime"),
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
      headerName: t("panel:requestType"),
      headerClassName: "dark",
      flex: 3,
      editable: false,
      renderCell: (params) => {
        return (
          <div className={classes.gridDates}>
            <span>
              {params.row.callName === "Garson Çağrısı"
                ? router.locale === "en"
                  ? "Request for waiter"
                  : "Garson Çağrısı"
                : router.locale === "en"
                ? "Request for bill"
                : "Hesap İsteği"}
            </span>
          </div>
        );
      },
    },
  ];

  const columns = [
    {
      field: "name",
      headerName: t("panel:order1"),
      flex: 2,
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
      headerName: t("panel:note"),
      flex: 3,
      headerClassName: "dark",
    },
    {
      field: "tableNum",
      headerName: t("panel:number"),
      flex: 1,
      headerClassName: "dark",
      editable: false,
    },
    {
      field: "createdAt",
      headerClassName: "dark",
      hide: true,
      editable: false,
    },
    {
      field: "date",
      headerName: t("panel:orderTime"),
      flex: 2,
      headerClassName: "dark",
      editable: false,
      renderCell: (params) => {
        return (
          <span>{new Date(params.row.createdAt).toLocaleDateString()}</span>
        );
      },
      renderCell: (params) => {
        return (
          <div className={classes.gridDates}>
            <span>
              {new Date(params.row.createdAt).toLocaleString().split(" ")[0]}
            </span>
            <span>
              {new Date(params.row.createdAt).toLocaleString().split(" ")[1]}
            </span>

            {moment().diff(params.row.createdAt, "minutes") < 5 && (
              <AccessTimeIcon color="error" />
            )}
          </div>
        );
      },
    },
    {
      field: "price",
      headerName: t("panel:total"),
      flex: 1,
      headerClassName: "dark",
      editable: false,
      renderCell: (params) => {
        return (
          <span>
            <span>
              {props?.currency === "dolar"
                ? "$"
                : props?.currency === "euro"
                ? "€"
                : props?.currency === "lira"
                ? "₺"
                : ""}
            </span>
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
                overflow: "auto",
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
            localeText={
              router.locale === "tr"
                ? trTR.components.MuiDataGrid.defaultProps.localeText
                : enUS.components.MuiDataGrid.defaultProps.localeText
            }
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
            localeText={
              router.locale === "tr"
                ? trTR.components.MuiDataGrid.defaultProps.localeText
                : enUS.components.MuiDataGrid.defaultProps.localeText
            }
          />
        </div>
      </div>
    </div>
  );
};

export default StoreOrders;
