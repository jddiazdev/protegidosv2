import React, {useState, useRef, useContext} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  Switch,
  View,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import Colors from '../../styles/Colors';
import FormField from '../forms/FormField';
import {useFormData} from '../../hooks/useFormData';
import {useFormValidate} from '../../hooks/useFormValidate';
import Button from '../buttons/Button';
import axios from '../../network/axios';
import {AuthContext} from '../../context/index';
import {getLocalUser} from '../../utils';

const PasswordForm = ({stateChanger, email: userEmail}) => {
  const navigation = useNavigation();
  const {signOut} = useContext(AuthContext);
  const [firstTime, setFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, handleFormValueChange, setFormValues] = useFormData({
    email: userEmail,
    token: '',
    password: '',
  });

  const [formRules, isValidForm, isValidInput] = useFormValidate(
    {
      email: 'required|email',
      token: 'required|tweet',
      password: 'required|tweet',
    },
    formValues,
  );

  const sendRecoveryForm = async () => {
    setIsLoading(true);

    let user = await getLocalUser();

    delete axios.defaults.headers.common.Authorization;

    try {
      await axios.post('/forgot-password', {
        ...formValues,
      });

      await AsyncStorage.multiRemove(['hasRequestChanges', 'localUser']);

      Alert.alert(
        'Recuperación',
        'Contraseña cambiada con éxito.',
        [{text: 'Gracias'}],
        {cancelable: false},
      );

      setIsLoading(false);

      if (user) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Dashboard', params: {refresh: true}}],
        });
      } else {
        signOut();
        navigation.reset({
          index: 0,
          routes: [{name: 'Login', params: {refresh: true}}],
        });
      }
    } catch (e) {
      setIsLoading(false);
      await AsyncStorage.removeItem('hasRequestChanges');
      Alert.alert(
        'Recuperación',
        'Token inválido, por favor vuelva a intentarlo.',
        [{text: 'Gracias'}],
        {cancelable: false},
      );
      signOut();
      navigation.reset({
        index: 0,
        routes: [{name: 'Login', params: {refresh: true}}],
      });

      throw new Error(
        `Error en sendRecoveryForm: ${e.message}, ${JSON.stringify(e)}`,
      );
    }
  };

  const onClickFormButton = () => {
    setFirstTime(false);
    if (isValidForm()) {
      sendRecoveryForm();
    }
  };

  const mailAgain = async () => {
    await AsyncStorage.removeItem('hasRequestChanges');
    stateChanger(true);
  };

  const refToken = useRef();
  const refPassword = useRef();

  return (
    <>
      <View style={styles.ctnForm}>
        <FormField
          formKey="email"
          label="Correo electrónico:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('email')}
          textInputProps={{
            returnKeyType: 'next',
            autoCapitalize: 'none',
            keyboardType: 'email-address',
          }}
          onSubmitEditing={() => {
            refToken.current.focus();
          }}
        />
        <FormField
          formKey="token"
          label="Código enviado al correo:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('token')}
          ref={refToken}
          textInputProps={{
            returnKeyType: 'next',
          }}
        />
        <FormField
          formKey="password"
          label="Nueva contraseña:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('password')}
          ref={refPassword}
          textInputProps={{
            secureTextEntry: !showPassword,
            returnKeyType: 'go',
          }}
        />
        <View style={styles.ctnShowPassword}>
          <Text style={styles.textShowPassword}>Mostrar Contraseña:</Text>
          <Switch
            onValueChange={() => {
              setShowPassword(!showPassword);
            }}
            value={showPassword}
          />
        </View>
      </View>
      <View style={styles.ctnButton}>
        {isLoading && (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="white"
          />
        )}
        <Button
          text="Cambiar contraseña"
          title="Cambiar contraseña"
          variant="secondary"
          onPress={onClickFormButton}
          disabled={isLoading}
        />

        <Button
          text="Enviar email nuevamente"
          title="Cambiar contraseña"
          variant="white"
          customStyle={styles.btnMargin}
          onPress={mailAgain}
          disabled={isLoading}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  ctnForm: {
    paddingHorizontal: 32,
  },
  btnMargin: {
    marginTop: 25,
  },
  ctnButton: {
    alignItems: 'center',
  },
  loading: {
    marginBottom: 16,
  },
  ctnShowPassword: {
    flexDirection: 'row',
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textShowPassword: {
    color: 'white',
    marginRight: 16,
  },
  ctnTerms: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTerms: {
    color: 'white',
    textAlign: 'center',
  },
  textBlue: {
    color: Colors.secondary,
    fontWeight: '700',
    marginVertical: 4,
  },
});

export default PasswordForm;
