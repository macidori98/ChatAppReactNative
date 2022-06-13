import {DataStore} from '@aws-amplify/datastore';
import {getUserById, getUserFriendsList} from 'api/Requests';
import LoadingIndicator from 'components/common/LoadingIndicator';
import UsersList from 'components/users/UsersList';
import {ChatRoom, ChatRoomUser, User} from 'models';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {Translations} from 'translations/Translations';
import {UseState} from 'types/CommonTypes';
import {UsersScreenProps} from 'types/NavigationTypes';
import {AuthenticateState} from 'types/StoreTypes';

/**
 * @param {UsersScreenProps} props
 * @returns {JSX.Element}
 */
const UsersScreen = props => {
  /** @type {UseState<User[]>} */
  const [users, setUsers] = useState([]);
  /** @type {UseState<boolean>} */
  const [isLoading, setIsLoading] = useState(true);

  const authedUserState = useSelector(
    /** @param {{auth: AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  const fetchUsers = useCallback(async () => {
    if (authedUserState.authedUser) {
      const fetchedUsersId = await getUserFriendsList(
        authedUserState.authedUser.id,
      );

      /**
       * @type {User[]}
       */
      let userss = [];

      if (fetchedUsersId && fetchedUsersId[0]) {
        for (const item of fetchedUsersId[0]?.friendsId) {
          const u = await getUserById(item);
          userss.push(u);
        }
      }

      setUsers(userss);
      setIsLoading(false);
    }
  }, [authedUserState.authedUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * @param {User} user
   */
  const showUserProfile = user => {
    props.navigation.navigate('UsersProfile', {
      user: user,
      currentUser: authedUserState.authedUser,
    });
  };

  /**
   * @param {User} user
   */
  const startChat = async user => {
    //create corresponding chat, and transfer that id

    //connect authenticated user with the chatroom
    const dbUser = await DataStore.query(User, authedUserState.authedUser.id);

    //TODO: if there is already a chatroom with these users then direct to the existing chatroom

    // const response = await DataStore.query(ChatRoomUser);
    // Logger.log(response);
    // console.log(response);

    //create a new chat room
    const roomChatRoom = await DataStore.save(new ChatRoom({newMessages: 0}));

    // //save in the chatroom the autheticated user
    await DataStore.save(
      new ChatRoomUser({
        user: dbUser,
        chatRoom: roomChatRoom,
      }),
    );

    await DataStore.save(
      new ChatRoomUser({
        user: user,
        chatRoom: roomChatRoom,
      }),
    );

    // //navigate to chattroom
    props.navigation.replace('ChatScreen', {
      id: roomChatRoom.id,
    });
  };

  /**
   * @param {User} user
   */
  const onPress = user => {
    Alert.prompt(
      `${user.userName}`,
      Translations.strings.whatToDo(),
      [
        {
          text: Translations.strings.cancel(),
          style: 'cancel',
        },
        {
          text: Translations.strings.profile(),
          onPress: showUserProfile.bind(this, user),
        },
        {
          text: Translations.strings.startChat(),
          onPress: startChat.bind(this, user),
        },
      ],
      'default',
    );
  };

  return (
    <>
      {!isLoading && (
        <UsersList
          onNewGroupPress={() => {
            props.navigation.replace('CreateGroupScreen', {data: users});
          }}
          onPress={onPress}
          users={users}
        />
      )}
      {isLoading && <LoadingIndicator />}
    </>
  );
};

export default UsersScreen;
