import { post } from "@/utils";
import { RequestTask } from "@tarojs/taro";

/**
 * 查询我的建筑碎片
 */
export interface IBuildingsData {
  "miniImg": string, //小程序小图标
  "img": string,  //大图标
  "patchNum": number,
  "smallImg": string,
  "cardId": number,
  "patchId": number, //道具id
  "patchName": string //道具名称
}
export function getMyCards(): RequestTask<IResult<IBuildingsData[]>> {
  return post({
    url: '/hbact/zt/jh/patch/myCards'
  })
}