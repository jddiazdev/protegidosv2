import React, {useEffect, useState} from 'react';
import {
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  View,
  Image,
  Linking,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const ActionButtons = ({user, protInfo}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [sended, setSended] = useState(false);

  useEffect(() => {
    return () => {
      setIsLoading(false);
      setHasPermission(false);
      setSended(false);
    };
  }, []);

  const onPressCall = () => {
    const tel = protInfo.whatsapp;
    Linking.openURL(`tel:${tel}`);
  };
  const onPressWhatsapp = () => {
    setSended(false);
    let whatsappMsg = 'Necesito ayuda, team protegidos';

    sendWhatsAppMessage(whatsappMsg, protInfo.whatsapp);
  };

  const sendWhatsAppMessage = async (message, whatsappNumber) => {
    if (!whatsappNumber) {
      Alert.alert(
        'Error',
        'No se ha encontrado un número de WhatsApp válido.',
        [{text: 'OK'}],
        {cancelable: false},
      );
      return;
    }

    const formattedNumber = whatsappNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const appUrl = `whatsapp://send?phone=${formattedNumber}&text=${encodedMessage}`;

    try {
      await Linking.openURL(appUrl);
    } catch (error) {
      console.error('Error abriendo WhatsApp:', error);
      Alert.alert(
        'WhatsApp no está instalado',
        'Por favor instala WhatsApp para enviar mensajes desde la app.',
        [{text: 'OK'}],
      );
    }
  };

  const onPressMap = async () => {
    if (hasPermission) {
      getGeoLocation();
    } else {
      getPermission();
    }
  };

  const sendSosWhatsApp = data => {
    if (data.latitude && data.longitude) {
      const googleMapsUrl = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
      const message = `📍 Mira mi ubicación actual: ${googleMapsUrl}`;
      sendWhatsAppMessage(message, protInfo.whatsapp);
    } else {
      Alert.alert(
        'Actualización',
        'No hemos podido conseguir su ubicación, por favor intente de nuevo.',
        [
          {
            text: 'Re intentar',
            onPress: () => onPressMap(),
          },
        ],
        {cancelable: false},
      );
    }
  };

  const permissionsIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Fue imposible abrir las configuracions', '', [
          {text: 'Ok'},
        ]);
      });
    };

    const status = await Geolocation.requestAuthorization('whenInUse');
    if (status === 'granted') {
      return getGeoLocation();
    }
    if (status === 'disabled') {
      Alert.alert(
        `Encienda el servicio de ubucación para permitir a Protegidos determinar su ubucación.`,
        '',
        [
          {text: 'Abrir configuraciones', onPress: openSetting},
          {text: 'No usar mi ubcación', onPress: () => {}},
        ],
      );
    }
    if (status === 'denied') {
      setIsLoading(false);
      Alert.alert(
        'Actualización',
        'Se necesita permiso para acceder a la ubicación.',
        [
          {
            text: 'Re intentar',
            onPress: () => onPressMap(),
          },
          {
            text: 'Cancelar',
          },
        ],
        {cancelable: false},
      );
    }
  };

  const getPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await permissionsIOS();
      if (hasPermission) {
        setHasPermission(true);
        setSended(false);
        return getGeoLocation();
      }
    }

    if (Platform.OS === 'android') {
      if (Platform.Version < 23) {
        setHasPermission(true);
        setSended(false);
        return getGeoLocation();
      }

      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (hasPermission) {
        setHasPermission(true);
        setSended(false);
        return getGeoLocation();
      }

      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
        setSended(false);
        return getGeoLocation();
      }

      if (status === PermissionsAndroid.RESULTS.DENIED) {
        ToastAndroid.show(
          'Location permission denied by user.',
          ToastAndroid.LONG,
        );
      } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        ToastAndroid.show(
          'Location permission revoked by user.',
          ToastAndroid.LONG,
        );
      }
    }
  };

  const getGeoLocation = () => {
    setIsLoading(true);
    let data = {
      latitude: null,
      longitude: null,
      document: null,
    };

    Geolocation.getCurrentPosition(
      location => {
        try {
          data.latitude = location.coords.latitude;
          data.longitude = location.coords.longitude;
          data.document = user.userData.document;
          sendSosWhatsApp(data);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          throw new Error(
            `Error on AdctionButtons onPressMap ${
              (JSON.stringify(error), error.message)
            }`,
          );
        }
      },
      error => {
        setIsLoading(false);
        throw new Error(
          `Error on AdctionButtons onPressMap ${
            (JSON.stringify(error), error.message)
          }`,
        );
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };

  return (
    <>
      <View style={styles.ctnButtons}>
        <TouchableOpacity
          onPress={() => {
            onPressCall();
          }}>
          <Image
            style={styles.actionButton}
            source={require('../../assets/img/phone.png')}
          />
          <Text style={styles.textActionButton}>Necesitas {'\n'}ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPressWhatsapp();
          }}>
          <Image
            style={styles.actionButton}
            source={require('../../assets/img/whatsapp.png')}
          />
          <Text style={styles.textActionButton}>
            Necesitas una{'\n'}consulta
          </Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            onPress={() => {
              onPressMap();
            }}>
            <Image
              style={styles.actionButton}
              source={require('../../assets/img/location.png')}
            />
            <Text style={styles.textActionButton}>Mi{'\n'}ubicación</Text>
          </TouchableOpacity>
          {isLoading && (
            <View style={styles.loadingMapButtonWrapper}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  ctnButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  actionButton: {
    width: 90,
    height: 90,
    marginHorizontal: 12,
  },
  actionButtonDisabled: {
    width: 90,
    height: 90,
    marginHorizontal: 12,
    opacity: 0.2,
  },
  textActionButton: {
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
  },
  textActionButtonDisabled: {
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingMapButtonWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: 32,
    backgroundColor: 'rgba(0,5,77,0.7)',
  },
  disabled: {
    opacity: 0.1,
    backgroundColor: 'red',
  },
});

export default ActionButtons;
