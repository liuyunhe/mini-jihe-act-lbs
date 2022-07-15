import { Popup } from '@/components'
import { IChallenge } from '@/service'
import { setData } from '@/store/store'
import { getResource } from '@/utils'
import { View, Image } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import React, { useState } from 'react'
import './PkInfoModal.scss'

interface IPkInfo {
  avatarUrl: string
  nickname: string
  date: string
  buildingPic: string
}
interface IPkInfoModalProps {
  show: boolean
  pkInfo: IChallenge
  onPk: (pkInfo: IChallenge) => void
  onClose: (pkInfo: IChallenge) => void
}
PkInfoModal.defaultProps = {
  show: false,
  pkInfo: {},
  onPk: () => {},
  onClose: () => {}
}
export default function PkInfoModal(props: IPkInfoModalProps) {
  const bg = getResource('bgPkerInfo')
  const btnPk = getResource('btnNianhuoPkSoon')
  const hebao = getResource('iconHebao')
  const nianhuoBg = getResource('bgNianhuo')
  const onPk = () => {
    setData('pkinfo', props.pkInfo)
    props.onClose(props.pkInfo)
    navigateTo({ url: '/pages/pk/pk' })
  }
  return (
    <Popup show={props.show} onClose={props.onClose} showClose>
      <View className="pkinfo-modal-container">
        <Image src={bg.path} className="modal-bg" mode="widthFix"></Image>
        <View className="modal-body">
          <View className="avatar-image">
            <Image
              src={props.pkInfo.npcHeadImg!}
              mode="aspectFit"
              className="avatar"
            ></Image>
          </View>
          <View className="nickname">{props.pkInfo.npcNickname}</View>
          {/* <View className='date'>{props.pkInfo.npcLaunchTime || props.pkInfo.ctime}</View> */}
          <Image
            className="building-image"
            src={props.pkInfo.patchPkImg as string}
            mode="widthFix"
          ></Image>

          <Image src={btnPk.path} className="btn-know" onClick={onPk}></Image>
        </View>
      </View>
    </Popup>
  )
}
