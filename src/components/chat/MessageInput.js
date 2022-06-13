import {
  androidCameraPermissions,
  androidStoragePermissions,
  getPermissions,
  IOSCameraPermissions,
  IOSStoragePermissions,
} from 'helpers/PermissionsHelper';
import React, {useCallback, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as reactNativeDocumentPicker from 'react-native-document-picker';
import EmojiSelector from 'react-native-emoji-selector';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
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
  /** @type {UseState<boolean>} */
  const [isEmojiSelected, setIsEmojiSelected] = useState(false);

  const sendMessage = () => {
    Keyboard.dismiss();
    props.onSendMessage(message);

    setMessage('');
    setIsEmojiSelected(false);
  };

  const onEmoji = () => {
    Keyboard.dismiss();
    setIsEmojiSelected(!isEmojiSelected);
  };

  /**
   * @param {(data: Asset[])=>void} [onResultRecieved]
   */
  const openCamera = async onResultRecieved => {
    const result = await launchCamera({
      mediaType: 'mixed',
      saveToPhotos: true,
      includeBase64: true,
      cameraType: 'back',
    });
    if (!result.didCancel) {
      onResultRecieved?.(result.assets);
    }
  };

  /**
   * @param {(data: Asset[])=>void} [onResultRecieved]
   */
  const openGallery = async onResultRecieved => {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      includeBase64: true,
      includeExtra: true,
    });
    if (!result.didCancel) {
      onResultRecieved?.(result.assets);
    }
  };

  /**
   * @param {reactNativeDocumentPicker.DocumentPickerResponse[]} data
   */
  const onFileRecieved = data => {
    props.onAddFile(data);
  };

  /**
   * @param {Asset[]} data
   */
  const onImageRecieved = data => {
    props.onCamera(data);
  };

  const onOpenCamera = async () => {
    await getPermissions(
      openCamera,
      Platform.OS === 'android'
        ? androidCameraPermissions
        : IOSCameraPermissions,
      onImageRecieved,
    );
  };

  const onOpenGallery = async () => {
    await getPermissions(
      openGallery,
      Platform.OS === 'android'
        ? androidCameraPermissions
        : IOSCameraPermissions,
      onImageRecieved,
    );
  };

  /**
   * @param {reactNativeDocumentPicker.DocumentPickerResponse[]} onResultRecieved
   */
  const handleDocumentSelection = useCallback(
    /**
     * @param {(data: reactNativeDocumentPicker.DocumentPickerResponse[]) => void} onResultRecieved
     */ async onResultRecieved => {
      try {
        const response = await reactNativeDocumentPicker.pick({
          presentationStyle: 'fullScreen',
        });
        onResultRecieved(response);
        //setFileResponse(response);
      } catch (err) {
        console.warn(err);
      }
    },
    [],
  );

  const onAddFile = async () => {
    await getPermissions(
      handleDocumentSelection,
      Platform.OS === 'android'
        ? androidStoragePermissions
        : IOSStoragePermissions,
      onFileRecieved,
    );
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView>
        <View style={styles.root}>
          {/* {base64 && (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{
                  uri: `data:${base64[0].type};base64,${base64[0].base64}`,
                }}
              />
              <TouchableOpacity
                style={styles.cancelContainer}
                onPress={() => {
                  setBase64(undefined);
                }}>
                <Text style={{color: Theme.colors.primary}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )} */}
          {props.replyToMessage && (
            <View style={styles.imageContainer}>
              <Text>{props.replyToMessage.content}</Text>
              <TouchableOpacity
                style={styles.cancelContainer}
                onPress={() => {
                  props.onCancelReply();
                }}>
                <Text style={{color: Theme.colors.primary}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputRootContainer}>
            <View style={styles.inputContainer}>
              {!message && (
                <TouchableOpacity style={styles.icon} onPress={onEmoji}>
                  <Icon
                    name="happy-outline"
                    color={Theme.colors.icon}
                    size={25}
                  />
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
                <TouchableOpacity style={styles.icon} onPress={onOpenCamera}>
                  <Icon
                    name="camera-outline"
                    color={Theme.colors.icon}
                    size={25}
                  />
                </TouchableOpacity>
              )}
              {!message && (
                <TouchableOpacity style={styles.icon} onPress={onOpenGallery}>
                  <Icon
                    name="image-outline"
                    color={Theme.colors.icon}
                    size={25}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={message ? sendMessage : onAddFile}
              style={styles.buttonContainer}>
              <View style={styles.icon}>
                <Icon
                  name={message ? 'send' : 'add-outline'}
                  color={Theme.colors.white}
                  size={message ? 18 : 25}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {isEmojiSelected && (
          <View style={styles.emojiContainer}>
            <EmojiSelector
              onEmojiSelected={emoji => {
                setMessage(prev => `${prev}${emoji}`.replace('undefined', ''));
              }}
              theme={Theme.colors.primary}
              columns={Math.floor(Dimensions.get('screen').width / 40)}
            />
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  cancelContainer: {
    position: 'absolute',
    top: Theme.values.margins.marginSmall,
    right: Theme.values.margins.marginLarge,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  root: {
    backgroundColor: Theme.colors.inputBackground,
    maxHeight: 220,
    marginHorizontal: Theme.values.margins.marginMedium,
    marginVertical: Theme.values.margins.marginSmall,
    borderWidth: Theme.values.borderWidth.small,
    borderColor: Theme.colors.border,
    overflow: 'hidden',
    borderRadius: Theme.values.radius.extraLarge,
    minHeight: Theme.values.roundButton.height,
  },
  imageContainer: {
    height: 80,
    width: '100%',
    marginTop: Theme.values.margins.marginSmall,
  },
  textInput: {
    ...Theme.styles.screen,
    maxHeight: 120,
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
  },
  inputRootContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.values.paddings.paddingMedium,
    ...Theme.styles.center,
    marginVertical: Theme.values.margins.marginSmall,
  },
  emojiContainer: {
    height: Dimensions.get('screen').height * 0.6,
  },
});
