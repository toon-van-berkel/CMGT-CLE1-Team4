OLED.init(128, 64);

// Idle screen values
let tempValue = input.temperature(TemperatureUnit.Celsius);
let lightValue = input.lightLevel();
let humValue = 1000;
let waterLevel = true;
let lastTemp = tempValue;
let lastLight = lightValue;
let lastHum = humValue;
let lastWaterLevel = waterLevel;

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
    let transWater = '';

    if (waterLevel) {
        transWater = 'Goed';
    } else {
        transWater = 'Bijvullen';
    }

    createScreen(
        `TEMP: ${tempValue}C`,
        `LIGHT: ${Math.floor(readingToLux(lightValue))} LUX`,
        `HUM: ${humValue / 100}`,
        `Waterlevel: ${transWater}`,
        "",
        "",
        "",
        ""
    );
}
function loadSettingsScreen() {
    let lines = {
        One: "",
        Two: "",
        Three: "",
        Four: "",
        Five: "",
        Six: "",
        Seven: "",
        Eight: "",
    };
    let line1 = "";
    let line2 = "...";

    if (wateringType === 'auto') {
        line1 = 'Watering: Auto';
    } else {
        line1 = 'Watering: Manual';
        line2 = `Time: ${wateringTime} Hour`;
    }

    if (selectedSetting === 0) {
        lines.One = '<';
    } else if (selectedSetting === 1) {
        lines.Two = '<';
    } else if (selectedSetting === 2) {
        lines.Three = '<';
    } else if (selectedSetting === 3) {
        lines.Four = '<';
    } else if (selectedSetting === 4) {
        lines.Five = '<';
    } else if (selectedSetting === 5) {
        lines.Six = '<';
    } else if (selectedSetting === 6) {
        lines.Seven = '<';
    } else {
        lines.Eight = '<';
    }

    createScreen(
        `${line1} ${lines.One}`,
        `${line2} ${lines.Two}`,
        `... ${lines.Three}`,
        `... ${lines.Four}`,
        `... ${lines.Five}`,
        `... ${lines.Six}`,
        `... ${lines.Seven}`,
        `Back ${lines.Eight}`
    );
}
function loadEditingScreen() {
    let editingLine = '305';

    if (selectedSetting === 0) {
        editingLine = `Watering: ${wateringType === 'auto' ? 'Auto' : 'Manual'}`;

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
    } else if (selectedSetting === 1) {
        if (wateringType === 'manual') {
            editingLine = `Time: ${wateringTime} Hour`

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
        } else {
            isEditing = false;
            isUsingSettings = true;
            loadSettingsScreen();
        }
    } else {
        isEditing = false;
        isUsingSettings = true;
        loadSettingsScreen();
    }
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
        isEditing = false;
        isUsingSettings = true;
        loadSettingsScreen();
    }
}

// Left button
input.pinA3.onEvent(ButtonEvent.Click, function () {
    if (isIdle) {
        return
    } else if (isUsingSettings) {
        if (selectedSetting == 0) {
            selectedSetting = 7;
            loadSettingsScreen();
        } else {
            selectedSetting--;
            loadSettingsScreen();
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
        if (selectedSetting === 7) {
            isUsingSettings = false;
            isIdle = true;
            loadInfScreen();
            selectedSetting = 0;
        } else {
            isUsingSettings = false;
            isEditing = true;
            loadEditingScreen();
        }
    } else if (isEditing) {
        isEditing = false;
        isUsingSettings = true;
        loadSettingsScreen();
    }
})
// Right button
input.pinA1.onEvent(ButtonEvent.Click, function () {
    if (isIdle) {
        return
    } else if (isUsingSettings) {
        if (selectedSetting == 7) {
            selectedSetting = 0;
            loadSettingsScreen();
        } else {
            selectedSetting++;
            loadSettingsScreen();
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

// Start loop
loops.forever(function () {
    // Logic for refreshing information when on the idle screen
    checkIdleState();

    // Logic for refreshing settings screen
    checkSettingsState();
})