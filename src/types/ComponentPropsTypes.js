import {ChatRoom, Message, User} from 'models';
import {
  ImageStyle,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  ViewStyle,
} from 'react-native';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {Asset} from 'react-native-image-picker';

/**
 * @typedef {Object} AnimatedTextInputProps
 * @property {string} value
 * @property {string} label
 * @property {string} errorText
 * @property {boolean} secureTextEntry
 * @property {ViewStyle} [style]
 * @property {(event: NativeSyntheticEvent<TextInputFocusEventData>) => void} [onBlur]
 * @property {(event: NativeSyntheticEvent<TextInputFocusEventData>) => void} [onFocus]
 * @property {(text: string) => void} onChangeText
 * @property {() => boolean} [dataIsValid]
 * @property {KeyboardTypeOptions} [keyboardType]
 * @property {"none" | "sentences" | "words" | "characters"} [autoCapitalize]
 */

/**
 * @typedef {Object} ChatMessageProps
 * @property {Message} message
 * @property {boolean} isMine
 * @property {()=>void} onImageFullScreen
 */

/**
 * @typedef {Object} MessageInputProps
 * @property {(data: DocumentPickerResponse[]) => void} onAddFile
 * @property {(text: string) => void} onSendMessage
 * @property {() => void} onMic
 * @property {(data:Asset[]) => void} onCamera
 */

/**
 * @typedef {Object} ChatRoomListProps
 * @property {{chatRoom: ChatRoom, lastMessage: Message, user: User}[]} data
 * @property {(id: string) => void} onPress
 * @property {() => void} onRefresh
 */

/**
 * @typedef {Object} ChatRoomListItemProps
 * @property {{chatRoom: ChatRoom, lastMessage: Message, user: User}} data
 * @property {(id: string) => void} onPress
 */

/**
 * @typedef {Object} ConversationPersonImageProps
 * @property {string} imageSource
 * @property {ImageStyle} [imageStyle]
 */

/**
 * @typedef {Object} MessageBadgeProps
 * @property {number} count
 */

/**
 * @typedef {Object} UsersListItemProps
 * @property {User} user
 * @property {{(user: User): void}} onPress
 */

/**
 * @typedef {Object} UsersListProps
 * @property {User[]} users
 * @property {{(user: User): void}} onPress
 */

export {};
