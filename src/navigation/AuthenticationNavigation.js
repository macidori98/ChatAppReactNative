import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from 'screens/authentication/LoginScreen';
import {
  AuthenticationNavigationParamList,
  CreateNativeStackNavigatorType,
} from 'types/NavigationTypes';

/**
 * @type {CreateNativeStackNavigatorType<AuthenticationNavigationParamList>}
 */
const AuthStack = createNativeStackNavigator();

const AuthNavigation = () => (
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

export default AuthNavigation;
