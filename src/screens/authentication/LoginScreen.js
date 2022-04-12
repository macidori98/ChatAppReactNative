import {Auth} from 'aws-amplify';
import AnimatedTextInput from 'components/common/AnimatedTextInput';
import LoadingIndicator from 'components/common/LoadingIndicator';
import {emailRegex, passwordRegex} from 'helpers/Constants';
import React, {useRef, useState} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import {UseRef, UseState} from 'types/CommonTypes';
import {LoginScreenProps} from 'types/NavigationTypes';

/**
 * @param {LoginScreenProps} props
 * @returns {JSX.Element}
 */
const LoginScreen = props => {
  /** @type {UseState<string>} */
  const [email, setEmail] = useState();
  /** @type {UseState<string>} */
  const [password, setPassword] = useState();
  /** @type {UseState<string>} */
  const [error, setError] = useState();
  /** @type {UseState<boolean>} */
  const [loading, setLoading] = useState(false);
  /** @type {UseRef<boolean>} */
  const isDataValidRef = useRef(false);

  const signIn = async () => {
    if (email && password) {
      setLoading(true);
      Auth.signIn(email, password)
        .then(res => {
          setLoading(false);
          props.navigation.navigate('Home');
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  /**
   * @param {string} data
   * @param {RegExp} regex
   * @returns {boolean}
   */
  const isDataValid = (data, regex) => {
    const validity = regex.test(data);
    isDataValidRef.current = validity;
    return validity;
  };

  return (
    <KeyboardAvoidingView
      style={Theme.styles.screen}
      keyboardVerticalOffset={100}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.content}>
        <View style={{...Theme.styles.center}}>
          <Text style={styles.title}>{Translations.strings.signInTitle()}</Text>
        </View>
        <View>
          {error && <Text style={{color: Theme.colors.error}}>{error}</Text>}
        </View>
        <View style={{...styles.inputFieldsContainer}}>
          <AnimatedTextInput
            secureTextEntry={false}
            dataIsValid={isDataValid.bind(this, email, emailRegex)}
            style={styles.textField}
            value={email}
            label={Translations.strings.email()}
            errorText={Translations.strings.invalidEmail()}
            onChangeText={text => setEmail(text)}
          />
          <AnimatedTextInput
            secureTextEntry={true}
            dataIsValid={isDataValid.bind(this, password, passwordRegex)}
            style={styles.textField}
            value={password}
            label={Translations.strings.password()}
            errorText={Translations.strings.invalidPassword()}
            onChangeText={text => setPassword(text)}
          />

          <TouchableOpacity
            style={styles.signInContainer}
            onPress={email && password && isDataValidRef ? signIn : null}>
            <Text style={styles.signInButtonText}>
              {Translations.strings.signIn()}
            </Text>
          </TouchableOpacity>

          <View style={styles.rowButtonsContainer}>
            <TouchableOpacity>
              <Text>{Translations.strings.forgotPassword()}</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>{Translations.strings.signUp()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && (
          <View style={styles.overlay}>
            <LoadingIndicator />
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  signInContainer: {
    paddingHorizontal: Theme.values.paddings.paddingLarge,
    paddingVertical: Theme.values.paddings.paddingLarge,
    borderWidth: Theme.values.borderWidth.normal,
    borderColor: Theme.colors.primary,
    borderRadius: Theme.values.radius.extraLarge,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
  },
  content: {
    marginTop: '25%',
    ...Theme.styles.screen,
  },
  inputFieldsContainer: {
    paddingVertical: Theme.values.paddings.paddingLarge,
    marginHorizontal: '10%',
  },
  title: {
    fontSize: Theme.values.fontSize.large,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  textField: {
    marginBottom: 32,
  },
  rowButtonsContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signInButtonText: {
    color: Theme.colors.white,
  },
  overlay: {
    position: 'absolute',
    top: '-25%',
    width: '100%',
    height: Dimensions.get('screen').height * 1.25,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
