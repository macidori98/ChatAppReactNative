import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ChatRoomScreen from 'screens/chat/ChatRoomScreen';
import UsersScreen from 'screens/chat/UsersScreen';
import HomeScreen from 'screens/home/HomeScreen';
import SplashScreen from 'screens/splash/SplashScreen';
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
    {/* <Stack.Screen
      name="Auth"
      component={AuthNavigation}
      options={{headerShown: false}}
    /> */}
    <Stack.Screen
      name="SplashScreen"
      component={SplashScreen}
      options={() => ({headerShown: false})}
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
    <Stack.Screen
      name="UsersScreen"
      component={UsersScreen}
      options={{
        headerBackTitleVisible: false,
        title: Translations.strings.users(),
      }}
    />
  </Stack.Navigator>
);

export default MainStackNavigation;
