import { get, post } from "@/utils";
import { RequestTask } from "@tarojs/taro";
import { GET_NIUQI_VALUE, LOGIN, REGISTER, GET_POINTS, GET_HEDIAN_LIST, GET_HEBAO_LIST } from "./api";

export interface IUser {
  "id": number;
  "unionid": string;
  "miniOpenid": string;
  "hehuaOpenid": string,
  "points": number;
  "cardId": number;
  "tips": number;
  "ctime": string;
  "utime": string;
  "firstAward": number;
  "headImg": string;
  "nickname": string;
  "goodAward": number;
}
export interface ILoginData {
  firstTip: boolean;
  user: IUser
  token: string;
  needAuth?: boolean;
}
export function login(
  data: {
    code: string,
    iv?: string,
    encryptedData?: string
  }): RequestTask<IResult<ILoginData>> {
  return post({
    url: LOGIN,
    data,
  })
}

export function register(data: { code: string, iv?: string, encryptedData?: string }) {
  return post({
    url: REGISTER,
    data
  })
}

export interface INiuqiValue {
  "id": number,
  "unionid": string,
  "points": number,
  "note": string,
  "ctime": string,
  "type": number
}
// 用户的牛气值
export function getNiuqiValue(data: { pageSize: number, pageNum: number }): RequestTask<IResult<INiuqiValue[]>> {
  return post({
    url: GET_NIUQI_VALUE,
    data
  })
}

// 获取牛气值
export function getPoints():RequestTask<IResult<{actScore: number, hebaoNum: number}>> {
  return post ({
    url: GET_POINTS
  })
}

export interface IHedianData {
  "id": number,
  "ctime": string,
  "txnId": string,
  "platId": string,
  "unionid": string,
  "txnType": number, //1-增加  0-消耗
  "txnScore": number,
  "txnDesc": string
}
export function getHedianList (data: {lastId: number}): RequestTask<IResult<IHedianData[]>> {
  return post({
    url: GET_HEDIAN_LIST,
    data
  })
}
export interface IHebaoData {
  "id": number,
  "unionid": string,
  "num": number,
  "txDesc": string,
  "ctime": string,
  "type": number   // 1-获得,2-消耗
}
export function getHebaoList (data: {page: number, pageSize: number}): RequestTask<IResult<IHebaoData[]>> {
  return post({
    url: GET_HEBAO_LIST,
    data
  })
}