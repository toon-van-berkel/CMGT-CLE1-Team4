// let moisture = 0

// pins.A1.setPull(PinPullMode.PullUp)
// pins.A6.digitalWrite(false)

// function moistureChecking() {
//     moisture = pins.A4.analogRead()
//     console.logValue("Moisture", moisture)
//     if (moisture > 100) {
//         light.setPixelColor(0, Colors.Red)
//     } else if (moisture < 100) {
//         light.setPixelColor(0, Colors.Blue)
//     }
// }

// input.pinA1.onEvent(ButtonEvent.Click, function () {
//     light.setAll(0xFFFF00)
//     loops.pause(100)
//     light.setAll(0x000000)
//     pins.A6.digitalWrite(true)
//     loops.pause(50)
//     pins.A6.digitalWrite(false)
// })

// loops.forever(function () {
//     moistureChecking();

//     for (let i = 1; i <= 8; i++) {
//         light.setPixelColor(i, Colors.Purple);
//     }
//     pause(1000);
//     for (let i = 1; i <= 8; i++) {
//         light.setPixelColor(i, Colors.Blue);
//     }
// })

const FRAME_TIMEOUT_MS = 300

let counting = false
let lastPulseAt = 0
let count = 0

pins.A6.setPull(PinPullMode.PullDown)
pins.A6.onPulsed(PulseValue.High, function () {
    const now = control.millis()

    if (!counting) {
        counting = true
        count = 0
    }
    count += 1
    lastPulseAt = now
})

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
        music.baDing.play()
        loops.pause(100)
        music.baDing.stop()
    }
}

let running = false

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

// Buttons map to different counts (choose what you need)
pins.A1.setPull(PinPullMode.PullUp)
pins.A2.setPull(PinPullMode.PullUp)
pins.A3.setPull(PinPullMode.PullUp)

input.pinA1.onEvent(ButtonEvent.Click, function () {
    // e.g., 1 pulse = toggle
    sendCount(1)
})

input.pinA2.onEvent(ButtonEvent.Click, function () {
    // e.g., 2 pulses = set speed 25
    sendCount(2)
})

input.pinA3.onEvent(ButtonEvent.Click, function () {
    // e.g., 3 pulses = set speed 0 (stop)
    sendCount(3)
})