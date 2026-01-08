from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import date
from bson import ObjectId

from db import events_col, daily_col

app = Flask(__name__)
CORS(app)

def get_daily_event():
    today = date.today().isoformat()

    record = daily_col.find_one({"date": today})
    if record:
        return events_col.find_one({"_id": record["event_id"]})
    
    event = events_col.aggregate([{"$sample": {"size": 1}}]).next()
    
    daily_col.insert_one({
        "date": today, 
        "event_id": event["_id"]
    })
    
    return event

@app.route("/daily", methods=["GET"])
def daily():
    event = get_daily_event()

    return jsonify({
        "title": event["title"],
        "difficulty": event.get("difficulty", "medium"),
        "max_guesses": 6
    })

@app.route("/guess", methods=["POST"])
def guess():
    data = request.json
    event = get_daily_event()
    
    answer = event["date"]
    guess = {
        "month": int(data["month"]),
        "day": int(data["day"]),
        "year": int(data["year"])
    }
    
    result = {}
    for field in ["month", "day", "year"]:
        if guess[field] < answer[field]:
            result[field] = "too_low"
        elif guess[field] > answer[field]:
            result[field] = "too_high"
        else:
            result[field] = "correct"

    result["win"] = all(v == "correct" for v in result.values())
    
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)