// Packages and Dependencies
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import {
  Box,
  Button,
  List,
  ListItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
// Context
import { Store } from "../../../../redux/store";
import { useContext } from "react";
// Styles
import styles from "./ProductTable.module.css";

const ProductTable = (props) => {
  const [id, setId] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const handleAdd = async ({
    name,
    description,
    price,
    category,
    rawFeatures,
  }) => {
    const features = rawFeatures.split(",");
    try {
      await axios.post(
        `/api/product`,
        {
          name,
          description,
          price,
          category,
          features,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      handleCloseNew();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/product/${id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
    } catch (err) {
      console.log(err);
    }
  };
  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 2,
    },
    {
      field: "name",
      headerName: "Ürün / Hizmet Adı",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Fiyat",
      flex: 1,
      renderCell: (params) => {
        return <div className={styles.userListItem}>{params.row.price}</div>;
      },
    },
    {
      field: "description",
      headerName: "Açıklama",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Kategori",
      flex: 1,
    },
    {
      field: "period",
      headerName: "Dönem",
      flex: 1,
    },
    {
      field: "features",
      headerName: "Özellikler",
      flex: 2,
    },
  ];
  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const handleClose = () => setOpen(false);
  const handleCloseNew = () => setOpenNew(false);
  return (
    <div className={styles.datatable}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.box}>
          <div className={styles.modalHeader}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{ fontWeight: "600", color: "#001219" }}
            >
              Emin misiniz?
            </Typography>
          </div>
          <div className={styles.modalBody}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Ürün / Hizmet, ({name}) silinecek.
            </Typography>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.discard} onClick={handleClose}>
              Vazgeç
            </button>
            <button
              className={styles.delete}
              onClick={() => {
                handleDelete(id);
                handleClose();
              }}
            >
              Onayla
            </button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openNew}
        onClose={handleCloseNew}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.box2}>
          <div className={styles.modalHeader}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{ fontWeight: "600", color: "#001219" }}
            >
              Ürün / Hizmet Ekle
            </Typography>
          </div>
          <div className={styles.modalBody}>
            <form className={styles.form} onSubmit={handleSubmit(handleAdd)}>
              <List>
                <ListItem>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="name"
                        label="Ürün / Hizmet Adı"
                        inputProps={{ type: "name" }}
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
                <ListItem>
                  <Controller
                    name="category"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="category"
                        label="Kategori"
                        inputProps={{ type: "category" }}
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
                <ListItem>
                  <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="description"
                        label="Açıklama"
                        inputProps={{ type: "description" }}
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
                <ListItem>
                  <Controller
                    name="price"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="price"
                        label="Fiyat"
                        inputProps={{ type: "price" }}
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
                <ListItem>
                  <Controller
                    name="rawFeatures"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="rawFeatures"
                        label="Özellikler"
                        inputProps={{ type: "rawFeatures" }}
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    color="primary"
                    onSubmit={handleSubmit(handleAdd)}
                  >
                    Ekle
                  </Button>
                </ListItem>
              </List>
            </form>
          </div>
        </Box>
      </Modal>
      <div className={styles.datatableTitle}>
        <h5 className={styles.title}>Ürünler / Hizmetler</h5>
      </div>
      <div className={styles.tableDiv}>
        <DataGrid
          rows={props.products}
          columns={columns}
          getRowId={(row) => row._id}
          className={styles.table}
          disableSelectionOnClick
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 30]}
          pagination
        />
      </div>
    </div>
  );
};

export default ProductTable;
