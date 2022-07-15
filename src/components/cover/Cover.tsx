import React from 'react'
import { View } from '@tarojs/components'
import './Cover.scss'

interface ICoverProps {
  alpha?: number;
  show?: boolean;
  animation?: any
  children?: any;
  onClick?: () => void;
}
Cover.defaultProps = {
  alpha: 0.7,
  show: true,
  onClick: () => { }
}
export function Cover(props: ICoverProps) {
  return (
    <View>
      {props.show && <View className='cover-wrapper fade-in' onClick={props.onClick}>{props.children}</View>}
    </View>
  )
}