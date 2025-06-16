import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from '../network/axios';
import FormField from '../components/forms/FormField';
import {useFormData} from '../hooks/useFormData';
import {useFormValidate} from '../hooks/useFormValidate';
import Colors from '../styles/Colors';
import PasswordForm from '../components/dashboard/PasswordForm';
import BackButton from '../components/header/BackButton';
import {mainStyles} from '../styles/main';
import Button from '../components/buttons/Button';

const {width} = Dimensions.get('window');

const RecoverPasswordScreen = ({navigation}) => {
  const [firstTime, setFirstTime] = useState(true);
  const [validatedFirst, setValidatedFirst] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [formValues, handleFormValueChange, setFormValues] = useFormData({
    email: '',
  });

  const [formRules, isValidForm, isValidInput] = useFormValidate(
    {
      email: 'required|email',
    },
    formValues,
  );

  useEffect(() => {
    const hasRequestChanges = async () => {
      try {
        const requested = await AsyncStorage.getItem('hasRequestChanges');
        if (requested) {
          setFirstTime(false);
        }
      } catch (err) {
        setIsLoading(false);
        throw new Error(`Error in RecoverPasswordScreen, ${err}`);
      }
    };
    hasRequestChanges();
  }, [firstTime]);

  const requestChangeEmail = async () => {
    if (!isValidForm()) {
      Alert.alert(
        'Recuperación',
        'Debe enviar un email válido',
        [{text: 'Gracias'}],
        {cancelable: false},
      );
      setIsLoading(false);
      return;
    }

    await sendingForm();
  };

  const sendingForm = async () => {
    setIsLoading(true);
    delete axios.defaults.headers.common.Authorization;
    axios
      .post(`/password-recovery/${formValues.email}`)
      .then(async () => {
        await AsyncStorage.setItem('hasRequestChanges', 'true');
        setFirstTime(false);
        setIsLoading(false);
        Alert.alert(
          'Recuperación',
          'Enviaremos un correo a su cuenta con un código único. Con este y su correo podrá recuperar su contraseña.',
          [{text: 'Gracias'}],
          {cancelable: false},
        );
      })
      .catch(() => {
        setIsLoading(false);
        Alert.alert(
          'Recuperación',
          'El email enviado no es válido',
          [{text: 'Gracias'}],
          {cancelable: false},
        );
      })
      .finally(() => {
        setValidatedFirst(true);
        setIsLoading(false);
        refEmail.current?.focus();
      });
  };

  const refEmail = useRef();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={[styles.mainWrapper, styles.viewAllign]}>
        <KeyboardAwareScrollView>
          <View style={{height: 50}} />
          <BackButton />
          <Text style={mainStyles.title}>Cambiar contraseña</Text>
          {firstTime ? (
            <View style={styles.viewAllign}>
              {isLoading && (
                <ActivityIndicator
                  style={styles.loading}
                  size="large"
                  color="white"
                />
              )}
              <FormField
                formKey="email"
                label="Correo Electrónico:"
                placeholder=""
                handleFormValueChange={handleFormValueChange}
                isValid={validatedFirst ? true : isValidInput('email')}
                ref={refEmail}
                textInputProps={{
                  autoCapitalize: 'none',
                  keyboardType: 'email-address',
                  returnKeyType: 'next',
                }}
              />
              <Button
                text="Cambiar contraseña"
                title="Cambiar contraseña"
                variant="secondary"
                onPress={requestChangeEmail}
                disabled={isLoading}
                customStyle={styles.btn}
              />
            </View>
          ) : (
            <PasswordForm
              stateChanger={setFirstTime}
              email={formValues.email}
            />
          )}
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
  viewAllign: {
    alignItems: 'center',
  },
  btn: {
    width: width * 0.85,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  loading: {
    marginVertical: 16,
  },
});

export default RecoverPasswordScreen;
