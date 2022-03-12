import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Theme from 'theme/Theme';

/**
 * @param {{count: number}} props
 * @returns {JSX.Element}
 */
const MessageBadge = props => {
  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{props.count}</Text>
    </View>
  );
};

export default MessageBadge;

const styles = StyleSheet.create({
  badgeContainer: {
    ...Theme.styles.center,
    backgroundColor: Theme.colors.messageBadgeColor,
    width: Theme.values.badgeContainer.width,
    height: Theme.values.badgeContainer.height,
    borderRadius: Theme.values.badgeContainer.height / 2,
    position: 'absolute',
    left: Theme.values.personImage.normal - 7,
    borderWidth: Theme.values.borderWidth.small,
    borderColor: Theme.colors.white,
  },
  badgeText: {
    justifyContent: 'flex-end',
    fontSize: Theme.values.fontSize.messageBadge,
    color: Theme.colors.white,
  },
});
