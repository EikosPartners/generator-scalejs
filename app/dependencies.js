const default_dependencies = [
    "autoprefixer-loader",
    "babel-core",
    "babel-loader",
    "babel-polyfill",
    "babel-preset-es2015",
    "body-parser",
    "css-loader",
    "eslint",
    "eslint-config-airbnb",
    "eslint-import-resolver-webpack",
    "eslint-plugin-import",
    "eslint-plugin-jsx-a11y",
    "eslint-plugin-react",
    "express",
    "html-loader",
    "pjson-loader",
    "sass-loader",
    "scalejs.hot-loader",
    "scalejs.metadatafactory-common",
    "scalejs.mvvm",
    "source-map-loader",
    "style-loader",
    "url-loader",
    "webpack@^1.13.1",
    "webpack-dev-middleware",
    "webpack-hot-middleware"
];

const test_dependencies = [
    "karma",
    "karma-chai",
    "karma-chai-as-promised",
    "karma-chrome-launcher",
    "karma-coverage",
    "karma-mocha",
    "karma-mocha-debug",
    "karma-mocha-reporter",
    "karma-sourcemap-loader",
    "karma-webpack",
    "mocha",
    "chai",
    "chai-as-promised@^5.0.0"
];

module.exports = {
    default_dependencies: default_dependencies,
    test_dependencies: test_dependencies
};
