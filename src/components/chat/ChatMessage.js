import {S3Image} from 'aws-amplify-react-native/dist/Storage';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Theme from 'theme/Theme';
import {ChatMessageProps} from 'types/ComponentPropsTypes';

/**
 * @param {ChatMessageProps} props
 * @returns {JSX.Element}
 */
const ChatMessage = props => {
  const {message} = props;

  const getContent = () => {
    switch (message.messageType) {
      case 'image':
        //DataStore.delete(Message, message.id);
        return (
          <TouchableOpacity
            onPress={props.onImageFullScreen}
            style={{
              width: Dimensions.get('screen').width * 0.7,
              height: Dimensions.get('screen').width * 0.5,
            }}>
            <S3Image style={styles.image} imgKey={message.content} />
          </TouchableOpacity>
        );
      case 'video':
        return (
          <View>
            <Text>{message.content ?? ''}</Text>
          </View>
        );
      case 'text':
        return (
          <Text style={props.isMine ? styles.textIsMe : styles.textIsOther}>
            {message.content ?? ''}
          </Text>
        );
      case 'voice':
        return (
          <View>
            <Text>voice</Text>
          </View>
        );
      default:
        return <></>;
    }
  };

  return (
    <View style={props.isMine ? styles.isMeContainer : styles.isOtherContainer}>
      {getContent()}
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
  image: {
    ...Theme.styles.screen,
    borderRadius: Theme.values.radius.large,
    resizeMode: 'cover',
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
