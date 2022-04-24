import {DataStore, Storage} from 'aws-amplify';
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
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';
import Theme from 'theme/Theme';
import {UseState} from 'types/CommonTypes';
import {ChatMessageProps} from 'types/ComponentPropsTypes';

/**
 * @param {ChatMessageProps} props
 * @returns {JSX.Element}
 */
const ChatMessage = props => {
  /** @type {UseState<Message>} */
  const [message, setMessage] = useState(props.message);
  /** @type {UseState<string>} */
  const [repliedTo, setRepliedTo] = useState();

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
      DataStore.save(
        Message.copyOf(props.message, update => {
          update.status = 'READ';
        }),
      );
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
      setRepliedTo(fetchedMessage.content);
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
            onPress={props.onImageFullScreen}
            style={styles.imageContainer}>
            <S3Image style={styles.image} imgKey={message.content} />
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
            onLongPress={() => {
              props.onLongPress(message);
            }}>
            <View>
              <Text>{message.content ?? ''}</Text>
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
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0, 0.5)',
                    padding: 4,
                    marginBottom: 5,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={props.isMine ? styles.textIsMe : styles.textIsOther}>
                    {repliedTo}
                  </Text>
                </View>
              )}
              <Text style={props.isMine ? styles.textIsMe : styles.textIsOther}>
                {message.content ?? ''}
              </Text>
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
        const onShare = async () => {
          const fs = RNFetchBlob.fs;
          let imagePath;
          try {
            const url = await Storage.get(message.content);
            const data = await RNFetchBlob.config({
              fileCache: true,
            }).fetch('GET', url);
            imagePath = data.path();
            const base64data = await data.readFile('base64');

            /**
             * @type {import('react-native-share').ShareOptions}
             */
            const shareOptions = {
              title: 'Share',
              message: 'Share file',
              url: `data:${message.base64type};base64,${base64data}`,
            };
            await Share.open(shareOptions);
          } catch (error) {
            console.log(error);
          }
          fs.unlink(imagePath);
        };
        const textColor = props.isMine
          ? Theme.colors.black
          : Theme.colors.white;

        return (
          <TouchableOpacity onPress={onShare}>
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
                  {message.content ?? undefined}
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
});
