import { Button, Drawer, message, Modal, Popover, Spin } from 'antd';
import classNames from 'classnames';
// @ts-ignore
import * as eruda from 'eruda';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ColorDotProps } from '../../components/color-dot';
import ColorDotBar, { Bar } from '../../components/color-dot-bar';
import Geometry from '../../components/geometry';
import Gesture from '../../components/gesture';
import HighlighterPen from '../../components/highlighter-pen';
import Icon from '../../components/icon';
import RoomLoading from '../../components/room-loading';
import Rubber from '../../components/rubber';
import WritingPen from '../../components/writing-pen';
import useBackgroundChange from '../../hooks/useBackgroundChange';
import useDocumentChange from '../../hooks/useDocumentChange';
import useJoinedRoom from '../../hooks/useJoinedRoom';
import usePageChanged from '../../hooks/usePageChanged';
import usePageListChanged from '../../hooks/usePageListChanged';
import useWebassemblyReady from '../../hooks/useWebassemblyReady';
import useWidgetActivity from '../../hooks/useWidgetActivity';
import { storeContext } from '../../store';
import { InputMode, JoinRoomStatus } from '../../types/qn-whiteboard';
import { QNWhiteboardLog } from '../../utils/log';
import css from './index.module.scss';

const Room = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { whiteboardClient, isJoined, roomError } = useJoinedRoom();
    const { webassemblyReady } = useWebassemblyReady(whiteboardClient);
    const { documents } = usePageListChanged(whiteboardClient);
    const { curDocument } = useDocumentChange(whiteboardClient, documents);
    const { state, dispatch } = useContext(storeContext);
    const uploadFileElement = useRef<HTMLInputElement | null>(null);
    const [roomLoading, setRoomLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const startTime = useRef<number | undefined>();
    const webassemblyTimeSpent = useRef<number | undefined>();
    const joinedRoomTimeSpent = useRef<number | undefined>();
    const [bgColor, setBgColor] = useState<string>();
    const { activeWidget, setActiveWidget } = useWidgetActivity(whiteboardClient);
    useBackgroundChange(whiteboardClient, curDocument);
    usePageChanged(whiteboardClient);
    const [uploadFileSpinning, setUploadFileSpinning] = useState(false);

    /**
     * 收集初始时间和 debug 信息
     */
    useEffect(() => {
      startTime.current = Date.now();
      const isDebug = JSON.parse(new URLSearchParams(window.location.search).get('isDebug') || '') || false;
      dispatch({
        type: 'updateIsDebug',
        payload: isDebug
      });
      if (isDebug) {
        eruda.init();
      }
    }, [dispatch]);

    /**
     * 计算加载花费的时间
     */
    function getTimeSpent(): number {
      if (startTime.current) {
        return Date.now() - startTime.current;
      }
      return 0;
    }

    /**
     * 计算 webassembly 性能时间
     */
    useEffect(() => {
      if (state.isDebug) {
        if (webassemblyReady) { // webassembly 资源加载花费的时间
          webassemblyTimeSpent.current = getTimeSpent();
          QNWhiteboardLog('webassemblyTimeSpent', webassemblyTimeSpent.current);
        }
      }
    }, [state.isDebug, webassemblyReady]);

    /**
     * 计算加入房间时间
     */
    useEffect(() => {
      if (state.isDebug) {
        if (isJoined) { // 加入房间花费的时间
          joinedRoomTimeSpent.current = getTimeSpent();
          QNWhiteboardLog('joinedRoomTimeSpent', joinedRoomTimeSpent.current);
        } else {
          if (roomError) {
            const webSocketError = [
              JoinRoomStatus.Error,
              JoinRoomStatus.Close
            ].includes(roomError);
            if (webSocketError) { // WebSocket 连接错误
              Modal.error({
                title: 'WebSocket Connect Error',
                content: `WebSocket Connect ${webSocketError}`
              });
            } else { // 请求错误
              Modal.error({
                title: 'error',
                content: JSON.stringify(roomError)
              });
            }
          }
        }
      }
    }, [state.isDebug, isJoined, roomError]);

    /**
     * 弹窗显示加载的时间
     */
    useEffect(() => {
      if (curDocument && state.isDebug) {
        const webassemblyTimeSpentSecond = webassemblyTimeSpent.current || 0;
        const joinedRoomTimeSpentSecond = joinedRoomTimeSpent.current || 0;
        Modal.info({
          title: '性能检测',
          content: <>
            <div>webassembly 资源加载花费了{(webassemblyTimeSpentSecond / 1000).toFixed(2)}秒</div>
            <div>加入房间花费了{(joinedRoomTimeSpentSecond / 1000).toFixed(2)}秒</div>
          </>
        });
      }
    }, [curDocument, state.isDebug]);

    /**
     * 初始化完成
     */
    useEffect(() => {
      if (curDocument) {
        dispatch({
          type: 'updateWhiteboardClient',
          payload: whiteboardClient
        });
        whiteboardClient.setCanvasStyle();
        QNWhiteboardLog('loading ok');
        setRoomLoading(false);
      }
    }, [whiteboardClient, curDocument, dispatch]);

    /**
     * 切换切换组件
     */
    const onToggleDrawer = useCallback(() => {
      setDrawerVisible(!drawerVisible);
    }, [drawerVisible]);

    /**
     * 点击选择 icon
     */
    const setInputMode = useCallback((mode: InputMode) => {
      dispatch({
        type: 'updateInputMode',
        payload: mode
      });
    }, [dispatch]);

    /**
     * 点击上传文件按钮
     */
    const uploadFileClick = useCallback(() => {
      uploadFileElement.current?.click();
    }, []);

    /**
     * 选中文件并上传
     */
    const uploadFile = useCallback(event => {
      if (whiteboardClient) {
        setUploadFileSpinning(true);
        const superior = Object.assign(
          whiteboardClient.controller.room,
          whiteboardClient.controller.me
        );
        QNWhiteboardLog('superior', superior);
        whiteboardClient.uploadFile({
          file: event.target.files[0],
          superior,
          left: 100,
          top: 200,
          width: 800,
          height: 1000,
          callback(error?: string) {
            if (error) {
              Modal.warning({
                title: '上传文件出错',
                content: JSON.stringify(error)
              });
            } else {
              message.success('文件上传成功~');
            }
            setUploadFileSpinning(false);
          }
        });
      }
    }, [whiteboardClient]);

    /**
     * 展开/缩起
     */
    const toggleExpanded = useCallback(() => {
      setIsExpanded(!isExpanded);
    }, [isExpanded]);

    /**
     * 删除指定页
     */
    const deleteDocument = useCallback((documentNo: number) => {
      const documentId = documents.find(document => document.documentNo === documentNo)?.documentId;
      if (documentId) {
        whiteboardClient.deleteDocument(documentId);
      } else {
        Modal.warning({
          title: 'deleteDocument',
          content: 'node documentId'
        });
      }
    }, [whiteboardClient, documents]);

    /**
     * createDocument
     */
    const createDocument = useCallback((documentNo?: number) => {
      if (whiteboardClient) {
        if (documentNo) { // 插入文档
          const documentId = documents.find(document => document.documentNo === documentNo)?.documentId;
          if (documentId) {
            whiteboardClient.insertDocument(documentId);
          } else {
            Modal.warning({
              title: 'createDocument',
              content: 'node documentId'
            });
          }
        } else { // 创建文档
          whiteboardClient.newDocument();
        }
      } else {
        Modal.warning({
          title: 'createDocument',
          content: 'no whiteboardClient'
        });
      }
    }, [whiteboardClient, documents]);

    /**
     * 切换到上一页
     */
    const toggleDocumentPrev = useCallback(() => {
      const documentNo = curDocument?.documentNo || 1;
      const prevNo = documentNo - 1;
      const documentId = documents.find(document => document.documentNo === prevNo)?.documentId;
      if (prevNo > 0 && documentId) {
        whiteboardClient.cutDocument(documentId);
      }
    }, [documents, curDocument, whiteboardClient]);

    /**
     * 切换到下一页
     */
    const toggleDocumentNext = useCallback(() => {
      const documentNo = curDocument?.documentNo || 1;
      const nextNo = documentNo + 1;
      const documentId = documents.find(document => document.documentNo === nextNo)?.documentId;
      if (nextNo > 0 && documentId) {
        whiteboardClient.cutDocument(documentId);
      }
    }, [documents, curDocument, whiteboardClient]);

    /**
     * 切换到指定页
     * @param documentNo
     */
    const toggleDocument = useCallback((documentNo: number) => {
      const documentId = documents.find(document => document.documentNo === documentNo)?.documentId;
      if (documentId) {
        whiteboardClient.cutDocument(documentId);
      }
    }, [whiteboardClient, documents]);

    /**
     * 切换白板背景色
     * @param v
     */
    const changeBgColor = useCallback((v: ColorDotProps) => {
      setBgColor(v.color);
    }, []);

    /**
     * 切换背景色
     */
    useEffect(() => {
      if (whiteboardClient && bgColor) {
        const bgColorWithOpacity = bgColor === 'transparent' ? '#00000000' : '#ff' + bgColor.replace('#', '');
        whiteboardClient.setWhiteboardBack(bgColorWithOpacity);
      }
    }, [whiteboardClient, bgColor]);

    /**
     * 背景色
     */
    const bgColors = useMemo(() => {
      return [
        { color: '#000000', text: '黑色' },
        { color: '#cccccc', text: '灰色' },
        { color: '#4a4ac5', text: '紫色' },
        { color: 'transparent', text: '透明' }
      ];
    }, []);

    /**
     * 删除 widgetId
     */
    const deleteWidget = () => {
      const widgetId = activeWidget?.widgetId;
      if (whiteboardClient && widgetId) {
        whiteboardClient.deleteWidget(widgetId);
        setActiveWidget(undefined);
      }
    };

    /**
     * 背景色文本
     */
    const bgColorText = useMemo(() => {
      return bgColors.find(color => color.color === bgColor)?.text || '默认';
    }, [bgColors, bgColor]);

    /**
     * 点击清屏
     */
    const clearPage = useCallback(() => {
      const documentId = curDocument?.documentId;
      QNWhiteboardLog('curDocument?.documentId', documentId);
      if (documentId) whiteboardClient.clearPage({
        widgetId: documentId
      });
    }, [whiteboardClient, curDocument]);

    return <div className={css.room}>

      <div className={classNames(css.menu, { [css.menuExpanded]: isExpanded })}>
        <div className={css.menuBar}>
          <Icon
            type='icon-mouse'
            className={css.menuIcon}
            onClick={() => setInputMode(InputMode.Select)}
          />
          <WritingPen
            setInputMode={() => setInputMode(InputMode.Pencil)}
          />
          <HighlighterPen
            setInputMode={() => setInputMode(InputMode.Mark)}
          />
          <Gesture
            setInputMode={() => setInputMode(InputMode.Laser)}
          />
          <Rubber
            setInputMode={() => setInputMode(InputMode.Rubber)}
          />
          <Geometry
            setInputMode={() => setInputMode(InputMode.Geometry)}
          />
          <Icon
            type='icon-upload'
            className={css.menuIcon}
            onClick={uploadFileClick}
          />
        </div>
        <div className={css.menuExpandSlip} onClick={toggleExpanded}>{isExpanded ? '缩起' : '展开'}工具栏</div>
      </div>

      <Drawer placement='left' closable={true} visible={drawerVisible} onClose={() => setDrawerVisible(false)}>
        <div className={css.drawerDocuments}>
          <div
            className={css.drawerDocument}
            onClick={() => createDocument()}
          >+
          </div>
          {
            documents.map(document => {
              const active = document.documentNo === (curDocument?.documentNo || 1);
              return <div
                className={classNames(css.drawerDocument, {
                  [css.active]: active
                })}
                key={document.documentId}
                onClick={() => toggleDocument(document.documentNo)}
              >
                <span>{document.documentNo}</span>
                <Popover
                  content={
                    <>
                      <Button
                        size='small'
                        style={{ marginRight: 10 }}
                        onClick={() => createDocument(document.documentNo)}
                      >插入</Button>
                      <Button
                        size='small'
                        onClick={() => deleteDocument(curDocument?.documentNo || 1)}
                      >删除</Button>
                    </>
                  }
                  trigger='click'
                >
                  <span className={css.documentBtnMore}>...</span>
                </Popover>
              </div>;
            })
          }
        </div>
      </Drawer>

      <div className={css.pagination}>
        <Icon onClick={onToggleDrawer} type='icon-drawer' className={css.iconDrawer} />
        <span
          className={classNames(css.paginationText, css.paginationPre)}
          onClick={toggleDocumentPrev}
        >&lt;</span>
        <span
          className={css.paginationText}
        >{curDocument?.documentNo || 1} / {documents.length || 1}</span>
        {
          (curDocument?.documentNo || 1) <= documents.length - 1 ?
            <span
              className={classNames(css.paginationText, css.paginationNext)}
              onClick={toggleDocumentNext}
            >&gt;</span> :
            <span
              className={classNames(css.paginationText, css.paginationNext)}
              onClick={() => createDocument()}
            >+</span>
        }
      </div>

      <div className={css.featureBar}>
        <Popover
          trigger='click'
          content={
            <ColorDotBar
              dots={bgColors}
              bar={Bar.Color}
              active={bgColor}
              onChange={changeBgColor}
            />
          }
        >
          <Button type='primary'>设置背景：{bgColorText}</Button>
        </Popover>
      </div>

      {
        uploadFileSpinning && <div className={css.uploadFileSpin}>
          <Spin tip='文件上传中...' spinning={uploadFileSpinning} />
        </div>
      }

      <Button
        type='primary'
        style={{
          position: 'fixed',
          right: '25px',
          bottom: '70px',
          zIndex: 2
        }}
        onClick={clearPage}
      >点击清屏</Button>

      <input
        style={{ display: 'none' }}
        type='file'
        ref={uploadFileElement}
        onChange={uploadFile}
      />

      <RoomLoading loading={roomLoading} />

      {
        activeWidget && <Button
          type='primary'
          size='small'
          className={css.deleteWidgetBtn}
          onClick={deleteWidget}
        >删除</Button>
      }
    </div>;
  }
;

export default Room;