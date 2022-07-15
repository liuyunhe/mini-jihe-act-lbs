import {
  eventCenter,
  getUserProfile,
  login,
  showModal,
  showToast
} from '@tarojs/taro'
import {
  ILoginData,
  login as requestLogin,
  register as requestRegister
} from '@/service'
import { getData, setData } from '@/store/store'

export function checkAuth(callback: Function) {
  let userInfo: ILoginData = getData('userInfo')
  // if (!detail || !detail.iv || !detail.encryptedData) {
  //   showModal({ title: '提示', content: "需要允许授权才能使用此功能", showCancel: false, confirmText: '知道了' })
  //   return
  // }
  if (userInfo && !userInfo.needAuth) {
    return callback && callback(userInfo)
  }
  getUserProfile({ desc: '完善会员信息' })
    .then(({ iv, encryptedData }) => {
      ;(async () => {
        const { code } = await login()
        userInfo = (await auth({ iv, encryptedData, code })) as ILoginData
        return callback && callback(userInfo)
      })()
    })
    .catch((e) => {
      showModal({
        title: '提示',
        content: '需要允许授权才能使用此功能',
        showCancel: false,
        confirmText: '知道了'
      })
    })
  // (async () => {
  //   const { code } = await login()
  //   const { iv, encryptedData } = await getUserProfile({desc: '完善会员信息'})
  //   if (iv && encryptedData) {
  //     userInfo = await auth({ iv, encryptedData, code }) as ILoginData
  //     return callback && callback(userInfo)
  //   }
  // })()
}
export async function auth(
  params: {
    iv?: string
    encryptedData?: string
    code?: string
  } = {}
): Promise<ILoginData | undefined> {
  let code: string = ''
  if (!params.code) {
    code = (await login()).code
  }
  if (params.iv && params.encryptedData) {
    try {
      await requestRegister({ code, ...params })
    } catch (e) {
      console.error(e)
    }
    code = (await login()).code
  }
  const { data } = await requestLogin({ code })
  if (data.code != 200) {
    showToast({ title: data.msg, icon: 'none' })
    eventCenter.trigger('login', false)
    return
  }
  if (!data.data.needAuth) {
    setData('userInfo', data.data)
    eventCenter.trigger('login', data.data)
  }
  return data.data
}
