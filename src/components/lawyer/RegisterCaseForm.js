import React, {useState, useRef} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  Switch,
  View,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../../styles/Colors';
import FormField from '../forms/FormField';
import {useFormData} from '../../hooks/useFormData';
import {useFormValidate} from '../../hooks/useFormValidate';
import Button from '../buttons/Button';
import axios from '../../network/axios';

const RegisterForm = () => {
  const navigation = useNavigation();
  const [firstTime, setFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [assistancePlaceholder, setAssistancePlaceholder] =
    useState('Seleccionar');
  const [formValues, handleFormValueChange, setFormValues] = useFormData({
    protegido_name: '',
    protegido_plate: '',
    protegido_document: '',
    third_person_name: '',
    third_person_cedula: '',
    third_person_address: '',
    third_person_email: '',
    third_person_mobile: '',
    third_person_insurance: '',
    arrangment: false,
    arrangment_quantity: '',
    withness_data: '',
    case_description: '',
    transit_agent: false,
    transit_case_number: '',
    ipat: '',
    agent_name: '',
    assistance: '',
  });

  const [formRules, isValidForm, isValidInput] = useFormValidate(
    {
      protegido_name: 'required|tweet',
      protegido_plate: 'required|tweet',
      protegido_document: 'required|excerp',
      case_description: 'required|text',
      assistance: 'required',
    },
    formValues,
  );

  const sendRegisterCaseForm = async () => {
    setIsLoading(true);
    try {
      await axios.post('/cases', formValues).then(() => {
        Alert.alert(
          'Registrado',
          'Se ha registrado el caso correctamente',
          [
            {
              text: 'Gracias',
            },
          ],
          {cancelable: false},
        );
        navigation.navigate('Dashboard');
      });
    } catch (e) {
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
        await AsyncStorage.removeItem('userToken');
      } else if (e.response.status === 422) {
        Alert.alert(
          'No permitido',
          'Por favor revise todos los campos, el documento debe coincidir con nuestro protegido',
          [
            {
              text: 'Gracias',
            },
          ],
          {cancelable: false},
        );
        await AsyncStorage.removeItem('userToken');
      } else {
        Alert.alert(
          'Error al guardar',
          e.response.data,
          [
            {
              text: 'Gracias',
            },
          ],
          {cancelable: false},
        );
      }
      throw new Error(
        `Error on RegisterCaseForm sendRegisterCaseForm line 137 ${e.message}, ${e}`,
      );
    }
    setIsLoading(false);
  };

  const onClickFormButton = () => {
    setFirstTime(false);
    if (isValidForm()) {
      sendRegisterCaseForm();
    } else {
      Alert.alert(
        'Error al guardar',
        'Hay un error en los datos del formulario, por favor revise todos los campos.',
        [
          {
            text: 'Gracias',
          },
        ],
        {cancelable: false},
      );
    }
  };

  const savingAssistance = async item => {
    await setFormValues({...formValues, assistance: item});
    setAssistancePlaceholder(item);
  };

  const refProtegidoName = useRef();
  const refProtegidoPlate = useRef();
  const refProtegidoCedula = useRef();
  const refThirdPersonsName = useRef();
  const refThirdPersonsCedula = useRef();
  const refThirdPersonsAddress = useRef();
  const refThirdPersonsEmail = useRef();
  const refThirdPersonsMobile = useRef();
  const refThirdPersonsInsurance = useRef();
  const refArrangmentQuantity = useRef();
  const refWithnessDdata = useRef();
  const refCaseDescription = useRef();
  const refTransitCaseNumber = useRef();
  const refIpat = useRef();
  const refAgentName = useRef();

  return (
    <>
      <View style={styles.ctnForm}>
        <FormField
          formKey="protegido_name"
          label="Nombre completo protegido:"
          placeholder=""
          maxLength={80}
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('protegido_name')}
          ref={refProtegidoName}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refProtegidoName.current.focus();
          }}
        />
        <FormField
          formKey="protegido_plate"
          label="Placa protegido:"
          placeholder=""
          maxLength={10}
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('protegido_plate')}
          ref={refProtegidoPlate}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refProtegidoCedula.current.focus();
          }}
        />
        <FormField
          formKey="protegido_document"
          label="Cédula protegido:"
          placeholder=""
          maxLength={30}
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('protegido_document')}
          ref={refProtegidoCedula}
          textInputProps={{
            autoCapitalize: 'none',
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refThirdPersonsName.current.focus();
          }}
        />
        <Text style={styles.subtitle}>Datos del segundo conductor</Text>
        <FormField
          formKey="third_person_name"
          label="Nombre completo conductor 2:"
          placeholder=""
          maxLength={80}
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('third_person_name')}
          ref={refThirdPersonsName}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refThirdPersonsCedula.current.focus();
          }}
        />
        <FormField
          formKey="third_person_cedula"
          label="Cédula conductor 2:"
          placeholder=""
          maxLength={30}
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('third_person_cedula')}
          ref={refThirdPersonsCedula}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refThirdPersonsAddress.current.focus();
          }}
        />
        <FormField
          formKey="third_person_address"
          label="Dirección conductor 2:"
          placeholder=""
          maxLength={80}
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('third_person_address')}
          ref={refThirdPersonsAddress}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refThirdPersonsEmail.current.focus();
          }}
        />
        <FormField
          formKey="third_person_email"
          label="Correo conductor 2:"
          placeholder=""
          maxLength={80}
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('third_person_email')}
          ref={refThirdPersonsEmail}
          textInputProps={{
            autoCapitalize: 'none',
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refThirdPersonsMobile.current.focus();
          }}
        />
        <FormField
          formKey="third_person_mobile"
          label="Celular conductor 2:"
          maxLength={30}
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('third_person_mobile')}
          ref={refThirdPersonsMobile}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refThirdPersonsInsurance.current.focus();
          }}
        />
        <FormField
          formKey="third_person_insurance"
          label="Aseguradora conductor 2:"
          placeholder=""
          maxLength={50}
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('third_person_insurance')}
          ref={refThirdPersonsInsurance}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refArrangmentQuantity.current.focus();
          }}
        />
        <Text style={styles.subtitle}>Datos de la conciliación</Text>
        <Text style={styles.labelRadios}>Conciliación en el sitio?</Text>
        <View style={styles.ctnRadio}>
          <Text style={styles.tagRadio}>No</Text>
          <Switch
            style={styles.switch}
            trackColor={{false: '#767577', true: '#0078D7'}}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setFormValues({
                ...formValues,
                arrangment: !formValues.arrangment,
              });
            }}
            value={formValues.arrangment}
          />
          <Text style={styles.tagRadio}>Si</Text>
        </View>
        <FormField
          formKey="arrangment_quantity"
          label="Cuantía de la conciliación:"
          placeholder=""
          maxLength={50}
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('arrangment_quantity')}
          ref={refArrangmentQuantity}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refWithnessDdata.current.focus();
          }}
        />
        <FormField
          formKey="withness_data"
          label="Datos de testigos:"
          maxLength={100}
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('withness_data')}
          ref={refWithnessDdata}
          textInputProps={{
            returnKeyType: 'next',
            multiline: true,
          }}
          onSubmitEditing={() => {
            refCaseDescription.current.focus();
          }}
        />
        <FormField
          formKey="case_description"
          label="Descripción de los hechos:"
          maxLength={200}
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('case_description')}
          ref={refCaseDescription}
          textInputProps={{
            returnKeyType: 'next',
            multiline: true,
          }}
          onSubmitEditing={() => {
            refTransitCaseNumber.current.focus();
          }}
        />
        <Text style={styles.subtitle}>Datos agente de transito</Text>
        <Text style={styles.labelRadios}>
          Presencia del Agente de Transito?
        </Text>
        <View style={styles.ctnRadio}>
          <Text style={styles.tagRadio}>No</Text>
          <Switch
            style={styles.switch}
            trackColor={{false: '#767577', true: '#0078D7'}}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setFormValues({
                ...formValues,
                transit_agent: !formValues.transit_agent,
              });
            }}
            value={formValues.transit_agent}
          />
          <Text style={styles.tagRadio}>Si</Text>
        </View>
        <FormField
          formKey="transit_case_number"
          label="Número de caso:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('transit_case_number')}
          ref={refTransitCaseNumber}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refIpat.current.focus();
          }}
        />
        <FormField
          formKey="ipat"
          label="Número de informe policial de accidente de transito (ipat):"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('ipat')}
          ref={refIpat}
          textInputProps={{
            returnKeyType: 'next',
          }}
        />
        <FormField
          formKey="agent_name"
          label="Nombre de agente de tránsito y placa:"
          placeholder=""
          handleFormValueChange={handleFormValueChange}
          isValid={firstTime ? true : isValidInput('agent_name')}
          ref={refAgentName}
          textInputProps={{
            returnKeyType: 'next',
          }}
          onSubmitEditing={() => {
            refThirdPersonsInsurance.current.focus();
          }}
        />

        <Text style={styles.labelRadios}>Tipo de asistencia brindada?</Text>
        <Picker
          style={styles.labelSelect}
          onValueChange={value => savingAssistance(value)}
          selectedValue={formValues.assistance}
          itemStyle={styles.pickItem}
          dropdownIconColor={Colors.white}
          mode="dialog">
          <Picker.Item label={assistancePlaceholder} value="" key="0" />
          <Picker.Item label="En el sitio" value="sitio" key="1" />
          <Picker.Item label="Teléfono" value="telefono" key="2" />
          <Picker.Item label="Virtual" value="virtual" key="3" />
        </Picker>
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
          <Button
            text="Registrar Caso"
            variant="secondary"
            onPress={onClickFormButton}
          />
        )}
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
    zIndex: -1,
    marginTop: 60,
  },
  subtitle: {
    color: Colors.secondary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  labelRadios: {
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
  },
  ctnRadio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tagRadio: {
    color: 'white',
  },
  switch: {
    marginHorizontal: 8,
  },
  loading: {
    marginBottom: 16,
  },
  labelSelect: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  pickItem: {
    color: Colors.white,
  },
});

export default RegisterForm;
