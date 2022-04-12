import {DataStore, SortDirection} from 'aws-amplify';
import ChatMessage from 'components/chat/ChatMessage';
import MessageInput from 'components/chat/MessageInput';
import ConversationPersonImage from 'components/ConversationPersonImage';
import {
  ChatRoom,
  ChatRoomUser,
  Message,
  Message as MessageModel,
  User,
} from 'models';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {UseState} from 'types/CommonTypes';
import {ChatScreenProps} from 'types/NavigationTypes';
import {AuthenticateState} from 'types/StoreTypes';

/**
 * @param {ChatScreenProps} props
 * @returns {JSX.Element}
 */
const ChatRoomScreen = props => {
  const {route, navigation} = props;
  /** @type {UseState<MessageModel[]>} */
  const [messages, setMessages] = useState([]);
  /** @type {UseState<ChatRoom>} */
  const [chatRoom, setChatRoom] = useState();
  /** @type {UseState<User>} */
  const [otherUser, setOtherUSer] = useState();

  const authedUserState = useSelector(
    /** @param {{auth: AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: prop => {
        return (
          <View style={styles.headerContainer}>
            <ConversationPersonImage
              imageStyle={styles.icon}
              imageSource={otherUser?.imageUri}
            />
            <Text style={{...styles.text, color: prop.tintColor}}>
              {otherUser?.name}
            </Text>
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
  }, [navigation, otherUser?.imageUri, otherUser?.name]);

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

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        ListEmptyComponent={
          <View
            style={{
              ...Theme.styles.center,
            }}>
            <Text>{Translations.strings.emptyChat()}</Text>
          </View>
        }
        style={styles.list}
        data={messages}
        renderItem={
          /** @param {{item: MessageModel}} param0 */ ({item}) => (
            <ChatMessage
              message={item}
              isMine={item.userID === authedUserState.authedUser.id}
            />
          )
        }
        keyExtractor={(item, index) => `${item.createdAt}${index}`}
      />
      <MessageInput
        onAddFile={() => {}}
        onSend={async text => {
          const response = await DataStore.save(
            new MessageModel({
              userID: authedUserState.authedUser.id,
              chatroomID: chatRoom.id,
              content: text,
            }),
          );
          updateLastMessage(response);
        }}
        onEmoji={() => {}}
        onMic={() => {}}
        onCamera={() => {}}
      />
    </SafeAreaView>
  );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({
  page: {
    backgroundColor: Theme.colors.white,
    ...Theme.styles.screen,
  },
  list: {
    flexDirection: 'column-reverse',
    ...Theme.styles.screen,
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
