import * as functions from 'firebase-functions';
import api from 'controller/api';

const server = functions.https.onRequest(api);

export default server;