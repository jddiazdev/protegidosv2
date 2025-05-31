import axios from 'axios';
import {protegidosBaseUrl} from '../utils';

const http = axios.create({
  baseURL: protegidosBaseUrl,
});

/* http.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2));
  return request;
});

http.interceptors.response.use(async response => {
  console.log('Finishing Request', JSON.stringify(response, null, 2));
  return response;
}); */

export default http;
