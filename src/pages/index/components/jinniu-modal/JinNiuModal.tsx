import { Popup } from '@/components'
import { IJinniuPackageData, IShop } from '@/service'
import { getResource } from '@/utils'
import { View, Image } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import React, { useState } from 'react'
import './JinNiuModal.scss'

interface IJinNiuModalProps {
  show: boolean
  condition: number
  award: IJinniuPackageData
  shopInfo: IShop
  onClose?: () => void
}
XinchunModal.defaultProps = {
  show: false,
  // 0-未中奖， 1-牛气+建筑， 2-牛气， 3-建筑
  condition: 0,
  award: {},
  shopInfo: {},
  onClose: () => {}
}
export default function XinchunModal(props: IJinNiuModalProps) {
  const bg = getResource('bgHedianGet')
  const bgNoAward = getResource('bgHedianGot')
  const btnKnow = getResource('btnKnowDraw')
  const btnGet = getResource('btnGetQuick')
  const showNoAward = props.condition === 0
  const bgPath = showNoAward ? bgNoAward.path : bg.path
  const onGet = () => {
    props.onClose && props.onClose()
    showToast({ title: '领取成功' })
  }
  const getAwardText = () => {
    console.log(props)
    let text = ''
    // if (props.award.points) {
    //   text += `${props.award.points}荷点`
    //   if (props.condition == 1) {
    //     text += ` + `
    //   }
    // }
    // if (props.award.hebaoNum) {
    //   text += `${props.award.hebaoNum}个荷包`
    // }
    if (props.award.points) {
      text += `${props.award.points}个荷点`
    }
    return text
  }
  return (
    <Popup show={props.show} onClose={props.onClose} showClose={false}>
      <View
        className={`jinniu-modal-container ${props.condition === 2 && 'award'}`}
      >
        <Image src={bgPath} className="modal-bg" mode="widthFix"></Image>
        <View
          className={`modal-body ${
            props.condition === 2 || props.condition === 3 ? 'single' : ''
          } ${props.condition === 0 && 'no-award'}`}
        >
          {props.condition !== 0 && (
            <View className="shop-box">
              进入“{props.shopInfo.shopName}
              ”购买产品，凭收据或购买图片参与线上活动，有机会获得超值大礼包，中奖概率接近百分百。
            </View>
          )}
          {props.condition === 0 && (
            <View
              className={`shop-box ${props.condition == 0 ? 'no-award' : ''}`}
            >
              进入“{props.shopInfo.shopName}
              ”购买产品，凭收据或购买图片参与线上活动，有机会获得超值大礼包，中奖概率接近百分百。若已参与请忽略该信息。
            </View>
          )}
          <View className="icon-box">
            {props.condition !== 0 && (
              <View className="award-box">{getAwardText()}</View>
            )}
            {/* {showNiuqi && <Image src={iconHedian.path} mode='widthFix' style={`width: ${niuqiSize}rpx`}></Image>}
            {showPlus && <Image src={iconPlus.path} mode='widthFix' style='width: 39rpx'></Image>}
            {showBuilding && <Image src={iconHebao.path} mode='widthFix' style={`width: ${buildingSize}rpx`} className='icon-building'></Image>} */}
          </View>
          {/* {props.condition !== 0 && <View className='award-box'>{getAwardText()}</View>} */}
        </View>
        {props.condition !== 0 && (
          <Image
            src={btnGet.path}
            mode="widthFix"
            className="btn-get"
            onClick={onGet}
          ></Image>
        )}
        {props.condition === 0 && (
          <Image
            src={btnKnow.path}
            mode="widthFix"
            className="btn-know"
            onClick={props.onClose}
          ></Image>
        )}
      </View>
    </Popup>
  )
}
