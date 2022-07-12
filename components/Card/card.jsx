// Packages and Dependencies
import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import Cards from "react-credit-cards";
// Styles
import "react-credit-cards/es/styles-compiled.css";
import styles from "./card.module.css";

function useCard() {
  const [number, setCardNumber] = useState("");
  const [name, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focus, setFocus] = useState("");

  return {
    number,
    name,
    expiry,
    cvc,
    render: (
      <div id="PaymentForm" className={styles.container}>
        <Cards
          cvc={cvc}
          expiry={expiry}
          focused={focus}
          name={name}
          number={number}
          placeholders={{ name: "AD SOYAD" }}
        />
        <form className={styles.form}>
          <Input
            clearable
            className={styles.input}
            bordered
            width="100%"
            color="primary"
            size="lg"
            name="name"
            onChange={(e) => setCardName(e.target.value)}
            onFocus={(e) => setFocus(e.target.name)}
            placeholder="Kartın Üzerindeki Ad Soyad"
            aria-label="name"
          />
          <Input
            clearable
            bordered
            className={styles.input}
            width="100%"
            color="primary"
            size="lg"
            type="tel"
            name="number"
            aria-label="number"
            onChange={(e) => setCardNumber(e.target.value)}
            onFocus={(e) => setFocus(e.target.name)}
            placeholder="Kart Numarası"
          />
          <div className={styles.bottom}>
            <Input
              clearable
              bordered
              className={styles.input}
              name="expiry"
              width="100%"
              aria-label="expiry"
              onChange={(e) => setExpiry(e.target.value)}
              onFocus={(e) => setFocus(e.target.name)}
              color="primary"
              size="lg"
              maxLength={5}
              placeholder="SKT"
            />
            <Input
              clearable
              bordered
              aria-label="cvc"
              name="cvc"
              className={styles.input}
              width="100%"
              onChange={(e) => setCvc(e.target.value)}
              onFocus={(e) => setFocus(e.target.name)}
              color="primary"
              size="lg"
              placeholder="CVC"
            />
          </div>
        </form>
      </div>
    ),
  };
}

export default useCard;
