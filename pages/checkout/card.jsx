import { Input } from "@nextui-org/react";
import React from "react";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import styles from "./card.module.css";

export default class PaymentForm extends React.Component {
  state = {
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  };

  handleInputFocus = (e) => {
    this.setState({ focus: e.target.name });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <div id="PaymentForm" className={styles.container}>
        <Cards
          cvc={this.state.cvc}
          expiry={this.state.expiry}
          focused={this.state.focus}
          name={this.state.name}
          number={this.state.number}
          placeholders={{ name: "AD SOYAD" }}
        />
        <form className={styles.form}>
          <Input
            clearable
            className={styles.input}
            bordered
            width="16rem"
            color="primary"
            size="lg"
            name="name"
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
            placeholder="Kartın Üzerindeki Ad Soyad"
          />
          <Input
            clearable
            bordered
            className={styles.input}
            width="16rem"
            color="primary"
            size="lg"
            type="tel"
            name="number"
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
            placeholder="Kart Numarası"
          />
          <div className={styles.bottom}>
            <Input
              clearable
              bordered
              className={styles.input}
              name="expiry"
              width="7rem"
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
              color="primary"
              size="lg"
              placeholder="SKT"
            />
            <Input
              clearable
              bordered
              name="cvc"
              className={styles.input}
              width="7rem"
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
              color="primary"
              size="lg"
              placeholder="CVC"
            />
          </div>
        </form>
      </div>
    );
  }
}
