import { getImage } from '@/resource.map'
import { getSalersNearbyList, ISalersNearby } from '@/service'
import { location } from '@/utils'
import { View, Image } from '@tarojs/components'
import {
  hideLoading,
  openLocation,
  showLoading,
  showToast,
  stopPullDownRefresh,
  useDidHide,
  usePullDownRefresh
} from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import NodataImage from './lbs-icon-no-data.png'
import './ShopList.scss'

// 获取商家数据
const useShop = () => {
  const initialState: ISalersNearby[] = []
  const [shop, setShop] = useState(initialState)
  const [first, setFirst] = useState(true)
  const getShop = async (isRefresh = false) => {
    showLoading({ title: '加载中...', mask: true })
    const params = {
      lat: 0,
      lng: 0
    }
    // try {
    location(async (res) => {
      params.lat = res.latitude
      params.lng = res.longitude
      // const params = {
      //   lat: latitude,
      //   lng: longitude
      // }
      // }catch(e) {

      // }
      let {
        data: { data, msg, code }
      } = await getSalersNearbyList(params)
      if (code == 200) {
        setShop(isRefresh ? data : shop.concat(data))
        setFirst(false)
        hideLoading()
        // stopPullDownRefresh()
        return
      }
      hideLoading()
      showToast({ title: msg, icon: 'none' })
    })
  }
  return { shop, first, getShop, setShop }
}
const transDistance = (distance: number): string => {
  if (distance < 1000) {
    return `${Math.round(distance)}m`
  }
  // 大于1000m，返回四舍五入按km换算
  return `${Math.round(distance / 1000)}km`
}
export default function ShopList() {
  const locationIcon = getImage('iconLocationGreen')
  const { shop, first, getShop } = useShop()
  useEffect(() => {
    getShop()
  }, [])
  // usePullDownRefresh(() => {
  //   getShop(true)
  // })
  function onItemClick(shopItem: ISalersNearby) {
    openLocation({
      latitude: shopItem.lat,
      longitude: shopItem.lng,
      name: shopItem.shopName,
      address: shopItem.shopAddr
    })
  }
  return (
    <View className="shop-list-wrapper">
      {(!shop || !shop.length) && !first && (
        <View className="list-no-data">
          <Image src={NodataImage} mode="widthFix"></Image>
          <View>当前位置无零售户数据，可参与荷包活动领取奖励</View>
        </View>
      )}
      {shop.map((item, index) => (
        <View
          className="shop-list-item"
          key={index}
          onClick={onItemClick.bind(null, item)}
        >
          <View className="shop-info">
            <View className="shop-name">{item.shopName}</View>
            <View className="shop-addr">{item.shopAddr}</View>
          </View>
          <View className="shop-location">
            <Image className="location-icon" src={locationIcon}></Image>
            <View className="location-distance">
              {transDistance(item.distance)}
            </View>
            <View className="location-distance">前往</View>
          </View>
        </View>
      ))}
    </View>
  )
}
