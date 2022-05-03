import {DataStore} from 'aws-amplify';
import ChatRoomList from 'components/chatRooms/ChatRoomList';
import LoadingIndicator from 'components/common/LoadingIndicator';
import ConversationPersonImage from 'components/ConversationPersonImage';
import {ChatRoom, ChatRoomUser, Message, User} from 'models';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import Theme from 'theme/Theme';
import {UseState} from 'types/CommonTypes';
import {HomeScreenProps} from 'types/NavigationTypes';
import {AuthenticateState} from 'types/StoreTypes';

/**
 * @param {HomeScreenProps} props
 * @returns {JSX.Element}
 */
const HomeScreen = props => {
  const {navigation} = props;

  /** @type {UseState<boolean>} */
  const [isLoading, setIsLoading] = useState(true);
  /** @type {UseState<{users: User[], lastMessage: Message, admin: User, groupName: string, groupImage: string, chatRoom: ChatRoom}[]>} */
  const [chatRooms, setChatRooms] = useState();

  const authedUserState = useSelector(
    /** @param {{auth: AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  const fetchChatRoomData = useCallback(
    /**
     * @param {ChatRoom} room
     * @returns {Promise<{users: User[], lastMessage: Message, admin: User, groupName: string, groupImage: string}>}
     */ async room => {
      const chatRoomUsers = (await DataStore.query(ChatRoomUser)).filter(
        item => item.chatRoom.id === room.id,
      );

      /** @type {Message} */
      let lastMessage;
      /** @type {User[]} */
      let users;

      if (room.chatRoomLastMessageId) {
        const message = await DataStore.query(
          Message,
          room.chatRoomLastMessageId,
        );
        lastMessage = message;
      }

      //setUsers(chatRoomUsers.map(item => item.user));
      users = chatRoomUsers
        .filter(item => item.user.id !== authedUserState.authedUser.id)
        .map(item => item.user);

      return {
        users: users,
        lastMessage: lastMessage,
        admin: room.Admin,
        groupName: room.groupName,
        groupImage: room.groupImage,
      };
    },
    [authedUserState],
  );

  const fetchChatRooms = useCallback(async () => {
    const chatRoomUsers = await DataStore.query(ChatRoomUser);
    const rooms = chatRoomUsers
      .filter(
        chatRoomUser => chatRoomUser.user.id === authedUserState.authedUser.id,
      )
      .map(chatRoomUser => chatRoomUser.chatRoom);

    /** @type {{users: User[], lastMessage: Message, admin: User, groupName: string, groupImage: string, chatRoom: ChatRoom}[]} */
    const chatRoomsData = [];
    for (const room of rooms) {
      const data = await fetchChatRoomData(room);
      chatRoomsData.push({
        ...data,
        chatRoom: room,
      });
    }
    setChatRooms(chatRoomsData);
    setIsLoading(false);
  }, [authedUserState.authedUser, fetchChatRoomData]);

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: prop => {
        return (
          <>
            <TouchableOpacity
              style={{marginHorizontal: Theme.values.margins.marginSmall}}>
              <Icon
                name="camera-outline"
                color={Theme.colors.black}
                size={Theme.values.headerIcon.height}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('UsersScreen');
              }}
              style={{marginHorizontal: Theme.values.margins.marginSmall}}>
              <Icon
                name="pencil-outline"
                color={Theme.colors.black}
                size={Theme.values.headerIcon.height}
              />
            </TouchableOpacity>
          </>
        );
      },
      headerLeft: prop => {
        return (
          <>
            {authedUserState.authedUser && (
              <TouchableOpacity
                style={{marginHorizontal: Theme.values.margins.marginSmall}}
                onPress={() => {
                  navigation.navigate('Profile');
                }}>
                <ConversationPersonImage
                  imageStyle={styles.icon}
                  imageSource={authedUserState.authedUser?.imageUri}
                />
              </TouchableOpacity>
            )}
          </>
        );
      },
    });
  }, [authedUserState.authedUser, navigation]);

  /**
   * @param {string} chatRoomId
   */
  const onPress = chatRoomId => {
    props.navigation.navigate('ChatScreen', {
      id: chatRoomId,
    });
  };

  const refreshData = async () => {
    setIsLoading(true);
    await fetchChatRooms();
    return true;
  };

  const getContent = () => {
    return (
      <ChatRoomList
        onPress={onPress}
        data={chatRooms}
        onRefresh={refreshData}
      />
    );
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      {!isLoading && getContent()}
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: Theme.values.headerIcon.width,
    height: Theme.values.headerIcon.height,
  },
});

export default HomeScreen;
