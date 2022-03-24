import {NavigationContainer} from '@react-navigation/native';
import MainStackNavigation from 'navigation/MainNavigation';
import React from 'react';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';

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

export default App;
