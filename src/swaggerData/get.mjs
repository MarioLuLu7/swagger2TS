import axios from 'axios';
import { urls } from './config.mjs';

const gets = urls.map((item) => axios.get(item.url));
export const getData = () =>
  new Promise(async (resolve) => {
    const resData = await Promise.all(gets);
    const datas = resData.map((item, index) => {
      const { paths, components } = item.data;
      const { schemas } = components;
      const d = {
        paths,
        schemas,
        urlData: urls[index]
      };
      return d;
    });
    resolve(datas);
  });
