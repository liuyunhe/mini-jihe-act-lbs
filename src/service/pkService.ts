import { post } from '@/utils'
import { RequestTask } from '@tarojs/taro'

/**
 * 挑战npc，包含花仙子
 * @param data 入参
 * @param data.challengeId 挑战的用户ID
 * @param data.gestureValue 挑战的收拾 1. 石头 2 剪刀 3 布
 */
export interface IPkNpc {
  rivalGesture: number //对手出的手势.
  minusPoints: number
  isWin: boolean // 用户赢
  awardValue: number
  givenPoints: number
  awardPatch: {
    //用户pk赢了，获取的年货卡片  --本次新增
    id: number
    ctime: string
    cardId: number
    patchId: number
    img: string //大图
    miniImg: string //卡片的小程序小图
    innerOrder: number
    smallImg: string
    patchName: string
  }
}
export interface IGestrue {
  1
  2
  3
}
export function pkNpc(data: {
  challengeId: number
  gestureValue: number
}): RequestTask<IResult<IPkNpc>> {
  return post({
    url: '/hbact/zt/jh/pk/challenge',
    data
  })
}

/**
 * 分页查询挑战的历史记录
 * @param data 入参
 * @param data.pageSize 分页大小
 * @param data.pageNum 页码
 */
export interface IPkHistoryData {
  id: number
  unionid: string
  npcHeadImg: string
  npcNickname: string
  pkResult: number // pk 结果1胜利 2输
  userPkValue: number //用户手势
  npcPkValue: number //系统手势
  canPkTime: string
  userPatchId: number
  awardValue: number //年货id
  awardPoints: number //荷气值
  stauts: number //  0待pk   1已经pk
  day: string
  ctime: string //pk发起时间
  lat: number
  lng: number
  pkTime: string //pk的时间
  failMinusValue: number //熟了，扣除的荷气值
  winValue: number //赢取的荷气值
  hebaoNum: number
  statusText?: string
  note: string //备注，里面放的年货道具的名称
}

export function getPkHistory(data: {
  pageNum: number
  pageSize: number
}): RequestTask<IResult<IPkHistoryData[]>> {
  return post({
    url: '/hbact/zt/jh/pk/myLaunch/his',
    data
  })
}
/**
 * 获取我发起的挑战历史记录
 * @param data 入参
 * @param data.pageNum 页码
 * @param data.pageSize 分页大小
 */
export interface IMyPkHistoryData {
  id: number
  unionid: string
  npcHeadImg: string
  npcNickname: string
  pkResult: number // pk 结果 1 用户赢了 . 其它值用户输了.
  userPkValue: number
  npcPkValue: number
  npcLaunchTime: string
  awardPatchId: number //用户获得的建筑碎片的patchId
  awardPoints: number //用户获得的积分奖励。 可能为0
  stauts: number
  day: string
  ctime: string
  lat: number
  lng: number
  pkTime: string //用户挑战的 时间.
  failMinusPoints: number // 年货id.
  awardValue: number //赢了的荷气值
  type: number
  hebaoNum: number
  statusText?: string
  note: string //年货名称
}
export function getMyPkHistory(data: {
  pageNum: number
  pageSize: number
}): RequestTask<IResult<IMyPkHistoryData[]>> {
  return post({
    url: '/hbact/zt/jh/pk/challenge/his',
    data
  })
}
/**
 *
 * @param data 入参
 * @param data.gestrueValue 手势
 * @param data.lat 纬度
 * @param data.lng 经度
 * @param data.patchId 建筑ID
 */
export function startPk(data: {
  gestureValue: number
  lat: number
  lng: number
  patchId: number
}): RequestTask<IResult<null>> {
  return post({
    url: '/hbact/zt/jh/pk/user/launch',
    data
  })
}
