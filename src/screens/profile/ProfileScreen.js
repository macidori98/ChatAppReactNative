import AsyncStorage from '@react-native-async-storage/async-storage';
import {Auth, DataStore} from 'aws-amplify';
import {User} from 'models';
import React from 'react';
import {Button, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateUserData} from 'store/actions/auth';
import {Translations} from 'translations/Translations';
import {AuthenticateState} from 'types/StoreTypes';
import {generateKeyPair} from 'utils/crypto';

const PUBLIC_KEY = 'PUBLIC_KEY';
const SECRET_KEY = 'SECRET_KEY';

const ProfileScreen = props => {
  const authedUserState = useSelector(
    /** @param {{auth: AuthenticateState}} state */ state => {
      return state.auth;
    },
  );

  const dispatch = useDispatch();

  return (
    <View>
      <Button
        title={'Update keypair'}
        onPress={async () => {
          const {publicKey, secretKey} = generateKeyPair();
          await AsyncStorage.setItem(SECRET_KEY, secretKey.toString());
          const response = await DataStore.save(
            User.copyOf(authedUserState.authedUser, update => {
              update.publicKey = publicKey.toString();
            }),
          );
          dispatch(updateUserData(response));
        }}
      />
      <Button
        title={Translations.strings.logout()}
        onPress={async () => {
          await DataStore.clear();
          Auth.signOut();
        }}
      />
    </View>
  );
};

export default ProfileScreen;
