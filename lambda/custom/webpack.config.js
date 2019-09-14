const path = require("path");
const slsw = require("serverless-webpack");

module.exports = {
    entry: slsw.lib.entries,
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
    output: {
        libraryTarget: "commonjs",
        path: path.join(__dirname, ".webpack"),
        filename: "[name].js"
    },
    target: "node",
    module: {
        rules: [{
            test: /\.ts(x?)$/,
            loader: "ts-loader",
            options: {
                transpileOnly: true
            }
        }]
    }
};