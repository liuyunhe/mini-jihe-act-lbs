import React from 'react'
import { View, Button, Icon } from '@tarojs/components'
import { openLocation } from '@tarojs/taro'
import { IShop } from '@/service'
import './PointInfo.scss'


interface IPointInfoProps {
  info: IShop,
  onClose: (info: IShop) => void,
  setModalStatus: (modalStatus: boolean) => void
}
PointInfo.defaultProps = {
  info: {},
  onClose: () => { },
  setModalStatus: () => {}
}
export default function PointInfo(props: IPointInfoProps) {
  const transDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${distance}m`
    }
    // 大于1000m，返回四舍五入按km换算
    return `${Math.round(distance / 1000)}km`
  }
  const open = () => {
    openLocation({ 
      name: props.info.shopName, 
      longitude: props.info.lng, 
      latitude: props.info.lat,
      address: props.info.shopAddr
    })
  }
  const onClose = () => {
    props.setModalStatus(false)
    props.onClose.call(null, { title: '', distance: 0, lat: 0, lng: 0, shopName: "" })
  }
  if (!props.info.shopName) {
    return null
  }
  props.setModalStatus(true)
  return (
    <View className='point-wrapper slide-up'>
      <Icon type='cancel' size='30' color='#999' className='icon' onClick={onClose}></Icon>
      <View className='title'>{props.info.shopName}</View>
      <View className='distance'>该地点距您{transDistance(props.info.distance!)}</View>
      <View className='info-wrapper'>
        <View className='left'>
          <View className='tips'>走进店铺，可领取奖励；购买产品后凭收据参与线上活动，有机会获得超值大礼包</View>
        </View>
        <View className='right'>
          <Button size='mini' type='primary' onClick={open}>马上去</Button>
        </View>
      </View>
    </View>
  )
}