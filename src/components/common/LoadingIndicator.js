import React from 'react';
import {
  ActivityIndicator,
  ColorValue,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Theme from 'theme/Theme';

/**
 * @param {{size?: number | "small" | "large", color?: ColorValue, style?: ViewStyle}} props
 * @returns {JSX.Element}
 */
const LoadingIndicator = props => {
  return (
    <ActivityIndicator
      size={props.size ?? 'large'}
      color={props.color ?? Theme.colors.primary}
      style={{...styles.indicator, ...props.style}}
    />
  );
};

export default LoadingIndicator;

const styles = StyleSheet.create({
  indicator: {
    ...Theme.styles.center,
    ...Theme.styles.screen,
  },
});
