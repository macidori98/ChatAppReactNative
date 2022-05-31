import ConversationPersonImage from 'components/ConversationPersonImage';
import {User} from 'models';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Theme from 'theme/Theme';

/**
 * @param {{user: User}} props
 * @returns {JSX.Element}
 */
const UserProfile = props => {
  const {user} = props;
  return (
    <View style={styles.container}>
      <View style={{...Theme.styles.screen, ...Theme.styles.center}}>
        <ConversationPersonImage imageSource={user.imageUri} />
      </View>
      <Text style={styles.userName}>{user.userName}</Text>
      <Text style={styles.name}>{user.name}</Text>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: '100%',
    ...Theme.styles.center,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 5,
  },
  name: {
    margin: 5,
  },
});
