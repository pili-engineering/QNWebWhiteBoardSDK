import { Button, Input } from 'antd';
import { useCallback, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
// @ts-ignore
import * as eruda from 'eruda';
import { storeContext } from '../../store';
import css from './index.module.scss';

const roomTokens = [
  'QxZugR8TAhI38AiJ_cptTl3RbzLyca3t-AAiH-Hh:PLbvLD84X9Jq5Pq_JCEgVW6nzKU=:eyJhcHBJZCI6ImZuZjB2cjZnbiIsImV4cGlyZUF0IjoxNzUzMzM2OTA3LCJwZXJtaXNzaW9uIjoidXNlciIsInJvb21OYW1lIjoid2ViMSIsInVzZXJJZCI6IndlYnVzZXIxIn0=',
  'QxZugR8TAhI38AiJ_cptTl3RbzLyca3t-AAiH-Hh:6QC0NuGyD0EWRx5A3hQuon8ly10=:eyJhcHBJZCI6ImZuZjB2cjZnbiIsImV4cGlyZUF0IjoxNzUzMzM2OTA3LCJwZXJtaXNzaW9uIjoidXNlciIsInJvb21OYW1lIjoid2ViMiIsInVzZXJJZCI6IndlYnVzZXIyIn0=',
  'QxZugR8TAhI38AiJ_cptTl3RbzLyca3t-AAiH-Hh:ZnoWpF5_ZHX3pFZN-Cq2TBjPqjQ=:eyJhcHBJZCI6ImZuZjB2cjZnbiIsImV4cGlyZUF0IjoxNzUzMzM2OTA3LCJwZXJtaXNzaW9uIjoidXNlciIsInJvb21OYW1lIjoid2ViMyIsInVzZXJJZCI6IndlYnVzZXIzIn0=',
  'QxZugR8TAhI38AiJ_cptTl3RbzLyca3t-AAiH-Hh:OBNcZ-vFDXwQllv5g_EyMZqzXxQ=:eyJhcHBJZCI6ImZuZjB2cjZnbiIsImV4cGlyZUF0IjoxNzUzMzM2OTA3LCJwZXJtaXNzaW9uIjoidXNlciIsInJvb21OYW1lIjoid2ViNCIsInVzZXJJZCI6IndlYnVzZXI0In0=',
  'QxZugR8TAhI38AiJ_cptTl3RbzLyca3t-AAiH-Hh:DEfuUp8K3-kuZa7qN0qCnNcX7Dc=:eyJhcHBJZCI6ImZuZjB2cjZnbiIsImV4cGlyZUF0IjoxNzUzMzM2OTA3LCJwZXJtaXNzaW9uIjoidXNlciIsInJvb21OYW1lIjoid2ViNSIsInVzZXJJZCI6IndlYnVzZXI1In0=',
  'QxZugR8TAhI38AiJ_cptTl3RbzLyca3t-AAiH-Hh:H14IyZXv28iUPjB3rdGQ4hXWMfI=:eyJhcHBJZCI6ImZuZjB2cjZnbiIsImV4cGlyZUF0IjoxNzUzMzM2OTA3LCJwZXJtaXNzaW9uIjoidXNlciIsInJvb21OYW1lIjoid2ViNiIsInVzZXJJZCI6IndlYnVzZXI2In0='
];

const Home = () => {
  const history = useHistory();
  const [roomToken, setRoomToken] = useState<string>();
  const { dispatch, state } = useContext(storeContext);

  /**
   * 打开调试
   */
  const openDebug = () => {
    eruda.init();
    dispatch({
      type: 'updateIsDebug',
      payload: true
    });
  };

  /**
   * 点击随机生成 roomToken
   */
  const generateRoomToken = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * roomTokens.length);
    setRoomToken(roomTokens[randomIndex]);
  }, []);

  /**
   * 点击进入房间
   */
  const joinRoom = useCallback(() => {
    const pushURL = `/room?roomToken=${roomToken}&isDebug=${state.isDebug}`;
    history.push(pushURL);
  }, [history, roomToken, state.isDebug]);

  return <div className={css.container}>
    <h1 onClick={openDebug} className={css.title}>七牛白板 demo 体验</h1>
    <Input
      value={roomToken}
      onChange={e => setRoomToken(e.target.value)}
      placeholder='请输入roomToken'
      style={{ marginBottom: 10 }}
    />
    <Button
      type='primary'
      block
      onClick={joinRoom}
      style={{ marginBottom: 10 }}
    >点击进入房间</Button>
    <Button
      type='primary'
      block
      onClick={generateRoomToken}
    >点击随机生成 roomToken</Button>
    <div style={{ marginTop: 10 }} className={css.version}>demo version: 1.0.4-beta.1</div>
    <div className={css.version}>sdk version: {window.QNWhiteboard.version}</div>
  </div>;
};

export default Home;