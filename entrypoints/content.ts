import type { EmailTemplate } from "./popup/interfaces/email";

export default defineContentScript({
  matches: ["*://mail.sepehranglobal.com/*"],

  main() {
    void initTemplatePicker();
  },
});

async function initTemplatePicker() {
  try {
    const response = await fetch(
      browser.runtime.getURL("/email-templates-bold.json"),
    );

    if (!response.ok) {
      throw new Error("Failed to load email templates");
    }

    const templates: EmailTemplate[] = await response.json();

    // منتظر می‌مانیم تا Subject در صفحه‌ی Compose ایجاد شود.
    const subjectInput =
      await waitForElement<HTMLInputElement>("#subjectInputCtrl");

    // جلوگیری از ساخت Dropdown تکراری
    if (document.querySelector("#email-template-picker")) return;

    const dropdown = document.createElement("div");
    dropdown.id = "email-template-picker";

    Object.assign(dropdown.style, {
      position: "fixed",
      zIndex: "999999",
      background: "#fff",
      color: "#222",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 4px 16px rgba(0,0,0,.15)",
      maxHeight: "280px",
      overflowY: "auto",
      padding: "4px",
      boxSizing: "border-box",
    });

    function positionDropdown() {
      const rect = subjectInput.getBoundingClientRect();

      dropdown.style.top = `${rect.bottom + 4}px`;
      dropdown.style.left = `${rect.left}px`;
      dropdown.style.width = `${rect.width}px`;
    }

    function openDropdown() {
      positionDropdown();
      dropdown.style.display = "block";
    }

    function closeDropdown() {
      dropdown.style.display = "none";
    }

    async function selectTemplate(template: EmailTemplate) {
      // پر کردن Subject
      subjectInput.value = template.title;
      subjectInput.dispatchEvent(new Event("input", { bubbles: true }));
      subjectInput.dispatchEvent(new Event("change", { bubbles: true }));

      // پیدا کردن ویرایشگر متن
      const editor = document.querySelector<HTMLElement>(
        ".fr-wrapper .fr-element[contenteditable='true']",
      );

      if (!editor) {
        throw new Error("Editable email body not found");
      }

      // امضای پیش‌فرض را نگه می‌داریم.
      const signature = editor.querySelector<HTMLElement>("#divSignature");

      const templateContainer = document.createElement("div");
      templateContainer.innerHTML = template.body;

      // قالب قبلی حذف و قالب جدید جایگزین می‌شود.
      editor.replaceChildren(...Array.from(templateContainer.childNodes));

      // همان عنصر امضای اولیه را به انتهای متن برمی‌گردانیم.
      if (signature) {
        editor.append(signature);
      }

      editor.dispatchEvent(new Event("input", { bubbles: true }));
      editor.dispatchEvent(new Event("change", { bubbles: true }));

      closeDropdown();
      subjectInput.focus();
    }

    for (const template of templates) {
      const option = document.createElement("button");

      option.type = "button";
      option.textContent = template.title;
      option.title = template.title ?? "";

      Object.assign(option.style, {
        display: "block",
        width: "100%",
        padding: "10px 12px",
        border: "none",
        borderRadius: "5px",
        background: "#fff",
        color: "#222",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "14px",
      });

      option.addEventListener("mouseenter", () => {
        option.style.background = "#f2f4f7";
      });

      option.addEventListener("mouseleave", () => {
        option.style.background = "#fff";
      });

      option.addEventListener("click", () => {
        void selectTemplate(template).catch(console.error);
      });

      dropdown.append(option);
    }

    document.body.append(dropdown);

    // باز شدن اولیه با لود Compose
    // openDropdown();

    // کلیک روی Subject دوباره Dropdown را باز می‌کند.
    subjectInput.addEventListener("click", openDropdown);

    // کلیک خارج از Subject و Dropdown آن را می‌بندد.
    document.addEventListener("click", (event) => {
      const target = event.target;

      if (
        target instanceof Node &&
        !subjectInput.contains(target) &&
        !dropdown.contains(target)
      ) {
        closeDropdown();
      }
    });

    subjectInput.addEventListener("blur", () => {
      // اجازه بده کلیک روی گزینه‌ی Dropdown اجرا بشه.
      setTimeout(() => {
        if (!dropdown.contains(document.activeElement)) {
          closeDropdown();
        }
      }, 0);
    });

    // موقع تغییر اندازه یا اسکرول، Dropdown زیر Subject بماند.
    window.addEventListener("resize", positionDropdown);
    window.addEventListener("scroll", positionDropdown, true);
  } catch (error) {
    console.error("[Email Extension] Template picker error:", error);
  }
}

function waitForElement<T extends Element>(selector: string): Promise<T> {
  const existing = document.querySelector<T>(selector);

  if (existing) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const element = document.querySelector<T>(selector);

      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}
