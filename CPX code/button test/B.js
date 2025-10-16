loops.forever(function () {
    light.setAll(Colors.Red);
    loops.pause(500);
    light.setAll(Colors.Black);
    loops.pause(500);
}) 