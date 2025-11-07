import { createI18n } from 'vue-i18n';
import enUS from './en-US';

const messages = {
  'en-US': enUS,
};

export const i18n = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages,
});

export default messages;
