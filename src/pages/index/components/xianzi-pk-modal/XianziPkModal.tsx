import React from 'react'
import { IXianzi } from '@/service'
import { View, Image } from '@tarojs/components'
import { Popup } from '@/components'
import { getResource } from '@/utils'
import { setData } from '@/store/store'
import { navigateTo } from '@tarojs/taro'
import './XianziPkModal.scss'

interface IXianziModalProps {
  show: boolean
  marker: IXianzi
  onClose: () => void
}
XianziPkModal.defaultProps = {
  show: true,
  marker: {},
  onClose: () => {}
}
export default function XianziPkModal(props: IXianziModalProps) {
  const { show, onClose } = props
  const bg = getResource('bgConfirm')
  const iconTipsXianzi = getResource('iconXianzi')
  const btnPk = getResource('btnPkSoon')
  const lbsTipsXianzi = getResource('lbsTipsXianzi')
  const lbsXianziPkBg = getResource('lbsXianziPkBg')
  const onPk = () => {
    setData('pkinfo', props.marker)
    navigateTo({
      url: '/pages/pk/pk'
    })
    props.onClose()
  }
  return (
    <Popup show={show} onClose={onClose} showClose={false} full>
      <View className="xianzi-pk-modal">
        <Image src={lbsXianziPkBg.path} className="xianzi-pk-bg"></Image>
        <View className="xianzi-pk-tips">
          尊敬的用户，您附近出现了稀有荷花仙子，向它发起挑战，胜利则可获得宝藏道具，且有机会获得荷点。
        </View>
        <Image
          src={btnPk.path}
          className="xianzi-pk-btn"
          onClick={onPk}
        ></Image>
        <Image src={lbsTipsXianzi.path} className="tips-xianzi"></Image>
      </View>
    </Popup>
  )
}
