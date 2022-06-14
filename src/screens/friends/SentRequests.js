import {
  getSentRequests,
  removeFriendRequest,
  saveNewFriendRequest,
} from 'api/Requests';
import LoadingIndicator from 'components/common/LoadingIndicator';
import UsersList from 'components/users/UsersList';
import {getInteractiveDialog, getPromptDialog} from 'helpers/AlertHelper';
import {ToastHelper} from 'helpers/ToastHelper';
import {User} from 'models';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, Text, View} from 'react-native';
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
  /**
   * @type {UseState<boolean>}
   */
  const [isAddFriend, setIsAddFriend] = useState();
  /** @type {React.MutableRefObject<string>} */
  const emailRef = useRef();
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
        user,
        authedUserState.authedUser,
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

  /** @param {string} text */
  const onChangeTextEnterEmail = text => {
    emailRef.current = text;
  };

  const onConfirmPressSendRequest = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(emailRef.current)) {
      saveUser(emailRef.current);
    } else {
      ToastHelper.showError('You have to enter a valid email address');
    }

    emailRef.current = undefined;
    setIsAddFriend(false);
  };

  const onCancelPressSendRequest = () => {
    setIsAddFriend(false);
    emailRef.current = undefined;
  };

  const getContent = () => {
    /**
     * @type {JSX.Element[]}
     */
    const items = [
      <>
        {isAddFriend &&
          getPromptDialog(
            isAddFriend,
            Translations.strings.enterEmail(),
            Translations.strings.enterFriendEmail(),
            onChangeTextEnterEmail,
            onConfirmPressSendRequest,
            onCancelPressSendRequest,
          )}
      </>,
      <>
        {isUserClicked &&
          getInteractiveDialog(
            isUserClicked,
            `${userRef.current.userName}`,
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
          )}
      </>,
      <Button
        key={Translations.strings.addFriend()}
        title={Translations.strings.addFriend()}
        onPress={() => {
          setIsAddFriend(true);
        }}
      />,
    ];

    if (users.length > 0) {
      items.push(
        <UsersList
          key={'list'}
          users={users}
          onPress={user => {
            userRef.current = user;
            setIsUserClicked(true);
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
