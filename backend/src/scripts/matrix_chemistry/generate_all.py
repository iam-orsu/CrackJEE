import os
import sys
import json
from collections import Counter

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

EXPECTED_TOPICS = [
    "Mole Concept and Stoichiometry",
    "Atomic Structure",
    "States of Matter",
    "Solid State",
    "Chemical Thermodynamics",
    "Chemical Equilibrium",
    "Ionic Equilibrium",
    "Redox Reactions",
    "Solutions",
    "Electrochemistry",
    "Chemical Kinetics",
    "Surface Chemistry",
    "Periodic Table and Periodicity",
    "Chemical Bonding",
    "Hydrogen",
    "s-Block Elements",
    "p-Block Elements Group 13 and 14",
    "p-Block Elements Group 15 to 18",
    "Transition Metals and d-Block",
    "Coordination Compounds",
    "General Principles of Metallurgy",
    "Environmental Chemistry",
    "Polymers",
    "Organic Chemistry Basics",
    "Hydrocarbons",
    "Haloalkanes and Haloarenes",
    "Alcohols Phenols and Ethers",
    "Aldehydes and Ketones",
    "Carboxylic Acids and Derivatives",
    "Amines",
    "Biomolecules"
]

def main():
    all_questions = []

    modules = [
        ("group1_physical1", "group1_physical1.py"),
        ("group2_physical2", "group2_physical2.py"),
        ("group3_physical3", "group3_physical3.py"),
        ("group4_inorganic1", "group4_inorganic1.py"),
        ("group5_inorganic2", "group5_inorganic2.py"),
        ("group6_inorganic_applied", "group6_inorganic_applied.py"),
        ("group7_organic1", "group7_organic1.py"),
        ("group8_organic2", "group8_organic2.py"),
    ]

    for mod_name, file_name in modules:
        try:
            mod = __import__(mod_name)
            qs = mod.get_questions()
            print(f"[OK] {file_name}: loaded {len(qs)} questions")
            all_questions.extend(qs)
        except Exception as e:
            print(f"[WAIT/ERR] {file_name} not ready or failed: {e}")

    print(f"\nTotal questions collected so far: {len(all_questions)}")
    
    topic_counts = Counter(q['topic'] for q in all_questions)
    missing_topics = [t for t in EXPECTED_TOPICS if topic_counts.get(t, 0) < 20]
    if missing_topics:
        print(f"Missing or incomplete topics ({len(missing_topics)}): {missing_topics}")
    else:
        print("All 31 Chemistry topics have at least 20 questions!")

    for t in EXPECTED_TOPICS:
        t_qs = [q for q in all_questions if q['topic'] == t]
        if len(t_qs) > 0:
            d_counts = Counter(q['difficulty'] for q in t_qs)
            if d_counts.get('beginner', 0) != 4 or d_counts.get('intermediate', 0) != 8 or d_counts.get('advanced', 0) != 8:
                print(f"Warning: Topic '{t}' has non-standard distribution: {dict(d_counts)} (expected 4 beg, 8 inter, 8 adv)")

    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../data/jee"))
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "matrix_chemistry_questions.json")
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(all_questions)} questions to: {out_file}")

if __name__ == '__main__':
    main()
