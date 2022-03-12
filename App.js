import {NavigationContainer} from '@react-navigation/native';
import BottomNavigation from 'navigation/MainBottomNavigation';
import React from 'react';
import Theme from 'theme/Theme';

const App = () => {
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
      <BottomNavigation />
    </NavigationContainer>
  );
};

export default App;
