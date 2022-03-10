import React from 'react';
import {StyleSheet, View} from 'react-native';
import Theme from 'theme/Theme';

const Separator = () => {
  return <View style={styles.separator} />;
};

export default Separator;

const styles = StyleSheet.create({
  separator: {
    backgroundColor: Theme.colors.lightGrey,
    height: 1,
    width: '90%',
  },
});
