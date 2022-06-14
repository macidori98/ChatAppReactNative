import {
  acceptFriendRequest,
  getRecievedRequests,
  removeFriendRequest,
} from 'api/Requests';
import LoadingIndicator from 'components/common/LoadingIndicator';
import UsersList from 'components/users/UsersList';
import {getInteractiveDialog} from 'helpers/AlertHelper';
import {ToastHelper} from 'helpers/ToastHelper';
import {User} from 'models';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';
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
  /**
   * @type {UseState<boolean>}
   */
  const [isUserClicked, setIsUserClicked] = useState();
  /** @type {React.MutableRefObject<User>} */
  const userRef = useRef();

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
        ToastHelper.showError(response.error);
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
        ToastHelper.showError(response.error);
      }

      setIsLoading(false);
    },
    [authedUserState.authedUser, users],
  );

  const getContent = () => {
    if (users.length > 0) {
      return (
        <>
          {isUserClicked &&
            getInteractiveDialog(
              isUserClicked,
              `${
                userRef.current.userName
              } ${Translations.strings.sentYouFriendRequest()}`,
              Translations.strings.whatToDo(),
              () => {
                removeRequest(userRef.current);
                userRef.current = undefined;
                setIsUserClicked(false);
              },
              () => {
                userRef.current = undefined;
                setIsUserClicked(false);
              },
              Translations.strings.remove(),
              Translations.strings.cancel(),
              'red',
              Translations.strings.accept(),
              () => {
                acceptRequest(userRef.current);
                userRef.current = undefined;
                setIsUserClicked(false);
              },
            )}
          <UsersList
            key={'list'}
            onPress={user => {
              userRef.current = user;
              setIsUserClicked(true);
            }}
            users={users}
          />
        </>
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
