import {logOut, updateCurrentUserPublicKey} from 'api/Requests';
import {saveItemToAsyncStorage} from 'helpers/AsyncStorageHelper';
import {SECRET_KEY} from 'helpers/Constants';
import {ToastHelper} from 'helpers/ToastHelper';
import React from 'react';
import {Button, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateUserData} from 'store/actions/auth';
import {Translations} from 'translations/Translations';
import {AuthenticateState} from 'types/StoreTypes';
import {generateKeyPair} from 'utils/crypto';

const ProfileScreen = () => {
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

  return (
    <View>
      <Button
        title={Translations.strings.updateKeypair()}
        onPress={handleKeyPairUpdate}
      />
      <Button title={Translations.strings.logout()} onPress={handleLogOut} />
    </View>
  );
};

export default ProfileScreen;
