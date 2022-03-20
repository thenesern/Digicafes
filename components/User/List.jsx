import React from "react";
import styles from "./List.module.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const List = () => {
  const rows = [
    {
      id: 1143155,
      product: "QR Menü",
      customer: "John Smith",
      date: "1 Mart",
      method: "Ziraat Bankkart",
      status: "Teslim Edilecek",
    },
  ];
  return (
    <TableContainer component={Paper} className={styles.table}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={styles.tableCell}>Takip Kodu</TableCell>
            <TableCell className={styles.tableCell}>Hizmet</TableCell>
            <TableCell className={styles.tableCell}>Kullanıcı</TableCell>
            <TableCell className={styles.tableCell}>Tarih</TableCell>
            <TableCell className={styles.tableCell}>Ödeme Yöntemi</TableCell>
            <TableCell className={styles.tableCell}>Durum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className={styles.tableCell}>{row.id}</TableCell>
              <TableCell className={styles.tableCell}>
                <div className={styles.cellWrapper}>{row.product}</div>
              </TableCell>
              <TableCell className={styles.tableCell}>{row.customer}</TableCell>
              <TableCell className={styles.tableCell}>{row.date}</TableCell>
              <TableCell className={styles.tableCell}>{row.method}</TableCell>
              <TableCell className={styles.tableCell}>
                <span>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
