input.pinA1.onEvent(ButtonEvent.Click, function () {
    light.setAll(Colors.Yellow);
    loops.pause(100);
    light.setAll(Colors.Black);
})

input.pinA2.onEvent(ButtonEvent.Click, function () {
    light.setAll(Colors.Green);
    loops.pause(100);
    light.setAll(Colors.Black);
})

input.pinA3.onEvent(ButtonEvent.Click, function () {
    light.setAll(Colors.Blue);
    loops.pause(100);
    light.setAll(Colors.Black);
})

loops.forever(function () {
    light.setAll(Colors.Green);
    loops.pause(500);
    light.setAll(Colors.Black);
    loops.pause(500);
}) 