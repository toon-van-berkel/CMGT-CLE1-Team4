OLED.init(128, 64);

// Idle screen values
let tempValue = input.temperature(TemperatureUnit.Celsius);
let lightValue = input.lightLevel();
let humValue = 1000;
let lastTemp = tempValue;
let lastLight = lightValue;
let lastHum = humValue;

// Setting/editing screen values
let selectedSetting = 0;
let wateringType = 'auto';
let wateringTime = 10;
let lastSelectedSetting = selectedSetting;
let lastWateringType = wateringType;
let lastWateringTime = wateringTime;
// Editing only
let editingSetting = 9999;

// Conditions
let isIdle = true;
let isUsingSettings = false;
let isEditing = false;
let updateINF = false;
let updateSET = false;
let updateEDI = false;

// Calculations
function readingToLux(reading: number) {
    const k = 1000 / 255;
    return k * reading;
}

// Screens
function loadScreen() {                                     
    // Start CPX
    for (let i = 0; i < 100; i++) {
        OLED.drawLoading(i);
    }

    // Clear loading
    OLED.clear();
}
function loadInfScreen() {
    OLED.clear();
    OLED.writeStringNewLine(`TEMP: ${tempValue}C`);
    OLED.writeStringNewLine(`LIGHT: ${Math.floor(readingToLux(lightValue))} LUX`);
}
// function loadSettingsScreen() {
//     OLED.clear();
//     OLED.writeStringNewLine(`Watering: ${wateringType === 0 ? 'Auto' : 'Manual'} ${selectedSetting === 0 ? ' <' : ''}`);
//     if (wateringType === 0) {
//         OLED.writeStringNewLine(`...`);
//     } else {
//         OLED.writeStringNewLine(`Time: ${wateringTime} Hour`);
//     }
//     OLED.writeStringNewLine(`...`);
//     OLED.writeStringNewLine(`...`);
//     OLED.writeStringNewLine(`...`);
//     OLED.writeStringNewLine(`...`);
//     OLED.writeStringNewLine(``);
//     OLED.writeStringNewLine(`Back`);
// }
// function loadEditingScreen(setting: number) {
//     OLED.clear();
//     OLED.writeStringNewLine(`Editing setting:`);
//     OLED.writeStringNewLine(``);
//     if (setting === 0) {
//         OLED.writeStringNewLine(`Watering: ${wateringType === 0 ? 'Auto' : 'Manual'}`);
//     }
//     OLED.writeStringNewLine(``);
//     OLED.writeStringNewLine(`Use the arrows to change the value.`);
// }


// // Input user
// input.pinA7.onEvent(ButtonEvent.Click, function () { // Left
//     if (isEditing && editingSetting === 0) {
//         if (wateringType === 0) {
//             wateringType = 1;
//         } else {
//             wateringType = 0;
//         }

//         loadEditingScreen(0);
//     }
// })
// input.pinA2.onEvent(ButtonEvent.Click, function () { // Action
//     if (!isUsingSettings) {
//         isUsingSettings = true;
//         loadSettingsScreen();
//     } if (isUsingSettings) {
//         if (selectedSetting === 0) {
//             editingSetting = 0;
//             loadEditingScreen(0);
//         } else if (selectedSetting > 0) {
//             return;
//         }
//     }
// })
// input.pinA3.onEvent(ButtonEvent.Click, function () { // Right
//     if (isEditing && editingSetting === 0) {
//         if (wateringType === 0) {
//             wateringType = 1;
//         } else {
//             wateringType = 0;
//         }
//         loadEditingScreen(0);
//     }
// })

// Check states
function checkIdleState() {
    if (isIdle) {
        if (input.temperature(TemperatureUnit.Celsius) !== lastTemp) {
            lastTemp = input.temperature(TemperatureUnit.Celsius);
            tempValue = input.temperature(TemperatureUnit.Celsius);
            updateINF = true;
        }
        if (input.lightLevel() !== lastLight) {
            lastLight = input.lightLevel();
            lightValue = input.lightLevel();
            updateINF = true;
        }
        if (1000 !== lastHum) {
            lastHum = 1000;
            humValue = 1000;
            updateINF = true;
        }
        if (updateINF) {
            updateINF = false;
            loadInfScreen();
        }
    }
}
function checkSettingsState() {
    if (isUsingSettings) {
        if (wateringType !== lastWateringType) {
            lastWateringType = wateringType;
            updateSET = true;
        }
        if (wateringTime !== lastWateringTime) {
            lastWateringTime = wateringTime;
            updateSET = true;
        }
        if (selectedSetting !== lastSelectedSetting) {
            lastSelectedSetting = selectedSetting;
            updateSET = true;
        }
        if (updateSET) {
            updateSET = false;
            // loadSettingsScreen()
        }
    }
}

// Load Screens
OLED.clear();
loadScreen();
loadInfScreen();

// Input functions
input.buttonB.onEvent(ButtonEvent.Click, function () {
    isUsingSettings = false;
})

// Start loop
loops.forever(function () {
    // Logic for refreshing information when on the idle screen
    checkIdleState();

    // Logic for refreshing settings screen
    checkSettingsState();
})