// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const MessageStatus = {
  "SENT": "SENT",
  "DELIVERED": "DELIVERED",
  "READ": "READ"
};

const { FriendsList, FriendsRequest, Message, ChatRoom, User, ChatRoomUser } = initSchema(schema);

export {
  FriendsList,
  FriendsRequest,
  Message,
  ChatRoom,
  User,
  ChatRoomUser,
  MessageStatus
};