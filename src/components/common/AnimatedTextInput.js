import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing';
import Theme from 'theme/Theme';
import {UseState} from 'types/CommonTypes';
import {AnimatedTextInputProps} from 'types/ComponentPropsTypes';

/**
 * @param {AnimatedTextInputProps} props
 * @returns {JSX.Element}
 */
const AnimatedTextInput = props => {
  /** @type {UseState<boolean>} */
  const [isFocused, setIsFocused] = useState(false);

  /** @type {UseState<string>} */
  const [error, setError] = useState();

  /** @type {MutableRefObject<TextInput>} */
  const inputRef = useRef(null);

  /*** @type {Animated.Value} */
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused || !!props.value ? 1 : 0,
      duration: 150,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [focusAnim, isFocused, props.value]);

  let color = isFocused ? Theme.colors.focused : Theme.colors.unfocused;
  if (error) {
    color = Theme.colors.error;
  }

  return (
    <View style={props.style}>
      <TextInput
        onSubmitEditing={Keyboard.dismiss}
        secureTextEntry={props.secureTextEntry}
        autoCapitalize={props.autoCapitalize ?? 'none'}
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        style={[
          styles.input,
          {
            borderColor: color,
          },
        ]}
        ref={inputRef}
        value={props.value}
        onBlur={event => {
          if (props.dataIsValid?.()) {
            setError('');
          } else {
            setError(props.errorText);
          }

          setIsFocused(false);
          props.onBlur?.(event);
        }}
        onFocus={event => {
          setIsFocused(true);
          props.onFocus?.(event);
        }}
      />
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <Animated.View
          style={[
            styles.labelContainer,
            {
              transform: [
                {
                  scale: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.75],
                  }),
                },
                {
                  translateY: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Theme.values.paddings.paddingLarge, -18],
                  }),
                },
                {
                  translateX: focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Theme.values.fontSize.normal, 20],
                  }),
                },
              ],
            },
          ]}>
          <Text
            style={[
              styles.label,
              {
                color,
              },
            ]}>
            {props.label}
            {error ? '*' : ''}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default AnimatedTextInput;

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: Theme.values.paddings.paddingLarge,
    paddingVertical: Theme.values.paddings.paddingLarge,
    borderWidth: Theme.values.borderWidth.normal,
    borderRadius: Theme.values.radius.extraLarge,
    fontSize: Theme.values.fontSize.normal,
  },
  labelContainer: {
    top: 3,
    position: 'absolute',
    paddingHorizontal: 8,
    backgroundColor: Theme.colors.white,
  },
  label: {
    fontSize: Theme.values.fontSize.normal,
  },
  error: {
    marginTop: Theme.values.margins.marginSmall,
    marginLeft: Theme.values.marginError,
    fontSize: Theme.values.fontSize.extraSmall,
    color: Theme.colors.error,
  },
});
