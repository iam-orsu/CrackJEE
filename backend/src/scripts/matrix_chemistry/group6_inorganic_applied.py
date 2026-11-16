"""
Group 6: Inorganic Applied Chemistry
Topics covered:
1. "General Principles of Metallurgy" (20 questions: chem_app_001 to chem_app_020)
2. "Environmental Chemistry" (20 questions: chem_app_021 to chem_app_040)
3. "Polymers" (20 questions: chem_app_041 to chem_app_060)

Total: 60 Matrix Match questions (12 beginner, 24 intermediate, 24 advanced)
Answer distribution: exactly 15 A, 15 B, 15 C, 15 D (5 of each per topic)
"""

import os
import sys

# Ensure current directory is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from builder import make_matrix_q
from part_met import get_metallurgy_questions
from part_env import get_environmental_questions
from part_poly import get_polymers_questions

def get_questions():
    questions = []
    questions.extend(get_metallurgy_questions())
    questions.extend(get_environmental_questions())
    questions.extend(get_polymers_questions())
    return questions

if __name__ == '__main__':
    qs = get_questions()
    print(f"Total questions in Group 6: {len(qs)}")
