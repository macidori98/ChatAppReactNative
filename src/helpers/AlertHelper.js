import React from 'react';
import {Alert, AlertButton, Platform, View} from 'react-native';
import Dialog from 'react-native-dialog';
import {Translations} from 'translations/Translations';

/**
 * @param {boolean} visible
 * @param {string} title
 * @param {string} description
 * @param {() => void} onCancelPress
 * @param {string} [labelCancel]
 * @returns {JSX.Element}
 */
export const getSimpleDialog = (
  visible,
  title,
  description,
  onCancelPress,
  labelCancel,
) => {
  return (
    <View key={`Dialog.${title}`}>
      <Dialog.Container visible={visible}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Dialog.Button
          onPress={onCancelPress}
          label={labelCancel ?? Translations.strings.cancel()}
        />
      </Dialog.Container>
    </View>
  );
};

/**
 * @param {boolean} visible
 * @param {string} title
 * @param {string} description
 * @param {() => void } onConfirmPress
 * @param {() => void} onCancelPress
 * @param {string} [labelConfirm]
 * @param {string} [labelCancel]
 * @param {string} [confirmColor]
 * @param {string} [thirdLabel]
 * @param {() => void} [onThirdButton]
 * @returns {JSX.Element}
 */
export const getInteractiveDialog = (
  visible,
  title,
  description,
  onConfirmPress,
  onCancelPress,
  labelConfirm,
  labelCancel,
  confirmColor,
  thirdLabel,
  onThirdButton,
) => {
  if (Platform.OS === 'ios') {
    /** @type {AlertButton[]} */
    const array = [
      {
        style: 'cancel',
        onPress: onCancelPress,
        text: labelCancel ?? Translations.strings.cancel(),
      },
      {
        style: 'default',
        onPress: onConfirmPress,
        text: labelConfirm ?? 'Ok',
      },
    ];
    if (onThirdButton) {
      array.push({
        style: 'default',
        onPress: onThirdButton,
        text: thirdLabel ?? 'Ok',
      });
    }
    if (visible) {
      Alert.alert(title, description, array);
      return <></>;
    }
  }

  return (
    <View key={`Dialog.${title}`}>
      <Dialog.Container visible={visible}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Dialog.Button
          onPress={onCancelPress}
          label={labelCancel ?? Translations.strings.cancel()}
        />
        <Dialog.Button
          color={confirmColor ?? undefined}
          onPress={onConfirmPress}
          label={labelConfirm ?? 'Ok'}
        />
        {thirdLabel && (
          <Dialog.Button onPress={onThirdButton} label={thirdLabel} />
        )}
      </Dialog.Container>
    </View>
  );
};

/**
 * @param {boolean} visible
 * @param {string} title
 * @param {string} description
 * @param {(text:string) => void} onChangeText
 * @param {() => void } onConfirmPress
 * @param {() => void} onCancelPress
 * @returns {JSX.Element}
 */
export const getPromptDialog = (
  visible,
  title,
  description,
  onChangeText,
  onConfirmPress,
  onCancelPress,
) => {
  return (
    <View key={`Dialog.${title}`}>
      <Dialog.Container visible={visible}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Dialog.Input onChangeText={onChangeText} />
        <Dialog.Button
          onPress={onCancelPress}
          label={Translations.strings.cancel()}
        />
        <Dialog.Button onPress={onConfirmPress} label="Ok" />
      </Dialog.Container>
    </View>
  );
};
