import {NavigationContainer} from '@react-navigation/native';
import MainStackNavigation from 'navigation/MainNavigation';
import React from 'react';
// @ts-ignore
import {PROBA} from 'react-native-dotenv';
import Theme from 'theme/Theme';

const App = () => {
  console.log(PROBA);
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

export default App;
