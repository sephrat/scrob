// Checks that every message catalog in messages/ has exactly the keys and the
// placeholders of the base locale (en). Paraglide silently falls back to English
// for a missing translation, so without this a forgotten string goes unnoticed.
// Usage: npm run i18n:check
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const settings = JSON.parse(readFileSync(join(root, "project.inlang/settings.json"), "utf8"));
const load = (locale) => {
  const data = JSON.parse(readFileSync(join(root, "messages", `${locale}.json`), "utf8"));
  delete data.$schema;
  return data;
};

// Variables a message uses: {name} in any text, plus declared inputs.
function variables(message) {
  const found = new Set();
  const text = JSON.stringify(message);
  for (const m of text.matchAll(/\{(\w+)\}/g)) found.add(m[1]);
  for (const m of text.matchAll(/"input (\w+)"/g)) found.add(m[1]);
  return [...found].sort().join(",");
}

const base = load(settings.baseLocale);
let problems = 0;
const report = (msg) => { problems++; console.error(msg); };

for (const locale of settings.locales.filter(l => l !== settings.baseLocale)) {
  const catalog = load(locale);
  for (const key of Object.keys(base)) {
    if (!(key in catalog)) { report(`[${locale}] missing: ${key}`); continue; }
    if (variables(base[key]) !== variables(catalog[key])) {
      report(`[${locale}] placeholder mismatch in ${key}: en={${variables(base[key])}} ${locale}={${variables(catalog[key])}}`);
    }
    if (typeof catalog[key] === "string" && catalog[key].trim() === "") report(`[${locale}] empty: ${key}`);
  }
  for (const key of Object.keys(catalog)) {
    if (!(key in base)) report(`[${locale}] unknown key (not in ${settings.baseLocale}): ${key}`);
  }
}

if (problems) {
  console.error(`\n${problems} i18n problem(s).`);
  process.exit(1);
}
console.log(`i18n: ${Object.keys(base).length} messages, all locales complete.`);
