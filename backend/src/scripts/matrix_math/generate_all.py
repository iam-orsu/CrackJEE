import os
import sys
import json
from collections import Counter

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

EXPECTED_TOPICS = [
    "Sets",
    "Relations and Functions",
    "Relations and Functions (Advanced)",
    "Trigonometric Functions",
    "Inverse Trigonometric Functions",
    "Principle of Mathematical Induction",
    "Complex Numbers",
    "Quadratic Equations",
    "Linear Inequalities",
    "Permutations and Combinations",
    "Binomial Theorem",
    "Sequences and Series",
    "Matrices",
    "Determinants",
    "Straight Lines",
    "Circles",
    "Conic Sections",
    "Introduction to 3D Geometry",
    "Three Dimensional Geometry",
    "Vectors",
    "Limits and Derivatives",
    "Continuity and Differentiability",
    "Applications of Derivatives",
    "Indefinite Integration",
    "Definite Integration",
    "Applications of Integrals",
    "Differential Equations",
    "Statistics",
    "Probability",
    "Probability (Bayes and Random Variables)",
    "Linear Programming"
]

def main():
    all_questions = []

    modules = [
        ("group1_sets_relations", "group1_sets_relations.py"),
        ("group2_trig", "group2_trig.py"),
        ("group3_algebra1", "group3_algebra1.py"),
        ("group4_algebra2", "group4_algebra2.py"),
        ("group5_matrices", "group5_matrices.py"),
        ("group6_2d_geom", "group6_2d_geom.py"),
        ("group6_3d_vectors", "group6_3d_vectors.py"),
        ("group7_calc_diff", "group7_calc_diff.py"),
        ("group8_calc_int", "group8_calc_int.py"),
        ("group9_stats_prob", "group9_stats_prob.py"),
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
        print("All 31 topics have at least 20 questions!")

    # Check difficulty breakdown per topic
    for t in EXPECTED_TOPICS:
        t_qs = [q for q in all_questions if q['topic'] == t]
        if len(t_qs) > 0:
            d_counts = Counter(q['difficulty'] for q in t_qs)
            if d_counts.get('beginner', 0) != 4 or d_counts.get('intermediate', 0) != 8 or d_counts.get('advanced', 0) != 8:
                print(f"Warning: Topic '{t}' has non-standard distribution: {dict(d_counts)} (expected 4 beg, 8 inter, 8 adv)")

    # Save to data/jee/matrix_math_questions.json if complete
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../data/jee"))
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "matrix_math_questions.json")
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(all_questions)} questions to: {out_file}")

if __name__ == '__main__':
    main()
