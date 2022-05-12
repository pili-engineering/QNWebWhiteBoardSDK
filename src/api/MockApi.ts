class MockApi {
  token: string;
  appId: string;
  meetingId: string;
  userId: string;
  bucketId: string;

  constructor() {
    // 加入房间参数， 服务端获取
    this.token = 'ffb8033e73943544a141d04e2618c740';
    this.appId = 'fd3c029d48a64afeb5b46c24aedc2995';
    this.meetingId = '93edb58df18f47c5b0b9796e214c6b53';
    this.userId = 'qiniu-test';
    // 加入白板参数， 服务端获取
    this.bucketId = '0e46218e-8b9b-4f69-9069-dad89048b901';
  }
}

export const MockResult = new MockApi();
