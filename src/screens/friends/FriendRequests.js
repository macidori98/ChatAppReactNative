import {getRecievedRequests} from 'api/Requests';
import LoadingIndicator from 'components/common/LoadingIndicator';
import {User} from 'models';
import React, {useCallback, useEffect, useState} from 'react';
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

  const getContent = () => {
    if (users.length > 0) {
      return users.map(item => <Text key={item.name}>{item.name}</Text>);
    } else {
      return (
        <Text key={Translations.strings.emptyList()}>
          {Translations.strings.emptyList()}
        </Text>
      );
    }
  };

  return (
    <View style={{...Theme.styles.screen, ...Theme.styles.center}}>
      {isLoading && <LoadingIndicator />}
      {!isLoading && getContent()}
    </View>
  );
};

export default FriendRequests;
