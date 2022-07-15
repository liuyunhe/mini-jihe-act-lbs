import React from 'react'
import { View, OpenData, Image } from '@tarojs/components'
import './UserInfo.scss'

interface direction {
  left
  right
}
interface IUserInfoProps {
  direction: keyof direction
  headImg: string
  nickname: string
  show: boolean
}
UserInfo.defaultProps = {
  direction: 'left'
}
export function UserInfo(props: IUserInfoProps) {
  const directionClass =
    props.direction === 'left' || !props.direction ? ' left' : ' right'
  return (
    <View>
      {props.show && (
        <View className={'user-info-box' + directionClass}>
          <View type="userAvatarUrl" className="avatar">
            <Image
              className="avatar-img"
              src={
                props.headImg ||
                'https://qrmkt.oss-cn-beijing.aliyuncs.com/common/jihe2021/hthj/head-icon-defualt.png'
              }
            ></Image>
          </View>
          <View type="userNickName" className="nickname" default-text="啊啊啊">
            {props.nickname || '微信用户'}
          </View>
        </View>
      )}
    </View>
  )
}
