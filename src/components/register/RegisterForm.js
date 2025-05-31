import React, {useState, useRef, useContext} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  View,
  Linking,
  Alert,
} from 'react-native';

import Colors from '../../styles/Colors';
import FormField from '../forms/FormField';
import {useFormData} from '../../hooks/useFormData';
import {useFormValidate} from '../../hooks/useFormValidate';
import {AuthContext} from '../../context';
import axios from '../../network/axios';

const RegisterForm = () => {
  const {signIn} = useContext(AuthContext);
  const [firstTime, setFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, handleFormValueChange, setFormValues] = useFormData({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    city: '',
    document: '',
    password: '',
  });

  const [formRules, isValidForm, isValidInput] = useFormValidate(
    {
      first_name: 'required',
      last_name: 'required',
      email: 'required|email',
      phone: 'required|phone',
      city: 'required',
      document: 'required',
      password: 'required',
    },
    formValues,
  );

  const sendRegisterForm = async () => {
    setIsLoading(true);
    delete axios.defaults.headers.common.Authorization;
    try {
      await axios
        .post('/register', {
          ...formValues,
          lawyer: false,
          terms: true,
        })
        .then(res => {
          signIn({
            token: res.data.token,
            email: formValues.email,
          });
        });
    } catch (e) {
      setIsLoading(false);
      Alert.alert(
        'Error',
        'Por favor revise sus datos, todos los campos son requeridos y no es posible registrarse bajo el mismo correo o documento mas de una vez.',
        [
          {
            text: 'Gracias',
          },
        ],
        {cancelable: true},
      );
      throw new Error(
        `Error on Register Form sendRegisterForm ${e.message}, ${e}`,
      );
    }
  };

  const onClickFormButton = () => {
    setFirstTime(false);
    if (isValidForm()) {
      sendRegisterForm();
    }
  };

  const refLastname = useRef();
  const refEmail = useRef();
  const refPhone = useRef();
  const refCity = useRef();
  const refDocument = useRef();
  const refPassword = useRef();

  const terms = async () => {
    return Linking.openURL('https://49748372.hs-sites.com/home');
  };

  return (
    <>
      <View style={styles.ctnForm}>
        <FormField
          formKey="name"
          label="Nombres:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('first_name')}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refLastname.current.focus();
          }}
        />
        <FormField
          formKey="lastname"
          label="Apellidos:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('last_name')}
          ref={refLastname}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refEmail.current.focus();
          }}
        />
        <FormField
          formKey="email"
          label="Correo Electrónico:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('email')}
          ref={refEmail}
          textInputProps={{
            autoCapitalize: 'none',
            keyboardType: 'email-address',
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refPhone.current.focus();
          }}
        />
        <FormField
          formKey="phone"
          label="Móvil:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('phone')}
          ref={refPhone}
          textInputProps={{
            keyboardType: 'phone-pad',
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refCity.current.focus();
          }}
        />
        <FormField
          formKey="city"
          label="Ciudad:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('city')}
          ref={refCity}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refDocument.current.focus();
          }}
        />
        <FormField
          formKey="document"
          label="Cédula:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('document')}
          ref={refDocument}
          textInputProps={{
            keyboardType: 'phone-pad',
            returnKeyType: 'next',
          }}
        />
        <FormField
          formKey="password"
          label="Contraseña:"
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
      <View style={styles.ctnTerms}>
        <Text style={styles.textTerms}>Al registrarme estoy aceptando los</Text>
        <TouchableOpacity
          onPress={() => {
            terms();
          }}>
          <Text style={styles.textBlue}>Terminos y condiciones</Text>
        </TouchableOpacity>
        <Text style={styles.textTerms}>de Protegidos.</Text>
      </View>
      <View style={styles.ctnButton}>
        {isLoading && (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="white"
          />
        )}
        <TouchableOpacity onPress={onClickFormButton} style={styles.blueBtn}>
          <Text style={styles.textTerms}>Registrarme</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  blueBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: 5,
    padding: 15,
  },
  ctnForm: {
    paddingHorizontal: 32,
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
    fontSize: 16,
  },
  textBlue: {
    color: Colors.secondary,
    fontWeight: '700',
    marginVertical: 4,
  },
});

export default RegisterForm;
