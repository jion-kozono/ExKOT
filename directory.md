# Directory Structure

<pre>

├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── build.sh // generate dist
├── node_modules
├── dist // after executing `yarn build:d or yarn build:p`
│   ├── entry
│   │   ├── index.js
│   │   └── loader.js
│   ├── html
│   │   ├── loading.html
│   │   └── options.html
│   ├── js
│   │   ├── const.js
│   │   ├── options.js
│   │   ├── script.js
│   │   └── style.js
│   ├── manifest.json
│   └── static
│       ├── icon128.png
│       ├── icon16.png
│       └── icon48.png
├── manifest.json // required for Chrome extension
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── css
│   │   └── style.css
│   ├── entry
│   │   ├── index.js
│   │   └── loader.js
│   ├── html
│   │   ├── loading.html
│   │   └── options.html
│   ├── static
│   │   ├── icon128.png
│   │   ├── icon16.png
│   │   └── icon48.png
│   └── ts
│       ├── const.ts
│       ├── options.ts
│       ├── script.ts
│       └── style.ts
├── tsconfig.json
└── webpack.config.mjs
</pre>
