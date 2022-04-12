import {Auth, DataStore, Hub} from 'aws-amplify';
import LoadingIndicator from 'components/common/LoadingIndicator';
import {User} from 'models';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {authenticateUser} from 'store/actions/auth';
import {UseState} from 'types/CommonTypes';
import {SplashScreenProps} from 'types/NavigationTypes';

/**
 * @param {SplashScreenProps} props
 * @returns {JSX.Element}
 */
const SplashScreen = props => {
  /** @type {UseState<boolean>} */
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  const getAuthedUserData = useCallback(async () => {
    const userId = (await Auth.currentAuthenticatedUser()).attributes.sub;
    const userData = await DataStore.query(User, userId);
    dispatch(authenticateUser(userData));
    setIsLoading(false);
    props.navigation.replace('Home');
  }, [dispatch, props.navigation]);

  useEffect(() => {
    const removeListener = Hub.listen('datastore', async capsule => {
      const {
        payload: {event},
      } = capsule;

      if (event === 'ready') {
        getAuthedUserData();
      }
    });

    DataStore.query(User);

    return () => {
      removeListener();
    };
  }, [getAuthedUserData]);

  return <View>{isLoading && <LoadingIndicator />}</View>;
};

export default SplashScreen;
