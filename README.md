<h1 align="center">
  video2docs
</h1>

<div align="center">
  一个将视频转换为PPT的桌面应用。
</div>

## 使用步骤

1. 选择存放视频的目录
2. 解析目录获取视频列表
3. 使用 ffmpeg 按照给定的时间间隔截图
4. 压缩所有图片
5. 生成PPT

## 使用的技术或库

- [electron](https://www.electronjs.org/) 构建跨平台的桌面应用程序
- react 
- ffmpeg 视频处理的库
- imagemin 压缩图片的库
- images-pptx 将图片转为PPT

## 界面一览

![](https://cdn.jsdelivr.net/gh/wangxingkang/pictures@latest/imgs/20211105175804.png)

## 后续计划

[ ] 支持列表单个视频单独处理
