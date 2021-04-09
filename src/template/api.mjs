export const apiTopTemplate = [
  (e) => `
  import { Request } from '@tses3-front/shared';
    import { compilePath, IPathParam, ResponseSvs } from '../utils';
    import { AxiosInstance } from 'axios';
    import { ${e.urlData.group}Service } from './Services';
    import { ${e.urlData.group}QueryParamService } from './QueryParamServices';
    import * as models from './Models';
    import * as queryParams from './QueryParams';

    export class ${e.urlData.group}ApiClass {
      axios: AxiosInstance;
    
      constructor(axios: AxiosInstance) {
        this.axios = axios;
      }
  `,
];
export const apiBottomTemplate = [
  (e) => {
    const group = e.urlData.group;
    return `
      }

      export const ${group}BaseUrl = '${e.urlData.url.split('/swagger')[0]}';

      export const ${group}Api = new ${group}ApiClass(
        Request.createRestAxiosInstance({
          baseUrl: ${group}BaseUrl,
        })
      );
    `;
  },
];

// e = {
//   summary,
//   operationId,
//   method,
//   path,
//   group,
//   body = {
//     ref,
//     type,
//   },
//   res = {
//     ref,
//     type,
//   }
// }
export const apiTemplate = [
  (e) => {
    const { method, path, body, res, group } = e;
    const description = e.summary?.split('\n')?.join(' ');
    const parameters = e?.parameters || [];
    const operationId = e.operationId;
    const querys = [];
    const pathParams = [];
    const stateMap = {
      pathParam: false,
      queryParam: false,
      data: false,
    };
    parameters.forEach((parameter) => {
      if (parameter.in === 'path') {
        pathParams.push(parameter.name);
      }
    });
    if (pathParams.length) {
      querys.push(`pathParam: IPathParam<${pathParams.map((item) => `'${item}'`).join(' | ')}>`);
      stateMap.pathParam = true;
    }
    if (parameters.filter((item) => item.in === 'query').length) {
      querys.push(`queryParam: queryParams.${operationId}_QueryParams`);
      stateMap.queryParam = true;
    }
    if (body.type || body.ref) {
      querys.push(`data: ${body.ref ? `models.${body.ref}` : body.type}`);
      stateMap.data = true;
    }
    return `
      ${description ? `// ${description}` : ''}
      '${method} ${path}' = async (${querys.join(', ')}) => {
        ${['get', 'post'].includes(method) ? `const res = ` : ''}await this.axios.request<any, any>({
          method: '${method}',
          url: ${stateMap.pathParam ? `compilePath('${path}', pathParam)` : `'${path}'`},
          ${
            stateMap.queryParam
              ? `params: ${group}QueryParamService._s.${operationId}_QueryParamsToDto(queryParam),`
              : ''
          }
          ${stateMap.data ? `data: ${group}Service._s.${body.ref}ToDto(data),` : ''}
        });
        ${
          method === 'get'
            ? res.ref
              ? `return ResponseSvs.fromDtoRecord(res, ${group}Service._s.${res.ref}FromDto);`
              : 'return res;'
            : ''
        }
        ${method === 'post' ? `return res` : ''}
      };
    `;
  },
];
