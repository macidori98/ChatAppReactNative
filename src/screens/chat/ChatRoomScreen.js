import ChatMessage from 'components/chat/ChatMessage';
import MessageInput from 'components/chat/MessageInput';
import ConversationPersonImage from 'components/ConversationPersonImage';
import React, {useLayoutEffect} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {Message} from 'types/ChatTypes';
import {ChatScreenProps} from 'types/NavigationTypes';

/**
 * @param {ChatScreenProps} props
 * @returns {JSX.Element}
 */
const ChatRoomScreen = props => {
  const {route, navigation} = props;
  //get data
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: prop => {
        return (
          <View style={styles.headerContainer}>
            <ConversationPersonImage
              imageStyle={styles.icon}
              imageSource={
                'https://kutyubazar.hu/media/catalog/product/cache/1/image/5f7b60b58668a14927e0229ce4c846ab/m/a/maci_borito.jpg'
              }
            />
            <Text style={styles.text}>Mosolyorszag</Text>
          </View>
        );
      },
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        ListEmptyComponent={
          <View
            style={{
              ...Theme.styles.center,
            }}>
            <Text>{Translations.strings.emptyChat()}</Text>
          </View>
        }
        style={styles.list}
        data={undefined}
        renderItem={
          /** @param {{item: Message}} param0 */ ({item}) => (
            <ChatMessage message={item} />
          )
        }
        keyExtractor={(item, index) => `${item.createdAt}${index}`}
      />
      <MessageInput
        onAddFile={() => {}}
        onSend={() => {}}
        onEmoji={() => {}}
        onMic={() => {}}
        onCamera={() => {}}
      />
    </SafeAreaView>
  );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({
  page: {
    backgroundColor: Theme.colors.white,
    ...Theme.styles.screen,
  },
  list: {
    flexDirection: 'column-reverse',
    ...Theme.styles.screen,
  },
  icon: {
    width: Theme.values.headerIcon.width,
    height: Theme.values.headerIcon.height,
  },
  headerContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    marginHorizontal: Theme.values.margins.marginMedium,
  },
});
