// manifest.config.ts
import { defineManifest } from "@crxjs/vite-plugin";

export const manifest = defineManifest({
  manifest_version: 3,
  name: "ExKOT for WEB",
  description: "An extension for King of Time",
  version: "1.0.0",
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self';",
    sandbox: "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self';",
  },
  content_scripts: [
    {
      matches: [
        "*://s2.ta.kingoftime.jp/independent/recorder2/personal/*",
        "*://s2.kingtime.jp/independent/recorder/personal/*",
      ],
      js: ["src/ts/script.ts"],
    },
  ],
  permissions: ["activeTab", "storage"],
  options_ui: {
    page: "src/html/options.html",
    open_in_tab: true,
  },
  icons: {
    "16": "src/public/icon16.png",
    "48": "src/public/icon48.png",
    "128": "src/public/icon128.png",
  },
});
