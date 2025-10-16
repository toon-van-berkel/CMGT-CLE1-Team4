import time
import board
import digitalio

PIN = board.A1
BIT_DELAY = 0.002

wire = digitalio.DigitalInOut(PIN)
wire.direction = digitalio.Direction.OUTPUT
wire.value = False

def send_byte(val: int):
    wire.value = False
    time.sleep(BIT_DELAY)
    for i in range(8):
        wire.value = bool((val >> i) & 1)
        time.sleep(BIT_DELAY)
    wire.value = True
    time.sleep(BIT_DELAY)

def send_string(s: str):
    send_byte(0x7E)
    for b in s.encode("utf-8"):
        send_byte(b)
    send_byte(0x0A)

count = 0
wire.value = True
while True:
    msg = f"Hello from A #{count}"
    send_string(msg)
    count += 1
    time.sleep(1.0)
