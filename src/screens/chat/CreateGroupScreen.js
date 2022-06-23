import {DataStore} from 'aws-amplify';
import UsersList from 'components/users/UsersList';
import {ChatRoom, ChatRoomUser, User} from 'models';
import React, {useCallback, useLayoutEffect, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {Translations} from 'translations/Translations';
import {UseState} from 'types/CommonTypes';
import {CreateGroupScreenProps} from 'types/NavigationTypes';

/**
 * @param {CreateGroupScreenProps} props
 * @returns {JSX.Element}
 */
const CreateGroupScreen = props => {
  const {data} = props.route.params;

  const authedUserState = useSelector(
    /** @param {{auth: import('types/StoreTypes').AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  /** @type {UseState<User[]>} */
  const [selectedUsers, setSelectedUsers] = useState([]);

  const onPress = useCallback(
    /**
     * @param {User[]} users
     */
    async users => {
      if (users.length <= 0) {
        return;
      }
      const dbUser = await DataStore.query(User, authedUserState.authedUser.id);

      const roomChatRoom = await DataStore.save(
        new ChatRoom({
          newMessages: 0,
          groupName: Translations.strings.newGroup(),
          Admin: authedUserState.authedUser,
          groupImage:
            'https://www.creativefabrica.com/wp-content/uploads/2019/02/Group-Icon-by-Kanggraphic-580x386.jpg',
        }),
      );

      await DataStore.save(
        new ChatRoomUser({
          user: dbUser,
          chatRoom: roomChatRoom,
        }),
      );

      await Promise.all(
        users.map(user =>
          DataStore.save(
            new ChatRoomUser({
              user: user,
              chatRoom: roomChatRoom,
            }),
          ),
        ),
      );

      props.navigation.replace('ChatScreen', {
        id: roomChatRoom.id,
      });
    },
    [authedUserState?.authedUser, props.navigation],
  );

  const getHeaderRightOption = useCallback(() => {
    return (
      <TouchableOpacity onPress={() => onPress(selectedUsers)}>
        <Text>
          {Translations.strings.saveGroup()}{' '}
          {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}
        </Text>
      </TouchableOpacity>
    );
  }, [onPress, selectedUsers]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: getHeaderRightOption,
    });
  }, [getHeaderRightOption, props.navigation]);

  return (
    <UsersList
      onPress={selectedUser => {
        setSelectedUsers(prev => {
          if (prev.includes(selectedUser)) {
            const index = prev.indexOf(selectedUser);
            prev.splice(index, 1);
            return [...prev];
          } else {
            return [...prev, selectedUser];
          }
        });
      }}
      users={data}
      selectedItems={selectedUsers}
    />
  );
};

export default CreateGroupScreen;
