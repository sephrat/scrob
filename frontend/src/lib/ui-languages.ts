import { locales, type Locale } from "../paraglide/runtime.js";

// Each UI language labelled in its own language (an endonym), so a user can
// find theirs whatever language the page is currently in. Keyed by Locale so
// adding a locale to project.inlang/settings.json without a name here fails the
// type check instead of rendering a blank option.
const ENDONYMS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

export const UI_LANGUAGES = locales.map(code => ({ code, name: ENDONYMS[code] }));
