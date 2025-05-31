import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Colors from '../../styles/Colors';

const UserData = ({user}) => {
  return (
    <>
      <View style={styles.ctnInfo}>
        <Text style={styles.textInfo}>
          Cédula: {user.userData && user.userData.document}
        </Text>
        <Text style={styles.textInfo}>Email: {user.email}</Text>
        <Text style={styles.textInfo}>
          Teléfono: {user.userData && user.userData.phone}
        </Text>
        <Text style={styles.subtitle}>Datos de perfil médicos</Text>
        <Text style={styles.textInfo}>
          Tipo de Sangre (RH): {user.userData && user.userData.rh}
        </Text>
        {/* <Text style={styles.textInfo}>
          Alérgico a algun medicamento: {user.userData && user.userData.alergies}
        </Text> */}
        <Text style={styles.subtitle}>Datos del vehículo</Text>
        <Text style={styles.textInfo}>
          Placa: {user.userVehicle && user.userVehicle.plate}
        </Text>
        <Text style={styles.textInfo}>SOAT: {user.userVehicle && user.userVehicle.soat_expires}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  ctnInfo: {
    paddingVertical: 32,
    paddingHorizontal: 70,
  },
  subtitle: {
    color: Colors.secondary,
    fontSize: 16,
    marginVertical: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  textInfo: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
});

export default UserData;
