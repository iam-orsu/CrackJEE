import os
import sys
import json
from collections import Counter

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

EXPECTED_TOPICS = [
    "Units and Dimensions",
    "Kinematics",
    "Laws of Motion",
    "Friction",
    "Work Energy and Power",
    "Rotational Motion",
    "System of Particles",
    "Gravitation",
    "Elasticity",
    "Fluid Mechanics",
    "Thermal Properties of Matter",
    "Thermodynamics",
    "Kinetic Theory of Gases",
    "Simple Harmonic Motion",
    "Waves",
    "Electrostatics",
    "Electric Potential and Capacitance",
    "Current Electricity",
    "Moving Charges and Magnetism",
    "Magnetism and Matter",
    "Electromagnetic Induction",
    "Alternating Current",
    "Electromagnetic Waves",
    "Ray Optics",
    "Wave Optics",
    "Dual Nature of Radiation",
    "Atoms and Nuclei",
    "Semiconductor Devices",
    "Communication Systems"
]

def main():
    all_questions = []

    modules = [
        ("group1_mechanics1", "group1_mechanics1.py"),
        ("group2_mechanics2", "group2_mechanics2.py"),
        ("group3_fluids_thermal", "group3_fluids_thermal.py"),
        ("group4_thermo_waves", "group4_thermo_waves.py"),
        ("group5_electromag1", "group5_electromag1.py"),
        ("group6_electromag2", "group6_electromag2.py"),
        ("group7_optics", "group7_optics.py"),
        ("group8_modern_physics", "group8_modern_physics.py"),
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
        print("All 29 Physics topics have at least 20 questions!")

    for t in EXPECTED_TOPICS:
        t_qs = [q for q in all_questions if q['topic'] == t]
        if len(t_qs) > 0:
            d_counts = Counter(q['difficulty'] for q in t_qs)
            if d_counts.get('beginner', 0) != 4 or d_counts.get('intermediate', 0) != 8 or d_counts.get('advanced', 0) != 8:
                print(f"Warning: Topic '{t}' has non-standard distribution: {dict(d_counts)} (expected 4 beg, 8 inter, 8 adv)")

    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../data/jee"))
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "matrix_physics_questions.json")
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(all_questions)} questions to: {out_file}")

if __name__ == '__main__':
    main()
