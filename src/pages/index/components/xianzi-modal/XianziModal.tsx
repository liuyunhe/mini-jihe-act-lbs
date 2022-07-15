import React from 'react'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { IXianzi } from '@/service'
import { Popup } from '@/components'
import { getResource } from '@/utils'
import { setStorageSync } from '@tarojs/taro'
import './XianziModal.scss'

interface IXianziModalProps {
  show: boolean
  marker: IXianzi
  condition: number
  onClose: () => void
}
XianziModal.defaultProps = {
  show: true,
  marker: {},
  condition: 0,
  onClose: () => {}
}
export default function XianziModal(props: IXianziModalProps) {
  const bgBoxXianzi = getResource('bgConfirm')
  const iconTipsXianzi = getResource('iconXianzi')
  const btnKnow = getResource('btnKnown')
  const btnPkSoon = getResource('btnPkSoon')
  const tips = [
    {
      type: 'normal',
      text: '荷花仙子:\n欢迎来到盛夏观荷园，集合来赏荷-采荷寻芳踪活动~'
    }
    // { type: 'normal', text: '你知道吗？自古就有一个美好的节日，男女老幼都要乘船观赏莲花，同时借着碧波清风纳凉，那就是每年农历六月二十四日，荷花的生日，雅称“荷诞日”。\n' },
    // { type: 'normal', text: '你看这一路上遍地都是荷花，少侠请跟着小仙一起，探寻荷花的踪迹吧~\n' },
    // { type: 'normal', text: '这些荷花里也许还藏着珍贵的' },
    // { type: 'keyword', text: '荷包' },
    // { type: 'normal', text: '和' },
    // { type: 'keyword', text: '荷点' },
    // { type: 'normal', text: '，在后面的游戏里一定有大用处，快快收好！' }
  ]
  // const xianziTips = [
  //   { type: 'normal', text: '少侠少侠，快看这附近有好多荷包和牛气哦！看得小仙我都跃跃欲试了！少侠要不要跟小仙比试一场呢，赢了的话，小仙也有好礼奉上哦～' }
  // ]
  const onClose = () => {
    setStorageSync('IS_FIRST', false)
    props.onClose()
  }
  return (
    <Popup show={props.show} onClose={props.onClose} showClose={false} full>
      <View className="xianzi-container">
        <Image src={bgBoxXianzi.path} className="box-xianzi"></Image>
        {/* {props.condition === 1 && <Image src={btnPkSoon.path} className='pk-btn' onClick={onPk}></Image>} */}
        {props.condition === 0 && (
          <Image
            src={btnKnow.path}
            className="know-btn"
            onClick={onClose}
          ></Image>
        )}
        <ScrollView className="tips-text" scrollY>
          {props.condition == 0 &&
            tips.map((item, index) => {
              if (item.type === 'line') {
                return <View className={item.type}>{item.text}</View>
              }
              return (
                <Text className={item.type} key={index}>
                  {item.text}
                </Text>
              )
            })}
          {/* {props.condition == 1 && xianziTips.map((item, index) => {
            return (<Text className={item.type} key={index}>{item.text}</Text>)
          })} */}
        </ScrollView>
        <Image src={iconTipsXianzi.path} className="tips-xianzi jump"></Image>
      </View>
    </Popup>
  )
}
