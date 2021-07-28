import { useContext, useEffect, useState } from 'react';
import { storeContext } from '../store';
import { JoinRoomStatus } from '../types/qn-whiteboard';
import { QNWhiteboardLog } from '../utils/log';

/**
 * 加入房间
 */
const useJoinedRoom = () => {
  const { state } = useContext(storeContext);
  const [whiteboardClient, setWhiteboardClient] = useState<any>(state.whiteboardClient);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [roomError, setRoomError] = useState<JoinRoomStatus>();

  useEffect(() => {
    if (whiteboardClient) {
      if (whiteboardClient.controller.isWebglContextLost) { // webgl 上下文丢失后刷新页面
        window.location.reload();
        return;
      }
      const roomToken = new URLSearchParams(window.location.search).get('roomToken');
      QNWhiteboardLog('roomToken', roomToken);
      QNWhiteboardLog('useJoinedRoom whiteboardClient', whiteboardClient);
      whiteboardClient.joinRoom(roomToken, (status: JoinRoomStatus) => {
        if (JoinRoomStatus.Open) {
          setIsJoined(true);
        } else {
          setRoomError(status);
        }
      });
    } else {
      const qnWhiteboard = new window.QNWhiteboard();
      setWhiteboardClient(qnWhiteboard);
    }
    return () => {
      if (whiteboardClient) {
        whiteboardClient.leaveRoom();
        whiteboardClient.destroyWebglContext();
      }
    };
  }, [whiteboardClient]);

  return {
    whiteboardClient,
    isJoined,
    roomError
  };
};

export default useJoinedRoom;