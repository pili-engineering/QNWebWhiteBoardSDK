// import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { QNWhiteboardLog } from '../utils/log';
import { WhiteboardDocument } from './usePageListChanged';

const useDocumentChange = (whiteboardClient: any, documents: WhiteboardDocument[]) => {
  const [curDocument, setCurDocument] = useState<WhiteboardDocument>();
  const [curWidgetId, setCurWidgetId] = useState<string>();

  useEffect(() => {
    /**
     * 文档发生变更
     * @param event
     * @param params-返回时string为色值
     */
    function handleDocumentChange(event: number, params: string | { widgetId: string }) {
      if (typeof params === 'object' && params !== null) {
        setCurWidgetId(params.widgetId);
      }
    }

    if (whiteboardClient) {
      whiteboardClient.registerEvent(whiteboardClient.controller.Event.DocumentChange, handleDocumentChange);
    }
    return () => {
      if (whiteboardClient) {
        whiteboardClient.unregisterEvent(whiteboardClient.controller.Event.DocumentChange, handleDocumentChange);
      }
    };
  }, [whiteboardClient, documents]);

  useEffect(() => {
    const curDocument = documents.find(document => document.documentId === curWidgetId);
    QNWhiteboardLog('useDocumentChange documents', documents);
    QNWhiteboardLog('useDocumentChange curDocument', curDocument);
    setCurDocument(curDocument || documents[0]);
  }, [documents, curWidgetId]);

  return {
    curDocument
  };
};

export default useDocumentChange;