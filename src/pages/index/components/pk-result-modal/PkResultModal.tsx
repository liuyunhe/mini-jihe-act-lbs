import { Popup } from '@/components'
import { getImage } from '@/resource.map'
import { IPkNpc } from '@/service'
import { getResource } from '@/utils'
import { View, Image, Text } from '@tarojs/components'
import { navigateBack, showToast } from '@tarojs/taro'
import React, { useState } from 'react'
import './PkResultModal.scss'

interface IPkResultModalProps {
  show: boolean
  condition: number
  award: IPkNpc
  onClose: () => void
}
PkResultModal.defaultProps = {
  show: false,
  // -1-挑战仙子失败, 0-挑战普通用户失败 1-中奖
  condition: 0,
  award: {
    awardPatch: {}
  },
  onClose: () => {}
}
export default function PkResultModal(props: IPkResultModalProps) {
  const [text, setText] = useState('')
  const bgFailed = getImage('bgPkFail')
  const bgXianziFail = getImage('bgPkXianziFail')
  const bgSuccess = getImage('bgPkSuccess')
  const btnKnow = getImage('btnKnowDraw')
  const btnGet = getImage('btnGetQuick')
  const btnGet2 = getImage('btnGetQuick2')
  const bgPkAwardText = getImage('bgPkAwardText')
  const iconPlus = getImage('iconPlus')
  const iconHeqi = getImage('iconHeqi')
  const bgPatchShine = getImage('bgPatchShine')
  const bgPkAwardTextSmall = getImage('bgPkAwardTextSmall')
  const isWinDouble =
    props.award.awardPatch &&
    (props.award.awardValue || props.award.givenPoints)
  // const showNoAward = props.condition !== 1
  const bgPath =
    props.condition === -1
      ? bgXianziFail
      : props.condition === 0
      ? bgFailed
      : bgSuccess

  const getAwardText = (condition: number, award: IPkNpc): string => {
    let awardText = ''
    if (condition === 1) {
      awardText = `宝藏道具-${award.awardPatch.patchName}`
      if (award.awardValue || award.givenPoints) {
        awardText += `,${award.awardValue || award.givenPoints}荷点`
      }
    } else if (condition === 0) {
      awardText = `-${award.minusPoints}荷点`
    }
    return awardText
  }
  const onGet = () => {
    showToast({ title: '领取成功' })
    props.onClose()
    setTimeout(() => {
      navigateBack({ delta: 1 })
    }, 1000)
  }
  const onClose = () => {
    props.onClose()
    navigateBack({ delta: 1 })
  }
  return (
    <Popup show={props.show} onClose={props.onClose} showClose={false}>
      {!isWinDouble && (
        <View
          className={`result-modal-container ${props.condition !== 1 &&
            !isWinDouble &&
            'no-award'}`}
        >
          <Image
            src={bgPath}
            className={`modal-bg,${props.condition === -1 && 'xianzi'}`}
          ></Image>

          {props.condition === 1 && (
            <Image
              className="award-patch"
              src={props.award.awardPatch.smallImg}
              mode="aspectFit"
            ></Image>
          )}
          {props.condition !== -1 && (
            <View className="award-box">
              <Text>{getAwardText(props.condition, props.award)}</Text>
            </View>
          )}

          {props.condition !== 1 && (
            <Image
              src={btnKnow}
              className={`btn-know ${props.condition === -1 && 'xianzi-btn'}`}
              onClick={onClose}
            ></Image>
          )}
          {props.condition === 1 && (
            <Image src={btnGet} className="btn-know" onClick={onGet}></Image>
          )}
        </View>
      )}
      {isWinDouble && (
        <View className="win-double-wrapper">
          <View className="win-double-title">
            <Image
              className="win-double-title-img"
              src="https://qrmkt.oss-cn-beijing.aliyuncs.com/common/jihe2021/hthj/win-double-title-img.png"
              mode="widthFix"
            ></Image>
          </View>
          <View className="double-award-box">
            <View className="double-award-patch-item">
              <Image
                className="hy"
                src="https://qrmkt.oss-cn-beijing.aliyuncs.com/common/jihe2021/hthj/hy.png"
              ></Image>
              <View
                className="double-award-patch-img"
                style={`background-image: url(${bgPatchShine})`}
              >
                <Image src={props.award.awardPatch.smallImg}></Image>
              </View>
              <View
                className="double-award-text"
                // style={`background-image: url(${bgPkAwardTextSmall})`}
              >
                <Text>
                  {getAwardText(props.condition, props.award).split(',')[0]}
                </Text>
              </View>
            </View>
            <Image src={iconPlus} className="double-award-plus"></Image>
            <View className="double-award-patch-item">
              <Image
                className="hy"
                src="https://qrmkt.oss-cn-beijing.aliyuncs.com/common/jihe2021/hthj/hy.png"
              ></Image>
              <View
                className="double-award-patch-img"
                style={`background-image: url(${iconHeqi})`}
              ></View>
              <View
                className="double-award-text"
                // style={`background-image: url(${bgPkAwardTextSmall})`}
              >
                <Text>
                  {getAwardText(props.condition, props.award).split(',')[1]}
                </Text>
              </View>
            </View>
          </View>
          <Image src={btnGet2} className="btn-get" onClick={onGet}></Image>
        </View>
      )}
    </Popup>
  )
}
