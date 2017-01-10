const redis = require('@samelie/chewb-redis');
/*redis client*/
const REDIS = (() => {

  let host = process.env.REDIS_HOST || '127.0.0.1'
  let port = process.env.REDIS_PORT || '6379'

  let isLocal = host === '127.0.0.1'

  console.log(`Loaded chewb-redis on ${host} ${port}. \nisLocal: ${isLocal}`);

  return new redis({
    host:host,
    port:port
  }, isLocal)

})()

module.exports = REDIS