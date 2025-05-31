import {StyleSheet} from 'react-native';
import Colors from './Colors';

export const mainStyles = StyleSheet.create({
  regularBtn: {
    backgroundColor: Colors.secondary,
    padding: 15,
    borderRadius: 5,
  },
  regularText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  blueText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    paddingVertical: 20,
    color: '#FFF',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
  },
  transparentBtn: {
    backgroundColor: Colors.primary,
  },
});
