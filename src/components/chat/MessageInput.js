import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {UseState} from 'types/CommonTypes';
import {MessageInputProps} from 'types/ComponentPropsTypes';

/**
 * @param {MessageInputProps} props
 * @returns {JSX.Element}
 */
const MessageInput = props => {
  /** @type {UseState<string>} */
  const [message, setMessage] = useState();

  const sendMessage = () => {
    props.onSend(message);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.inputContainer}>
        {!message && (
          <TouchableOpacity style={styles.icon} onPress={props.onEmoji}>
            <Icon name="happy-outline" color={Theme.colors.icon} size={25} />
          </TouchableOpacity>
        )}
        <TextInput
          showSoftInputOnFocus={true}
          value={message}
          style={styles.textInput}
          focusable={true}
          onChangeText={text => {
            setMessage(text);
          }}
          multiline={true}
          placeholder={Translations.strings.enterMessage()}
        />
        {!message && (
          <TouchableOpacity style={styles.icon} onPress={props.onCamera}>
            <Icon name="camera-outline" color={Theme.colors.icon} size={25} />
          </TouchableOpacity>
        )}
        {!message && (
          <TouchableOpacity style={styles.icon} onPress={props.onMic}>
            <Icon name="mic-outline" color={Theme.colors.icon} size={25} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={message ? sendMessage : props.onAddFile}
        style={styles.buttonContainer}>
        <View style={styles.icon}>
          <Icon
            name={message ? 'send' : 'add-outline'}
            color={Theme.colors.white}
            size={message ? 18 : 25}
          />
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  textInput: {
    ...Theme.styles.screen,
    marginBottom:
      Platform.OS === 'ios' ? Theme.values.margins.marginSmall : undefined,
    marginHorizontal: Theme.values.margins.marginMedium,
  },
  icon: {
    marginHorizontal: Theme.values.margins.marginSmall,
    ...Theme.styles.center,
  },
  buttonContainer: {
    marginStart: Theme.values.margins.marginSmall,
    backgroundColor: Theme.colors.primary,
    width: Theme.values.roundButton.width,
    height: Theme.values.roundButton.height,
    borderRadius: Theme.values.roundButton.width / 2,
    ...Theme.styles.center,
  },
  inputContainer: {
    flexDirection: 'row',
    ...Theme.styles.screen,
    ...Theme.styles.center,
    backgroundColor: Theme.colors.inputBackground,
    maxHeight: 120,
    borderWidth: Theme.values.borderWidth.small,
    borderColor: Theme.colors.border,
    overflow: 'hidden',
    flex: 1,
    borderRadius: Theme.values.radius.extraLarge,
    minHeight: Theme.values.roundButton.height,
  },
  root: {
    flexDirection: 'row',
    paddingHorizontal: Theme.values.paddings.paddingMedium,
    ...Theme.styles.center,
    marginVertical: Theme.values.margins.marginSmall,
  },
});
