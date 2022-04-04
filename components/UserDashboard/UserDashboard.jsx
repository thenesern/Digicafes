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
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const UserDashboard = ({ order }) => {
  const theme = useTheme();
  const [menu, setMenu] = useState(order[0]?.menuv1 || "");
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [src, setSrc] = useState("");
  const [isFirst, setIsFirst] = useState(false);
  const [storeNameFirst, setStoreNameFirst] = useState("");
  const [storeNameSet, setStoreNameSet] = useState(false);
  const [addCategory, setAddCategory] = useState("");
  const [products, setProducts] = useState([...(menu?.products || "")]);
  const [categories, setCategories] = useState([
    ...(menu?.categories?.map((c) => c?.name) || ""),
  ]);
  const [categoriesRaw, setCategoriesRaw] = useState([...menu?.categories]);
  const animate = {
    fadeInRightBig: {
      animation: "x 2s",
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
    },
  };

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const handleOpenAddProduct = () => setOpenAddProduct(true);
  const handleCloseAddProduct = () => setOpenAddProduct(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const handleOpenAddCategory = () => setOpenAddCategory(true);
  const handleCloseAddCategory = () => setOpenAddCategory(false);
  const [category, setCategory] = useState([]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategory(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  console.log(category);
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
        owner: order[0]?.user?._id,
        categories,
      });
      const orderProduct = await axios.patch(
        "/api/order/attachMenu",
        {
          orderId: order[0]?._id,
          menuId: data?.menu?._id,
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
  console.log(categories);
  const addProductHandler = async (e) => {
    e.preventDefault();
    products.push({ name, price, description, category });
    try {
      await axios.patch(`/api/qr/menus/${menu?.storeName}`, {
        storeName: menu?.storeName,
        products,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const addCategoryHandler = async (e) => {
    e.preventDefault();
    categoriesRaw.push({ name: addCategory });
    try {
      await axios.patch(`/api/qr/menus/${menu?.storeName}/categories`, {
        storeName: menu?.storeName,
        categories: categoriesRaw,
      });
    } catch (err) {
      console.log(err);
    }
  };
  console.log(categoriesRaw);
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
                          `Örnek: www.site.com/qr/${storeNameFirst}`
                        ) : (
                          "Örnek: www.site.com/qr/dükkanadı"
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
                    value={addCategory}
                    rules={{
                      required: true,
                      pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    }}
                    onChange={(e) => setAddCategory(e.target.value)}
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
                        categories.push({ name: addCategory });
                        setAddCategory("");
                      }}
                    >
                      Ekle
                    </Button>
                    <Button
                      variant="rwzr"
                      type="submit"
                      fullWidth
                      disabled={categories.length > 0 ? false : true}
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
                  onClick={handleOpenAddProduct}
                  style={{ margin: "1rem", width: "16rem" }}
                >
                  Ürün Ekle
                </Button>
                <Modal
                  open={openAddProduct}
                  onClose={handleCloseAddProduct}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className={styles.box}>
                    <form>
                      <List className={styles.list}>
                        <h3 className={styles.header}>Ürün Ekle</h3>
                        <FormControl
                          style={{ margin: "1rem" }}
                          sx={{ m: 1, width: "50%" }}
                        >
                          <InputLabel id="demo-multiple-chip-label">
                            Kategori
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={category}
                            onChange={handleChange}
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                label="Kategori"
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {categories.map((name) => (
                              <MenuItem
                                key={name}
                                value={name}
                                style={{
                                  padding: "10px",
                                  width: "100%",
                                }}
                              >
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <ListItem>
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            onChange={(e) => setName(e.target.value)}
                            label="Ürün Adı"
                            inputProps={{ type: "text" }}
                            helperText="Örnek: Izgara Köfte, Kaşarlı Tost, Sufle"
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
                            helperText="Örnek: 200GR Köfte; Patates kızartması, közlenmiş biber, soğan, domates, baharatlar, turşu ile"
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
                            helperText="Örnek: 50"
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
                            onClick={addProductHandler}
                            color="primary"
                          >
                            Ekle
                          </Button>
                        </ListItem>
                      </List>
                    </form>
                  </Box>
                </Modal>
                <Modal
                  open={openAddCategory}
                  onClose={handleCloseAddCategory}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className={styles.box}>
                    <form>
                      <List className={styles.list}>
                        <h3 className={styles.header}>Kategori Ekle</h3>
                        <ListItem>
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="category"
                            label="Kategori"
                            inputProps={{ type: "text" }}
                            onChange={(e) => setAddCategory(e.target.value)}
                            helperText="Örnek: Ana Yemek, Kahvaltılar, Tatlılar"
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
                            onClick={addCategoryHandler}
                            color="primary"
                          >
                            Ekle
                          </Button>
                        </ListItem>
                      </List>
                    </form>
                  </Box>
                </Modal>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={handleOpenAddCategory}
                  style={{ margin: "1rem", width: "16rem" }}
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
                    getRowId={(product) => product?._id}
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
