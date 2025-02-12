// manifest.config.ts
import { defineManifest } from "@crxjs/vite-plugin";

export const manifest = defineManifest({
  manifest_version: 3,
  name: "ExKOT for WEB",
  description: "The extension for King of Time",
  version: "1.1.0",
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
  permissions: ["storage"],
  options_ui: {
    page: "src/html/options.html",
    open_in_tab: true,
  },
  action: {
    default_title: "ExKOT",
    default_popup: "src/html/options.html",
    default_icon: {
      "32": "src/public/ExKOT32.png",
      "72": "src/public/ExKOT72.png",
      "128": "src/public/ExKOT128.png",
      "512": "src/public/ExKOT512.png",
    },
  },
  icons: {
    "16": "src/public/ExKOT16.png",
    "48": "src/public/ExKOT48.png",
    "128": "src/public/ExKOT128.png",
  },
});
