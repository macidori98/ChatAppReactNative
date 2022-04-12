import ConversationPersonImage from 'components/ConversationPersonImage';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Theme from 'theme/Theme';
import {UsersListItemProps} from 'types/ComponentPropsTypes';

/**
 * @param {UsersListItemProps} props
 * @returns {JSX.Element}
 */
const UsersListItem = props => {
  const data = props.user;

  return (
    <TouchableOpacity onPress={() => props.onPress(data)}>
      <View style={styles.container}>
        <ConversationPersonImage
          imageSource={data.imageUri}
          imageStyle={styles.image}
        />

        <View style={styles.fullSpace}>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{data.name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UsersListItem;

const styles = StyleSheet.create({
  fullSpace: {
    ...Theme.styles.screen,
    justifyContent: 'center',
    paddingHorizontal: Theme.values.paddings.paddingMedium,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: Theme.values.paddings.paddingMedium,
    marginVertical: Theme.values.margins.marginSmall,
  },
  image: {
    height: Theme.values.personImage.normal,
    width: Theme.values.personImage.normal,
  },
  text: {
    fontSize: Theme.values.fontSize.small,
    color: Theme.colors.grey,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: Theme.values.fontSize.normal,
    color: Theme.colors.black,
    fontWeight: '700',
    marginBottom: Theme.values.margins.marginSmall,
  },
});
