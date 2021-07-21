import { useEffect, useState } from 'react';
import { QNWhiteboardLog } from '../utils/log';

type WhiteboardSize = {
  maxHeight?: number;
  maxWidth?: number;
  currentHeight?: number;
  currentWidth?: number;
}

const useWhiteboardSizeChanged = (whiteboardClient: any) => {
  const [whiteboardSize, setWhiteboardSize] = useState<WhiteboardSize>();

  useEffect(() => {
    function handleWhiteboardSize(event: number, params: WhiteboardSize) {
      QNWhiteboardLog('handleWhiteboardSize params', params);
      setWhiteboardSize(params);
    }

    if (whiteboardClient) {
      whiteboardClient.registerEvent(whiteboardClient.controller.Event.WhiteboardSizeChanged, handleWhiteboardSize);
    }
    return () => {
      if (whiteboardClient) {
        whiteboardClient.unregisterEvent(whiteboardClient.controller.Event.WhiteboardSizeChanged, handleWhiteboardSize);
      }
    };
  }, [whiteboardClient]);

  return {
    whiteboardSize
  };
};

export default useWhiteboardSizeChanged;