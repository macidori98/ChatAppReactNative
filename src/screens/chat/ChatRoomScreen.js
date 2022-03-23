import ChatMessage from 'components/chat/ChatMessage';
import MessageInput from 'components/chat/MessageInput';
import React from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
// import 'react-native-gesture-handler';
import Theme from 'theme/Theme';
import {Message} from 'types/ChatTypes';

const ChatRoomScreen = props => {
  const navigation = props.navigation;
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () =>
  //       Platform.OS === 'ios' ? (
  //         <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
  //           <Item
  //             title="Back"
  //             iconName={'chevron-back-outline'}
  //             onPress={() => {
  //               navigation.goBack();
  //             }}
  //           />
  //         </HeaderButtons>
  //       ) : null,
  //   });
  // }, [navigation]);
  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        style={styles.list}
        data={props.route.params.messages}
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
  },
});
