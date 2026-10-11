import { use } from "react";
import { templatesPromise } from "../../utils/fetchData";

export default function useTemplates() {
  const templates = use(templatesPromise);

  async function onSelect(id: string) {
    const template = templates.find((item) => item.id === id);

    if (!template) {
      throw new Error("Template not found");
    }

    const tabs = await browser.tabs.query({
      url: ["*://mail.sepehranglobal.com/*"],
    });

    const composeTab = tabs.find((tab) =>
      tab.url?.includes("popout/email/compose"),
    );

    if (composeTab?.id === undefined) {
      throw new Error("Compose tab not found");
    }

    const result = await browser.tabs.sendMessage(composeTab.id, {
      type: "FILL_EMAIL_TEMPLATE",
      subject: template.subject,
      body: template.body,
    });

    console.log("[Popup] Response:", result);
  }

  return {
    templates,
    onSelect,
  };
}
