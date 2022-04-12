import {DataStore} from 'aws-amplify';
import LoadingIndicator from 'components/common/LoadingIndicator';
import ConversationPersonImage from 'components/ConversationPersonImage';
import MessageBadge from 'components/MessageBadge';
import {formatDate} from 'helpers/FormattingFunctions';
import {ChatRoomUser, Message, User} from 'models';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import Theme from 'theme/Theme';
import {UseState} from 'types/CommonTypes';
import {ChatRoomListItemProps} from 'types/ComponentPropsTypes';
import {AuthenticateState} from 'types/StoreTypes';

/**
 * @param {ChatRoomListItemProps} props
 * @returns {JSX.Element}
 */
const ChatRoomListItem = props => {
  const roomData = props.data;

  // /**
  //  * @type {UseState<User[]>}
  //  */
  // const [users, setUsers] = useState([]);

  /** @type {UseState<User>} */
  const [user, setUser] = useState();
  /** @type {UseState<boolean>} */
  const [isLoading, setIsLoading] = useState(false);
  /** @type {UseState<Message>} */
  const [lastMessage, setLastMessage] = useState();

  const authedUserState = useSelector(
    /** @param {{auth: AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  const fetchChatRoomData = useCallback(async () => {
    setIsLoading(true);
    const chatRoomUsers = (await DataStore.query(ChatRoomUser)).filter(
      item => item.chatRoom.id === roomData.id,
    );

    if (roomData.chatRoomLastMessageId) {
      const message = await DataStore.query(
        Message,
        roomData.chatRoomLastMessageId,
      );
      setLastMessage(message);
    }

    //setUsers(chatRoomUsers.map(item => item.user));
    setUser(
      chatRoomUsers.filter(
        item => item.user.id !== authedUserState.authedUser.id,
      )[0].user,
    );
    setIsLoading(false);
  }, [authedUserState, roomData.chatRoomLastMessageId, roomData.id]);

  useEffect(() => {
    fetchChatRoomData();
  }, [fetchChatRoomData]);

  return (
    <>
      {isLoading && <LoadingIndicator />}
      {!isLoading && (
        <TouchableOpacity onPress={() => props.onPress(roomData.id)}>
          <View style={styles.container}>
            <ConversationPersonImage
              imageSource={user?.imageUri}
              imageStyle={styles.image}
            />

            {roomData?.newMessages > 0 && (
              <MessageBadge count={roomData.newMessages} />
            )}

            <View style={styles.fullSpace}>
              <View style={styles.textContainer}>
                <Text style={styles.name}>{user?.name}</Text>
                {lastMessage && (
                  <Text style={styles.text}>
                    {formatDate(lastMessage.createdAt)}
                  </Text>
                )}
              </View>
              <Text numberOfLines={1} style={styles.text}>
                {lastMessage?.content}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ChatRoomListItem;

const styles = StyleSheet.create({
  fullSpace: {
    ...Theme.styles.screen,
    justifyContent: 'center',
    paddingHorizontal: Theme.values.paddings.paddingMedium,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: Theme.values.paddings.paddingMedium,
    marginVertical: Theme.values.margins.marginSmall,
  },
  image: {
    height: Theme.values.personImage.normal,
    width: Theme.values.personImage.normal,
  },
  text: {
    fontSize: Theme.values.fontSize.small,
    color: Theme.colors.grey,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: Theme.values.fontSize.normal,
    color: Theme.colors.black,
    fontWeight: '700',
    marginBottom: Theme.values.margins.marginSmall,
  },
});
