import React, { useEffect, useState } from 'react'
import { View, Text, Button, Map, Image } from '@tarojs/components'
import {
  eventCenter,
  getCurrentInstance,
  getStorageSync,
  navigateTo,
  showToast,
  useDidHide,
  useDidShow,
  useShareAppMessage,
  useShareTimeline
} from '@tarojs/taro'
import { debounce } from 'lodash'
import {
  DEFAULT_MAP_SCALE,
  MAX_SCALE,
  MIN_SCALE,
  QQ_MAP_KEY,
  SCALE_DEBOUNCE_TIME
} from '@/project.config'
import { Preload, UserInfo, Login } from '@/components'
import { getResource, playBgm } from '@/utils'
import { auth, checkAuth } from '@/utils/auth'
import { ILoginData } from '@/service'
import { MapProps } from '@tarojs/components/types/Map'
import QQMap from '@/utils/thirdparty/qqmap-wx-jssdk'
// @ts-ignore
import audio from '@/audio/lbs-launch-xianzi-audio.mp3'
// @ts-ignore
// import bgm from '@/audio/lbs-bgm.mp3'
import { getData, setData } from '@/store/store'
import { IResources } from '@/types/resources'
// import { ASSETS_HOST } from '@/resource.map'
import Toast from '@/components/toast/Toast'
import Rules from './components/rules/Rules'
import XinchunModal from './components/xinchun-modal/XinchunModal'
import PkRulesModal from './components/pk-rules-modal/PkRulesModal'
import ChooseGestrueModal from './components/choose-gestrue-modal/ChooseGestrueModal'
import PkInfoModal from './components/pk-info-modal/PkInfoModal'
import PkRecordModal from './components/pk-record-modal/PkRecordModal'
import JinNiuModal from './components/jinniu-modal/JinNiuModal'
import PkHedianModal from './components/pk-hedian-modal/PkHedianModal'
// import ScrollText from './components/scroll-text/ScrollText'
// import PkHebaoModal from './components/pk-hebao-modal/PkHebaoModal'
import PointInfo from './components/point-info/PointInfo'
import XianziModal from './components/xianzi-modal/XianziModal'
import './index.scss'
import {
  useHistory,
  useLocation,
  useMarkers,
  useModal,
  useHedian,
  usePk,
  usePoints,
  useToast,
  useCards
} from './hooks'
import XianziPkModal from './components/xianzi-pk-modal/XianziPkModal'

const map = new QQMap({ key: QQ_MAP_KEY })

const initialUserState = {
  user: {
    headImg: '',
    nickname: '',
    points: 0
  },
  token: '',
  needAuth: true
}
// 地图默认设置
const initialSettingState = {
  latitude: 39.908823,
  longitude: 116.39747,
  showLocation: true,
  subkey: QQ_MAP_KEY,
  scale: DEFAULT_MAP_SCALE
}

export default function Index(props: any) {
  const [modalStatus, setModalStatus] = useState(false)
  // 地图组件的设置项
  const [setting, setSetting] = useState(initialSettingState)
  const { location, setLocation, requestLocation, mapContext } = useLocation({
    map,
    setting,
    setSetting
  })
  // modal
  const { modal, showModal, hideModal, clearModal } = useModal(setModalStatus)
  // 图片资源加载状态： true-加载完毕， false-未加载完毕
  const [resourceReady, setResourceReady] = useState(false)
  // 刷新图标
  const [refreshIcon, setRefreshIcon] = useState(getResource('iconRefresh'))
  // 用户信息
  const [userInfo, setUserInfo] = useState(initialUserState)
  const [showUser, setShowUser] = useState(false)
  const [headImg, setHeadImg] = useState('')
  const [nickname, setNickname] = useState('')
  // 地图标记： 新春荷包、店铺、花仙子等
  const {
    markers,
    onMarkerClick,
    getMarkers,
    setPointInfo,
    pointInfo,
    pkInfo,
    xianzi,
    setXianzi
  } = useMarkers({
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
  })
  const { cards, getCards } = useCards({ userInfo, showModal, clearModal })
  // pk
  const { onChooseGestrue, onJoinClick, onPkSoonClick } = usePk({
    clearModal,
    showModal,
    hideModal,
    location,
    getCards
  })
  // 历史记录
  const {
    history,
    getHistory,
    myHistory,
    getMyHistory,
    onRecordClick,
    resetHistory
  } = useHistory({ showModal, clearModal })
  // 牛气值
  const { points, getPoint } = usePoints()
  // 荷点
  const { hedian, getHedian, setHedian } = useHedian()
  // 荷包
  // const { hebao, getHebao, setHebao } = useHebao()
  // toast
  const [toastParams, setShowToast] = useToast()

  useEffect(() => {
    auth()
    function loginCallback(userData) {
      console.log(userData)
      if (userData) {
        onLoginSuccess(userData)
        eventCenter.off('login', loginCallback)
      }
      setShowUser(true)
    }
    // 登录成功回调
    const onLoginSuccess = async (userData: ILoginData) => {
      setUserInfo({
        token: userData.token,
        user: {
          headImg: userData.user.headImg,
          nickname: userData.user.nickname,
          points: userData.user.points
        },
        needAuth: false
      })
      setHeadImg(userData.user.headImg)
      wx.setStorageSync('headImg', userData.user.headImg)
      setNickname(userData.user.nickname)
      wx.setStorageSync('nickname', userData.user.nickname)
      getPoint()
      // 更新牛气值
      const onPointsChange = () => {
        // userData.user.points = Number(userData.user.points) + Number(points)
        // setuserData(userData)
        getPoint()
      }
      eventCenter.off('pointsChange', onPointsChange)
      eventCenter.on('pointsChange', onPointsChange)
    }
    eventCenter.on('login', loginCallback)
  }, [])
  // 图片资源加载完毕回调
  const onResourceReady = async (result: IResources) => {
    console.log('ready')
    setResourceReady(true)
    setRefreshIcon(getResource('iconRefresh'))
    if (getStorageSync('IS_FIRST') !== false) {
      await playBgm(audio, false)
    }
  }
  // 地图视区发生变化, 拖动、缩放、旋转
  const onRegionChange = debounce((res: any) => {
    const detail: MapProps.regionChangeDetail = res.detail
    // 1、获取缩放级别
    // 2、获取中心点坐标
    const { scale, centerLocation, type } = detail
    if (type === 'end' && res.causedBy === 'scale') {
      // 原来的scale
      const originScale = getData('scale')
      // 当前的缩放等级向下取整
      const currentScale = parseInt(String(scale))
      // 跟之前的缩放等级对比，不一样并且在限定范围内之间 => 重新获取markers
      // 更新store中的缩放等级
      if (
        originScale !== currentScale &&
        currentScale >= MIN_SCALE &&
        currentScale <= MAX_SCALE
      ) {
        setData('scale', currentScale)
        // getMarkers()
        console.log('refreshMarkers', scale, centerLocation)
      } else if (currentScale < MIN_SCALE) {
        //超过最小缩放距离，自动缩放到最小缩放距离
        // setting.scale = MIN_SCALE
        setData('scale', MIN_SCALE)
        setSetting({ ...setting })
      } else if (currentScale > MAX_SCALE) {
        //超过最大缩放距离，自动缩放到最大缩放距离
        // setting.scale = MAX_SCALE
        // setData('scale', MAX_SCALE)
        // setSetting({ ...setting })
      }
    }
  }, SCALE_DEBOUNCE_TIME)

  // 分享
  // useShareAppMessage((res) => {
  //   return {
  //     title: `${userInfo.user.nickname}邀你来盛夏集荷之旅`,
  //     path: '/pages/webview/webview'
  //   }
  // })
  // useShareTimeline(() => {
  //   return {
  //     title: `${userInfo.user.nickname}邀你来盛夏集荷之旅`,
  //     path: '/pages/webview/webview'
  //   }
  // })
  function onOutClick() {
    showToast({
      title: '活动已结束',
      icon: 'none'
    })
  }
  return (
    <View className="container">
      <Toast {...toastParams} />
      {/* login */}
      {/* <Login onLoginSuccess={onLoginSuccess} /> */}
      {/* preload */}
      <Preload onReady={onResourceReady} />
      {/* map */}
      {/* <ScrollText text='1、荷塘建筑可在【荷家荷塘】栏目拼图使用。2、牛气值可在【荷家好礼】栏目抽奖使用。' /> */}
      <Map
        id="actMap"
        setting={setting}
        layer-style={1}
        scale={setting.scale}
        markers={markers}
        enableScroll={!modalStatus}
        minScale={MIN_SCALE}
        showLocation
        maxScale={MAX_SCALE}
        longitude={setting.longitude}
        latitude={setting.latitude}
        onMarkerTap={onMarkerClick}
        onRegionChange={onRegionChange}
      />
      {/* layer 2 */}
      <View className="top-box">
        <View className="left">
          <UserInfo show={showUser} headImg={headImg} nickname={nickname} />
          <View
            className={`location-info ${location.isLocatting && 'locatting'}`}
            onClick={requestLocation}
          >
            <Image src={refreshIcon.path}></Image>
            <Text>定位：{location.title}</Text>
          </View>
        </View>
        <View className="right">
          <View
            className="niuqi-value-box"
            onClick={() => {
              showModal('pkHedianModal')
              getHedian(true)
            }}
          >
            <text>荷点：</text>
            <text>{points.hedian}</text>
          </View>
          {/* <View className='niuqi-value-box' onClick={() => { showModal('pkHebaoModal'); getPoint() }}>
            <text>荷点：</text>
            <text>{points.hebao}</text>
          </View> */}
        </View>
      </View>
      <View className="bottom-box">
        <Button
          type="primary"
          // openType={userInfo.needAuth ? 'getUserInfo' : ''}
          className="btn-normal xunhe"
          onClick={
            !userInfo.needAuth
              ? navigateTo.bind(null, { url: '/pages/shop-list/ShopList' })
              : checkAuth.bind(
                  null,
                  navigateTo.bind(null, { url: '/pages/shop-list/ShopList' })
                )
          }
          // onGetUserInfo={
          //   checkAuth.bind(
          //     null,
          //     () => navigateTo({url: "/pages/shop-list/ShopList"})
          //     )
          //   }
        ></Button>
        <Button
          type="primary"
          // openType={userInfo.needAuth ? 'getUserInfo' : ''}
          className="btn-pk"
          // onClick={onOutClick}
          onClick={
            !userInfo.needAuth
              ? showModal.bind(null, 'pkRulesModal', { show: true })
              : checkAuth.bind(null, () => showModal('pkRulesModal'))
          }
          // onGetUserInfo={checkAuth.bind(null, () => showModal('pkRulesModal'))}
        >
          {/* <Text>发起</Text>
          <Text>游戏PK</Text> */}
        </Button>
        <Button
          type="primary"
          className="btn-normal rule"
          onClick={() => showModal('rules')}
        ></Button>
      </View>
      {/* 弹窗 */}
      {/* 活动规则 */}
      <Rules show={modal.rules.show} onClose={() => hideModal('rules')} />
      {/* 新春荷包 */}
      <XinchunModal
        show={modal.xinchunModal.show}
        condition={modal.xinchunModal.condition}
        award={modal.xinchunModal.award}
        onClose={() => hideModal('xinchunModal')}
      />
      {/* 荷塘建筑、选择pk建筑 */}
      {/* pk规则 */}
      <PkRulesModal
        show={modal.pkRulesModal.show}
        onClose={() => hideModal('pkRulesModal')}
        onPkClick={onJoinClick}
        onRecordClick={onRecordClick}
      />
      {/* 选择pk手势 */}
      <ChooseGestrueModal
        show={modal.gestrueModal.show}
        condition={modal.gestrueModal.condition}
        cards={cards}
        onSubmit={onChooseGestrue}
        onClose={() => hideModal('gestrueModal')}
      />

      {/* pk信息 */}
      <PkInfoModal
        show={modal.pkInfoModal.show}
        onPk={onPkSoonClick}
        pkInfo={pkInfo}
        onClose={() => hideModal('pkInfoModal')}
      />
      {/* pk记录 */}
      <PkRecordModal
        show={modal.pkRecordModal.show}
        condition={modal.pkRecordModal.condition}
        history={history}
        myHistory={myHistory}
        handler={{ getHistory, getMyHistory }}
        onClose={() => {
          hideModal('pkRecordModal')
          resetHistory()
        }}
      />
      {/* 金牛荷包 */}
      <JinNiuModal
        show={modal.jinniuModal.show}
        condition={modal.jinniuModal.condition}
        award={modal.jinniuModal.award}
        shopInfo={modal.jinniuModal.shopInfo}
        onClose={() => hideModal('jinniuModal')}
      />
      {/* 荷点 */}
      <PkHedianModal
        show={modal.pkHedianModal.show}
        condition={modal.pkHedianModal.condition}
        history={hedian}
        handler={getHedian}
        onClose={() => {
          hideModal('pkHedianModal', {
            show: false,
            condition: 0,
            award: {},
            shopInfo: {}
          })
          setHedian([])
        }}
      />
      {/* 荷包*/}
      {/* <PkHebaoModal
        show={modal.pkHebaoModal.show}
        condition={modal.pkHebaoModal.condition}
        history={hebao}
        handler={getHebao}
        onClose={() => {
          hideModal('pkHebaoModal', { show: false, condition: 0, award: {}, shopInfo: {} })
          setHebao([])
        }
        }
      /> */}
      <XianziModal
        show={modal.xianziModal.show}
        marker={modal.xianziModal.markerInfo}
        condition={modal.xianziModal.condition}
        onClose={() => {
          hideModal('xianziModal', {
            show: false,
            markerInfo: {},
            condition: 0
          })
          xianzi &&
            xianzi.id &&
            showModal('xianziPkModal', { show: true, markerInfo: xianzi })
        }}
      />
      <XianziPkModal
        show={modal.xianziPkModal.show}
        marker={modal.xianziPkModal.markerInfo}
        onClose={() =>
          hideModal('xianziPkModal', { show: false, markerInfo: {} })
        }
      />
      <PointInfo
        info={pointInfo}
        onClose={setPointInfo}
        setModalStatus={setModalStatus}
      />
    </View>
  )
}
