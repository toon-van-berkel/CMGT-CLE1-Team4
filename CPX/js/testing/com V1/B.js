pins.A2.setPull(PinPullMode.PullDown)

let motorRunning = false

pins.A2.onPulsed(PulseValue.High, function () {
    motorRunning = !motorRunning

    if (motorRunning) {
        crickit.motor1(100);
    } else {
        crickit.motor1(0);
    }
})
