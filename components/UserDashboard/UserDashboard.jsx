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
import Cookies from "js-cookie";
import CallMadeIcon from "@mui/icons-material/CallMade";

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
  const [storeNameSet, setStoreNameSet] = useState(false);
  const [categoriesFirst, setCategoriesFirst] = useState([]);
  const [addCategoryFirst, setAddCategoryFirst] = useState("");
  console.log(menu);
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

  const steps = (e) => {
    e.preventDefault();
    setStoreNameSet(true);
  };

  useEffect(() => {
    if (!menu) {
      setIsFirst(true);
    }
  }, []);
  let user;

  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }
  const firstTimeHandler = async (e) => {
    e.preventDefault();
    const createdAt = new Date().toLocaleString();
    try {
      const { data } = await axios.post("/api/qr/menu", {
        storeName: storeNameFirst,
        createdAt,
        owner: order[0].user._id,
        categories,
      });
      const orderProduct = await axios.patch(
        "/api/order/attachMenu",
        {
          orderId: order[0]._id,
          menuId: data.menu._id,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );

      setIsFirst(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    QRCode.toDataURL("localhost:3000/qr/vq/demo").then(setSrc);
  }, []);
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
  return (
    <>
      {isFirst && (
        <div className={styles.firstContainer}>
          <StyleRoot style={{ display: storeNameSet && "none" }}>
            <form className={styles.formFirst} style={animate.fadeInRightBig}>
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
                      onClick={steps}
                      color="primary"
                    >
                      Kaydet
                    </Button>
                  </ListItem>
                )}
              </List>
            </form>
          </StyleRoot>
          <StyleRoot style={{ display: !storeNameSet && "none" }}>
            <form className={styles.formFirst} style={animate.fadeInRightBig}>
              <h2 className={styles.headerFirst}>
                Lütfen Menü için Kategori Ekleyiniz
              </h2>
              <List className={styles.list}>
                <ListItem>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled={isFirst ? false : true}
                    id="brandName"
                    value={addCategoryFirst}
                    rules={{
                      required: true,
                      pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    }}
                    onChange={(e) => setAddCategoryFirst(e.target.value)}
                    label="Kategoriler"
                    helperText="Örnek: Ana Yemekler"
                  ></TextField>
                </ListItem>
                {isFirst && (
                  <ListItem>
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        categoriesFirst.push(addCategoryFirst);
                        setAddCategoryFirst("");
                      }}
                    >
                      Ekle
                    </Button>
                    <Button
                      variant="rwzr"
                      type="submit"
                      fullWidth
                      disabled={categoriesFirst.length > 0 ? false : true}
                      onClick={firstTimeHandler}
                    >
                      İlerle
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
              <div>
                <h5>QR Menü Kodu</h5>
                <Link href="/qr/v1/demo" passHref>
                  <img src={src} alt="" />
                </Link>
              </div>
              <div>
                <h6>Ürün Yönetimi</h6>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  onClick={firstTimeHandler}
                >
                  Ürün Ekle
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  onClick={firstTimeHandler}
                >
                  Kategori Ekle
                </Button>
              </div>
            </div>
            <div>
              <h3>Menü</h3>
              {isLoading ? (
                <p>Yükleniyor...</p>
              ) : (
                <div style={{ height: 500, width: "100%" }}>
                  <DataGrid
                    rows={menu?.products}
                    columns={columns}
                    pageSize={5}
                    getRowId={(product) => product._id}
                    rowsPerPageOptions={[5]}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserDashboard;
