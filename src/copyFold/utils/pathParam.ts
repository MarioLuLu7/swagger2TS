export type IPathParam<T extends string> = {
  [K in T]: string;
};

export function compilePath<T extends string>(path: string, params: IPathParam<T>) {
  const paramKeys = Object.keys(params);
  const pathVarNum = path.split('{').length - 1;

  // 路径无参数变量
  if (pathVarNum <= 0) {
    return path;
  }

  // 缺少参数值
  {
    const varRegex = /{(.+?)}/g;
    const needParams: string[] = [];
    let result;
    while ((result = varRegex.exec(path))) {
      needParams.push(result[1]);
    }
    const missingParams = needParams.filter((item) =>
      paramKeys.every((sitem) => item.toLowerCase() !== sitem.toLowerCase())
    );
    if (missingParams && missingParams.length > 0) {
      throw new Error(`缺少参数值: [${missingParams.join(', ')}]`);
    }
  }

  // 路径含参数变量
  let compiledPath = path;
  paramKeys.forEach((item) => {
    const paramValue = params[item as keyof IPathParam<T>];
    if (!paramValue) {
      throw new Error(`参数值为空: ${item}`);
    }
    compiledPath = compiledPath.replace(new RegExp(`{${item}}`, 'i'), paramValue);
  });

  return compiledPath;
}

// console.log(compilePath('/api/person/{id}/pet/{Petid}/ss/{ssid}', { id: '1', petid: '33', ssid: '324' }));
