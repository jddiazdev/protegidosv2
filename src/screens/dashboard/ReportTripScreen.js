import React, {useState, useEffect, useContext} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Colors from '../../styles/Colors';
import ReportTripForm from '../../components/dashboard/ReportTripForm';
import Title from '../../components/titles/Title';
import BackButton from '../../components/header/BackButton';
import axios from '../../network/axios';
import {AuthContext} from '../../context';

const ReportTripScreen = ({navigation}) => {
  const [currentTravel, setCurrentTravel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {signOut} = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;

    const getCurrentTravel = async () => {
      await AsyncStorage.removeItem('localTravel');
      let localTravel = await AsyncStorage.getItem('localTravel');
      if (!localTravel || !Object.keys(localTravel)) {
        try {
          await axios.get('/travel').then(async res => {
            if (Object.keys(res.data)) {
              const travel = res.data;
              await AsyncStorage.setItem('localTravel', JSON.stringify(travel));
              setCurrentTravel(travel);
            }
          });
        } catch (e) {
          if (e.response.status === 401 || e.response.status === 403) {
            Alert.alert(
              'Su sesión ha expirado, por favor ingrese de nuevo.',
              'No permitido',
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
            `Error on ReportTripForm line 57 ${(JSON.stringify(e), e.message)}`,
          );
        }
      } else if (localTravel.current) {
        setCurrentTravel(JSON.parse(localTravel));
      }
      setIsLoading(false);
    };

    if (isMounted) {
      getCurrentTravel();
    }

    return () => {
      isMounted = false;
    };
  });

  const onPressFinishTravel = async () => {
    setIsLoading(true);
    try {
      await axios.put('/travel').then(async () => {
        await AsyncStorage.removeItem('localTravel');
        setCurrentTravel(null);
        setIsLoading(false);
        Alert.alert(
          'Información:',
          'Se han finalizado tu viaje correctamente.',
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
        signOut();
      }
      setIsLoading(false);
    }
  };

  const hasTravel = () => {
    const travel = currentTravel && currentTravel.current ? true : false;

    return travel;
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.mainWrapper}>
        <KeyboardAwareScrollView>
          <BackButton />
          <Title text="Reportar Mi Viaje" />
          <Text style={styles.text}>
            Queremos siempre protegerte estes donde estes, recuerda ver las
            ciudades donde tenemos cobertura presencial o en el resto del país
            asesoría virtual.
          </Text>
          {isLoading ? (
            <View>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : !hasTravel() ? (
            <ReportTripForm navigation="navigation" />
          ) : (
            <>
              <View style={styles.ctnGif}>
                <Image
                  style={styles.gif}
                  source={require('../../assets/img/travel.jpg')}
                />
              </View>
              <View style={styles.ctnCurrentTravel}>
                <Text style={styles.ctTitle}>Tienes un viaje en curso</Text>
                <Text style={styles.ctValue}>
                  Ciudad destino: {currentTravel.city}
                </Text>
                <Text style={styles.ctValue}>
                  Nombre contacto: {currentTravel.contact_name}
                </Text>
                <Text style={styles.ctValue}>
                  Teléfono: {currentTravel.contact_phone}
                </Text>
                <Text style={styles.ctValue}>
                  Duración: {currentTravel.travel_duration}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onPressFinishTravel}
                style={styles.blueBtn}>
                <Text style={styles.textTerms}>Finalizar Viaje</Text>
              </TouchableOpacity>
            </>
          )}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  blueBtn: {
    backgroundColor: Colors.secondary,
    padding: 15,
    marginTop: 20,
  },
  textTerms: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  mainWrapper: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  text: {
    color: 'white',
    paddingHorizontal: 32,
    fontSize: 16,
    marginBottom: 32,
  },
  ctnCurrentTravel: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: 'white',
    marginHorizontal: 32,
  },
  ctTitle: {
    fontSize: 24,
    color: Colors.secondary,
    marginBottom: 16,
  },
  ctValue: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
  },
  btnFinishTavel: {
    marginHorizontal: 32,
    borderRadius: 0,
  },
  ctnGif: {
    paddingHorizontal: 32,
  },
  gif: {
    width: '100%',
    height: 150,
  },
});

export default ReportTripScreen;
