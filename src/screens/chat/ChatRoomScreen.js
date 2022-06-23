import AsyncStorage from '@react-native-async-storage/async-storage';
import {useHeaderHeight} from '@react-navigation/elements';
import {
  deleteMessageDatabase,
  getChatRoom,
  getMessages,
  getOtherChatRoomUserData,
  saveMessage,
  updateLastMessageDatabase,
} from 'api/Requests';
import {DataStore, Storage} from 'aws-amplify';
import ChatMessage from 'components/chat/ChatMessage';
import MessageInput from 'components/chat/MessageInput';
import LoadingIndicator from 'components/common/LoadingIndicator';
import ConversationPersonImage from 'components/ConversationPersonImage';
import {getInteractiveDialog, getSimpleDialog} from 'helpers/AlertHelper';
import {SECRET_KEY} from 'helpers/Constants';
import {getFileBlob} from 'helpers/GalleryHelper';
import {ChatRoom, Message, Message as MessageModel, User} from 'models';
import moment from 'moment';
import React, {
  createRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {DocumentPickerResponse} from 'react-native-document-picker';
import 'react-native-get-random-values';
import {Asset} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {UseState} from 'types/CommonTypes';
import {ChatScreenProps} from 'types/NavigationTypes';
import {AuthenticateState} from 'types/StoreTypes';
import {encryptText, getStatusText} from 'utils/Utils';
import {v4 as uuidv4} from 'uuid';

/**
 * @param {ChatScreenProps} props
 * @returns {JSX.Element}
 */
const ChatRoomScreen = props => {
  const {route, navigation} = props;
  /** @type {UseState<MessageModel[]>} */
  const [messages, setMessages] = useState([]);
  /** @type {UseState<MessageModel>} */
  const [replyToMessage, setReplyToMessage] = useState();
  /** @type {UseState<ChatRoom>} */
  const [chatRoom, setChatRoom] = useState();
  /** @type {UseState<{isGroup: true, users: User[]}|{isGroup: false, user: User}>} */
  const [otherUser, setOtherUSer] = useState();
  /** @type {UseState<boolean>} */
  const [isLoading, setIsLoading] = useState(true);
  /** @type {UseState<boolean>} */
  const [isDialogShown, setIsDialogShown] = useState();
  /** @type {UseState<number>} */
  const [sending, setSending] = useState(undefined);
  /** @type {UseState<string>} */
  const [secretKey, setSecretKey] = useState();
  /** @type {React.MutableRefObject<FlatList<Message>>} */
  const flatListRef = useRef();
  /** @type {React.MutableRefObject<Message>} */
  const messageRef = useRef();
  /** @type {UseState<boolean>} */
  const [isDeleteDialogShown, setIsDeleteDialogShown] = useState();

  const screenHeaderHeight = useHeaderHeight();
  const screenDimensions = Dimensions.get('screen');

  const actionSheetRef = createRef();

  const authedUserState = useSelector(
    /** @param {{auth: AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  const setHeaderOptions = useCallback(
    /**
     * @param {{children: string, tintColor?: string}} prop
     * @returns {JSX.Element}
     */
    prop => {
      var imageUri, name, lastOnline, now, duration, minutes;
      if (otherUser) {
        if (otherUser.isGroup === false) {
          lastOnline = moment.unix(otherUser?.user.lastOnlineAt);
          imageUri = otherUser?.user.imageUri;
          name = otherUser?.user.userName;
          now = moment.unix(moment().unix());
          duration = moment.duration(now.diff(lastOnline));
          minutes = Math.floor(duration.asMinutes());
        } else {
          imageUri = chatRoom?.groupImage;
          name = chatRoom?.groupName;
        }

        return (
          <TouchableOpacity
            style={styles.headerContainer}
            onPress={() => {
              props.navigation.navigate('DetailsScreen', {data: chatRoom});
            }}>
            <ConversationPersonImage
              imageStyle={styles.icon}
              imageSource={imageUri}
            />

            <View>
              <Text style={{...styles.text, color: prop.tintColor}}>
                {name}
              </Text>
              {minutes < 10 && (
                <Text style={{...styles.text, color: prop.tintColor}}>
                  Online
                </Text>
              )}
              {minutes >= 10 && (
                <Text style={{...styles.text, color: prop.tintColor}}>
                  {getStatusText(minutes)}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      }
    },
    [chatRoom, otherUser, props.navigation],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: propss => setHeaderOptions(propss),
    });
  }, [navigation, setHeaderOptions]);

  useEffect(() => {
    const getSecretKey = async () => {
      const secretKeyValue = await AsyncStorage.getItem(SECRET_KEY);
      setSecretKey(secretKeyValue);
    };

    getSecretKey();
  }, []);

  const fetchChatRoom = useCallback(async () => {
    const room = await getChatRoom(route.params.id);
    setChatRoom(room);
  }, [route.params.id]);

  const fetchMessages = useCallback(async () => {
    const fetchedMessages = await getMessages(chatRoom.id);

    setMessages(fetchedMessages);
    setIsLoading(false);
  }, [chatRoom]);

  const fetchOtherUserData = useCallback(async () => {
    const chatUsers = await getOtherChatRoomUserData(chatRoom.id);

    if (chatRoom.groupName) {
      setOtherUSer({
        isGroup: true,
        users: chatUsers.map(u => u.user),
      });
    } else {
      setOtherUSer({
        isGroup: false,
        user: chatUsers[0].user,
      });
    }
  }, [chatRoom]);

  useEffect(() => {
    const subscription = DataStore.observe(MessageModel).subscribe(
      async msg => {
        if (msg.opType === 'INSERT' && msg.model === MessageModel) {
          if (msg.element.forUserId === authedUserState.authedUser.id) {
            setMessages(existingMessages => [...existingMessages, msg.element]);
          }
        }
        if (msg.opType === 'DELETE' && msg.model === MessageModel) {
          setMessages(prev => {
            let index = -1;

            prev.forEach((item, i) => {
              if (item.id === msg.element.id) {
                index = i;
              }
            });

            if (index > -1) {
              prev.splice(index, 1);
            }
            return [...prev];
          });
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [authedUserState.authedUser.id]);

  useEffect(() => {
    fetchChatRoom();
  }, [fetchChatRoom]);

  useEffect(() => {
    if (chatRoom) {
      fetchOtherUserData();
      fetchMessages();
    }
  }, [chatRoom, fetchMessages, fetchOtherUserData]);

  const updateLastMessage = useCallback(
    /** @param {Message} newMessage */
    async newMessage => {
      updateLastMessageDatabase(newMessage, chatRoom);
    },
    [chatRoom],
  );

  const sendMessage = useCallback(
    /**
     * @param {string} text
     * @param {string} publicKey
     * @param {string} messageType
     * @param {string} userId
     * @param {string} uniqueId
     * @param {string} [base64type]
     */
    async (text, publicKey, messageType, userId, uniqueId, base64type) => {
      const encryptedText = encryptText(text, publicKey, secretKey);
      const response = await saveMessage(
        chatRoom.id,
        encryptedText,
        messageType,
        userId,
        replyToMessage?.id,
        uniqueId,
        base64type,
      );

      setSending(undefined);
      updateLastMessage(response);
    },
    [chatRoom?.id, replyToMessage?.id, secretKey, updateLastMessage],
  );

  /**
   * @param {Asset[]|DocumentPickerResponse[]} data
   */
  const sendFile = async data => {
    if (!secretKey) {
      setIsDialogShown(true);
      return;
    }

    const blob = await getFileBlob(data[0].uri);
    const index = data[0].type.indexOf('/');
    const messageType = data[0].type.substring(0, index);
    const extenstion = data[0].type.substring(index + 1);
    const {key} = await Storage.put(`${uuidv4()}.${extenstion}`, blob, {
      progressCallback: progress => {
        setSending(
          Number(((progress.loaded / progress.total) * 100).toFixed(1)),
        );
      },
    });
    const uniqueId = uuidv4();

    if (otherUser.isGroup) {
      await Promise.all(
        [...otherUser.users, authedUserState.authedUser].map(async u => {
          sendMessage(
            key,
            u.publicKey,
            messageType,
            u.id,
            uniqueId,
            data[0].type,
          );
        }),
      );
    } else if (otherUser.isGroup === false) {
      await [otherUser.user, authedUserState.authedUser].map(async u => {
        sendMessage(
          key,
          u.publicKey,
          messageType,
          u.id,
          uniqueId,
          data[0].type,
        );
      });
    }
  };

  const deleteMessage = async () => {
    deleteMessageDatabase(messageRef.current);
    actionSheetRef.current?.hide();
  };

  return (
    <SafeAreaView style={styles.page}>
      {getSimpleDialog(
        isDialogShown,
        'warning',
        'You have to set your keypair from settings',
        () => {
          setIsDialogShown(false);
        },
      )}
      {isLoading && <LoadingIndicator />}
      {!isLoading && (
        <>
          {getInteractiveDialog(
            isDeleteDialogShown,
            'Delete',
            'Are you sure you want to delete the message?',
            () => {
              deleteMessage();
              setIsDeleteDialogShown(false);
            },
            () => {
              setIsDeleteDialogShown(false);
            },
            'Delete',
          )}
          {sending && (
            <View style={{...styles.loadingIndicator, width: `${sending}%`}} />
          )}
          <ActionSheet ref={actionSheetRef}>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButtonStyle}
                onPress={async () => {
                  setReplyToMessage(messageRef.current);
                  actionSheetRef.current?.hide();
                }}>
                <Text>Reply</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButtonStyle}
                onPress={() => {
                  setIsDeleteDialogShown(true);
                  actionSheetRef.current?.hide();
                }}>
                <Text>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  actionSheetRef.current?.hide();
                }}
                style={styles.actionButtonStyle}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ActionSheet>

          <FlatList
            ListEmptyComponent={
              <View
                style={{
                  ...Theme.styles.center,
                  height: screenDimensions.height - screenHeaderHeight,
                }}>
                <Text>{Translations.strings.emptyChat()}</Text>
              </View>
            }
            style={styles.list}
            data={messages}
            ref={ref => (flatListRef.current = ref)}
            onContentSizeChange={() => {
              flatListRef.current.scrollToEnd();
            }}
            renderItem={
              /** @param {{item: MessageModel}} param0 */ ({item}) => (
                <ChatMessage
                  onLongPress={message => {
                    messageRef.current = message;
                    actionSheetRef.current?.show();
                  }}
                  message={item}
                  isMine={item.userID === authedUserState.authedUser.id}
                  onImageFullScreen={content => {
                    navigation.navigate('FullScreen', {
                      imageId: content,
                      message: item,
                    });
                  }}
                />
              )
            }
            keyExtractor={(item, index) => `${item.createdAt}${index}`}
          />
        </>
      )}
      <MessageInput
        onCancelReply={() => {
          setReplyToMessage(undefined);
        }}
        replyToMessage={replyToMessage}
        onAddFile={data => {
          sendFile(data);
        }}
        onSendMessage={async text => {
          if (!secretKey) {
            setIsDialogShown(true);
            return;
          }

          const uniqueId = uuidv4();

          if (otherUser.isGroup) {
            await Promise.all(
              [...otherUser.users, authedUserState.authedUser].map(u =>
                sendMessage(text, u.publicKey, 'text', u.id, uniqueId),
              ),
            );
          } else if (otherUser.isGroup === false) {
            await [otherUser.user, authedUserState.authedUser].map(u =>
              sendMessage(text, u.publicKey, 'text', u.id, uniqueId),
            );
          }

          setReplyToMessage(undefined);
        }}
        onCamera={data => {
          sendFile(data);
        }}
      />
    </SafeAreaView>
  );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({
  page: {
    ...Theme.styles.screen,
  },
  list: {
    ...Theme.styles.screen,
  },
  loadingIndicator: {
    height: 2,
    backgroundColor: Theme.colors.grey,
  },
  icon: {
    width: Theme.values.headerIcon.width,
    height: Theme.values.headerIcon.height,
  },
  headerContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    marginHorizontal: Theme.values.margins.marginMedium,
  },
  actionButtonsContainer: {
    margin: 20,
    marginBottom: 30,
  },
  actionButtonStyle: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
