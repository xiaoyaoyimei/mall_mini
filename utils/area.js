var request = require('/https.js')
function getAreaInfo(callBack) {
//  debugger

  let promise = new Promise((resolve, reject) => {

    request.req('common', 'common/address', 'POST', {}, (err, res) => {
      resolve(res.data);
      });
  })
  promise.then(function (value) { callBack(value) });
  // var str = [];
  // request.req('common', 'common/address', 'POST', {}, (err, res) => {
  //     str = res.data;
  //     console.log(str)
  //     callBack(str)
  //     });
}

module.exports.getAreaInfo = getAreaInfo;