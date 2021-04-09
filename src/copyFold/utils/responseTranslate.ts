import { Request } from '@tses3-front/shared';

export type SyncFunc<T extends any[], R> = (...args: T) => R;
export type AsyncFunc<T extends any[], R> = (...args: T) => Promise<R>;

export function isAsyncFunc<T extends any[], R>(
  func: (...args: T) => R | Promise<R>
): func is (...args: T) => Promise<R> {
  return func.constructor.name == 'AsyncFunction';
}

export async function fromDtoList<T, R>(
  res: Request.IResponseBussDataList<T>,
  translate: SyncFunc<[T], R> | AsyncFunc<[T], R>
): Promise<Request.IResponseBussDataList<R>> {
  let translatedList: R[];
  if (isAsyncFunc(translate)) {
    translatedList = await Promise.all(res.list.map((item) => translate(item)));
  } else {
    translatedList = res.list.map((item) => translate(item));
  }

  return { ...res, list: translatedList };
}

export async function fromDtoArray<T, R>(res: T[], translate: SyncFunc<[T], R> | AsyncFunc<[T], R>): Promise<R[]> {
  let translatedList: R[];
  if (isAsyncFunc(translate)) {
    translatedList = await Promise.all(res.map((item) => translate(item)));
  } else {
    translatedList = res.map((item) => translate(item));
  }
  return translatedList;
}

export async function fromDtoRecord<T, R>(res: T, translate: SyncFunc<[T], R> | AsyncFunc<[T], R>): Promise<R> {
  let translatedRecord: R;
  if (isAsyncFunc(translate)) {
    translatedRecord = await translate(res);
  } else {
    translatedRecord = translate(res);
  }
  return translatedRecord;
}
