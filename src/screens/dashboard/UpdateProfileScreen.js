import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Colors from '../../styles/Colors';

import UpdateProfileForm from '../../components/profile/UpdateProfileForm';
import Title from '../../components/titles/Title';
import BackButton from '../../components/header/BackButton';
import Footer from '../../components/footer/Footer';

const UpdateProfileScreen = ({route, navigation}) => {
  const {user} = route.params;
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.mainWrapper}>
        <KeyboardAwareScrollView>
          <BackButton />
          <Title text="Actualizar Información" />
          <UpdateProfileForm user={user} />
          <View style={styles.ctnFooter}>
            <Footer />
          </View>
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
  ctnFooter: {
    paddingTop: 32,
  },
});

export default UpdateProfileScreen;
