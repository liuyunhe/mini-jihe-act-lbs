import { Popup } from '@/components'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import React from 'react'
import { getResource } from '@/utils'
import { IHebaoData } from '@/service'
import { debounce } from 'lodash'
import './PkHebaoModal.scss'
import { navigateTo } from '@tarojs/taro'

interface IPkRecordModalProps {
  show: boolean;
  condition: number;
  history: IHebaoData[];
  handler: (isFirst?: Boolean) => void;
  onClose?: () => void
}
PkRecordModal.defaultProps = {
  show: false,
  condition: 0,
  history: [],
  myHistory: [],
  handler: () => { },
  onClose: () => { }
}
export default function PkRecordModal(props: IPkRecordModalProps) {
  const bgHedian = getResource('bgHebaoDetail')
  const btnHedian = getResource('btnHebaoDetail')
  const history = props.history
  return (
    <Popup show={props.show} onClose={props.onClose}>
      <View className='niuqi-record-container'>
        <Image src={bgHedian.path} mode='widthFix' className='bg'></Image>
        {history && history.length > 0 &&
          <ScrollView className='record-list' scrollY onScrollToLower={debounce(props.handler.bind(null, false), 500)} lowerThreshold={50}>
            {history && history.map(record => (
              <View className='record-item' key={record.id}>
                <View className='line'>
                  <Text>{record.txDesc}</Text>
                  {record.type === 1 && <Text style='font-size: 26rpx;font-weight: bold;color: #808080'><Text className='plus'>+</Text>{record.num}</Text>}
                  {record.type === 2 && <Text style='font-size: 26rpx;font-weight: bold;color: #808080'><Text className='minus'>-</Text>{record.num}</Text>}
                </View>
                <View className='line'>
                  <Text className='time'>{record.ctime}</Text>
                </View>
              </View>
            ))
            }
          </ScrollView>
        }
        { (!history || !history.length) && <View className='record-list no-data'>暂无荷包数据,挑战pk,有机会获得荷包、荷点值！</View>}
        <Image 
          src={btnHedian.path} 
          className='hedian-btn' 
          mode='widthFix' 
          onClick={
          () => navigateTo({
            url: '/pages/webview/webview?url=HEBAO_URL'
          })
        }
        ></Image>
      </View>
    </Popup>
  )
}