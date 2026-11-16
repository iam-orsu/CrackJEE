import os
import sys

# Ensure current directory is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from builder import make_matrix_q
from part_carbonyl import get_carbonyl_questions
from part_acid import get_acid_questions
from part_amine import get_amine_questions
from part_bio import get_bio_questions

def get_questions():
    """
    Returns exactly 80 JEE Matrix Match questions for Chemistry covering:
    1. Aldehydes and Ketones (20 questions: chem_org2_001 to chem_org2_020)
    2. Carboxylic Acids and Derivatives (20 questions: chem_org2_021 to chem_org2_040)
    3. Amines (20 questions: chem_org2_041 to chem_org2_060)
    4. Biomolecules (20 questions: chem_org2_061 to chem_org2_080)
    """
    questions = []
    questions.extend(get_carbonyl_questions())
    questions.extend(get_acid_questions())
    questions.extend(get_amine_questions())
    questions.extend(get_bio_questions())
    return questions

if __name__ == '__main__':
    qs = get_questions()
    print(f"Total questions generated in group8_organic2: {len(qs)}")
