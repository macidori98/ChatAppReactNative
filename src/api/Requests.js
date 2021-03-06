import {Auth, DataStore, Hub, SortDirection, Storage} from 'aws-amplify';
import {getFileBlob} from 'helpers/GalleryHelper';
import {Logger} from 'helpers/Logger';
import {
  ChatRoom,
  ChatRoomUser,
  FriendsList,
  FriendsRequest,
  Message,
  User,
} from 'models';
import 'react-native-get-random-values';
import {Asset} from 'react-native-image-picker';
import {Translations} from 'translations/Translations';
import {v4 as uuidv4} from 'uuid';

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
  await Auth.signOut();
};

/**
 * @param {User} currentUser
 * @param {string} key
 * @returns {Promise<User>}
 */
export const updateCurrentUserPublicKey = async (currentUser, key) => {
  const response = await DataStore.query(User, currentUser.id);
  await DataStore.save(
    User.copyOf(response, update => {
      update.publicKey = key;
    }),
  );

  return await getCurrentUserData();
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
    Logger.log(error);
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
 * @param {string} newName
 */
export const changeUserName = async newName => {
  const response = await getCurrentUserData();
  await DataStore.save(
    User.copyOf(response, update => {
      update.userName = newName;
    }),
  );

  return await getCurrentUserData();
};

/**
 * @param {string} imageLink
 */
export const changeUserProfilePicture = async imageLink => {
  const response = await getCurrentUserData();
  await DataStore.save(
    User.copyOf(response, update => {
      update.imageUri = imageLink;
    }),
  );

  return await getCurrentUserData();
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
 * @param {ChatRoom} room
 * @param {string} newImage
 */
export const changeChatRoomImage = async (room, newImage) => {
  return await DataStore.save(
    ChatRoom.copyOf(room, update => {
      update.Admin = room.Admin;
      update.ChatRoomUsers = room.ChatRoomUsers;
      update.LastMessage = room.LastMessage;
      update.Messages = room.Messages;
      update.chatRoomAdminId = room.chatRoomAdminId;
      update.chatRoomLastMessageId = room.chatRoomLastMessageId;
      update.groupImage = newImage;
      update.newMessages = room.newMessages;
      update.groupName = room.groupName;
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

    return {success: true, data: response, error: undefined};
  } catch (error) {
    return {success: false, data: undefined, error: 'Error'};
  }
};

/**
 * @param {Asset[]} data
 * @returns {Promise<string>}
 */
export const uploadImage = async data => {
  const blob = await getFileBlob(data[0].uri);
  const index = data[0].type.indexOf('/');
  const extenstion = data[0].type.substring(index + 1);
  const result = await Storage.put(`${uuidv4()}.${extenstion}`, blob);
  const image = await Storage.get(result.key);
  return image;
};

/**
 * @param {string} id
 * @returns {Promise<ChatRoom>}
 */
export const getChatRoom = async id => {
  return await DataStore.query(ChatRoom, id);
};

/**
 * @param {string} chatRoomId
 * @returns {Promise<Message[]>}
 */
export const getMessages = async chatRoomId => {
  const currentUserId = await getCurrentUserId();
  const messages = await DataStore.query(
    Message,
    item => item.chatroomID('eq', chatRoomId).forUserId('eq', currentUserId),
    {
      sort: message => message.createdAt(SortDirection.ASCENDING),
    },
  );

  return messages;
};

/**
 * @param {string} chatRoomId
 * @returns {Promise<ChatRoomUser[]>}
 */
export const getOtherChatRoomUserData = async chatRoomId => {
  const currentUserId = await getCurrentUserId();

  const chatRoomUsers = (await DataStore.query(ChatRoomUser)).filter(
    item => item.chatRoom.id === chatRoomId,
  );

  const chatUsers = chatRoomUsers.filter(
    item => item.user.id !== currentUserId,
  );

  return chatUsers;
};

/**
 * @param {Message} message
 * @param {ChatRoom} chatRoom
 * @returns {Promise<ChatRoom>}
 */
export const updateLastMessageDatabase = async (message, chatRoom) => {
  return await DataStore.save(
    ChatRoom.copyOf(chatRoom, updatedChatRoom => {
      updatedChatRoom.LastMessage = message;
    }),
  );
};

/**
 * @param {string} chatRoomId
 * @param {string} content
 * @param {string} messageType
 * @param {string} forUserId
 * @param {string} replyToMessageId
 * @param {string} uniqueId
 * @param {string} [base64type]
 * @returns {Promise<Message>}
 */
export const saveMessage = async (
  chatRoomId,
  content,
  messageType,
  forUserId,
  replyToMessageId,
  uniqueId,
  base64type,
) => {
  const currentUserId = await getCurrentUserId();

  return await DataStore.save(
    new Message({
      userID: currentUserId,
      chatroomID: chatRoomId,
      content: content,
      messageType: messageType,
      status: 'SENT',
      forUserId: forUserId,
      replyToMessageId: replyToMessageId ?? null,
      base64type: base64type,
      messageIdentifier: uniqueId,
    }),
  );
};

/**
 * @param {Message} message
 * @returns {Promise<Message[]>}
 */
export const deleteMessageDatabase = async message => {
  return await DataStore.delete(Message, m =>
    m.messageIdentifier('eq', message.messageIdentifier),
  );
};

/**
 * @param {Message} message
 * @returns {Promise<void>}
 */
export const updateMessage = async message => {
  // const latestMessages = await DataStore.query(Message, msg =>
  //   msg.messageIdentifier('eq', message.messageIdentifier),
  // );

  // for (const msg of latestMessages) {
  //   await DataStore.save(
  //     Message.copyOf(msg, update => {
  //       update.status = 'READ';
  //     }),
  //   );
  // }

  await DataStore.save(
    Message.copyOf(message, update => {
      update.status = 'READ';
    }),
  );

  return;
};
