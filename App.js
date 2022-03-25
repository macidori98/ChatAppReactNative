import {NavigationContainer} from '@react-navigation/native';
import {Amplify} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native/dist/Auth';
import MainStackNavigation from 'navigation/MainNavigation';
import React from 'react';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import config from './src/aws-exports';

Amplify.configure(config);

const App = () => {
  Translations.initializeTranslations();
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          background: Theme.colors.white,
          text: Theme.colors.black,
          border: Theme.colors.lightGrey,
          card: Theme.colors.white,
          notification: Theme.colors.grey,
          primary: Theme.colors.messageBadgeColor,
        },
      }}>
      <MainStackNavigation />
    </NavigationContainer>
  );
};

export default withAuthenticator(App);
