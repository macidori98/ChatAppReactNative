import {useHeaderHeight} from '@react-navigation/elements';
import {DataStore, SortDirection, Storage} from 'aws-amplify';
import ChatMessage from 'components/chat/ChatMessage';
import MessageInput from 'components/chat/MessageInput';
import LoadingIndicator from 'components/common/LoadingIndicator';
import ConversationPersonImage from 'components/ConversationPersonImage';
import {
  ChatRoom,
  ChatRoomUser,
  Message,
  Message as MessageModel,
  User,
} from 'models';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-get-random-values';
import {Asset} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {UseState} from 'types/CommonTypes';
import {ChatScreenProps} from 'types/NavigationTypes';
import {AuthenticateState} from 'types/StoreTypes';
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
  /** @type {UseState<User>} */
  const [otherUser, setOtherUSer] = useState();
  /** @type {UseState<boolean>} */
  const [isLoading, setIsLoading] = useState(true);
  /** @type {UseState<number>} */
  const [sending, setSending] = useState(undefined);
  /** @type {React.MutableRefObject<FlatList<Message>>} */
  const flatListRef = useRef();

  const screenHeaderHeight = useHeaderHeight();
  const screenDimensions = Dimensions.get('screen');

  const authedUserState = useSelector(
    /** @param {{auth: AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  /**
   * @param {number} minutes
   * @returns {string}
   */
  const getStatusText = minutes => {
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: prop => {
        var lastOnline = moment.unix(otherUser?.lastOnlineAt);

        var now = moment.unix(moment().unix());
        var duration = moment.duration(now.diff(lastOnline));
        var minutes = Math.floor(duration.asMinutes());
        return (
          <View style={styles.headerContainer}>
            <ConversationPersonImage
              imageStyle={styles.icon}
              imageSource={otherUser?.imageUri}
            />

            <View>
              <Text style={{...styles.text, color: prop.tintColor}}>
                {otherUser?.name}
              </Text>
              {minutes < 10 ? (
                <Text style={{...styles.text, color: prop.tintColor}}>
                  Online
                </Text>
              ) : (
                <Text style={{...styles.text, color: prop.tintColor}}>
                  {getStatusText(minutes)}
                </Text>
              )}
            </View>
          </View>
        );
      },
      headerRight: prop => {
        return (
          <>
            <TouchableOpacity
              style={{marginHorizontal: Theme.values.margins.marginSmall}}>
              <Icon
                name="call-outline"
                color={
                  Platform.OS === 'ios'
                    ? Theme.colors.black
                    : Theme.colors.white
                }
                size={Theme.values.headerIcon.height}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={{marginHorizontal: Theme.values.margins.marginSmall}}>
              <Icon
                name="videocam-outline"
                color={
                  Platform.OS === 'ios'
                    ? Theme.colors.black
                    : Theme.colors.white
                }
                size={Theme.values.headerIcon.height}
              />
            </TouchableOpacity>
          </>
        );
      },
    });
  }, [
    navigation,
    otherUser?.imageUri,
    otherUser?.lastOnlineAt,
    otherUser?.name,
  ]);

  const fetchChatRoom = useCallback(async () => {
    const room = await DataStore.query(ChatRoom, route.params.id);
    setChatRoom(room);
  }, [route.params.id]);

  const fetchMessages = useCallback(async () => {
    const fetchedMessages = await DataStore.query(
      MessageModel,
      item => item.chatroomID('eq', chatRoom.id),
      {
        sort: message => message.createdAt(SortDirection.ASCENDING),
      },
    );

    setMessages(fetchedMessages);
    setIsLoading(false);
  }, [chatRoom]);

  const fetchOtherUserData = useCallback(async () => {
    const chatRoomUsers = (await DataStore.query(ChatRoomUser)).filter(
      item => item.chatRoom.id === chatRoom.id,
    );

    setOtherUSer(
      chatRoomUsers.filter(
        item => item.user.id !== authedUserState.authedUser.id,
      )[0].user,
    );
  }, [authedUserState.authedUser.id, chatRoom]);

  useEffect(() => {
    const subscription = DataStore.observe(MessageModel).subscribe(msg => {
      if (msg.opType === 'INSERT' && msg.model === MessageModel) {
        setMessages(existingMessages => [...existingMessages, msg.element]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchChatRoom();
  }, [fetchChatRoom]);

  useEffect(() => {
    if (chatRoom) {
      fetchOtherUserData();
      fetchMessages();
    }
  }, [chatRoom, fetchMessages, fetchOtherUserData]);

  const getFileBlob = async uri => {
    if (!uri) {
      return null;
    }

    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  /**
   * @param {Message} newMessage
   */
  const updateLastMessage = async newMessage => {
    DataStore.save(
      ChatRoom.copyOf(chatRoom, updatedChatRoom => {
        updatedChatRoom.LastMessage = newMessage;
      }),
    );
  };

  /**
   * @param {import('react-native-document-picker').DocumentPickerResponse[]} data
   */
  const sendFile2 = async data => {
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
    }); // file name is the result
    const response = await DataStore.save(
      new MessageModel({
        userID: authedUserState.authedUser.id,
        chatroomID: chatRoom.id,
        content: key,
        messageType: messageType,
        base64type: data[0].type,
        status: 'SENT',
      }),
    );
    setSending(undefined);
    updateLastMessage(response);
  };

  /**
   * @param {Asset[]} data
   */
  const sendFile = async data => {
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
    }); // file name is the result
    const response = await DataStore.save(
      new MessageModel({
        userID: authedUserState.authedUser.id,
        chatroomID: chatRoom.id,
        content: key,
        messageType: messageType,
        base64type: data[0].type,
        status: 'SENT',
      }),
    );
    setSending(undefined);
    updateLastMessage(response);
  };

  return (
    <SafeAreaView style={styles.page}>
      {isLoading && <LoadingIndicator />}
      {!isLoading && (
        <>
          {sending && (
            <View style={{...styles.loadingIndicator, width: `${sending}%`}} />
          )}
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
                    setReplyToMessage(message);
                  }}
                  message={item}
                  isMine={item.userID === authedUserState.authedUser.id}
                  onImageFullScreen={() => {
                    navigation.navigate('FullScreen', {
                      imageId: item.content,
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
          sendFile2(data);
        }}
        onSendMessage={async text => {
          const response = await DataStore.save(
            new MessageModel({
              userID: authedUserState.authedUser.id,
              chatroomID: chatRoom.id,
              content: text,
              messageType: 'text',
              status: 'SENT',
              replyToMessageId: replyToMessage ? replyToMessage.id : null,
            }),
          );
          setReplyToMessage(undefined);
          updateLastMessage(response);
        }}
        onMic={() => {
          Toast.show({
            type: 'success',
            text1: 'Hello',
            text2: 'This is some something 👋',
          });
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
    // backgroundColor: Theme.colors.white,
    ...Theme.styles.screen,
  },
  list: {
    //flexDirection: 'column-reverse',
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
});
