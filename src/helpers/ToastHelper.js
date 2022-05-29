import Toast from 'react-native-toast-message';

export const ToastHelper = {
  /**
   * @param {string} text1
   * @param {string} [text2]
   */
  showSuccess: (text1, text2) => {
    showToast('success', text1, text2);
  },

  /**
   * @param {string} text1
   * @param {string} [text2]
   */
  showError: (text1, text2) => {
    showToast('error', text1, text2);
  },

  /**
   * @param {string} text1
   * @param {string} [text2]
   */
  showInfo: (text1, text2) => {
    showToast('info', text1, text2);
  },
};

/**
 * @private
 * @param {string} type
 * @param {string} text1
 * @param {string} [text2]
 */
const showToast = (type, text1, text2) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
  });
};
