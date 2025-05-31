import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Colors from '../../styles/Colors';
import AddPostForm from '../../components/dashboard/AddPostForm';
import Title from '../../components/titles/Title';
import BackButton from '../../components/header/BackButton';

const AddPostScreen = ({route, navigation}) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.mainWrapper}>
        <KeyboardAwareScrollView>
          <BackButton />
          <Title text="Crear nuevo clasificado" />
          <AddPostForm />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  text: {
    color: 'white',
    paddingHorizontal: 32,
    fontSize: 16,
    marginBottom: 32,
  },
});

export default AddPostScreen;
