import {
  getItemFromAsyncStorage,
  saveItemToAsyncStorage,
} from 'helpers/AsyncStorageHelper';
import {LANGUAGE} from 'helpers/Constants';

let _translations = null;

/**
 * @param {string} textId
 * @returns {string}
 */
const getText = textId => {
  return _translations[textId] ?? textId;
};

export const Translations = {
  languages: () => {
    return ['Magyar', 'Română', 'English'];
  },

  /**
   * @param {string} [language]
   */
  initializeTranslations: async language => {
    let currentLanguage;
    if (language) {
      await saveItemToAsyncStorage(LANGUAGE, language);
    } else {
      currentLanguage = await getItemFromAsyncStorage(LANGUAGE);
      language = currentLanguage ?? Translations.languages()[2];
      await saveItemToAsyncStorage(LANGUAGE, language);
    }

    switch (language) {
      case 'English':
        _translations = require('./english.json');
        break;
      case 'Magyar':
        _translations = require('./hungarian.json');
        break;
      case 'Română':
        _translations = require('./romanian.json');
        break;

      default:
        break;
    }
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
    changeProfilePicture: () => getText('changeProfilePicture'),
    changeLanguage: () => getText('changeLanguage'),
    requests: () => getText('requests'),
    incomingFriendRequests: () => getText('incomingFriendRequests'),
    sentFriendRequests: () => getText('sentFriendRequests'),
    requestSuccessfullySent: () => getText('requestSuccessfullySent'),
    addFriend: () => getText('addFriend'),
    enterEmail: () => getText('enterEmail'),
    enterFriendEmail: () => getText('enterFriendEmail'),
    cancel: () => getText('cancel'),
    cannotAddYourselt: () => getText('cannotAddYourselt'),
    userNotExists: () => getText('userNotExists'),
    requestAlreadySent: () => getText('requestAlreadySent'),
    userAlreadyExists: () => getText('userAlreadyExists'),
    sentYouFriendRequest: () => getText('sentYouFriendRequest'),
    whatToDo: () => getText('whatToDo'),
    accept: () => getText('accept'),
    remove: () => getText('remove'),
    startChat: () => getText('startChat'),
    changeName: () => getText('changeName'),
  },
};
