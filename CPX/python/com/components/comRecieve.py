import time
import digitalio, board

PIN = board.A1
BIT_DELAY = 0.002
TOLERANCE = 0.0005

wire = digitalio.DigitalInOut(PIN)
wire.direction = digitalio.Direction.INPUT
wire.pull = digitalio.Pull.DOWN

def read_byte():
    """Read one byte (8 bits)"""
    value = 0
    for i in range(8):
        time.sleep(BIT_DELAY)
        if wire.value:
            value |= (1 << i)
    return value

def listen():
    """Listen for incoming messages"""
    while True:
        if wire.value:
            byte = read_byte()
            if byte == 0x7E:
                message = []
                while True:
                    b = read_byte()
                    if b == 0x0A:
                        break
                    message.append(b)
                text = bytes(message).decode(errors="ignore")
                print("Received:", text)
        time.sleep(0.001)
