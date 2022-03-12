import ChatRooms from 'assets/dummy-data/ChatRooms';
import ChatRoomList from 'components/chatRoom/ChatRoomList';
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
      <ChatRoomList data={data} />
    </>
  );
};

export default HomeScreen;
