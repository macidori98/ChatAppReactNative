import {logOut, updateCurrentUserPublicKey} from 'api/Requests';
import {saveItemToAsyncStorage} from 'helpers/AsyncStorageHelper';
import {SECRET_KEY} from 'helpers/Constants';
import {ToastHelper} from 'helpers/ToastHelper';
import React from 'react';
import {Button, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateUserData} from 'store/actions/auth';
import {Translations} from 'translations/Translations';
import {ProfileScreenProps} from 'types/NavigationTypes';
import {AuthenticateState} from 'types/StoreTypes';
import {generateKeyPair} from 'utils/crypto';

/**
 * @param {ProfileScreenProps} props
 * @returns {JSX.Element}
 */
const ProfileScreen = props => {
  const authedUserState = useSelector(
    /** @param {{auth: AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  const dispatch = useDispatch();

  const handleLogOut = async () => {
    await logOut();
  };

  const handleKeyPairUpdate = async () => {
    const {publicKey, secretKey} = generateKeyPair();
    await saveItemToAsyncStorage(SECRET_KEY, secretKey.toString());
    const response = await updateCurrentUserPublicKey(
      authedUserState.authedUser,
      publicKey.toString(),
    );

    dispatch(updateUserData(response));

    ToastHelper.showSuccess(Translations.strings.updateKeypairSuccess());
  };

  const changeProfilePicture = () => {};

  const changeLanguage = () => {
    props.navigation.navigate('Languages');
  };

  return (
    <View>
      <Button
        title={Translations.strings.changeLanguage()}
        onPress={changeLanguage}
      />
      <Button
        title={Translations.strings.changeProfilePicture()}
        onPress={changeProfilePicture}
      />
      <Button
        title={Translations.strings.updateKeypair()}
        onPress={handleKeyPairUpdate}
      />
      <Button title={Translations.strings.logout()} onPress={handleLogOut} />
    </View>
  );
};

export default ProfileScreen;
