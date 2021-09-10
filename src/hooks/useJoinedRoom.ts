import { useContext, useEffect, useState } from 'react';
import { storeContext } from '../store';
import { JoinRoomCallbackRes, JoinRoomStatus } from '../types/qn-whiteboard';
import { QNWhiteboardLog } from '../utils/log';

/**
 * 加入房间
 */
const useJoinedRoom = () => {
  const { state } = useContext(storeContext);
  const [whiteboardClient, setWhiteboardClient] = useState<any>(state.whiteboardClient);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [roomError, setRoomError] = useState<JoinRoomCallbackRes['status']>();
  const [roomToken, setRoomToken] = useState<string | null>(null);

  useEffect(() => {
    function joinRoomCallback(res: JoinRoomCallbackRes) {
      QNWhiteboardLog('joinRoomCallbackRes', res);
      if (res.status === JoinRoomStatus.Open) {
        setIsJoined(true);
      } else {
        setRoomError(res.status);
      }
    }

    if (whiteboardClient) {
      const roomToken = new URLSearchParams(window.location.search).get('roomToken');
      const roomTitle = new URLSearchParams(window.location.search).get('roomTitle');
      QNWhiteboardLog('roomToken', roomToken);
      QNWhiteboardLog('useJoinedRoom whiteboardClient', whiteboardClient);
      setRoomToken(roomToken);
      whiteboardClient.joinRoom(roomToken, joinRoomCallback, {
        title: roomTitle || ''
      });
    } else {
      const qnWhiteboard = new window.QNWhiteboard();
      setWhiteboardClient(qnWhiteboard);
    }
    return () => {
      if (whiteboardClient) {
        whiteboardClient.leaveRoom();
      }
    };
  }, [whiteboardClient]);

  return {
    whiteboardClient,
    isJoined,
    roomError,
    roomToken,
  };
};

export default useJoinedRoom;