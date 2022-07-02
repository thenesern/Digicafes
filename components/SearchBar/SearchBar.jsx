import { styled, TextField } from "@material-ui/core";
import React from "react";
import Button from "@mui/material/Button";
import styles from "./SearchBar.module.css";

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
        <div>
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
      </div>
    </div>
  );
};

export default SearchBar;
