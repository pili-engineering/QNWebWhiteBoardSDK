本文介绍七牛白板 WEB 端加入房间和加入白板，且若白板是 ppt/pdf 模式下打开 ppt/pdf 的操作流程

# 引入 SDK

我们提供了两种方式引入方式，您可以直接下载 JS 文件，也可以通过 npm 完成引入

## NPM 安装

运行下方的命令即可通过 npm 引入我们的 SDK

```shell
$ npm install qnweb-whiteboard
```

如果想要更新到最新版本或者指定版本，运行下列命令

```shell
$ npm install qnweb-whiteboard@latest
$ npm install qnweb-whiteboard@2.0.0   # 指定版本
```

> 我们更加推荐您使用 yarn 来管理 npm 模块
>
> 通过 yarn add qnweb-whiteboard 引入 SDK，通过 yarn add qnweb-whiteboard@latest 来更新版本

安装好后，运行以下代码访问 SDK 的入口

```ts
import QNWhiteBoard from "qnweb-whiteboard";
console.log("current version is", QNWhiteBoard.version);
```

运行时看到打印的 current version 表示引入成功

## 直接导入 JS 文件

每次发布版本，我们都会将最新的 SDK JS 文件放在我们的 [Github](https://github.com/pili-engineering/QNWebWhiteBoardSDK) 上，点击链接即可获取当前最新的 SDK JS 文件。 所以，每次想要升级版本时，只需要访问我们的 [Github](https://github.com/pili-engineering/QNWebWhiteBoardSDK) 页面，然后替换一下自己的 js 文件即可。

SDK 的 JS 文件在导入页面后，会自动创建一个全局对象 QNWhiteBoard，这个对象的成员包括了 SDK 所导出的所有模块和对象。

```ts
// 当页面资源加载完成后
window.onload = () => {
  console.log("current version is", QNWhiteBoard.version);
}
```

运行时看到打印的 current version 表示引入成功。

# 1. 准备

* 引入 SDK
* 引入 webassembly 资源，并通过 ```initConfig({ path: 'path/whiteboardcanvas.html' });``` 来设置白板 iframe 的 src 地址，`path` 为 webassembly 资源部署的路径。
* 准备一个 div 容器，id 为 `iframeBox`

# 2. 创建实例

```ts
const client = QNWhiteBoard.create();
const instance = client.createInstance(bucketId);
```

# 3. 注册房间回调函数

```javascript
client.registerRoomEvent({
	onJoinSuccess: () => console.log('onJoinSuccess'),
	onJoinFailed: () => console.log('onJoinFailed'),
	onRoomStatusChanged: () => console.log('onRoomStatusChanged'),
})
```

# 4. 加入房间

```javascript
// 参数: appId, meetingId, userId, token均从服务端获取，可查看开发指南 -> 服务端
// 加入成功或失败后会调用步骤 3 中注册的回调
client.joinRoom(appId, meetingId, userId, token);
```

# 5. 关闭房间

```javascript
client.leaveRoom()
```

# 以下流程确保在房间加入成功后使用，比如在 3 中 onJoinSuccess 回调中使用

# 6. 创建白板实例


参数 `buckedId` 从服务端获取，可查看服务端开发指南
```javascript
const instance = client.createInstance(buckedId)
```

# 7. 注册白板回调函数

```javascript
instantce.registerWhiteBoardEvent({
	onWhiteBoardOpened: () => console.log('onWhiteBoardOpened'),
	onWhiteBoardOpenFailed: () => console.log('onWhiteBoardOpenFailed'),
	onWhiteBoardClosed: () => console.log('onWhiteBoardClosed'),
})
// 如果是 ppt 模式，还可注册 ppt 回调函数
instance.registerPPTEvent({
	onFileLoadedSuccessful: () => console.log('onFileLoadedSuccessful'),
	onFileLoadingFailed: () => console.log('onFileLoadingFailed'),
	onFileStateChanged: (data) => console.log('onFileStateChanged', data),
})
// 如果是 pdf 模式，还可注册 pdf 回调函数
instance.registerPDFEvent({
	onFileLoadedSuccessful: () => console.log('onFileLoadedSuccessful'),
	onFileLoadingFailed: () => console.log('onFileLoadingFailed'),
	onFileStateChanged: (data) => console.log('onFileStateChanged', data),
})
```

**ppt模式下 `onFileStateChanged` 回调参数内容如下:**

|名称|类型|描述|
|-|-|-|
|no|number|当前 ppt 页号|
|step|number|当前 ppt 动画位置索引|
|pageCount|number|ppt 总页数|
|stepCount |number|ppt 总动画数|

**pdf 模式下 `onFileStateChanged` 回调参数内容如下:**

|名称|类型|描述|
|-|-|-|
|currentPage|number|当前 pdf 页号|
|pageCount|number|pdf 总页数|

