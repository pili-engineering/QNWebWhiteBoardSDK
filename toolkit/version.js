const SDKPackageJSON = require('../../qnweb-whiteboard/package.json');
const fs = require('fs');
const path = require('path');
const packageJSON = require('../package.json');

/**
 * 重写 package.json 版本
 * @param version
 */
function rewritePackageJSON(version) {
  fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify({
    ...packageJSON,
    version
  }, null, 2));
}

rewritePackageJSON(SDKPackageJSON.version);