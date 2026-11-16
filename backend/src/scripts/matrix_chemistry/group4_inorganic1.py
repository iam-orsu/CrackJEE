"""
Group 4 Inorganic Chemistry Matrix Match Questions (80 questions)
Topics:
1. Periodic Table and Periodicity (20 questions: 4 beginner, 8 intermediate, 8 advanced)
2. Chemical Bonding (20 questions: 4 beginner, 8 intermediate, 8 advanced)
3. Hydrogen (20 questions: 4 beginner, 8 intermediate, 8 advanced)
4. s-Block Elements (20 questions: 4 beginner, 8 intermediate, 8 advanced)
"""

from builder import make_matrix_q
from part_periodic import get_periodic_questions
from part_bonding import get_bonding_questions
from part_hydrogen import get_hydrogen_questions
from part_sblock import get_sblock_questions

def get_questions():
    qs = []
    qs.extend(get_periodic_questions())
    qs.extend(get_bonding_questions())
    qs.extend(get_hydrogen_questions())
    qs.extend(get_sblock_questions())
    return qs

if __name__ == '__main__':
    questions = get_questions()
    print(f"Loaded {len(questions)} questions for Group 4 Inorganic Chemistry.")
