import {removeFriendFromList} from 'api/Requests';
import UserProfile from 'components/users/UserProfile';
import {ToastHelper} from 'helpers/ToastHelper';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {UsersProfileScreenProps} from 'types/NavigationTypes';

/**
 * @param {UsersProfileScreenProps} props
 * @returns {JSX.Element}
 */
const UsersProfileScreen = props => {
  const {user, currentUser} = props.route.params;

  const removeFriend = async () => {
    const result = await removeFriendFromList(currentUser, user);
    if (result.success) {
      ToastHelper.showSuccess(Translations.strings.requestSuccessfullySent());
      props.navigation.reset({routes: [{name: 'Home'}, {name: 'UsersScreen'}]});
    } else {
      ToastHelper.showError(result.error);
    }
  };

  return (
    <View style={Theme.styles.screen}>
      <UserProfile user={user} />
      <TouchableOpacity style={styles.container} onPress={removeFriend}>
        <Text style={{color: Theme.colors.error}}>
          {Translations.strings.remove()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    ...Theme.styles.center,
  },
});

export default UsersProfileScreen;
