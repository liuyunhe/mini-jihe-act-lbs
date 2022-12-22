import { Popup } from '@/components'
import { IXinchunPackage, IXinchunPackageData } from '@/service'
import { getResource } from '@/utils'
import { View, Image } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import React, { useState } from 'react'
import './XinchunModal.scss'

interface IXinchunModalProps {
  show: boolean
  condition: number
  award: IXinchunPackageData
  onClose?: () => void
}
XinchunModal.defaultProps = {
  show: false,
  // 0-未中奖， 1-牛气+建筑， 2-牛气， 3-建筑
  condition: 0,
  award: {
    imageUrl: '',
    text: '108牛气值+1个荷塘建筑'
  },
  onClose: () => {}
}
export default function XinchunModal(props: IXinchunModalProps) {
  const bg = getResource('bgGetHebao')
  const bgNoAward = getResource('bgNoAward')
  const iconNiuqi = getResource('iconHebao')
  const iconPlus = getResource('iconPlusGreen')
  const iconHedian = getResource('iconHedian')
  const btnGet = getResource('btnGetQuick')
  const btnKnown = getResource('btnKnowDraw')
  const showNiuqi = props.condition === 1 || props.condition === 2
  // const niuqiSize = props.condition === 1 ? 215 : 323
  const niuqiSize = 157
  const showPlus = props.condition === 1
  const showBuilding = props.condition === 3 || props.condition === 1
  // const buildingSize = props.condition === 1 ? 166 : 246
  const buildingSize = 166
  const showNoAward = props.condition === 0
  const bgPath = showNoAward ? bgNoAward.path : bg.path
  const onGet = () => {
    props.onClose && props.onClose()
    showToast({ title: '领取成功' })
  }
  const getAwardText = () => {
    let text = ''
    // if (props.award.points) {
    //   text += `${props.award.points}荷气值`
    //   if (props.condition == 1) {
    //     text += ` + `
    //   }
    // }
    // if (props.award.hebaoNum) {
    //   text += `${props.award.hebaoNum}荷包`
    // }
    if (props.award.points) {
      text += `${props.award.points}荷气值`
    }

    return text
  }
  return (
    <Popup
      show={props.show}
      onClose={props.onClose}
      showClose={props.condition === 0}
    >
      <View className="xinchun-modal-container">
        <Image src={bgPath} className="modal-bg" mode="widthFix"></Image>
        <View
          className={`modal-body single ${
            props.condition === 2 || props.condition === 3 ? 'single' : ''
          }`}
        >
          <View className="award-box">
            {getAwardText()}
            {/* <Image src={iconHedian.path} mode='widthFix' style={`width: ${buildingSize}rpx;height: ${buildingSize}rpx`} className='icon-building'></Image> */}
            {/* {showBuilding && <Image src={iconHedian.path} mode='widthFix' style={`width: ${buildingSize}rpx;height: ${buildingSize}rpx`} className='icon-building'></Image>}
            {showPlus && <Image src={iconPlus.path} mode='widthFix' style='width: 39rpx'></Image>} */}
            {/* <Image src={iconPlus.path} mode='widthFix' style='width: 39rpx'></Image> */}
            {/* <Image src={iconNiuqi.path} mode='widthFix' style={`width: ${niuqiSize}rpx`}></Image> */}
            {/* {showNiuqi && <Image src={iconNiuqi.path} mode='widthFix' style={`width: ${niuqiSize}rpx`}></Image>} */}
          </View>
          {/* {props.condition !== 0 && <View className='award-box'>{getAwardText()}</View>} */}
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
              src={btnKnown.path}
              mode="widthFix"
              className="btn-known"
              onClick={props.onClose}
            ></Image>
          )}
          {/* <View className='award-box'>388荷气值 + 1个荷包</View>
          <Image src={btnGet.path} mode='widthFix' className='btn-get' onClick={onGet}></Image> */}
        </View>
      </View>
    </Popup>
  )
}
