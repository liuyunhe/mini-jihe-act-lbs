import React, { useEffect, useState } from "react";
import { Button, View, Text, Image } from "@tarojs/components";
import { Popup } from "@/components";
import { eventCenter } from "@tarojs/taro";
import { checkAuth } from "@/utils/auth";
import { ILoginData } from "@/service";
import { getData } from "@/store/store";
import { getResource } from "@/utils";
import "./Login.scss";

interface ILoginProps {
  onLoginSuccess: (userInfo: ILoginData) => void;
}
Login.defaultProps = {
  onLoginSuccess: () => {},
};
export function Login(props: ILoginProps) {
  const [isLogin, setIsLogin] = useState(null);
  const iconWechat = getResource("iconWechat");
  useEffect(() => {
    const loginCallback = (loginStatus) => {
      setIsLogin(loginStatus);
      props.onLoginSuccess(getData("userInfo"));
    };
    eventCenter.off("login", loginCallback);
    eventCenter.on("login", loginCallback);
    return () => {
      eventCenter.off("login", loginCallback);
    };
  });

  const onLoginSuccess = (userInfo) => {
    props.onLoginSuccess(userInfo);
  };
  return (
    <Popup show={isLogin === false} showClose={false}>
      <View className='login-wrapper'>
        <View className='title'>
          <Text>登录提醒</Text>
        </View>
        <View className='body'>
          <View className='content-text'>
            <View>您尚未登录，需要登录才能参加本次活动</View>
          </View>
          <Button
            type='primary'
            openType='getUserInfo'
            onGetUserInfo={checkAuth.bind(null, onLoginSuccess)}
            className='login-btn'
          >
            <Image src={iconWechat.path}></Image>
            <Text>微信登录</Text>
          </Button>
        </View>
      </View>
    </Popup>
  );
}
