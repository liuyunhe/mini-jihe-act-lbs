import { createInnerAudioContext } from "@tarojs/taro";
import { realtimeLog } from ".";

let bgManager, isPlaying, source
export function playBgm(src: string, loop: boolean) {
  if(isPlaying && source === src) return
  realtimeLog.info('play', src)
  console.log('play')
  return new Promise((resolve, reject) => {
    bgManager = bgManager || createInnerAudioContext()
    bgManager.src = src;
    bgManager.loop = loop
    bgManager.play();
    isPlaying = true
    source = src
    bgManager.onEnded(() => {
      resolve(true);
      isPlaying = false
      source = ''
    })
    bgManager.onPause(() => {
      isPlaying = false
    })
    bgManager.onError(e => {
      reject(e)
      isPlaying = false
      source = ''
    })
  })
}