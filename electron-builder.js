/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: 'com.electron.wxk.video2docs',
  productName: '倩宝转换',
  asar: true,
  asarUnpack: [
    'node_modules/@walrus/images-pptx',
  ],
  copyright: 'Copyright © 2021 JiuMao',
  directories: {
    output: 'dist/app',
    app: 'dist/source'
  },
  mac: {
    icon: "build/icons/mac/icon.icns",
    target: [
      {
        target: 'dmg',
        arch: [
          'x64',
          'arm64'
        ]
      }
    ],
  },
  win: {
    icon: "build/icons/win/icon.ico",
    target: [
      'nsis'
    ]
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
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
  publish: [
    {
      provider: 'github',
      owner: 'wangxingkang',
      repo: 'video2docs'
    }
  ],
}

module.exports = config;
