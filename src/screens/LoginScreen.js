import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Footer from '../components/footer/Footer';
import Colors from '../styles/Colors';
import Style from '../styles/index';
import LoginForm from '../components/login/LoginForm';

const {width} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const onClickRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainWrapper}>
        <KeyboardAwareScrollView>
          <View style={styles.ctnLogo}>
            <Image
              style={styles.logo}
              source={require('../assets/img/logo.png')}
            />
          </View>

          <Text style={styles.subtitle}>
            Bienvenido Socio Inicia con tus datos
          </Text>
          <LoginForm />
          <View style={styles.ctnButton}>
            <TouchableOpacity
              style={[Style.btn, Style.btnWhite]}
              onPress={onClickRegister}>
              <Text style={[Style.btnText, Style.btnWhite]}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => {
                navigation.push('RecoverPassword');
              }}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
          <Footer />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: Colors.primary,
    flex: 1,
    justifyContent: 'center',
  },

  ctnLogo: {
    alignItems: 'center',
    paddingTop: 32,
  },

  logo: {
    width: '100%',
    height: 200,
    aspectRatio: 191 / 171,
    resizeMode: 'contain',
  },

  subtitle: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 60,
    paddingHorizontal: 24,
  },

  termsText: {
    marginVertical: 16,
    color: '#FFF',
    fontSize: 16,
    paddingHorizontal: 32,
    textAlign: 'center',
  },

  ctnButton: {
    marginTop: 16,
    alignItems: 'center',
    width: '100%',
  },

  // Mejora para la zona táctil del botón
  forgotBtn: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'center',
    borderRadius: 8,
  },

  forgotText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },

  // Estilo para botones grandes responsivos
  btn: {
    width: width * 0.8,
    paddingVertical: 14,
    minHeight: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    marginBottom: 12,
    alignSelf: 'center',
  },

  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  btnWhite: {
    backgroundColor: '#ffffff',
  },

  btnTextWhite: {
    color: Colors.primary,
  },
});

export default LoginScreen;
