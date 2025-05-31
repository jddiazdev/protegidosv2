import React, {useState, useRef, useEffect, useContext} from 'react';
import {Alert, ActivityIndicator, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import axios from '../../network/axios';
import FormField from '../forms/FormField';
import {useFormData} from '../../hooks/useFormData';
import {useFormValidate} from '../../hooks/useFormValidate';
import {getLocalUser} from '../../utils';
import {AuthContext} from '../../context';
import Button from '../buttons/Button';

const EmergencyForm = () => {
  const rules = {
    emergency_name: 'required|tweet',
    emergency_email: 'required|email',
    emergency_mobile: 'required|phone',
    emergency_address: 'required|tweet',
    emergency_city: 'required|tweet',
  };
  const {signOut} = useContext(AuthContext);
  const navigation = useNavigation();
  const [userForm, setUserForm] = useState({});
  const [firstTime, setFirstTime] = useState(true);
  const [formValues, handleFormValueChange, setFormValues] =
    useFormData(userForm);
  const [isLoading, setIsLoading] = useState(false);
  const [formRules, isValidForm, isValidInput] = useFormValidate(
    rules,
    formValues,
  );

  useEffect(() => {
    let isMounted = true;
    const setUserFromLocal = async () => {
      try {
        let user = await getLocalUser();

        if (user) {
          setUserForm(user.userData);
          setFormValues(user.userData);
        }
      } catch (error) {
        throw new Error(
          `Error getting user from local EmergencyForm ${JSON.stringify(
            error,
          )}`,
        );
      }
    };

    if (isMounted) {
      setUserFromLocal();
    }
    return () => {
      isMounted = false;
    };
  }, [setFormValues]);

  const sendUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await axios.put('/user/update/emergency', formValues).then(() => {
        Alert.alert(
          'Actualización',
          '¡Se han actualizado los datos de emergencia correctamente!',
          [
            {
              text: 'Gracias',
            },
          ],
          {cancelable: false},
        );
        navigation.navigate('Dashboard', {refresh: true});
      });
    } catch (e) {
      if (e.response.status === 401 || e.response.status === 403) {
        Alert.alert(
          'No permitido',
          'Su sesión ha expirado, por favor ingrese de nuevo.',
          [
            {
              text: 'Gracias',
            },
          ],
          {cancelable: false},
        );

        await AsyncStorage.removeItem('userToken');
        signOut();
      }
      throw new Error(
        `Error on EmergencyForm setIsLoading catch 2 ${
          (JSON.stringify(e), e.message)
        }`,
      );
    }
    setIsLoading(false);
  };

  const onClickFormButton = () => {
    try {
      setFirstTime(false);
      if (isValidForm()) {
        sendUpdateProfile();
      }
    } catch (error) {
      throw new Error(
        `Error on onClickFormButton EmergencyForm ${
          (JSON.stringify(error), error.message)
        }`,
      );
    }
  };

  const refAddress = useRef();
  const refEmail = useRef();
  const refPhone = useRef();
  const refCity = useRef();

  return (
    <>
      <View style={styles.ctnForm}>
        <FormField
          formKey="emergency_name"
          label="Nombre completo:"
          maxLength={80}
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('emergency_name')}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refEmail.current.focus();
          }}
          value={formValues.emergency_name}
        />
        <FormField
          formKey="emergency_email"
          label="Correo Electrónico:"
          maxLength={80}
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('emergency_email')}
          ref={refEmail}
          textInputProps={{
            autoCapitalize: 'none',
            keyboardType: 'email-address',
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refPhone.current.focus();
          }}
          value={formValues.emergency_email}
        />
        <FormField
          formKey="emergency_phone"
          maxLength={80}
          label="Móvil:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('emergency_phone')}
          ref={refPhone}
          textInputProps={{
            keyboardType: 'phone-pad',
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refAddress.current.focus();
          }}
          value={formValues.emergency_phone}
        />
        <FormField
          formKey="emergency_address"
          maxLength={80}
          label="Dirección:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('emergency_address')}
          ref={refAddress}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refCity.current.focus();
          }}
          value={formValues.emergency_address}
        />
        <FormField
          formKey="emergency_city"
          maxLength={80}
          label="Ciudad:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('emergency_city')}
          ref={refCity}
          textInputProps={{
            returnKeyType: 'go',
          }}
          value={formValues.emergency_city}
          onSubmitEditing={onClickFormButton}
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
        <Button
          text="Guardar"
          variant="secondary"
          onPress={onClickFormButton}
          customStyle={styles.btnPayment}
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
  ctnButton: {
    alignItems: 'center',
  },
  btnPayment: {
    width: 150,
  },
  loading: {
    marginBottom: 16,
  },
});

export default EmergencyForm;
