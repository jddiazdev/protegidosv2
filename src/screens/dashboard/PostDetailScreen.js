import React from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Colors from '../../styles/Colors';
import BackButton from '../../components/header/BackButton';

const PostDeatilScreen = ({route, navigation}) => {
  const {post} = route.params;
  const dimensions = Dimensions.get('window');
  const imageHeight = Math.round((dimensions.width * 9) / 16);
  const imageWidth = dimensions.width;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.mainWrapper}>
        <KeyboardAwareScrollView>
          <BackButton />
          <Text style={styles.title}>{post.title}</Text>
          <View>
            <Image
              style={{
                width: imageWidth,
                height: imageHeight,
              }}
              source={{
                uri: post.picture,
              }}
            />
          </View>
          <View style={styles.ctnInfo}>
            <Text style={styles.text}>
              Nombre: {`${post.userData.name} ${post.userData.lastname}`}
            </Text>
            <Text style={styles.text}>Teléfono: {post.userData.phone}</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, height: 1, backgroundColor: 'white'}} />
            <View>
              <Text
                style={{width: 50, textAlign: 'center', color: Colors.primary}}>
                Contenido
              </Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: 'white'}} />
          </View>

          <View style={styles.ctnInfo}>
            <Text style={styles.text}>{post.title}</Text>
            <Text style={styles.text}>{post.description}</Text>
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
  title: {
    color: 'white',
    fontSize: 28,
    paddingHorizontal: 16,
    paddingVertical: 16,
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 300,
  },
  ctnInfo: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});

export default PostDeatilScreen;
