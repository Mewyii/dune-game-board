export const languages = ['en', 'de'] as const;

export type LanguageType = (typeof languages)[number];

export type LanguageString = {
  [key in LanguageType]: string;
};
