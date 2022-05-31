import {getSentRequests, saveNewFriendRequest} from 'api/Requests';
import LoadingIndicator from 'components/common/LoadingIndicator';
import {User} from 'models';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Button, FlatList, Text, View} from 'react-native';
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
        Alert.alert(Translations.strings.requestSuccessfullySent());
        setUsers(prev => [...prev, response.data]);
      } else {
        Alert.alert(response.error);
      }

      setIsLoading(false);
    },
    [authedUserState.authedUser],
  );

  useEffect(() => {
    getRequests();
  }, [getRequests]);

  const getContent = () => {
    /**
     * @type {JSX.Element[]}
     */
    const items = [
      <Button
        title={Translations.strings.addFriend()}
        onPress={
          //saveUser();
          () => {
            Alert.prompt(
              Translations.strings.enterEmail(),
              Translations.strings.enterFriendEmail(),
              [
                {
                  text: Translations.strings.cancel(),
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: email => saveUser(email),
                },
              ],
              'plain-text',
            );
          }
        }
      />,
    ];

    if (users.length > 0) {
      users.flatMap(item => items.push(<Text>{item.name}</Text>));
      return <FlatList data={items} renderItem={({item}) => item} />;
    } else {
      items.push(<Text>{Translations.strings.emptyList()}</Text>);
      return items;
    }
  };

  return (
    <View style={{...Theme.styles.screen, ...Theme.styles.center}}>
      {isLoading && <LoadingIndicator />}
      {!isLoading && getContent()}
    </View>
  );
};

export default SentRequests;
