# 创建实例对象

```js
const client = QNWhiteBoard.create();
const instance = client.controller.createInstance(bucketId);
```

# API 概览

## 房间关键方法

以下方法均为 `client.controller` 暴露的方法

| 方法名称                                | 方法描述                     |
| --------------------------------------- | ---------------------------- |
| [initConfig](#initConfig)               | 初始化打开白板的参数         |
| [join_room](#join_room)                 | 进入房间                     |
| [leave_room](#leave_room)               | 离开房间                     |
| [registerRoomEvent](#registerRoomEvent) | 注册房间事件回调             |
| [createInstance](#createInstance)       | 创建白板实例                 |
| [getRecord](#getRecord)                 | 获取回放数据并初始化回放模块 |
| [offlineConfig](#offlineConfig)         | 配置房间内断网离线支持       |
| [enterOffline](#enterOffline)           | 进入离线模式                 |
| [exitOffline](#exitOffline)             | 退出离线模式                 |

## 房间内主动控制的方法

以下方法均为 `client.controller` 暴露的方法，无返回值

| 参数                                        | 描述                 |
| ------------------------------------------- | -------------------- |
| [rubber_undo](#rubber_undo)                 | 还原笔迹             |
| [clear_recovery](#clear_recovery)           | 清空笔迹回收站       |
| [set_pen_style](#set_pen_style)             | 设置白板输入模式样式 |
| [set_input_mode](#set_input_mode)           | 设置白板输入模式     |
| [set_erase_size](#set_erase_size)           | 设置橡皮参数         |
| [set_geometry_mode](#set_geometry_mode)     | 设置图形模式         |
| [set_whiteboard_back](#set_whiteboard_back) | 设置白板的背景色     |
| [get_documents](#get_documents)             | 获取当前白板页列表   |
| [new_document](#new_document)               | 新建白板页           |
| [cut_document](#cut_document)               | 切换白板页           |
| [insert_document](#insert_document)         | 插入白板页           |
| [delete_document](#delete_document)         | 删除白板页           |
| [clean_document](#clean_document)           | 清空白板页           |
| [upload_file](#upload_file)                 | 白板内上传文件       |
| [delete_widget](#delete_widget)             | 删除白板内选择的文件 |
| [preUpload](#preUpload)                     | 预上传文件           |
| [loadPreUploadFile](#loadPreUploadFile)     | 加载预上传的文件     |

# 房间相关方法详细描述

-   以下方法都通过 `client.controller` 调用

## initConfig

初始化打开白板所需的参数，params 包含以下属性

```js
client.controller.initConfig(params)
```

| 参数 | 类型                      | 描述                                                  |
|---- |-------------------------|-----------------------------------------------------|
|path| string                  | 白板 iframe 的 src                                     |
|el| string <br> HTMLElement | 承载白板 iframe 的容器，传 DOM 元素 id 或元素本身，默认传递'iframeBox'   |
|playbackUrl| string                  | 回放模块请求地址                                            |

## join_room

加入房间，参数均从服务端获取

```js
client.controller.join_room(appId, meetingId, userId, token)
```

| 参数 | 类型     | 描述       |
|---- |--------|----------|
|appId| string | 应用的 ID   |
|meetingId| string | 房间 ID    |
|userId| string | 用户 ID    |
|token| string | 认证信息     |

## leave_room

离开房间

```js
client.controller.leave_room()
```

## registerRoomEvent

注册事件回调

```js
client.controller.registerRoomEvent({
	onJoinSuccess: (userlist) => console.log('onJoinSuccess', userlist),
	onJoinFailed: () => console.log('onJoinFailed'),
	onRoomStatusChanged: (code) => console.log('onRoomStatusChanged', code),
	onUserJoin: (user) => console.log('onUserJoin', user),
	onUserLeave: (user) => console.log('onUserLeave', user),
	onDocumentListChanged: (documentList) =>
		console.log('onDocumentListChanged', documentList),
	onDocumentPageChanged: (documentId) =>
		console.log('onDocumentPageChanged', documentId),
	onEnterOffline: () => console.log('onEnterOffline'),
	onWidgetActivity: (widget) => console.log('onWidgetActivity', widget),
	webAssemblyOnReady: () => console.log('webAssemblyOnReady'),
})
```

| 事件名称              | 事件描述                                                               |
| --------------------- | ---------------------------------------------------------------------- |
| onJoinSuccess         | 加入房间成功                                                           |
| onJoinFailed          | 加入房间失败                                                           |
| onRoomStatusChanged   | 房间连接状态改变                                                       |
| onUserJoin            | 有人加入房间                                                           |
| onUserLeave           | 有人离开房间                                                           |
| onDocumentListChanged | 白板页列表发生了变化                                                   |
| onDocumentPageChanged | 白板页翻页                                                             |
| onEnterOffline        | offlineConfig 设置 supportOffline 为 true 后，重连超时自动进入离线模式 |
| onWidgetActivity      | 点击白板时触发，返回被点击的资源信息                                   |

其中 onRoomStatusChanged 回调为房间状态改变时触发，参数 code 对应以下状态

|状态码| 描述     |
|---|--------|
|0 | 未连接房间  |
|1| 正在连接房间 |
|2| 已链接房间  |
|3 | 连接失败   |

其中 onJoinSuccess 参数 userlist 为房间内当前人员列表，列表内人员属性参考 onUserJoin 和 onUserLeave

其中 onUserJoin 和 onUserLeave 回调为房间内有人加入或离开时触发，参数 user 为该人员的信息

|属性| 描述        |
|---|-----------|
|headPic| 用户头像 url  |
|nickName| 用户昵称      |
|sessionId| sessionId |
|userId| userId    |

其中 onDocumentListChanged 回调为加入房间时以及白板页数量变动时触发，参数 documentList 为该房间内白板页列表,列表项包含属性如下

|属性| 描述     |
|---|--------|
|bgColor| 白板页背景色 |
|documentId| 白板页 Id |
|documentNo| 白板序列号  |

其中 onDocumentPageChanged 回调为加入房间时以及白板翻页时触发，参数 documentId 为当前白板页 Id

其中 onWidgetActivity 回调点击白板时触发，参数 widget 为被点击的资源，包含以下参数

|属性| 描述                |
|---|-------------------|
|isDelete| 是否被删除             |
|md5| 资源加密 md5 值        |
|name| 上传时的资源名称          |
|objectName| 服务器保存的资源名         |
|pageCount| 资源总页数             |
|pageNo| 资源当前页             |
|path| 加密路径              |
|resourceId| 资源 id             |
|type| 类型 0 白板 1 文档 2 图片 |
|userId| 上传用户的 userId      |
|widgetId| 控件 id，删除文件等操作时使用  |

其中 webAssemblyOnReady 回调为白板 wasm 资源准备就绪时触发

## createInstance

创建一个白板实例，重复调用只返回当前白板实例

```js
client.controller.createInstance()
```

## getRecord

获取回放数据并初始化回放模块，必须在房间关闭的状态下调用

```js
client.controller.getRecord(recordId)
```

## offlineConfig

用于配置房间中发生断网后的离线支持，必须在加入房间前调用，否则只会在下次加入房间生效

```js
client.controller.offlineConfig(params)
```

| 参数 | 类型      | 描述 |
| -------- |---------| --------------------------------------------------- |
| supportOffline | boolean | 是否支持离线状态。默认为 false。如果设为 true，则房间模式中如果发生网络中断并在自动重连超出指定次数后进入到房间离线状态。离线状态时房间状态处于 OFFLINE。此时可以继续使用白板的基础功能，但是不能插入文件。 |
| onlineAutoSync | boolean | 当房间从离线状态恢复到在线状态后是否自动同步离线状态时的操作记录到服务器。默认为 false。 |

## enterOffline

进入离线模式。离线模式与房间模式和回放模式互斥，如过已经打开了房间或开始了回放，必须首先退出房间或关闭回放后才能进入离线模式

```js
client.controller.enterOffline()
```

## exitOffline

退出离线模式

```js
client.controller.exitOffline()
```

## delete_widget

删除白板内选择的文件（仅普通房间模式可用）

```js
client.controller.delete_widget(widgetId)
```

| 参数     | 类型     | 描述                                                |
| -------- |--------| --------------------------------------------------- |
| widgetId | string | 选择的文件 widgetId，默认点击文件时会存储，可以不传 |

## preUpload

预上传文件

```js
client.controller.preUpload(file, meetingId): Promise
```

| 参数 | 类型 | 描述 |
| -------- | ------ | --------------------------------------------------- |
| file | File | 需要上传的文件 |
| meetingId | string | 房间 Id |

## loadPreUploadFile

加载预上传的文件，参数除 top,left,width,height 外均从 preUpload 获取

```js
client.controller.loadPreUploadFile(params: Object): Promise
```

| 参数 | 类型 | 描述 |
| -------- | ------ | --------------------------------------------------- |
| fileGroupId | string | 文件组 ID |
| resourceId | string | 资源 ID |
| fileName | string | 文件名称 |
| objectName | string | 文件对象名称 |
| md5 | string | 文件 MD5 |
| fileSize | number | 文件大小 |
| fileType | number | 文件类型 |
| extension | string | 文件扩展名 |
| top | number | 文件渲染位置（左上角为原点） |
| left | number | 文件渲染位置（左上角为原点） |
| width | number | 文件渲染宽 |
| height | number | 文件渲染高 |

## rubber_undo

还原笔迹

```js
client.controller.rubber_undo()
```

## clear_recovery

清空笔迹回收站

```js
client.controller.clear_recovery()
```

## set_pen_style

设置白板输入模式样式，set_input_mode 设置为 0 时有效

```js
client.controller.set_pen_style({type, color, size})
```

| 参数  | 类型     | 描述                                                                 |
| ----- |--------| -------------------------------------------------------------------- |
| type  | number | `铅笔0`<br>`马克笔1`<br>`点2`<br>`手3`<br>`空心箭头4`<br>`实心箭头5` |
| color | string | 16 进制颜色(只在 0 和 1 类型下生效，都不能为空)                      |
| size  | number | 尺寸(只在 0 和 1 类型下生效，都不能为空)                             |

## set_input_mode

设置白板输入模式

```js
client.controller.set_input_mode(mode)
```

| 参数 | 类型     | 描述                                                                    |
| ---- |--------| ----------------------------------------------------------------------- |
| mode | number | `普通模式0`<br>`橡皮模式1`<br>`选择模式2`<br>`图形模式3`<br>`文字模式4` |

## set_erase_size

设置橡皮参数

```js
client.controller.set_erase_size(size)
```

| 参数 | 类型     | 描述     |
| ---- |--------| -------- |
| size | number | 橡皮大小 |

## set_geometry_mode

设置图形模式

```js
client.controller.set_geometry_mode(mode)
```

| 参数 | 类型     | 描述                                                  |
| ---- |--------| ----------------------------------------------------- |
| mode | number | `矩形 0` <br> `圆 1` <br> `线条 3` <br> `箭头 6` <br> |

## set_whiteboard_back

设置白板的背景色（仅普通房间模式可用）

```js
client.controller.set_whiteboard_back(theme)
```

| 参数  | 类型     | 描述        |
| ----- |--------| ----------- |
| theme | string | 16 进制颜色 |

## get_documents

获取当前白板页列表

```js
client.controller.get_documents()
```

## new_document

新建白板页（仅普通房间模式可用）

```js
client.controller.new_document()
```

## cut_document

切换白板页（仅普通房间模式可用）

```js
client.controller.cut_document(documentId)
```

| 参数       | 类型     | 描述      |
| ---------- |--------| --------- |
| documentId | string | 白板页 ID |

## insert_document

插入白板页（仅普通房间模式可用）

```js
client.controller.insert_document(documentId)
```

| 参数       | 类型     | 描述      |
| ---------- |--------| --------- |
| documentId | string | 白板页 ID |

## delete_document

删除白板页（仅普通房间模式可用）

```js
client.controller.delete_document(documentId)
```

| 参数       | 类型     | 描述      |
| ---------- |--------| --------- |
| documentId | string | 白板页 ID |

## clean_document

清空白板页，pdf 模式下不用传 documentId

```js
client.controller.clean_document(documentId)
```

| 参数       | 类型     | 描述      |
| ---------- |--------| --------- |
| documentId | string | 白板页 ID |

## upload_file

白板内上传文件，位置和大小相对 onWhiteBoardOpened 回调参数 size 的宽高

```js
client.controller.upload_file({file, left, top, width, height})
```

| 参数 | 类型 | 描述 |
| -------- | ------ | ------- |
| file | File | 要上传的文件 |
| left | number | 文件在白板内距离左侧的距离 |
| top | number | 文件在白板内距离上方的距离 |
| width | number | 白板内显示文件的宽 |
| height | number | 白板内显示文件的高 |

## 白板实例的方法

实例由[createInstance](#createInstance)方法创建并返回

```js
const instance = client.controller.createInstance(bucketId, el)
```

-   以下方法都通过实例调用

| 方法名称                                            | 方法描述           |
| --------------------------------------------------- | ------------------ |
| [switchBucket](#switchBucket)                       | 切换白板           |
| [registerWhiteBoardEvent](#registerWhiteBoardEvent) | 注册白板事件回调   |
| [registerPPTEvent](#registerPPTEvent)               | 注册 PPT 事件回调  |
| [registerPDFEvent](#registerPDFEvent)               | 注册 PDF 事件回调  |
| [sendMessage](#sendMessage)                         | 发送用户自定义消息 |
| [registerPlaybackEvent](#registerPlaybackEvent)     | 注册回放事件回调   |

## 白板实例中主动控制的方法

| 参数                                        | 描述                     |
| ------------------------------------------- | ------------------------ |
| [nextStep](#nextStep)                       | ppt 下一步               |
| [preStep](#preStep)                         | ppt 上一步               |
| [jumpStep](#jumpStep)                       | ppt 跳到指定步           |
| [nextPage](#nextPage)                       | ppt / pdf 下一页         |
| [prePage](#prePage)                         | ppt / pdf 上一页         |
| [jumpPage](#jumpPage)                       | ppt / pdf 跳到指定页     |
| [getFileState](#getFileState)               | 获取当前文件状态         |
| [getBucketId](#getBucketId)                 | 获取白板 bucketId        |
| [getBoardMode](#getBoardMode)               | 获取白板模式             |
| [setPDFOperationMode](#setPDFOperationMode) | 设置 pdf 操作模式        |
| [play](#play)                               | 播放回放                 |
| [stop](#stop)                               | 停止回放                 |
| [pause](#pause)                             | 暂停回放                 |
| [seek](#seek)                               | 跳转回放                 |
| [calibrate](#calibrate)                     | 校准回放                 |
| [release](#release)                         | 关闭回放                 |
| [getPosition](#getPosition)                 | 获取当前回放进度         |
| [getDuration](#getDuration)                 | 获取回放总时长           |
| [getStatus](#getStatus)                     | 获取当前回放状态         |
| [getRecordId](#getRecordId)                 | 获取当前回放 id          |
| [getWhiteBoardSize](#getWhiteBoardSize)     | 获取当前回放白板虚拟尺寸 |
| [resize](#resize)                           | 设置白板大小             |

## 白板相关方法详情

## switchBucket

切换白板

```js
instance.switchBucket(bucketId)
```

| 参数     | 描述              |
| -------- | ----------------- |
| bucketId | 新白板的 bucketId |

## registerWhiteBoardEvent

注册白板事件回调

```js
instance.registerWhiteBoardEvent({
	onWhiteBoardOpened: (size) => console.log('onWhiteBoardOpened', size),
	onWhiteBoardOpenFailed: () => console.log('onWhiteBoardOpenFailed'),
	onWhiteBoardClosed: () => console.log('onWhiteBoardClosed'),
	onUserMessage: (content) => console.log('onUserMessage', content),
	onFileFlipped: (fileState) => console.log('onFileFlipped', fileState),
	onFileBeginUpload: (resourceId) =>
		console.log('onFileBeginUpload', resourceId),
	onFileUploaded: (resourceId) => console.log('onFileUploaded', resourceId),
	onFileUploadFail: (resourceId) =>
		console.log('onFileUploadFail', resourceId),
	onFileBeginDownload: (resourceId) =>
		console.log('onFileBeginDownload', resourceId),
	onFileDownloaded: (resourceId) =>
		console.log('onFileDownloaded', resourceId),
	onFileDownloadFail: (resourceId) =>
		console.log('onFileDownloadFail', resourceId),
	onFileRendered: (resourceId) => console.log('onFileRendered', resourceId),
	onFileRenderFail: (resourceId) =>
		console.log('onFileRenderFail', resourceId),
})
```

| 事件名称               | 事件描述           |
| ---------------------- | ------------------ |
| onWhiteBoardOpened     | 打开白板成功       |
| onWhiteBoardOpenFailed | 打开白板失败       |
| onWhiteBoardClosed     | 关闭白板成功       |
| onUserMessage          | 接收用户自定义消息 |
| onFileFlipped          | 白板文件翻页       |
| onFileBeginUpload      | 白板文件开始上传   |
| onFileUploaded         | 白板文件上传成功   |
| onFileUploadFail       | 白板文件上传失败   |
| onFileBeginDownload    | 白板文件开始下载   |
| onFileDownloaded       | 白板文件下载成功   |
| onFileDownloadFail     | 白板文件下载失败   |
| onFileRendered         | 白板文件渲染成功   |
| onFileRenderFail       | 白板文件渲染失败   |

onWhiteBoardOpened 回调为白板打开成功时触发，参数 size 为白板的虚拟宽高，无单位

| 属性 |类型| 描述 |
| -----------------|----- | ------------ |
| width |number| 白板的虚拟宽度 |
| height |number| 白板的虚拟高度 |

onUserMessage 回调为调用 sendMessag e后，其他用户会触发的回调，参数 content

| 属性 |类型| 描述 |
| ---------------|--- | ------------ |
| content | object |用户发送的自定义消息内容 |

onFileFlipped 回调在白板内文件下载完成时以及文件翻页时触发，参数 fileState

| 属性 |类型| 描述 |
| --------------|-------- | ------------ |
| pageCount |number| 文化总页数 |
| pageNo |number| 文件当前页 |
| resourceId |number| 文件的 resourceId|
| widgetId |string| 文件的 widgetId |

onFileBeginUpload; onFileUploaded; onFileUploadFail; onFileBeginDownload; onFileDownloaded; onFileDownloadFail; onFileRendered onFileRenderFail 回调参数

| 属性 |类型| 描述 |
| ---------------|--- | ------------ |
| resourceId | string |文件的 resourceId |

## registerPPTEvent

注册 ppt 事件回调，以下回调只有在 ppt-play 模式才会触发

```js
instance.registerPPTEvent({
	onFileLoadedSuccessful: () => console.log('onFileLoadedSuccessful'),
	onFileLoadingFailed: (code) => console.log('onFileLoadingFailed', code),
	onFileStateChanged: (data) => console.log('onFileStateChanged', data),
})
```

| 事件名称               | 事件描述         |
| ---------------------- | ---------------- |
| onFileLoadedSuccessful | ppt 加载成功     |
| onFileLoadingFailed    | ppt 加载失败     |
| onFileStateChanged     | ppt 文件状态改变 |

其中 onFileStateChanged 回调为 ppt 翻页等操作时触发，参数 data 内包含以下参数

|名称| 类型     | 描述            |
|---|--------|---------------|
|no | number | 当前 ppt 页号     |
|step| number | 当前 ppt 动画位置索引 |
|pageCount| number | ppt 总页数       |
|stepCount | number | ppt 总动画数      |

其中 onFileLoadingFailed 回调为 ppt 文档打开失败时触发，参数 code 对应以下描述

|错误码| 描述      |
|---|---------|
|501 | 幻灯片下载失败 |
|502| 脚本下载失败  |

## registerPDFEvent

注册 pdf 事件回调，以下回调只有在 pdf-play 模式才会触发

```js
instance.registerPDFEvent({
	onFileLoadedSuccessful: () => console.log('onFileLoadedSuccessful'),
	onFileLoadingFailed: (code) => console.log('onFileLoadingFailed', code),
	onFileStateChanged: (data) => console.log('onFileStateChanged', data),
})
```

| 事件名称               | 事件描述         |
| ---------------------- | ---------------- |
| onFileLoadedSuccessful | pdf 加载成功     |
| onFileLoadingFailed    | pdf 加载失败     |
| onFileStateChanged     | pdf 文件状态改变 |

其中 onFileStateChanged 回调为 pdf 翻页操作时触发，参数 data 内包含以下参数

| 名称 | 类型     | 描述 |
|----|--------|----------|
| currentPage | number |当前 pdf 页号|
| pageCount| number |pdf 总页数|

其中 onFileLoadingFailed 回调为 pdf 文档打开失败时触发，参数 code 对应以下描述

|错误码| 描述    |
|---|-------|
|501 | 加载失败  |
|502| 文件无效  |
|503| 文件丢失  |
|504| 意外的错误 |

## sendMessage

发送用户自定义消息

```js
instance.sendMessage(command, content)
```

| 参数 | 类型     | 描述|
| ---------------------- |--------| ----|
| command | string | 指令名，主动调用时固定填写 `custom` |
| content | Json   | 消息内容，必须 json 格式 |

## registerPlaybackEvent

注册回放事件回调

```js
instance.registerPlaybackEvent({
	onInitFinished: (totalTime) => console.log('onInitFinished', totalTime),
	onError: (code) => console.log('onError', code),
	onStatusChanged: (status) => console.log('onStatusChanged', status),
	onProgress: (data) => console.log('onProgress', data),
	onBoardSizeChanged: (size) => console.log('onBoardSizeChanged', size),
	onFileLoadingFailed: (error) => console.log(error),
})
```

onInitFinished 回放模式初始化完成回调

| 参数 | 类型     | 描述|
| ------ |--------| ----|
| totalTime | number | 回放总时长，毫秒 |

onError 回放模式错误回调，code 对应以下描述

|错误码| 描述            |
|---|---------------|
|100 | 网络不可用         |
|101| 服务器错误或繁忙      |
|500| 未关闭房间，不可初始化回放 |
|501| 下载回放记录文件失败    |
|502| 回放记录不存在       |
|503| 录制未结束         |

onStatusChanged 回放状态改变回调 status 为当前状态

| 参数 | 类型     | 描述|
| ------ |--------| ----|
| status | string | `IDLE`空闲状态 <br> `LOADING`正在初始化数据 <br> `PREPARED` 已就绪<br> `PLAYING`播放中 <br> `PAUSED`已暂停 <br> `STOPPED`已停止 <br>`ERROR` 错误 <br> `DESTROYED`对象已销毁|

onProgress 回放进度通知回调，播放中 200 毫秒触发一次，data 包含参数如下

| 参数 | 类型     | 描述|
| ------ |--------| ----|
| position | number | 当前进度，毫秒 |
| duration | number | 回放总时长，毫秒 |

onBoardSizeChanged 白板尺寸改变回调，size 包含参数如下

| 参数 | 类型     | 描述|
| ------ |--------| ----|
| width | number | 白板虚拟宽 |
| height | number | 白板虚拟高 |

onFileLoadingFailed 回放中的文件加载失败回调， error 包含参数如下

| 参数 | 类型     | 描述                              |
| ------ |--------|---------------------------------|
| bucketId | string | 白板 id                           |
| mode | string | 白板类型 `ppt_play pdf_scroll` 两者之一 |
| extra | string | 文件对应的描述信息                       |
| errorCode | number | 文件加载失败的错误码                      |

## nextStep

ppt 下一步，当该页没有动画或者当前已经是该页最后一步动画时调用，ppt 会翻到下一页

```js
instance.nextStep()
```

## preStep

ppt 上一步，如果当前页动画全部未执行时调用翻到上一页，否则状态变更为当前页未执行动画的状态

```js
instance.preStep()
```

## jumpStep

ppt 跳到指定步

```js
instance.jumpStep(step)
```

|参数| 类型     | 描述      |
|---|--------|---------|
|step| number | ppt 目标步 |

## nextPage

ppt / pdf 下一页

```js
instance.nextPage()
```

## prePage

ppt / pdf 上一页
```js
instance.prePage()
```

## jumpPage

跳到指定页

```js
instance.jumpPage(page)
```

|参数|类型| 描述                          |
|---|---|-----------------------------|
|page|int| 目标页，当前页与目标页之间的页码不存在时会补齐其间的页 |

## getFileState

获取当前文件状态，返回值参考下方 ppt/pdf 事件回调 onFileStateChanged 参数

```js
instance.getFileState()
```

## getBucketId

获取白板 bucketId

```js
instance.getBucketId()
```

## getBoardMode

获取白板模式

```js
instance.getBoardMode()
```

## setPDFOperationMode

设置 pdf 操作模式

```js
instance.setPDFOperationMode(boolean)
```

| 参数      | 类型      | 描述 |
|---------|---------| ------- |
| boolean | boolean | true 开启 pdf 操作模式, false 关闭。 <br> pdf 操作模式下： <br>pc：↑↓ 箭头和滚轮 控制上下滚动，ctrl+滚轮控制缩放 <br> h5：双指缩放，单指滑动滚动 |

## play

播放回放

```js
instance.play()
```

## stop

停止回放

```js
instance.stop()
```

## pause

暂停回放

```js
instance.pause()
```

## seek

跳转回放

```js
instance.pause(position)
```

| 参数 | 类型     | 描述 |
| -------- |--------| ------- |
| position | number | 跳转回放的目标位置时间，[0,总时长] 区间，毫秒 |

## calibrate

校准回放

```js
instance.calibrate(offset)
```

| 参数 | 类型     | 描述 |
| -------- |--------| ------- |
| offset | number | 校准的时间长度，[-5000,5000] 区间，毫秒 |

## release

关闭回放

```js
instance.release()
```

## getPosition

获取当前回放进度，毫秒

```js
instance.getPosition()
```

## getDuration

获取回放总时长，毫秒

```js
instance.getDuration()
```

## getStatus

获取当前回放状态，值参考 registerPlaybackEvent 中 onStatusChanged 回调参数

```js
instance.getStatus()
```

## getRecordId

获取当前回放 id

```js
instance.getRecordId()
```

## getWhiteBoardSize

获取当前回放白板虚拟尺寸，值参考 registerPlaybackEvent 中 onBoardSizeChanged 回调参数

```js
instance.getWhiteBoardSize()
```

## resize

设置白板 canvas 元素的 width 和 height 属性，参数 number 类型无单位

```js
instance.resize(width, height)
```
