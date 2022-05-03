import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Theme from 'theme/Theme';

/**
 * @param {{iconName?: string, title: string, onPress: () => void}} props
 * @returns {JSX.Element}
 */
const CustomButton = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonContainer} onPress={props.onPress}>
        <View style={styles.button}>
          {props.iconName && (
            <View style={{marginEnd: Theme.values.margins.marginMedium}}>
              <Icon
                name={props.iconName}
                size={23}
                color={Theme.colors.white}
              />
            </View>
          )}
          <Text style={styles.text}>{props.title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
  },
  buttonContainer: {
    ...Theme.styles.screen,
    borderRadius: Theme.values.radius.medium,
    marginVertical: Theme.values.margins.marginMedium,
    maxWidth: '75%',
    paddingHorizontal: Theme.values.paddings.paddingLarge,
    backgroundColor: Theme.colors.primary,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Theme.colors.white,
    fontWeight: 'bold',
  },
  button: {
    ...Theme.styles.center,
    flexDirection: 'row',
  },
});
