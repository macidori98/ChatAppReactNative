import ConversationPersonImage from 'components/ConversationPersonImage';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Theme from 'theme/Theme';

/**
 * @param {{imageUri: string, name: string, date: string, message: string}} props
 * @returns {JSX.Element}
 */
const ChatRoomListItem = props => {
  return (
    <View style={styles.container}>
      <ConversationPersonImage
        imageSource={props.imageUri}
        imageStyle={styles.image}
      />
      <View style={styles.fullSpace}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.text}>{props.date}</Text>
        </View>
        <Text numberOfLines={1} style={styles.text}>
          {props.message}
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
  },
});
