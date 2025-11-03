input.pinA4.onEvent(ButtonEvent.Click, function () {
    crickit.motor2.run(100);
})

input.pinA2.onEvent(ButtonEvent.Click, function () {
    light.showAnimation(light.rainbowAnimation, 500)
})

input.pinA3.onEvent(ButtonEvent.Click, function () {
    crickit.motor2.stop();
})