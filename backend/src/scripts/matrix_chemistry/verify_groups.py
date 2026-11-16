import os
import sys

def verify_file(filepath):
    mod_name = os.path.splitext(os.path.basename(filepath))[0]
    dir_name = os.path.dirname(os.path.abspath(filepath))
    if dir_name not in sys.path:
        sys.path.insert(0, dir_name)
    try:
        mod = __import__(mod_name)
        qs = mod.get_questions()
    except Exception as e:
        print(f"File {filepath}: Failed to load: {e}")
        return

    errors = []
    ROMANS = {'I', 'II', 'III', 'IV'}
    for i, q in enumerate(qs):
        # Verify options length
        if len(q.get('options', [])) != 4:
            errors.append((q.get('id', i), f"options len != 4: {len(q.get('options', []))}"))
        if q.get('answer') not in {'A', 'B', 'C', 'D'}:
            errors.append((q.get('id', i), f"invalid answer: {q.get('answer')}"))
        # Check text format
        text = q.get('questionText', '')
        if "List I:" not in text or "List II:" not in text:
            errors.append((q.get('id', i), "missing List I or List II in questionText"))

    print(f"File {filepath}: Found {len(qs)} calls, {len(errors)} errors.")
    for qid, err in errors:
        print(f"  Q {qid}: {err}")

if __name__ == '__main__':
    for p in sys.argv[1:]:
        verify_file(p)
