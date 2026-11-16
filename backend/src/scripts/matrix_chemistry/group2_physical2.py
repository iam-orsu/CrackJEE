"""
Group 2: Physical Chemistry 2
Topics covered:
  1. Chemical Thermodynamics (20 questions: chem_pc2_001 - chem_pc2_020)
  2. Chemical Equilibrium (20 questions: chem_pc2_021 - chem_pc2_040)
  3. Ionic Equilibrium (20 questions: chem_pc2_041 - chem_pc2_060)
  4. Redox Reactions (20 questions: chem_pc2_061 - chem_pc2_080)

Total: exactly 80 questions (4 beginner, 8 intermediate, 8 advanced per topic)
Even answer rotation: 5 A, 5 B, 5 C, 5 D per topic
"""
import os
import sys

# Ensure current script directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from part_thermo import get_thermo_questions
from part_chemeq import get_chemeq_questions
from part_ioniceq import get_ioniceq_questions
from part_redox import get_redox_questions

def get_questions() -> list:
    qs = []
    qs.extend(get_thermo_questions())
    qs.extend(get_chemeq_questions())
    qs.extend(get_ioniceq_questions())
    qs.extend(get_redox_questions())
    return qs
