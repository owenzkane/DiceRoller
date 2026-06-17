from flask import Flask, jsonify, send_from_directory
import random
from collections import deque

app = Flask(__name__, static_folder="static")

roll_history = deque(maxlen=10)

@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/roll")
def roll():
    die1 = random.randint(1, 6)
    die2 = random.randint(1, 6)
    result = {"die1": die1, "die2": die2, "total": die1 + die2}
    roll_history.appendleft(result)
    return jsonify({"current": result, "history": list(roll_history)})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
