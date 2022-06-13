import {
  changeUserName,
  getCurrentUserData,
  logOut,
  updateCurrentUserPublicKey,
} from 'api/Requests';
import Separator from 'components/common/Separator';
import UserProfile from 'components/users/UserProfile';
import {saveItemToAsyncStorage} from 'helpers/AsyncStorageHelper';
import {SECRET_KEY} from 'helpers/Constants';
import {ToastHelper} from 'helpers/ToastHelper';
import React from 'react';
import {Alert, Button, View} from 'react-native';
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

    const user = await getCurrentUserData();

    dispatch(updateUserData(user));

    ToastHelper.showSuccess(Translations.strings.updateKeypairSuccess());
  };

  const changeProfilePicture = () => {};

  /**
   * @param {string} name
   */
  const changeName = async name => {
    const response = await changeUserName(authedUserState.authedUser, name);
    const user = await getCurrentUserData();

    dispatch(updateUserData(user));
    ToastHelper.showSuccess(Translations.strings.requestSuccessfullySent());
  };

  const handleChangeName = async () => {
    Alert.prompt(
      Translations.strings.changeName(),
      Translations.strings.enterName(),
      [
        {
          text: Translations.strings.cancel(),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: name => changeName(name),
        },
      ],
      'plain-text',
    );
  };

  const changeLanguage = () => {
    props.navigation.navigate('Languages');
  };

  return (
    <View>
      <UserProfile user={authedUserState.authedUser} />

      <Separator />

      <Button
        title={Translations.strings.changeLanguage()}
        onPress={changeLanguage}
      />
      <Button
        title={Translations.strings.changeProfilePicture()}
        onPress={changeProfilePicture}
      />
      <Button
        title={Translations.strings.changeName()}
        onPress={handleChangeName}
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
