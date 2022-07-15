import { Popup } from '@/components'
import { View, Text, Image } from '@tarojs/components'
import React, { useState } from 'react'
import { getResource } from '@/utils'
import './Rules.scss'

interface IActivityRulesProps {
  show: boolean
  onClose?: () => void
}
ActivityRules.defaultProps = {
  show: false,
  onClose: () => {}
}
/**
 *
 */
const initialRuleState = [
  {
    type: 'line',
    content: '欢迎来到“采荷寻芳踪”！与周边各种点位互动，获取丰厚荷点奖励！'
  },
  {
    type: 'line',
    content:
      '1、【荷花终端】（线下活动终端）：您所在城市可能有【荷花终端】。您可在【荷花点位】附近点击领取荷点奖励，每天限互动1次； '
  },
  {
    type: 'line',
    content:
      '2、【荷包点位】（随机点位）：点击【荷包点位】，有概率获得荷点奖励；'
  },
  {
    type: 'line',
    content:
      '3、【寻荷系统】：可查看附近【荷花终端】的列表，点击后可进入地图进行导航；'
  },
  {
    type: 'line',
    content:
      '4、【发起PK游戏】：用多余的宝藏，与其他用户玩石头剪刀布，胜利即可获得宝藏；'
  },
  {
    type: 'line',
    content:
      '5、【接受PK游戏】：点选地图上的宝藏图标接受PK，胜利即可获得宝藏； '
  },
  {
    type: 'line',
    content:
      '6、【PK荷花仙子】：每天与荷花仙子进行PK游戏1次，胜利即可获得宝藏。'
  }
]
export default function ActivityRules(props: IActivityRulesProps) {
  const bgRule = getResource('bgActRule')
  const [rules, setRules] = useState(initialRuleState)
  return (
    <Popup show={props.show} onClose={props.onClose}>
      <View className="rule-container">
        <Image src={bgRule.path} className="rule-bg" mode="widthFix"></Image>
        <View className="rule-body">
          {rules.map((rule) => {
            if (rule.type.includes('line')) {
              return (
                <View
                  className="rule-item"
                  style={`${rule.type.includes('bold') && 'font-weight:bold'}`}
                >
                  {rule.content}
                </View>
              )
            } else {
              return (
                <Text
                  className="rule-item"
                  style={`${rule.type.includes('bold') && 'font-weight:bold'}`}
                >
                  {rule.content}
                </Text>
              )
            }
          })}
        </View>
      </View>
    </Popup>
  )
}
