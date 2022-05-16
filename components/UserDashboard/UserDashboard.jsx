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
  const [updateProduct, setUpdateProduct] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateSubCategory, setUpdateSubCategory] = useState("");
  const [menu, setMenu] = useState(order?.menuv1 || order?.menuv2 || "");
  const [name, setName] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updatedCategories, setUpdatedCategories] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [src, setSrc] = useState("");
  const [updateProductCategory, setUpdateProductCategory] = useState();
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
  const [gallery, setGallery] = useState(menu?.gallery || null);
  const [galleryName, setGalleryName] = useState(menu?.gallery?.name);
  const [isGalleryActive, setIsGalleryActive] = useState(
    menu?.gallery?.isActive || false
  );
  const [images, setImages] = useState(menu?.gallery?.images || []);
  const [galleryImage, setGalleryImage] = useState(
    menu?.gallery?.galleryImage || null
  );

  const [secondStep, setSecondStep] = useState(false);
  const [tableNum, setTableNum] = useState(menu?.tableNum || null);
  const [category, setCategory] = useState([]);
  const [listType, setListType] = useState(menu?.listType || null);
  const [menusv1, setMenusv1] = useState([]);
  const [menusv2, setMenusv2] = useState([]);
  const [version, setVersion] = useState(
    order?.product?.name === "Dijital Menü - V1" ? "v1" : "v2"
  );
  const [categoryOrder, setCategoryOrder] = useState(null);
  const [updateCategoryOrder, setUpdateCategoryOrder] = useState(null);
  const [QRCodes, setQRCodes] = useState([]);
  const [deleteName, setDeleteName] = useState("");
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [storeLogo, setStoreLogo] = useState(
    menu?.storeLogo ||
      "https://res.cloudinary.com/dlyjd3mnb/image/upload/v1650137521/uploads/logoDefault_ez8obk.png"
  );

  const animate = {
    fadeInRightBig: {
      animation: "x 2s",
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
    },
  };

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [updateCategory, setUpdateCategory] = useState([]);
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
  const [openUpdateProduct, setOpenUpdateProduct] = useState(false);
  const [openDeleteProduct, setOpenDelete] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openUploadLogo, setOpenUploadLogo] = useState(false);
  const [openQRImages, setOpenQRImages] = useState(false);
  const [openListType, setOpenListType] = useState(false);
  const handleCloseUpdateProduct = () => {
    setOpenUpdateProduct(false);
    setFile(null);
    setUpdatePrice(null);
    setUpdateDescription("");
    setUpdateProductCategory(null);
    setIsPreview(false);
  };
  const handleOpenUpdateProduct = () => setOpenUpdateProduct(true);
  const handleOpenUpdateCategory = () => setOpenUpdateCategory(true);
  const handleCloseUpdateCategory = () => {
    setOpenUpdateCategory(false);
    setFile(null);
    setIsPreview(false);
  };
  const handleOpenQRImages = () => setOpenQRImages(true);
  const handleCloseQRImages = () => setOpenQRImages(false);
  const handleOpenAddCategory = () => setOpenAddCategory(true);
  const [openGallery, setOpenGallery] = useState(false);
  const handleCloseAddCategory = () => {
    setOpenAddCategory(false);
    setCategoryOrder(null);
    setUpdateCategoryOrder(null);
  };
  const handleOpenUploadLogo = () => setOpenUploadLogo(true);
  const handleOpenGallery = () => setOpenGallery(true);
  const handleCloseGallery = () => {
    setOpenGallery(false);
  };
  const handleOpenListType = () => {
    setOpenListType(true);
    setListType(menu?.listType);
  };
  const handleCloseListType = () => setOpenListType(false);
  const handleCloseUploadLogo = () => setOpenUploadLogo(false);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategory(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  useEffect(() => {
    if (isFirst) {
      const getMenus = async () => {
        await axios
          .get("/api/qr/v1/menus", {
            headers: { authorization: `Bearer ${user.token}` },
          })
          .then((response) => {
            setMenusv1(response.data.menusv1);
          });
        await axios
          .get("/api/qr/v2/menus", {
            headers: { authorization: `Bearer ${user.token}` },
          })
          .then((response) => {
            setMenusv2(response.data.menusv2);
          });
      };
      getMenus();
    }
  }, [isFirst]);

  const handleUpdateChange = (event) => {
    const {
      target: { value },
    } = event;
    setUpdateProductCategory(
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
          storeLinkName: storeLinkName,
          tableNum,
          listType: "text",
          createdAt,
          gallery,
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
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploads");
    let betterProductName = updateProduct
      .toLowerCase()
      ?.split(" ")
      .map((a) => a?.toLowerCase().replace(a[0], a[0]?.toUpperCase()))
      .join(" ");

    try {
      setIsFetching(true);
      let uploadRes;
      if (file) {
        uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
          data
        );
      }

      let newProducts = products.filter((c) => c.name !== name);

      const addCategory = () => {
        setUpdatedProducts([
          ...newProducts,
          {
            name: betterProductName,
            price: updatePrice,
            description: updateDescription,
            category: updateProductCategory,
            image: uploadRes?.data.url,
            subCategory: updateSubCategory,
          },
        ]);
      };
      addCategory();
      handleCloseUpdateProduct();
    } catch (err) {
      console.log(err);
    }
  };
  console.log(images);
  const handleUpdateGallery = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const data2 = new FormData();
    data.append("file", file);
    data2.append("file", galleryImage);
    data.append("upload_preset", "uploads");
    data2.append("upload_preset", "uploads");
    try {
      setIsFetching(true);
      let uploadRes;
      if (file) {
        uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
          data
        );
      }
      let uploadImage;
      if (typeof galleryImage === "object") {
        uploadImage = await axios.post(
          "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
          data2
        );
      }
      if (uploadRes) {
        images.push({
          image: uploadRes?.data.url,
        });
      }
      if (uploadImage) {
        uploadImage = uploadImage?.data?.url;
      }
      if (uploadImage) {
        const newGallery = await axios.patch(
          `/api/qr/${version}/${menu?.storeName}/gallery`,
          {
            storeName,
            gallery: {
              name: galleryName,
              images,
              galleryImage: uploadImage,
              isActive: isGalleryActive,
            },
          },
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        );
        setGalleryImage(newGallery?.data?.gallery?.galleryImage);
        setImages(newGallery?.data?.gallery?.images);
        setGalleryName(newGallery?.data?.gallery?.name);
      } else {
        console.log(images);
        const newGallery = await axios.patch(
          `/api/qr/${version}/${menu?.storeName}/gallery`,
          {
            storeName,
            gallery: {
              name: galleryName,
              images,
              galleryImage,
              isActive: isGalleryActive,
            },
          },
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        );
        setGalleryImage(newGallery?.data?.gallery?.galleryImage);
        setImages(newGallery?.data?.gallery?.images);
        setGalleryName(newGallery?.data?.gallery?.name);
      }
      handleCloseGallery();
      setIsFetching(false);
      return enqueueSnackbar(`Galeri güncellendi.`, {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      handleCloseGallery();
    }
  };
  const handleUpdateListType = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    if (listType === menu?.listType) {
      handleCloseListType();
      setIsFetching(false);
      return enqueueSnackbar("Listeleme türü zaten aynı", {
        variant: "error",
      });
    }
    try {
      const menu = await axios.patch(
        `/api/qr/${version}/${menu?.storeName}/listType`,
        {
          storeName,
          listType,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      setMenu(menu?.data?.menu);
      handleCloseListType();
      setIsFetching(false);
      return enqueueSnackbar(`Listeleme türü değiştirildi`, {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      handleCloseListType();
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
      let uploadRes;
      if (file) {
        uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
          data
        );
      }

      arrayProducts.push({
        name: betterProductName,
        price,
        description,
        category,
        image: uploadRes?.data.url,
        subCategory,
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
      setSubCategory("");
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

    try {
      setIsFetching(true);
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
        data
      );

      let newCategories = categories.filter((c) => c.name !== updateCategory);

      const addCategory = () => {
        setUpdatedCategories([
          ...newCategories,
          {
            name: betterCategoryName,
            image: uploadRes?.data.url,
            order: updateCategoryOrder,
          },
        ]);
      };
      addCategory();
      handleCloseUpdateCategory();
      setAddCategory("");
      setFile(null);
    } catch (err) {
      console.log(err);
      setAddCategory("");
      setFile(null);
    }
  };
  const handleSendUpdatedProducts = async () => {
    try {
      const updatedMenu = await axios.patch(
        `/api/qr/${version}/${menu?.storeName}/menu`,
        {
          storeName,
          products: updatedProducts,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      if (updatedMenu?.data.menu) {
        setProducts(updatedMenu?.data?.menu?.products);
      } else {
        setProducts(updatedMenu?.data?.menu?.products);
      }
      setIsFetching(false);
      enqueueSnackbar("Ürün Güncellendi", { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
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

    if (categories.filter((c) => c.name === betterCategoryName).length !== 0) {
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
        order: categoryOrder,
      });
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
      setCategoryOrder(null);
      setUpdateCategoryOrder(null);
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
      `https://www.digicafes.com/qr/${version}/${storeLinkName}`,
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
  }, [updatedCategories]);
  useEffect(() => {
    if (updatedProducts.length > 0) {
      handleSendUpdatedProducts();
    }
  }, [updatedProducts]);
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
    {
      field: "subCategory",
      headerName: "Ürün Alt Kategorisi",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className={styles.product}>
            {params?.row?.subCategory ? (
              <p>{params?.row.subCategory}</p>
            ) : (
              <p>Yok</p>
            )}
          </div>
        );
      },
    },
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
              onClick={() => {
                handleOpenUpdateProduct();
                setName(params.row.name);
                setUpdateProduct(params.row.name);
                setUpdatePrice(params.row.price);
                setPrice(params.row.price);
                setDescription(params.row.description);
                setUpdateDescription(params.row.description);
                setUpdateProductCategory(params.row.category);
                setUpdateSubCategory(params.row.subCategory);
                setSubCategory(params.row.subCategory);
                setCategory(params.row.category);
                setFile(params.row.image);
              }}
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
      field: "order",
      headerName: "Sıra",
      flex: 2,
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
                setUpdateCategoryOrder(params.row.categoryOrder);
                setCategoryOrder(params.row.categoryOrder);
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
                          : menusv1.filter((s) => s.storeName === storeName)
                              .length > 0 ||
                            menusv2.filter((s) => s.storeName === storeName)
                              .length > 0
                          ? "Bu iş yeri adı kullanılmaktadır. Lütfen başka bir ad giriniz."
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
                            !containsSpecialChars(storeName) &&
                            menusv1.filter((s) => s.storeName === storeName)
                              .length === 0 &&
                            menusv2.filter((s) => s.storeName === storeName)
                              .length === 0
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
                    {order?.menuv1 && (
                      <a href={src} download={`${storeName}`}>
                        <Button
                          variant="outlined"
                          className={styles.qrButtons}
                          style={{ height: "2rem", width: "12rem" }}
                          endIcon={<DownloadIcon />}
                        >
                          QR Kodu İndir
                        </Button>
                      </a>
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
                            {categories.map((category) => (
                              <MenuItem
                                key={category.name}
                                value={category.name}
                                style={{
                                  padding: "10px",
                                  width: "100%",
                                }}
                              >
                                {category.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <ListItem>
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="subCategory"
                            onChange={(e) => setSubCategory(e.target.value)}
                            label="Alt Kategori Adı (Boş Bırakabilirsiniz.)"
                            inputProps={{ type: "text", maxLength: 38 }}
                          ></TextField>
                        </ListItem>
                        <ListItem>
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            onChange={(e) => setName(e.target.value)}
                            label="Ürün Adı"
                            inputProps={{ type: "text", maxLength: 38 }}
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
                          <a href={qr} download={`Masa ${i + 1}`}>
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
                        placeholder="Kategori Sırası"
                        value={updateCategoryOrder}
                        onChange={(e) => setUpdateCategoryOrder(e.target.value)}
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
                          categoryOrder !== updateCategoryOrder ||
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
                  style={{ padding: "6px", width: "100%" }}
                  open={openUpdateProduct}
                  onClose={handleCloseUpdateProduct}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className={styles.modal}>
                    <form
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "2rem",
                        padding: "2rem",
                      }}
                    >
                      <h2>Ürün Düzenle</h2>
                      <div
                        style={{
                          display: "flex",
                          alignItems: " center",
                          width: "100%",
                          gap: "2rem",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <InputLabel style={{ margin: "10px 0" }}>
                            Ürün Adı
                          </InputLabel>
                          <Input
                            label="Ürün Adı"
                            value={updateProduct}
                            inputProps={{ maxLength: 38 }}
                            onChange={(e) => setUpdateProduct(e.target.value)}
                          />
                        </div>
                        <div>
                          <InputLabel style={{ margin: "10px 0" }}>
                            Ürün Fiyatı
                          </InputLabel>
                          <Input
                            label="Ürün Fiyatı"
                            value={updatePrice}
                            type="number"
                            onChange={(e) => setUpdatePrice(e.target.value)}
                          />
                        </div>
                      </div>
                      <div style={{ width: "100%" }}>
                        <InputLabel style={{ margin: "10px 0" }}>
                          Ürün Açıklaması
                        </InputLabel>
                        <Input
                          fullWidth
                          label="Ürün Açıklaması"
                          value={updateDescription}
                          inputProps={{ maxLength: 100 }}
                          onChange={(e) => setUpdateDescription(e.target.value)}
                        />
                      </div>
                      <div style={{ width: "100%" }}>
                        <InputLabel style={{ margin: "10px 0" }}>
                          Ürün Alt Kategorisi
                        </InputLabel>
                        <Input
                          fullWidth
                          label="Ürün Alt Kategorisi"
                          value={updateSubCategory}
                          inputProps={{ maxLength: 100 }}
                          onChange={(e) =>
                            setUpdateSubCategory(
                              e.target.value
                                .trim()
                                .toLowerCase()
                                .split(" ")
                                .map((a) =>
                                  a
                                    ?.toLowerCase()
                                    .replace(a[0], a[0]?.toUpperCase())
                                )
                                .join(" ")
                            )
                          }
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: " center",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <InputLabel style={{ margin: "10px 0" }}>
                            Ürün Kategorisi
                          </InputLabel>
                          <Select
                            style={{ minWidth: "7rem" }}
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={updateProductCategory}
                            onChange={handleUpdateChange}
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
                            {categories.map((category) => (
                              <MenuItem
                                key={category.name}
                                value={category.name}
                                style={{
                                  padding: "10px",
                                  width: "100%",
                                }}
                              >
                                {category.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <InputLabel style={{ margin: "10px 0" }}>
                            Ürün Görseli
                          </InputLabel>
                          <Input
                            accept="image/*"
                            label="Ürün Görseli"
                            id="icon-button-file"
                            style={{ width: "14rem" }}
                            onChange={(e) => {
                              setFile(e.target.files[0]);
                              setIsPreview(true);
                            }}
                            type="file"
                          />
                        </div>
                      </div>
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
                          width="160px"
                          height="160px"
                          style={{ objectFit: "contain" }}
                        ></img>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          justifyContent: "flex-end",
                          gap: "10px",
                        }}
                      >
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => {
                            handleCloseUpdateProduct();
                            setFile("");
                            setIsPreview(false);
                            setUpdateProduct("");
                            setUpdatePrice(null);
                            setUpdateDescription("");
                            setUpdateSubCategory("");
                            setUpdateProductCategory(null);
                          }}
                        >
                          Vazgeç
                        </Button>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={(e) => {
                            if (
                              name !== updateProduct ||
                              price !== updatePrice ||
                              description !== updateDescription ||
                              subCategory !== updateSubCategory ||
                              category.length !==
                                updateProductCategory.length ||
                              category[0] !== updateProductCategory[0] ||
                              typeof file === "object"
                            ) {
                              handleUpdateProduct(e);
                            } else {
                              handleCloseUpdateProduct();
                              setFile("");
                              setIsPreview(false);
                              setUpdateProduct("");
                              setUpdatePrice(null);
                              setUpdateDescription("");
                              setUpdateSubCategory("");
                              setUpdateProductCategory(null);
                              enqueueSnackbar("Değişiklik Yapılmadı", {
                                variant: "info",
                              });
                            }
                          }}
                          style={{ marginLeft: "1rem" }}
                        >
                          Onayla
                        </Button>
                      </div>
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
                            inputProps={{ type: "text", maxLength: 38 }}
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
                        <ListItem
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                          }}
                        >
                          <InputLabel style={{ margin: "10px 0" }}>
                            Kategori Sırası
                          </InputLabel>
                          <Input
                            label="Ürün Adı"
                            value={categoryOrder}
                            inputProps={{ type: "number", maxLength: 100 }}
                            onChange={(e) => setCategoryOrder(e.target.value)}
                          />
                        </ListItem>
                        <ListItem>
                          <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            onClick={(e) => {
                              if (
                                categories.filter((c) => c.name === addCategory)
                                  .length !== 0
                              ) {
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
                <ModalMui open={openListType} onClose={handleCloseListType}>
                  <Box className={styles.modal}>
                    <h2 style={{ textAlign: "center", padding: "1rem" }}>
                      Listeleme Türünü Değiştir
                    </h2>
                    <form>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4rem",
                          padding: "2rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: "1rem",
                          }}
                        >
                          <input
                            style={{ cursor: "pointer" }}
                            type="radio"
                            name="listType"
                            checked={listType === "text" ? true : false}
                            onChange={() => setListType("text")}
                          ></input>
                          <h3 className={styles.listTypeHeader}>
                            Sadece Metin
                          </h3>
                          <img
                            className={styles.listTypeImage}
                            src="https://res.cloudinary.com/dlyjd3mnb/image/upload/v1652116621/h3ap73zblrlw6uows3bk.png"
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: "1rem",
                          }}
                        >
                          <input
                            style={{ cursor: "pointer" }}
                            checked={listType === "image" ? true : false}
                            type="radio"
                            name="listType"
                            onChange={() => setListType("image")}
                          ></input>
                          <h3 className={styles.listTypeHeader}>
                            Görsel ile birlikte
                          </h3>
                          <img
                            className={styles.listTypeImage}
                            src="https://res.cloudinary.com/dlyjd3mnb/image/upload/v1652113749/p7kovtut5b2mls3qjask.png"
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          justifyContent: "flex-end",
                          gap: "2rem",
                          padding: "2rem",
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={handleCloseListType}
                        >
                          Vazgeç
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleUpdateListType}
                        >
                          Onayla
                        </Button>
                      </div>
                    </form>
                  </Box>
                </ModalMui>
                <ModalMui open={openGallery} onClose={handleCloseGallery}>
                  <Box className={styles.modal}>
                    <h2 style={{ textAlign: "center", padding: "1rem" }}>
                      Galeriyi Düzenle
                    </h2>
                    <form
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "2rem",
                        padding: "1rem 2rem",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Input
                        type="text"
                        value={galleryName}
                        fullWidth
                        placeholder="Galeri Adı"
                        onChange={(e) => setGalleryName(e.target.value)}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "3rem",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                          }}
                        >
                          <input
                            style={{ cursor: "pointer" }}
                            type="radio"
                            name="isActive"
                            checked={isGalleryActive === true ? true : false}
                            onChange={() => setIsGalleryActive(true)}
                          ></input>
                          <h3 className={styles.listTypeHeader}>Aktif</h3>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                          }}
                        >
                          <input
                            style={{ cursor: "pointer" }}
                            type="radio"
                            name="isActive"
                            checked={isGalleryActive === false ? true : false}
                            onChange={() => setIsGalleryActive(false)}
                          ></input>
                          <h3 className={styles.listTypeHeader}>Pasif</h3>
                        </div>
                      </div>
                      <h3 style={{ marginBottom: "0" }}>Kapak Fotoğrafı</h3>
                      <div>
                        {galleryImage ? (
                          <img
                            style={{
                              width: "7rem",
                              height: "5rem",
                              objectFit: "contain",
                            }}
                            src={galleryImage}
                          ></img>
                        ) : (
                          <p>Görsel bulunamadı.</p>
                        )}
                      </div>
                      <Input
                        accept="image/*"
                        id="icon-button-file"
                        onChange={(e) => {
                          setGalleryImage(e.target.files[0]);
                        }}
                        type="file"
                      />
                      <h3 style={{ marginBottom: "0" }}>Galeri</h3>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                        }}
                      >
                        {images.length > 0 ? (
                          images.map((g) => (
                            <img
                              onMouseEnter={(e) => {
                                e.target.style.border = "1px solid gray";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.border = "none";
                              }}
                              onClick={() => {
                                setImages(
                                  images.filter((i) => i.image !== g?.image)
                                );
                              }}
                              alt={g?.image}
                              style={{
                                width: "7rem",
                                height: "5rem",
                                objectFit: "contain",
                                cursor: "pointer",
                              }}
                              key={g?.image}
                              src={g?.image}
                            ></img>
                          ))
                        ) : (
                          <p>Görsel bulunamadı.</p>
                        )}
                      </div>
                      <Input
                        accept="image/*"
                        id="icon-button-file"
                        onChange={(e) => {
                          setFile(e.target.files[0]);
                        }}
                        type="file"
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "92%",
                          justifyContent: "flex-end",
                          gap: "1rem",
                          margin: "1rem",
                        }}
                      >
                        <Button variant="outlined" onClick={handleCloseGallery}>
                          Vazgeç
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleUpdateGallery}
                        >
                          Onayla
                        </Button>
                      </div>
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
                >
                  Kategori Ekle
                </Button>
                <Button
                  className={styles.menuButtons}
                  variant="contained"
                  type="submit"
                  color="primary"
                  onClick={handleOpenUploadLogo}
                >
                  Logo Yükle
                </Button>
                <Button
                  className={styles.menuButtons}
                  variant="contained"
                  type="submit"
                  color="primary"
                  onClick={handleOpenListType}
                >
                  Listeleme Türü
                </Button>
                <Button
                  className={styles.menuButtons}
                  variant="contained"
                  type="submit"
                  color="primary"
                  onClick={handleOpenGallery}
                >
                  Galeri
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
