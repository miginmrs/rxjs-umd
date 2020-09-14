"use strict";

const path = require("path");
const webpack = require("webpack");

module.exports = env => {
  let filename = "rxjs.umd.js", devtool = { devtool: "source-map" };
  let mode = "development";
  if (env && env.production) {
    filename = "rxjs.min.umd.js";
    mode = "production";
    devtool = {};
  }
  return {
    ...devtool,
    context: path.join(__dirname, "./"),
    entry: {
      index: "./rxjs-umd.ts"
    },
    mode,
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                declaration: false
              },
              configFile: "tsconfig.json"
            }
          }
        }
      ]
    },
    output: {
      filename,
      library: "rxjs",
      libraryTarget: "umd",
      path: path.resolve(__dirname, "./bundles"),
      globalObject: 'self',
    },
    resolve: {
      extensions: [".ts", ".js"]
    }
  };
};
