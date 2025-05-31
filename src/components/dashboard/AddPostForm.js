import React, {useState, useRef, useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Text,
  Modal,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import Colors from '../../styles/Colors';
import FormField from '../forms/FormField';
import {useFormData} from '../../hooks/useFormData';
import {useFormValidate} from '../../hooks/useFormValidate';
import Button from '../buttons/Button';
import {createFormData, getLocalUser} from '../../utils/index';
import axios from '../../network/axios';

const AddPostForm = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const [firstTime, setFirstTime] = useState(true);
  const [formValues, handleFormValueChange, setFormValues] = useFormData({
    name: user ? user.userData.name + ' ' + user.userData.last_name : '',
    phone: user && user.userData ? user.userData.phone : '',
    title: '',
    excerpt: '',
    content: '',
    category: null,
    image_id: null,
  });
  const [modalVisible, setModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [formRules, isValidForm, isValidInput] = useFormValidate(
    {
      name: 'required',
      phone: 'required',
      excerpt: 'required|excerpt',
      title: 'required|excerpt',
      content: 'requiredItweet',
      category: 'required',
      image_id: 'required',
    },
    formValues,
  );

  const [categories, setCategories] = useState([]);
  const getCategories = () => {
    return categories.map(cat => {
      return <Picker.Item label={cat.title} value={cat.id} key={cat.id} />;
    });
  };

  const localUser = async () => {
    let localUserItem = await getLocalUser();
    setUser(localUserItem);
    return [
      `${localUserItem.userData.name} ${localUserItem.userData.lastname}`,
      `${localUserItem.userData.phone}`,
      `${localUserItem.userData.document}`,
    ];
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const currentUser = await localUser();
      setFormValues({
        ...formValues,
        ['name']: currentUser[0],
        ['phone']: currentUser[1],
      });
      try {
        let resCategories = await axios.get('/advert/categories');
        setCategories(resCategories.data);
      } catch (error) {
        throw new Error(
          `Error on AddPostForm fetchCategories ${
            (JSON.stringify(error), error.message)
          }`,
        );
      }
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  const sendAddForm = async () => {
    setIsLoading(true);
    const data = createFormData(
      currentImage,
      {
        title: formValues.title,
        excerpt: formValues.excerpt,
        description: formValues.content,
        category_id: formValues.category,
      },
      'ad_picture',
      user,
    );

    await axios
      .post('/advert/create/ad', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        Alert.alert(
          'Actualización',
          '¡Se ha creado el clasificado correctamente! Por favor espera a que sea autorizado por un moderador.',
          [
            {
              text: 'Gracias',
            },
          ],
          {cancelable: false},
        );

        navigation.navigate('Dashboard', {refresh: true});
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
          await AsyncStorage.removeItem('userToken');
        }
        throw new Error(
          `Error on AddPostForm sendAddForm ${(JSON.stringify(e), e.message)}`,
        );
      });
    setIsLoading(false);
  };

  const validateCategory = () => {
    if (!formValues.category) {
      Alert.alert(
        'Categoría requerida',
        'Por favor seleccione una categoría',
        [
          {
            text: 'Aceptar',
          },
        ],
        {cancelable: false},
      );
      return false;
    }
    return true;
  };

  const onClickFormButton = () => {
    setFirstTime(false);
    validateCategory();
    if (isValidForm()) {
      sendAddForm();
    }
  };

  const refPhone = useRef();
  const refTitle = useRef();
  const refExcerpt = useRef();
  const refContent = useRef();

  const [currentImage, setCurrentImage] = useState(null);

  const pickImage = async method => {
    let result = {};

    try {
      if (method === 'library') {
        result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.4,
          saveToPhotos: true,
        });
      } else if (method === 'camera') {
        result = await launchCamera({
          mediaType: 'photo',
          quality: 0.4,
          saveToPhotos: true,
        });
      }

      setModalVisible(false);
      if (!result.cancelled && !result.errorCode && result.assets) {
        setCurrentImage(result.assets[0]);
      }
    } catch (error) {
      const message = 'Ocurrió un error inesperado.';
      Alert.alert('Error', message, [{text: 'Ok'}], {cancelable: false});

      setIsLoading(false);
      throw new Error(`Error en pickImage: ${error}`);
    }
  };

  const getImage = () => {
    if (currentImage) {
      return {uri: currentImage.uri};
    }
  };

  return (
    <>
      <View style={styles.ctnForm}>
        <View>
          <Picker
            style={styles.labelSelect}
            selectedValue={formValues.category}
            dropdownIconColor={Colors.white}
            itemStyle={styles.pickItem}
            onValueChange={value => {
              setFormValues({
                ...formValues,
                ['category']: value,
              });
            }}>
            <Picker.Item label="Seleccionar categoría" value="" key="0" />
            {getCategories()}
          </Picker>
        </View>
        {formValues.category && (
          <View style={styles.postImage}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={styles.btnImage}>
              <Image
                style={styles.iconPicture}
                source={require('../../assets/img/update_image.png')}
              />
              <ImageBackground source={getImage()} style={styles.bg} />
            </TouchableOpacity>
          </View>
        )}
        {formValues.category && currentImage && (
          <>
            <FormField
              formKey="name"
              editable="false"
              label="Nombre de contacto:"
              placeholder=""
              handleFormValueChange={handleFormValueChange}
              isValid={firstTime ? true : isValidInput('name')}
              textInputProps={{
                returnKeyType: 'next',
              }}
              onSubmitEditing={() => {
                refPhone.current.focus();
              }}
              value={formValues.name}
            />
            <FormField
              formKey="phone"
              label="Teléfono de contacto:"
              placeholder=""
              editable="false"
              ref={refPhone}
              handleFormValueChange={handleFormValueChange}
              isValid={firstTime ? true : isValidInput('phone')}
              textInputProps={{
                returnKeyType: 'next',
              }}
              onSubmitEditing={() => {
                refTitle.current.focus();
              }}
              value={formValues.phone}
            />
            <FormField
              formKey="title"
              label="Título del clasificado:"
              placeholder=""
              ref={refTitle}
              maxLength={50}
              handleFormValueChange={handleFormValueChange}
              isValid={firstTime ? true : isValidInput('title')}
              textInputProps={{
                returnKeyType: 'next',
              }}
              onSubmitEditing={() => {
                refExcerpt.current.focus();
              }}
              value={formValues.title}
            />
            <FormField
              formKey="excerpt"
              label="Descripción corta:"
              placeholder=""
              ref={refExcerpt}
              maxLength={50}
              handleFormValueChange={handleFormValueChange}
              isValid={firstTime ? true : isValidInput('excerpt')}
              textInputProps={{
                returnKeyType: 'next',
              }}
              onSubmitEditing={() => {
                refContent.current.focus();
              }}
              value={formValues.excerpt}
            />
            <FormField
              formKey="content"
              label="Contenido del clasificado:"
              placeholder=""
              handleFormValueChange={handleFormValueChange}
              isValid={firstTime ? true : isValidInput('content')}
              maxLength={220}
              ref={refContent}
              textInputProps={{
                returnKeyType: 'go',
                multiline: true,
              }}
              onSubmitEditing={() => {
                onClickFormButton();
              }}
              value={formValues.content}
            />
            {!isLoading && (
              <Button
                text="Crear clasificado"
                variant="secondary"
                onPress={onClickFormButton}
                disabled={isLoading}
              />
            )}
          </>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={styles.centeredView}
          onPress={() => {
            setModalVisible(false);
          }}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Subir Foto</Text>
            <View>
              <TouchableOpacity
                style={styles.btnModal}
                onPress={() => pickImage('camera')}>
                <Text style={styles.textStyle}>Tomar Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnModal}
                onPress={() => pickImage('library')}>
                <Text style={styles.textStyle}>Seleccionar Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnModal, styles.btnCloseModal]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Salír</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.ctnButton}>
        {isLoading && (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="white"
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
  selectWrapper: {
    flex: 1,
    color: 'white',
    height: 60,
    borderWidth: 1,
    borderColor: 'white',
    padding: 12,
    marginBottom: 16,
  },
  labelSelect: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  postImage: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
    marginHorizontal: 4,
    borderColor: '#777',
    borderWidth: 2,
    marginBottom: 16,
  },
  pickItem: {
    color: Colors.white,
  },
  btnImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#cacaca',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPicture: {
    width: 60,
    height: 60,
  },
  bg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btnModal: {
    borderRadius: 4,
    padding: 10,
    paddingHorizontal: 32,
    elevation: 2,
    backgroundColor: Colors.primary,
    marginBottom: 8,
  },
  btnCloseModal: {
    backgroundColor: Colors.secondary,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    marginBottom: 22,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default AddPostForm;
