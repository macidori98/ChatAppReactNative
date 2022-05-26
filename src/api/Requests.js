import {Auth, DataStore, Hub} from 'aws-amplify';
import {User} from 'models';

/**
 * @param {() => Promise<void>} action
 * @returns
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
  return await DataStore.save(
    User.copyOf(currentUser, update => {
      update.publicKey = key;
    }),
  );
};
