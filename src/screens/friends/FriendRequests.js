import {
  acceptFriendRequest,
  getRecievedRequests,
  removeFriendRequest,
} from 'api/Requests';
import LoadingIndicator from 'components/common/LoadingIndicator';
import UsersList from 'components/users/UsersList';
import {ToastHelper} from 'helpers/ToastHelper';
import {User} from 'models';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {UseState} from 'types/CommonTypes';
import {AuthenticateState} from 'types/StoreTypes';

const FriendRequests = props => {
  /**
   * @type {UseState<boolean>}
   */
  const [isLoading, setIsLoading] = useState(true);
  /**
   * @type {UseState<User[]>}
   */
  const [users, setUsers] = useState();

  const authedUserState = useSelector(
    /** @param {{auth: AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  const getRequests = useCallback(async () => {
    if (authedUserState?.authedUser) {
      const usersList = await getRecievedRequests(
        authedUserState?.authedUser.id,
      );

      setUsers(usersList);
      setIsLoading(false);
    }
  }, [authedUserState?.authedUser]);

  useEffect(() => {
    getRequests();
  }, [getRequests]);

  const acceptRequest = useCallback(
    /**
     * @param {User} user
     */
    async user => {
      setIsLoading(true);
      const response = await acceptFriendRequest(
        authedUserState.authedUser,
        user,
      );

      if (response.success) {
        const index = users.indexOf(user);

        if (index !== -1) {
          users.splice(index, 1);
          setUsers([...users]);
          ToastHelper.showSuccess(
            Translations.strings.requestSuccessfullySent(),
          );
        }
      } else {
        ToastHelper.showSuccess(response.error);
      }

      setIsLoading(false);
    },
    [authedUserState.authedUser, users],
  );

  const removeRequest = useCallback(
    /**
     * @param {User} user
     */
    async user => {
      setIsLoading(true);
      const response = await removeFriendRequest(
        authedUserState.authedUser,
        user,
      );

      if (response.success) {
        const index = users.indexOf(user);

        if (index !== -1) {
          users.splice(index, 1);
          setUsers([...users]);
          ToastHelper.showSuccess(
            Translations.strings.requestSuccessfullySent(),
          );
        }
      } else {
        ToastHelper.showSuccess(response.error);
      }

      setIsLoading(false);
    },
    [authedUserState.authedUser, users],
  );

  const getContent = () => {
    if (users.length > 0) {
      return (
        <UsersList
          key={'list'}
          onPress={user => {
            Alert.prompt(
              `${user.name} ${Translations.strings.sentYouFriendRequest()}`,
              Translations.strings.whatToDo(),
              [
                {
                  text: Translations.strings.cancel(),
                  style: 'cancel',
                },
                {
                  text: Translations.strings.accept(),
                  onPress: acceptRequest.bind(this, user),
                },
                {
                  text: Translations.strings.remove(),
                  onPress: removeRequest.bind(this, user),
                },
              ],
              'default',
            );
          }}
          users={users}
        />
      );
    } else {
      return (
        <View style={{...Theme.styles.screen, ...Theme.styles.center}}>
          <Text key={Translations.strings.emptyList()}>
            {Translations.strings.emptyList()}
          </Text>
        </View>
      );
    }
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      {!isLoading && getContent()}
    </>
  );
};

export default FriendRequests;
