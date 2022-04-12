import {Auth} from 'aws-amplify';
import React from 'react';
import {Button, View} from 'react-native';
import {Translations} from 'translations/Translations';

const ProfileScreen = props => {
  return (
    <View>
      <Button
        title={Translations.strings.logout()}
        onPress={() => {
          Auth.signOut();
        }}
      />
    </View>
  );
};

export default ProfileScreen;
