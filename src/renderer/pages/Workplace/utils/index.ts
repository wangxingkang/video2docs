/**
 * 获取一个图片的感知哈希算法的值
 * https://www.ruanyifeng.com/blog/2011/07/principle_of_similar_image_search.html
 */
export async function pHash(image: string) {
  /** 1. 缩小尺寸 */
  const imageData = await compressImg(image);

  /** 2. 简化色彩 */
  const newImageData = createGrayscale(imageData);

  return getHashFingerprint(newImageData);
}

/**
 * 压缩图片
 * @param imgSrc
 * @param imgWidth
 * @returns
 */
export function compressImg(
  imgSrc: string,
  imgWidth: number = 8
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    if (!imgSrc) {
      reject('imgSrc can not be empty!')
    }
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'Anonymous';

    img.onload = function () {
      canvas.width = imgWidth
      canvas.height = imgWidth
      ctx?.drawImage(img, 0, 0, imgWidth, imgWidth)
      const data = ctx?.getImageData(0, 0, imgWidth, imgWidth) as ImageData
      resolve(data)
    };

    img.src = imgSrc
  })
}

export function createImgData (dataDetail: number[]) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const imgWidth = Math.sqrt(dataDetail.length / 4)
  const newImageData = ctx?.createImageData(imgWidth, imgWidth) as ImageData
  for (let i = 0; i < dataDetail.length; i += 4) {
    let R = dataDetail[i]
    let G = dataDetail[i + 1]
    let B = dataDetail[i + 2]
    let Alpha = dataDetail[i + 3]

    newImageData.data[i] = R
    newImageData.data[i + 1] = G
    newImageData.data[i + 2] = B
    newImageData.data[i + 3] = Alpha
  }
  return newImageData
}

export function createGrayscale(imgData: ImageData) {
  const newData: number[] = Array(imgData.data.length)
  newData.fill(0)
  imgData.data.forEach((_data, index) => {
    if ((index + 1) % 4 === 0) {
      const R = imgData.data[index - 3]
      const G = imgData.data[index - 2]
      const B = imgData.data[index - 1]

      const gray = ~~((R + G + B) / 3)
      newData[index - 3] = gray
      newData[index - 2] = gray
      newData[index - 1] = gray
      newData[index] = 255 // Alpha 值固定为255
    }
  })
  return createImgData(newData)
}

export function getHashFingerprint(imgData: ImageData) {
  const grayList = imgData.data.reduce((pre: number[], cur, index) => {
    if ((index + 1) % 4 === 0) {
      pre.push(imgData.data[index - 1])
    }
    return pre
  }, [])
  const length = grayList.length
  const grayAverage = grayList.reduce((pre, next) => (pre + next), 0) / length
  return grayList.map(gray => (gray >= grayAverage ? 1 : 0)).join('')
}

export function hammingDistance (str1: string, str2: string) {
  let distance = 0
  const str1Arr = str1.split('')
  const str2Arr = str2.split('')
  str1Arr.forEach((letter, index) => {
    if (letter !== str2Arr[index]) {
      distance++
    }
  })
  return distance
}
