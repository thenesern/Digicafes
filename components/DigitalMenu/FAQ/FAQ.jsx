// Packages and Dependencies
import React from "react";
import { Collapse, Text } from "@nextui-org/react";
// Styles
import styles from "./FAQ.module.css";
// Translation
import useTranslation from "next-translate/useTranslation";

const FAQ = () => {
  // Translation
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.articleHeader} id="faq">
        {t("faq:header")}
      </h1>
      <Collapse.Group bordered>
        <Collapse title={t("faq:q1")}>
          <Text>{t("faq:a1")}</Text>
        </Collapse>
        <Collapse title={t("faq:q2")}>
          <Text>{t("faq:a2")}</Text>
        </Collapse>
        <Collapse title={t("faq:q3")}>
          <Text>{t("faq:a3")}</Text>
        </Collapse>
      </Collapse.Group>
    </div>
  );
};

export default FAQ;
