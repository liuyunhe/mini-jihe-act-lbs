import {
  getJinniuPackage,
  getMyPkHistory,
  getNiuqiValue,
  getPkHistory,
  getSalersNearby,
  getXinchunPackage,
  IBuildingsData,
  IChallenge,
  IMyPkHistoryData,
  INiuqiValue,
  IPkHistoryData,
  ISalerAroundData,
  IShop,
  IXianzi,
  IXinchunPackage,
  startPk,
  getPoints,
  IHedianData,
  getHedianList,
  IHebaoData,
  getHebaoList,
  getMyCards
} from '@/service'
import { IMarker } from '@/types/act-lbs'
import { getResource, location as getLocation } from '@/utils'
import {
  createMapContext,
  eventCenter,
  getStorageSync,
  hideLoading,
  MapContext,
  showModal as showConfirm,
  showLoading,
  showToast,
  useDidShow
} from '@tarojs/taro'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BaseEventOrig } from '@tarojs/components'
import { MapProps } from '@tarojs/components/types/Map'
import { CAN_DRAW_RANGE, DEFAULT_MAP_SCALE } from '@/project.config'
import { getData, setData } from '@/store/store'
import realtimeLog from '@/utils/realtimeLog'
import { IGetImageInfoResult } from '@/types/resources'

interface IModalPayload {
  show: boolean
  condition?: number
  award?: object
  shopInfo?: object
  markerInfo?: object
}

const useModalStatus = () => {
  const initialModalStatus = useState(false)
  const [
    modalStatus = initialModalStatus[0],
    setModalStatus = initialModalStatus[1]
  ] = getData('modalStatus') || []
  if (!getData('modalStatus')) {
    setData('modalStatus', initialModalStatus)
  }
  return [modalStatus, setModalStatus]
}
// markers hook
const useMarkers = ({
  resourceReady,
  userInfo,
  location,
  showModal,
  map,
  mapContext,
  setUserInfo,
  modalStatus,
  setting,
  setSetting
}) => {
  const initialMarkerState: IMarker[] = []
  const initialMarkersState: ISalerAroundData = {
    challenge: [],
    xianzi: {},
    xchbPoints: [],
    shopList: []
  }
  const initDrawedState: string[] = []
  const initialPkState: IChallenge = {}
  const initialPointInfoState: IShop = {
    shopAddr: '',
    shopName: '',
    lat: 0,
    lng: 0
  }
  const MARKER_TYPE = {
    CHALLENGE: 1,
    SHOP: 2,
    XINCHUN: 3,
    XIANZI: 4
  }
  const [markers, setMarkers] = useState(initialMarkerState)
  const [markersData, setMarkersData] = useState(initialMarkersState)
  // 底部弹出商家信息
  const [pointInfo, setPointInfo] = useState(initialPointInfoState)
  const [jinniuDrawed, setJinniuDrawed] = useState(initDrawedState)
  const [xinchunDrawed, setXinchunDrawed] = useState(initDrawedState)
  const [pkDrawed, setPkDrawed] = useState(initDrawedState)
  const [xianziDrawed, setXianziDrawed] = useState(initDrawedState)
  const [pkInfo, setPkInfo] = useState(initialPkState)
  const [xianzi, setXianzi] = useState({})
  const getMarkers = async () => {
    const {
      data: { code, msg, data }
    } = await getSalersNearby({
      // level: getData('scale') || DEFAULT_MAP_SCALE,
      level: 10,
      lat: location.latitude,
      lng: location.longitude
    })
    if (code != 200) {
      return showToast({ title: msg, icon: 'none' })
    }
    if (data.shopList.length >= 10) {
      setSetting({ ...setting, scale: 14 })
    }
    setMarkersData(data)
    setMarker(data)
    mapContext &&
      mapContext.moveToLocation({
        longitude: location.longitude,
        latitude: location.latitude
      })
  }
  // 异步获取标记点, 经纬度变化，自动更新标记点
  useEffect(() => {
    if (resourceReady && !userInfo.needAuth && location.latitude) {
      getMarkers()
    }
  }, [resourceReady, userInfo.needAuth, location.latitude, location.longitude])
  // 标记点回调
  const onMarkerClick = async (
    event: BaseEventOrig<MapProps.onMarkerTapEventDetail>
  ) => {
    // 如果浮层显示了，就不让点击，解决iOS能点击浮层下标记点的问题
    if (modalStatus) return
    const MARKER_TYPES = ['challenge', 'shopList', 'xchbPoints', 'xianzi']
    let distance = 0
    // 知道到标记点
    const getMarkerDetail = () => {
      let {
        detail: { markerId }
      } = event
      markerId = String(markerId)
      const type = MARKER_TYPES[Number(markerId.slice(0, 1)) - 1]
      const index = Number(markerId.slice(1)) - 1
      const marker =
        type === 'xianzi' ? markersData[type] : markersData[type][index]
      return { marker, type, index }
    }
    const { marker, type, index } = getMarkerDetail()
    realtimeLog.info('markerClick', marker, markers[index])
    function removeCallout() {
      const JinniuMarker = markers[index]
      delete JinniuMarker?.callout
      setMarkers([...markers])
    }
    // 中奖状态： 0-未中奖，1-碎片+牛气值， 2-牛气， 3-碎片
    const getAwardCondition = (data) => {
      let condition = 0
      if (data.hebaoNum && data.points) {
        condition = 1
      } else if (!data.hebaoNum && data.points) {
        condition = 2
      } else if (data.hebaoNum && !data.points) {
        condition = 3
      }
      return condition
    }
    // 金牛荷包点击处理
    const handleShop = async () => {
      if (marker.isGet || jinniuDrawed.includes(marker.id)) {
        return showModal('jinniuModal', {
          show: true,
          condition: 0,
          shopInfo: marker
        })
        // return showConfirm({ title: '提示', content: '今天的“金牛荷包”奖励已领取，请明天再来！也可寻找“新春荷包”参与活动～', showCancel: false })
        // return showToast({ title: '今天的“金牛荷包”奖励已领取，请明天再来～ 也可寻找“新春荷包”参与活动～', icon: 'none' })
      }

      const distanceArray = await calcDistance(
        { longitude: location.longitude, latitude: location.latitude },
        [{ latitude: marker.lat, longitude: marker.lng }]
      )
      if (distanceArray) {
        distance = distanceArray[0].distance
        realtimeLog.info('range distance', CAN_DRAW_RANGE, distance)
        if (distance <= CAN_DRAW_RANGE) {
          const {
            data: { data, msg, code }
          } = await getJinniuPackage({
            lng: location.longitude,
            lat: location.latitude,
            shopId: marker.id
          })
          if (code == 200) {
            jinniuDrawed.push(marker.id)
            setJinniuDrawed([...jinniuDrawed])
            const condition = getAwardCondition(data)
            // showModal('jinniuModal', { show: true, condition: 3, award, shopInfo: marker })
            showModal('jinniuModal', {
              show: true,
              condition,
              award: { hebaoNum: data.hebaoNum, points: data.points },
              shopInfo: marker
            })
            if (data.points) {
              eventCenter.trigger('pointsChange', data.points)
            }
            removeCallout()
            // getMarkers()
          } else {
            showToast({ title: msg, icon: 'none' })
          }
        } else {
          marker.distance = distance
          setPointInfo(marker)
        }
      }
    }
    // 领取新春荷包
    const handleXinchun = async () => {
      // return showToast({
      //   title: '活动已结束',
      //   icon: 'none'
      // })
      if (xinchunDrawed.includes(marker.id)) {
        showToast({ title: '这个荷包已经抽过奖了哦', icon: 'none' })
        return
      }
      const {
        data: { data, msg, code }
      } = await getXinchunPackage({ lat: marker.lat, lng: marker.lng })
      if (code == 200) {
        xinchunDrawed.push(marker.id)
        setXinchunDrawed([...xinchunDrawed])
        const condition = getAwardCondition(data)
        showModal('xinchunModal', {
          show: true,
          condition,
          award: { hebaoNum: data.hebaoNum, points: data.points },
          markerInfo: marker
        })
        if (data.points) {
          eventCenter.trigger('pointsChange')
        }
        // getMarkers()
      } else {
        showToast({ title: msg, icon: 'none' })
      }
    }
    const handleChallenge = async () => {
      // return showToast({
      //   title: '活动已结束',
      //   icon: 'none'
      // })
      if (pkDrawed.includes(marker.id)) {
        showToast({ title: '已经挑战过了哦，换一个吧~', icon: 'none' })
      }
      setPkInfo(marker)
      showModal('pkInfoModal', { show: true, markerInfo: marker })
    }
    const handleXianzi = () => {
      // return showToast({
      //   title: '活动已结束',
      //   icon: 'none'
      // })
      if (xianziDrawed.includes(marker.id)) {
        return showToast({ title: '已经挑战过了哦， 换一个吧~', icon: 'none' })
      }
      showModal('xianziPkModal', {
        show: true,
        condition: 1,
        markerInfo: marker
      })
    }
    // 点击新春荷包
    if (type === 'shopList') {
      handleShop()
    } else if (type === 'challenge') {
      //点击pk点位，弹出pk详细信息
      handleChallenge()
    } else if (type === 'xchbPoints') {
      //点击新春荷包，抽奖， 需要判断是否抽过了当前荷包
      handleXinchun()
    } else if (type === 'xianzi') {
      //点击仙子荷包，抽奖，需要判断是否抽过了
      handleXianzi()
    }
  }
  function calcDistance(
    point: { latitude: number; longitude: number },
    markerPoint: [{ latitude: number; longitude: number }]
  ): any {
    return new Promise((resolve, reject) => {
      map.calculateDistance({
        mode: 'straight',
        from: point,
        to: markerPoint,
        success: (res) => {
          const { elements } = res.result
          resolve(elements)
        },
        fail: (e) => {
          resolve([])
        }
      })
    })
  }
  async function setMarker(data: ISalerAroundData) {
    setMarkers([])
    const markersDataAround: IMarker[] = []
    for (let i in data) {
      switch (i) {
        case 'challenge':
          markersDataAround.push(...(await setChallengePoint(data[i])))
          break
        case 'shopList':
          markersDataAround.push(...(await setShopPoint(data[i])))
          break
        case 'xchbPoints':
          markersDataAround.push(...(await setXinchunHebaoPoint(data[i])))
          break
        case 'xianzi':
          markersDataAround.push(...(await setXianziPoint(data[i])))
          break
      }
      setMarkers(markersDataAround)
    }

    async function setPoints(
      pointsData: any = [],
      icon: IGetImageInfoResult,
      type: number
    ) {
      const markersDataPoints: IMarker[] = []
      let distanceArray
      if (type === MARKER_TYPE.SHOP) {
        distanceArray = await calcDistance(
          {
            longitude: location.longitude,
            latitude: location.latitude
          },
          pointsData.map((item) => ({
            longitude: item.lng,
            latitude: item.lat
          }))
        )
      }
      pointsData.forEach((item, index) => {
        item.markerId = Number(`${type}${index + 1}`)
        const marker: IMarker = {
          longitude: item.lng,
          latitude: item.lat,
          id: item.markerId,
          iconPath: icon.path || item.patchPkImg
        }
        if (type === MARKER_TYPE.CHALLENGE) {
          // marker.iconPath = item.patchPkImg + '?x-oss-process=image/resize,w_59'
          // marker.iconPath = item.patchPkImg
          marker.width = 118 / 2.5
          marker.height = 154 / 2.5
        } else if (type === MARKER_TYPE.SHOP) {
          // 84*163
          marker.width = 70 / 2.5
          marker.height = 115 / 2.5
        } else if (type === MARKER_TYPE.XIANZI) {
          // 66*153
          marker.width = 153 / 3
          marker.height = 199 / 3
        } else if (type === MARKER_TYPE.XINCHUN) {
          // 73*114
          marker.width = 155 / 3
          marker.height = 107 / 3
        } else {
          marker.width = (icon.width || 118) / 2
          marker.height = (icon.height || 0) / 2
        }
        // 计算距离， 距离100m内的金牛荷包显示领取提示, 并且没有领取
        if (type === MARKER_TYPE.SHOP && distanceArray && item.isGet === 0) {
          if (
            distanceArray[index] &&
            distanceArray[index].distance <= CAN_DRAW_RANGE
          ) {
            marker.callout = {
              content: '点击领取奖励',
              borderColor: '#199d8d',
              color: '#ffffff',
              fontSize: 12,
              anchorX: 0,
              anchorY: 0,
              borderRadius: 4,
              borderWidth: 0,
              bgColor: '#199d8d',
              padding: 8,
              display: 'ALWAYS',
              textAlign: 'center'
            }
          }
        }
        markersDataPoints.push(marker)
      })
      return markersDataPoints
    }
    function setChallengePoint(challenge: IChallenge[]) {
      console.log('challenge', challenge)
      const icon = getResource('markerPk')
      return setPoints(challenge, icon, MARKER_TYPE.CHALLENGE)
    }
    function setShopPoint(shop: IShop[]) {
      const icon = getResource('markerShop')
      console.log('shop', shop)
      return setPoints(shop, icon, MARKER_TYPE.SHOP)
    }
    function setXinchunHebaoPoint(xinchunPackage: IXinchunPackage[]) {
      const icon = getResource('iconMarkerHebao')
      console.log('xinchunPackage', xinchunPackage)
      return setPoints(xinchunPackage, icon, MARKER_TYPE.XINCHUN)
    }
    function setXianziPoint(point: IXianzi) {
      const icon = getResource('markerXianzi')
      console.log('xianzi', point)
      setXianzi(point)
      const isFirst = getStorageSync('IS_FIRST')
      isFirst !== '' &&
        showModal('xianziPkModal', { show: true, markerInfo: point })
      return setPoints([point], icon, MARKER_TYPE.XIANZI)
    }
  }
  return {
    markers,
    getMarkers,
    onMarkerClick,
    calcDistance,
    pointInfo,
    setPointInfo,
    pkInfo,
    setPkDrawed,
    setXianziDrawed,
    xianzi,
    setXianzi
  }
}
// buildings hook
const useCards = ({ userInfo, showModal, clearModal }) => {
  const initialBuildingState: IBuildingsData[] = []
  const [cards, setBuildings] = useState(initialBuildingState)
  const getBuildingsData = async () => {
    let {
      data: { data, code, msg }
    } = await getMyCards()
    if (code != 200) {
      showToast({ title: msg, icon: 'none' })
      return
    }
    data = data.filter((item) => item.patchNum > 1)
    if (!data.length) {
      return showToast({
        title: '年货道具数量不足',
        icon: 'none'
      })
    }
    setBuildings(data)
    clearModal()
    showModal('gestrueModal', { show: true, condition: 0 })
  }
  // 我的建筑点击
  const getCards = (condition = 0) => {
    if (!userInfo.needAuth) {
      getBuildingsData()
    }
  }
  return { cards, getCards }
}
// pk hook
const params = {
  patchId: 0,
  gestureValue: 0,
  lat: 0,
  lng: 0
}
const usePk = ({ clearModal, showModal, hideModal, location, getCards }) => {
  params.lat = location.latitude
  params.lng = location.longitude
  // 选择建筑，下一步
  // const onNextClick = (patchId: number) => {
  // if (!patchId || patchId < 0) {
  //   showToast({ title: '请选择碎片', icon: 'none' })
  //   return;
  // }
  // params.patchId = patchId
  // clearModal()
  // showModal('gestrueModal')
  // }
  const onJoinClick = () => {
    // clearModal()
    const { hedian } = getData('points')
    if (hedian < 68) {
      return showToast({
        title: '荷点不足',
        icon: 'none'
      })
    }
    getCards()
    // showModal('gestrueModal')
  }
  // 选择手势
  const onChooseGestrue = async (gestrue: number, nianhuo: number) => {
    if (!gestrue || gestrue < 0) {
      return showToast({ title: '请选择手势', icon: 'none' })
    }
    params.gestureValue = gestrue
    params.patchId = nianhuo
    const {
      data: { msg }
    } = await startPk(params)
    showToast({ title: msg, icon: 'none' })
    clearModal()
  }
  // 点击pk按钮回调
  // const onPkClick = () => {
  //   clearModal()
  //   getBuildings(1)
  // }

  // 从发起方信息卡片点击立刻挑战
  const onPkSoonClick = (pkInfo) => {
    hideModal('pkInfoModal')
    // showModal('gestrueModal')
  }
  return { onChooseGestrue, onPkSoonClick, onJoinClick }
}
const initialXianziInfoState: IXianzi = {}
const useModal = (setModalStatus) => {
  // 弹窗默认设置
  const initialModalState = {
    // 活动规则
    rules: { show: false },
    // 新春荷包
    xinchunModal: { show: false, condition: 0, award: {}, markerInfo: {} },
    // 荷塘建筑
    buildingModal: { show: false, condition: 0 },
    // pk规则
    pkRulesModal: { show: false },
    // 选择手势
    gestrueModal: { show: false, condition: 0 },
    // pk结果
    pkResultModal: { show: false, condition: 0, award: {} },
    // pk发起方信息
    pkInfoModal: { show: false },
    // 游戏记录
    pkRecordModal: { show: false, condition: 0 },
    // 金牛荷包
    jinniuModal: { show: false, condition: 0, award: {}, shopInfo: {} },
    // 牛气值记录
    pkHedianModal: { show: false, condition: 0 },
    // 荷包记录值
    pkHebaoModal: { show: false, condition: 0 },
    // 仙子
    xianziModal: {
      show: getStorageSync('IS_FIRST') !== false,
      condition: 0,
      markerInfo: {}
    },
    xianziPkModal: { show: false, markerInfo: {} }
  }
  // 弹框设置
  const [modal, setModal] = useState(initialModalState)
  // 显示弹窗
  const showModal = (
    type: keyof typeof initialModalState,
    payload: Partial<IModalPayload> = { show: true }
  ) => {
    // console.log(Object.assign({}, modal[type], payload))
    // modal[type] = { ...modal[type], ...payload };
    Object.assign(modal[type], payload)
    setModal({ ...modal })
    setModalStatus(true)
  }
  // 隐藏弹窗
  const hideModal = (
    type: string,
    payload: IModalPayload = { show: false }
  ) => {
    console.log(type, payload)
    // modal[type] = { ...modal[type], ...payload };
    Object.assign(modal[type], payload)
    setModal({ ...modal })
    setModalStatus(false)
  }
  // 清除所有的弹窗
  const clearModal = () => {
    for (let i in modal) {
      modal[i].show = false
    }
    setModal({ ...modal })
    setModalStatus(false)
  }
  return { modal, showModal, hideModal, clearModal }
}

// pk记录
const mockHistory = [
  {
    id: 2,
    unionid: 'oVUBg5qE3y7HDKoluqzBcJM2l3C0',
    npcHeadImg: 'http://thirdwx.qlogo.cn/mmopen/v',
    npcNickname: '马国兴',
    pkResult: 1, // pk 结果1胜利 2输
    userPkValue: 1, //用户手势
    npcPkValue: 2, //系统手势
    canPkTime: '2021-01-07 11:12:42',
    userPatchId: 2,
    awardPoints: 68, //赢得的牛气值
    stauts: 1, //  0待pk   1已经pk
    day: '20210107',
    ctime: '2021-01-07 10:56:30', //pk发起时间
    lat: 34.267556,
    lng: 108.953475,
    pkTime: '2021-01-07 13:45:00', //pk的时间
    failMinusPoints: 0
  },
  {
    id: 1,
    unionid: 'oVUBg5qE3y7HDKoluqzBcJM2l3C0',
    npcHeadImg: 'http://thirdwx.qlogo.cn/mmopen/v',
    npcNickname: 'Boom',
    pkResult: 2,
    userPkValue: 1,
    npcPkValue: 3,
    canPkTime: '2021-01-07 13:43:46',
    userPatchId: 2,
    awardPoints: 0,
    stauts: 1,
    day: '20210107',
    ctime: '2021-01-07 10:45:43',
    lat: 34.267556,
    lng: 108.953475,
    pkTime: '2021-01-07 14:10:00',
    failMinusPoints: 68
  }
]
const mockMyHistory = [
  {
    id: 22,
    unionid: 'oVUBg5qE3y7HDKoluqzBcJM2l3C0',
    npcHeadImg: 'http://thirdwx.qlogo.cn/mmopen/v',
    npcNickname: 'Boom',
    pkResult: 1, // pk 结果 1 用户赢了 . 其它值用户输了.
    userPkValue: 2,
    npcPkValue: 3,
    npcLaunchTime: null,
    awardPatchId: 15, //用户获得的建筑碎片的patchId
    awardPoints: 68, //用户获得的积分奖励。 可能为0
    stauts: 1,
    day: '20210105',
    ctime: '2021-01-05 13:17:31',
    lat: 34.24957464,
    lng: 108.97088157,
    pkTime: '2021-01-05 13:29:19', //用户挑战的 时间.
    failMinusPoints: null, // 用户输了以后扣减的积分.
    type: 2
  },
  {
    id: 17,
    unionid: 'oVUBg5qE3y7HDKoluqzBcJM2l3C0',
    npcHeadImg: 'http://thirdwx.qlogo.cn/mmopen/v',
    npcNickname: '马国兴',
    pkResult: 1,
    userPkValue: 2,
    npcPkValue: 3,
    npcLaunchTime: null,
    awardPatchId: 2,
    awardPoints: 68,
    stauts: 1,
    day: '20210105',
    ctime: '2021-01-05 09:40:10',
    lat: 34.27115227,
    lng: 108.96217828,
    pkTime: '2021-01-05 09:41:56',
    failMinusPoints: null,
    type: 1
  }
]
const useHistory = ({ showModal, clearModal }) => {
  const initialHistoryState: IPkHistoryData[] = []
  const initialMyHistoryState: IMyPkHistoryData[] = []
  const [history, setHistory] = useState(initialHistoryState)
  const [myHistory, setMyHistory] = useState(initialMyHistoryState)
  function handleData(data: IPkHistoryData[] | IMyPkHistoryData[]) {
    // 处理数据
    // 1、处理状态
    // 没pk，判断是否在有效时间内，在有效时间内，statusText='待应战'， 有效时间外， statusText='24小时无人应战'
    // 已经pk， 判断输赢，输了， statusText=失败， 赢了，statusText='失败'
    data.forEach((item) => {
      let canPkTime, nowTime
      if (item.canPkTime) {
        canPkTime = new Date(item.canPkTime.replace(/-/g, '/')).getTime()
        nowTime = Date.now()
      }
      if (item.stauts == 0 && item.canPkTime) {
        if (nowTime > canPkTime) {
          item.statusText = '24小时无人应战'
        } else {
          item.statusText = '待应战'
        }
      } else {
        if (item.pkResult == 1) {
          item.statusText = '胜利'
        } else {
          item.statusText = '失败'
        }
      }
    })
  }
  // const [historyPage, setHistoryPage] = useState({page: 1, finished: false})
  const historyPage = useRef(1)
  const historyFinished = useRef(false)
  const getHistory = async (isRefresh = false) => {
    if (historyFinished.current && !isRefresh) return
    if (isRefresh) {
      // const newState = {page: 1, finished: false}
      historyPage.current = 1
      historyFinished.current = false
      console.log(historyPage)
    }
    let {
      data: { data, code, msg }
    } = await getPkHistory({
      pageNum: isRefresh ? 1 : historyPage.current,
      pageSize: 10
    })
    if (code != 200) {
      return showToast({ title: msg, icon: 'none' })
    }
    handleData(data)
    setHistory(isRefresh ? data : history.concat(data))
    historyPage.current++
    if (data.length < 10) {
      historyFinished.current = true
    }
    // setHistoryPage({...historyPage})
  }
  // const [myHistoryPage, setMyHistoryPage] = useState({page: 1, finished: false})
  const myHistoryPage = useRef(1)
  const myHistoryFinished = useRef(false)
  const getMyHistory = async (isRefresh = false) => {
    if (myHistoryFinished.current && !isRefresh) return
    if (isRefresh) {
      myHistoryPage.current = 1
      myHistoryFinished.current = false
      // setMyHistoryPage({page: 1, finished: false})
    }
    let {
      data: { data, code, msg }
    } = await getMyPkHistory({
      pageNum: isRefresh ? 1 : myHistoryPage.current,
      pageSize: 10
    })
    if (code != 200) {
      return showToast({ title: msg, icon: 'none' })
    }
    handleData(data)
    setMyHistory(myHistory.concat(data))
    myHistoryPage.current++
    if (data.length < 10) {
      myHistoryFinished.current = true
    }
    // setMyHistoryPage({...myHistoryPage})
  }
  // 点击pk记录按钮回调
  const onRecordClick = () => {
    getMyHistory(true)
    clearModal()
    showModal('pkRecordModal', { show: true, condition: 0 })
  }
  function resetHistory() {
    historyPage.current = 1
    historyFinished.current = false
    myHistoryPage.current = 1
    myHistoryFinished.current = false
    setHistory([])
    setMyHistory([])
  }
  return {
    history,
    getHistory,
    myHistory,
    getMyHistory,
    onRecordClick,
    resetHistory
  }
}

const useLocation = ({ map, setting, setSetting }) => {
  // @ts-ignore
  let initialMapContext: MapContext = null
  const initialLocationState = {
    longitude: 0,
    latitude: 0,
    title: '',
    isLocatting: false
  }
  const [location, setLocation] = useState(initialLocationState)
  const [mapContext, setMapContext] = useState(initialMapContext)
  // 发起定位
  const requestLocation = async () => {
    setLocation({ ...location, title: '定位中...', isLocatting: true })
    const context = mapContext || createMapContext('actMap')
    setMapContext(context)
    getLocation((point) => {
      console.log(point)
      if (point) {
        const { latitude, longitude } = point
        setLocation({ ...location, longitude, latitude })
        setting.latitude = latitude
        setting.longitude = longitude
        // setting.scale = DEFAULT_MAP_SCALE
        setSetting({ ...setting })
        context.moveToLocation({ latitude, longitude })
        map.reverseGeocoder({
          location: {
            longitude,
            latitude
          },
          success: (res) => {
            setLocation({
              ...location,
              title: res.result.address,
              longitude,
              latitude,
              isLocatting: false
            })
          },
          fail: (e) => {
            console.error(e)
          }
        })
      } else {
        setTimeout(() => {
          setLocation({ ...location, isLocatting: false })
        }, 1000)
      }
    })
  }
  // 页面展示时的回调
  useDidShow(requestLocation)
  return { location, setLocation, requestLocation, mapContext }
}
// 获取荷点数据
const useHedian = () => {
  const isOver = useRef(false)
  const initialState: IHedianData[] = []
  const [hedian, setHedian] = useState(initialState)
  const getHedian = async (isRefresh = false) => {
    if (isOver.current && !isRefresh) return
    if (isRefresh) {
      isOver.current = false
    }
    showLoading({ title: '加载中...', mask: true })
    const lastId =
      (hedian[hedian.length - 1] && hedian[hedian.length - 1].id) || -1
    let {
      data: { data, msg, code }
    } = await getHedianList({ lastId })
    if (code == 200) {
      setHedian(isRefresh ? data : hedian.concat(data))
      hideLoading()
      if (data.length < 10) {
        isOver.current = true
      }
      return
    }
    hideLoading()
    showToast({ title: msg, icon: 'none' })
  }
  return { hedian, getHedian, setHedian }
}
// 获取荷包数据
const useHebao = () => {
  const page = useRef(1)
  const isOver = useRef(false)
  const initialState: IHebaoData[] = []
  const [hebao, setHebao] = useState(initialState)
  const getHebao = async (isRefresh = false) => {
    if (isOver.current && !isRefresh) return
    if (isRefresh) {
      page.current = 1
      isOver.current = false
    }
    showLoading({ title: '加载中...', mask: true })
    let {
      data: { data, msg, code }
    } = await getHebaoList({ page: page.current, pageSize: 10 })
    if (code == 200) {
      setHebao(isRefresh ? data : hebao.concat(data))
      page.current++
      hideLoading()
      if (data.length < 10) {
        isOver.current = true
      }
      return
    }
    hideLoading()
    showToast({ title: msg, icon: 'none' })
  }
  return { hebao, getHebao, setHebao }
}
const usePoints = () => {
  const [points, setPoints] = useState({
    hebao: 0,
    hedian: 0
  })
  const getPoint = async () => {
    const {
      data: { data, code }
    } = await getPoints()
    console.log('刷新牛气值=>>>>', data)
    realtimeLog.info('刷新牛气值=>>>>', data)
    if (code == 200) {
      setPoints({
        hebao: data.hebaoNum || 0,
        hedian: data.actScore || 0
      })
    }
  }
  setData('points', points)
  return { points, getPoint }
}

// toast
const useToast = () => {
  interface IToastParams {
    show: boolean
    content: string
    image: string
  }
  const [toastParams, setParams] = useState<Partial<IToastParams>>({
    content: 'Toast',
    image: '',
    show: false
  })
  const setShowToast = (data: Partial<IToastParams>) => {
    data && setParams({ ...toastParams, ...data })
    if (data.show) {
      setTimeout(() => {
        setParams({ ...toastParams, ...{ show: false } })
      }, 1500)
    }
  }
  return [toastParams, setShowToast]
}
export {
  useCards,
  useMarkers,
  useModal,
  usePk,
  useHistory,
  useLocation,
  usePoints,
  useHebao,
  useHedian,
  useToast,
  useModalStatus
}
