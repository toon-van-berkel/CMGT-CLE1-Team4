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

// Create screen
function createScreen(line1: string, line2: string, line3: string, line4: string, line5: string, line6: string, line7: string, line8: string) {
    const lines = [line1, line2, line3, line4, line5, line6, line7, line8];
    OLED.clear();
    for (let i = 0; i < lines.length; i++) {
        if (lines[i]) {
            OLED.writeStringNewLine(lines[i]);
        } else {
            OLED.writeStringNewLine(`...`);
        }
    }
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
    createScreen(
        `TEMP: ${tempValue}C`,
        `LIGHT: ${Math.floor(readingToLux(lightValue))} LUX`,
        "",
        "",
        "",
        "",
        "",
        ""
    );
}
function loadSettingsScreen() {
    let line1 = "";
    let line2 = "";

    if (wateringType === 'auto') {
        line1 = 'Watering: Auto';
    } else {
        line1 = 'Watering: Manual';
        line2 = `Time: ${wateringTime} Hour`;
    }

    createScreen(
        `${line1}`,
        `${line2}`,
        "",
        "",
        "",
        "",
        "",
        "Back"
    );
}
function loadEditingScreen() {
    let editingLine = '305';

    if (selectedSetting === 0) {
        editingLine = `Watering: ${wateringType === 'auto' ? 'Auto' : 'Manual'}`;
    } else if (selectedSetting === 1) {
        editingLine = `Time: `
    }

    createScreen(
        "Editing setting:",
        " ",
        `${editingLine}`,
        " ",
        "Use the arrows to ",
        "change the value.",
        "Press action to go ",
        "back to settings."
    );
}

// Function to edit settings
function editSetting(dir: number) {
    if (selectedSetting === 0) {
        if (wateringType === "auto") {
            wateringType = "manual";
            loadEditingScreen();
        } else {
            wateringType = "auto";
            loadEditingScreen();
        }
    } else if (selectedSetting === 1) {
        if (dir = 0) {
            wateringTime--;
            loadEditingScreen();
        } else {
            wateringTime++;
            loadEditingScreen();
        }
    } else {
        selectedSetting = 0;
        isEditing = false;
        loadSettingsScreen();
    }
}

// Left button
input.pinA7.onEvent(ButtonEvent.Click, function () {
    if (isIdle) {
        return
    } else if (isUsingSettings) {
        if (selectedSetting === 0) {
            selectedSetting = 8;
        } else {
            selectedSetting--;
        }
    } else if (isEditing) {
        editSetting(0);
    }
})
// Action button
input.pinA2.onEvent(ButtonEvent.Click, function () {
    if (isIdle) {
        isIdle = false;
        isUsingSettings = true;
        loadSettingsScreen();
    } else if (isUsingSettings) {
        isUsingSettings = false;
        isEditing = true;
        loadEditingScreen();
    } else if (isEditing) {
        isEditing = false;
        isUsingSettings = true;
        loadSettingsScreen();
    }
})
// Right button
input.pinA3.onEvent(ButtonEvent.Click, function () {
    if (isIdle) {
        return
    } else if (isUsingSettings) {
        if (selectedSetting === 8) {
            selectedSetting = 0;
        } else {
            selectedSetting++;
        }
    } else if (isEditing) {
        editSetting(1);
    }
})

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
            loadSettingsScreen();
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
    isIdle = true;
})

// Start loop
loops.forever(function () {
    // Logic for refreshing information when on the idle screen
    checkIdleState();

    // Logic for refreshing settings screen
    checkSettingsState();
})