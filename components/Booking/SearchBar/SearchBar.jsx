import React, { useState } from "react";
import Button from "@mui/material/Button";
import styles from "./SearchBar.module.css";
import Image from "next/image";
import BookingMocukup from "../../../assets/image/booking_mockup.png";
import SearchIcon from "@mui/icons-material/Search";
import { Input, Grid } from "@nextui-org/react";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const handleKey = (event) => {
    if (event.key === "Enter") {
      router.push(`/search/${search}`);
    }
  };
  const handleSearch = (event) => {
    if (search.trim()) {
      router.push(`/search/${search.trim()}`);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.app}>
        <div className={styles.search}>
          <h1 className={styles.header}>Masanızı Şimdiden Ayırtın!</h1>
          <div className={styles.wrapper}>
            <div className={styles.layout}>
              <Grid>
                <Input
                  underlined
                  onKeyDown={handleKey}
                  fullWidth
                  labelPlaceholder="Şehir veya Mekan Ara"
                  value={search}
                  style={{ position: "relative" }}
                  onChange={(e) => setSearch(e.target.value)}
                />{" "}
                <IconButton
                  sx={{ p: "10px" }}
                  aria-label="search"
                  className={styles.searchBtn}
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </IconButton>
              </Grid>
            </div>
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
