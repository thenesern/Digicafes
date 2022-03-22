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

const UserDashboard = () => {
  const [menu, setMenu] = useState();
  const products = [];
  const store = menu?.menu[0].storeName;
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [src, setSrc] = useState("");
  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const storeName = "demo";
      const { data } = await axios.get(`/api/qr/menus/${storeName}/`);
      setMenu(data);
      console.log(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchMenus();
  }, []);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  let isFirst = false;
  const isThereName = store;
  if (!isThereName) {
    isFirst = false;
  }
  console.log(menu);
  const [brandName, setBrandName] = useState("Aa");

  const submitNameHandler = async (e) => {
    e.preventDefault();
    const storeName = brandName
      ?.toLowerCase()
      .replace(brandName[0], brandName[0].toUpperCase());
    try {
      const { data } = await axios.post("/api/qr/menu", {
        storeName,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const submitProductsHandler = async (e) => {
    const storeName = "Aa";
    e.preventDefault();
    products.push({ name, price, description, category });
    console.log(typeof products);
    console.log(typeof storeName);
    try {
      const { data } = await axios.patch("/api/qr/menus/menu", {
        storeName,
        products,
      });
    } catch (err) {
      console.log(err);
    }
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
    <div className={styles.container}>
      <div>
        <h2 className={styles.header}>QR Menü Yönetim Paneli</h2>
        <form onSubmit={submitNameHandler}>
          <List className={styles.list}>
            <ListItem>
              <TextField
                variant="outlined"
                fullWidth
                disabled={isFirst ? false : true}
                id="brandName"
                value={store}
                onChange={(e) => setBrandName(e.target.value)}
                label={store ? "" : "Dükkan Adı"}
                helperText={
                  isFirst ? (
                    "İpucu: www.site.com/qr/dükkanadı"
                  ) : (
                    <Link
                      href="localhost:3000/qr/[storeName]"
                      as={`localhost:3000/qr/${store}`}
                    >
                      www.site.com/qr/{store}
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
                <Input accept="image/*" id="icon-button-file" type="file" />
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
  );
};

export default UserDashboard;
