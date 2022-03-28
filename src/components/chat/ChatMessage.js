import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Theme from 'theme/Theme';
import {ChatMessageProps} from 'types/ComponentPropsTypes';

/**
 * @param {ChatMessageProps} props
 * @returns {JSX.Element}
 */
const ChatMessage = props => {
  const {message} = props;
  const myId = 'u1';

  return (
    <View
      style={
        myId === message.user.id
          ? styles.isMeContainer
          : styles.isOtherContainer
      }>
      <Text
        style={myId === message.user.id ? styles.textIsMe : styles.textIsOther}>
        {message.content}
      </Text>
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  isMeContainer: {
    backgroundColor: Theme.colors.messageBackgroundColor.mine,
    padding: Theme.values.paddings.paddingMedium,
    margin: Theme.values.margins.marginMedium,
    borderRadius: Theme.values.radius.large,
    ...Theme.styles.messageMine,
  },
  textIsMe: {
    color: Theme.colors.black,
  },
  textIsOther: {
    color: Theme.colors.white,
  },
  isOtherContainer: {
    backgroundColor: Theme.colors.messageBackgroundColor.other,
    padding: Theme.values.paddings.paddingMedium,
    margin: Theme.values.margins.marginMedium,
    borderRadius: Theme.values.radius.large,
    ...Theme.styles.messageOther,
  },
});
