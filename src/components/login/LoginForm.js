import React, {useState, useContext} from 'react';
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Style from '../../styles/index';
import FormField from '../forms/FormField';
import {useFormData} from '../../hooks/useFormData';
import {useFormValidate} from '../../hooks/useFormValidate';
import {AuthContext} from '../../context';
import axios from '../../network/axios';

const LoginForm = () => {
  const {signIn} = useContext(AuthContext);
  const [firstTime, setFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, handleFormValueChange] = useFormData({
    email: '',
    document: '',
  });
  const [formRules, isValidForm, isValidInput] = useFormValidate(
    {
      email: 'required|email',
      document: 'required',
    },
    formValues,
  );

  const sendLogin = async () => {
    setIsLoading(true);
    delete axios.defaults.headers.common.Authorization;
    try {
      await axios
        .post('/login', {
          email: formValues.email,
          password: formValues.document,
        })
        .then(res => {
          signIn({
            token: res.data.token,
            email: formValues.email,
          });
        });
    } catch (error) {
      let msg = 'Ocurrió un error, por favor intente nuevamente.';
      if (error.message === 'Request failed with status code 401') {
        msg =
          'Los datos ingresados no son validos, por favor intente nuevamente.';
      }
      setIsLoading(false);
      Alert.alert(
        'Error',
        msg,
        [
          {
            text: 'Aceptar',
          },
        ],
        {cancelable: false},
      );
      throw new Error(
        `Error on LoginForm sendLogin line 66 ${
          (JSON.stringify(error), error.message)
        }`,
      );
    }
    setIsLoading(false);
  };
  const onClickFormButton = () => {
    setFirstTime(false);
    if (isValidForm()) {
      sendLogin();
    }
  };
  return (
    <>
      <View style={styles.ctnForm}>
        <FormField
          formKey="email"
          label="Correo Electrónico:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('email')}
          textInputProps={{
            autoCapitalize: 'none',
            keyboardType: 'email-address',
          }}
        />
        <FormField
          formKey="document"
          label="Contraseña:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('document')}
          textInputProps={{
            secureTextEntry: true,
          }}
        />
      </View>
      <View style={styles.ctnButton}>
        {isLoading && (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="white"
          />
        )}
        <TouchableOpacity
          style={Style.btn}
          onPress={onClickFormButton}
          disabled={isLoading}>
          <Text style={Style.btnText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  ctnForm: {
    paddingHorizontal: 32,
  },
  ctnButton: {
    alignItems: 'center',
  },
  loading: {
    marginBottom: 16,
  },
});

export default LoginForm;
