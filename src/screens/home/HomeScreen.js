import ChatRooms from 'assets/dummy-data/ChatRooms';
import Chats from 'assets/dummy-data/Chats';
import ChatRoomList from 'components/chatRooms/ChatRoomList';
import React from 'react';
import {PreviewChat} from 'types/ChatTypes';

/**
 * @param {any} props
 * @returns {JSX.Element}
 */
const HomeScreen = props => {
  /** @type {PreviewChat[]} */
  const data = ChatRooms;

  return (
    <>
      <ChatRoomList
        onPress={user => {
          props.navigation.navigate('ChatScreen', {messages: Chats.messages});
        }}
        data={data}
      />
    </>
  );
};

export default HomeScreen;
