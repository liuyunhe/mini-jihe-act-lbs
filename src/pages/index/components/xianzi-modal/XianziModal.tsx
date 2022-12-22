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
      text: '少侠请留步，小仙是荷花仙子～\n'
    },
    {
      type: 'normal',
      text:
        '岁岁年年春节至，新春礼享送福利，集合集荷赢好礼！欢迎来到【好韵年年】，少侠你看，这一路上遍地都是荷包，还请你跟着小仙一起，探寻他们踪迹吧~这些荷包里也许还藏着珍贵的'
    },
    // { type: 'normal', text: '你看这一路上遍地都是荷花，少侠请跟着小仙一起，探寻荷花的踪迹吧~\n' },
    // { type: 'normal', text: '这些荷花里也许还藏着珍贵的' },
    // { type: 'keyword', text: '荷包' },
    // { type: 'normal', text: '和' },
    { type: 'keyword', text: '荷气值' },
    { type: 'normal', text: '哦，在后面的游戏里一定有大用处，快快收好！' }
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
