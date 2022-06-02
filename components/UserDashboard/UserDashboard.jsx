// Packages and Dependencies
import {
  Button,
  IconButton,
  Input,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { DataGrid, trTR, enUS } from "@mui/x-data-grid";
import QRCode from "qrcode";
import { fadeInRightBig } from "react-animations";
import Radium, { StyleRoot } from "radium";
import Box from "@mui/material/Box";
import { Loading, Modal, Spacer, Button as ButtonMui } from "@nextui-org/react";
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
import JSZip from "jszip";
import { useRouter } from "next/router";
import FileSaver from "file-saver";
import { useSnackbar } from "notistack";
// Styles
import styles from "./UserDashboard.module.css";
// Icons
import DownloadIcon from "@mui/icons-material/Download";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { PhotoCamera } from "@material-ui/icons";
import RateReviewIcon from "@mui/icons-material/RateReview";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import ViewListIcon from "@mui/icons-material/ViewList";
// Translation
import useTranslation from "next-translate/useTranslation";
// Cookies
import Cookies from "js-cookie";
import { Rating } from "@mui/material";

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
  // States
  const [order, setOrder] = useState(userOrder[0] || null);
  const [menu, setMenu] = useState(order?.menuv1 || order?.menuv2 || "");
  const [currency, setCurrency] = useState(menu?.currency);
  const [storeName, setStoreName] = useState(menu?.storeName || "");
  const [storeLinkName, setStoreLinkName] = useState(menu?.storeLinkName || "");
  const [products, setProducts] = useState([...(menu?.products || "")]);
  const [gallery, setGallery] = useState(menu?.gallery || null);
  const [categories, setCategories] = useState([...(menu?.categories || "")]);
  const [galleryName, setGalleryName] = useState(menu?.gallery?.name);
  const [taste, setTaste] = useState(menu?.ratings?.map((r) => r?.taste));
  const [speed, setSpeed] = useState(menu?.ratings?.map((r) => r?.speed));
  const [service, setService] = useState(menu?.ratings?.map((r) => r?.service));
  const [ratingsLength, setRatingsLength] = useState(menu?.ratings.length);
  const [reviews, setReviews] = useState(menu?.ratings.filter((r) => r.note));
  const [tasteRating, setTasteRating] = useState(null);
  const [speedRating, setSpeedRating] = useState(null);
  const [serviceRating, setServiceRating] = useState(null);
  useEffect(() => {
    if (taste.length > 0) {
      let sum = 0;
      for (let i = 0; i < taste.length; i++) {
        sum += taste[i];
      }
      setTasteRating(Math.floor(sum / ratingsLength));
    }
  }, [taste]);

  useEffect(() => {
    if (speed.length > 0) {
      let sum = 0;
      for (let i = 0; i < speed.length; i++) {
        sum += speed[i];
      }
      setSpeedRating(Math.floor(sum / ratingsLength));
    }
  }, [speed]);

  useEffect(() => {
    if (service.length > 0) {
      let sum = 0;
      for (let i = 0; i < service.length; i++) {
        sum += service[i];
      }
      setServiceRating(Math.floor(sum / ratingsLength));
    }
  }, [service]);

  const [storeLogo, setStoreLogo] = useState(
    menu?.storeLogo ||
      "https://res.cloudinary.com/dlyjd3mnb/image/upload/v1650137521/uploads/logoDefault_ez8obk.png"
  );
  const [isGalleryActive, setIsGalleryActive] = useState(
    menu?.gallery?.isActive || false
  );
  const [images, setImages] = useState(menu?.gallery?.images || []);
  const [galleryImage, setGalleryImage] = useState(
    menu?.gallery?.galleryImage || null
  );
  const [tableNum, setTableNum] = useState(menu?.tableNum || null);
  const [listType, setListType] = useState(menu?.listType || null);
  const arrayProducts = Array.from(products);
  let arrayCategories = Array.from(categories);
  const [version, setVersion] = useState(
    order?.product?.name === "Dijital Menü - V1" ? "v1" : "v2"
  );
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const theme = useTheme();
  const [updateProduct, setUpdateProduct] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateSubCategory, setUpdateSubCategory] = useState("");
  const [name, setName] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [updateCurrency, setUpdateCurrency] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedCategories, setUpdatedCategories] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [src, setSrc] = useState("");
  const [updateProductCategory, setUpdateProductCategory] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingForFirst, setIsFetchingForFirst] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const [addCategory, setAddCategory] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [secondStep, setSecondStep] = useState(false);
  const [category, setCategory] = useState([]);
  const [menusv1, setMenusv1] = useState([]);
  const [menusv2, setMenusv2] = useState([]);
  const [openReviews, setOpenReviews] = useState(false);
  const [categoryOrder, setCategoryOrder] = useState(null);
  const [updateCategoryOrder, setUpdateCategoryOrder] = useState(null);
  const [QRCodes, setQRCodes] = useState([]);
  const [deleteName, setDeleteName] = useState("");
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);
  const [updateCategory, setUpdateCategory] = useState([]);
  const [openUpdateCategory, setOpenUpdateCategory] = useState(false);
  const [openUpdateProduct, setOpenUpdateProduct] = useState(false);
  const [openDeleteProduct, setOpenDelete] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openUploadLogo, setOpenUploadLogo] = useState(false);
  const [openQRImages, setOpenQRImages] = useState(false);
  const [openListType, setOpenListType] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  let user;
  // Translation
  const { t } = useTranslation();
  // Animation
  const animate = {
    fadeInRightBig: {
      animation: "x 2s",
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
      animationName: Radium.keyframes(fadeInRightBig, "fadeInRightBig"),
    },
  };
  useEffect(() => {
    setTableNum(menu?.tableNum);
    setStoreName(menu?.storeName);
    setStoreLinkName(menu?.storeLinkName);
  }, [menu]);

  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }

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

  useEffect(() => {
    if (!menu) {
      setIsFirst(true);
    }
  }, [menu]);

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

  const handleOpenCurrency = () => {
    setOpenCurrency(true);
  };
  const handleOpenAddProduct = () => setOpenAddProduct(true);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseAddProduct = () => setOpenAddProduct(false);

  const handleOpenReviews = () => {
    setOpenReviews(true);
  };
  const handleCloseReviews = () => {
    setOpenReviews(false);
  };
  const handleCloseCurrency = () => {
    setOpenCurrency(false);
    setUpdateCurrency("");
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteCategory(false);
    setDeleteId("");
  };
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

  const handleUpdateChange = (event) => {
    const {
      target: { value },
    } = event;
    setUpdateProductCategory(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

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
  const handleZip = async (e) => {
    e.preventDefault();
    const zip = new JSZip();
    const folder = zip.folder(storeName);

    for (let i = 0; i < QRCodes.length; i++) {
      const base64String = QRCodes[i].replace("data:", "").replace(/^.+,/, "");
      folder.file(`${i + 1}.png`, base64String, { base64: true });
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      FileSaver.saveAs(content, `${storeName}.zip`);
    });
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
      let newSubCategory = updateSubCategory
        ?.trim()
        .toLowerCase()
        .split(" ")
        .map((a) => a?.toLowerCase().replace(a[0], a[0]?.toUpperCase()))
        .join(" ");
      const addCategory = () => {
        setUpdatedProducts([
          ...newProducts,
          {
            name: betterProductName,
            price: updatePrice,
            description: updateDescription,
            category: updateProductCategory,
            image: uploadRes?.data.url,
            subCategory: newSubCategory,
          },
        ]);
      };
      addCategory();
      handleCloseUpdateProduct();
    } catch (err) {
      console.log(err);
    }
  };

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
      return enqueueSnackbar(t("panel:galleryUpdated"), {
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
      return enqueueSnackbar(t("panel:same"), {
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
      return enqueueSnackbar(t("panel:changed"), {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      handleCloseListType();
    }
  };

  const handleSendCurrency = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    try {
      const updatedMenu = await axios.post(
        `/api/qr/${version}/${menu?.storeName}/currency`,
        {
          storeName,
          currency: updateCurrency,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      setCurrency(updatedMenu?.data?.currency);
      setUpdateCurrency("");
      handleCloseCurrency();
      setIsFetching(false);
      return enqueueSnackbar("Para birimi güncellendi", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      handleCloseCurrency();
      setIsFetching(false);
      return enqueueSnackbar("Para birimi güncellenemedi", {
        variant: "error",
      });
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
      return enqueueSnackbar(t("panel:productExist"), {
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
      enqueueSnackbar(t("panel:addedProduct"), { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setName("");
      setDescription("");
      setPrice("");
      setFile(null);
      enqueueSnackbar(t("panel:notAddedProduct"), { variant: "error" });
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
      enqueueSnackbar(t("panel:deletedProduct"), { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setDeleteId("");
      enqueueSnackbar(t("panel:notDeletedProduct"), { variant: "error" });
    }
    setIsFetching(false);
  };

  const deleteCategoryHandler = async () => {
    setIsFetching(true);
    if (
      products.map((a) => a?.category?.toString())?.includes(deleteName) ===
      true
    ) {
      setIsFetching(false);
      setDeleteId("");
      setDeleteName("");
      return enqueueSnackbar(t("panel:notDeletedCategory"), {
        variant: "error",
      });
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
      enqueueSnackbar(t("panel:deletedCategory"), { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setDeleteId("");
      setDeleteName("");
      enqueueSnackbar(t("panel:notDeletedCategory2"), { variant: "error" });
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
      setUpdateCategoryOrder(null);
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
      enqueueSnackbar(t("panel:productUpdated"), { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
    }
  };

  const handleSendUpdatedCategories = async () => {
    const newProducts = [];
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
      if (updatedMenu?.data?.status === "success") {
        newProducts = [[...products]];
        for (let i = 0; i < newProducts[0].length; i++) {
          if (newProducts[0][i]?.category?.includes(updateCategory)) {
            const index = newProducts[0][i]?.category.indexOf(updateCategory);
            newProducts[0][i]?.category.splice(index, 1);
            newProducts[0][i]?.category?.push(addCategory);
          }
        }
      }
      if (newProducts.length > 0) {
        await axios.patch(
          `/api/qr/${version}/${menu?.storeName}/menu`,
          {
            storeName,
            products: newProducts[0],
          },
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        );
      }
      if (updatedMenu?.data.menu) {
        setCategories(updatedMenu?.data?.menu?.categories);
      } else {
        setCategories(updatedMenu?.data?.menu?.categories);
      }
      setIsFetching(false);
      enqueueSnackbar(t("panel:categoryUpdated"), { variant: "success" });
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
      return enqueueSnackbar(t("panel:thereIsCategory"), {
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
      enqueueSnackbar(t("panel:addedCategory"), { variant: "success" });
    } catch (err) {
      console.log(err);
      handleCloseAddCategory();
      setIsFetching(false);
      setAddCategory("");
      setFile(null);
      enqueueSnackbar(t("panel:notAddedCategory"), { variant: "error" });
    }
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = () => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
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
      enqueueSnackbar(t("panel:uploadedLogo"), { variant: "success" });
    } catch (err) {
      console.log(err);
      setIsFetching(false);
      setFile(null);
      enqueueSnackbar(t("panel:notUploadedLogo"), { variant: "error" });
    }
  };

  const columns = [
    {
      field: "name",
      headerName: t("panel:product"),
      flex: 3,
      renderCell: (params) => {
        return (
          <div className={styles.product}>
            {params?.row.image ? (
              <>
                <img src={params?.row.image} alt="" className={styles.image} />
                <p>{params?.row.name}</p>
              </>
            ) : (
              <p>{params?.row.name}</p>
            )}
          </div>
        );
      },
    },
    {
      field: "price",
      headerName: t("panel:productPrice"),
      flex: 1,
      renderCell: (params) => {
        return (
          <span>
            {currency === "dolar"
              ? "$"
              : currency === "euro"
              ? "€"
              : currency === "lira"
              ? "₺"
              : ""}
            {params?.row.price}
          </span>
        );
      },
    },
    {
      field: "subCategory",
      headerName: t("panel:subCategory"),
      flex: 1,
      renderCell: (params) => {
        return (
          <div className={styles.product}>
            {params?.row?.subCategory ? (
              <p>{params?.row.subCategory}</p>
            ) : (
              <p>-</p>
            )}
          </div>
        );
      },
    },
    { field: "category", headerName: t("panel:productCategory"), flex: 1 },
    {
      field: "actions",
      headerName: t("panel:actions"),
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
              {t("panel:edit")}
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
              {t("panel:delete")}
            </Button>
          </Stack>
        );
      },
    },
  ];
  const reviewColumns = [
    {
      field: "note",
      headerName: t("common:notes"),
      flex: 1,
    },
  ];
  const categoryColumns = [
    {
      field: "name",
      headerName: t("panel:category"),
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
      headerName: t("panel:order"),
      flex: 1,
    },
    {
      field: "actions",
      headerName: t("panel:actions"),
      width: 200,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => {
                handleOpenUpdateCategory();
                setAddCategory(params.row.name);
                setUpdateCategory(params.row.name);
                setUpdateCategoryOrder(params.row.order);
                setCategoryOrder(params.row.order);
                setFile(params.row.image);
              }}
              style={{ fontSize: "12px", fontWeight: "500", width: "5rem" }}
              variant="outlined"
              color="warning"
            >
              {t("panel:edit")}
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
              {t("panel:delete")}
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
                  {t("panel:enterStoreName")}
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
                      label={t("panel:storeName")}
                      helperText={
                        storeName?.length === 0
                          ? t("panel:proveName")
                          : storeName?.length < 3
                          ? t("panel:minLength")
                          : containsSpecialChars(storeName) === true
                          ? t("panel:notSpecial")
                          : menusv1.filter((s) => s.storeName === storeName)
                              .length > 0 ||
                            menusv2.filter((s) => s.storeName === storeName)
                              .length > 0
                          ? t("panel:nameIsInUse")
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
                        {t("panel:next")}
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
                  {t("panel:enterTableNum")}
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
                          ? t("panel:enterTableNum")
                          : tableNum === 0
                          ? t("panel:tableZero")
                          : tableNum < 0
                          ? t("panel:tableNeg")
                          : tableNum > 200
                          ? t("panel:tableNumMax")
                          : ""
                      }
                      label={t("panel:numTable")}
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
                          tableNum < 201 &&
                          tableNum > 0 &&
                          tableNum !== 0
                        ) {
                          firstTimeHandler(e);
                        }
                      }}
                    >
                      {t("panel:save")}
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
          <div className={styles.sidebar}>
            {/*   <img src={src} alt="QR" className={styles.qrImg} /> */}
            <img src={storeLogo} alt="Logo" className={styles.logo} />
            <div>
              <h3 className={styles.sidebarHeader}>
                <DashboardIcon />
              </h3>
              <ul className={styles.sidebarList}>
                <li className={styles.li}>
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
                            minWidth: "11rem",
                            fontSize: "13px",
                            color: "#fbeee0",
                            border: "1px solid #fbeee0",
                          }}
                        >
                          {t("panel:seeWebsite")}
                        </Button>
                      </Stack>
                    </a>
                  </Link>
                </li>
                <li>
                  {order?.menuv2 && (
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        onClick={handleOpenQRImages}
                        style={{
                          height: "2rem",
                          minWidth: "11rem",
                          fontSize: "13px",
                          color: "#fbeee0",
                          border: "1px solid #fbeee0",
                        }}
                      >
                        {t("panel:downloadCodes")}
                      </Button>
                    </Stack>
                  )}
                  {order?.menuv1 && (
                    <a href={src} download={`${storeName}`}>
                      <Button
                        variant="outlined"
                        style={{
                          height: "2rem",
                          minWidth: "11rem",
                          fontSize: "13px",
                          color: "#fbeee0",
                          border: "1px solid #fbeee0",
                        }}
                      >
                        {t("panel:downloadCode")}
                      </Button>
                    </a>
                  )}
                </li>

                <li>
                  <Button
                    variant="outlined"
                    style={{
                      height: "2rem",
                      minWidth: "11rem",
                      fontSize: "13px",
                      color: "#fbeee0",
                      border: "1px solid #fbeee0",
                    }}
                    type="submit"
                    onClick={handleOpenUploadLogo}
                  >
                    {t("panel:uploadLogo")}
                  </Button>
                </li>
                <li>
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
                              minWidth: "11rem",
                              fontSize: "13px",
                              color: "#fbeee0",
                              border: "1px solid #fbeee0",
                            }}
                          >
                            {t("panel:orderPanel")}
                          </Button>
                        </Stack>
                      </a>
                    </Link>
                  )}
                </li>
              </ul>
            </div>
            <div>
              <h3 className={styles.sidebarHeader}>
                <DashboardCustomizeIcon />
              </h3>
              <ul className={styles.sidebarList}>
                <li>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{
                      minWidth: "10rem",
                      maxWidth: "10rem",
                    }}
                    color="primary"
                    disabled={categories.length > 0 ? false : true}
                    onClick={handleOpenAddProduct}
                    className={styles.menuButtons}
                  >
                    {t("panel:addProduct")}
                  </Button>
                </li>
                <li>
                  <Button
                    className={styles.menuButtons}
                    variant="contained"
                    style={{
                      minWidth: "10rem",
                      maxWidth: "10rem",
                    }}
                    type="submit"
                    color="primary"
                    onClick={handleOpenAddCategory}
                  >
                    {t("panel:addCategory")}
                  </Button>
                </li>
                <li>
                  <Button
                    className={styles.menuButtons}
                    variant="contained"
                    type="submit"
                    style={{
                      minWidth: "10rem",
                      maxWidth: "10rem",
                    }}
                    color="primary"
                    onClick={handleOpenListType}
                  >
                    {t("panel:listType")}
                  </Button>
                </li>
                <li>
                  <Button
                    className={styles.menuButtons}
                    variant="contained"
                    type="submit"
                    style={{
                      minWidth: "10rem",
                      maxWidth: "10rem",
                    }}
                    color="primary"
                    onClick={handleOpenGallery}
                  >
                    {t("panel:gallery")}
                  </Button>
                </li>
                <li>
                  <Button
                    className={styles.menuButtons}
                    variant="contained"
                    type="submit"
                    style={{
                      minWidth: "10rem",
                      maxWidth: "10rem",
                    }}
                    color="primary"
                    onClick={handleOpenCurrency}
                  >
                    {t("panel:currency")}
                  </Button>
                </li>
              </ul>
            </div>
          </div>
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
            <div className={styles.leftBox}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "2rem",
                  width: "100%",
                }}
              >
                <h3>{storeName.toUpperCase()}</h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Button variant="outlined" onClick={handleOpenReviews}>
                    <RateReviewIcon color="primary" />
                    <h6 className={styles.ratingHeaders}>
                      {t("common:feedbacks")}
                    </h6>
                  </Button>
                </div>
              </div>
              <span className={styles.col}>|</span>
              <div className={styles.ratings}>
                <div>
                  <h5 className={styles.ratingHeaders}>Lezzet</h5>

                  <Rating
                    readOnly
                    name="simple-controlled"
                    value={tasteRating}
                  />
                </div>
                <div>
                  <h5 className={styles.ratingHeaders}>Hız</h5>
                  <Rating
                    readOnly
                    name="simple-controlled"
                    value={speedRating}
                  />
                </div>
                <div>
                  <h5 className={styles.ratingHeaders}>Servis</h5>
                  <Rating
                    readOnly
                    name="simple-controlled"
                    value={serviceRating}
                  />
                </div>
              </div>
            </div>
            <div className={styles.actions}>
              <ModalMui
                open={openAddProduct}
                onClose={handleCloseAddProduct}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className={styles.modal}>
                  <form>
                    <List className={styles.list}>
                      <h3 className={styles.header}>{t("panel:addProduct")}</h3>

                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="name"
                          onChange={(e) => setName(e.target.value)}
                          label={t("panel:productName")}
                          inputProps={{ type: "text", maxLength: 38 }}
                          helperText={t("panel:forExample1")}
                        ></TextField>
                      </ListItem>
                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="description"
                          label={t("panel:productDesc")}
                          onChange={(e) => setDescription(e.target.value)}
                          inputProps={{ type: "text" }}
                          helperText={t("panel:forExample2")}
                        ></TextField>
                      </ListItem>
                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="subCategory"
                          onChange={(e) => setSubCategory(e.target.value)}
                          label={t("panel:productSubCategory")}
                          inputProps={{ type: "text", maxLength: 38 }}
                        ></TextField>
                      </ListItem>
                      <ListItem
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "2rem",
                        }}
                      >
                        <FormControl>
                          <InputLabel id="demo-multiple-chip-label">
                            {t("panel:category")}
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={category}
                            style={{ minWidth: "8rem" }}
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
                        <TextField
                          variant="outlined"
                          id="price"
                          onChange={(e) => setPrice(e.target.value)}
                          label={t("panel:price")}
                          inputProps={{ type: "number" }}
                          helperText={t("panel:forExample") + 50}
                        ></TextField>
                      </ListItem>
                      <ListItem
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                          flexDirection: "column",
                        }}
                      >
                        <InputLabel>{t("panel:productImage")}</InputLabel>
                        <Input
                          accept="image/*"
                          id="icon-button-file"
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </ListItem>
                      <ListItem
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "1rem",
                          paddingTop: "1rem",
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={handleCloseAddProduct}
                          color="primary"
                        >
                          {t("panel:discard")}
                        </Button>
                        <Button
                          variant="contained"
                          type="submit"
                          onClick={addProductHandler}
                          color="secondary"
                        >
                          {t("panel:add")}
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
                    {t("panel:qrCodes")}
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "100%",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleZip}
                    >
                      {t("panel:downloadAll")}
                    </Button>
                  </div>
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
                        <p>
                          {t("panel:tableNum")}
                          {i + 1}
                        </p>
                        <img style={{ width: "7rem" }} src={qr} />
                        <a href={qr} download={`Masa ${i + 1}`}>
                          <Button
                            color="primary"
                            style={{ width: "7rem" }}
                            variant="contained"
                          >
                            {t("panel:download")}
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </Box>
              </ModalMui>
              <ModalMui
                open={openReviews}
                onClose={handleCloseReviews}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className={styles.reviews}>
                  <h2 style={{ textAlign: "center", padding: "1rem" }}>
                    {t("common:feedbacks")}
                  </h2>
                  <div className={styles.gridReviews}>
                    <DataGrid
                      className={styles.data}
                      sx={{
                        "& .MuiDataGrid-renderingZone": {
                          maxHeight: "none !important",
                          minHeight: "none !important",
                        },
                        "& .MuiDataGrid-cell": {
                          lineHeight: "unset !important",
                          maxHeight: "none !important",
                          minHeight: "none !important",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        },
                        "& .MuiDataGrid-row": {
                          minHeight: "none !important",
                          maxHeight: "none !important",
                        },
                        virtualScrollerContent: {
                          height: "100% !important",
                          overflow: "scroll",
                        },
                        height: 1,
                        width: 1,
                        "& .dark": {
                          backgroundColor: "#264653",
                          color: "#fbeee0",
                        },
                      }}
                      localeText={
                        router.locale === "tr"
                          ? trTR.components.MuiDataGrid.defaultProps.localeText
                          : enUS.components.MuiDataGrid.defaultProps.localeText
                      }
                      rows={reviews}
                      columns={reviewColumns}
                      getRowId={(row) => row._id}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                    />
                  </div>
                </Box>
              </ModalMui>
              <ModalMui
                open={openCurrency}
                onClose={handleCloseCurrency}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className={styles.modal}>
                  <h1 style={{ textAlign: "center", padding: "1rem" }}>
                    {t("panel:currency")}
                  </h1>
                  <p style={{ textAlign: "center", padding: "0 1rem" }}>
                    {t("panel:currencyDesc")}
                  </p>
                  <div className={styles.currencies}>
                    <Button
                      variant={
                        updateCurrency
                          ? updateCurrency === "dolar"
                            ? "contained"
                            : "outlined"
                          : currency === "dolar"
                          ? "contained"
                          : "outlined"
                      }
                      type="submit"
                      color="primary"
                      onClick={() => setUpdateCurrency("dolar")}
                    >
                      {t("panel:dollar")} ($)
                    </Button>
                    <Button
                      variant={
                        updateCurrency
                          ? updateCurrency === "euro"
                            ? "contained"
                            : "outlined"
                          : currency === "euro"
                          ? "contained"
                          : "outlined"
                      }
                      type="submit"
                      color="primary"
                      onClick={() => setUpdateCurrency("euro")}
                    >
                      Euro (€)
                    </Button>
                    <Button
                      variant={
                        updateCurrency
                          ? updateCurrency === "lira"
                            ? "contained"
                            : "outlined"
                          : currency === "lira"
                          ? "contained"
                          : "outlined"
                      }
                      type="submit"
                      color="primary"
                      onClick={() => setUpdateCurrency("lira")}
                    >
                      {t("panel:lira")} (₺)
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "2rem",
                      padding: "1rem 2rem",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCloseCurrency}
                    >
                      {t("panel:discard")}
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleSendCurrency}
                    >
                      {t("panel:confirm")}
                    </Button>
                  </div>
                </Box>
              </ModalMui>
              <Modal
                width="24rem"
                style={{ padding: "1rem", margin: "10px" }}
                open={openUpdateCategory}
                onClose={handleCloseUpdateCategory}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Modal.Header>
                  <h2>{t("panel:editCategory")}</h2>
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
                    }}
                  >
                    <TextField
                      fullWidth
                      placeholder={t("panel:categoryName")}
                      value={addCategory}
                      onChange={(e) => setAddCategory(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      placeholder={t("panel:categoryOrder")}
                      value={updateCategoryOrder}
                      onChange={(e) => setUpdateCategoryOrder(e.target.value)}
                    />
                    <InputLabel style={{ textAlign: "start", width: "100%" }}>
                      {t("common:categoryImage")}
                    </InputLabel>
                    <Input
                      fullWidth
                      accept="image/*"
                      label={t("common:categoryImage")}
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
                        width="160px"
                        height="160px"
                        style={{ objectFit: "contain" }}
                      ></img>
                    )}
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex",
                      gap: "1rem",
                    }}
                  >
                    <Button
                      onClick={handleCloseUpdateCategory}
                      color="primary"
                      variant="outlined"
                    >
                      {t("panel:discard")}
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
                          enqueueSnackbar(t("panel:notChanged"), {
                            variant: "info",
                          });
                        }
                      }}
                      style={{ marginLeft: "1rem" }}
                    >
                      {t("panel:confirm")}
                    </Button>
                  </div>
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
                    }}
                  >
                    <h2>{t("panel:editProduct")}</h2>
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
                          {t("panel:productName")}
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
                          {t("panel:productPrice")}
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
                        {t("panel:productDesc")}
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
                        {t("panel:productSubCategory")}
                      </InputLabel>
                      <Input
                        fullWidth
                        label="Ürün Alt Kategorisi"
                        value={updateSubCategory}
                        inputProps={{ maxLength: 100 }}
                        onChange={(e) => setUpdateSubCategory(e.target.value)}
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
                          {t("panel:productCategory")}
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
                          {t("panel:productImage")}
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
                        {t("panel:discard")}
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
                            category.length !== updateProductCategory.length ||
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
                            enqueueSnackbar(t("panel:notChanged"), {
                              variant: "info",
                            });
                          }
                        }}
                        style={{ marginLeft: "1rem" }}
                      >
                        {t("panel:confirm")}
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
                      <h3 className={styles.header}>
                        {t("panel:addCategory")}
                      </h3>
                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="category"
                          label={t("panel:category")}
                          inputProps={{ type: "text", maxLength: 38 }}
                          onChange={(e) => setAddCategory(e.target.value)}
                          helperText={t("panel:forExample3")}
                        ></TextField>
                      </ListItem>
                      <ListItem
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                          flexDirection: "column",
                          margin: "1rem 0",
                        }}
                      >
                        <InputLabel>{t("panel:productImage")}</InputLabel>
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
                        <TextField
                          label={t("panel:order")}
                          value={categoryOrder}
                          inputProps={{ type: "number", maxLength: 100 }}
                          onChange={(e) => setCategoryOrder(e.target.value)}
                        />
                      </ListItem>
                      <ListItem
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "1rem",
                        }}
                      >
                        <Button
                          variant="outlined"
                          type="submit"
                          onClick={handleCloseAddCategory}
                          color="primary"
                        >
                          {t("common:discard")}
                        </Button>
                        <Button
                          variant="contained"
                          type="submit"
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
                          color="secondary"
                        >
                          {t("panel:add")}
                        </Button>
                      </ListItem>
                    </List>
                  </form>
                </Box>
              </ModalMui>
              <ModalMui open={openListType} onClose={handleCloseListType}>
                <Box className={styles.modal}>
                  <h2 style={{ textAlign: "center" }}>{t("panel:listType")}</h2>
                  <form>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "3rem",
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
                          {t("panel:text")}
                        </h3>
                        <img
                          className={styles.listTypeImage}
                          src={
                            router.locale === "tr"
                              ? "https://res.cloudinary.com/dlyjd3mnb/image/upload/v1652116621/h3ap73zblrlw6uows3bk.png"
                              : "https://res.cloudinary.com/dlyjd3mnb/image/upload/v1653995773/xlsyevzt8jvp9vqurgf0.png"
                          }
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
                          {t("panel:image")}
                        </h3>
                        <img
                          className={styles.listTypeImage}
                          src={
                            router.locale === "tr"
                              ? "https://res.cloudinary.com/dlyjd3mnb/image/upload/v1652113749/p7kovtut5b2mls3qjask.png"
                              : "https://res.cloudinary.com/dlyjd3mnb/image/upload/v1653995774/qgmoxg5wc5nlybtq3dho.png"
                          }
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
                        color="primary"
                        variant="outlined"
                        onClick={handleCloseListType}
                      >
                        {t("panel:discard")}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleUpdateListType}
                      >
                        {t("panel:confirm")}
                      </Button>
                    </div>
                  </form>
                </Box>
              </ModalMui>
              <ModalMui open={openGallery} onClose={handleCloseGallery}>
                <Box className={styles.modal}>
                  <h2 style={{ textAlign: "center", padding: "1rem" }}>
                    {t("panel:gallery")}
                  </h2>
                  <form
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                      padding: "0 1rem",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <TextField
                      type="text"
                      value={galleryName}
                      fullWidth
                      placeholder={t("panel:galleryName")}
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
                        <h3 className={styles.listTypeHeader}>
                          {t("panel:active")}
                        </h3>
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
                        <h3 className={styles.listTypeHeader}>
                          {t("panel:passive")}
                        </h3>
                      </div>
                    </div>
                    <h3 style={{ marginBottom: "0" }}>
                      {t("panel:galleryCover")}
                    </h3>
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
                        <p>{t("common:notFoundImage")}</p>
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
                    <h3 style={{ marginBottom: "0" }}>{t("panel:gallery")}</h3>
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
                        <p>{t("panel:imageNotFound")}</p>
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
                        {t("panel:discard")}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleUpdateGallery}
                      >
                        {t("panel:confirm")}
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
                      <h3 className={styles.header}>{t("panel:uploadLogo")}</h3>

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
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "1rem",
                          paddingTop: "1rem",
                        }}
                      >
                        <Button
                          variant="outlined"
                          type="submit"
                          onClick={handleCloseUploadLogo}
                          color="primary"
                        >
                          {t("panel:discard")}
                        </Button>
                        <Button
                          variant="contained"
                          type="submit"
                          onClick={uploadLogoHandler}
                          color="secondary"
                        >
                          {t("panel:upload")}
                        </Button>
                      </ListItem>
                    </List>
                  </form>
                </Box>
              </ModalMui>
              <ModalMui
                width="24rem"
                open={openDeleteProduct}
                onClose={handleCloseDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ padding: "1rem", margin: "10px" }}
              >
                <Box className={styles.modal}>
                  <form>
                    <List className={styles.list}>
                      <h3 className={styles.header}>{t("panel:isSure")}</h3>

                      <ListItem>
                        <p>
                          {deleteCategory
                            ? t("panel:category")
                            : t("panel:product")}
                          ,
                          <span className={styles.deleteDescription}>
                            {deleteName}
                          </span>
                          {t("panel:willDelete")}
                        </p>
                      </ListItem>
                    </List>
                  </form>
                  <div className={styles.modalButtons}>
                    <Button
                      variant="outlined"
                      type="submit"
                      onClick={() => {
                        handleCloseDelete();
                        setDeleteCategory(false);
                      }}
                    >
                      {t("panel:discard")}
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      color="secondary"
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
                      {t("panel:confirm")}
                    </Button>
                  </div>
                </Box>
              </ModalMui>
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
                  <h3 className={styles.titles}>{t("panel:productList")}</h3>
                </div>
                {isLoading ? (
                  <p>{t("loading:loading")}</p>
                ) : products?.length > 0 ? (
                  <div className={styles.grid}>
                    <DataGrid
                      className={styles.data}
                      sx={{
                        "& .MuiDataGrid-renderingZone": {
                          maxHeight: "none !important",
                          minHeight: "none !important",
                        },
                        "& .MuiDataGrid-cell": {
                          lineHeight: "unset !important",
                          maxHeight: "none !important",
                          minHeight: "none !important",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        },
                        "& .MuiDataGrid-row": {
                          minHeight: "none !important",
                          maxHeight: "none !important",
                        },
                        virtualScrollerContent: {
                          height: "100% !important",
                          overflow: "scroll",
                        },
                        height: 1,
                        width: 1,
                        "& .dark": {
                          backgroundColor: "#264653",
                          color: "#fbeee0",
                        },
                      }}
                      localeText={
                        router.locale === "tr"
                          ? trTR.components.MuiDataGrid.defaultProps.localeText
                          : enUS.components.MuiDataGrid.defaultProps.localeText
                      }
                      rows={products}
                      getRowId={(row) => `${row.name}${row.price}`}
                      columns={columns}
                      pageSize={pageSize}
                      onPageSizeChange={(newPageSize) =>
                        setPageSize(newPageSize)
                      }
                      rowsPerPageOptions={[10, 20, 30]}
                    />
                  </div>
                ) : (
                  <p>{t("common:notFoundProduct")}</p>
                )}
              </div>
              <div style={{ height: "100%", width: "100%" }}>
                <div className={styles.headers}>
                  <ViewListIcon color="primary" />
                  <h3 className={styles.titles}>{t("panel:categoryList")}</h3>
                </div>
                {isLoading ? (
                  <p>{t("common:loading")}</p>
                ) : categories?.length > 0 ? (
                  <div className={styles.grid}>
                    <DataGrid
                      className={styles.data}
                      localeText={
                        router.locale === "tr"
                          ? trTR.components.MuiDataGrid.defaultProps.localeText
                          : enUS.components.MuiDataGrid.defaultProps.localeText
                      }
                      rows={categories}
                      getRowId={(row) => `${row.name}${row.price}`}
                      columns={categoryColumns}
                      pageSize={10}
                      sx={{
                        "& .MuiDataGrid-renderingZone": {
                          maxHeight: "none !important",
                          minHeight: "none !important",
                        },
                        "& .MuiDataGrid-cell": {
                          lineHeight: "unset !important",
                          maxHeight: "none !important",
                          minHeight: "none !important",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        },
                        "& .MuiDataGrid-row": {
                          minHeight: "none !important",
                          maxHeight: "none !important",
                        },
                        virtualScrollerContent: {
                          height: "100% !important",
                          overflow: "scroll",
                        },
                        height: 1,
                        width: 1,
                        "& .dark": {
                          backgroundColor: "#264653",
                          color: "#fbeee0",
                        },
                      }}
                    />
                  </div>
                ) : (
                  t("panel:categoryNotFound")
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
