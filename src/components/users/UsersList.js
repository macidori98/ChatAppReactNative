import UsersListItem from 'components/users/UsersListItem';
import React from 'react';
import {FlatList, Text, View} from 'react-native';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {UsersListProps} from 'types/ComponentPropsTypes';

/**
 * @param {UsersListProps} props
 * @returns {JSX.Element}
 */
const UsersList = props => {
  return (
    <View style={{...Theme.styles.screen}}>
      {props.users.length > 0 && (
        <FlatList
          data={props.users}
          renderItem={({item}) => (
            <UsersListItem onPress={props.onPress} user={item} />
          )}
          showsVerticalScrollIndicator={false}
          onEndReached={info => {
            console.log(info);
          }}
        />
      )}
      {props.users.length === 0 && (
        <View style={{...Theme.styles.center, ...Theme.styles.screen}}>
          <Text>{Translations.strings.emptyList()}</Text>
        </View>
      )}
    </View>
  );
};

export default UsersList;
