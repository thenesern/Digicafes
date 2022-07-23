import React, { useState } from "react";
import { Button, List, ListItem } from "@material-ui/core";
import { Box, Input, InputLabel, TextField } from "@mui/material";
import { Switch } from "@nextui-org/react";
import Modal from "@mui/material/Modal";
import styles from "../../BookingDashboard.module.css";
import useTranslation from "next-translate/useTranslation";
import { useSnackbar } from "notistack";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { trTR } from "@mui/x-data-grid";
import Image from "next/image";
import { nanoid } from "@reduxjs/toolkit";
import { Button as NextButton } from "@nextui-org/react";
import DeleteIcon from "@mui/icons-material/Delete";

const EventsModal = (props) => {
  const [events, setEvents] = useState(props?.store?.events || []);
  const [eventName, setEventName] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [pageSize, setPageSize] = useState(5);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [openDeleteEvent, setOpenDeleteEvent] = useState(false);
  const [deleteEvent, setDeleteEvent] = useState(null);

  const handleUpdateEvents = async (e) => {
    e.preventDefault();
    let isReady = false;
    try {
      if (deleteEvent) {
        setEvents(events?.filter((event) => event?._id !== deleteEvent?._id));
        isReady = true;
      } else {
        await axios.post(
          `/api/booking/${props?.store?.storeName}/events`,
          {
            storeName: props?.store?.storeName,
            events: events,
          },
          {
            headers: { authorization: `Bearer ${props?.user?.token}` },
          }
        );
      }
      if (isReady) {
        props.setIsFetching(true);
        await axios.post(
          `/api/booking/${props?.store?.storeName}/events`,
          {
            storeName: props?.store?.storeName,
            events: events?.filter((event) => event?._id !== deleteEvent?._id),
          },
          {
            headers: { authorization: `Bearer ${props?.user?.token}` },
          }
        );
        props.setIsFetching(false);
        setOpenDeleteEvent(false);
        setDeleteEvent("");
        isReady = false;
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddEvents = async (e) => {
    e.preventDefault();
    if (!eventName) {
      enqueueSnackbar("Lütfen bir etkinlik adı giriniz.", {
        variant: "error",
      });
      return props.setOpenEvents(false);
    }
    if (!eventImage) {
      enqueueSnackbar("Lütfen bir etkinlik görseli ekleyiniz.", {
        variant: "error",
      });
      return props.setOpenEvents(false);
    }
    if (!eventDescription) {
      enqueueSnackbar("Lütfen bir etkinlik açıklaması giriniz.", {
        variant: "error",
      });
      return props.setOpenEvents(false);
    }
    if (!eventDate) {
      enqueueSnackbar("Lütfen bir etkinlik tarihi seçiniz.", {
        variant: "error",
      });
      return props.setOpenEvents(false);
    }
    props.setIsFetching(true);
    let isReady = false;
    const data = new FormData();
    data.append("file", eventImage);
    data.append("upload_preset", "uploads");
    try {
      let uploadRes;
      if (eventImage) {
        uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dlyjd3mnb/image/upload",
          data
        );
      }
      if (uploadRes) {
        setEvents((oldEvent) => [
          ...oldEvent,
          {
            name: eventName,
            image: uploadRes?.data.url,
            description: eventDescription,
            date: eventDate,
          },
        ]);
        isReady = true;
      }
      if (isReady) {
        await axios.post(
          `/api/booking/${props?.store?.storeName}/events`,
          {
            storeName: props?.store?.storeName,
            events: events,
          },
          {
            headers: { authorization: `Bearer ${props?.user?.token}` },
          }
        );
      }
      isReady = false;
      props.setOpenEvents(false);
      props.setIsFetching(false);
      setEventName("");
      setEventDate("");
      setEventImage("");
      setEventDescription("");
      setIsAddingEvent(false);
      enqueueSnackbar("Etkinlikler güncellendi.", {
        variant: "success",
      });
    } catch (err) {
      console.log(err);
      props.setOpenEvents(false);
      props.setIsFetching(false);
      enqueueSnackbar("Etkinlikler güncellenemedi.", {
        variant: "error",
      });
    }
  };

  const columns = [
    {
      field: "image",
      headerName: "Görsel",
      width: 160,
      renderCell: (params) => {
        return (
          <Image
            src={params.row.image}
            width="200"
            height="100"
            alt={params.row.name}
          />
        );
      },
    },
    {
      field: "name",
      headerName: "Başlık",
      flex: 1,
      renderCell: (params) => {
        return <div>{params.row.name}</div>;
      },
    },
    {
      field: "date",
      headerName: "Tarih",
      flex: 1,
      renderCell: (params) => {
        return <div>{new Date(params.row.date).toLocaleDateString()}</div>;
      },
    },
    {
      field: "description",
      headerName: "Açıklama",
      flex: 1,
      renderCell: (params) => {
        return <div>{params.row.description}</div>;
      },
    },
    {
      field: "action",
      headerName: "Düzenle",
      width: 240,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <h5>Pasif</h5>
            <Switch
              checked={params.row.isActive}
              onChange={(e) => {
                events.filter(
                  (event) => event._id === params.row._id
                )[0].isActive = !params.row.isActive;
                handleUpdateEvents(e);
              }}
            />
            <h5>Aktif</h5>
            <NextButton
              flat
              color="error"
              auto
              className={styles.delete}
              onClick={() => {
                setOpenDeleteEvent(true);
                setDeleteEvent(
                  events.filter((event) => event?._id === params.row?._id)[0]
                );
              }}
            >
              <DeleteIcon />
            </NextButton>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        open={props.openEvents}
        onClose={() => {
          props.setOpenEvents(false);
        }}
      >
        <Box className={styles.modal} style={{ width: "48rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{ textAlign: "center", padding: "1rem", color: "#000814" }}
            >
              Etkinlikler
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <h5>Tabloyu Göster</h5>
              <Switch
                checked={isAddingEvent}
                onChange={() => setIsAddingEvent(!isAddingEvent)}
              />
              <h5>Etkinlik Ekle</h5>
            </div>
          </div>
          {isAddingEvent ? (
            <form
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0 1rem",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <List
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <ListItem>
                  <TextField
                    id="standard-basic"
                    label="Etkinlik Adı"
                    fullWidth
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value.trim())}
                  ></TextField>
                </ListItem>
                <ListItem style={{ display: "flex", flexDirection: "column" }}>
                  <InputLabel
                    align="left"
                    style={{ width: "100%", padding: "10px 0" }}
                  >
                    Etkinlik Görseli
                  </InputLabel>
                  <Input
                    fullWidth
                    accept="image/*"
                    id="icon-button-file"
                    onChange={(e) => {
                      setEventImage(e.target.files[0]);
                    }}
                    type="file"
                  ></Input>
                </ListItem>
                <ListItem>
                  <TextField
                    id="standard-basic"
                    fullWidth
                    label="Etkinlik Açıklaması"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value.trim())}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <TextField
                    id="date"
                    fullWidth
                    label="Etkinlik Tarihi"
                    type="date"
                    defaultValue={eventDate}
                    onChange={(e) => setEventDate(new Date(e.target.value))}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </ListItem>
              </List>
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
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    props.setOpenEvents(false);
                  }}
                >
                  {t("panel:discard")}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAddEvents}
                >
                  {t("panel:add")}
                </Button>
              </div>
            </form>
          ) : (
            <DataGrid
              rows={events || []}
              columns={columns}
              density="comfortable"
              getRowId={(row) => row?._id || nanoid()}
              autoHeight
              localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
              disableSelectionOnClick
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 15]}
              pagination
            />
          )}
        </Box>
      </Modal>
      <Modal
        open={openDeleteEvent}
        onClose={() => {
          setOpenDeleteEvent(false);
        }}
      >
        <Box className={styles.modal}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{ textAlign: "center", padding: "1rem", color: "#000814" }}
            >
              Emin misiniz?
            </h2>
          </div>
          <form
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0 1rem",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <List
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <ListItem>
                <h3 align="left" style={{ width: "100%" }}>
                  Etkinlik, &quot;{deleteEvent?.name}&quot; silinecek.
                </h3>
              </ListItem>
            </List>
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
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpenDeleteEvent(false);
                  setDeleteEvent("");
                }}
              >
                {t("panel:discard")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdateEvents}
              >
                {t("panel:confirm")}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default EventsModal;
