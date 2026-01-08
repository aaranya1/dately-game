from db import events_col

events_col.delete_many({})

events = [
    {
        "title": "Moon Landing",
        "date": {"month": 7, "day": 20, "year": 1969},
        "difficulty": "easy",
        "hints": ["First manned moon landing", "Apollo 11 mission"],
    },
    {
        "title": "Fall of the Berlin Wall",
        "date": {"month": 11, "day": 9, "year": 1989},
        "difficulty": "easy",
        "hints": ["Symbol of the Cold War", "Divided East and West Germany"],
    },
    {
        "title": "Signing of the Declaration of Independence",
        "date": {"month": 7, "day": 4, "year": 1776},
        "difficulty": "medium",
        "hints": ["United States independence", "Philadelphia"],
    },
    {
        "title": "French Revolution Begins",
        "date": {"month": 7, "day": 14, "year": 1789},
        "difficulty": "medium",
        "hints": ["Storming of the Bastille", "End of monarchy in France"],
    },
    {
        "title": "Invention of the Printing Press",
        "date": {"month": 1, "day": 1, "year": 1440},
        "difficulty": "hard",
        "hints": ["Johannes Gutenberg", "Revolutionized information dissemination"],
    },
]

events_col.insert_many(events)
print("Database seeded with historical events.")