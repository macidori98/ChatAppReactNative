/**
 * @typedef {Object} PreviewChat
 * @property {string} id
 * @property {User[]} users
 * @property {Message} lastMessage
 * @property {number} [newMessages]
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} [imageUri]
 * @property {string} [status]
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} content
 * @property {string} createdAt
 * @property {User} [user]
 */

export {};
