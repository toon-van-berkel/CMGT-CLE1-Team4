import time
import board
import digitalio

PIN = board.A1
BIT_DELAY = 0.002
IDLE_LEVEL = True

wire = digitalio.DigitalInOut(PIN)
wire.direction = digitalio.Direction.INPUT
wire.pull = digitalio.Pull.DOWN

def read_bit(delay=BIT_DELAY):
    time.sleep(delay)
    return wire.value

def read_byte():
    while wire.value == IDLE_LEVEL:
        pass
    
    time.sleep(BIT_DELAY * 1.5)
    val = 0
    for i in range(8):
        if wire.value:
            val |= (1 << i)
        time.sleep(BIT_DELAY)

    time.sleep(BIT_DELAY)
    return val

def read_message():
    
    b = read_byte()
    while b != 0x7E:
        b = read_byte()
        
    buf = bytearray()
    while True:
        b = read_byte()
        if b == 0x0A:
            break
        buf.append(b)
    try:
        return buf.decode("utf-8", errors="ignore")
    except Exception:
        return None

while True:
    msg = read_message()
    if msg is not None:
        print("RX:", msg)
