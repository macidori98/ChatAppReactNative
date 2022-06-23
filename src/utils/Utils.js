import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserById} from 'api/Requests';
import {Storage} from 'aws-amplify';
import {SECRET_KEY} from 'helpers/Constants';
import {Logger} from 'helpers/Logger';
import {Message} from 'models';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import {Translations} from 'translations/Translations';
import {box} from 'tweetnacl';
import {decrypt, encrypt, stringToUint8Array} from 'utils/crypto';

/**
 * @param {number} minutes
 * @returns {string}
 */
export const getStatusText = minutes => {
  if (minutes < 60) {
    return `${Translations.strings.online()} ${minutes} ${Translations.strings.minutesAgo()}`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${Translations.strings.online()} ${hours} ${Translations.strings.hoursAgo()}`;
  }
  const days = Math.floor(hours / 24);
  if (days < 24) {
    return `${Translations.strings.online()} ${days} ${Translations.strings.daysAgo()}`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${Translations.strings.online()} ${months} ${Translations.strings.monthsAgo()}`;
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
  try {
    const secretKey = await AsyncStorage.getItem(SECRET_KEY);
    const senderUserPublicKey = (await getUserById(message.userID)).publicKey;
    const sharedKey = box.before(
      stringToUint8Array(senderUserPublicKey),
      stringToUint8Array(secretKey),
    );
    const decryptedText = await decrypt(sharedKey, message.content);
    return decryptedText;
  } catch (error) {
    Logger.log(error);
    return undefined;
  }
};

/**
 * @param {string} decryptedContent
 * @param {Message} message
 */
export const onShare = async (decryptedContent, message) => {
  const fs = RNFetchBlob.fs;
  let imagePath;
  try {
    const url = await Storage.get(decryptedContent);
    const data = await RNFetchBlob.config({
      fileCache: true,
    }).fetch('GET', url);
    imagePath = data.path();
    const base64data = await data.readFile('base64');

    /**
     * @type {import('react-native-share').ShareOptions}
     */
    const shareOptions = {
      saveToFiles: true,
      title: Translations.strings.share(),
      url: `data:${message.base64type};base64,${base64data}`,
    };
    await Share.open(shareOptions);
  } catch (error) {
    console.log(error);
  }
  fs.unlink(imagePath);
};
