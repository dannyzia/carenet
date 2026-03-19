/**
 * i18next-parser — extract `t()` / `Trans` keys into locale JSON.
 * @see https://github.com/i18next/i18next-parser
 *
 * CareNet 2:
 * - Source of truth for structure: src/locales/en/{common,auth,caregiver,guardian}.json
 * - Only locale "en" is generated from code; other languages use i18n:sync + translate.
 * - keepRemoved: true — do not delete keys the lexer misses (large app, gradual t() adoption).
 */
export default {
  contextSeparator: "_",
  createOldCatalogs: false,
  defaultNamespace: "common",
  defaultValue: "",
  indentation: 2,
  keepRemoved: true,
  keySeparator: ".",
  namespaceSeparator: ":",
  pluralSeparator: "_",
  lineEnding: "auto",
  locales: ["en"],
  output: "src/locales/$LOCALE/$NAMESPACE.json",
  sort: true,
  verbose: false,
  lexers: {
    mjs: ["JavascriptLexer"],
    js: ["JavascriptLexer"],
    ts: ["JavascriptLexer"],
    jsx: ["JsxLexer"],
    tsx: ["JsxLexer"],
    default: ["JavascriptLexer"],
  },
  input: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/*.spec.{ts,tsx}",
  ],
};
