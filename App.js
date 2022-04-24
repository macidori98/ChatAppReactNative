import {NavigationContainer} from '@react-navigation/native';
import {Amplify, Auth, DataStore, Hub} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native/dist/Auth';
import {Message, User} from 'models';
import moment from 'moment';
import MainStackNavigation from 'navigation/MainNavigation';
import React, {useCallback, useEffect, useState} from 'react';
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
  /** @type {import('types/CommonTypes').UseState<User>} */
  const [user, setUser] = useState();

  Translations.initializeTranslations();

  const fetchUser = useCallback(async () => {
    const userData = await Auth.currentAuthenticatedUser();
    const authedUser = await DataStore.query(User, userData.attributes.sub);
    if (authedUser) {
      setUser(authedUser);
    }
  }, []);

  useEffect(() => {
    let subscription;
    if (user) {
      subscription = DataStore.observe(User, user.id).subscribe(msg => {
        if (msg.opType === 'UPDATE' && msg.model === User) {
          setUser(u => {
            return msg.element;
          });
        }
      });
    }

    return () => subscription?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const updateLastOnline = useCallback(async () => {
    if (user) {
      const response = await DataStore.save(
        User.copyOf(user, update => {
          update.lastOnlineAt = moment().unix();
        }),
      );
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateLastOnline();
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    updateLastOnline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (
      props &&
      props.authData &&
      props.authData.attributes &&
      props.authData.attributes.sub
    ) {
      fetchUser();
    }
  }, [fetchUser, props]);

  useEffect(() => {
    const listener = Hub.listen('datastore', async hubData => {
      const {event, data} = hubData.payload;

      if (
        event === 'outboxMutationProcessed' &&
        data.model === Message &&
        data.element.status === 'SENT'
      ) {
        DataStore.save(
          Message.copyOf(data.element, update => {
            update.status = 'DELIVERED';
          }),
        );
      }
    });
    return () => listener();
  }, []);

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
