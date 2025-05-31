import React, {useState, useEffect} from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import Colors from '../styles/Colors';
import Title from '../components/titles/Title';
import axios from '../network/axios';
import Button from '../components/buttons/Button';
import Footer from '../components/footer/Footer';


const MembershipScreen = ({route, navigation}) => {
  const {user} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    const getPlans = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/posts/plans');
        console.log('res', res);
        const planes = mapPlans(res);
        setPlans(planes);
        setIsLoading(false);
      } catch (e) {
        throw new Error(
          `Error on MembershipScreen getPlans ${e.message}, ${e}`,
        );
      }
    };
    getPlans();
  }, []);

  const mapPlans = plans => {
    if (!plans.data) {
      return [];
    }
    return plans.data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image,
    }));
  };

  const onClickPlan = plan => {
    Alert.alert(
      'Información',
      '¡Tu cambio de perfil podrá verse reflejado en los próximos 30 minútos luego de hacer el pago!',
      [
        {
          text: 'Aceptar',
          onPress: () => {
            navigation.navigate('Webview', {user, plan});
          },
        },
      ],
      {cancelable: false},
    );
  };

  function formatCurrency(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, '$1.$2');
    return x;
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainWrapper}>
        <ScrollView>
          <TouchableOpacity
            style={styles.btnWrapper}
            onPress={() => {
              navigation.navigate('Dashboard', {refresh: true});
            }}>
            <Image
              style={styles.arrowImage}
              source={require('../assets/img/back.png')}
            />
            <Text style={styles.text}>Regresar</Text>
          </TouchableOpacity>
          <Title text="Planes" />
          {isLoading && (
            <ActivityIndicator
              style={styles.loading}
              size="large"
              color="white"
            />
          )}
          <View style={styles.plansWrapper}>
            {plans.map(item => (
              <View style={styles.ctnPlan} key={item.id}>
                {item.image && (
                  <View style={styles.ctnPlanImage}>
                    <Image
                      style={styles.planImage}
                      source={{
                        uri: item.image,
                      }}
                      resizeMode={'cover'}
                    />
                  </View>
                )}
                <View style={styles.ctnPlanInfo}>
                  <Text style={styles.planName}>{item.name}</Text>
                  <Text style={styles.planPrice}>
                    {'$' + formatCurrency(item.price)}
                  </Text>
                  <Text style={styles.planDescription}>
                    {item.description.replace(/<[^>]*>?/gm, '')}
                  </Text>
                  <Button
                    text="!Compra Ahora!"
                    variant="secondary"
                    customStyle={styles.btn}
                    customTextStyle={styles.textBtn}
                    onPress={() => {
                      onClickPlan(item);
                    }}
                  />
                </View>
              </View>
            ))}
            <View style={styles.ctnLogos}>
              <Text style={styles.textLogos}>Medios de pago</Text>
              <Image
                style={styles.imgLogos}
                source={require('../assets/img/medios.png')}
              />
              <Footer textColor="dark" />
            </View>
          </View>
        </ScrollView>
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
  plansWrapper: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 32,
  },
  ctnPlan: {
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginVertical: 16,
    padding: 16,
    borderRadius: 16,
  },
  ctnPlanImage: {
    flex: 1.3,
    marginRight: 16,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planImage: {
    width: '80%',
    height: 100,
  },
  ctnPlanInfo: {
    flex: 2,
  },
  planName: {
    color: Colors.primary,
    fontSize: 16,
  },
  planPrice: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: '700',
    marginVertical: 8,
  },
  planDescription: {
    color: '#444',
    fontWeight: '200',
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 12,
  },
  btn: {
    marginVertical: 8,
  },
  textBtn: {
    textTransform: 'capitalize',
    fontWeight: '700',
    fontSize: 14,
  },
  ctnLogos: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  textLogos: {
    marginBottom: 16,
    textAlign: 'center',
  },
  imgLogos: {
    width: '80%',
    height: 40,
  },
  btnWrapper: {
    paddingTop: 16,
    paddingHorizontal: 16,
    zIndex: 99999,
    flexDirection: 'row',
  },
  arrowImage: {
    width: 20,
    height: 20,
  },
});

export default MembershipScreen;
