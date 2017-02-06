module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
        //"linebreak-style": ["error", "windows"],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "comma-dangle": ["error", "never"],
        "one-var": ["error", "always"],
        "eol-last": ["error", "never"],
        "func-names": ["error", "never"],
        "object-shorthand": "off",
        "import/no-extraneous-dependencies": "off", // revisit
        "import/no-dynamic-require": "off",
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "no-console": "off",
        "no-use-before-define": ["error", "nofunc"],
        "no-param-reassign": ["error", { "props": false }],
        "no-unused-expressions": ["error", { "allowShortCircuit": true }],
        "consistent-return": "off",
        "no-underscore-dangle": "off",
        "import/no-duplicates": "off",
        "no-duplicate-imports": "off",
        "import/extensions": "off"
    },
    "globals": {
        "window": true,
        "document": true,
        "Event": true,
        "MutationObserver": true,
        "Node": true,
        "localStorage": true
    },
    "settings": {
        "import/resolver": "webpack"
    },
    "env": {
        "browser": 1
    }
};
