import {getAllUsers, getCurrentUserData, hubListener} from 'api/Requests';
import LoadingIndicator from 'components/common/LoadingIndicator';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {authenticateUser} from 'store/actions/auth';
import Theme from 'theme/Theme';
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
    const userData = await getCurrentUserData();
    dispatch(authenticateUser(userData));
    setIsLoading(false);
    props.navigation.replace('Home');
  }, [dispatch, props.navigation]);

  useEffect(() => {
    const removeListener = hubListener(getAuthedUserData);

    getAllUsers();

    return () => {
      removeListener();
    };
  }, [getAuthedUserData]);

  return (
    <View style={{...Theme.styles.screen}}>
      {isLoading && <LoadingIndicator />}
    </View>
  );
};

export default SplashScreen;
