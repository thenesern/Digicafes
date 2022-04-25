import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { Button, Input, Textarea } from "@nextui-org/react";
import styles from "./ContactForm.module.css";
import { useState } from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ErrorIcon from "@mui/icons-material/Error";

const ContactForm = () => {
  const form = useRef();
  const [sent, setSent] = useState(false);
  const [fail, setFail] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    if (
      form.current[0].value &&
      form.current[1].value &&
      form.current[2].value.includes("@") &&
      form.current[3].value.length > 10
    ) {
      emailjs
        .sendForm(
          "service_ybm8t0q",
          "template_avsp701",
          form.current,
          "PMwUruduj_g5Npval"
        )
        .then(
          (result) => {
            setSent(true);
            setFail(false);
            console.log(result.text);
          },
          (error) => {
            console.log(error.text);
          }
        );
      form.current[0].value = "";
      form.current[1].value = "";
      form.current[2].value = "";
      form.current[3].value = "";
    } else {
      form.current[0].value = "";
      form.current[1].value = "";
      form.current[2].value = "";
      form.current[3].value = "";
      setSent(false);
      setFail(true);
    }
    setTimeout(() => {
      setSent(false);
      setFail(false);
    }, 5000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contact}>
        <h1 className={styles.header}>İletişim</h1>
        <form ref={form} className={styles.form} onSubmit={sendEmail}>
          <div className={styles.inputs}>
            <div className={styles.name}>
              <Input
                underlined
                labelPlaceholder="Adınız"
                color="success"
                name="firstName"
              />
              <Input
                underlined
                name="lastName"
                labelPlaceholder="Soyadınız"
                color="success"
              />
            </div>
            <Input
              underlined
              labelPlaceholder="E-Mail"
              color="success"
              name="user_email"
            />
          </div>
          <Textarea
            placeholder="Mesajınız."
            name="message"
            style={{ width: "24rem", minHeight: "6rem" }}
          />
          <Button
            onClick={(e) => {
              sendEmail(e);
            }}
            color="secondary"
            auto
            style={{
              width: "12rem",
            }}
            className={styles.submit}
          >
            Gönder
          </Button>
        </form>
        {sent && (
          <div className={styles.success}>
            <p>Form Başarıyla Gönderildi.</p>
            <CheckBoxIcon color="success" />
          </div>
        )}
        {fail && (
          <div className={styles.error}>
            <p>Form Gönderilemedi!</p>
            <ErrorIcon color="error" />
          </div>
        )}
      </div>
    </div>
  );
};
export default ContactForm;
