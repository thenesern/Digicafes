// Packages and Dependencies
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
import { DataGrid, trTR } from "@mui/x-data-grid";
import QRCode from "qrcode";
import { fadeInRightBig } from "react-animations";
import Radium, { StyleRoot } from "radium";
import Cookies from "js-cookie";
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
import Stack from "@mui/material/Stack";
import { useSnackbar } from "notistack";
// Styles
import styles from "./UserDashboard.module.css";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
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

const UserDashboard = ({ userOrder, userId }) => {
  const [order, setOrder] = useState(userOrder[0] || null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const theme = useTheme();
  const [menu, setMenu] = useState(order?.menuv1 || order?.menuv2 || "");
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updatedCategories, setUpdatedCategories] = useState([]);
  const [src, setSrc] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingForFirst, setIsFetchingForFirst] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const [storeName, setStoreName] = useState(menu?.storeName || "");
  const [storeLinkName, setStoreLinkName] = useState(menu?.storeLinkName || "");
  const [addCategory, setAddCategory] = useState("");
  const [products, setProducts] = useState([...(menu?.products || "")]);
  const arrayProducts = Array.from(products);
  const [categories, setCategories] = useState([...(menu?.categories || "")]);
  let arrayCategories = Array.from(categories);
  const [deleteId, setDeleteId] = useState("");
  const [secondStep, setSecondStep] = useState(false);
  const [tableNum, setTableNum] = useState(menu?.tableNum || null);
  const [version, setVersion] = useState(
    order?.product?.name === "Dijital Menü - V1" ? "v1" : "v2"
  );

  const [QRCodes, setQRCodes] = useState([]);
  const [deleteName, setDeleteName] = useState("");
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [storeLogo, setStoreLogo] = useState(
    menu?.storeLogo ||
      "https://res.cloudinary.com/dlyjd3mnb/image/upload/v1650137521/uploads/logoDefault_ez8obk.png"
  );
  const [categoryNames, setCategoryNames] = useState([
    ...(menu?.categories?.map((c) => c?.name) || ""),
  ]);
  const animate = {
    fadeInRightBig: {
      animation: "x 2s",
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
    },
  };
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [updateCategory, setUpdateCategory] = useState("");
  const handleOpenAddProduct = () => setOpenAddProduct(true);
  const handleCloseAddProduct = () => setOpenAddProduct(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteCategory(false);
    setDeleteId("");
  };
  let user;
  useEffect(() => {
    setTableNum(menu?.tableNum);
    setStoreName(menu?.storeName);
    setStoreLinkName(menu?.storeLinkName);
  }, [menu]);

  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }
  const [openUpdateCategory, setOpenUpdateCategory] = useState(false);
  const [openDeleteProduct, setOpenDelete] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openUploadLogo, setOpenUploadLogo] = useState(false);
  const [openQRImages, setOpenQRImages] = useState(false);
  const handleOpenUpdateCategory = () => setOpenUpdateCategory(true);
  const handleCloseUpdateCategory = () => {
    setOpenUpdateCategory(false);
    setFile(null);
    setIsPreview(false);
  };
  const handleOpenQRImages = () => setOpenQRImages(true);
  const handleCloseQRImages = () => setOpenQRImages(false);
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
  useEffect(() => {
    setCategoryNames(menu?.categories?.map((c) => c?.name));
  }, [menu?.categories, categories]);
  const firstTimeHandler = async (e) => {
    e.preventDefault();
    const createdAt = new Date().toLocaleString("tr-TR");

    try {
      setIsFetchingForFirst(true);
      const { data } = await axios.post(
        `/api/qr/${version}/${storeName}/menu`,
        {
          storeName: storeName,
          storeLinkName: storeLinkName,
          tableNum,
          createdAt,
          owner: order?.user?._id,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      const attachedOrder = await axios.patch(
        "/api/order/attachMenu",
        {
          orderId: order?._id,
          menuId: data?.menu?._id,
          orderProduct: order?.product?.name,
        },
        {
          headers: { authorization: `Bearer ${user?.token}` },
        }
      );
      setOrder(attachedOrder?.data?.order);
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
    let betterProductName = name
      .toLowerCase()
      ?.split(" ")
      .map((a) => a?.toLowerCase().replace(a[0], a[0]?.toUpperCase()))
      .join(" ");

    if (products?.map((c) => c?.name).includes(betterProductName)) {
      handleCloseAddProduct();
      setAddCategory("");
      setIsFetching(false);
      setName("");
      setDescription("");
      setPrice("");
      return enqueueSnackbar("Bu isimde bir ürün zaten var", {
        variant: "error",
      });
    }
    try {
      setIsFetching(true);
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
        data
      );

      arrayProducts.push({
        name: betterProductName,
        price,
        description,
        category,
        image: uploadRes?.data.url,
      });
      const updatedMenu = await axios.patch(
        `/api/qr/${version}/${menu?.storeName}/menu`,
        {
          storeName,
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
    if (
      products.map((a) => a.category.toString()).includes(deleteName) === true
    ) {
      setIsFetching(false);
      setDeleteId("");
      setDeleteName("");
      return enqueueSnackbar(
        "Kategori Silinemedi (Bu kategoriyi kullanan bir ürün var.)",
        { variant: "error" }
      );
    }
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
      setDeleteName("");
      enqueueSnackbar("Kategori Silindi", { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setDeleteId("");
      setDeleteName("");
      enqueueSnackbar("Kategori Silinemedi", { variant: "error" });
    }
    setIsFetching(false);
  };
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploads");
    let betterCategoryName = addCategory
      .toLowerCase()
      ?.split(" ")
      .map((a) => a?.toLowerCase().replace(a[0], a[0]?.toUpperCase()))
      .join(" ");

    if (
      categoryNames.includes(betterCategoryName && typeof file !== "object")
    ) {
      handleCloseAddCategory();
      setAddCategory("");
      setUpdateCategory("");
      setFile(null);
      setIsFetching(false);
      return enqueueSnackbar("Bu isimde bir kategori zaten var.", {
        variant: "error",
      });
    }
    setUpdatedCategories(categories.filter((c) => c.name !== updateCategory));
    try {
      setIsFetching(true);
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
        data
      );
      setUpdatedCategories((prevState) => [
        ...prevState,
        { name: betterCategoryName, image: uploadRes?.data.url },
      ]);

      arrayCategories.push({
        name: betterCategoryName,
        image: uploadRes?.data?.url,
      });
      categoryNames.push(betterCategoryName);
      handleCloseUpdateCategory();
      setAddCategory("");
      setFile(null);
    } catch (err) {
      console.log(err);
      setAddCategory("");
      setFile(null);
    }
  };

  const handleSendUpdatedCategories = async () => {
    try {
      const updatedMenu = await axios.patch(
        `/api/qr/${version}/${menu?.storeName}/categories`,
        {
          storeName,
          categories: updatedCategories,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      if (updatedMenu?.data.menu) {
        setCategories(updatedMenu?.data?.menu?.categories);
      } else {
        setCategories(updatedMenu?.data?.menu?.categories);
      }
      setIsFetching(false);
      enqueueSnackbar("Kategori Güncellendi", { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
    }
  };

  const addCategoryHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploads");
    let betterCategoryName = addCategory
      .toLowerCase()
      ?.split(" ")
      .map((a) => a?.toLowerCase().replace(a[0], a[0]?.toUpperCase()))
      .join(" ");

    if (categoryNames.includes(betterCategoryName)) {
      handleCloseAddCategory();
      setAddCategory("");
      setFile(null);
      setIsFetching(false);
      return enqueueSnackbar("Bu isimde bir kategori zaten var.", {
        variant: "error",
      });
    }
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
      handleCloseAddCategory();
      setIsFetching(false);
      setAddCategory("");
      setFile(null);
      enqueueSnackbar("Kategori Eklenemedi", { variant: "error" });
    }
  };
  function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }
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
      `https://www.digicafes.com/qr/${version}/${storeLinkName}/1`,
      opts
    ).then(setSrc);
  }, [menu?.storeLinkName, version, storeLinkName]);
  useEffect(() => {
    var opts = {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 1,
      margin: 0,
      padding: 0,
    };
    if (!isFirst) {
      for (let i = 0; i < tableNum; i++) {
        QRCode.toDataURL(
          `https://www.digicafes.com/qr/${version}/${storeLinkName}/${i + 1}`,
          opts
        ).then((url) => QRCodes.push(url));
      }
    }
  }, [tableNum, isFirst]);
  useEffect(() => {
    if (updatedCategories.length > 0) {
      handleSendUpdatedCategories();
    }
  }, [updatedCategories.length]);
  const columns = [
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
    {
      field: "price",
      headerName: "Ürün Fiyatı",
      flex: 0.7,
      renderCell: (params) => {
        return <span>₺{params?.row.price}</span>;
      },
    },
    { field: "description", headerName: "Ürün Açıklaması", flex: 1 },
    { field: "category", headerName: "Ürün Kategorisi", flex: 0.8 },
    {
      field: "actions",
      headerName: "Yönetim",
      width: 200,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="warning"
              style={{ fontSize: "12px", fontWeight: "500", width: "5rem" }}
            >
              Düzenle
            </Button>
            <Button
              style={{ fontSize: "12px", fontWeight: "500", width: "5rem" }}
              onClick={() => {
                handleOpenDelete();
                setDeleteId(params?.row._id);
                setDeleteName(params?.row.name);
              }}
              variant="outlined"
            >
              Sil
            </Button>
          </Stack>
        );
      },
    },
  ];
  const categoryColumns = [
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
      width: 200,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => {
                handleOpenUpdateCategory();
                setAddCategory(params.row.name);
                setUpdateCategory(params.row.name);
                setFile(params.row.image);
              }}
              style={{ fontSize: "12px", fontWeight: "500", width: "5rem" }}
              variant="outlined"
              color="warning"
            >
              Düzenle
            </Button>
            <Button
              variant="outlined"
              style={{ fontSize: "12px", fontWeight: "500", width: "5rem" }}
              color="error"
              onClick={() => {
                handleOpenDelete();
                setDeleteId(params?.row._id);
                setDeleteName(params?.row.name);
                setDeleteCategory(true);
              }}
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
          {!secondStep && (
            <StyleRoot>
              <form className={styles.formFirst} style={animate.fadeInRightBig}>
                <h2 className={styles.headerFirst}>
                  Lütfen İş Yerinizin Adını Giriniz
                </h2>
                <List className={styles.list}>
                  <ListItem>
                    <TextField
                      variant="outlined"
                      disabled={isFirst ? false : true}
                      id="brandName"
                      autoFocus="true"
                      rules={{
                        required: true,
                      }}
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        setStoreName(e.target.value.trim());
                        setStoreLinkName(
                          e.target.value
                            .trim()
                            .toLowerCase()
                            .replaceAll(" ", "-")
                            .replaceAll("ç", "c")
                            .replaceAll("ı", "i")
                            .replaceAll("ü", "u")
                            .replaceAll("ğ", "g")
                            .replaceAll("ö", "o")
                            .replaceAll("ş", "s")
                        );
                      }}
                      label="İş Yeri Adı"
                      helperText={
                        storeName?.length === 0
                          ? "Lütfen bir İş Yeri Adı yazınız."
                          : storeName?.length < 3
                          ? "İş Yeri Adı minimum 3 karakter olmalıdır!"
                          : containsSpecialChars(storeName) === true
                          ? "İş Yeri Adınız Özel Karakter İçermemelidir!"
                          : ""
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
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            storeName?.length > 2 &&
                            !containsSpecialChars(storeName)
                          ) {
                            setSecondStep(true);
                          }
                        }}
                      >
                        İlerle
                      </Button>
                    </ListItem>
                  )}
                </List>
              </form>
            </StyleRoot>
          )}
          {secondStep && (
            <StyleRoot>
              <form className={styles.formFirst} style={animate.fadeInRightBig}>
                <h2 className={styles.headerFirst}>
                  Lütfen İş Yerinizdeki Masa Sayısını Giriniz
                </h2>
                <List className={styles.list}>
                  <ListItem>
                    <TextField
                      variant="outlined"
                      disabled={isFirst ? false : true}
                      id="tableNum"
                      type="number"
                      autoFocus="true"
                      rules={{
                        required: true,
                      }}
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        e.preventDefault();
                        setTableNum(+e.target.value);
                      }}
                      helperText={
                        tableNum === undefined
                          ? "Lütfen bir Masa Sayısı giriniz."
                          : tableNum === 0
                          ? "Masa Sayısı sıfır olamaz!"
                          : tableNum < 0
                          ? "Masa Sayısı Negatif bir değer olamaz!"
                          : tableNum > 50
                          ? "Masa Sayısı 50'yi geçmemelidir!"
                          : ""
                      }
                      label="Masa Sayısı"
                    ></TextField>
                  </ListItem>
                  <ListItem>
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          tableNum !== undefined &&
                          tableNum < 50 &&
                          tableNum > 0 &&
                          tableNum !== 0
                        ) {
                          firstTimeHandler(e);
                        }
                      }}
                    >
                      Kaydet
                    </Button>
                  </ListItem>
                </List>
              </form>
            </StyleRoot>
          )}
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
              <div className={styles.leftBox}>
                <div className={styles.headers}>
                  <QrCodeIcon color="primary" />
                  <h3 className={styles.titles}>QR Menü Kodu</h3>
                </div>
                <div className={styles.qr}>
                  <div className={styles.images}>
                    <img src={src} alt="QR" className={styles.qrImg} />
                    <img src={storeLogo} alt="Logo" className={styles.logo} />
                  </div>
                  <div className={styles.qrActions}>
                    <Link
                      href={
                        version === "v2"
                          ? `/qr/${version}/${storeLinkName}/1`
                          : `/qr/${version}/${storeLinkName}/`
                      }
                      passHref
                    >
                      <a target="_blank">
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            className={styles.qrButtons}
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
                    {order?.menuv2 && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          className={styles.qrButtons}
                          variant="outlined"
                          onClick={handleOpenQRImages}
                          style={{ height: "2rem", width: "12rem" }}
                          endIcon={<DownloadIcon />}
                        >
                          QR Kodları İndir
                        </Button>
                      </Stack>
                    )}

                    {order?.menuv2 && (
                      <Link
                        href={`/dashboard/${userId}/menu/${version}/${order?._id}/orders`}
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
                              className={styles.qrButtons}
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
              <div className={styles.actions}>
                <div className={styles.headers}>
                  <DashboardCustomizeIcon color="primary" />
                  <h3>Menü Yönetimi</h3>
                </div>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={categories.length > 0 ? false : true}
                  onClick={handleOpenAddProduct}
                  style={{ margin: "1rem", width: "16rem" }}
                  className={styles.menuButtons}
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
                            inputProps={{ type: "text", maxLength: 20 }}
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
                  open={openQRImages}
                  onClose={handleCloseQRImages}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className={styles.qrsModal}>
                    <h1 style={{ textAlign: "center", padding: "1rem" }}>
                      QR Kodları
                    </h1>
                    <div className={styles.qrs}>
                      {QRCodes.map((qr, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <p>Masa No.{i + 1}</p>
                          <img style={{ width: "7rem" }} src={qr} />
                          <a href={qr} download>
                            <Button
                              color="primary"
                              style={{ width: "7rem" }}
                              variant="contained"
                            >
                              indir
                            </Button>
                          </a>
                        </div>
                      ))}
                    </div>
                  </Box>
                </ModalMui>
                <Modal
                  style={{ padding: "6px", width: "100%" }}
                  open={openUpdateCategory}
                  onClose={handleCloseUpdateCategory}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Modal.Header>
                    <h2>Kategori Düzenle</h2>
                  </Modal.Header>
                  <Modal.Body>
                    <form
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "2rem",
                        padding: "1rem",
                      }}
                    >
                      <Input
                        fullWidth
                        label="Kategori Adı"
                        value={addCategory}
                        onChange={(e) => setAddCategory(e.target.value)}
                      />
                      <Input
                        fullWidth
                        accept="image/*"
                        label="Kategori Görseli"
                        id="icon-button-file"
                        onChange={(e) => {
                          setFile(e.target.files[0]);
                          setIsPreview(true);
                        }}
                        type="file"
                      />
                      {isPreview ? (
                        /*    <img
                          src={URL.createObjectURL(file)}
                          width="300px"
                          height="300px"
                          style={{ objectFit: "contain" }}
                        ></img> */
                        ""
                      ) : (
                        <img
                          src={file}
                          width="300px"
                          height="300px"
                          style={{ objectFit: "contain" }}
                        ></img>
                      )}
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={() => {
                        handleCloseUpdateCategory();
                        setUpdateCategory("");
                        setAddCategory("");
                        setFile("");
                        setIsPreview(false);
                      }}
                    >
                      Vazgeç
                    </Button>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={(e) => {
                        if (
                          addCategory != updateCategory ||
                          typeof file === "object"
                        ) {
                          handleUpdateCategory(e);
                        } else {
                          handleCloseUpdateCategory();
                          setUpdateCategory("");
                          setAddCategory("");
                          setFile("");
                          setIsPreview(false);
                          enqueueSnackbar("Değişiklik Yapılmadı", {
                            variant: "info",
                          });
                        }
                      }}
                      style={{ marginLeft: "1rem" }}
                    >
                      Onayla
                    </Button>
                  </Modal.Footer>
                </Modal>
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
                            inputProps={{ type: "text", maxLength: 16 }}
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
                              {deleteName}
                            </span>
                            silinecek.
                          </p>
                        </ListItem>
                      </List>
                    </form>
                    <div className={styles.modalButtons}>
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
                    </div>
                  </Box>
                </ModalMui>
                <Button
                  className={styles.menuButtons}
                  variant="contained"
                  type="submit"
                  color="primary"
                  onClick={handleOpenAddCategory}
                  style={{ margin: "1rem", width: "16rem" }}
                >
                  Kategori Ekle
                </Button>
                <Button
                  className={styles.menuButtons}
                  variant="contained"
                  type="submit"
                  color="primary"
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
                  <div className={styles.grid}>
                    <DataGrid
                      className={styles.data}
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
                  <div className={styles.grid}>
                    <DataGrid
                      className={styles.data}
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
