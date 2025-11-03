// A
const PULSE_MS = 30
const GAP_MS = 70

function pulseOnce() {
    pins.A7.digitalWrite(true)
    loops.pause(PULSE_MS)
    pins.A7.digitalWrite(false)
    loops.pause(GAP_MS)
}

function sendCount(n: number) {
    for (let i = 0; i < n; i++) pulseOnce()
}

input.pinA1.onEvent(ButtonEvent.Click, function () {
    sendCount(1)
})

input.pinA2.onEvent(ButtonEvent.Click, function () {
    sendCount(2)
})

input.pinA3.onEvent(ButtonEvent.Click, function () {
    sendCount(3)
})

// B
let counting = false;
let running = false;
let count = 0;
let lastPulseAt = 0;
const FRAME_TIMEOUT_MS = 300;

loops.forever(function () {
    if (counting) {
        const now = control.millis()
        if (now - lastPulseAt > FRAME_TIMEOUT_MS) {
            handleCommand(count)
            counting = false
            count = 0
        }
    }
    loops.pause(10)
})

function handleCommand(n: number) {
    if (n == 1) {
        running = !running
        running ? crickit.motor2.run(25) : crickit.motor2.stop()
        light.setAll(running ? Colors.Green : Colors.Black)
    } else if (n == 2) {
        crickit.motor2.run(25)
        light.setAll(Colors.Blue)
    } else if (n == 3) {
        crickit.motor2.stop()
        light.setAll(Colors.Red)
    } else {
        light.setAll(Colors.Purple)
    }
}