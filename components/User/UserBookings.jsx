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

const UserBookings = ({ bookings }) => {
  // Translation
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rezervasyon Numarası</TableCell>
            <TableCell>Kaç Kişilik</TableCell>
            <TableCell>Rezervasyon Tarihi</TableCell>
            <TableCell>Oluşturulma Tarihi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings?.map((row) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{row._id}</TableCell>
              <TableCell>{row.people}</TableCell>
              <TableCell>{new Date(row.date).toLocaleString()}</TableCell>
              <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserBookings;
