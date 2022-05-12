import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import QNWhiteBoard from 'qnweb-whiteboard';

import { MockResult } from '../../api';

import styles from './index.module.scss';

const Home: React.FC = () => {
  const history = useHistory();

  const [appId, setAppId] = useState<string>(MockResult.appId);
  const [meetingId, setMeetingId] = useState<string>(MockResult.meetingId);
  const [userId, setUserId] = useState<string>(MockResult.userId);
  const [token, setToken] = useState<string>(MockResult.token);
  const [bucketId, setBucketId] = useState<string>(MockResult.bucketId);

  const onJoin = () => {
    history.push(`/room?appId=${appId}&meetingId=${meetingId}&userId=${userId}&token=${token}&bucketId=${bucketId}`);
  };

  return <div className={styles.container}>
    <div className={styles.box}>
      <h1 className={styles.title}>七牛白板 demo 体验{QNWhiteBoard.version}</h1>
      <Input
        className={styles.input}
        placeholder="请输入appId"
        value={appId}
        onChange={event => setAppId(event.target.value)}
      />
      <Input
        className={styles.input}
        placeholder="请输入meetingId"
        value={meetingId}
        onChange={event => setMeetingId(event.target.value)}
      />
      <Input
        className={styles.input}
        placeholder="请输入userId"
        value={userId}
        onChange={event => setUserId(event.target.value)}
      />
      <Input
        className={styles.input}
        placeholder="请输入token"
        value={token}
        onChange={event => setToken(event.target.value)}
      />
      <Input
        className={styles.input}
        placeholder="请输入bucketId"
        value={bucketId}
        onChange={event => setBucketId(event.target.value)}
      />
      <Button
        className={styles.button}
        type="primary"
        block
        onClick={onJoin}
      >加入房间</Button>
    </div>
  </div>;
};

export default Home;
