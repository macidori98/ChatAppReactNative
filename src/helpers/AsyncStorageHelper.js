import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @param {string} key
 * @param {string} value
 * @returns {Promise<void>}
 */
export const saveItemToAsyncStorage = async (key, value) => {
  return await AsyncStorage.setItem(key, value);
};
