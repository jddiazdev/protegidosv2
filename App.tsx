/**
 * Protegidos App
 *
 * @format
 * @flow strict-local
 *
 * Created by epileftro85
 */

import React, {useReducer, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {OneSignal, LogLevel} from 'react-native-onesignal';
import RNBootSplash from 'react-native-bootsplash';

import Navigation from './src/Navigation';
import axios from './src/network/axios';
import loginReducer from './src/reducers/loginReducer';

// import * as Sentry from '@sentry/react-native';

// Sentry.init({
//   dsn: 'https://f46310fb58ed4d9ba5b18e2bb3492083@o1284032.ingest.sentry.io/6495513',
//   // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
//   // We recommend adjusting this value in production.
//   tracesSampleRate: 1.0,
//   enableInExpoDevelopment: true,
//   debug: false,
//   enableNative: true,
// });

// // OneSignal Initialization
// OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize('f1901330-b278-4247-8687-a20d2f0c5a76');
OneSignal.Notifications.requestPermission(false);

const App = () => {
  const initialLoginState = {
    userEmail: null,
    userToken: null,
  };
  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  useEffect(() => {
    delete axios.defaults.headers.common.Authorization;
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let token: string | null = null;
      try {
        token = await AsyncStorage.getItem('userToken');
        if (!token) {
          dispatch({type: 'LOGOUT'});
        } else {
          dispatch({type: 'RESTORE_TOKEN', token: token});
          axios.defaults.headers.common.Authorization = 'Bearer ' + token;
        }
      } catch (e) {
        // Restoring token failed
        dispatch({type: 'LOGOUT'});
        throw new Error(
          `Error on App.js bootstrapAsync ${
            (JSON.stringify(e), (e as Error).message)
          }`,
        );
      }
    };

    bootstrapAsync().finally(async () => {
      await RNBootSplash.hide({fade: true});
    });
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (user: {token: string; email: string}) => {
        const userToken = String(user.token);
        const userEmail = user.email;
        try {
          await AsyncStorage.setItem('userToken', userToken);
        } catch (e) {
          throw new Error(
            `Error on App.js authContext ${
              (JSON.stringify(e), (e as Error).message)
            }`,
          );
        }
        axios.defaults.headers.common.Authorization = 'Bearer ' + userToken;
        dispatch({type: 'LOGIN', email: userEmail, token: userToken});
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('localUser');
        } catch (e) {
          throw new Error(
            `Error on App.js signOut ${
              (JSON.stringify(e), (e as Error).message)
            }`,
          );
        }
        delete axios.defaults.headers.common.Authorization;
        dispatch({type: 'LOGOUT'});
      },
      getUser: () => {
        return {email: loginState.userEmail};
      },
    }),
    [loginState.userEmail],
  );

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      {Navigation(authContext, loginState)}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

export default App;
// export default Sentry.wrap(App);
