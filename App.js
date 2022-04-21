import {NavigationContainer} from '@react-navigation/native';
import {Amplify} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native/dist/Auth';
import MainStackNavigation from 'navigation/MainNavigation';
import React from 'react';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import ReduxThunk from 'redux-thunk';
import authReducer from 'store/reducers/auth';
import Theme from 'theme/Theme';
import {Translations} from 'translations/Translations';
import config from './src/aws-exports';

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const rootReducer = combineReducers({
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const App = props => {
  Translations.initializeTranslations();

  return (
    <Provider store={store}>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            background: Theme.colors.white,
            text: Theme.colors.black,
            border: Theme.colors.white,
            card: Theme.colors.white,
            notification: Theme.colors.white,
            primary: Theme.colors.messageBadgeColor,
          },
        }}>
        <MainStackNavigation />
        <Toast
          position="top"
          ref={ref => {
            Toast.setRef(ref);
          }}
        />
      </NavigationContainer>
    </Provider>
  );
};

export default withAuthenticator(App);
