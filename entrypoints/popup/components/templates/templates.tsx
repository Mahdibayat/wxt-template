import { useState } from "react";
import styles from "./style.module.css";
import useTemplates from "./templates.hook";

export default function Templates() {
  const { templates, onSelect } = useTemplates();
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(id: string) {
    setError(null);

    try {
      await onSelect(id);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fill email template",
      );
    }
  }

  return (
    <div className={styles.templates}>
      {error && <p role="alert">{error}</p>}

      {templates.map((template) => (
        <article key={template.id} className={styles.templateItem}>
          <button onClick={() => void handleSelect(template.id)}>
            <h5>{template.title}</h5>
          </button>
        </article>
      ))}
    </div>
  );
}
