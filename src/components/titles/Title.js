import React from 'react';
import {StyleSheet, Text, Image, View} from 'react-native';

const Title = ({text}) => {
  return (
    <>
      <View style={styles.ctn}>
        <Text style={styles.title}>{text}</Text>
        <Image
          style={styles.logo}
          source={require('../../assets/img/logo.png')}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  ctn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    paddingVertical: 16,
    color: '#FFF',
    fontSize: 30,
    textAlign: 'center',
    flex: 3,
  },
  logo: {
    width: '20%',
    height: 70,
    aspectRatio: 191 / 171,
  },
});

export default Title;
