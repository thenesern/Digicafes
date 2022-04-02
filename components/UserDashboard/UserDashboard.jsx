import {
  Button,
  IconButton,
  Input,
  Link,
  List,
  ListItem,
  TextField,
} from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./UserDashboard.module.css";
import { DataGrid } from "@mui/x-data-grid";
import Image from "next/image";
import QRCode from "qrcode";
import { fadeInRightBig } from "react-animations";
import Radium, { StyleRoot } from "radium";

const UserDashboard = ({ order }) => {
  const [menu, setMenu] = useState(order[0].menuv1);
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [src, setSrc] = useState("");
  const [isFirst, setIsFirst] = useState(false);
  const [storeNameFirst, setStoreNameFirst] = useState("");
  const animate = {
    fadeInRightBig: {
      animation: "x 2s",
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
    },
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!menu) {
      setIsFirst(true);
    }
  }, []);

  const submitNameHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/qr/menu", {
        storeName,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const submitProductsHandler = async (e) => {
    e.preventDefault();
    /*  const storeName = "Aa";
    products.push({ name, price, description, category });
    try {
      const { data } = await axios.patch("/api/qr/menus/menu", {
        storeName,
        products,
      });
    } catch (err) {
      console.log(err);
    }*/
  };
  const categories = [
    ...new Set(menu?.menu[0].products.map((product) => product.category)),
  ];
  const columns = [
    { field: "_id", headerName: "Ürün Kodu", width: 300 },
    {
      field: "name",
      headerName: "Ürün",
      width: 300,
      renderCell: (params) => {
        return (
          <div className={styles.product}>
            <img src={params?.row.image} alt="" className={styles.image} />
            <p>{params?.row.name}</p>
          </div>
        );
      },
    },
    { field: "price", headerName: "Ürün Fiyatı", width: 200 },
    { field: "description", headerName: "Ürün Açıklaması", width: 200 },
    { field: "category", headerName: "Ürün Kategorisi", width: 200 },
  ];
  useEffect(() => {
    QRCode.toDataURL("localhost:3000/qr/vq/demo").then(setSrc);
  }, []);

  return (
    <>
      {isFirst && (
        <div className={styles.firstContainer}>
          <StyleRoot>
            <form
              className={styles.formFirst}
              onSubmit={submitNameHandler}
              style={animate.fadeInRightBig}
            >
              <h2 className={styles.headerFirst}>
                Lütfen İş Yerinizin Adını Giriniz
              </h2>
              <List className={styles.list}>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={isFirst ? false : true}
                    id="brandName"
                    value={menu?.menuv1?.storeName}
                    rules={{
                      required: true,
                      pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    }}
                    onChange={(e) => setStoreNameFirst(e.target.value)}
                    label={menu?.menuv1?.storeName ? "" : "Dükkan Adı"}
                    helperText={
                      isFirst ? (
                        storeNameFirst ? (
                          `İpucu: www.site.com/qr/${storeNameFirst}`
                        ) : (
                          "İpucu: www.site.com/qr/dükkanadı"
                        )
                      ) : (
                        <Link
                          href="localhost:3000/qr/[storeName]"
                          as={`localhost:3000/qr/${menu?.menuv1?.storeName}`}
                        >
                          www.site.com/qr/
                          {menu?.menuv1?.storeName || storeNameFirst}
                        </Link>
                      )
                    }
                  ></TextField>
                </ListItem>
                {isFirst && (
                  <ListItem>
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      color="primary"
                      onSubmit={submitNameHandler}
                    >
                      Kaydet
                    </Button>
                  </ListItem>
                )}
              </List>
            </form>
          </StyleRoot>
        </div>
      )}
      {!isFirst && (
        <>
          <div className={styles.container}>
            <div>
              <h2 className={styles.header}>Dijital Menü Yönetim Paneli</h2>

              <form onSubmit={submitNameHandler}>
                <List className={styles.list}>
                  <ListItem>
                    <TextField
                      variant="outlined"
                      fullWidth
                      disabled={isFirst ? false : true}
                      id="brandName"
                      value={menu?.menuv1?.storeName}
                      onChange={(e) => setBrandName(e.target.value)}
                      label={menu?.menuv1?.storeName ? "" : "Dükkan Adı"}
                      helperText={
                        isFirst ? (
                          "İpucu: www.site.com/qr/dükkanadı"
                        ) : (
                          <Link
                            href="localhost:3000/qr/[storeName]"
                            as={`localhost:3000/qr/${menu?.menuv1?.storeName}`}
                          >
                            www.site.com/qr/{menu?.menuv1?.storeName}
                          </Link>
                        )
                      }
                    ></TextField>
                  </ListItem>
                  {isFirst && (
                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                        onSubmit={submitNameHandler}
                      >
                        Kaydet
                      </Button>
                    </ListItem>
                  )}
                </List>
              </form>

              <form onSubmit={submitProductsHandler}>
                <List className={styles.list}>
                  <h3 className={styles.header}>Ürün Ekle</h3>
                  <ListItem>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="category"
                      label="Kategori"
                      inputProps={{ type: "text" }}
                      onChange={(e) => setCategory(e.target.value)}
                      helperText="İpucu: Ana Yemek, Kahvaltılar, Tatlılar"
                    ></TextField>
                  </ListItem>
                  <ListItem>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="name"
                      onChange={(e) => setName(e.target.value)}
                      label="Ürün Adı"
                      inputProps={{ type: "text" }}
                      helperText="İpucu: Izgara Köfte, Kaşarlı Tost, Sufle"
                    ></TextField>
                  </ListItem>
                  <ListItem>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="description"
                      label="Ürün Açıklaması"
                      onChange={(e) => setDescription(e.target.value)}
                      inputProps={{ type: "text" }}
                      helperText="İpucu: 200GR Köfte; Patates kızartması, közlenmiş biber, soğan, domates, baharatlar, turşu ile"
                    ></TextField>
                  </ListItem>
                  <ListItem>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="price"
                      onChange={(e) => setPrice(e.target.value)}
                      label="Fiyat"
                      inputProps={{ type: "number" }}
                      helperText="İpucu: 50"
                    ></TextField>
                  </ListItem>
                  <ListItem>
                    <label htmlFor="icon-button-file">
                      <Input
                        accept="image/*"
                        id="icon-button-file"
                        type="file"
                      />
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </ListItem>
                  <ListItem>
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      color="primary"
                      onSubmit={submitProductsHandler}
                    >
                      Ekle
                    </Button>
                  </ListItem>
                </List>
              </form>
            </div>
            <div>
              <div>
                <h6>QR Menü Kodu</h6>
                <Link href="/qr/v1/demo" passHref>
                  <img src={src} alt="" />
                </Link>
              </div>
              <div>
                <h3>Menü</h3>
                {isLoading ? (
                  <p>Yükleniyor...</p>
                ) : (
                  <div style={{ height: 500, width: "100%" }}>
                    <DataGrid
                      rows={menu?.menu[0].products}
                      columns={columns}
                      pageSize={5}
                      getRowId={(product) => product._id}
                      rowsPerPageOptions={[5]}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserDashboard;
