const PREFIX = 'QNWhiteboard info';

/**
 * 自定义 console.info
 * @param key
 * @param data
 * @constructor
 */
export function QNWhiteboardLog(key: string, ...data: any[]): void {
  console.info(`${PREFIX} ${key}`, ...data);
}