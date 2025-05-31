import React, {useState, useContext, useRef} from 'react';
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import FormField from '../forms/FormField';
import {useFormData} from '../../hooks/useFormData';
import {useFormValidate} from '../../hooks/useFormValidate';
import axios from '../../network/axios';
import {AuthContext} from '../../context';
import Colors from '../../styles/Colors';

const UpdateProfileForm = () => {
  const navigation = useNavigation();
  const [firstTime, setFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {signOut} = useContext(AuthContext);
  const [formValues, handleFormValueChange, setFormValues] = useFormData({
    city: '',
    reason: '',
    contact_name: '',
    contact_phone: '',
    travel_duration: '',
  });

  const [formRules, isValidForm, isValidInput] = useFormValidate(
    {
      city: 'required',
      reason: 'required',
      contact_name: 'required',
      contact_phone: 'required|phone',
      travel_duration: 'required',
    },
    formValues,
  );

  const sendReportTravel = async () => {
    setIsLoading(true);
    try {
      await axios
        .post('/travel', formValues)
        .then(async res => {
          const travel = {...formValues, id: res.data};
          await AsyncStorage.setItem('localTravel', JSON.stringify(travel));
          Alert.alert(
            'Viaje reportado',
            '¡Se han reportado tu viaje correctamente!',
            [
              {
                text: 'Gracias',
              },
            ],
            {cancelable: false},
          );
          navigation.navigate('Dashboard');
        })
        .catch(async e => {
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
            signOut();
          }
          throw new Error(
            `Error on ReportTripForm setIsLoading ${e.message}, ${e}`,
          );
        });
    } catch (e) {
      throw new Error(
        `Error on ReportTripForm setIsLoading line 75 ${e.message}, ${e}`,
      );
    }
    setIsLoading(false);
  };
  const onClickFormButton = () => {
    setFirstTime(false);
    if (isValidForm()) {
      sendReportTravel();
    }
  };

  const refCity = useRef();
  const refReason = useRef();
  const refContactName = useRef();
  const refContactPhone = useRef();
  const refTravelDuration = useRef();

  return (
    <>
      <View style={styles.ctnForm}>
        <FormField
          formKey="city"
          label="Ciudad destino:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('city')}
          ref={refCity}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refReason.current.focus();
          }}
          value={formValues.city}
        />
        <FormField
          formKey="reason"
          label="Motivo del viaje:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('reason')}
          ref={refReason}
          textInputProps={{
            multiline: true,
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refContactName.current.focus();
          }}
          value={formValues.reason}
        />
        <FormField
          formKey="contact_name"
          label="Nombre de contacto:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('contact_name')}
          ref={refContactName}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refContactPhone.current.focus();
          }}
          value={formValues.contact_name}
        />
        <FormField
          formKey="contact_phone"
          label="Teléfono de contacto:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('contact_phone')}
          ref={refContactPhone}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refTravelDuration.current.focus();
          }}
          value={formValues.contact_phone}
        />
        <FormField
          formKey="travel_duration"
          label="Duración del trayecto:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('travel_duration')}
          ref={refTravelDuration}
          textInputProps={{
            returnKeyType: 'go',
          }}
          onSubmitEditing={onClickFormButton}
          value={formValues.travel_duration}
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
        {!isLoading && (
          <TouchableOpacity onPress={onClickFormButton} style={styles.blueBtn}>
            <Text style={styles.textTerms}>REPORTAR</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  blueBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: 5,
    padding: 15,
    minWidth: 150,
    marginBottom: 20,
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
  textTerms: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default UpdateProfileForm;
