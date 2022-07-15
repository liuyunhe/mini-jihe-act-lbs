import { post } from "@/utils";
import { RequestTask } from "@tarojs/taro";

/**
 * 红包
 */
/**
 * 领取金牛红包
 * @param data 入参
 */
export interface IJinniuPackageData {
  "hebaoNum"?: number,
  "points"?: number
}
export function getJinniuPackage(data: {
  shopId: number;
  lat: number;
  lng: number;
}): RequestTask<IResult<IJinniuPackageData>> {
  return post({
    url: '/hbact/zt/jh/jnhb/get',
    data
  })
}
/**
 * 领取新春红包
 * @param data 入参
 * @see 新春荷包建筑碎片是随机获取，如果本次没抽中，则patch不存在. 
 * @see 新春荷包牛气值是随机获取，如果本次没抽中，则points不存在. 
 */
export interface IXinchunPackageData {
  "hebaoNum"?: number,
  "points"?: number
}
export function getXinchunPackage(data: {
  lat: number;
  lng: number;
}): RequestTask<IResult<IXinchunPackageData>> {
  return post({
    url: '/hbact/zt/jh/xchb/get',
    data
  })
}