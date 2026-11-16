import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from part_mole import get_mole_questions
from part_atomic import get_atomic_questions
from part_states import get_states_questions
from part_solid import get_solid_questions

def get_questions():
    questions = []
    questions.extend(get_mole_questions())
    questions.extend(get_atomic_questions())
    questions.extend(get_states_questions())
    questions.extend(get_solid_questions())
    return questions

if __name__ == '__main__':
    qs = get_questions()
    print(f"Total questions generated: {len(qs)}")
