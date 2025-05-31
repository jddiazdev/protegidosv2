import React, {useState, useContext} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

import axios from '../../network/axios';
import Colors from '../../styles/Colors';
import Title from '../../components/titles/Title';
import FileInput from '../../components/forms/FileInput';
import BackButton from '../../components/header/BackButton';
import Footer from '../../components/footer/Footer';
import {createFormData} from '../../utils/index';
import translations from '../../translations';
import {AuthContext} from '../../context';

const UploadDocumentsScreen = ({route, navigation}) => {
  const {user} = route.params;
  const {userData} = user;
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoType, setPhotoType] = useState('');

  const {signOut} = useContext(AuthContext);
  const [documents, setDocuments] = useState({
    user_cedula: userData.document_picture,
    user_tarj_propiedad: user.userData.user_tarj_propiedad,
    user_soat: user.userData.soat_picture,
  });

  // const pickImage = async type => {
  //   setIsLoading(true);
  //   try {
  //     const result = await launchImageLibrary({
  //       mediaType: 'photo',
  //       quality: 0.4,
  //     });
  //     setIsLoading(false);

  //     if (!result.cancelled && !result.errorCode && result.assets) {
  //       return uploadImage(result.assets[0], type);
  //     }
  //   } catch (error) {
  //     const message = translations[error.message];
  //     setIsLoading(false);
  //     if (message) {
  //       Alert.alert(
  //         'Error',
  //         message,
  //         [
  //           {
  //             text: 'Ok',
  //           },
  //         ],
  //         {cancelable: false},
  //       );
  //     }
  //   }
  // };

  const pickImage = async method => {
    setIsLoading(true);
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
      setIsLoading(false);

      if (!result.didCancel && !result.errorCode && result.assets?.length) {
        const photoUri = result.assets[0].uri;

        if (photoType === 'document_picture') {
          setDocuments({
            ...documents,
            user_cedula: photoUri,
          });
          uploadImage(result.assets[0], 'document_picture');
        }

        if (photoType === 'user_tarj_propiedad') {
          setDocuments({
            ...documents,
            user_tarj_propiedad: photoUri,
          });
          uploadImage(result.assets[0], 'user_tarj_propiedad');
        }

        if (photoType === 'soat_picture') {
          setDocuments({
            ...documents,
            user_soat: photoUri,
          });
          uploadImage(result.assets[0], 'soat_picture');
        }
      } else if (result.errorCode) {
        throw new Error(result.errorCode);
      }
    } catch (error) {
      const message =
        translations[error.message] || 'Ocurrió un error inesperado.';
      Alert.alert('Error', message, [{text: 'Ok'}], {cancelable: false});

      setIsLoading(false);
      throw new Error(`Error en pickImage: ${error}`);
    }
  };

  const uploadImage = async (image, type) => {
    setIsLoading(true);
    const formData = createFormData(image, {}, type, user);

    try {
      axios
        .post(`/user/upload/picture/${type}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          Alert.alert(
            'Actualización',
            '¡Se actualizó el documento correctamente!',
            [
              {
                text: 'Gracias',
              },
            ],
            {cancelable: false},
          );
          setIsLoading(false);
        });
    } catch (error) {
      Alert.alert(
        'Actualización',
        '¡Ha habido un problema al actualizar, intenta mas tarde!',
        [
          {
            text: 'Ok',
          },
        ],
        {cancelable: false},
      );
      signOut();
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.mainWrapper}>
        <BackButton />
        <Title text="Subir Documentos" />
        <View style={styles.ctnFileInputs}>
          <FileInput
            label="Subir Cédula"
            onPress={() => {
              setPhotoType('document_picture');
              setModalVisible(true);
            }}
            value={documents.user_cedula}
          />
          <FileInput
            label="Subir Tarjeta de propiedad"
            onPress={() => {
              setModalVisible(true);
              setPhotoType('user_tarj_propiedad');
            }}
            value={documents.user_tarj_propiedad}
          />
          <FileInput
            label="Subir SOAT"
            onPress={() => {
              setPhotoType('soat_picture');
              setModalVisible(true);
            }}
            value={documents.user_soat}
          />
        </View>
        <View style={styles.ctnFooter}>
          <Footer />
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
              <Text style={styles.modalTitle}>Subir Documento</Text>
              <View>
                <TouchableOpacity
                  style={styles.btnModal}
                  onPress={() => pickImage('camera', 'document_picture')}>
                  <Text style={styles.textStyle}>Tomar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnModal}
                  onPress={() => pickImage('library', 'document_picture')}>
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
      </SafeAreaView>
      {isLoading && (
        <View style={styles.wrapperLoading}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.textLoading}>Subiendo Documento</Text>
          <Image
            style={styles.logo}
            source={require('../../assets/img/logo.png')}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  ctnFooter: {
    paddingTop: 32,
    position: 'absolute',
    bottom: 32,
    width: '100%',
  },
  ctnFileInputs: {
    paddingHorizontal: 50,
    marginTop: 60,
  },
  wrapperLoading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,6,77, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLoading: {
    color: 'white',
    marginTop: 8,
  },
  logo: {
    width: '100%',
    height: 70,
    aspectRatio: 191 / 171,
    marginTop: 32,
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

export default UploadDocumentsScreen;
