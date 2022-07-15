import { IMAGE_RESOURCES} from '../resource.map'

interface IGetImageInfoResult {
  /** 图片原始高度，单位px。不考虑旋转。 */
  height: number
  /** [拍照时设备方向](http://sylvana.net/jpegcrop/exif_orientation.html)
   * @default up
   */
  orientation: keyof orientation
  /** 图片的本地路径 */
  path: string
  /** 图片格式 */
  type: string
  /** 图片原始宽度，单位px。不考虑旋转。 */
  width: number
  /** 调用结果 */
  errMsg: string
  originUrl: string
}
interface orientation {
  /** 默认方向（手机横持拍照），对应 Exif 中的 1。或无 orientation 信息。 */
  'up'
  /** 同 up，但镜像翻转，对应 Exif 中的 2 */
  'up-mirrored'
  /** 旋转180度，对应 Exif 中的 3 */
  'down'
  /** 同 down，但镜像翻转，对应 Exif 中的 4 */
  'down-mirrored'
  /** 同 left，但镜像翻转，对应 Exif 中的 5 */
  'left-mirrored'
  /** 顺时针旋转90度，对应 Exif 中的 6 */
  'right'
  /** 同 right，但镜像翻转，对应 Exif 中的 7 */
  'right-mirrored'
  /** 逆时针旋转90度，对应 Exif 中的 8 */
  'left'
}

type IResources = {
  [key in keyof typeof IMAGE_RESOURCES]: IGetImageInfoResult;
};
