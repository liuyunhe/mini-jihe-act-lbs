import { Popup, ARadio } from '@/components'
import {IBuildingsData } from '@/service'
import { getResource } from '@/utils'
import { View, Image } from '@tarojs/components'
import React, { useState } from 'react'
import './BuildingModal.scss'

interface IActivityRulesProps {
  show: boolean;
  condition: number;
  buildings: IBuildingsData[];
  onNextClick: (patchId: number) => void
  onClose?: () => void
}
XinchunModal.defaultProps = {
  show: false,
  // 0-我的建筑， 1-选择建筑
  condition: 0,
  award: {
    imageUrl: '',
    text: '108牛气值+1个荷塘建筑'
  },
  buildings: [],
  onNextClick: () => { },
  onClose: () => { }
}

export default function XinchunModal(props: IActivityRulesProps) {
  const bg = getResource('bgHetangBuildings')
  const bgChoose = getResource('bgChooseBuilding')
  const btnNext = getResource('btnNext')
  const currentBg = props.condition === 0 ? bg : bgChoose
  // 如果是发起挑战，只显示2个以上的
  const buildings = props.condition === 0 ? props.buildings : props.buildings.filter(building => building.patchNum > 1)
  const hasBuildings = buildings && buildings.length > 0
  const [checkedCard, setCheckedCard] = useState(-1)
  return (
    <Popup show={props.show} onClose={props.onClose}>
      <View className={`building-modal-container ${props.condition === 0 ? '' : 'choose'}`}>
        <Image src={currentBg.path} className='modal-bg' mode='widthFix'></Image>
        <View className='modal-body'>
          {hasBuildings &&
            <View className='building-box'>
              {hasBuildings &&
                buildings.map((item) =>
                  <View className='building-item' onClick={() => setCheckedCard(item.patchId)} key={item.cardId}>
                    {props.condition === 1 && 
                    <View className='radio-box'>
                      <ARadio size={44} checked={checkedCard === item.patchId} />
                    </View>}
                    <Image src={item.smallImg} mode='aspectFit' className='building-image' />
                    <View className='count-box'>{item.patchNum}</View>
                  </View>
                )
              }
            </View>
          }
          {!hasBuildings && <View className='no-data'>您没有多余的建筑碎片，快去参与活动获取吧～</View>}
          { props.condition !== 0 && hasBuildings &&
            <Image
              src={btnNext.path}
              onClick={props.onNextClick.bind(null, checkedCard)}
              mode='widthFix'
              className='btn-next'
            />
            }
        </View>
      </View>
    </Popup>
  )
}