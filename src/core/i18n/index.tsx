import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    fallbackLng: "pt-BR",
    supportedLngs: ["pt-BR", "en-US"],
    defaultNS: "common",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
      caches: ["cookie"],
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
