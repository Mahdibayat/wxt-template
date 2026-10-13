import type { EmailTemplate } from "../interfaces/email";

async function fetchData() {
  return fetch(browser.runtime.getURL("/email-templates-bold.json")).then(
    (res) => {
      if (!res.ok) {
        throw new Error(`Failed to load templates: ${res.status}`);
      }
      return res.json() as Promise<EmailTemplate[]>;
    },
  );
}
export const templatesPromise = fetchData();
