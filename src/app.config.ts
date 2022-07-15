export default {
  pages: [
    'pages/index/index',
    'pages/code/code',
    'pages/webview/webview',
    'pages/pk/pk',
    'pages/shop-list/ShopList'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '采荷寻芳踪',
    navigationBarTextStyle: 'black'
  },
  permission: {
    'scope.userLocation': {
      desc: '授权位置信息，才能参与活动'
    }
  },
  style: 'v2',
}