import { Popup, ARadio } from '@/components'
import { IBuildingsData } from '@/service'
import { getResource } from '@/utils'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import React, { useState } from 'react'
import './ChooseGestrueModal.scss'

interface IGestrue {
  name: string
}
interface IChooseGestrueModalProps {
  show: boolean
  condition: number
  cards: IBuildingsData[]
  onSubmit: (gestrue: number, nianhuo: number) => void
  onClose: () => void
}
interface INianhuoItem {
  icon: string
  count: number
  w: number
  h: number
  ml: number
  value: number
  name: string
}
ChooseGestrueModal.defaultProps = {
  show: false,
  condition: 0,
  cards: [],
  onSubmit: () => {},
  onClose: () => {}
}
export default function ChooseGestrueModal(props: IChooseGestrueModalProps) {
  const [gestrue, setGestrue] = useState(-1)
  const bg = getResource('bgChooseGestrue')
  const stoneLeft = getResource('iconChooseGestureStone')
  const scissorsLeft = getResource('iconChooseGestureSissors')
  const clothLeft = getResource('iconChooseGestureCloth')
  const btnSubmit = getResource('btnSubmit')
  const btnPkSoone = getResource('btnSubmit')
  const bgChooseNianhuo = getResource('bgChooseNianhuo')
  const pkLatter = getResource('btnPkLatter')
  const btnChooseNianhuo = getResource('btnChooseNianhuo')
  const textChooseNianhuo = getResource('textChooseNianhuo')
  const textChooseGesture = getResource('textChooseGesture')
  const btnPkLatterNianhuo = getResource('btnPkLatterNianhuo')

  const [showNianhuo, setShowNianhuo] = useState(props.condition === 0)
  const [showGesture, setShowGesture] = useState(props.condition === 1)
  const onClose = () => {
    setGestrue(-1)
    props.onClose()
  }
  const [nianhuo, setNinahuo] = useState(0)
  const onNianhuoClick = (nianhuoItem: IBuildingsData) => {
    if (nianhuoItem.patchNum <= 0) {
      return showToast({
        title: `您尚未拥有年货“${nianhuoItem.patchName}”`,
        icon: 'none'
      })
    }
    return setNinahuo(nianhuoItem.patchId)
  }
  const onNianhuoSubmit = () => {
    if (!nianhuo) {
      return showToast({
        title: '请选择年货',
        icon: 'none'
      })
    }
    setShowGesture(true)
    setShowNianhuo(false)
  }
  const onCloseClick = () => {
    setGestrue(-1)
    setNinahuo(-1)
    setShowGesture(false)
    setShowNianhuo(true)
    props.onClose()
  }
  const onSubmitClick = () => {
    onCloseClick()
    props.onSubmit(gestrue, nianhuo)
  }

  const gestrueMap = [
    {
      icon: scissorsLeft.path,
      value: 2
    },
    {
      icon: stoneLeft.path,
      value: 1
    },
    {
      icon: clothLeft.path,
      value: 3
    }
  ]
  return (
    <Popup
      show={props.show}
      showClose
      onClose={onCloseClick}
      full={showNianhuo ? true : false}
    >
      <View
        style={`background-image: url(${
          showNianhuo ? bgChooseNianhuo.path : bg.path
        })`}
        className={
          ('gestrue-modal-container',
          showGesture
            ? 'gestrue-modal-container choose'
            : 'gestrue-modal-container')
        }
      >
        {/* <Image src={bg.originUrl} className='modal-bg' mode='widthFix'></Image> */}
        <View className="modal-body">
          {/* { showNianhuo && <Image src={textChooseNianhuo.path} className='text-title nianhuo'></Image>} */}
          {/* { showGesture && <Image src={textChooseGesture.path} className='text-title gesture'></Image>} */}
          {showNianhuo && (
            <ScrollView className="nianhuo-box" scrollY>
              {/* {
              nianhuoMap.map((nianhuoItem, index) => 
                (
                <View 
                  className='nianhuo-item'
                  key={nianhuoItem.value}
                  onClick={() => onNianhuoClick(nianhuoItem)}
                  style={`
                    background-image: url(${nianhuoBg.path});
                    margin-left: ${nianhuoItem.ml}rpx;
                    margin-top: ${index > 2 ? 110 : 0}rpx
                  `}
                >
                  <View className='nianhuo-icon'>
                    <Image 
                      src={nianhuoItem.icon} 
                      style={`
                      width: ${nianhuoItem.w}rpx;
                      height: ${nianhuoItem.h}rpx
                    `}
                    ></Image>
                  </View>
                  <View className='nianhuo-radio'>
                    <ARadio 
                      size={30}
                      onClick={() => onNianhuoClick(nianhuoItem)} 
                      checked={gestrue === nianhuoItem.value}
                    ></ARadio>
                  </View>
                  <View className='nianhuo-name'>
                    <Text>{nianhuoItem.name}</Text>
                  </View>
                  <View className='nianhuo-count'>{nianhuoItem.count}</View>
                </View>
                )
              )
            } */}
              {props.cards.map((nianhuoItem, index) => (
                <View
                  className="nianhuo-item"
                  key={nianhuoItem.patchId}
                  onClick={() => onNianhuoClick(nianhuoItem)}
                  // style={`
                  //   background-image: url(${nianhuoBg.path});
                  // `}
                >
                  <View className="nianhuo-icon">
                    <Image src={nianhuoItem.smallImg}></Image>
                  </View>
                  <View className="nianhuo-name">
                    <Text>{nianhuoItem.patchName}</Text>
                  </View>
                  <View className="nianhuo-radio">
                    <ARadio
                      size={30}
                      onClick={() => onNianhuoClick(nianhuoItem)}
                      checked={nianhuo === nianhuoItem.patchId}
                    ></ARadio>
                  </View>

                  <View className="nianhuo-count">{nianhuoItem.patchNum}</View>
                </View>
              ))}
            </ScrollView>
          )}
          {showGesture && (
            <View className="gestrue-box">
              {gestrueMap.map((item) => (
                <View
                  className="gestrue-item"
                  onClick={setGestrue.bind(null, item.value)}
                  key={item.value}
                >
                  <View className="gestrue-icon">
                    <Image src={item.icon}></Image>
                  </View>
                  <View className="gestrue-radio">
                    <ARadio
                      size={30}
                      onClick={setGestrue.bind(null, item.value)}
                      checked={gestrue === item.value}
                    ></ARadio>
                  </View>
                </View>
              ))}
            </View>
          )}
          <View className="button-wrapper">
            {showNianhuo && (
              <Image
                src={btnChooseNianhuo.path}
                className="btn-choose first-child"
                onClick={onNianhuoSubmit}
              />
            )}
            {showNianhuo && (
              <Image
                src={btnPkLatterNianhuo.path}
                className="btn-choose"
                onClick={onCloseClick}
              />
            )}
            {showGesture && (
              <View className="button-wrapper">
                <Image
                  src={btnSubmit.path}
                  className="btn-submit"
                  onClick={onSubmitClick}
                />
                <Image
                  src={pkLatter.path}
                  className="btn-latter"
                  onClick={onCloseClick}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </Popup>
  )
}
