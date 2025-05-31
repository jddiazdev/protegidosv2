import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import Footer from '../components/footer/Footer';
import Colors from '../styles/Colors';
import BackButton from '../components/header/BackButton';

const SliderScreen = ({navigation}) => {
  const ScreenHeight = Dimensions.get('window').height * 0.8;

  const carouselItems = [
    {
      image: require('../assets/img/slider/8.png'),
    },
    {
      image: require('../assets/img/slider/9.png'),
    },
    {
      image: require('../assets/img/slider/1.png'),
    },
    {
      image: require('../assets/img/slider/5.png'),
    },
    {
      image: require('../assets/img/slider/6.png'),
    },
    {
      image: require('../assets/img/slider/7.png'),
    },
    {
      image: require('../assets/img/slider/2.png'),
    },
    {
      image: require('../assets/img/slider/3.png'),
    },
  ];

  const _renderItem = ({item, index}) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          flex: 1,
        }}>
        <Image style={styles.sliderImage} source={item.image} />
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainWrapper}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <BackButton />
          <Text style={styles.subtitle}>Conocenos</Text>
          <Carousel
            loop
            autoPlay={true}
            data={carouselItems}
            scrollAnimationDuration={1000}
            height={ScreenHeight}
            vertical={true}
            autoPlayInterval={3000}
            renderItem={_renderItem}
          />
          <Footer />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: Colors.primary,
    flex: 1,
    alignItems: 'center',
  },
  subtitle: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 32,
    marginVertical: 8,
  },
  termsText: {
    marginVertical: 16,
    color: '#FFF',
    fontSize: 16,
    paddingHorizontal: 63,
  },
  ctnSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSwitch: {
    color: '#FFF',
    marginHorizontal: 16,
  },
  ctnButton: {
    marginTop: 32,
    alignItems: 'center',
  },
  sliderImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default SliderScreen;
