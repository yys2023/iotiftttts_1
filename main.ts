let humidity = 0
let temperature = 0
KSRobot_IOT.Wifi_setup(
SerialPin.P15,
SerialPin.P8,
"ASUS_chickenhouse",
"0937675615",
KSRobot_IOT.IOT_Config.STATION
)
I2C_LCD1602.LcdInit(32)
let sending = false
basic.pause(2000)
I2C_LCD1602.ShowString("Temp:", 0, 0)
I2C_LCD1602.ShowString("Humi:", 0, 1)
basic.forever(function () {
    dht11_dht22.queryData(
    DHTtype.DHT11,
    DigitalPin.P1,
    true,
    false,
    true
    )
    temperature = Math.round(dht11_dht22.readData(dataType.temperature))
    humidity = Math.round(dht11_dht22.readData(dataType.humidity))
    I2C_LCD1602.ShowNumber(temperature, 5, 0)
    I2C_LCD1602.ShowNumber(humidity, 5, 1)
})
basic.forever(function () {
    if (KSRobot_IOT.Wifi_Connection()) {
        if (temperature >= 35) {
            if (!(sending)) {
                sending = true
                KSRobot_IOT.IFTTT_set(
                "high_temperature",
                "bSwSN95G-LckAmVAGeWx9i",
                convertToText(temperature),
                convertToText(humidity)
                )
                sending = false
                basic.pause(10000)
            }
        }
    }
})
basic.forever(function () {
    if (KSRobot_IOT.Wifi_Connection()) {
        basic.clearScreen()
        basic.pause(3000)
        if (!(sending)) {
            basic.showIcon(IconNames.Happy)
            sending = true
            KSRobot_IOT.ThingSpeak_set(
            "XRDUW34V4439F80V",
            temperature,
            humidity
            )
            sending = false
            basic.pause(10000)
        }
    }
})
