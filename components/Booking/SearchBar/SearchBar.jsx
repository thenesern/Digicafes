import { styled, TextField } from "@material-ui/core";
import React from "react";
import Button from "@mui/material/Button";
import styles from "./SearchBar.module.css";
import Image from "next/image";
import BookingMocukup from "../../../assets/image/booking_mockup.png";

const SearchBar = () => {
  const CssTextField = styled(TextField)({
    backgroundColor: "white",
    color: "black",
    borderColor: "black",
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
            <CssTextField
              id="outlined-basic"
              label="Şehir Seçiniz"
              variant="outlined"
              className={styles.input}
            />
            <Button variant="contained" className={styles.button}>
              Listele
            </Button>
          </div>
        </div>
        <div className={styles.mockup}>
          <Image src={BookingMocukup} alt="Booking" width="500" height="500" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
