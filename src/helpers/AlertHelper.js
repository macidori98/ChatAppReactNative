import {Alert} from 'react-native';
import {Translations} from 'translations/Translations';

/**
 * @param {string} actionDescription
 * @param {(str?: string) => void} removeFunction
 * @returns {void}
 */
export const getDeleteAlert = (actionDescription, removeFunction) =>
  Alert.alert('Confirm delete', actionDescription, [
    {
      text: 'Delete',
      onPress: removeFunction,
      style: 'destructive',
    },
    {
      text: Translations.strings.cancel(),
      style: 'cancel',
    },
  ]);

/**
 * @param {string} actionDescription
 * @param {(str?: string) => void} removeFunction
 * @returns {void}
 */
export const getLeaveAlert = (actionDescription, removeFunction) =>
  Alert.alert('Confirm leaving', actionDescription, [
    {
      text: 'Leave',
      onPress: removeFunction,
      style: 'destructive',
    },
    {
      text: Translations.strings.cancel(),
      style: 'cancel',
    },
  ]);

/**
 * @param {string} actionDescription
 * @returns {void}
 */
export const getSimpleAlert = actionDescription =>
  Alert.alert(actionDescription);

/**
 * @param {string} actionDescription1
 * @param {string} actionDescription2
 * @param {(str?: string) => void} functionOnPress
 * @returns {void}
 */
export const getPromptAlert = (
  actionDescription1,
  actionDescription2,
  functionOnPress,
) =>
  Alert.prompt(
    actionDescription1,
    actionDescription2,
    [
      {
        text: Translations.strings.cancel(),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: functionOnPress,
      },
    ],
    'plain-text',
  );
