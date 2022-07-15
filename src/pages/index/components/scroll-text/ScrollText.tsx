import React, { useState } from 'react'
import { View, Icon, Text } from '@tarojs/components'
import './ScrollText.scss'

interface IScrollTextProps {
  text: string
}
ScrollText.defaultProps = {
  text: ''
}
export default function ScrollText(props: IScrollTextProps) {
  const [show, setShow] = useState(true)
  if (show) {
    return (
      <View className='text-wrapper'>
        <View className='text-box'>
          <View className='text-container scroll'>{props.text}</View>
        </View>
        <Icon type='cancel' size='20' color='#999' className='scroll-icon' onClick={() => {setShow(false)}}></Icon>
      </View>
    )
  } else {
    return null
  }

}