import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    build: {
      sourcemap: true,
    },
  }),
  manifest: {
    name: "Sepehran Global",
    description: "Internal email template assistant for Sepehran Global.",
    permissions: ["tabs"],
    host_permissions: ["https://mail.sepehranglobal.com/*"],
    manifest: {
      browser_specific_settings: {
        gecko: {
          id: "sepehran-global@example.com",
          data_collection_permissions: {
            required: ["none"],
          },
        },
      },
    },
    browser_specific_settings: {
      gecko: {
        id: "sepehran-global@example.com",
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
  },
});
