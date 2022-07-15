import React from "react";
import { WebView } from "@tarojs/components";
import { WEBVIEW_HOST, WEBVIWE_URL_MAP } from "@/project.config";
import { getCurrentInstance } from "@tarojs/taro";

export default function Webview() {
  const instance = getCurrentInstance()
  const params = instance.router?.params!
  const path = WEBVIWE_URL_MAP[params.url!] || WEBVIWE_URL_MAP.SHARE_URL
  const url = /^http|https/.test(path) ? path : `${WEBVIEW_HOST}${path}`
  return (
    <WebView src={url} />
  );
}
