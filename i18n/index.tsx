import en from "@/locales/en/en.json";
import es from "@/locales/es/es.json";
import fr from "@/locales/fr/fr.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Ideally this will come from a CDN or a backend service for this project I will use the JSON files for now
const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
};

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    defaultNS: "translation",
    ns: ["translation"],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
