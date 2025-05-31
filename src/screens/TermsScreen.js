import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import Footer from '../components/footer/Footer';
import Colors from '../styles/Colors';
import Style from '../styles/index';
import BackButton from '../components/header/BackButton';
import axios from '../network/axios';

const TermsScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [terms, setTerms] = useState(null);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  useEffect(() => {
    const getTerms = async () => {
      setIsLoading(true);
      try {
        delete axios.defaults.headers.common.Authorization;
        let res = await axios.get(
          '/wp-json/wp/v2/pages?include[]=3&_fields=content,id,link,title',
        );
        setTerms(res.data[0].content.rendered);
      } catch (e) {
        throw new Error(`Error getting protegidos terms ${e.message}, ${e}`);
      }
      setIsLoading(false);
    };
    getTerms();
  }, []);

  const onClickRegister = () => {
    if (isEnabled) {
      navigation.navigate('Register');
    } else {
      Alert.alert(
        'Advertencia',
        'Debe aceptar las condiciones antes de continuar con el registro.',
        [{text: 'OK'}],
      );
    }
  };
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainWrapper}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <BackButton />
          <View style={styles.ctnLogo}>
            <Image
              style={styles.logo}
              source={require('../assets/img/logo.png')}
            />
          </View>
          <Text style={styles.subtitle}>Condiciones y Politicas</Text>
          {isLoading && (
            <View style={styles.ctnLoading}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
          <Text style={styles.termsText}>
            {terms && terms.replace(/<[^>]*>?/gm, '')}
          </Text>
          <View style={styles.ctnSwitch}>
            <Switch
              trackColor={{false: '#767577', true: '#0078D7'}}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            <Text style={styles.textSwitch}>Acepto Condiciones</Text>
          </View>
          <View style={styles.ctnButton}>
            <TouchableOpacity style={Style.btn} onPress={onClickRegister}>
              <Text style={Style.btnText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
          <Footer />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: Colors.primary,
    flex: 1,
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
  },
  termsText: {
    marginVertical: 16,
    color: '#FFF',
    fontSize: 16,
    paddingHorizontal: 63,
  },
  ctnSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSwitch: {
    color: '#FFF',
    marginHorizontal: 16,
  },
  ctnButton: {
    marginTop: 32,
    alignItems: 'center',
  },
});

export default TermsScreen;
