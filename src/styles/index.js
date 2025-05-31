import {StyleSheet} from 'react-native';

import Colors from './Colors';

export default StyleSheet.create({
  btn: {
    backgroundColor: Colors.secondary,
    fontWeight: '900',
    fontSize: 64,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
    color: 'red',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  btnWhite: {
    backgroundColor: 'white',
    color: Colors.primary,
  },
});
