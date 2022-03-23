import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from 'screens/home/HomeScreen';

const ChatStackNavigation = createNativeStackNavigator();

const ChatNavigation = () => {
  return (
    <ChatStackNavigation.Navigator screenOptions={{headerShown: false}}>
      <ChatStackNavigation.Screen name="HomeScreen" component={HomeScreen} />
    </ChatStackNavigation.Navigator>
  );
};
export default ChatNavigation;
