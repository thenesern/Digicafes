import {
  Button,
  IconButton,
  Input,
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
import { DataGrid, trTR } from "@mui/x-data-grid";
import Image from "next/image";
import QRCode from "qrcode";
import { fadeInRightBig } from "react-animations";
import Radium, { StyleRoot } from "radium";
import Cookies from "js-cookie";
import CallMadeIcon from "@mui/icons-material/CallMade";
import Box from "@mui/material/Box";
import { Loading, Modal, Spacer } from "@nextui-org/react";
import ModalMui from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";

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
  const [file, setFile] = useState(null);
  const theme = useTheme();
  const [menu, setMenu] = useState(order[0]?.menuv1 || "");
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [src, setSrc] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingForFirst, setIsFetchingForFirst] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const [storeName, setStoreName] = useState(menu?.storeName || "");
  const [addCategory, setAddCategory] = useState("");
  const [products, setProducts] = useState([...(menu?.products || "")]);
  const arrayProducts = Array.from(products);
  const [deleteId, setDeleteId] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [categoryNames, setCategoryNames] = useState([
    ...(menu?.categories?.map((c) => c?.name) || ""),
  ]);
  const [categories, setCategories] = useState([...(menu?.categories || "")]);
  const arrayCategories = Array.from(categories);
  const animate = {
    fadeInRightBig: {
      animation: "x 2s",
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
    },
  };
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const handleOpenAddProduct = () => setOpenAddProduct(true);
  const handleCloseAddProduct = () => setOpenAddProduct(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteCategory(false);
    setDeleteId("");
  };
  const [openDeleteProduct, setOpenDelete] = useState(false);
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
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!menu) {
      setIsFirst(true);
    }
  }, [menu]);
  let user;

  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }
  const firstTimeHandler = async (e) => {
    e.preventDefault();
    const createdAt = new Date().toLocaleString("tr-TR");
    try {
      setIsFetchingForFirst(true);
      const { data } = await axios.post("/api/qr/menu", {
        storeName: storeName,
        createdAt,
        owner: order[0]?.user?._id,
      });
      await axios.patch(
        "/api/order/attachMenu",
        {
          orderId: order[0]?._id,
          menuId: data?.menu?._id,
        },
        {
          headers: { authorization: `Bearer ${user?.token}` },
        }
      );
      setIsFirst(false);
      setIsFetchingForFirst(false);
    } catch (err) {
      console.log(err);
      setIsFetchingForFirst(false);
    }
  };
  const addProductHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploads");
    try {
      setIsFetching(true);
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
        data
      );
      arrayProducts.push({
        name,
        price,
        description,
        category,
        image: uploadRes?.data.url,
      });
      const updatedMenu = await axios.patch(
        `/api/qr/menus/${menu?.storeName}`,
        {
          storeName: menu?.storeName,
          products: arrayProducts,
        }
      );
      setMenu(updatedMenu?.data?.menu);
      setProducts(updatedMenu?.data?.menu?.products);
      handleCloseAddProduct();
      setIsFetching(false);
    } catch (err) {
      console.log(err);
      setIsFetching(false);
    }
  };
  const deleteProductHandler = async () => {
    setIsFetching(true);

    try {
      setProducts(arrayProducts.filter((product) => product._id !== deleteId));
      const newProducts = arrayProducts.filter(
        (product) => product._id !== deleteId
      );
      await axios.patch(`/api/qr/menus/${menu?.storeName}`, {
        storeName: menu?.storeName,
        products: newProducts,
      });
      setIsFetching(false);
    } catch (err) {
      console.log(err);
      setIsFetching(false);
    }
    setIsFetching(false);
  };
  const deleteCategoryHandler = async () => {
    setIsFetching(true);
    try {
      setCategories(
        arrayCategories.filter((category) => category._id !== deleteId)
      );
      const newCategories = arrayCategories.filter(
        (category) => category._id !== deleteId
      );
      await axios.patch(`/api/qr/menus/${menu?.storeName}/categories`, {
        storeName: menu?.storeName,
        categories: newCategories,
      });
      setIsFetching(false);
    } catch (err) {
      console.log(err);
      setIsFetching(false);
    }
    setIsFetching(false);
  };

  const addCategoryHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploads");
    try {
      setIsFetching(true);
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
        data
      );
      arrayCategories.push({ name: addCategory, image: uploadRes?.data?.url });
      categoryNames.push(addCategory);
      const updatedMenu = await axios.patch(
        `/api/qr/menus/${menu?.storeName}/categories`,
        {
          storeName,
          categories: arrayCategories,
        }
      );
      setCategories(updatedMenu?.data?.menu?.categories);
      handleCloseAddCategory();
      setIsFetching(false);
    } catch (err) {
      console.log(err);
      setIsFetching(false);
    }
  };
  useEffect(() => {
    var opts = {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 1,
      margin: 1,
    };
    QRCode.toDataURL(
      `https://www.project-thenesern.vercel.app.com/qr/v1/${menu?.storeName}`,
      opts
    ).then(setSrc);
  }, [menu]);

  const columns = [
    { field: "_id", headerName: "Ürün Kodu", flex: 1.3 },
    {
      field: "name",
      headerName: "Ürün",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className={styles.product}>
            <img src={params?.row.image} alt="" className={styles.image} />
            <p>{params?.row.name}</p>
          </div>
        );
      },
    },
    { field: "price", headerName: "Ürün Fiyatı", flex: 1 },
    { field: "description", headerName: "Ürün Açıklaması", flex: 1 },
    { field: "category", headerName: "Ürün Kategorisi", flex: 1 },
    {
      field: "actions",
      headerName: "Yönetim",
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => {
                handleOpenDelete();
                setDeleteId(params?.row._id);
                setDeleteName(params?.row.name);
              }}
              variant="outlined"
              startIcon={<DeleteIcon color="error" />}
            >
              Sil
            </Button>
          </Stack>
        );
      },
    },
  ];
  const categoryColumns = [
    { field: "_id", headerName: "Kategori Kodu", flex: 1 },
    {
      field: "name",
      headerName: "Kategori",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className={styles.product}>
            <img src={params?.row.image} alt="" className={styles.image} />
            <p>{params?.row.name}</p>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Yönetim",
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => {
                handleOpenDelete();
                setDeleteId(params?.row._id);
                setDeleteName(params?.row.name);
                setDeleteCategory(true);
              }}
              variant="outlined"
              startIcon={<DeleteIcon color="error" />}
            >
              Sil
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <>
      {isFirst && (
        <div className={styles.firstContainer}>
          <Modal
            style={{
              background: "transparent",
              boxShadow: "none",
            }}
            preventClose
            aria-labelledby="modal-title"
            open={isFetchingForFirst}
          >
            <Loading color="white" size="xl" />
            <Spacer />
          </Modal>
          <StyleRoot>
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
                    onChange={(e) => setStoreName(e.target.value)}
                    label={menu?.menuv1?.storeName ? "" : "Dükkan Adı"}
                    helperText={
                      isFirst ? (
                        storeName ? (
                          `Örnek: www.site.com/qr/${storeName}`
                        ) : (
                          "Örnek: www.site.com/qr/dükkanadı"
                        )
                      ) : (
                        <Link
                          href="localhost:3000/qr/[storeName]"
                          as={`localhost:3000/qr/${menu?.menuv1?.storeName}`}
                        >
                          www.site.com/qr/
                          {menu?.menuv1?.storeName || storeName}
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
                      onClick={firstTimeHandler}
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
        <div className={styles.container}>
          <Modal
            style={{
              background: "transparent",
              boxShadow: "none",
            }}
            preventClose
            aria-labelledby="modal-title"
            open={isFetching}
          >
            <Loading color="white" size="xl" />
            <Spacer />
          </Modal>
          <div className={styles.box}>
            <div className={styles.left}>
              <div>
                <h3 className={styles.titles}>QR Menü Kodu</h3>
                <>
                  <img src={src} alt="QR" className={styles.qrImg} />
                  <div>
                    <>
                      <Link href={`/qr/v1/${menu?.storeName}`} passHref>
                        <a target="_blank">
                          <Button variant="text" style={{ height: "2rem" }}>
                            <p>Siteye Git</p>
                            <ArrowRightIcon style={{ fontSize: "24px" }} />
                          </Button>
                        </a>
                      </Link>
                      <a href={src} download>
                        <Button variant="text" style={{ height: "2rem" }}>
                          <p>QR Kodu İndir</p>
                          <DownloadIcon style={{ fontSize: "1rem" }} />
                        </Button>
                      </a>
                    </>
                  </div>
                </>
              </div>
              <div>
                <h3>Menü Yönetimi</h3>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={handleOpenAddProduct}
                  style={{ margin: "1rem", width: "16rem" }}
                >
                  Ürün Ekle
                </Button>
                <ModalMui
                  open={openAddProduct}
                  onClose={handleCloseAddProduct}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className={styles.modal}>
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
                            {categoryNames.map((name) => (
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
                              onChange={(e) => setFile(e.target.files[0])}
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
                </ModalMui>
                <ModalMui
                  open={openAddCategory}
                  onClose={handleCloseAddCategory}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className={styles.modal}>
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
                              onChange={(e) => setFile(e.target.files[0])}
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
                </ModalMui>
                <ModalMui
                  open={openDeleteProduct}
                  onClose={handleCloseDelete}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className={styles.modal}>
                    <form>
                      <List className={styles.list}>
                        <h3 className={styles.header}>Emin misiniz?</h3>

                        <ListItem>
                          <p>
                            {deleteCategory ? "Kategori" : "Ürün"}
                            <span className={styles.deleteDescription}>
                              {deleteName} ({deleteId})
                            </span>
                            silinecek.
                          </p>
                        </ListItem>
                      </List>
                    </form>
                    <Button
                      variant="contained"
                      type="submit"
                      onClick={() => {
                        handleCloseDelete();
                        setDeleteId("");
                        setDeleteCategory(false);
                      }}
                      style={{ margin: "1rem", width: "16rem" }}
                    >
                      Vazgeç
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      color="primary"
                      onClick={() => {
                        if (deleteCategory === true) {
                          deleteCategoryHandler();
                          handleCloseDelete();
                          setDeleteCategory(false);
                        } else {
                          deleteProductHandler();
                          handleCloseDelete();
                          setDeleteCategory(false);
                        }
                      }}
                      style={{ margin: "1rem", width: "16rem" }}
                    >
                      Onayla
                    </Button>
                  </Box>
                </ModalMui>
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
            <div className={styles.right}>
              <div style={{ height: "100%", width: "100%" }}>
                <h3 className={styles.titles}>Ürün Listesi</h3>
                {isLoading ? (
                  <p>Yükleniyor...</p>
                ) : products?.length > 0 ? (
                  <div style={{ height: "17rem", width: "100%" }}>
                    <DataGrid
                      localeText={
                        trTR.components.MuiDataGrid.defaultProps.localeText
                      }
                      rows={products}
                      getRowId={(row) => `${row.name}${row.price}`}
                      columns={columns}
                      pageSize={3}
                      rowsPerPageOptions={[3]}
                    />
                  </div>
                ) : (
                  "Ürün bulunamadı."
                )}
              </div>
              <div style={{ height: "100%", width: "100%" }}>
                <h3 className={styles.titles}>Kategori Listesi</h3>
                {isLoading ? (
                  <p>Yükleniyor...</p>
                ) : categories?.length > 0 ? (
                  <div style={{ height: "17rem", width: "100%" }}>
                    <DataGrid
                      localeText={
                        trTR.components.MuiDataGrid.defaultProps.localeText
                      }
                      rows={categories}
                      getRowId={(row) => `${row.name}${row.price}`}
                      columns={categoryColumns}
                      pageSize={3}
                      rowsPerPageOptions={[3]}
                    />
                  </div>
                ) : (
                  "Kategori bulunamadı."
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
