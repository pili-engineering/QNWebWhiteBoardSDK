import { useContext, useEffect, useState } from 'react';
import { storeContext } from '../store';
import { JoinRoomStatus } from '../types/qn-whiteboard';
import { QNWhiteboardLog } from '../utils/log';

/**
 * 加入房间
 */
const useJoinedRoom = () => {
  const { state, dispatch } = useContext(storeContext);
  const [whiteboardClient, setWhiteboardClient] = useState<any>(state.whiteboardClient);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [roomError, setRoomError] = useState<JoinRoomStatus>();
  const [roomToken, setRoomToken] = useState<string | null>(null);

  useEffect(() => {
    if (!state.RTCClient) {
      const client = window.QNRTC.default.createClient();
      dispatch({
        type: 'updateRTCClient',
        payload: client
      });
    }
  }, [state.RTCClient, dispatch]);

  useEffect(() => {
    function joinRoomCallback(status: JoinRoomStatus) {
      if (JoinRoomStatus.Open) {
        setIsJoined(true);
      } else {
        setRoomError(status);
      }
    }
    if (whiteboardClient) {
      const roomToken = new URLSearchParams(window.location.search).get('roomToken');
      const roomTitle = new URLSearchParams(window.location.search).get('roomTitle');
      QNWhiteboardLog('roomToken', roomToken);
      QNWhiteboardLog('useJoinedRoom whiteboardClient', whiteboardClient);
      setRoomToken(roomToken);
      state.RTCClient.join(roomToken).then(() => {
        whiteboardClient.joinRoom(roomToken, joinRoomCallback, {
          title: roomTitle || ''
        });
      });
    } else {
      const qnWhiteboard = new window.QNWhiteboard();
      setWhiteboardClient(qnWhiteboard);
    }
    return () => {
      if (whiteboardClient) {
        whiteboardClient.leaveRoom();
      }
      if (state.RTCClient) {
        state.RTCClient.leave();
      }
    };
  }, [whiteboardClient, state.RTCClient]);

  return {
    whiteboardClient,
    isJoined,
    roomError,
    roomToken
  };
};

export default useJoinedRoom;