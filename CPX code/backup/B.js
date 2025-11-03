// pins.A2.setPull(PinPullMode.PullDown)

// let motorRunning = false

// // Detect a rising pulse (LOW → HIGH)
// pins.A2.onPulsed(PulseValue.High, function () {
//     motorRunning = !motorRunning

//     if (motorRunning) {
//         crickit.motor1(100);
//     } else {
//         crickit.motor1(0);
//     }
// })

OLED.init(64, 128)
OLED.clear()
OLED.writeString("System Ready")

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

input.buttonA.onEvent(ButtonEvent.Click, function () {
    sendCount(1)
})