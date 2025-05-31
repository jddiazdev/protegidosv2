import React, {useState} from 'react';
import {Image, Text, StyleSheet, View} from 'react-native';

const Footer = ({textColor, withLogo = false}) => {
  return (
    <>
      <View style={styles.footerWrapper}>
        {withLogo && (
          <View style={styles.ctnLogoSmall}>
            <Image
              style={styles.logoSmall}
              source={require('../../assets/img/logo.png')}
            />
          </View>
        )}
        <Text style={[styles.copyText, styles[textColor]]}>
          © {new Date().getFullYear()} PROTEGIDOS APP - Colombia. Todos los
          derechos reservados.
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  footerWrapper: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  copyText: {
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontSize: 10,
  },
  dark: {
    color: '#111',
  },
  ctnLogoSmall: {
    alignItems: 'center',
  },
  logoSmall: {
    width: '100%',
    height: 50,
    aspectRatio: 191 / 171,
  },
});

export default Footer;
