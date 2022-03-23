import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatNavigation from 'navigation/ChatNavigation';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const MainBottomNavigation = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <MainBottomNavigation.Navigator
      initialRouteName="Chats"
      screenOptions={{headerShown: false}}>
      <MainBottomNavigation.Screen
        name="Chats"
        component={ChatNavigation}
        options={{
          tabBarIcon: props => {
            return <Icon name="car" />;
          },
        }}
      />
    </MainBottomNavigation.Navigator>
  );
};

export default BottomNavigation;
