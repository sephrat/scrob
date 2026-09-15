// Locale-aware date/number formatting for the active UI language. Works in SSR
// frontmatter and in client <script>s alike: getLocale() reads the per-request
// locale on the server and the ui_language cookie / navigator.languages in the
// browser. Use these instead of toLocale*String('en-US') or an undefined locale,
// which would follow the server's or browser's locale rather than the UI's.
import { getLocale } from "../paraglide/runtime.js";

type DateInput = Date | string | number;

const toDate = (d: DateInput) => (d instanceof Date ? d : new Date(d));

export function formatDate(date: DateInput, options?: Intl.DateTimeFormatOptions): string {
  return toDate(date).toLocaleDateString(getLocale(), options);
}

export function formatTime(date: DateInput, options?: Intl.DateTimeFormatOptions): string {
  return toDate(date).toLocaleTimeString(getLocale(), options);
}

export function formatDateTime(date: DateInput, options?: Intl.DateTimeFormatOptions): string {
  return toDate(date).toLocaleString(getLocale(), options);
}

export function formatNumber(n: number, options?: Intl.NumberFormatOptions): string {
  return n.toLocaleString(getLocale(), options);
}

export function formatRelative(value: number, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions): string {
  return new Intl.RelativeTimeFormat(getLocale(), { numeric: "auto", ...options }).format(value, unit);
}

export function formatList(items: string[], options?: Intl.ListFormatOptions): string {
  return new Intl.ListFormat(getLocale(), { style: "long", type: "conjunction", ...options }).format(items);
}
