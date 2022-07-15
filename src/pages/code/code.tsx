import React from 'react'
import { setClipboardData, login, showToast, getUserInfo, reLaunch, redirectTo } from '@tarojs/taro'
import { BaseEventOrig, Button, View, Image } from '@tarojs/components'
import { ButtonProps } from '@tarojs/components/types/Button'
import { checkAuth } from '@/utils/auth'
import { getData } from '@/store/store'

export default function Code() {
  function onClick() {
    login().then(({ code }) => {
      setClipboardData({ data: code }).then(() => {
        showToast({
          title: '复制成功',
          icon: 'none'
        })
      })
    })
  }
  const auth = async (e: BaseEventOrig<ButtonProps.onGetUserInfoEventDetail>) => {
    console.log(e)
    const { code } = await login()
    const detail = await getUserInfo()
    setClipboardData({ data: JSON.stringify({ code, userinfo: detail }) })
  }
  const onLoginSuccess = () => {
    console.log(getData('userInfo'))
  }
  const onBack = () => {
    redirectTo({
      url: '/pages/index/index'
    })
  }
  return (
    <View>
      <Button onClick={onClick} type='primary' style='margin-top: 20px'>复制code</Button>
      <Button openType='getUserInfo' onGetUserInfo={checkAuth.bind(null, onLoginSuccess)} type='primary' style='margin-top: 20px'>授权</Button>
      <Button onClick={onBack} type='primary' style='margin-top: 20px'>back</Button>
      <Image mode='widthFix' style='width: 100%;background:#eeeeee' src='https://qrmkt.oss-cn-beijing.aliyuncs.com/common/jihe2021/patchs/2_04_big.png' />
      {/* <Image mode="widthFix" style="width: 100%;background:#eeeeee" src="https://xiaohuioss.oss-cn-beijing.aliyuncs.com/lbs-share-image.jpeg?v=22"/> */}
    </View>
  )
}