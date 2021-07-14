## 开发准备

引入 sdk：

```html
<!--html 文件-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Title</title>
</head>
<body>
  <!--  绑定白板的 canvas -->
  <!-- 单页应用可通过路由拦截控制其显隐藏 -->
  <canvas style='display: none; position: fixed' id='canvas'></canvas>
</body>
<script src='./qnweb-whiteboard-1.0.3-beta.umd.js'></script>
</html>
```

## 快速开始

```js
// js 文件

// 此时 QNWhiteboard 就已经被导入了

const qnWhiteboard = new QNWhiteboard(); // 初始化白板

// 获取 roomToken 加入房间 
qnWhiteboard.joinRoom(roomToken);

//处理白板和房间事件
function processEvent(event,params) {
  switch(event) {
    case qnWhiteboard.controller.Event.AllEvent:
      break;
    case qnWhiteboard.controller.Event.PageListChanged:
      break;
    case qnWhiteboard.controller.Event.PageChanged:
      break;
    case qnWhiteboard.controller.Event.WebassemblyReady:
      break;
    case qnWhiteboard.controller.Event.WhiteboardSizeChanged:
      break;
    case qnWhiteboard.controller.Event.JoinRoomError:
      break;
    case qnWhiteboard.controller.Event.DocumentChange:
      break;
    case qnWhiteboard.controller.Event.BackgroundChange:
      break;
    case qnWhiteboard.controller.Event.WidgetActivity:
      break;
    case qnWhiteboard.controller.Event.FileFlip:
      break;
    case qnWhiteboard.controller.Event.RecoveryState:
      break;
    case qnWhiteboard.controller.Event.WidgetAction:
      break;
  }
}

//注册白板的事件回调函数
qnWhiteboard.registerEvent(qnWhiteboard.controller.Event.AllEvent, processEvent);
```

## API 文档

### QNWhiteboard 实例方法

#### 加入房间

首先访问自己的服务器获取要加入的白板房间的token参数（房间的创建和token的生成由服务器对接SDK服务端接口）。

[如果您还不知道如何生成 RoomToken，请先阅读 七牛实时音视频云接入指南](https://doc.qnsdk.com/rtn/docs/rtn_startup)

```ts
joinRoom(roomToken: string);
```

#### 离开房间

```js
leaveRoom()
```

#### widget 缩放

```js
// 1-放大，2-缩小
enum WidgetConfigScale {
  Zoom = 1, // 放大
  ZoomOut = -1 // 缩小
}
scaleWidget(config: WidgetConfig)
```

#### 删除 widget

```js
deleteWidget(widgetId: string)
```

#### 还原笔迹

```js
rubberUndo()
```

#### 清空 undo 回收站

```js
clearRecovery()
```

#### 设置白板输入模式属性

```js
// 画笔类型 type，0-写字笔，	1-荧光笔，2、3、4、5为指针状态
// 画笔颜色 color: string; #FF+颜色;彩笔: #7F+颜色  
// 画笔尺寸 size: number; 
enum PenType {
  WritingPen,
  HighlighterPen,
  Pointer1,
  Pointer2,
  Pointer3,
  Pointer4,
}
interface PenStyle {
  type?: PenType,
  color?: string,
  size?: number
}
setPenStyle(penStyle: PenStyle);
```

#### 设置白板输入模式

```js
enum InputMode {
  Select = 'select', // 选择模式
  Pencil = 'pencil', // 普通画笔模式
  Laser = 'laser', // 激光模式
  Rubber = 'rubber', // 橡皮模式
  Geometry = 'geometry', // 图形模式
  Mark = 'mark' // mark 笔模式
}
setInputMode(mode: InputMode)
```

#### 设置橡皮参数

```js
setEraseSize(size: number)
```

#### 设置图形模式

```js
// 0-矩形，1-圆，3-线，6-箭头
enum GeometryMode {
  Rectangle = 0, 
  Circle = 1,
  Line = 3,
  Arrow = 6
}
setGeometryMode(mode: Mode)
```

#### 设置白板的背景色

```js
// #FF+颜色
// 透明白板值：#00000000
setWhiteboardBack(color: string)
```

#### 新建文档

```js
newDocument()
```

#### 切换文档

```js
cutDocument(widgetId: string)
```

#### 插入文档

```js
/**
 * 注意：这里的 api 是向传入 widgetId 前面插入的
 */
insertDocument(widgetId: string)
```

#### 删除文档

```js
deleteDocument(widgetId: string)
```

#### 文件上传

```tsx
interface RoleID {
  roleName: string;
  roleId: number;
  level: number;
}
interface Superior {
  appId: string;
  meetingId: string;
  userId: string;
  token: string;
  chatRoomId: number;
  fileGroupId: string;
  sessionId: string;
  nickName: string;
  avatar: string;
  roleId: RoleID[];
}
// file 为上传的文件，可写入一个 <input type="file" id="upload-file" /> 元素。
// 然后获取到这个元素的选中的文件：通过监听这个元素的 change 事件，获取 event.target.files[0] 的值即为要上传的文件
// superior 直接使用 Object.assign(qnWhiteboard.controller.room, qnWhiteboard.controller.me) 得到的值
// left-上传后文件展示的位置
// top-上传后文件展示的位置
// width, height-上传后文件展示的宽和高
interface UploadFileConfig {
  file?: File;
  superior?: Superior,
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  callback?: (error?: any) => void;
}
uploadFile(config: UploadFileConfig)
```

#### 清屏

```tsx
interface ClearPageConfig {
  widgetId: string
}
clearPage(config: ClearPageConfig)
```

#### 设置 canvas 

```tsx
// 不传参默认为全屏
// 注：需要在白板完全初始化之后才可以设置(DocumentChange 事件之后执行)
interface SetCanvasStyle {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
}
setCanvas(style: SetCanvasStyle)
```

#### 事件回调接口介绍

示例：

```js
// 事件注册
// 第一个参数是要注册的事件类型，
// allEvent表示要监听所有事件，
// 如果要监听单一事件，请按照下面的参数说明来注册，第二个参数是要绑定的事件处理函数
qnWhiteboard.registerEvent(qnWhiteboard.controller.Event.AllEvent, processEvent);
function processEvent(event,params) {
  switch(event) {   
    case qnWhiteboard.controller.Event.PageListChanged:      
      break;    
    case qnWhiteboard.controller.Event.PageChanged:      
      break;    
    case qnWhiteboard.controller.Event.WebassemblyReady:      
      break;		
    // ....
  }
}
// 事件注销
// 第一个参数是事件名称,AllEvent代表所有，其他单一事件参考下面的参数说明;第二个参数是具体的绑定函数
qnWhiteboard.unregisterEvent(qnWhiteboard.controller.Event.AllEvent,processEvent);
```

#### 事件参数说明:

##### PageListChanged

```
页面列表变更，例如有人新建或者删除页面
```

##### PageChanged

```
当前显示页面发生变更，例如翻页会触发此动作
```

#####  WhiteboardSizeChanged

```
白板的尺寸发生变更
```

##### JoinRoomError

```
加入房间失败
```

##### DocumentChange

```
文档发生变更
```

##### BackgroundChange

```
背景色发生变更
```

##### WidgetActivity

```
当前的活动 widget 发生变更
```

##### FileFlip

```
当前 widget 被翻页
```

##### RecoveryState

```
橡皮的可还原状态发生变更
```

##### WidgetAction

```
有文件发生变化，例如插入、删除等
```

