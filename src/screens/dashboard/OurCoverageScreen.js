import React, {useState, useEffect, useContext} from 'react';
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
  Linking,
} from 'react-native';

import Title from '../../components/titles/Title';
import Colors from '../../styles/Colors';
import BackButton from '../../components/header/BackButton';
import Footer from '../../components/footer/Footer';
import Button from '../../components/buttons/Button';
import axios from '../../network/axios';
import {AuthContext} from '../../context';

const OurCoverageScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coverage, setCoverage] = useState([]);
  const {signOut} = useContext(AuthContext);

  useEffect(() => {
    const getCoverage = async () => {
      setIsLoading(true);
      try {
        await axios
          .get('/posts/alliances')
          .then(res => {
            const coverages = mapCoverage(res.data);
            setCoverage(coverages);
          })
          .catch(async e => {
            if (e.response.status === 401 || e.response.status === 403) {
              Alert.alert(
                'No permitido',
                'Su sesión ha expirado, por favor ingrese de nuevo.',
                [
                  {
                    text: 'Gracias',
                  },
                ],
                {cancelable: false},
              );
            }
            signOut();
          });
      } catch (e) {
        throw new Error(
          `Error on OurCoverageScreen line 50 ${
            (JSON.stringify(e), e.message)
          }`,
        );
      }
      setIsLoading(false);
    };
    getCoverage();
  }, []);

  const mapCoverage = coverage => {
    if (!coverage) {
      return [];
    }
    return coverage.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image,
      link: item.url,
    }));
  };

  const handlePress = async url => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert(`Este dispositivo no soporta abrir la siguiente url: ${url}`);
      throw new Error(
        `Error on OurCoverageScreen line 88 opening url ${
          (JSON.stringify(e), e.message, url)
        }`,
      );
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainWrapper}>
        <ScrollView>
          <BackButton />
          <Title text="Planes" />
          {isLoading && (
            <ActivityIndicator
              style={styles.loading}
              size="large"
              color="white"
            />
          )}
          <View style={styles.plansWrapper}>
            {coverage.map(item => (
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
                  <Text style={styles.planDescription}>
                    {item.description.replace(/<[^>]*>?/gm, '')}
                  </Text>
                  <Button
                    text="!Conoce más!"
                    variant="secondary"
                    customStyle={styles.btn}
                    customTextStyle={styles.textBtn}
                    onPress={() => {
                      handlePress(item.link);
                    }}
                  />
                </View>
              </View>
            ))}
            <View style={styles.ctnLogos}>
              <Text style={styles.textLogos}>Alianzas</Text>
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
});

export default OurCoverageScreen;
