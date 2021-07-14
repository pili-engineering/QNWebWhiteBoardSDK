import { useEffect, useState } from 'react';
import { QNWhiteboardLog } from '../utils/log';

export interface ActiveWidget {
  isDelete: boolean;
  md5: string;
  name: string;
  objectName: string;
  pageCount: number;
  pageNo: number;
  path: string;
  resourceId: string;
  type: number;
  userId: string;
  widgetId: string;
}

const useWidgetActivity = (whiteboardClient: any) => {

  const [activeWidget, setActiveWidget] = useState<ActiveWidget>();

  useEffect(() => {
    function handleWidgetActivity(event: number, params: ActiveWidget) {
      QNWhiteboardLog('handleWidgetActivity params', params);
      setActiveWidget(params);
    }

    if (whiteboardClient) {
      whiteboardClient.registerEvent(whiteboardClient.controller.Event.WidgetActivity, handleWidgetActivity);
    }
    return () => {
      if (whiteboardClient) {
        whiteboardClient.unregisterEvent(whiteboardClient.controller.Event.WidgetActivity, handleWidgetActivity);
      }
    };
  }, [whiteboardClient]);

  return {
    activeWidget,
    setActiveWidget
  };
};

export default useWidgetActivity;