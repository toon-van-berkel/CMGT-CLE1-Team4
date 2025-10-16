import time
import digitalio, board

# --- SETTINGS ---
PIN = board.A1
BIT_DELAY = 0.002

# --- LOW-LEVEL SETUP ---
wire = digitalio.DigitalInOut(PIN)
wire.direction = digitalio.Direction.OUTPUT

# --- SENDER ---
def send_byte(value: int):
    """Send one byte (8 bits)"""
    for i in range(8):
        bit = (value >> i) & 1
        wire.value = bit
        time.sleep(BIT_DELAY)
    wire.value = 0

def send_string(message: str):
    """Send a string as bytes with start marker"""
    # Send start marker
    send_byte(0x7E)
    for ch in message.encode():
        send_byte(ch)
    send_byte(0x0A)


# NC of NO
# L of H value
# Geen string, Num
# Codes en die hangen aan functies
# Langere delay voor acuraat te zijn