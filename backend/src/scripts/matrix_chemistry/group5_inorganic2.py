import os
import sys

# Ensure current directory is on sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from part_pblock1 import get_pblock1_questions
from part_pblock2 import get_pblock2_questions
from part_dblock import get_dblock_questions
from part_coord import get_coord_questions

def get_questions():
    qs = []
    qs.extend(get_pblock1_questions())
    qs.extend(get_pblock2_questions())
    qs.extend(get_dblock_questions())
    qs.extend(get_coord_questions())
    return qs

if __name__ == '__main__':
    all_qs = get_questions()
    print(f"Total questions in group5_inorganic2: {len(all_qs)}")
