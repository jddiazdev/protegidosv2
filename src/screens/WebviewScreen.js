import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar, View} from 'react-native';
import {WebView} from 'react-native-webview';
import BackButton from '../components/header/BackButton';

import {protegidosBaseUrl} from '../utils/index';

const WebviewScreen = ({route, navigation}) => {
  const {user, plan} = route.params;
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainWrapper}>
        <BackButton />
        <View style={styles.wrapper}>
          <WebView
            source={{
              uri: `${protegidosBaseUrl}/epayco/${user.email}/${plan.id}/${plan.duration}/${plan.name}`,
            }}
            style={styles.webview}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: '#62c44e',
    flex: 1,
  },
  wrapper: {
    height: '100%',
    backgroundColor: '#fff',
    marginTop: 16,
    paddingBottom: 70,
  },
  webview: {
    backgroundColor: '#62c44e',
  },
});

export default WebviewScreen;
