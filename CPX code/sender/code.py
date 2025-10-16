import time
from components.comSend import send_string

while True:
    send_string("Hello Board B")
    time.sleep(2)
