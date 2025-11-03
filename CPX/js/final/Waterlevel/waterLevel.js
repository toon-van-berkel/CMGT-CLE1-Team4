pins.A2.setPull(PinPullMode.PullUp)
pins.A3.digitalWrite(false)

let touching = false

pins.A2.onEvent(PinEvent.Fall, function () {
    touching = true
})

pins.A2.onEvent(PinEvent.Rise, function () {
    touching = false
    light.clear()
})

forever(function () {
    if (touching) {
        light.showAnimationFrame(light.rainbowAnimation)
    }
    pause(20)
})