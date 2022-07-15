import { request, addInterceptor, RequestParams } from '@tarojs/taro'
import { HOST } from '@/project.config'
import { getData } from '@/store/store'
import { ILoginData } from '@/service'
import { realtimeLog } from '.'
import { log } from './log'

function removeUndef(data: object) {
  for (let i in data) {
    if (data[i] === undefined) {
      delete data[i]
    }
  }
}
addInterceptor(chain => {
  const requestParams = chain.requestParams
  const { method, url, data = {}, header = {} } = requestParams
  const userInfo:ILoginData = getData('userInfo') || {user: {nickname: ''}}
  removeUndef(data)
  let dataStr: string;
  requestParams.url = `${HOST}${requestParams.url}`
  header['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8"
  header.token = userInfo.token || "";
  requestParams.header = header
  try {
    dataStr = JSON.stringify(data)
  } catch (e) {
    dataStr = ""
  }
  log(`[${method}] ${url}=>${dataStr}`)
  return chain.proceed(requestParams).then(res => {
    log(`[${method}] ${url} result=>`, res)
    realtimeLog.info('request=>>' + (userInfo && userInfo.user && userInfo.user.nickname) || '', requestParams, res.data)
    return res;
  })
})

function req(params: RequestParams) {
  return request(params)
}

export function get(params: RequestParams) {
  params.method = 'GET'
  return req(params)
}

export function post(params: RequestParams) {
  params.method = 'POST'
  return req(params)
}