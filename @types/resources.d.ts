export interface TranslationResources {
  bag: {
    empty: string;
    items: string;
    items_plural: string;
    title: string;
    total: string;
  };
  common: {
    back: string;
    cancel: string;
    delete: string;
    done: string;
    edit: string;
    error: string;
    loading: string;
    next: string;
    retry: string;
    save: string;
    welcome: string;
  };
  favorites: {
    empty: string;
    remove: string;
    title: string;
  };
  home: {
    greeting: string;
    title: string;
  };
  profile: {
    addresses: string;
    orders: string;
    payment: string;
    settings: string;
    title: string;
  };
  shop: {
    categories: string;
    products: string;
    title: string;
  };
  tabs: {
    bag: string;
    favorites: string;
    home: string;
    profile: string;
    shop: string;
  };
}

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: TranslationResources;
    };
  }
}
