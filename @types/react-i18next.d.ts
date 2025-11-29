import type { TranslationResources } from "./resources";

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: TranslationResources;
    };
  }
}
