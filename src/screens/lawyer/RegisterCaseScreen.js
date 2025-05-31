import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Colors from '../../styles/Colors';
import RegisterCaseForm from '../../components/lawyer/RegisterCaseForm';
import Footer from '../../components/footer/Footer';
import BackButton from '../../components/header/BackButton';

const RegisterCaseScreen = ({navigation}) => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainWrapper}>
        <KeyboardAwareScrollView>
          <BackButton />
          <Text style={styles.title}>Registrar Caso</Text>
          <RegisterCaseForm navigation="navigation" />
          <Footer withLogo={true} />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingBottom: 50,
    paddingTop: 30,
    color: '#FFF',
    fontSize: 40,
    textAlign: 'center',
    letterSpacing: 3,
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

export default RegisterCaseScreen;
