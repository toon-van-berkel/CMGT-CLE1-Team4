// loops.forever(function () {
//     if (p === 100) {
//         p = 0;
//         OLED.drawLoading(p);
//     } else {
//         p++;
//         OLED.drawLoading(p);
//     }
// })

// OLED.init(128, 64);

// let message = `Dit ${pins.A7.analogRead()}`;
// // let message = "test";
// OLED.writeStringNewLine(message);

// loops.forever(function () {
//     light.setPixelColor(0, Colors.Black);
//     message = `Dit ${Math.floor(pins.A7.analogRead() / 100)}%`;
//     OLED.writeStringNewLine(message);
//     loops.pause(1000);
//     light.setPixelColor(0, Colors.Red);
//     // music.baDing.play()
// })

// light.showAnimation(light.rainbowAnimation, 500);

// // crickit.motor1.run(100);
// crickit.motor1.stop()

// let message = "test";

// loops.forever(function () {
//     light.setPixelColor(0, Colors.Black);
//     message = `TMEP ${input.temperature(TemperatureUnit.Celsius)}`;
//     OLED.writeStringNewLine(message);
//     loops.pause(1000);
//     light.setPixelColor(0, Colors.Red);
// })

// OLED.drawCircle(10, 10, 10);
// OLED.showString1("hello, micro:bit!")
// OLED.showString2("Don't, micro:bit!")

OLED.init(128, 64);
let temp = input.temperature(TemperatureUnit.Celsius);
let hum = Math.floor(pins.A7.analogRead() / 100);

loops.pause(1000);
loadScreen();

function loadScreen() {
    // Start CPX
    for (let i = 0; i < 100; i++) {
        OLED.drawLoading(i);
    }

    // Clear loading
    OLED.clear();
}

function refreshScreen() {
    // Write data
    temp = input.temperature(TemperatureUnit.Celsius);
    hum = Math.floor(pins.A7.analogRead() / 100);

    OLED.writeStringNewLine(`TEMP: ${temp} C'`);
    OLED.writeStringNewLine(`HUMD: ${hum}%`);

    loops.pause(30000);

    // Reload
    loadScreen();
}

input.buttonA.onEvent(ButtonEvent.Click, function () {
    crickit.motor1.run(50)
})

input.buttonB.onEvent(ButtonEvent.Click, function () {
    crickit.motor1.stop()
})

loops.forever(function () {
    refreshScreen();

    if (!pins.A1.analogRead()) {
        light.showAnimation(light.rainbowAnimation, 500)
    }
})