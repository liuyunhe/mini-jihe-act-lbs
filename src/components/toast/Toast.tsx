import { getResource } from '@/utils'
import { View, Image, Text } from '@tarojs/components'
import { Component } from '@tarojs/taro'
import React from 'react'
import './Toast.scss'

interface IToastProps {
  show?: boolean;
  content?: string;
  image?: string;
  children?: Component
}
export default function Toast(props: IToastProps) {
  const bgToast = getResource('bgToast')
  if (!props.show) return null
  return (
    <View className='toast-wrapper'>
      <Image src={props.image || bgToast.path} className='toast-bg' mode='widthFix'></Image>
      {props.children || <Text className='toast-content'>{props.content}</Text>}
    </View>
  )

}