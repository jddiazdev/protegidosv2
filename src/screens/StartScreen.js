import React, {useEffect} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  ImageBackground,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {differenceInDays, parseISO} from 'date-fns';

import Colors from '../styles/Colors';
import Button from '../components/buttons/Button';
import axios from '../network/axios';

const StartScreen = ({navigation}) => {
  const image = require('../assets/img/bg.png');
  useEffect(() => {
    let isMounted = true;

    const getProtData = async () => {
      const protInfo = await AsyncStorage.getItem('protInfo');
      const recovery = await AsyncStorage.getItem('hasRequestChanges');
      const now = new Date();
      let nowDate = await AsyncStorage.getItem('nowDate');

      if (recovery) {
        await AsyncStorage.removeItem('hasRequestChanges');
      }

      if (nowDate) {
        try {
          const parsedDate = parseISO(JSON.parse(nowDate));
          const days = differenceInDays(now, parsedDate);
          if (days > 1) {
            nowDate = null;
          }
        } catch {
          nowDate = null;
        }
      }

      if (!protInfo || !nowDate) {
        delete axios.defaults.headers.common.Authorization;

        try {
          const res = await axios.get('/company');
          await AsyncStorage.setItem('protInfo', JSON.stringify(res.data));
          await AsyncStorage.setItem(
            'nowDate',
            JSON.stringify(now.toISOString()),
          );
        } catch (e) {
          const fallback = [{whatsapp: '+573234340400', meta: '6023234340400'}];
          await AsyncStorage.setItem('protInfo', JSON.stringify(fallback));
        }
      }
    };

    if (isMounted) {
      getProtData();
    }
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.mainWrapper}>
        <ImageBackground source={image} style={styles.image}>
          <Text style={styles.text}>Con nosotros siempre estan….</Text>
          <View style={styles.ctn}>
            <View style={styles.ctnLogo}>
              <Image
                style={styles.logo}
                source={require('../assets/img/logo.png')}
              />
            </View>
            <Button
              text="Iniciar Sesión"
              variant="secondary"
              customStyle={styles.btn}
              onPress={() => {
                navigation.navigate('Login');
              }}
            />
            <Button
              text="Registrarse"
              customStyle={styles.btn}
              onPress={() => {
                navigation.navigate('Register');
              }}
            />
            <Button
              text="Conocenos"
              variant="white"
              customStyle={styles.btn}
              onPress={() => {
                navigation.navigate('Slider');
              }}
            />
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: 'flex-end',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  text: {
    color: 'white',
    fontSize: 14,
    position: 'absolute',
    top: 60,
    left: 16,
  },
  ctnLogo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ctn: {
    width: '60%',
    marginBottom: '40%',
    position: 'relative',
    paddingHorizontal: 16,
  },
  logo: {
    width: '100%',
    height: 160,
    aspectRatio: 191 / 171,
  },
  btn: {
    marginBottom: 8,
  },
});

export default StartScreen;
