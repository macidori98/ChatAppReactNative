import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthNavigation from 'navigation/AuthenticationNavigation';
import React from 'react';
import ChatRoomScreen from 'screens/chat/ChatRoomScreen';
import HomeScreen from 'screens/home/HomeScreen';
import {Translations} from 'translations/Translations';
import {
  CreateNativeStackNavigatorType,
  MainNavigationParamList,
} from 'types/NavigationTypes';

/**
 * @type {CreateNativeStackNavigatorType<MainNavigationParamList>}
 */
const Stack = createNativeStackNavigator();

const MainStackNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Auth"
      component={AuthNavigation}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Home"
      initialParams={{title: 'Home'}}
      component={HomeScreen}
      options={() => ({title: Translations.strings.homeScreenTitle()})}
    />
    <Stack.Screen
      name="ChatScreen"
      component={ChatRoomScreen}
      options={{headerBackTitleVisible: false}}
    />
  </Stack.Navigator>
);

export default MainStackNavigation;
