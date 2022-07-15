import React, { useState } from 'react'
import { getData, setData } from '@/store/store'
import { useDidShow } from '@tarojs/taro'
import { IMAGE_RESOURCES, getImage } from '@/resource.map'
import { IResources } from '@/types/resources'
import './Preload.scss'

export async function preloadImages() {
  const planB = {}
  let ret = {}
  for (let i in IMAGE_RESOURCES) {
    const src = getImage(i)
    // images.push(getImageInfo({ src }))
    // imageKeys.push(i)
    planB[i] = {
      path: src,
      originUrl: src
    }
  }
  // try {
  //   const result = await Promise.all(images)
  //   result.forEach((item, index) => {
  //     // @ts-ignore
  //     item.originUrl = getImage(imageKeys[index])
  //     ret[imageKeys[index]] = item
  //   })
  // } catch (e) {
  //   // 预加载图片失败， 保底使用网络图片
  //   ret = planB
  // }
  ret = planB
  return ret
}
interface IPreloadProps {
  onReady: (result: IResources) => void
}
Preload.defaultProps = {
  onReady: () => { }
}
export function Preload(props: IPreloadProps) {
  const [show, setShow] = useState(true)
  useDidShow(() => {
    // if(getData('images')) return
    preloadImages().then((res: IResources) => {
      setData('images', res)
      setShow(false)
      props.onReady(res)
    })
  })
  // if (!show) {
  //   return (<Text></Text>)
  // }
  // return (
  //   <View className="preload-wrapper">
  //     <Text>正在初始化...</Text>
  //   </View>
  // )
  return null
}