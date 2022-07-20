import { Popup } from '@/components'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import React from 'react'
import { getResource } from '@/utils'
import { IHedianData } from '@/service'
import { debounce } from 'lodash'
import { navigateTo } from '@tarojs/taro'
import './PkHedianModal.scss'

interface IPkRecordModalProps {
  show: boolean
  condition: number
  history: IHedianData[]
  handler: (isFirst?: Boolean) => void
  onClose?: () => void
}
PkHedianModal.defaultProps = {
  show: false,
  condition: 0,
  history: [],
  myHistory: [],
  handler: () => {},
  onClose: () => {}
}
export default function PkHedianModal(props: IPkRecordModalProps) {
  const bgHedian = getResource('bgHedianDetail')
  const btnHedian = getResource('btnHedianDetail')
  const history = props.history
  return (
    <Popup show={props.show} onClose={props.onClose}>
      <View className="niuqi-record-container">
        <Image src={bgHedian.path} mode="widthFix" className="bg"></Image>
        {history && history.length > 0 && (
          <ScrollView
            className="record-list"
            scrollY
            onScrollToLower={debounce(props.handler.bind(null, false), 500)}
            lowerThreshold={50}
          >
            {history &&
              history.map((record) => (
                <View className="record-item" key={record.id}>
                  <View className="line">
                    <Text style="width: 80%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                      {record.txnDesc}
                    </Text>
                    {record.txnType === 1 && (
                      <Text style="font-size: 26rpx;font-weight: bold;color: #231815">
                        <Text className="plus">+</Text>
                        {record.txnScore}
                      </Text>
                    )}
                    {record.txnType === 0 && (
                      <Text style="font-size: 26rpx;font-weight: bold;color: #231815">
                        <Text className="minus">-</Text>
                        {record.txnScore}
                      </Text>
                    )}
                  </View>
                  <View className="line">
                    <Text className="time">{record.ctime}</Text>
                  </View>
                </View>
              ))}
          </ScrollView>
        )}
        {(!history || !history.length) && (
          <View className="record-list no-data">
            暂无荷点数据,挑战pk,有机会获得荷点！
          </View>
        )}
        <Image
          src={btnHedian.path}
          className="hedian-btn"
          mode="widthFix"
          onClick={() =>
            navigateTo({
              url: '/pages/webview/webview?url=HEDIAN_URL'
            })
          }
        ></Image>
      </View>
    </Popup>
  )
}
