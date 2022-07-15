import { post } from "@/utils";
import { RequestTask } from "@tarojs/taro";
import { GET_SALERS_NEARBY, SALERS_NEARBY } from "./api";

export interface IChallenge {
  awardPatchId?: number
  awardPoints?: string
  ctime?: string
  day?: string
  failMinusPoints?: string
  id?: number
  lat?: number
  lng?: number
  npcHeadImg?: string
  npcLaunchTime?: string
  npcNickname?: string
  npcPkValue?: string
  pkResult?: string
  pkTime?: string
  stauts?: number
  type?: number
  unionid?: string
  userPkValue?: string
  patchPkImg?:string;
}
export interface IShop {
  "isGet"?: number
  "lng": number,
  "shopName": string,
  "lat": number,
  "id"?: number,
  "shopAddr": string,
  distance?: number
}
export interface IXinchunPackage {
  "lat": number;
  "lng": number;
  "id": string;
}
export interface IXianzi {
  "id"?: number,
  "unionid"?: string,
  "npcHeadImg"?: string,
  "npcNickname"?: string,
  "pkResult"?: string,
  "userPkValue"?: string,
  "npcPkValue"?: string,
  "npcLaunchTime"?: string,
  "awardPatchId"?: number,
  "awardPoints"?: string,
  "stauts"?: number,
  "day"?: string,
  "ctime"?: string,
  "lat"?: number,
  "lng"?: number,
  "pkTime"?: string,
  "failMinusPoints"?: string,
  "type"?: number
}
export interface ISalerAroundData {
  challenge: IChallenge[];
  shopList: IShop[],
  xianzi: IXianzi,
  xchbPoints: IXinchunPackage[]
}
/**
 * 获取附近的点位： 荷包、商户、仙子等
 * @param data 入参
 * @param data.level 地图视区缩放等级
 * @param data.lat  GPS定位纬度
 * @param data.lng  GPS定位经度
 */
export function getSalersNearby(
  data: {
    level: number,
    lat: number,
    lng: number
  }): RequestTask<IResult<ISalerAroundData>> {
  return post({
    url: SALERS_NEARBY,
    data
  })
}

export interface ISalersNearby {
  "shopName": string,
  "lat": number,
  "distance": number, //单位米
  "lng": number,
  "shopAddr": string
}
export function getSalersNearbyList (data: {
  lat: number,
  lng: number
}): RequestTask<IResult<ISalersNearby[]>> {
  return post({
    url: GET_SALERS_NEARBY,
    data
  })
}