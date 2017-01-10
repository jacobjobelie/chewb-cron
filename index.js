const redisApi = require('./redis')
const Google = require('@samelie/google-cloudstorage');
const Q = require('bluebird')
const fs = require('fs')
const path = require('path')

const MAX_RECENT = 20
const PATH = 'json'

const CRON = function() {

  function _upload() {
    return Google.upload(path.join(process.cwd(), PATH), 'gs://samrad-chewb', true)
    .then(()=>{
      return true
    })
    .catch((err)=>{
      return err
    })
  }

  function start() {

    return redisApi.hgetAll('chewb:videos')
      .then(allVideos => {

        return Q.map(Object.keys(allVideos),
          (key => {
            return redisApi.hmget(allVideos[key], key)
              .then(data => {
                return data
              })
          }), {
            concurrency: 10
          })
      })
      .then(all => {
        fs.writeFileSync(`${PATH}/chewb-recent.json`, JSON.stringify(all.slice(0, MAX_RECENT)))
        fs.writeFileSync(`${PATH}/chewb-all.json`, JSON.stringify(all))
        return _upload()
      })
  }

  return {
    start: start,
  }
}

const Cron = CRON()

function run(){
  Cron.start().finally()
}

setInterval(()=>{
  run()
}, 10000 * 60)


if(!fs.existsSync(PATH)){
  fs.mkdirSync(PATH)
}

run()
