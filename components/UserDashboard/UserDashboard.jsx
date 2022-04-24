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
import { useSnackbar } from "notistack";
import QrCodeIcon from "@mui/icons-material/QrCode";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import ViewListIcon from "@mui/icons-material/ViewList";

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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const theme = useTheme();
  const [menu, setMenu] = useState(order[0]?.menuv1 || order[0]?.menuv2 || "");
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
  const [version, setVersion] = useState("");
  useEffect(() => {
    if (order[0]?.product?.name === "Dijital Menü - V1") {
      setVersion("v1");
    } else {
      setVersion("v2");
    }
  }, [order]);

  const [deleteName, setDeleteName] = useState("");
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [storeLogo, setStoreLogo] = useState(
    menu?.storeLogo ||
      "https://res.cloudinary.com/dlyjd3mnb/image/upload/v1650137521/uploads/logoDefault_ez8obk.png"
  );
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
  let user;

  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }
  const [openDeleteProduct, setOpenDelete] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openUploadLogo, setOpenUploadLogo] = useState(false);
  const handleOpenAddCategory = () => setOpenAddCategory(true);
  const handleCloseAddCategory = () => setOpenAddCategory(false);
  const handleOpenUploadLogo = () => setOpenUploadLogo(true);
  const handleCloseUploadLogo = () => setOpenUploadLogo(false);
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

  const firstTimeHandler = async (e) => {
    e.preventDefault();
    const createdAt = new Date().toLocaleString("tr-TR");

    try {
      setIsFetchingForFirst(true);
      const { data } = await axios.post(
        `/api/qr/${version}/${storeName}/menu`,
        {
          storeName: storeName,
          createdAt,
          owner: order[0]?.user?._id,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      await axios.patch(
        "/api/order/attachMenu",
        {
          orderId: order[0]?._id,
          menuId: data?.menu?._id,
          orderProduct: order[0]?.product?.name,
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
        `/api/qr/${version}/${menu?.storeName}/menu`,
        {
          storeName: menu?.storeName,
          products: arrayProducts,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      setMenu(updatedMenu?.data?.menu);
      setProducts(updatedMenu?.data?.menu?.products);
      handleCloseAddProduct();
      setIsFetching(false);
      setName("");
      setDescription("");
      setPrice("");
      setFile(null);
      enqueueSnackbar("Ürün Eklendi", { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setName("");
      setDescription("");
      setPrice("");
      setFile(null);
      enqueueSnackbar("Ürün Eklenemedi", { variant: "error" });
    }
  };
  const deleteProductHandler = async () => {
    setIsFetching(true);

    try {
      setProducts(arrayProducts.filter((product) => product._id !== deleteId));
      const newProducts = arrayProducts.filter(
        (product) => product._id !== deleteId
      );
      await axios.patch(
        `/api/qr/${version}/${menu?.storeName}/menu`,
        {
          storeName: menu?.storeName,
          products: newProducts,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      setIsFetching(false);
      setDeleteId("");
      enqueueSnackbar("Ürün Silindi", { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setDeleteId("");
      enqueueSnackbar("Ürün Silinemedi", { variant: "error" });
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
      await axios.patch(
        `/api/qr/${version}/${menu?.storeName}/categories`,
        {
          storeName: menu?.storeName,
          categories: newCategories,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      setIsFetching(false);
      setDeleteId("");
      enqueueSnackbar("Kategori Silindi", { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setDeleteId("");
      enqueueSnackbar("Kategori Silinemedi", { variant: "error" });
    }
    setIsFetching(false);
  };
  const addCategoryHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploads");
    let betterCategoryName = addCategory
      ?.split(" ")
      .map((a) => a?.toLowerCase().replace(a[0], a[0]?.toUpperCase()))
      .join(" ");
    console.log(betterCategoryName);
    try {
      setIsFetching(true);
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
        data
      );

      arrayCategories.push({
        name: betterCategoryName,
        image: uploadRes?.data?.url,
      });
      categoryNames.push(betterCategoryName);

      const updatedMenu = await axios.patch(
        `/api/qr/${version}/${menu?.storeName}/categories`,
        {
          storeName,
          categories: arrayCategories,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      setCategories(updatedMenu?.data?.menu?.categories);
      handleCloseAddCategory();
      setAddCategory("");
      setFile(null);
      setIsFetching(false);
      enqueueSnackbar("Kategori Eklendi", { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setAddCategory("");
      setFile(null);
      enqueueSnackbar("Kategori Eklenemedi", { variant: "error" });
    }
  };
  const uploadLogoHandler = async (e) => {
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
      const updatedMenu = await axios.patch(
        `/api/qr/${version}/${menu?.storeName}/menu`,
        {
          storeName,
          storeLogo: uploadRes?.data?.url,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      setStoreLogo(uploadRes?.data?.url);
      setMenu(updatedMenu?.data?.menu);
      handleCloseUploadLogo();
      setFile(null);
      setIsFetching(false);
      enqueueSnackbar("Logo Yüklendi", { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setFile(null);
      enqueueSnackbar("Logo Yüklenemedi", { variant: "error" });
    }
  };

  useEffect(() => {
    var opts = {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 1,
      margin: 0,
      padding: 0,
    };
    QRCode.toDataURL(
      `https://www.project-testenes.vercel.app.com/qr${version}/${menu?.storeName}`,
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
    { field: "_id", headerName: "Kategori Kodu", flex: 2 },
    {
      field: "name",
      headerName: "Kategori",
      flex: 2,
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
                    rules={{
                      required: true,
                      pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    }}
                    style={{ maxWidth: "24rem" }}
                    onChange={(e) => setStoreName(e.target.value)}
                    label="Dükkan Adı"
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
                <div className={styles.headers}>
                  <QrCodeIcon color="primary" />
                  <h3 className={styles.titles}>QR Menü Kodu</h3>
                </div>
                <div className={styles.qr}>
                  <img src={src} alt="QR" className={styles.qrImg} />
                  <img src={storeLogo} alt="Logo" className={styles.logo} />
                  <div className={styles.qrActions}>
                    <Link href={`/qr/${version}/${menu?.storeName}`} passHref>
                      <a target="_blank">
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            style={{
                              height: "2rem",
                              width: "12rem",
                            }}
                            endIcon={
                              <ArrowRightIcon style={{ fontSize: "2rem" }} />
                            }
                          >
                            Siteye Git
                          </Button>
                        </Stack>
                      </a>
                    </Link>
                    <a href={src} download>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          style={{ height: "2rem", width: "12rem" }}
                          endIcon={<DownloadIcon />}
                        >
                          QR Kodu İndir
                        </Button>
                      </Stack>
                    </a>
                    {order[0]?.menuv2 && (
                      <Link
                        href={`/dashboard/${user?.id}/menu/${version}/${order[0]?._id}/orders`}
                        passHref
                      >
                        <a target="_blank">
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="outlined"
                              style={{
                                height: "2rem",
                                width: "12rem",
                              }}
                              endIcon={
                                <ArrowRightIcon style={{ fontSize: "2rem" }} />
                              }
                            >
                              Sipariş Paneli
                            </Button>
                          </Stack>
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.headers}>
                  <DashboardCustomizeIcon color="primary" />
                  <h3>Menü Yönetimi</h3>
                </div>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={categories.length > 0 ? false : true}
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
                            onClick={(e) => {
                              if (categoryNames.includes(addCategory)) {
                                handleCloseAddCategory();
                                enqueueSnackbar(
                                  "Zaten bu isimde bir kategoriniz var",
                                  {
                                    variant: "error",
                                  }
                                );
                              } else {
                                addCategoryHandler(e);
                              }
                            }}
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
                  open={openUploadLogo}
                  onClose={handleCloseUploadLogo}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className={styles.modal}>
                    <form>
                      <List className={styles.list}>
                        <h3 className={styles.header}>Logo Yükle</h3>

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
                            onClick={uploadLogoHandler}
                            color="primary"
                          >
                            Yükle
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
                <Button
                  variant="contained"
                  type="submit"
                  onClick={handleOpenUploadLogo}
                  style={{ margin: "1rem", width: "16rem" }}
                >
                  Logo Yükle
                </Button>
              </div>
            </div>
            <div className={styles.right}>
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  boxShadow: "rgba(17, 17, 26, 0.1) 0px 1px 0px",
                }}
              >
                <div className={styles.headers}>
                  <ViewListIcon color="primary" />
                  <h3 className={styles.titles}>Ürün Listesi</h3>
                </div>
                {isLoading ? (
                  <p>Yükleniyor...</p>
                ) : products?.length > 0 ? (
                  <div style={{ height: "24rem", width: "100%" }}>
                    <DataGrid
                      localeText={
                        trTR.components.MuiDataGrid.defaultProps.localeText
                      }
                      rows={products}
                      getRowId={(row) => `${row.name}${row.price}`}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                    />
                  </div>
                ) : (
                  "Ürün bulunamadı."
                )}
              </div>
              <div style={{ height: "100%", width: "100%" }}>
                <div className={styles.headers}>
                  <ViewListIcon color="primary" />
                  <h3 className={styles.titles}>Kategori Listesi</h3>
                </div>
                {isLoading ? (
                  <p>Yükleniyor...</p>
                ) : categories?.length > 0 ? (
                  <div style={{ height: "24rem", width: "100%" }}>
                    <DataGrid
                      localeText={
                        trTR.components.MuiDataGrid.defaultProps.localeText
                      }
                      rows={categories}
                      getRowId={(row) => `${row.name}${row.price}`}
                      columns={categoryColumns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
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
