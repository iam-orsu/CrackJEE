import re

def verify_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find make_matrix_q calls
    calls = content.split('qs.append(make_matrix_q(')[1:]
    errors = []
    for idx, c in enumerate(calls):
        # Extract qid
        qid_m = re.search(r'f"\{prefix\}_(\d+)"', c)
        qid = qid_m.group(1) if qid_m else f"idx_{idx}"
        
        # Extract tuples of pairs
        # format: ("item", "ROMAN", "text", "step")
        # Match roman numerals in 2nd position
        romans = re.findall(r',\s*"(I|II|III|IV)"\s*,', c)
        if len(romans) < 4:
            # try alternative regex
            romans = re.findall(r'\(\s*"[^"]+"\s*,\s*"(I|II|III|IV)"', c)
        romans = romans[:4]
        if len(set(romans)) != 4:
            errors.append((qid, romans))

    print(f"File {filepath}: Found {len(calls)} calls, {len(errors)} errors.")
    for qid, r in errors:
        print(f"  Q {qid}: {r}")

if __name__ == '__main__':
    import sys
    for p in sys.argv[1:]:
        verify_file(p)
