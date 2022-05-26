let _translations = null;

/**
 * @param {string} textId
 * @returns {string}
 */
const getText = textId => {
  return _translations[textId] ?? textId;
};

export const Translations = {
  initializeTranslations: () => {
    //read from async storage
    const language = 'hungarian';
    _translations = require(`./${language}.json`);
  },
  strings: {
    homeScreenTitle: () => getText('homeScreenTitle'),
    emptyChat: () => getText('emptyChat'),
    enterMessage: () => getText('enterMessage'),
    signInTitle: () => getText('signInTitle'),
    signIn: () => getText('signIn'),
    signUp: () => getText('signUp'),
    forgotPassword: () => getText('forgotPassword'),
    email: () => getText('email'),
    password: () => getText('password'),
    invalidEmail: () => getText('invalidEmail'),
    invalidPassword: () => getText('invalidPassword'),
    users: () => getText('users'),
    emptyList: () => getText('emptyList'),
    profile: () => getText('profile'),
    logout: () => getText('logout'),
    back: () => getText('back'),
    updateKeypair: () => getText('updateKeypair'),
    updateKeypairSuccess: () => getText('updateKeypairSuccess'),
  },
};
