// Packages and Dependencies
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// Translation
import useTranslation from "next-translate/useTranslation";
// Styles
import styles from "./List.module.css";

const List = ({ orders }) => {
  // Translation
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{t("account:orderNumber")}</TableCell>
            <TableCell>{t("account:service")}</TableCell>
            <TableCell>{t("account:start")}</TableCell>
            <TableCell>{t("account:end")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((row) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{row._id}</TableCell>
              <TableCell>
                {row.product.name.includes("V1")
                  ? t("account:v1")
                  : t("account:v2")}
              </TableCell>
              <TableCell>
                {new Date(
                  new Date(row.createdAt?.toString()).getTime()
                )?.toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(
                  new Date(row.expiry?.toString()).getTime()
                )?.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
