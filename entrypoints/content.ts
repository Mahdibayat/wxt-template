export default defineContentScript({
  matches: ["*://mail.sepehranglobal.com/*"],

  main() {
    console.log("[Email Extension] Content script loaded", location.href);
    browser.runtime.onMessage.addListener((message) => {
      if (message.type !== "FILL_EMAIL_TEMPLATE") {
        return;
      }

      const { subject, body } = message;

      // Fill email subject
      const subjectInput =
        document.querySelector<HTMLInputElement>("#subjectInputCtrl");

      if (!subjectInput) {
        throw new Error("Subject input not found");
      }

      subjectInput.value = subject;
      subjectInput.dispatchEvent(new Event("input", { bubbles: true }));
      subjectInput.dispatchEvent(new Event("change", { bubbles: true }));

      // Find the actual editable element inside Froala

      const templateContent = document.createElement("div");
      templateContent.innerHTML = body;

      const editor = document.querySelector<HTMLElement>(
        ".fr-wrapper .fr-element[contenteditable='true']",
      );

      if (!editor) {
        throw new Error("Editable email body not found");
      }

      const signature = editor.querySelector<HTMLElement>("#divSignature");

      if (signature) {
        // حذف محتوای قالب قبلی، بدون حذف امضا
        editor.replaceChildren();

        // محتوای قالب جدید
        const templateContainer = document.createElement("div");
        templateContainer.innerHTML = body;
        editor.append(...Array.from(templateContainer.childNodes));

        // امضای اصلی را در انتهای ایمیل قرار بده
        editor.append(signature);
      } else {
        // اگر امضایی وجود ندارد، فقط قالب را جایگزین کن
        editor.innerHTML = body;
      }

      editor.dispatchEvent(new Event("input", { bubbles: true }));

      return { success: true };
    });
  },
});
