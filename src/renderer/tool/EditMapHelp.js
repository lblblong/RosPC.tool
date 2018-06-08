class EditMapHelp {
    constructor() {
        // 行为记录
        this.draws = []

        // 绘制类型
        this.DRAW_LINE = '直线'
        this.DRAW_BRUSH = '画笔'
        this.DRAW_DRAG = '拖拽'
        this.DRAW_RECT = '矩形'
        this.DRAW_ERASER = '橡皮擦'
    }

    /**
     * 设置Element
     * @param {HTMLElement} wp 父元素
     * @param {HTMLCanvasElement} canvas
     * @param {HTMLElement} root
     */
    setElement(canvas, wp, root) {
        this.draws = []
        // 最外层 Element （获取宽高）
        this.root = root
        // canvas 父元素 （移动与监听鼠标事件）
        this.wp = wp
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        wp.style.left = root.offsetWidth / 2 - canvas.width / 2 + 'px'
        wp.style.top = root.offsetHeight / 2 - canvas.height / 2 + 'px'
        // 将地图先绘制上去
        this.ctx.putImageData(window.map.data, 0, 0)
    }

    clear() {
        this.draws = []
    }

    /**
     * 拖拽
     */
    drag() {
        this.wp.onmousedown = e => {
            let sx = e.clientX - this.wp.offsetLeft
            let sy = e.clientY - this.wp.offsetTop
            document.onmousemove = e => {
                this.wp.style.left = e.clientX - sx + 'px'
                this.wp.style.top = e.clientY - sy + 'px'
                this.wp.center = {
                    x: this.wp.offsetLeft + this.wp.offsetWidth / 2,
                    y: this.wp.offsetTop + this.wp.offsetHeight / 2
                }
            }
            document.onmouseup = function() {
                document.onmousemove = null
                document.onmouseup = null
            }
        }
    }

    /**
     * 画直线
     */
    drawLine() {
        let that = this
        let wp = this.wp
        let draws = this.draws
        let throttle = true
        wp.onmousedown = function(e) {
            let n = that.draws.length
            draws[n] = new Object()
            draws[n].type = that.DRAW_LINE
            draws[n].sx = e.offsetX
            draws[n].sy = e.offsetY

            wp.onmousemove = function(e) {
                if (throttle) {
                    draws[n].ex = e.offsetX
                    draws[n].ey = e.offsetY
                    throttle = false
                    setTimeout(() => {
                        throttle = true
                    }, 35)
                    that.render()
                }
            }

            wp.onmouseup = function() {
                wp.onmousemove = null
                wp.onmouseup = null
            }
        }
    }

    /**
     * 画笔
     */
    drawBrush() {
        let that = this
        let wp = this.wp
        let draws = this.draws
        let throttle = true
        wp.onmousedown = function(e) {
            let n = that.draws.length
            draws[n] = new Object()
            draws[n].type = that.DRAW_BRUSH
            draws[n].points = []

            wp.onmousemove = function(e) {
                if (throttle) {
                    let pointLen = draws[n].points.length
                    draws[n].points[pointLen] = {
                        sx: e.offsetX,
                        sy: e.offsetY
                    }
                    // 从第二个点开始保存 ex 与 ey，掉帧处理
                    if (pointLen > 0) {
                        draws[n].points[pointLen - 1].ex = e.offsetX
                        draws[n].points[pointLen - 1].ey = e.offsetY
                    }
                    throttle = false
                    setTimeout(() => {
                        throttle = true
                    }, 35)
                    // 实时渲染
                    that.render()
                }
            }

            wp.onmouseup = function() {
                wp.onmousemove = null
                wp.onmouseup = null
            }
        }
    }

    /**
     * 橡皮擦
     */
    drawEraser() {
        let that = this
        let wp = this.wp
        let draws = this.draws
        let throttle = true
        wp.onmousedown = function(e) {
            let n = that.draws.length
            draws[n] = new Object()
            draws[n].type = that.DRAW_ERASER
            draws[n].points = []

            wp.onmousemove = function(e) {
                if (throttle) {
                    let pointLen = draws[n].points.length
                    draws[n].points[pointLen] = {
                        sx: e.offsetX,
                        sy: e.offsetY
                    }
                    // 从第二个点开始保存 ex 与 ey，掉帧处理
                    if (pointLen > 0) {
                        draws[n].points[pointLen - 1].ex = e.offsetX
                        draws[n].points[pointLen - 1].ey = e.offsetY
                    }
                    throttle = false
                    setTimeout(() => {
                        throttle = true
                    }, 35)
                    // 实时渲染
                    that.render()
                }
            }

            wp.onmouseup = function() {
                wp.onmousemove = null
                wp.onmouseup = null
            }
        }
    }

    /**
     * 画矩形
     */
    drawRect() {
        let that = this
        let wp = this.wp
        let draws = this.draws
        let throttle = true
        wp.onmousedown = function(e) {
            let n = that.draws.length
            draws[n] = new Object()
            draws[n].type = that.DRAW_RECT
            draws[n].sx = e.offsetX
            draws[n].sy = e.offsetY

            wp.onmousemove = function(e) {
                if (throttle) {
                    draws[n].ex = e.offsetX
                    draws[n].ey = e.offsetY
                    throttle = false
                    setTimeout(() => {
                        throttle = true
                    }, 35)
                    that.render()
                }
            }

            wp.onmouseup = function() {
                wp.onmousemove = null
                wp.onmouseup = null
            }
        }
    }

    /**
     * 撤回上一个操作
     */
    back() {
        this.draws.pop()
        this.render()
    }

    /**
     * 渲染
     */
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, 500, 500)
        // 绘制地图
        this.ctx.putImageData(window.map.data, 0, 0)
        // 绘制所有操作
        this.draws.forEach(d => {
            switch (d.type) {
                case this.DRAW_LINE:
                    this.ctx.strokeStyle = '#000'
                    this.ctx.beginPath()
                    this.ctx.moveTo(d.sx, d.sy)
                    this.ctx.lineTo(d.ex, d.ey)
                    this.ctx.closePath()
                    this.ctx.stroke()
                    break
                case this.DRAW_BRUSH:
                    this.ctx.strokeStyle = '#000'
                    let brush = d.points
                    // 解决画笔移动太快掉帧
                    brush.forEach(point => {
                        this.ctx.beginPath()
                        this.ctx.moveTo(point.sx, point.sy)
                        this.ctx.lineTo(point.ex, point.ey)
                        this.ctx.closePath()
                        this.ctx.stroke()
                    })
                    break
                case this.DRAW_ERASER:
                    let erasers = d.points
                    this.ctx.strokeStyle = '#fff'
                    // 橡皮擦移动太快掉帧
                    erasers.forEach(point => {
                        let lineW = this.ctx.lineWidth
                        this.ctx.lineWidth = 10
                        this.ctx.beginPath()
                        this.ctx.moveTo(point.sx, point.sy)
                        this.ctx.lineTo(point.ex, point.ey)
                        this.ctx.closePath()
                        this.ctx.stroke()
                        this.ctx.lineWidth = lineW
                    })
                    break
                case this.DRAW_RECT:
                    this.ctx.strokeStyle = '#000'
                    this.ctx.strokeRect(d.sx, d.sy, d.ex - d.sx, d.ey - d.sy)
                    break
            }
        })
    }
}

export default new EditMapHelp()
