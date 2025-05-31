import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.goBack(null);
  };
  return (
    <>
      <TouchableOpacity style={styles.wrapper} onPress={onPress}>
        <Image
          style={styles.arrowImage}
          source={require('../../assets/img/back.png')}
        />
        <Text style={styles.text}>Regresar</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 16,
    paddingHorizontal: 16,
    zIndex: 99999,
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  arrowImage: {
    width: 20,
    height: 20,
  },
});

export default BackButton;
