import React, {useState, useContext, useEffect} from 'react';
import {
  Alert,
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import Footer from '../../components/footer/Footer';
import NavButton from '../../components/nav/NavButton';
import DrawerMenu from '../../components/nav/DrawerMenu';
import UserData from '../../components/dashboard/UserData';
import ActionButtons from '../../components/dashboard/ActionButtons';
import translations from '../../translations';
import {createFormData, getLocalUser, isPremiumUser} from '../../utils/index';
import Colors from '../../styles/Colors';
import axios from '../../network/axios';
import {AuthContext} from '../../context';
const profileDefaultPicture = require('../../assets/img/user_placeholder.jpg');
const vehicleDefaultPicture = require('../../assets/img/moto.jpg');

const DashboardScreen = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [refresh, setRefresh] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const {signOut} = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoType, setPhotoType] = useState('user_picture');
  const [prote, setProte] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(profileDefaultPicture);
  const [vehiclePhoto, setVehiclePhoto] = useState(vehicleDefaultPicture);
  const [isLoadingImage, setIsLoadingImage] = useState({
    user_picture: false,
    user_vehicle_photo: false,
  });
  const onPressNavButton = () => {
    setShowMenu(true);
  };
  if (route?.params && route?.params?.refresh) {
    route.params.refresh = null;
    setRefresh(new Date());
  }

  const setImage = localUser => {
    if (localUser && localUser.userData && localUser.userData.picture) {
      setProfilePhoto({uri: localUser.userData.picture});
    }
    if (localUser && localUser.userVehicle && localUser.userVehicle.picture) {
      setVehiclePhoto({uri: localUser.userVehicle.picture});
    }
  };

  useEffect(() => {
    const getProfileData = async () => {
      const travel = await AsyncStorage.getItem('localTravel');
      const recovery = await AsyncStorage.getItem('hasRequestChanges');

      if (recovery) {
        await AsyncStorage.removeItem('hasRequestChanges');
      }

      if (!travel) {
        await AsyncStorage.setItem('localTravel', JSON.stringify({}));
      }
      try {
        getProfileFromServer();
      } catch (error) {
        throw new Error(`Error on DashboardScreen getProfileData 2 ${error}`);
      }
    };
    getProfileData();
  }, [refresh]);

  const getProfileFromServer = async () => {
    await AsyncStorage.removeItem('localUser');
    const protInfo = await AsyncStorage.getItem('protInfo');

    try {
      let localUser = await axios.get('/user/profile');
      await AsyncStorage.setItem(
        'localUser',
        JSON.stringify(localUser.data[0]),
      );
      localUser = await getLocalUser();

      if (!localUser.email) {
        signOut();
      }

      setProte(JSON.parse(protInfo));
      setUser(localUser);
      setImage(localUser);
      setIsLoading(false);
    } catch (e) {
      signOut();
      throw new Error(`Error on DashboardScreen getProfileData ${e}`);
    }
  };

  const uploadImage = async (image, type) => {
    const formData = createFormData(image, {}, type, user);

    try {
      await axios
        .post(`/user/upload/picture/${type}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(async () => {
          await AsyncStorage.removeItem('localUser');
          if (type === 'user_vehicle') {
            setIsLoadingImage({...isLoadingImage, user_vehicle_photo: false});
          }
          if (type === 'user_picture') {
            setIsLoadingImage({...isLoadingImage, user_picture: false});
          }

          Alert.alert(
            'Actualización',
            '¡Se actualizó la foto correctamente!',
            [
              {
                text: 'Gracias',
              },
            ],
            {cancelable: false},
          );
          setRefresh(new Date());
          setIsLoading(false);
        });
    } catch (e) {
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
      setIsLoadingImage({
        ...isLoadingImage,
        user_vehicle_photo: false,
        user_picture: false,
      });
      setIsLoading(false);
      throw new Error(`Error on DashboardScreen uploadImage ${e}`);
    }
  };

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
      }
      if (method === 'camera') {
        result = await launchCamera({
          mediaType: 'photo',
          quality: 0.4,
          saveToPhotos: true,
        });
      }
      setModalVisible(false);
      setIsLoading(false);
      if (!result.cancelled && !result.errorCode && result.assets) {
        if (photoType === 'user_vehicle') {
          setIsLoadingImage({...isLoadingImage, user_vehicle_photo: true});
          setVehiclePhoto({uri: result.assets[0].uri});
        }
        if (photoType === 'user_picture') {
          setIsLoadingImage({...isLoadingImage, user_picture: true});
          setProfilePhoto({uri: result.assets[0].uri});
        }
        uploadImage(result.assets[0], photoType);
      } else if (result.errorCode) {
        throw new Error(result.errorCode);
      }
    } catch (error) {
      const message = translations[error.message];
      Alert.alert(
        'Error',
        message,
        [
          {
            text: 'Ok',
          },
        ],
        {cancelable: false},
      );
      setIsLoadingImage({
        ...isLoadingImage,
        user_vehicle_photo: false,
        user_picture: false,
      });
      setIsLoading(false);
      throw new Error(`Error on DashboardScreen pickImage ${error}`);
    }
  };

  const isLawyer = () => !!user.lawyer;

  const reloadUser = async () => {
    await AsyncStorage.removeItem('localUser');
    await AsyncStorage.removeItem('protInfo');
    setIsLoading(true);
    getProfileFromServer();
    setRefresh(new Date());
  };

  const showUpdatePictureModal = type => {
    setModalVisible(true);
    setPhotoType(type);
  };

  const dashView = () => (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.mainWrapper}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          {isLoading ? (
            <View style={styles.wrapperLoading}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.textLoading}>Cargando...</Text>
              <Image
                style={styles.logo}
                source={require('../../assets/img/logo.png')}
              />
            </View>
          ) : (
            <>
              <View style={styles.ctnProfileHeader}>
                <View style={styles.ctnProfileName}>
                  <Text style={styles.profileName}>
                    {user.userData && user.userData.name}
                  </Text>
                  <Text style={styles.profileName}>
                    {user.userData && user.userData.lastname}
                  </Text>
                </View>
                <Text style={styles.profileCity}>
                  {user.userData && user.userData.city}
                </Text>
              </View>
              {!isLawyer() &&
                !isPremiumUser(user) && (
                  <TouchableOpacity
                    style={styles.btnPlans}
                    onPress={() => {
                      navigation.navigate('Plans', {user});
                    }}>
                    <Text style={styles.textBtnPlans}>Comprar Plan</Text>
                  </TouchableOpacity>
                )}
              <View style={styles.ctnNavButton}>
                {!isLawyer() && <NavButton onPress={onPressNavButton} />}
              </View>
              <View style={styles.ctnReloadButton}>
                {!isLawyer() && (
                  <TouchableOpacity onPress={() => reloadUser()}>
                    <Image
                      style={styles.iconReload}
                      source={require('../../assets/img/reload.jpg')}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {isLawyer() && (
                <View style={styles.btnLogoutLawyer}>
                  <Button
                    title="Salir"
                    color={Colors.secondary}
                    onPress={() => {
                      signOut();
                    }}
                  />
                </View>
              )}
              <View style={styles.ctnProfileImages}>
                <View style={styles.profileImage}>
                  <TouchableOpacity
                    onPress={() => showUpdatePictureModal('user_picture')}
                    style={styles.btnPicture}>
                    <Image
                      style={styles.iconPicture}
                      source={require('../../assets/img/update_image.png')}
                    />
                  </TouchableOpacity>
                  <ImageBackground source={profilePhoto} style={styles.bg} />
                  {isLoadingImage.user_picture && (
                    <View style={styles.overlayImage}>
                      <ActivityIndicator size="large" color="white" />
                    </View>
                  )}
                </View>
                {!isLawyer() && (
                  <>
                    <View style={styles.profileImage}>
                      <TouchableOpacity
                        onPress={() => {
                          showUpdatePictureModal('user_vehicle');
                        }}
                        style={styles.btnPicture}>
                        <Image
                          style={styles.iconPicture}
                          source={require('../../assets/img/update_image.png')}
                        />
                      </TouchableOpacity>
                      <ImageBackground
                        source={vehiclePhoto}
                        style={styles.bg}
                      />
                      {isLoadingImage.user_vehicle_photo && (
                        <View style={styles.overlayImage}>
                          <ActivityIndicator size="large" color="white" />
                        </View>
                      )}
                    </View>
                  </>
                )}
              </View>

              {!isLawyer() && <UserData user={user} />}
            </>
          )}
          <ActionButtons user={user} protInfo={prote} />
          {isLawyer() && (
            <>
              <Text style={styles.textLawyer}>
                Abogado penalista {'\n'} suscrito a protegidos.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('RegisterCase');
                }}
                style={styles.ctnButtonCase}>
                <Image
                  style={styles.imageButtonCase}
                  source={require('../../assets/img/planilla.png')}
                />
                <Text style={styles.textButtonCase}>Reportar Caso</Text>
              </TouchableOpacity>
            </>
          )}
          <Footer withLogo={true} />
        </ScrollView>

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
              <Text style={styles.modalTitle}>
                Actualizar
                {photoType === 'user_picture' && ' Foto de perfil'}
                {photoType === 'user_vehicle' && ' Foto del vehiculo'}
              </Text>
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
      </SafeAreaView>
      <DrawerMenu
        user={user}
        showMenu={showMenu}
        onPressWrapper={() => {
          setShowMenu(false);
        }}
      />
    </>
  );

  return dashView();
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  ctnLoading: {
    paddingVertical: 100,
  },
  ctnNavButton: {
    position: 'absolute',
    left: 16,
    top: 32,
  },
  ctnReloadButton: {
    position: 'absolute',
    right: 16,
    top: 32,
  },
  iconReload: {
    width: 25,
    height: 25,
  },
  ctnProfileHeader: {
    paddingTop: 32,
    paddingBottom: 8,
    alignItems: 'center',
  },
  ctnProfileName: {
    borderBottomWidth: 1,
    borderBottomColor: '#AAA',
    paddingBottom: 8,
    marginBottom: 8,
  },
  profileName: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  profileCity: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  ctnProfileImages: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  profileImage: {
    height: 200,
    width: 130,
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 4,
    borderColor: '#777',
    borderWidth: 2,
  },
  bg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },

  btnPicture: {
    position: 'absolute',
    right: 8,
    top: 4,
    zIndex: 99,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 5,
  },
  iconPicture: {
    width: 30,
    height: 30,
  },
  textLawyer: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  ctnButtonCase: {
    alignItems: 'center',
    marginBottom: 40,
  },
  imageButtonCase: {
    width: '100%',
    height: 150,
    aspectRatio: 51 / 76,
  },
  textButtonCase: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 16,
  },
  btnLogoutLawyer: {
    position: 'absolute',
    top: 24,
    left: 16,
  },
  overlayImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 6, 77, 0.9)',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPlans: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 70,
    borderRadius: 50,
  },
  textBtnPlans: {
    color: '#222',
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1.3,
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
  textLoading: {
    color: 'white',
    marginTop: 8,
  },
  logo: {
    width: '100%',
    height: 150,
    aspectRatio: 191 / 171,
    marginTop: 32,
  },
  wrapperLoading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,6,77, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});

export default DashboardScreen;
