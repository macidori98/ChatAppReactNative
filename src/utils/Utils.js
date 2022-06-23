import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserById} from 'api/Requests';
import {Message} from 'models';
import {box} from 'tweetnacl';
import {decrypt, encrypt, stringToUint8Array} from 'utils/crypto';

/**
 * @param {number} minutes
 * @returns {string}
 */
export const getStatusText = minutes => {
  if (minutes < 60) {
    return `Online ${minutes} minutes ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Online ${hours} hours ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 24) {
    return `Online ${days} days ago`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `Online ${months} months ago`;
  }
};

/**
 * @param {string} text
 * @param {string} publicKey
 * @param {string} secretKey
 * @returns {string}
 */
export const encryptText = (text, publicKey, secretKey) => {
  const userPublicKeyUint8Array = stringToUint8Array(publicKey);

  const secretKeyUint8Array = stringToUint8Array(secretKey);

  const sharedKey = box.before(userPublicKeyUint8Array, secretKeyUint8Array);

  const encryptedText = encrypt(sharedKey, text);

  return encryptedText;
};

/**
 * @param {Message} message
 * @returns {Promise<string>}
 */
export const decryptMessage = async message => {
  const secretKey = await AsyncStorage.getItem('SECRET_KEY');
  const senderUserPublicKey = (await getUserById(message.userID)).publicKey;
  const sharedKey = box.before(
    stringToUint8Array(senderUserPublicKey),
    stringToUint8Array(secretKey),
  );
  const decryptedText = await decrypt(sharedKey, message.content);
  return decryptedText;
};
