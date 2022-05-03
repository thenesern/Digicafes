// Packages and Dependencies
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// Styles
import styles from "./List.module.css";

const List = ({ orders }) => {
  const [orderList, setOrderList] = useState(
    orders?.filter(
      (order) => order?.quantity.length !== 1 && order?.quantity[0] !== 14
    )
  );
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Sipariş Numarası</TableCell>
            <TableCell>Hizmet</TableCell>
            <TableCell>Tarih</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderList?.map((row) => (
            <TableRow
              key={row._id}
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
