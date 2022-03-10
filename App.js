import {NavigationContainer} from '@react-navigation/native';
import BottomNavigation from 'navigation/MainBottomNavigation';
import React from 'react';

const App = () => {
  return (
    <NavigationContainer>
      <BottomNavigation />
    </NavigationContainer>
  );
};

export default App;
