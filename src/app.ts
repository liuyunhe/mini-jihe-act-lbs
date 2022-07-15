
import { onError } from '@tarojs/taro'
import './app.scss'
import realtimeLog from './utils/realtimeLog'

function App(props) {
  onError((err) => {
    realtimeLog.error(err)
  })
  return props.children
}

export default App
