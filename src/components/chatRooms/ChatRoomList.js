import ChatRoomListItem from 'components/chatRooms/ChatRoomListItem';
import React from 'react';
import {FlatList, View} from 'react-native';
import {PreviewChat} from 'types/ChatTypes';

/**
 * @param {{data: PreviewChat[], onPress: () => void}} props
 * @returns {JSX.Element}
 */
const ChatRoomList = props => {
  return (
    <View>
      <FlatList
        data={props.data}
        renderItem={({item}) => (
          <ChatRoomListItem onPress={props.onPress} data={item} />
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={info => {
          console.log(info);
        }}
      />
    </View>
  );
};

export default ChatRoomList;
