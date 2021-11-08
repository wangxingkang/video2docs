/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: 'com.electron.wxk.video2docs',
  productName: '倩宝转换',
  directories: {
    output: 'dist/app',
    app: 'dist/source'
  },
  asar: true,
  asarUnpack: [
    'node_modules/@walrus/images-pptx',
  ],
  copyright: 'Copyright © 2021 JiuMao',
  mac: {
    icon: "build/icons/mac/icon.icns"
  },
  win: {
    target: [
      {
        target: 'nsis-web',
        arch: ['x64', 'ia32']
      },
      {
        target: 'zip',
        arch: ['x64', 'ia32']
      }
    ]
  },
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64']
      },
      {
        target: 'deb',
        arch: ['x64']
      }
    ]
  },
}

module.exports = config;
