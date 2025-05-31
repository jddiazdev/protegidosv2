import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import Colors from '../../styles/Colors';
import Title from '../../components/titles/Title';
import BackButton from '../../components/header/BackButton';
import {isPremiumUser} from '../../utils/index';
import {format} from 'date-fns';
import {es} from 'date-fns/locale';

const MembershipScreen = ({route, navigation}) => {
  const {user} = route.params;

  const getPlan = () => {
    return parseInt(user.userData.membership) === 0 ? 'Gratuito' : 'Pago';
  };

  const getDueDate = expires => {
    try {
      return format(new Date(expires), 'MMMM d yyyy', {locale: es});
    } catch {
      return 'Fecha inválida';
    }
  };

  const getExpiresAt = () => {
    if (isPremiumUser(user)) {
      return (
        <Text style={styles.textInfo}>
          <Text style={styles.label}>Válido hasta:</Text>{' '}
          {getDueDate(user.userData.membership_expires)}
        </Text>
      );
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.mainWrapper}>
        <BackButton />
        <Title text="Mi Afiliación" />
        <View style={styles.ctnInfo}>
          <Text style={styles.textInfo}>
            <Text style={styles.label}>Plan:</Text> {getPlan()}
          </Text>
          {getExpiresAt()}
        </View>
        {!isPremiumUser(user) && (
          <TouchableOpacity
            style={styles.btnPlans}
            onPress={() => {
              navigation.navigate('Plans', {user});
            }}>
            <Text style={styles.textBtnPlans}>Comprar Plan</Text>
          </TouchableOpacity>
        )}
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
  ctnInfo: {
    backgroundColor: Colors.secondary,
    paddingVertical: 32,
    paddingHorizontal: 32,
    justifyContent: 'center',
    borderWidth: 2,
    marginHorizontal: 32,
  },
  textInfo: {
    color: 'white',
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    color: Colors.primary,
  },
  btnPlans: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 70,
    borderRadius: 50,
    marginTop: 32,
  },
  textBtnPlans: {
    color: Colors.primary,
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1.3,
  },
});

export default MembershipScreen;
