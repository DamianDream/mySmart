export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        "window": "readonly",
        "document": "readonly",
        "console": "readonly",
        "setTimeout": "readonly",
        "clearTimeout": "readonly",
        "chrome": "readonly",
        "crypto": "readonly",
        "fetch": "readonly",
        "location": "readonly",
        "navigator": "readonly",
        "Date": "readonly",
        "URL": "readonly",
        "URLSearchParams": "readonly",
        "XMLHttpRequest": "readonly"
      }
    },
    rules: {
      "no-undef": "error"
    }
  }
];
