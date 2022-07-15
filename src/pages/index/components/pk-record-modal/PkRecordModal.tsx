import { Popup } from '@/components'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import React, { useEffect, useState } from 'react'
import { getResource } from '@/utils'
import { IMyPkHistoryData, IPkHistoryData } from '@/service'
import { debounce } from 'lodash'
import './PkRecordModal.scss'

interface IPkRecordModalProps {
  show: boolean
  condition: number
  history: IPkHistoryData[]
  myHistory: IMyPkHistoryData[]
  handler: {
    getHistory: (isFirst?: Boolean) => void
    getMyHistory: (isFirst?: Boolean) => void
  }
  onClose: () => void
}
PkRecordModal.defaultProps = {
  show: false,
  condition: 0,
  history: [],
  myHistory: [],
  handler: {
    getHistory: () => {},
    getMyHistory: () => {}
  },
  onClose: () => {}
}
export default function PkRecordModal(props: IPkRecordModalProps) {
  const bgRecord = getResource('bgGameHistory')
  const btnMyPk = getResource('btnMyPk')
  const btnMyPkActive = getResource('btnMyPkActive')
  const btnMyChallenge = getResource('btnMyChallenge')
  const btnMyChallengeActive = getResource('btnMyChallengeActive')
  const btnClose = getResource('iconCloseGreen')
  // 我发起的
  const history = props.history
  // 我挑战的
  const myHistory = props.myHistory
  const hasHistory = props.history && props.history.length > 0
  const hasMyHistory = props.myHistory && props.myHistory.length > 0
  const [tab, setTab] = useState(0)
  const switchTab = (value: number) => {
    if (value !== tab) {
      if (value === 0 && !hasMyHistory) {
        props.handler.getMyHistory(true)
      } else if (value === 1 && !hasHistory) {
        props.handler.getHistory(true)
      }
    }
    setTab(value)
  }
  const getStatusColor = (statusText: string): string => {
    let color = ''
    if (statusText == '待应战' || statusText == '24小时无人应战') {
      color = '#ED6C00'
    } else if (statusText == '胜利') {
      color = '#157C77'
    } else if (statusText == '失败') {
      color = '#E60012'
    }
    return color
  }
  function onClose() {
    setTab(0)
    props.onClose()
  }
  return (
    <Popup show={props.show} onClose={onClose}>
      <View className="record-container">
        <Image src={bgRecord.path} className="bg"></Image>
        <View className="btn-wrapper">
          <Image
            src={tab === 0 ? btnMyPkActive.path : btnMyPk.path}
            onClick={switchTab.bind(null, 0)}
          ></Image>
          <Image
            src={tab === 1 ? btnMyChallengeActive.path : btnMyChallenge.path}
            onClick={switchTab.bind(null, 1)}
          ></Image>
        </View>
        {tab === 1 && (
          <ScrollView
            className="record-list"
            scrollY
            onScrollToLower={debounce(
              props.handler.getHistory.bind(null, false),
              300
            )}
            lowerThreshold={50}
          >
            {hasHistory &&
              history.map((record) => (
                <View className="record-item" key={record.id}>
                  <View className="line">
                    <Text
                      style={`color: ${getStatusColor(
                        record.statusText!
                      )};font-weight: bold`}
                    >
                      {record.statusText}
                    </Text>
                    <Text>{record.ctime}</Text>
                  </View>

                  {((record.pkResult == 1 && record.winValue > 0) ||
                    (record.pkResult == 2 && record.failMinusValue > 0)) && (
                    <View className="line">
                      {record.pkResult == 1 && record.winValue > 0 && (
                        <Text>+{record.winValue}个荷点</Text>
                      )}
                      {record.pkResult == 2 &&
                        Number(record.failMinusValue) > 0 && (
                          <Text style="color: #E60012">
                            <Text>-</Text>1个年货道具-{record.note}
                          </Text>
                        )}
                    </View>
                  )}
                </View>
              ))}
            {!hasHistory && (
              <View className="no-data">
                暂无发起游戏PK，发起游戏PK，胜利可获得荷点奖励！
              </View>
            )}
          </ScrollView>
        )}
        {tab === 0 && (
          <ScrollView
            className="record-list"
            scrollY
            onScrollToLower={debounce(
              props.handler.getMyHistory.bind(null, false),
              300
            )}
            lowerThreshold={50}
          >
            {hasMyHistory &&
              myHistory.map((record) => (
                <View className="record-item" key={record.id}>
                  <View className="line">
                    <Text
                      style={`color: ${getStatusColor(
                        record.statusText!
                      )};font-weight: bold`}
                    >
                      {record.statusText}
                    </Text>
                    <Text style="color: #767676;font-size: 22rpx">
                      {record.pkTime}
                    </Text>
                  </View>
                  {(record.pkResult == 1 ||
                    (record.pkResult == 2 && record.failMinusPoints > 0)) && (
                    <View className="line">
                      {record.pkResult == 1 && record.awardValue > 0 && (
                        <Text>+1个年货道具-{record.note}</Text>
                      )}
                      {record.pkResult == 2 && record.failMinusPoints > 0 && (
                        <Text style="color: #E60012">
                          <Text>-</Text>
                          {record.failMinusPoints}个荷点
                        </Text>
                      )}
                    </View>
                  )}
                  {record.pkResult == 1 && record.awardPoints > 0 && (
                    <View className="line">
                      <View>+{record.awardPoints}个荷点</View>
                    </View>
                  )}
                </View>
              ))}
            {!hasMyHistory && (
              <View className="no-data">
                暂无挑战游戏数据，挑战PK有机会获得年货道具！
              </View>
            )}
          </ScrollView>
        )}
      </View>
      {/* <Image src={btnClose.path} mode='widthFix' className='close-icon'></Image> */}
    </Popup>
  )
}
