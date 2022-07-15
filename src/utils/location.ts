import { realtimeLog } from '@/utils/index'
import {
  onLocationChange,
  // @ts-ignore
  onLocationChangeError,
  startLocationUpdate,
  stopLocationUpdate,
  offLocationChange,
  // @ts-ignore
  offLocationChangeError,
  openSetting,
  showModal
} from '@tarojs/taro'

let isStarted = false
let locationCache = null
export function location(callback) {
  // if(isStarted) {
  //   return setTimeout(() => {
  //     return callback(locationCache)
  //   }, 1000);
  // }
  const onStartUpdateSuccess = (res) => {
    isStarted = true
    realtimeLog.info('允许授权位置信息...', res)
    console.log(res)
  }
  const onStartUpdateFail = (e) => {
    realtimeLog.error('拒绝授权位置信息:', e)
    showModal({
      title: '提醒',
      content:
        '授权位置信息，才能参与活动，请在设置中将“位置消息”设置为“仅在使用小程序期间”!',
      showCancel: false,
      confirmText: '去设置'
    }).then((modalRes) => {
      if (modalRes.confirm) {
        realtimeLog.info('拒绝授权位置信息，允许重试', modalRes)
        // 确定重试，打开设置
        openSetting()
      }
    })
  }
  const onChangeError = (e) => {
    realtimeLog.info('位置更新失败', e)
    console.log(e)
  }
  const onChangeSuccess = (res) => {
    console.log(res)
    realtimeLog.info('获取位置成功', res)
    callback(res)
    stopLocationUpdate()
    offLocationChange(onChangeSuccess)
    offLocationChangeError(onChangeError)
    // callback = throttle(callback, 5 * 60 * 1000)
  }

  // 注册监听
  startLocationUpdate({
    // @ts-ignore
    type: 'gcj02',
    success: onStartUpdateSuccess,
    fail: onStartUpdateFail
  })
  onLocationChange(onChangeSuccess)
  onLocationChangeError(onChangeError)
}
