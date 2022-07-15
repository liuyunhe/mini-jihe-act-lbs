import React, { useState } from 'react'
import { View, Image, OpenData } from '@tarojs/components'
import { getImage } from '@/resource.map'
import { getData } from '@/store/store'
import { ARadio } from '@/components'
import { IChallenge, IPkNpc, pkNpc } from '@/service'
import {
  eventCenter,
  hideLoading,
  showLoading,
  showToast,
  showModal as showConfirm
} from '@tarojs/taro'
import './pk.scss'
import { useMarkers, useModal } from '../index/hooks'
import PkResultModal from '../index/components/pk-result-modal/PkResultModal'

const initialInfoState: IChallenge = {}
export default function Pk() {
  // modal
  const { modal, showModal, hideModal, clearModal } = useModal(() => {})
  const [gestrue, setGestrue] = useState(0)
  const [pkFinished, setPkFinished] = useState(false)
  const [leftIcon, setLeftIcon] = useState('')
  const [rightIcon, setRightIcon] = useState('')

  const [pkinfo, setPkinfo] = useState(initialInfoState)

  // const bgPk = getImage('pkBg')
  const pkText = getImage('iconVs')
  const stoneLeft = getImage('gestrueStoneLeft')
  const stoneRight = getImage('gestrueStoneRight')
  const scissorsLeft = getImage('gestrueScissorsLeft')
  const scissorsRight = getImage('gestrueScissorsRight')
  const clothLeft = getImage('gestrueClothLeft')
  const clothRight = getImage('gestrueClothRight')
  const confirmBtn = getImage('btnConfirm')
  const pkInfo = getData('pkinfo')
  const xianziAvatar = getImage('iconAvatarDefault')
  const leftAvatarBg = getImage('iconPkerLeft')
  const rightAvatarBg = getImage('iconPkerRight')

  // const chooseText = getImage("textPkChooseTips")
  const stoneLeftChoose = getImage('iconChooseGestureStone')
  const scissorsLeftChoose = getImage('iconChooseGestureSissors')
  const clothLeftChoose = getImage('iconChooseGestureCloth')
  const materialPkTop = getImage('materialPkTop')
  const materialPkBottom = getImage('materialPkBottom')
  const headImg = wx.getStorageSync('headImg')
  const nickname = wx.getStorageSync('nickname')
  const bgPk = getImage('bgPk')
  if (!pkinfo || !pkinfo.id) {
    pkInfo && setPkinfo({ ...pkInfo })
  }

  const onConfirm = async () => {
    if (!gestrue) {
      return showToast({ title: '请选择您的手势', icon: 'none' })
    }
    function getGestrueIcon(getstrueValue: number, type: string) {
      if (getstrueValue == 1) {
        return type === 'right' ? stoneRight : stoneLeft
      } else if (getstrueValue == 2) {
        return type === 'right' ? scissorsRight : scissorsLeft
      } else if (getstrueValue == 3) {
        return type === 'right' ? clothRight : clothLeft
      }
    }
    function getCondition(data: IPkNpc): number {
      let condition = 0
      if (data.isWin) {
        condition = 1
      } else if (!data.isWin && pkinfo.type === 2) {
        condition = -1
      }
      return condition
    }
    showLoading({ title: '对手出拳中...' })
    const {
      data: { data, msg, code }
    } = await pkNpc({ challengeId: pkinfo.id!, gestureValue: gestrue })
    // const { data, msg, code } = {
    //   "code": 200,
    //   "msg": null,
    //   "data": {
    //     "rivalGesture": 3,
    //     "awardPatch": {
    //       "id": 8,
    //       "ctime": "2021-12-30 11:03:04",
    //       "cardId": 50,
    //       "patchId": 8,
    //       "img": "https://qrmkt.oss-cn-beijing.aliyuncs.com/common/jihe2021/patch2112/8.png",
    //       "miniImg": "https://qrmkt.oss-cn-beijing.aliyuncs.com/common/jihe2021/patch2112/s8.png",
    //       "innerOrder": 8,
    //       "smallImg": "https://qrmkt.oss-cn-beijing.aliyuncs.com/common/jihe2021/patch2112/s8.png",
    //       "patchName": "湖北热干面"
    //     },
    //     "isWin": true
    //   }
    // }
    //   const { data, msg, code } = {
    //     "code": "200",
    //     "msg": null,
    //     "data": {
    //         "rivalGesture": 1,
    //         "minusPoints": 68,  //扣除的荷点.
    //         "isWin": false
    //     }
    // }
    if (code == 200) {
      setPkFinished(true)
      hideLoading()
      const rivalGestrue = data.rivalGesture
      const myGestrue = gestrue
      setLeftIcon(getGestrueIcon(myGestrue, 'left')!)
      setRightIcon(getGestrueIcon(rivalGestrue, 'right')!)
      const condition = getCondition(data)
      // 根据输赢显示弹窗
      setTimeout(() => {
        showModal('pkResultModal', { show: true, condition, award: data })
      }, 1500)
      // 如果有牛气值，更新牛气值的显示
      if (data.isWin && data.awardValue) {
        eventCenter.trigger('pointsChange', data.awardValue)
      } else if (!data.isWin && data.minusPoints) {
        eventCenter.trigger('pointsChange', -data.minusPoints)
      }
    } else {
      hideLoading()
      await showConfirm({ title: '提示', content: msg, showCancel: false })
    }
  }
  return (
    <View className="pk-wrapper">
      {/* <Image src={bgPk} mode='widthFix' className='pk-bg'></Image> */}
      <View className="pk-bg" style={`background-image: url(${bgPk})`}>
        {/* <Image src={materialPkTop} className="pk-bg-top"></Image> */}
        {/* <Image src={materialPkBottom} className="pk-bg-bottom"></Image> */}
      </View>

      <View className="pkinfo-box">
        <View
          className="pk-user-info-box left"
          style={{ backgroundImage: `url(${leftAvatarBg})` }}
        >
          <View type="userAvatarUrl" className="avatar">
            <Image
              className="avatar-img"
              src={
                headImg ||
                'https://qrmkt.oss-cn-beijing.aliyuncs.com/common/jihe2021/hthj/head-icon-defualt.png'
              }
            ></Image>
          </View>
        </View>
        <Image src={pkText} mode="widthFix" className="vs-text"></Image>
        <View
          className="pk-user-info-box right"
          style={{ backgroundImage: `url(${rightAvatarBg})` }}
        >
          <Image
            src={pkinfo.npcHeadImg || xianziAvatar}
            className="avatar"
          ></Image>
        </View>
      </View>
      <View className="nickname-box">
        <View type="userNickName" className="nickname left">
          {nickname || '微信用户'}
        </View>
        <View className="nickname right">{pkinfo.npcNickname || '花仙子'}</View>
      </View>
      {!pkFinished && (
        <View className="gestrue-box">
          <View className="gestrue-item" onClick={setGestrue.bind(null, 2)}>
            <View className="gestrue-icon">
              <Image src={scissorsLeftChoose}></Image>
            </View>
            <View className="gestrue-radio">
              <ARadio
                size={30}
                value={1}
                onClick={setGestrue}
                checked={gestrue === 2}
              ></ARadio>
            </View>
          </View>
          <View className="gestrue-item" onClick={setGestrue.bind(null, 1)}>
            <View className="gestrue-icon">
              <Image src={stoneLeftChoose}></Image>
            </View>
            <View className="gestrue-radio">
              <ARadio
                size={30}
                value={1}
                onClick={setGestrue}
                checked={gestrue === 1}
              ></ARadio>
            </View>
          </View>
          <View className="gestrue-item" onClick={setGestrue.bind(null, 3)}>
            <View className="gestrue-icon">
              <Image src={clothLeftChoose}></Image>
            </View>
            <View className="gestrue-radio">
              <ARadio
                size={30}
                value={1}
                onClick={setGestrue}
                checked={gestrue === 3}
              ></ARadio>
            </View>
          </View>
        </View>
      )}
      {/* <View className='choose-text'>
        <Image src={chooseText}></Image>
      </View> */}
      <View className="btn-tips">选择手势开始PK</View>
      {!pkFinished && (
        <View className="btn-wrapper">
          <Image src={confirmBtn} mode="widthFix" onClick={onConfirm}></Image>
        </View>
      )}
      {pkFinished && (
        <View className="pk-gestrue-box">
          <Image src={leftIcon} mode="aspectFit" className="left"></Image>
          <Image src={rightIcon} mode="aspectFit" className="right"></Image>
        </View>
      )}
      {/* pk结果 */}
      <PkResultModal
        show={modal.pkResultModal.show}
        condition={modal.pkResultModal.condition}
        award={modal.pkResultModal.award}
        onClose={() =>
          hideModal('pkResultModal', { show: false, condition: 0 })
        }
      />
    </View>
  )
}
