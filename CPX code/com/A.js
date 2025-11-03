pins.A1.setPull(PinPullMode.PullUp)

pins.A6.digitalWrite(false)

input.pinA1.onEvent(ButtonEvent.Click, function () {
    light.setAll(Colors.Yellow)
    loops.pause(100)
    light.setAll(Colors.Black)

    pins.A6.digitalWrite(true)
    loops.pause(50)
    pins.A6.digitalWrite(false)
})
