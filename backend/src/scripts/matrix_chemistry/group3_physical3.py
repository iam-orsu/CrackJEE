import os
import sys

# Ensure local directory is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from builder import make_matrix_q
from part_sol import get_solutions_questions
from part_electro import get_electro_questions
from part_kinetics import get_kinetics_questions
from part_surface import get_surface_questions

def get_questions():
    """
    Returns exactly 80 high-quality JEE Matrix Match questions for Chemistry covering:
    1. Solutions (20 questions: 4 beginner, 8 intermediate, 8 advanced)
    2. Electrochemistry (20 questions: 4 beginner, 8 intermediate, 8 advanced)
    3. Chemical Kinetics (20 questions: 4 beginner, 8 intermediate, 8 advanced)
    4. Surface Chemistry (20 questions: 4 beginner, 8 intermediate, 8 advanced)
    """
    qs = []
    qs.extend(get_solutions_questions())
    qs.extend(get_electro_questions())
    qs.extend(get_kinetics_questions())
    qs.extend(get_surface_questions())
    return qs
