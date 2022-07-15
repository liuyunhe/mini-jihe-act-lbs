import React from 'react'
import { View, Image } from '@tarojs/components'
import { getImage } from '@/resource.map'
import './Radio.scss'

interface IRadioProps {
  value: number;
  checked: boolean;
  disabled: boolean;
  outterColor: string;
  innerColor: string;
  size: number;
  onClick: (value: number) => void;
}
Radio.defaultProps = {
  value: -1,
  checked: false,
  disabled: false,
  size: 24,
  outterColor: '#66e1e3',
  innerColor: '#3dfefe',
  onClick: (value: string) => { }
}
export function Radio(props: IRadioProps) {
  const iconRadio = getImage('iconRadio')
  const iconRadioActive = getImage('iconRadioActive')
  const { checked } = props
  const onClick = () => {
    props.onClick(props.value)
  }
  return (
    <View onClick={onClick}>
      { !checked  && <Image src={iconRadio} className='radio-image' mode='widthFix'></Image>}
      { checked && <Image src={iconRadioActive} className='radio-image' mode='widthFix'></Image>}
    </View>
  )
}