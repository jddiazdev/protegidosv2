import React from 'react';
import {StatusBar, SafeAreaView, StyleSheet, View, Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Button from '../../components/buttons/Button';
import BackButton from '../../components/header/BackButton';
import Colors from '../../styles/Colors';

const ChoosePost = ({navigation, route}) => {
  const {user} = route.params;
  const onClickRedirectBtn = screen => {
    navigation.navigate(screen, user);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.mainWrapper}>
        <KeyboardAwareScrollView>
          <BackButton />
          <View style={styles.ctnGif}>
            <Image
              style={styles.gif}
              source={require('../../assets/img/avisos-clasificados.jpg')}
            />
          </View>
          <View style={styles.container}>
            <Button
              text="Ver Clasificados"
              variant="transparent"
              customStyle={styles.btns}
              onPress={() => onClickRedirectBtn('Posts')}
            />
            <Button
              text="Crear Clasificado"
              variant="transparent"
              onPress={() => onClickRedirectBtn('AddPost')}
              customStyle={styles.btns}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

/*
<Button
    text="Mis Clasificados"
    variant="transparent"
    onPress={() => onClickRedirectBtn('MyPosts')}
    customStyle={styles.btns}
/>
*/

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
  },
  btns: {
    marginBottom: 30,
  },
  ctnGif: {
    marginVertical: 32,
  },
  gif: {
    width: '100%',
    height: 150,
  },
});

export default ChoosePost;
