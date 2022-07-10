import { IconButton, styled, TextField } from "@material-ui/core";
import React from "react";
import Button from "@mui/material/Button";
import styles from "./SearchBar.module.css";
import Image from "next/image";
import BookingMocukup from "../../../assets/image/booking_mockup.png";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";

const SearchBar = () => {
  const CssTextField = styled(TextField)({
    backgroundColor: "white",
    color: "black",
    minWidth: "100%",
    borderColor: "black",
    margin: "0",
    "& label.Mui-focused": {
      color: "gray",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#eee",
    },

    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#eee",
      },
      "&:hover fieldset": {
        borderColor: "#eee",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fff",
      },
    },
  });
  return (
    <div className={styles.container}>
      <div className={styles.app}>
        <div className={styles.search}>
          <h1 className={styles.header}>Masanızı Şimdiden Ayırtın!</h1>
          <div className={styles.wrapper}>
            <div className={styles.layout}>
              <CssTextField
                id="outlined-basic"
                label="Şehir veya Mekan Ara"
                variant="outlined"
                color="primary"
                className={styles.input}
              />
            </div>
            <IconButton
              sx={{ p: "10px" }}
              aria-label="search"
              className={styles.searchBtn}
            >
              <SearchIcon />
            </IconButton>
          </div>
          <p className={styles.desc}>
            Nerede ne zaman yer var hemen öğrenin, rezervasyonunuzu anında
            yapın.
          </p>
        </div>
        <div className={styles.mockup}>
          <Image src={BookingMocukup} alt="Booking" width="500" height="500" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
