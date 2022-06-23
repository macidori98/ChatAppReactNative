import ConversationPersonImage from 'components/ConversationPersonImage';
import MessageBadge from 'components/MessageBadge';
import {formatDate} from 'helpers/FormattingFunctions';
import {Message} from 'models';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Theme from 'theme/Theme';
import {UseState} from 'types/CommonTypes';
import {ChatRoomListItemProps} from 'types/ComponentPropsTypes';
import {decryptMessage} from 'utils/Utils';

/**
 * @param {ChatRoomListItemProps} props
 * @returns {JSX.Element}
 */
const ChatRoomListItem = props => {
  const roomData = props.data;
  /** @type {UseState<string>} */
  const [decryptedMessage, setDecryptedMessage] = useState();

  useEffect(() => {
    /** @param {Message} message */
    const decryptMsg = async message => {
      const decryptedMsg = await decryptMessage(message);
      setDecryptedMessage(decryptedMsg);
    };

    decryptMsg(roomData.lastMessage);
  }, [roomData.lastMessage]);

  return (
    <>
      <TouchableOpacity onPress={() => props.onPress(roomData.chatRoom.id)}>
        <View style={styles.container}>
          <ConversationPersonImage
            imageSource={
              roomData.groupName
                ? roomData.groupImage
                : roomData?.users[0]?.imageUri
            }
            imageStyle={styles.image}
          />

          {roomData.chatRoom?.newMessages > 0 && (
            <MessageBadge count={roomData.chatRoom.newMessages} />
          )}

          <View style={styles.fullSpace}>
            <View style={styles.textContainer}>
              <Text style={styles.name}>
                {roomData.groupName
                  ? roomData.groupName
                  : roomData.users[0]?.userName}
              </Text>
              {roomData.lastMessage && (
                <Text style={styles.text}>
                  {formatDate(roomData.lastMessage?.createdAt)}
                </Text>
              )}
            </View>
            {decryptedMessage && (
              <Text numberOfLines={1} style={styles.text}>
                {decryptedMessage ?? ''}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
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
