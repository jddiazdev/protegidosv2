import React from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BackButton from '../components/header/BackButton';

import Colors from '../styles/Colors';
import RegisterForm from '../components/register/RegisterForm';

const RegisterScreen = ({navigation}) => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainWrapper}>
        <KeyboardAwareScrollView>
          <BackButton />
          <Text style={styles.title}>REGISTRO</Text>
          <RegisterForm navigation="navigation" />
          <View style={styles.ctnLogo}>
            <Image
              style={styles.logo}
              source={require('../assets/img/logo.png')}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingVertical: 40,
    color: '#FFF',
    fontSize: 40,
    textAlign: 'center',
  },
  mainWrapper: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  ctnLogo: {
    alignItems: 'center',
    paddingTop: 32,
  },
  logo: {
    width: '100%',
    height: 70,
    aspectRatio: 191 / 171,
  },
});

export default RegisterScreen;
