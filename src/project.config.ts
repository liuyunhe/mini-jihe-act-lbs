export const ENV = process.env.NODE_ENV === 'development' ? 'TEST' : 'PROD'
export const LOG_LEVEL = 0
export const MAP_KEY = {
  // TEST: '7AVBZ-JJZ66-4TRSW-M6KC4-QBO3K-CKFBE',
  // TEST: '32XBZ-WHSKF-CYIJR-J27QG-LUQYH-HPFIG',
  // PROD: 'D7NBZ-3TERR-DUJWA-WOUI6-ZX4DE-YFFVQ'
  TEST: 'R3ABZ-3UN6Q-4FJ56-GJ2GB-FFHE7-RIBVK',
  PROD: 'OIBBZ-6B5WD-ZHQ4Y-HMXQF-X4IBF-LABQY'
}
export const HOSTs = {
  TEST: "https://cs-yxc.qrmkt.cn",
  PROD: "https://yx.qrmkt.cn",
  // PROD: "https://hbh.qrmkt.cn",
  TEST_WEBVIEW: "https://cs-hbh.qrmkt.cn",
  PROD_WEBVIEW: "https://hbh.qrmkt.cn"
}
export const HOST = HOSTs[`${ENV}`]
export const WEBVIEW_HOST = HOSTs[`${ENV}_WEBVIEW`]
export const QQ_MAP_KEY = MAP_KEY[ENV]
// 地图默认缩放等级
export const DEFAULT_MAP_SCALE = 11
// 地图缩放时的防抖时间
export const SCALE_DEBOUNCE_TIME = 500
// 地图最大缩放等级
export const MAX_SCALE = 16
// 地图最小缩放等级
export const MIN_SCALE = 10
// 可抽奖范围
export const CAN_DRAW_RANGE = 300
// webview地址映射表
export const WEBVIWE_URL_MAP = {
  SHARE_URL: '/orgmenu/auth?menuCode=ztjihe2021',
  HEBAO_URL: '/orgmenu/auth?menuCode=jiHe202107c',
  HEDIAN_URL: '/orgmenu/menuIncome?menuCode=jiHe202201a'
  // HEDIAN_URL: '/orgmenu/auth?menuCode=jiHe202107a'
}
