import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

const NavButton = ({onPress}) => {
  return (
    <>
      <TouchableOpacity style={styles.wrapper} onPress={onPress}>
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 30,
  },
  line: {
    height: 4,
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 5,
  },
});

export default NavButton;
