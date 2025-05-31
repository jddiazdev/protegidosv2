import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Colors from '../../styles/Colors';
import EmergencyForm from '../../components/dashboard/EmergencyForm';
import Title from '../../components/titles/Title';
import BackButton from '../../components/header/BackButton';

const EmergencyScreen = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.mainWrapper}>
        <KeyboardAwareScrollView>
          <BackButton />
          <Title text="Datos para casos de Emergencia" />
          <Text style={styles.text}>
            En caso de alguna emergencia Protegidos App se pondrá en contacto
            con las personas que nos indiques aquí
          </Text>
          <EmergencyForm />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  text: {
    color: 'white',
    paddingHorizontal: 32,
    fontSize: 16,
    marginBottom: 32,
  },
});

export default EmergencyScreen;
