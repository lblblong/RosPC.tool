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

    init(ip) {
        this.ip = ip
    }

    connect() {
        this.ros = new ROSLIB.Ros()
        this.bindEvent()
        this.ros.connect(`ws://${this.ip}:9090`)
    }

    bindEvent() {
        this.ros.on('connection', () => {
            console.log(`已连接到 ROS`)
            store.commit('havConnection', true)
            this.conLisener()
            let topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/map'
            })
            topic.subscribe(rep => {
                this.mapLisener(rep)
            })
        })

        this.ros.on('error', err => {})

        this.ros.on('close', () => {
            store.commit('havConnection', false)
            if (this.timer) {
                clearTimeout(this.timer)
                this.timer = null
            }
            this.timer = setTimeout(() => {
                console.log(`与 ROS 的连接已断开，重新连接中...`)
                this.closeLisener()
                this.connect()
            }, 3000)
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
        let speed = 0
        let throttle = 1.0
        let scale = 1.0

        speed = throttle * scale

        switch (action) {
            case 1:
                x = 0.5 * speed
                break
            case 2:
                x = -0.5 * speed
                break
            case 3:
                z = 1 * speed
                break
            case 4:
                z = -1 * speed
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
