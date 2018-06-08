let ROSLIB = require('roslib')
let store = require('../store').default

class Ros {
    addMapLisener(lisener) {
        this.mapLisener = lisener
    }

    addConnectiontLisener(lisener) {
        this.conLisener = lisener
    }

    addCloseLisener(lisener) {
        this.closeLisener = lisener
    }

    addPoseLisener(lisener) {
        this.poseLisener = lisener
    }

    init(ip) {
        this.ip = ip
    }

    connect() {
        this.ros = new ROSLIB.Ros()
        this.bindEvent()
        this.ros.connect(`ws://${this.ip}:9090`)
    }

    close() {
        store.commit('havConnection', false)
        if (this.ros) {
            this.ros.removeAllListeners()
            this.ros.close()
        }
    }

    bindEvent() {
        this.ros.on('connection', () => {
            console.log(`已连接到 ROS`)
            store.commit('havConnection', true)
            this.conLisener()
            this.initSubscribe()
        })

        this.ros.on('error', err => {})

        this.ros.on('close', () => {
            if (this.closeTimer) {
                clearTimeout(this.closeTimer)
                this.closeTimer = null
            }
            this.closeTimer = setTimeout(() => {
                store.commit('havConnection', false)
                console.log(`与 ROS 的连接已断开，重新连接中...`)
                this.closeLisener()
                this.connect()
            }, 3000)
        })
    }

    initSubscribe() {
        // 订阅地图更新
        let mapTopic = new ROSLIB.Topic({
            ros: this.ros,
            name: '/map'
        })
        mapTopic.subscribe(rep => {
            this.mapLisener(rep)
            console.log(rep)
        })

        // 订阅地图元数据更新
        let mapInfoTopic = new ROSLIB.Topic({
            ros: this.ros,
            name: '/map_metadata'
        })
        
        mapInfoTopic.subscribe(rep => {
            this.mapInfo = {
                resolution: rep.resolution,
                x: rep.origin.position.x,
                y: rep.origin.position.y
            }
        })

        // 订阅位置数据更新
        let poseTopic = new ROSLIB.Topic({
            ros: this.ros,
            name: '/robot_pose'
        })
        poseTopic.subscribe(rep => {
            this.poseLisener(rep)
        })

        // 订阅电池电量数据更新
        let batteryTopic = new ROSLIB.Topic({
            ros: this.ros,
            name: '/battery'
        })
        batteryTopic.subscribe(rep => {
            rep = rep.data
            let batteryRatio = rep[2] / rep[1] * 100
            batteryRatio = parseInt(batteryRatio)
            store.commit('batteryRatio', batteryRatio)
        })
    }

    move(action) {
        let cmdVel = new ROSLIB.Topic({
            ros: this.ros,
            name: '/cmd_vel_mux/input/switch',
            messageType: 'geometry_msgs/Twist'
        })
        let x = 0
        let y = 0
        let z = 0
        let speed = parseInt(window.localStorage.speed) * 0.1

        switch (action) {
            case 1:
                x = 0.2 * speed
                break
            case 2:
                x = -0.2 * speed
                break
            case 3:
                z = 0.5 * speed
                break
            case 4:
                z = -0.5 * speed
                break
        }

        let twist = new ROSLIB.Message({
            angular: {
                x: 0,
                y: 0,
                z: z
            },
            linear: {
                x: x,
                y: y,
                z: z
            }
        })

        cmdVel.publish(twist)
    }
}

export default new Ros()
