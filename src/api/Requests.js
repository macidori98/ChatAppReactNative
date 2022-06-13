import {Auth, DataStore, Hub} from 'aws-amplify';
import {Logger} from 'helpers/Logger';
import {
  ChatRoom,
  ChatRoomUser,
  FriendsList,
  FriendsRequest,
  User,
} from 'models';
import {Translations} from 'translations/Translations';

/**
 * @param {() => Promise<void>} action
 */
export const hubListener = action =>
  Hub.listen('datastore', async capsule => {
    const {
      payload: {event},
    } = capsule;

    if (event === 'ready') {
      action();
    }
  });

export const getAllUsers = async () => {
  return await DataStore.query(User);
};

/**
 * @returns {Promise<string>}
 */
export const getCurrentUserId = async () => {
  return (await Auth.currentAuthenticatedUser()).attributes.sub;
};

export const getCurrentUserData = async () => {
  const userId = await getCurrentUserId();
  return await DataStore.query(User, userId);
};

export const logOut = async () => {
  await DataStore.clear();
  Auth.signOut();
};

/**
 * @param {User} currentUser
 * @param {string} key
 * @returns {Promise<User>}
 */
export const updateCurrentUserPublicKey = async (currentUser, key) => {
  return await DataStore.save(
    User.copyOf(currentUser, update => {
      update.publicKey = key;
    }),
  );
};

/**
 * @param {string} currentUserId
 * @returns {Promise<User[]>}
 */
export const getSentRequests = async currentUserId => {
  const userIds = (
    await DataStore.query(FriendsRequest, fr => fr.sender('eq', currentUserId))
  ).map(item => item.reciever);

  /**
   * @type {User[]}
   */
  let users = [];
  for (const item of userIds) {
    const user = await DataStore.query(User, item);
    users.push(user);
  }
  return users;
};

/**
 * @param {string} currentUserId
 * @returns {Promise<User[]>}
 */
export const getRecievedRequests = async currentUserId => {
  const userIds = (
    await DataStore.query(FriendsRequest, fr =>
      fr.reciever('eq', currentUserId),
    )
  ).map(item => item.sender);

  /**
   * @type {User[]}
   */
  let users = [];
  for (const item of userIds) {
    const u = await DataStore.query(User);
    const user = u.filter(i => i.id === item);
    users.push(user[0]);
  }
  return users;
};

/**
 * @param {string} userId
 */
export const getUserFriendsList = async userId => {
  return await DataStore.query(FriendsList, fl => fl.userId('eq', userId));
};

/**
 * @param {User} currentUser
 * @param {string} userEmail
 * @returns {Promise<{success: boolean, error?: string, data?: User}>}
 */
export const saveNewFriendRequest = async (currentUser, userEmail) => {
  if (currentUser.name === userEmail) {
    return {success: false, error: Translations.strings.cannotAddYourselt()};
  }

  const userResponse = await DataStore.query(User, u =>
    u.name('eq', userEmail),
  );

  if (userResponse.length !== 1) {
    return {
      success: false,
      error: `${Translations.strings.userNotExists()}\n${userEmail}`,
    };
  }

  const sentFriendRequests = (await getSentRequests(currentUser.id)).map(
    item => item.id,
  );

  if (sentFriendRequests.indexOf(userResponse[0].id) !== -1) {
    return {
      success: false,
      error: `${Translations.strings.requestAlreadySent()}\n${userEmail}`,
    };
  }

  const alreadyFriends = await getUserFriendsList(currentUser.id);

  const alreadyFriendsIds = alreadyFriends[0]?.friendsId;

  if (
    alreadyFriendsIds !== undefined &&
    alreadyFriendsIds.indexOf(userResponse[0].id) !== -1
  ) {
    return {
      success: false,
      error: `${Translations.strings.userAlreadyExists()}\n${userEmail}`,
    };
  }

  try {
    await DataStore.save(
      new FriendsRequest({
        reciever: userResponse[0].id,
        sender: currentUser.id,
      }),
    );
  } catch (error) {
    return {success: false, error: error};
  }

  return {success: true, data: userResponse[0]};
};

/**
 * @param {string} userId
 * @returns {Promise<User>}
 */
export const getUserById = async userId => {
  return await DataStore.query(User, userId);
};

/**
 * @param {User} currentUser
 * @param {User} user
 * @returns {Promise<{success: boolean, error?: string, data?: any}>}
 */
export const acceptFriendRequest = async (currentUser, user) => {
  const response = await removeFriendRequest(currentUser, user);
  if (response.success) {
    // const friendListResponse = await getUserFriendsList(currentUser.id);
    // const friendsList = friendListResponse[0]
    //   ? friendListResponse[0].friendsId
    //   : [];
    // friendsList.push(user.id);
    // if (friendListResponse[0]) {
    //   await DataStore.save(
    //     FriendsList.copyOf(friendListResponse[0], update => {
    //       update.friendsId = friendsList;
    //     }),
    //   );
    // } else {
    //   await DataStore.save(
    //     new FriendsList({userId: currentUser.id, friendsId: friendsList}),
    //   );
    // }
    // return {success: true, data: undefined, error: undefined};
    const res1 = await addFriendToFriendList(currentUser, user);
    if (res1.success) {
      const res2 = await addFriendToFriendList(user, currentUser);
      if (res2.success) {
        return {success: true, data: undefined, error: undefined};
      } else {
        return res2;
      }
    } else {
      return res1;
    }
  } else {
    return response;
  }
};

/**
 * @param {User} currentUser
 * @param {User} user
 * @returns {Promise<{success: boolean, error?: string, data?: FriendsRequest[]}>}
 */
export const removeFriendRequest = async (currentUser, user) => {
  const friendsRequestResponse = await DataStore.query(FriendsRequest, fr =>
    fr.sender('eq', user.id).reciever('eq', currentUser.id),
  );

  let response;

  try {
    response = await DataStore.delete(
      FriendsRequest,
      friendsRequestResponse[0].id,
    );
  } catch (error) {
    return {success: false, data: undefined, error: 'Error'};
  }

  return {success: true, data: response, error: undefined};
};

/**
 * @param {User} currentUser
 * @param {User} user
 * @returns {Promise<{success: boolean, error?: string, data?: any}>}
 */
const addFriendToFriendList = async (currentUser, user) => {
  try {
    const friendListResponse = await getUserFriendsList(currentUser.id);

    let friendsList = friendListResponse[0]
      ? friendListResponse[0].friendsId
      : [];
    friendsList = [...friendsList, user.id];

    if (friendListResponse[0]) {
      await DataStore.save(
        FriendsList.copyOf(friendListResponse[0], update => {
          update.friendsId = [...friendsList];
        }),
      );
    } else {
      await DataStore.save(
        new FriendsList({userId: currentUser.id, friendsId: friendsList}),
      );
    }

    return {success: true, data: undefined, error: undefined};
  } catch (error) {
    console.log(error);
    return {success: false, data: undefined, error: 'error'};
  }
};

/**
 * @param {User} currentUser
 * @param {User} user
 * @returns {Promise<{success: boolean, error?: string, data?: any}>}
 */
export const removeFriendFromList = async (currentUser, user) => {
  const res1 = await removeFriendFromFriendList(currentUser, user);
  if (res1.success) {
    const res2 = await removeFriendFromFriendList(user, currentUser);
    return res2;
  }
  return res1;
};

/**
 * @param {User} currentUser
 * @param {User} user
 * @returns {Promise<{success: boolean, error?: string, data?: any}>}
 */
const removeFriendFromFriendList = async (currentUser, user) => {
  try {
    const friendListResponse = await getUserFriendsList(currentUser.id);
    let friendsList = friendListResponse[0].friendsId;

    const index = friendsList.indexOf(user.id);

    if (index !== -1) {
      friendsList = friendsList.filter(item => item !== user.id);

      await DataStore.save(
        FriendsList.copyOf(friendListResponse[0], update => {
          update.friendsId = [...friendsList];
        }),
      );
    }

    return {success: true, data: undefined, error: undefined};
  } catch (error) {
    console.log(error);
    return {success: false, data: undefined, error: 'error'};
  }
};

/**
 * @param {User} user
 * @param {string} newName
 */
export const changeUserName = async (user, newName) => {
  return await DataStore.save(
    User.copyOf(user, update => {
      update.userName = newName;
    }),
  );
};

/**
 * @param {ChatRoom} room
 * @param {string} newName
 */
export const changeChatRoomName = async (room, newName) => {
  return await DataStore.save(
    ChatRoom.copyOf(room, update => {
      update.Admin = room.Admin;
      update.ChatRoomUsers = room.ChatRoomUsers;
      update.LastMessage = room.LastMessage;
      update.Messages = room.Messages;
      update.chatRoomAdminId = room.chatRoomAdminId;
      update.chatRoomLastMessageId = room.chatRoomLastMessageId;
      update.groupImage = room.groupImage;
      update.newMessages = room.newMessages;
      update.groupName = newName;
    }),
  );
};

/**
 * @param {string} id
 * @returns {Promise<User[]>}
 */
export const getRoomUsers = async id => {
  const usersResponse = (await DataStore.query(ChatRoomUser))
    .filter(u => u.chatRoom.id === id)
    .map(u => u.user);

  return usersResponse;
};

/**
 * @param {string} roomId
 * @param {string} userId
 */
export const leaveChatRoom = async (roomId, userId) => {
  try {
    const responseChatRoomUser = (await DataStore.query(ChatRoomUser)).filter(
      u => u.chatRoom.id === roomId && u.user.id === userId,
    );
    const response = await DataStore.delete(
      ChatRoomUser,
      responseChatRoomUser[0].id,
    );

    Logger.log(response);
    return {success: true, data: response, error: undefined};
  } catch (error) {
    return {success: false, data: undefined, error: 'Error'};
  }
};
