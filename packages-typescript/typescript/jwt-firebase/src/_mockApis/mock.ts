import AxiosMockAdapter from 'axios-mock-adapter';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import axios from '../utils/axios';

const mock = new AxiosMockAdapter(axios, { delayResponse: 0 });
export default mock;
