import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Footer from '../components/footer/Footer';
import Colors from '../styles/Colors';
import Style from '../styles/index';
import LoginForm from '../components/login/LoginForm';

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
  },
  subtitle: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 60,
  },
  termsText: {
    marginVertical: 16,
    color: '#FFF',
    fontSize: 16,
    paddingHorizontal: 63,
  },
  ctnButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotBtn: {
    marginTop: 32,
  },
  forgotText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default LoginScreen;
