import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomNavigation from 'navigation/BottomNavigation';
import React from 'react';
import ChatRoomScreen from 'screens/chat/ChatRoomScreen';

const Stack = createNativeStackNavigator();

const MainStackNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={BottomNavigation} />
    <Stack.Screen
      options={{
        presentation: 'fullScreenModal',
      }}
      name="ChatScreen"
      component={ChatRoomScreen}
    />
  </Stack.Navigator>
);

export default MainStackNavigation;
