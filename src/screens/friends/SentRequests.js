import {
  getSentRequests,
  removeFriendRequest,
  saveNewFriendRequest,
} from 'api/Requests';
import LoadingIndicator from 'components/common/LoadingIndicator';
import UsersList from 'components/users/UsersList';
import {ToastHelper} from 'helpers/ToastHelper';
import {User} from 'models';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Button, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {UseState} from 'types/CommonTypes';
import {AuthenticateState} from 'types/StoreTypes';

const SentRequests = props => {
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
      const usersList = await getSentRequests(authedUserState?.authedUser.id);
      setUsers(usersList);
      setIsLoading(false);
    }
  }, [authedUserState?.authedUser]);

  const saveUser = useCallback(
    /**
     * @param {string} email
     */
    async email => {
      setIsLoading(true);
      const response = await saveNewFriendRequest(
        authedUserState.authedUser,
        email,
      );

      if (response.success) {
        ToastHelper.showSuccess(Translations.strings.requestSuccessfullySent());
        setUsers(prev => [...prev, response.data]);
      } else {
        ToastHelper.showError(response.error);
      }

      setIsLoading(false);
    },
    [authedUserState.authedUser],
  );

  useEffect(() => {
    getRequests();
  }, [getRequests]);

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
        ToastHelper.showError(response.error);
      }

      setIsLoading(false);
    },
    [authedUserState.authedUser, users],
  );

  const getContent = () => {
    /**
     * @type {JSX.Element[]}
     */
    const items = [
      <Button
        key={Translations.strings.addFriend()}
        title={Translations.strings.addFriend()}
        onPress={() => {
          Alert.prompt(
            Translations.strings.enterEmail(),
            Translations.strings.enterFriendEmail(),
            [
              {
                text: Translations.strings.cancel(),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: email => saveUser(email),
              },
            ],
            'plain-text',
          );
        }}
      />,
    ];

    if (users.length > 0) {
      items.push(
        <UsersList
          key={'list'}
          users={users}
          onPress={user => {
            Alert.prompt(
              `${user.name}`,
              Translations.strings.whatToDo(),
              [
                {
                  text: Translations.strings.cancel(),
                  style: 'cancel',
                },
                {
                  text: Translations.strings.remove(),
                  onPress: removeRequest.bind(this, user),
                },
              ],
              'default',
            );
          }}
        />,
      );
      return items;
    } else {
      items.push(
        <View
          key={Translations.strings.emptyList()}
          style={{...Theme.styles.screen, ...Theme.styles.center}}>
          <Text>{Translations.strings.emptyList()}</Text>
        </View>,
      );
      return items;
    }
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      {!isLoading && getContent()}
    </>
  );
};

export default SentRequests;
