// Dependencies
import React from "react";
import { Button } from "@material-ui/core";
import Link from "next/link";
import { TextField } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { useState } from "react";
// Styles
import styles from "./RegisterForm.module.css";
import { Input } from "@nextui-org/react";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [signedIn, setSignedIn] = useState("");
  const [isMarked, setIsMarked] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Sign Up</h1>
        <div className={styles.signin}>
          <p>Already have an account?</p>
          <Link href="/login" passHref>
            <span style={{ fontWeight: "600", cursor: "pointer" }}>
              Sign In
            </span>
          </Link>
        </div>
        <form className={styles.form}>
          <div className={styles.pairs}>
            <div className={styles.pair}>
              <TextField
                type="text"
                label="First Name"
                color="secondary"
                className={styles.input}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className={styles.pair}>
              <TextField
                type="text"
                label="Last Name"
                color="secondary"
                className={styles.input}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.pair}>
            <TextField
              type="email"
              label="E-Mail"
              color="secondary"
              className={styles["input_email"]}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.pairs}>
            <div className={styles.pair}>
              <TextField
                type="password"
                label="Password"
                color="secondary"
                className={styles.input}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.pair}>
              <TextField
                type="password"
                label="Password Confirm"
                color="secondary"
                className={styles.input}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.aggreement}>
            <Checkbox onClick={() => setIsMarked(true)} />
            <div className={styles.privacy}>
              <p>I accept the</p>
              <Link href="/" passHref>
                <span style={{ fontWeight: "600", cursor: "pointer" }}>
                  Privacy Statement
                </span>
              </Link>
            </div>
          </div>
          <button
            className={styles.button}
            /*  onClick={registeringHandler} */
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
