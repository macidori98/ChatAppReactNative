import ChatRoomListItem from 'components/ChatRoomListItem';
import React from 'react';

const HomeScreen = props => {
  /** @type {number[]} */
  const testArray = [1, 2, 3, 4, 5];

  return (
    <>
      {testArray.map(item => (
        <ChatRoomListItem
          date="11:11 AM"
          name="Mosolyorszag"
          message="Hello there, how are you? what have you done this weekend?"
          imageUri="https://i.pinimg.com/474x/3e/84/29/3e842975de402e7cd78f528e87ee8e32--cross-stitch-charts-cross-stitch-patterns.jpg"
        />
      ))}
    </>
  );
};

export default HomeScreen;
