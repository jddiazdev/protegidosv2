import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Colors from '../../styles/Colors';

const Button = ({
  text,
  variant,
  onPress,
  customStyle,
  customTextStyle,
  disabled = false,
}) => {
  return (
    <>
      <TouchableOpacity
        style={[styles.btn, styles[variant], customStyle]}
        onPress={onPress}
        disabled={disabled}>
        <Text style={[styles.btnText, customTextStyle, styles[variant]]}>
          {text}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    color: 'white',
    fontWeight: '900',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'normal',
  },
  secondary: {
    backgroundColor: Colors.secondary,
    color: 'white',
  },
  green: {
    backgroundColor: Colors.green,
    color: 'white',
  },
  white: {
    backgroundColor: 'white',
    color: Colors.primary,
  },
  transparentBtn: {
    marginTop: 2,
  },
});

export default Button;
