import en from './en/translates';
import es from './es/translate';

const langs = {
  en: () => en,
  es: () => es
}

export default function i18n(lang: string | undefined = 'en') {
  // @ts-ignore
  const loadLang = langs[lang] || langs.en;
  return loadLang();
}