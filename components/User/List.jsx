import React from "react";
import styles from "./List.module.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";

function createData(_id, name, createdAt) {
  return { _id, name, createdAt };
}

const List = ({ orders }) => {
  const rows = [createData("_id", "name", "createdAt")];
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Sipariş Numarası</TableCell>
            <TableCell>Hizmet</TableCell>
            <TableCell>Tarih</TableCell>
            <TableCell>Ödeme Yöntemi</TableCell>
            <TableCell>Ödeme Tutarı</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{row._id}</TableCell>
              <TableCell>{row.product.name}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
