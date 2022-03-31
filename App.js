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
  // const signUpConfig = {
  //   hideAllDefaults: true,
  //   signUpFields: [
  //     {
  //       label: 'Email',
  //       key: 'email',
  //       required: true,
  //       displayOrder: 1,
  //       type: 'string',
  //     },
  //     {
  //       label: 'Password',
  //       key: 'password',
  //       required: true,
  //       displayOrder: 2,
  //       type: 'password',
  //     },
  //   ],
  // };

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          background: Theme.colors.white,
          text: Theme.colors.black,
          border: Theme.colors.white,
          card: Theme.colors.white,
          notification: Theme.colors.white,
          primary: Theme.colors.messageBadgeColor,
        },
      }}>
      <MainStackNavigation />
    </NavigationContainer>
    // <>
    //   <StatusBar barStyle="dark-content" />
    //   <Authenticator
    //     usernameAttributes="email"
    //     signUpConfig={signUpConfig}
    //     theme={AmplifyTheme}
    //   />
    // </>
  );
};

export default withAuthenticator(App);
