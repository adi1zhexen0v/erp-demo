import { useTranslation } from "react-i18next";
import styles from "./Loader.module.css";

interface Props {
  isFullPage?: boolean;
}

export default function Loader({ isFullPage }: Props) {
  const { t } = useTranslation("Common");

  if (isFullPage) {
    return (
      <div className="w-screen h-screen flex justify-center items-center background-static-white fixed top-0 left-0 text-primary-500">
        <span className={styles.loader} />
      </div>
    );
  }

  return <div>{t("loading")}</div>;
}
