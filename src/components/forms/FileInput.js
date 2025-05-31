import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

const FileInput = props => {
  const placeholder = () => {
    const message = props.value ? 'Ya subió un archivo anteriormente' : 'Selecciona el archivo';

    return (
      <Text style={styles.text}>{message}</Text>
    )
  }
  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.ctnLable}>
          <Text style={styles.label}>{props.label}</Text>
          {props.value && <Text style={styles.greenText}> (OK)✓</Text>}
        </View>
        <TouchableOpacity style={styles.fileUploader} onPress={props.onPress}>
          <View style={styles.box}>
            <Text style={styles.text}>{placeholder()}</Text>
          </View>
          <Image
            style={styles.image}
            source={require('../../assets/img/upload_icon.png')}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 50,
  },
  ctnLable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
    position: 'relative',
  },
  fileUploader: {
    flexDirection: 'row',
  },
  box: {
    backgroundColor: '#363872',
    flex: 3,
    height: 45,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  text: {
    color: '#696B95',
    letterSpacing: 1.2,
  },
  image: {
    width: 70,
    height: 45,
  },
  greenText: {
    color: '#45c436',
    fontWeight: 'bold',
  },
});

export default FileInput;
