import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  View,
  ScrollView,
  Text,
  Linking,
} from 'react-native';

import Colors from '../../styles/Colors';
import {AuthContext} from '../../context';
import {protegidosBaseUrl, isPremiumUser} from '../../utils/index';

const DrawerMenu = ({user, showMenu, onPressWrapper}) => {
  const navigation = useNavigation();
  const translateX = useState(new Animated.Value(-300))[0];
  const opacity = useState(new Animated.Value(0))[0];
  const {signOut} = useContext(AuthContext);

  const onPressLink = (param, withUser = false) => {
    if (withUser) {
      navigation.navigate(param, {user});
    } else {
      navigation.navigate(param);
    }
    onPressWrapper();
  };

  const onPressLogout = () => {
    hideMenuAnimation();
    signOut();
  };

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const showMenuAnimation = () => {
    const translateXInConfig = {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.linear),
    };
    Animated.timing(translateX, translateXInConfig).start();
  };
  const hideMenuAnimation = () => {
    const translateXInConfig = {
      duration: 200,
      toValue: -300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    };
    Animated.timing(translateX, translateXInConfig).start(() => {
      fadeOut();
      onPressWrapper();
    });
  };
  useEffect(() => {
    if (showMenu) {
      fadeIn();
      showMenuAnimation();
    }
  });

  const handleResetPassowd = () => {
    return Linking.openURL(`${protegidosBaseUrl}/my-account/lost-password/`);
  };

  return (
    <>
      {showMenu && (
        <Animated.View style={[styles.wrapper, {opacity}]}>
          <Pressable onPress={hideMenuAnimation}>
            <Animated.View style={{transform: [{translateX}]}}>
              <Pressable
                style={styles.content}
                onPress={e => {
                  e.stopPropagation();
                }}>
                <View style={styles.ctnLogo}>
                  <Image
                    style={styles.logo}
                    source={require('../../assets/img/logo2.png')}
                  />
                </View>
                <ScrollView>
                  <View style={styles.ctnLinks}>
                    <TouchableOpacity
                      style={styles.navLink}
                      onPress={() => {
                        onPressLink('Membership', true);
                      }}>
                      <Text style={styles.textLink}>Mi afiliación</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.navLink}
                      onPress={() => {
                        onPressLink('UploadDocuments', true);
                      }}>
                      <Text style={styles.textLink}>Subír documentos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.navLink}
                      onPress={() => {
                        onPressLink('ReportTrip');
                      }}>
                      <Text style={styles.textLink}>Mis viajes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.navLink}
                      onPress={() => {
                        onPressLink('OurCoverage', false);
                      }}>
                      <Text style={styles.textLink}>Alianzas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.navLink}
                      onPress={() => {
                        onPressLink('UpdateProfile', true);
                      }}>
                      <Text style={styles.textLink}>Editar información</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.navLink}
                      onPress={() => {
                        onPressLink('RecoverPassword', true);
                      }}>
                      <Text style={styles.textLink}>Cambiar contraseña</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.navLink}
                      onPress={() => {
                        onPressLink('Emergency', true);
                      }}>
                      <Text style={styles.textLink}>
                        Contacto de Emergencia
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.navLink}
                      onPress={() => {
                        onPressLink('Slider', true);
                      }}>
                      <Text style={styles.textLink}>Conocenos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.navLink}
                      onPress={() => {
                        onPressLink('ChoosePost', true);
                      }}>
                      <Text style={styles.textLink}>Clasificados</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.navLink}
                      onPress={() => {
                        onPressLogout();
                      }}>
                      <Text style={styles.textLink}>Cerrar sesión</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </Pressable>
            </Animated.View>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
  },
  content: {
    backgroundColor: 'white',
    width: '75%',
    height: '100%',
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
  ctnLinks: {
    borderTopColor: Colors.primary,
    borderTopWidth: 1,
  },
  navLink: {
    borderBottomColor: Colors.primary,
    borderBottomWidth: 1,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  navLinkDisabled: {
    borderBottomColor: '#AAA',
    borderBottomWidth: 1,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  textLink: {
    fontSize: 16,
    color: Colors.primary,
  },
  textLinkDisabled: {
    fontSize: 16,
    color: '#AAA',
  },
});

export default DrawerMenu;
