import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import {decode as decodeUTF8, encode as encodeUTF8} from '@stablelib/utf8';
import 'react-native-get-random-values';
import {box, randomBytes, secretbox} from 'tweetnacl';

const newNonce = () => randomBytes(secretbox.nonceLength);
export const generateKeyPair = () => box.keyPair();

/**
 * @param {Uint8Array} secretOrSharedKey
 * @param {string|any} json
 * @param {Uint8Array} [key]
 * @returns {string}
 */
export const encrypt = (secretOrSharedKey, json, key) => {
  const nonce = newNonce();
  const messageUint8 = encodeUTF8(JSON.stringify(json));
  const encrypted = key
    ? box(messageUint8, nonce, key, secretOrSharedKey)
    : box.after(messageUint8, nonce, secretOrSharedKey);

  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};

/**
 * @param {Uint8Array} secretOrSharedKey
 * @param {string} messageWithNonce
 * @param {Uint8Array} [key]
 * @returns {string|any}
 */
export const decrypt = (secretOrSharedKey, messageWithNonce, key) => {
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonce.length,
  );

  const decrypted = key
    ? box.open(message, nonce, key, secretOrSharedKey)
    : box.open.after(message, nonce, secretOrSharedKey);

  if (!decrypted) {
    throw new Error('Could not decrypt message');
  }

  const base64DecryptedMessage = decodeUTF8(decrypted);
  return JSON.parse(base64DecryptedMessage);
};

/**
 * @param {string} string
 * @returns {Uint8Array}
 */
export const stringToUint8Array = string => {
  return Uint8Array.from(string.split(',').map(str => parseInt(str, 10)));
};
