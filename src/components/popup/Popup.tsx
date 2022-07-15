import { View, Image } from '@tarojs/components'
import { createAnimation } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { Cover } from '@/components'
import { getResource } from '@/utils'
import { setData } from '@/store/store'
import './Popup.scss'

interface IPopup {
  show: boolean;
  showClose?: boolean;
  children?: any;
  full: boolean;
  onClose?: (e?: any) => void;
}

Popup.defaultProps = {
  show: false,
  showClose: true,
  full: false
}
export function Popup(props: IPopup) {
  const iconClose = getResource('iconCloseGreen')
  const slideAni = createAnimation({ duration: 300, timingFunction: 'ease-in-out' })
  slideAni.translate3d(0, 0, 0).step()
  const [aniSlide, setAniSlide] = useState(slideAni.export())


  const setSlideAni = (translateY: number) => {
    slideAni.translate3d(0, translateY, 0).step()
    setAniSlide(slideAni.export())
  }
  const onCloseClick = () => {
    setSlideAni(1000)
    setTimeout(() => {
      props.onClose && props.onClose()
      setSlideAni(0)
    }, 300);
  }
  // useEffect(() => {
  //   if(props.show) {
  //     setData('disabled', true)
  //   }else {
  //     setData('disabled', false)
  //   }
  // }, [props.show])
  return (
    <View>
      {
        props.show &&
        <View>
          <Cover />
          {props.full && 
            <View animation={aniSlide} className='popup-wrapper slide-up'>
              {props.children}
            </View>
          }
          {!props.full &&
            <View animation={aniSlide} className='popup-wrapper slide-up'>

              <View className='popup-container'>
                {
                  props.showClose && iconClose.path
                  && <Image src={iconClose.path} className='close-icon' onClick={onCloseClick} />
                }
                {props.children}
              </View>
            </View>}
        </View>

      }
    </View>
  )
}
