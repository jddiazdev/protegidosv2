import React, {useState, useContext, useRef} from 'react';
import {ActivityIndicator, StyleSheet, Text, View, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FormField from '../forms/FormField';
import DatePicker from '../forms/DatePicker';
import {useFormData} from '../../hooks/useFormData';
import {useFormValidate} from '../../hooks/useFormValidate';
import {AuthContext} from '../../context';
import Button from '../buttons/Button';
import axios from '../../network/axios';

const UpdateProfileForm = user => {
  const localUser = user.user;
  let userAux = {...localUser.userData, ...localUser.userVehicle};
  const [userForm, setUserForm] = useState(userAux);
  const {signOut} = useContext(AuthContext);

  const navigation = useNavigation();
  const [firstTime, setFirstTime] = useState(true);
  const [formValues, handleFormValueChange, setFormValues] =
    useFormData(userForm);
  const [isLoading, setIsLoading] = useState(false);
  const [formRules, isValidForm, isValidInput] = useFormValidate(
    {
      name: 'required',
      lastname: 'required',
      phone: 'required|phone',
      document: 'required',
      city: 'required',
    },
    formValues,
  );

  const sendUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await axios.put('/user/update', formValues).then(async () => {
        Alert.alert(
          'Actualización',
          '¡Se han actualizado los datos del usuario correctamente!',
          [
            {
              text: 'Gracias',
            },
          ],
          {cancelable: false},
        );

        await AsyncStorage.removeItem('localUser');
        navigation.navigate('Dashboard', {refresh: true});
      });
    } catch (e) {
      console.log('Error on UpdateProfileForm sendUpdateProfile', e);
      setIsLoading(false);
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
      }
      Alert.alert(
        'No permitido',
        'Ha ocurrido un error, favor intentar mas tarde',
        [
          {
            text: 'Gracias',
          },
        ],
        {cancelable: false},
      );
      throw new Error(
        `Error on UpdateProfileForm sendUpdateProfile catch 2 ${e.message}, ${e}`,
      );
    }
    setIsLoading(false);
  };
  const onClickFormButton = () => {
    setFirstTime(false);
    if (isValidForm()) {
      sendUpdateProfile();
    }
  };

  const onDeleteProfile = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Está a punto de eliminar su cuenta de nuestros registros, esto no se puede deshacer y es permanente.',
      [
        {
          text: 'Eliminar',
          onPress: () => deleteAccount(),
        },
        {text: 'Cancelar'},
      ],
      {cancelable: true},
    );
  };

  const deleteAccount = async () => {
    try {
      await axios
        .delete(`/user`)
        .then(async () => {
          signOut();
        })
        .catch(async e => {
          if (e.response.status === 401 || e.response.status === 403) {
            Alert.alert(
              'No permitido',
              'No se ha podido eliminar su cuenta en este momento, por favor intentelo de nuevo luego.',
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
            `Error on UpdateProfileForm deliting account ${
              (JSON.stringify(e), e.message)
            }`,
          );
        });
    } catch (e) {
      throw new Error(
        `Error on UpdateProfileForm deliting account ${e.message}, ${e}`,
      );
    }
  };

  const refLastname = useRef();
  const refPhone = useRef();
  const refDocument = useRef();
  const refCity = useRef();
  const refPlate = useRef();
  const refBirthday = useRef();
  const refDescription = useRef();
  const refrh = useRef();
  const refSoat = useRef();

  return (
    <>
      <View style={styles.ctnForm}>
        <FormField
          formKey="name"
          label="Nombres:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('name')}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refLastname.current.focus();
          }}
          value={formValues.name}
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
            refPhone.current.focus();
          }}
          value={formValues.lastname}
        />
        <FormField
          formKey="phone"
          label="Móvil:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('phone')}
          ref={refPhone}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refDocument.current.focus();
          }}
          value={formValues.phone}
        />
        <FormField
          formKey="document"
          label="Cédula:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('document')}
          ref={refDocument}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refCity.current.focus();
          }}
          value={formValues.document}
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
            refBirthday.current.focus();
          }}
          value={formValues.city}
        />

        <DatePicker
          formKey="birthday"
          label="Fecha de Nacimiento:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('birthdate')}
          ref={refBirthday}
          value={formValues.birthday}
        />
        <FormField
          formKey="description"
          label="Datos sobre tí:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('description')}
          ref={refDescription}
          textInputProps={{
            multiline: true,
            returnKeyType: 'next',
          }}
          value={formValues.description}
          onSubmitEditing={() => {
            refrh.current.focus();
          }}
        />
        <Text style={styles.subtitle}>Datos del vehículo</Text>
        <FormField
          formKey="plate"
          label="Placa:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('plate')}
          ref={refPlate}
          textInputProps={{
            returnKeyType: 'next',
          }}
          value={formValues.plate}
          onSubmitEditing={() => {
            refSoat.current.focus();
          }}
        />
        <DatePicker
          formKey="soat_expires"
          label="SOAT (fecha de vencimiento):"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('soat_expires')}
          ref={refSoat}
          value={formValues.soat_expires}
        />
        <Text style={styles.subtitle}>Datos medicos</Text>
        <FormField
          formKey="rh"
          label="Tipo de sangre (RH):"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('rh')}
          ref={refrh}
          textInputProps={{
            returnKeyType: 'next',
          }}
          value={formValues.rh}
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
          text="Guardar Cambios"
          variant="secondary"
          onPress={onClickFormButton}
          disabled={isLoading}
        />
      </View>
      <View style={styles.deleteBtn}>
        <Button
          text="Eliminar Cuenta"
          style={styles.deleteBtn}
          variant="btnText"
          onPress={onDeleteProfile}
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
  deleteBtn: {
    marginTop: 20,
  },
  ctnButton: {
    alignItems: 'center',
  },
  loading: {
    marginBottom: 16,
  },
  subtitle: {
    color: '#f1f1f1',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default UpdateProfileForm;
