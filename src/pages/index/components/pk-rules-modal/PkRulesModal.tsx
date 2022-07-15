import { Popup } from '@/components'
import { View, Button, Image } from '@tarojs/components'
import React, { useState } from 'react'
import { getResource } from '@/utils'
import './PkRulesModal.scss'

interface IActivityRulesProps {
  show: boolean
  onPkClick: () => void
  onRecordClick: () => void
  onClose?: () => void
}
ActivityRules.defaultProps = {
  show: false,
  onPkClick: () => {},
  onRecordClick: () => {},
  onClose: () => {}
}
const initialRules = [
  '1、帐户拥有相同宝藏道具数量不低于2个，荷点不低于68；',
  '2、将自己拥有的宝藏道具分享到地图，可接受其他用户PK，获胜奖励88荷点、失败则扣除宝藏道具；',
  '3、系统显示附近接受PK的用户及携带宝藏道具信息，用户可任选发起PK，胜利则获得对方宝藏道具，失败扣除68荷点。'
]
export default function ActivityRules(props: IActivityRulesProps) {
  const bgRule = getResource('bgPkRule')
  const btnPk = getResource('btnJoin')
  const btnRecord = getResource('btnGameHistory')
  const [rules, setRules] = useState(initialRules)
  return (
    <Popup show={props.show} onClose={props.onClose}>
      <View className="pk-rule-container">
        <Image src={bgRule.path} className="rule-bg" mode="widthFix"></Image>
        <View className="rule-body">
          {rules.map((rule, index) => (
            <View className="rule-item" key={index}>
              {rule}
            </View>
          ))}
        </View>
        <View className="rule-footer">
          <Image
            src={btnPk.path}
            style="btn-pk"
            onClick={props.onPkClick}
          ></Image>
          <Image
            src={btnRecord.path}
            style="btn-record"
            onClick={props.onRecordClick}
          ></Image>
        </View>
      </View>
    </Popup>
  )
}
