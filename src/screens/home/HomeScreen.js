import {DataStore} from 'aws-amplify';
import ChatRoomList from 'components/chatRooms/ChatRoomList';
import LoadingIndicator from 'components/common/LoadingIndicator';
import ConversationPersonImage from 'components/ConversationPersonImage';
import {ChatRoom, ChatRoomUser} from 'models';
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
  /** @type {UseState<ChatRoom[]>} */
  const [chatRooms, setChatRooms] = useState();

  const authedUserState = useSelector(
    /** @param {{auth: AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  const fetchChatRooms = useCallback(async () => {
    const chatRoomUsers = await DataStore.query(ChatRoomUser);
    setChatRooms(
      chatRoomUsers
        .filter(
          chatRoomUser =>
            chatRoomUser.user.id === authedUserState.authedUser.id,
        )
        .map(chatRoomUser => chatRoomUser.chatRoom),
    );
    setIsLoading(false);
  }, [authedUserState.authedUser]);

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
                style={{marginHorizontal: Theme.values.margins.marginSmall}}>
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

  return (
    <>
      {isLoading && <LoadingIndicator />}
      {!isLoading && <ChatRoomList onPress={onPress} data={chatRooms} />}
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
