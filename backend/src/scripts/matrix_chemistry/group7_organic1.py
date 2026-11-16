import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from builder import make_matrix_q
from part_goc import get_goc_questions
from part_hc import get_hc_questions
from part_halo import get_halo_questions
from part_alcohol import get_alcohol_questions

def get_questions():
    """
    Returns 80 high-quality JEE Matrix Match questions for Chemistry covering:
    1. Organic Chemistry Basics (chem_org1_001 - chem_org1_020)
       - 4 beginner, 8 intermediate, 8 advanced
    2. Hydrocarbons (chem_org1_021 - chem_org1_040)
       - 4 beginner, 8 intermediate, 8 advanced
    3. Haloalkanes and Haloarenes (chem_org1_041 - chem_org1_060)
       - 4 beginner, 8 intermediate, 8 advanced
    4. Alcohols Phenols and Ethers (chem_org1_061 - chem_org1_080)
       - 4 beginner, 8 intermediate, 8 advanced
    """
    goc = get_goc_questions()
    hc = get_hc_questions()
    halo = get_halo_questions()
    alcohol = get_alcohol_questions()
    
    all_qs = goc + hc + halo + alcohol
    assert len(all_qs) == 80, f"Expected 80 questions, got {len(all_qs)}"
    return all_qs

if __name__ == '__main__':
    qs = get_questions()
    print(f"group7_organic1: Loaded {len(qs)} questions successfully.")
