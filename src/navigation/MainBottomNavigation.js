import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreen from 'screens/home/HomeScreen';

const MainBottomNavigation = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <MainBottomNavigation.Navigator initialRouteName="HomeScreen">
      <MainBottomNavigation.Screen name="HomeScreen" component={HomeScreen} />
      <MainBottomNavigation.Screen name="Home2Screen" component={HomeScreen} />
    </MainBottomNavigation.Navigator>
  );
};

export default BottomNavigation;
