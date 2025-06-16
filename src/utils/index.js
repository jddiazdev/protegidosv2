import AsyncStorage from '@react-native-async-storage/async-storage';
import {format, isAfter, parseISO, isValid} from 'date-fns';

const createFormData = (photo, body, type, user) => {
  const data = new FormData();
  let fileExtension = photo.type.split('/');
  const timestamp = format(new Date(), 'T'); // Unix timestamp

  data.append('picture', {
    name:
      timestamp + user.userData.document + '_' + type + '.' + fileExtension[1],
    type: photo.type,
    uri: photo.uri,
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  return data;
};

const getLocalUser = async () => {
  const user = await AsyncStorage.getItem('localUser');
  return JSON.parse(user);
};

// const protegidosBaseUrl = 'http://localhost:3333';
const protegidosBaseUrl = 'https://protegidosapiv2.onrender.com/api';

const trackingFalse = ['denied', 'restricted', 'not-determined'];
const trackingTrue = ['unavailable', 'authorized'];

const isPremiumUser = user => {
  if (!user?.userData) return false;

  const {membership, membership_expires} = user.userData;

  if (membership && parseInt(membership) === 0) return false;

  if (!membership_expires) return false;

  const expires = parseISO(membership_expires);
  if (!isValid(expires)) return false;

  return isAfter(expires, new Date());
};

export {
  createFormData,
  protegidosBaseUrl,
  getLocalUser,
  trackingTrue,
  trackingFalse,
  isPremiumUser,
};
