import {updateMessage} from 'api/Requests';
import {DataStore} from 'aws-amplify';
import {S3Image} from 'aws-amplify-react-native/dist/Storage';
import {Message} from 'models';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Theme from 'theme/Theme';
import {UseState} from 'types/CommonTypes';
import {ChatMessageProps} from 'types/ComponentPropsTypes';
import {decryptMessage as decryptMsg, onShare} from 'utils/Utils';

/**
 * @param {ChatMessageProps} props
 * @returns {JSX.Element}
 */
const ChatMessage = props => {
  /** @type {UseState<Message>} */
  const [message, setMessage] = useState(props.message);
  /** @type {UseState<string>} */
  const [repliedTo, setRepliedTo] = useState();
  /** @type {UseState<string>} */
  const [decryptedContent, setDecryptedContent] = useState();

  useEffect(() => {
    const decryptMessage = async () => {
      const decryptedText = await decryptMsg(message);
      setDecryptedContent(decryptedText);
    };

    if (message?.content) {
      decryptMessage();
    }
  }, [message]);

  useEffect(() => {
    const subscription = DataStore.observe(Message, message.id).subscribe(
      msg => {
        if (msg.opType === 'UPDATE' && msg.model === Message) {
          setMessage(existingMessage => {
            return {...existingMessage, ...msg.element};
          });
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [message.id]);

  const setAsRead = useCallback(() => {
    if (!props.isMine && message.status !== 'READ') {
      updateMessage(props.message);
    }
  }, [message, props]);

  useEffect(() => {
    setAsRead();
  }, [setAsRead]);

  const fetchReplyTo = useCallback(async () => {
    if (message.replyToMessageId) {
      const fetchedMessage = await DataStore.query(
        Message,
        message.replyToMessageId,
      );
      const rep = await decryptMsg(fetchedMessage);
      setRepliedTo(rep);
    }
  }, [message.replyToMessageId]);

  useEffect(() => {
    fetchReplyTo();
  }, [fetchReplyTo]);

  const getContent = () => {
    switch (message.messageType) {
      case 'image':
        //DataStore.delete(Message, message.id);
        return (
          <TouchableOpacity
            onLongPress={() => {
              props.onLongPress(message);
            }}
            onPress={() => props.onImageFullScreen(decryptedContent)}
            style={styles.imageContainer}>
            {decryptedContent && (
              <S3Image style={styles.image} imgKey={decryptedContent} />
            )}
            {props.isMine && message.status !== 'SENT' && (
              <View style={styles.readStatusContainer}>
                <Icon
                  name="checkmark-done-outline"
                  size={20}
                  color={
                    message.status === 'DELIVERED'
                      ? Theme.colors.white
                      : message.status === 'READ'
                      ? Theme.colors.primary
                      : undefined
                  }
                />
              </View>
            )}
          </TouchableOpacity>
        );
      case 'video':
        return (
          <TouchableOpacity
            onPress={() => {
              onShare(decryptedContent, message);
            }}
            onLongPress={() => {
              props.onLongPress(message);
            }}>
            <View>
              {decryptedContent && (
                <Text
                  style={{
                    color: props.isMine
                      ? Theme.colors.black
                      : Theme.colors.white,
                  }}>
                  {decryptedContent ?? ''}
                </Text>
              )}
              {props.isMine && message.status !== 'SENT' && (
                <View style={styles.readStatusContainer}>
                  <Icon
                    name="checkmark-done-outline"
                    size={20}
                    color={
                      message.status === 'DELIVERED'
                        ? Theme.colors.white
                        : message.status === 'READ'
                        ? Theme.colors.primary
                        : undefined
                    }
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      case 'text':
        return (
          <TouchableOpacity
            onLongPress={() => {
              props.onLongPress(message);
            }}>
            <View>
              {repliedTo && (
                <View style={styles.reply}>
                  <Text
                    style={props.isMine ? styles.textIsMe : styles.textIsOther}>
                    {repliedTo}
                  </Text>
                </View>
              )}
              {decryptedContent && (
                <Text
                  style={props.isMine ? styles.textIsMe : styles.textIsOther}>
                  {decryptedContent}
                </Text>
              )}
              {props.isMine && message.status !== 'SENT' && (
                <View style={styles.readStatusContainer}>
                  <Icon
                    name="checkmark-done-outline"
                    size={20}
                    color={
                      message.status === 'DELIVERED'
                        ? Theme.colors.white
                        : message.status === 'READ'
                        ? Theme.colors.primary
                        : undefined
                    }
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      case 'voice':
        return (
          <TouchableOpacity
            onLongPress={() => {
              props.onLongPress(message);
            }}>
            <View>
              <Text>voice</Text>
              {props.isMine && message.status !== 'SENT' && (
                <View style={styles.readStatusContainer}>
                  <Icon
                    name="checkmark-done-outline"
                    size={20}
                    color={
                      message.status === 'DELIVERED'
                        ? Theme.colors.white
                        : message.status === 'READ'
                        ? Theme.colors.primary
                        : undefined
                    }
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      case 'application':
        const textColor = props.isMine
          ? Theme.colors.black
          : Theme.colors.white;

        return (
          <TouchableOpacity onPress={() => onShare(decryptedContent, message)}>
            <View>
              <View style={styles.docsContainer}>
                <View style={{...Theme.styles.center}}>
                  <Icon
                    name="document-outline"
                    color={
                      props.isMine ? Theme.colors.black : Theme.colors.white
                    }
                    size={25}
                  />
                </View>
                <Text style={{color: textColor}}>
                  {decryptedContent ?? undefined}
                </Text>
              </View>
            </View>
            {props.isMine && message.status !== 'SENT' && (
              <View style={styles.readStatusContainer}>
                <Icon
                  name="checkmark-done-outline"
                  size={20}
                  color={
                    message.status === 'DELIVERED'
                      ? Theme.colors.white
                      : message.status === 'READ'
                      ? Theme.colors.primary
                      : undefined
                  }
                />
              </View>
            )}
          </TouchableOpacity>
        );
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
  docsContainer: {
    flexDirection: 'row',
    width: '75%',
  },
  readStatusContainer: {
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  imageContainer: {
    width: Dimensions.get('screen').width * 0.7,
    height: Dimensions.get('screen').width * 0.5,
    flexDirection: 'row',
  },
  reply: {
    backgroundColor: 'rgba(0,0,0, 0.5)',
    padding: 4,
    marginBottom: 5,
    borderRadius: 5,
  },
});
