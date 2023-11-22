import * as path from "path";
import { fileURLToPath } from 'url';

import { sync } from "glob";
import nodeExternals from "webpack-node-externals";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const srcDir = "./src/";
const entries = sync("ts/*.ts", {
    cwd: srcDir,
  })
  .map((key) => {
    const replacedKey = key.replace("ts/", "js/")
    .replace(/\.ts$/, "");
    // [ 'ts/*.ts' , './src/ts/*.ts' ]という形式の配列になる
    return [replacedKey, srcDir + key]
  }
  );
const entryObj = Object.fromEntries(entries);

export default {
  // エントリーポイントの設定
  entry: entryObj,
  target: "node",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { url: false }
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: [".mjs", ".json", ".ts"],
    symlinks: false,
    cacheWithContext: false,
  },
  optimization: {
    minimize: false,
  },
  // 出力の設定
  output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  stats: {
    errorDetails: true,
    warnings: false
  },
};
