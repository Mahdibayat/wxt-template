import clsx from "clsx";
import styles from "./style.module.css";

export default function Loading({ suspense }: { suspense?: boolean }) {
  if (Boolean(suspense)) {
    return (
      <div className={styles.container}>
        <div className={styles.loader} />
      </div>
    );
  }

  return <div className={styles.loader} />;
}
