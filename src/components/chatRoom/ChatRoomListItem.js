import ConversationPersonImage from 'components/ConversationPersonImage';
import MessageBadge from 'components/MessageBadge';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Theme from 'theme/Theme';
import {PreviewChat} from 'types/ChatTypes';

/**
 * @param {{data: PreviewChat}} props
 * @returns {JSX.Element}
 */
const ChatRoomListItem = props => {
  const roomData = props.data;

  return (
    <View style={styles.container}>
      <ConversationPersonImage
        imageSource={roomData.users[1].imageUri}
        imageStyle={styles.image}
      />

      {roomData.newMessages && <MessageBadge count={roomData.newMessages} />}

      <View style={styles.fullSpace}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{roomData.users[1].name}</Text>
          <Text style={styles.text}>{roomData.lastMessage.createdAt}</Text>
        </View>
        <Text numberOfLines={1} style={styles.text}>
          {roomData.lastMessage.content}
        </Text>
      </View>
    </View>
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
