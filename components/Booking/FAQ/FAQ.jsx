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
        <Collapse title={t("faq:Bq1")}>
          <Text>{t("faq:Ba1")}</Text>
        </Collapse>
        <Collapse title={t("faq:Bq2")}>
          <Text>{t("faq:Ba2")}</Text>
        </Collapse>
      </Collapse.Group>
    </div>
  );
};

export default FAQ;
