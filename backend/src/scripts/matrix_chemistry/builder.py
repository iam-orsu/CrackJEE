import datetime
import itertools

ROMAN_ORDER = ['I', 'II', 'III', 'IV']

def make_matrix_q(qid: str, topic: str, difficulty: str, lead: str, pairs: list, correct_choice: str = 'B') -> dict:
    """
    pairs: list of 4 tuples:
      (item_text, target_roman, target_text, step_explanation)
    labels A, B, C, D are assigned in order to pairs[0..3].
    """
    assert len(pairs) == 4, f"Must have exactly 4 pairs for {qid}, got {len(pairs)}"
    labels = ['A', 'B', 'C', 'D']
    
    # Map label to pair data
    label_pairs = []
    list2_dict = {}
    for i, (item, target_roman, target_text, step_exp) in enumerate(pairs):
        lbl = labels[i]
        assert target_roman in ROMAN_ORDER, f"Invalid roman numeral {target_roman} in {qid}"
        label_pairs.append({
            'label': lbl,
            'item': item,
            'match': target_roman,
            'matchText': target_text,
            'step': step_exp
        })
        list2_dict[target_roman] = target_text
        
    assert len(list2_dict) == 4, f"List II must have 4 distinct Roman numerals in {qid}, got {list(list2_dict.keys())}"
    
    # Build List I
    list1_str = "\n".join([f"{p['label']}. {p['item']}" for p in label_pairs])
    # Build List II
    list2_str = "\n".join([f"{r}. {list2_dict[r]}" for r in ROMAN_ORDER])
    
    question_text = (
        f"{lead}\n"
        f"List I:\n{list1_str}\n"
        f"List II:\n{list2_str}\n"
        f"Choose the correct answer from the options given below:"
    )
    
    correct_match_str = ", ".join([f"{p['label']}-{p['match']}" for p in label_pairs])
    target_matches = [p['match'] for p in label_pairs]
    
    # Generate 3 distinct plausible distractors
    distractors = []
    # Permutation 1: swap (0,1) and (2,3)
    p1 = [target_matches[1], target_matches[0], target_matches[3], target_matches[2]]
    s1 = ", ".join([f"{labels[idx]}-{p1[idx]}" for idx in range(4)])
    if s1 != correct_match_str and s1 not in distractors:
        distractors.append(s1)
        
    # Permutation 2: shift left by 1
    p2 = [target_matches[1], target_matches[2], target_matches[3], target_matches[0]]
    s2 = ", ".join([f"{labels[idx]}-{p2[idx]}" for idx in range(4)])
    if s2 != correct_match_str and s2 not in distractors:
        distractors.append(s2)
        
    # Permutation 3: reverse
    p3 = [target_matches[3], target_matches[2], target_matches[1], target_matches[0]]
    s3 = ", ".join([f"{labels[idx]}-{p3[idx]}" for idx in range(4)])
    if s3 != correct_match_str and s3 not in distractors:
        distractors.append(s3)
        
    # Fallback permutations if needed
    if len(distractors) < 3:
        all_perms = list(itertools.permutations(ROMAN_ORDER))
        for perm in all_perms:
            cand = ", ".join([f"{labels[idx]}-{perm[idx]}" for idx in range(4)])
            if cand != correct_match_str and cand not in distractors:
                distractors.append(cand)
            if len(distractors) == 3:
                break
            
    distractors = distractors[:3]
    assert len(distractors) == 3, f"Failed to generate 3 distractors for {qid}"
    
    options_map = {}
    options_map[correct_choice] = correct_match_str
    other_letters = [l for l in ['A', 'B', 'C', 'D'] if l != correct_choice]
    for idx, l in enumerate(other_letters):
        options_map[l] = distractors[idx]
        
    options = [
        f"A) {options_map['A']}",
        f"B) {options_map['B']}",
        f"C) {options_map['C']}",
        f"D) {options_map['D']}"
    ]
    
    steps_lines = [
        f"Step {i+1}: Match item {p['label']} ({p['item']}): {p['step']}. Therefore, {p['label']} corresponds to {p['match']}."
        for i, p in enumerate(label_pairs)
    ]
    steps_str = "\n".join(steps_lines)
    explanation = f"{steps_str}\nConclusion: The correct matching is {correct_match_str}, which corresponds to Option {correct_choice}."
    
    exam_type = 'Advanced' if difficulty == 'advanced' else 'Main'
    
    return {
        'id': qid,
        'subject': 'Chemistry',
        'topic': topic,
        'difficulty': difficulty,
        'examType': exam_type,
        'questionType': 'matrix_match',
        'questionText': question_text,
        'options': options,
        'answer': correct_choice,
        'explanation': explanation,
        'mockOnly': False,
        'validatedAt': datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
