import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FriendRequests from 'screens/friends/FriendRequests';
import SentRequests from 'screens/friends/SentRequests';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {
  BottomTabNavigationParamList,
  CreateBottomTabNavigatorType,
} from 'types/NavigationTypes';

/**
 * @type {CreateBottomTabNavigatorType<BottomTabNavigationParamList>}
 */
const BottomTabNavigation = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <BottomTabNavigation.Navigator
      initialRouteName="FriendRequests"
      screenOptions={{headerShown: false}}>
      <BottomTabNavigation.Screen
        name="FriendRequests"
        component={FriendRequests}
        options={{
          title: Translations.strings.incomingFriendRequests(),
          tabBarIcon: props => {
            return (
              <Icon
                name="person-add"
                size={Theme.values.tabBarIconSize.icon}
                color={props.color}
              />
            );
          },
        }}
      />
      <BottomTabNavigation.Screen
        name="SentRequests"
        component={SentRequests}
        options={{
          title: Translations.strings.sentFriendRequests(),
          tabBarIcon: props => {
            return (
              <Icon
                name="send"
                size={Theme.values.tabBarIconSize.icon}
                color={props.color}
              />
            );
          },
        }}
      />
    </BottomTabNavigation.Navigator>
  );
};

export default BottomNavigation;
