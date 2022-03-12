import ChatRoomListItem from 'components/chatRoom/ChatRoomListItem';
import React from 'react';
import {FlatList, View} from 'react-native';
import {PreviewChat} from 'types/ChatTypes';

/**
 * @param {{data: PreviewChat[]}} props
 * @returns {JSX.Element}
 */
const ChatRoomList = props => {
  return (
    <View>
      <FlatList
        data={props.data}
        renderItem={({item}) => <ChatRoomListItem data={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={info => {
          console.log(info);
        }}
      />
    </View>
  );
};

export default ChatRoomList;
