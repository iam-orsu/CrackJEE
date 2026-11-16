from builder import make_matrix_q

def get_questions() -> list:
    qs = []

    # ==========================================
    # TOPIC 1: Permutations and Combinations (20 questions)
    # ==========================================
    t = "Permutations and Combinations"
    prefix = "math_mat_pnc"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        'Match the basic counting problems in List I with their values in List II:',
        [
            ('Number of 3-digit numbers formed using digits {1, 2, 3, 4, 5} without repetition', "II", '60', '5 × 4 × 3 = 60'),
            ('Number of ways 4 people can sit in a row of 4 chairs', "IV", '24', '4! = 24'),
            ('Value of 7! / (5! · 2!)', "I", '21', '(7 × 6) / 2 = 21'),
            ('Number of diagonals in a regular hexagon', "III", '9', 'C(6, 2) - 6 = 15 - 6 = 9'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        'Match the combination evaluations in List I with their numerical values in List II:',
        [
            ('C(8, 3)', "III", '56', '8 × 7 × 6 / (3 × 2 × 1) = 56'),
            ('C(10, 2)', "I", '45', '10 × 9 / 2 = 45'),
            ('C(7, 4)', "IV", '35', '7 × 6 × 5 / (3 × 2 × 1) = 35'),
            ('C(6, 3)', "II", '20', '6 × 5 × 4 / 6 = 20'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        'Match the word in List I with the number of distinct permutations of all its letters in List II:',
        [
            ('KAPIL (5 distinct letters)', "I", '120', '5! = 120'),
            ("APPLE (5 letters: 2 P's)", "IV", '60', '5! / 2! = 120 / 2 = 60'),
            ("LEVEL (5 letters: 2 E's, 2 L's)", "II", '30', '5! / (2! · 2!) = 120 / 4 = 30'),
            ("BALL (4 letters: 2 L's)", "III", '12', '4! / 2! = 24 / 2 = 12'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        'Match the circular arrangement scenarios in List I with the number of possible arrangements in List II:',
        [
            ('6 people seated around a circular dining table', "IV", '120', '(6 - 1)! = 5! = 120'),
            ('5 distinct beads strung to form a necklace', "III", '12', '(5 - 1)! / 2 = 24 / 2 = 12'),
            ('4 boys and 4 girls seated alternately around a circular table', "I", '144', '(4 - 1)! × 4! = 6 × 24 = 144'),
            ('6 people seated at a round table such that 2 particular people always sit together', "II", '48', 'Treat pair as 1 unit: (5 - 1)! × 2! = 24 × 2 = 48'),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        'Match the word in List I with its rank when its letters are arranged alphabetically in a dictionary (without repetition):',
        [
            ('CHALK', "II", '32', 'Letters: A, C, H, K, L. Words starting with A: 4! = 24. Words starting with CA: 3! = 6. Words CHAKL: 1, CHALK: 1. Rank = 24 + 6 + 1 + 1 = 32'),
            ('ZENITH', "IV", '616', 'Letters: E, H, I, N, T, Z. Words before Z: 5 × 5! = 600. ZEH...: 6, ZEI...: 6, ZENH...: 2, ZENIHT: 1, ZENITH: 1. Rank = 600 + 12 + 2 + 1 + 1 = 616'),
            ('RANK', "I", '20', 'Letters: A, K, N, R. Words starting with A, K, N: 3 × 3! = 18. RAKN: 1, RANK: 1. Rank = 18 + 1 + 1 = 20'),
            ('PRIME', "III", '94', 'Letters: E, I, M, P, R. Words starting with E, I, M: 3 × 4! = 72. PE, PI, PM: 3 × 3! = 18. PRE...: 2. PRIEM: 1, PRIME: 1. Rank = 72 + 18 + 2 + 1 + 1 = 94'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        'Match the group division problems in List I with their number of ways in List II:',
        [
            ('Dividing 9 different books equally among 3 named students', "III", '1680', '9! / (3!)³ = 362880 / 216 = 1680'),
            ('Dividing 9 different books into 3 equal unnamed parcels', "I", '280', '9! / ((3!)³ · 3!) = 1680 / 6 = 280'),
            ('Dividing 8 different balls into two groups of 5 and 3', "IV", '56', 'C(8, 3) = 8! / (5! · 3!) = 56'),
            ('Dividing 6 different gifts among 3 children so each receives 2 gifts', "II", '90', '6! / (2!)³ = 720 / 8 = 90'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        'Match the equation / distribution problem in List I with the number of integer solutions in List II:',
        [
            ('Non-negative integer solutions to x₁ + x₂ + x₃ = 10', "I", '66', 'C(10 + 3 - 1, 3 - 1) = C(12, 2) = 66'),
            ('Positive integer solutions to x₁ + x₂ + x₃ = 10', "IV", '36', 'C(10 - 1, 3 - 1) = C(9, 2) = 36'),
            ('Non-negative integer solutions to x₁ + x₂ + x₃ + x₄ = 6', "II", '84', 'C(6 + 4 - 1, 4 - 1) = C(9, 3) = 84'),
            ('Positive integer solutions to x₁ + x₂ + x₃ + x₄ = 8', "III", '35', 'C(8 - 1, 4 - 1) = C(7, 3) = 35'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        'Match the arrangement problems in List I with the number of ways in List II:',
        [
            ('5 boys and 4 girls in a row such that no two girls sit together', "IV", '43200', '5! × P(6, 4) = 120 × 360 = 43200'),
            ('5 boys and 3 girls in a row such that all girls sit together', "III", '4320', 'Treat 3 girls as 1 block: 6! × 3! = 720 × 6 = 4320'),
            ('4 boys and 4 girls in a row such that boys and girls alternate', "I", '1152', '2 × 4! × 4! = 2 × 24 × 24 = 1152'),
            ("Arrangements of letters of 'MATHEMATICS' where both M's are together", "II", '907200', "Treat MM as 1 unit: 10 items (2 A's, 2 T's): 10! / (2! · 2!) = 3628800 / 4 = 907200"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        'Let D_n denote the number of derangements of n distinct objects. Match List I with List II:',
        [
            ('D_3', "II", '2', 'D_3 = 3!(1/2! - 1/3!) = 6(1/3) = 2'),
            ('D_4', "I", '9', 'D_4 = 4!(1/2! - 1/3! + 1/4!) = 24(9/24) = 9'),
            ('D_5', "IV", '44', 'D_5 = 5 × D_4 + (-1)⁵ = 5(9) - 1 = 44'),
            ('D_6', "III", '265', 'D_6 = 6 × D_5 + (-1)⁶ = 6(44) + 1 = 265'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        'Given 10 points in a plane, of which exactly 4 are collinear (and no other 3 are collinear). Match List I with List II:',
        [
            ('Number of straight lines formed by joining these points', "I", '40', 'C(10, 2) - C(4, 2) + 1 = 45 - 6 + 1 = 40'),
            ('Number of triangles formed with vertices at these points', "III", '116', 'C(10, 3) - C(4, 3) = 120 - 4 = 116'),
            ('Number of quadrilaterals formed with vertices at these points', "IV", '185', 'C(10, 4) - C(4, 4) - C(4, 3)·C(6, 1) = 210 - 1 - 24 = 185'),
            ('Number of triangles having exactly one vertex among the 4 collinear points', "II", '60', 'C(4, 1) × C(6, 2) = 4 × 15 = 60'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        'For the prime factorization N = 2³ × 3² × 5¹ = 360, match the divisor properties in List I with List II:',
        [
            ('Total number of positive divisors of 360', "III", '24', '(3+1)(2+1)(1+1) = 4 × 3 × 2 = 24'),
            ('Number of even positive divisors of 360', "II", '18', '3 × (2+1)(1+1) = 3 × 3 × 2 = 18'),
            ('Number of odd positive divisors of 360', "IV", '6', '1 × (2+1)(1+1) = 1 × 3 × 2 = 6'),
            ('Number of positive divisors divisible by 6 (2¹ · 3¹)', "I", '12', '3 × 2 × 2 = 12'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        'Count the integers from 1 to 200 inclusive satisfying conditions in List I, matching with List II:',
        [
            ('Divisible by 4 or 6', "IV", '67', '[200/4] + [200/6] - [200/12] = 50 + 33 - 16 = 67'),
            ('Divisible by 4 but not by 6', "I", '34', '[200/4] - [200/12] = 50 - 16 = 34'),
            ('Divisible by neither 4 nor 6', "III", '133', '200 - 67 = 133'),
            ('Divisible by 4 or 5 or 6', "II", '94', '50 + 40 + 33 - (10 + 6 + 16) + 3 = 123 - 32 + 3 = 94'),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        '5 letters are placed into 5 addressed envelopes at random. Match the scenarios in List I with List II:',
        [
            ('Exactly 1 letter goes into its correct envelope', "II", '45', 'C(5, 1) × D_4 = 5 × 9 = 45'),
            ('Exactly 2 letters go into their correct envelopes', "IV", '20', 'C(5, 2) × D_3 = 10 × 2 = 20'),
            ('No letter goes into its correct envelope (D_5)', "I", '44', 'D_5 = 44'),
            ('At least 3 letters go into their correct envelopes', "III", '11', 'Exactly 3: C(5, 3)·D_2 = 10·1 = 10; Exactly 4: 0; Exactly 5: 1. Total = 10 + 0 + 1 = 11'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        'Find the number of integer solutions to x₁ + x₂ + x₃ = 15 under bounds in List I, matching with List II:',
        [
            ('x_i ≥ 1 for all i = 1, 2, 3', "III", '91', 'C(15 - 1, 3 - 1) = C(14, 2) = 91'),
            ('x_i ≥ 0 and x_i ≤ 6 for all i = 1, 2, 3', "I", '10', 'Total = C(17, 2) = 136. Minus 3·C(10, 2) = 135 plus 3·C(3, 2) = 9 gives 136 - 135 + 9 = 10'),
            ('x₁ ≥ 2, x₂ ≥ 3, x₃ ≥ 4', "IV", '28', 'Remaining sum = 15 - 9 = 6; C(6 + 3 - 1, 2) = C(8, 2) = 28'),
            ('x_i ≥ 0 and x₁ is even', "II", '72', 'x₁ = 2k with k ∈ {0, ..., 7}. Sum of (16 - 2k) for k=0 to 7 is 8 × 16 - 2(28) = 128 - 56 = 72'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        'Match the relative order conditions on arrangements of 7 people (A, B, C, D, E, F, G) in a row in List I with List II:',
        [
            ('A sits somewhere to the left of B', "I", '2520', 'By symmetry, exactly half of 7!: 7! / 2 = 5040 / 2 = 2520'),
            ('A sits to the left of B, and B sits to the left of C', "IV", '840', 'Exactly 1/3! of 7!: 7! / 6 = 5040 / 6 = 840'),
            ('A and B sit together, but neither sits adjacent to C', "II", '960', 'AB together: 2! × 6! = 1440. Subtracting configurations where C is adjacent to the AB pair (2 × 2 × 5! = 480) gives 1440 - 480 = 960'),
            ('A, B, C occupy 3 specific assigned chairs', "III", '144', '3! ways to arrange A, B, C in the chairs, and 4! ways for remaining 4 people: 6 × 24 = 144'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        'Match the distribution problems in List I with the number of ways in List II:',
        [
            ('Distribute 4 distinct balls into 3 distinct boxes such that no box is empty', "IV", '36', '3! × S(4, 3) = 6 × 6 = 36'),
            ('Distribute 5 distinct balls into 3 distinct boxes such that no box is empty', "III", '150', '3⁵ - 3·2⁵ + 3·1⁵ = 243 - 96 + 3 = 150'),
            ('Distribute 6 identical balls into 3 distinct boxes such that no box is empty', "I", '10', 'C(6 - 1, 3 - 1) = C(5, 2) = 10'),
            ('Distribute 4 distinct balls into 2 identical non-empty boxes', "II", '7', 'Stirling number S(4, 2) = (2⁴ - 2) / 2! = 14 / 2 = 7'),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        'For numbers formed using all 5 digits {1, 2, 3, 4, 5} without repetition, match List I with List II:',
        [
            ('Total number of 5-digit numbers that can be formed', "II", '120', '5! = 120'),
            ('Number of these numbers that are divisible by 4', "I", '24', 'Ending with 12, 24, 32, 52 (4 choices). First 3 digits: 3! = 6 choices. 4 × 6 = 24'),
            ('Sum of digits at the units place of all 120 numbers', "IV", '360', 'Each digit 1..5 appears 4! = 24 times: 24 × (1+2+3+4+5) = 24 × 15 = 360'),
            ('Number of these numbers greater than 30000', "III", '72', 'First digit must be 3, 4, or 5: 3 × 4! = 3 × 24 = 72'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        'Match the function counting problems in List I with the values in List II:',
        [
            ('Total number of functions from A = {1, 2, 3, 4} to B = {a, b, c}', "III", '81', '|B|^{|A|} = 3⁴ = 81'),
            ('Number of onto (surjective) functions from A = {1, 2, 3, 4} to B = {a, b, c}', "I", '36', '3! × S(4, 3) = 6 × 6 = 36'),
            ('Number of one-to-one (injective) functions from B = {a, b, c} to A = {1, 2, 3, 4}', "IV", '24', 'P(4, 3) = 4 × 3 × 2 = 24'),
            ('Number of onto functions from A = {1, 2, 3, 4, 5} to B = {a, b}', "II", '30', '2⁵ - 2 = 32 - 2 = 30'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        'Match the advanced circular arrangement problems in List I with List II:',
        [
            ('Ways 7 people can sit around a round table with 2 specific people never together', "I", '480', 'Total circular (6! = 720) minus together (5! × 2! = 240) = 480'),
            ('Ways 8 people can sit around two identical 4-seat round tables (4 each)', "IV", '1260', '[8! / (4! 4! 2!)] × 3! × 3! = 35 × 6 × 6 = 1260'),
            ('Ways 6 men and 6 women can sit at a round table such that no two women are adjacent', "II", '86400', '(6 - 1)! × 6! = 120 × 720 = 86400'),
            ('Number of necklace arrangements using 6 distinct beads', "III", '60', '(6 - 1)! / 2 = 5! / 2 = 120 / 2 = 60'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        'Match the grid path and lattice arrangement problems in List I with List II:',
        [
            ('Shortest paths on grid from (0, 0) to (5, 4)', "IV", '126', 'C(5 + 4, 4) = C(9, 4) = 126'),
            ('Shortest paths from (0, 0) to (5, 4) passing through (2, 2)', "I", '60', 'C(4, 2) × C(5, 2) = 6 × 10 = 60'),
            ('Shortest paths from (0, 0) to (5, 4) avoiding (2, 2)', "III", '66', '126 - 60 = 66'),
            ('Shortest paths from (0, 0) to (4, 4) never crossing above y = x (Catalan C_4)', "II", '14', 'C_4 = C(8, 4) / 5 = 70 / 5 = 14'),
        ], "D"))

    # ==========================================
    # TOPIC 2: Binomial Theorem (20 questions)
    # ==========================================
    t = "Binomial Theorem"
    prefix = "math_mat_binom"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        'Match the binomial expressions in List I with their expansion properties in List II:',
        [
            ('Total number of terms in the expansion of (x + y)¹⁰', "II", '11', 'n + 1 = 10 + 1 = 11 terms'),
            ('Total number of terms in the expansion of (x + y + z)⁵', "IV", '21', 'C(5 + 3 - 1, 3 - 1) = C(7, 2) = 21 terms'),
            ('Sum of all binomial coefficients in (1 + x)⁶', "I", '64', '2⁶ = 64'),
            ('Coefficient of x³ in (1 + x)⁵', "III", '10', 'C(5, 3) = 10'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        'For the expansion of (2x + 1)⁶, match the term in List I with its coefficient in List II:',
        [
            ('Coefficient of x⁶ (Term T₁)', "III", '64', 'C(6, 0) · 2⁶ = 64'),
            ('Coefficient of x⁵ (Term T₂)', "I", '192', 'C(6, 1) · 2⁵ = 6 · 32 = 192'),
            ('Coefficient of x⁴ (Term T₃)', "IV", '240', 'C(6, 2) · 2⁴ = 15 · 16 = 240'),
            ('Coefficient of x³ (Term T₄)', "II", '160', 'C(6, 3) · 2³ = 20 · 8 = 160'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        'Match the binomial expansion in List I with the term number(s) of its middle term(s) in List II:',
        [
            ('Middle term of (x + a)⁸', "I", 'T₅', 'Since n = 8 is even, middle term is (8/2) + 1 = 5th term (T₅)'),
            ('Middle terms of (x + a)⁷', "III", 'T₄ and T₅', 'Since n = 7 is odd, middle terms are ((7+1)/2)=4th and ((7+3)/2)=5th terms (T₄ and T₅)'),
            ('Middle term of (x - 2/x)¹⁰', "IV", 'T₆', 'Since n = 10 is even, middle term is (10/2) + 1 = 6th term (T₆)'),
            ('Middle terms of (2x + 3y)⁵', "II", 'T₃ and T₄', 'Since n = 5 is odd, middle terms are 3rd and 4th terms (T₃ and T₄)'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        'Match the binomial expansion in List I with its term independent of x in List II:',
        [
            ('Term independent of x in (x + 1/x)⁴', "IV", '6', 'T₃ = C(4, 2) = 6'),
            ('Term independent of x in (x² + 1/x)⁶', "I", '15', 'x^{2(6-r)} x^{-r} = x^{12-3r} => r = 4; C(6, 4) = 15'),
            ('Term independent of x in (2x - 1/x)⁴', "III", '24', 'r = 2; C(4, 2) · 2² · (-1)² = 6 · 4 · 1 = 24'),
            ('Term independent of x in (x³ + 1/x)⁴', "II", '4', '3(4-r) - r = 12 - 4r = 0 => r = 3; C(4, 3) = 4'),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        'Let C_r = C(n, r). Match the standard binomial identities in List I with List II:',
        [
            ('∑_{r=0}^n C_r = C_0 + C_1 + ... + C_n', "II", '2^n', 'Sum of all coefficients in (1 + 1)^n is 2^n'),
            ('∑_{r=0}^n (-1)^r C_r = C_0 - C_1 + ... + (-1)^n C_n', "IV", '0', 'Alternating sum (1 - 1)^n is 0'),
            ('C_0 + C_2 + C_4 + ... (sum of even indexed coefficients)', "I", '2^{n-1}', 'Sum of even coefficients equals 2^n / 2 = 2^{n-1}'),
            ('∑_{r=0}^n (C_r)² = (C_0)² + (C_1)² + ... + (C_n)²', "III", 'C(2n, n)', 'Coefficient of x^n in (1+x)^n (x+1)^n is C(2n, n)'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        'For n = 5, let C_r = C(5, r). Match the expressions in List I with their values in List II:',
        [
            ('∑_{r=0}^5 C(5, r)', "III", '32', '2⁵ = 32'),
            ('∑_{r=1}^5 r · C(5, r)', "I", '80', '5 · 2⁴ = 5 × 16 = 80'),
            ('∑_{r=1}^5 r² · C(5, r)', "IV", '240', 'n(n+1) 2^{n-2} = 5(6) 2³ = 30 × 8 = 240'),
            ('∑_{r=0}^5 (C(5, r))²', "II", '252', 'C(2n, n) = C(10, 5) = 252'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        'Match the binomial expansion in List I with the value of its greatest binomial coefficient in List II:',
        [
            ('(1 + x)⁸', "I", '70', 'Greatest binomial coefficient is C(8, 4) = 70'),
            ('(1 + x)¹⁰', "IV", '252', 'Greatest binomial coefficient is C(10, 5) = 252'),
            ('(1 + x)⁶', "II", '20', 'Greatest binomial coefficient is C(6, 3) = 20'),
            ('(1 + x)⁷', "III", '35', 'Greatest binomial coefficient is C(7, 3) = C(7, 4) = 35'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        'Find the numerically greatest term index in the expansion of (a + bx)ⁿ for given values in List I, matching with List II:',
        [
            ('Numerically greatest term in (1 + 2x)¹⁰ when x = 1', "IV", 'T₈', 'm = (10+1)(2)/(2+1) = 22/3 = 7.33 => r = 7, so T₈ is greatest'),
            ('Numerically greatest term in (1 + x)¹² when x = 1/2', "III", 'T₅', 'm = (12+1)(1/2)/(1/2+1) = 13/3 = 4.33 => r = 4, so T₅ is greatest'),
            ('Numerically greatest term in (2 + 3x)⁹ when x = 1', "I", 'T₆ and T₇', 'X = 3/2, m = 10(3/2)/(5/2) = 6 (integer) => T₆ and T₇ are equal and greatest'),
            ('Numerically greatest term in (3 - 2x)¹⁵ when x = 1', "II", 'T₇', 'X = 2/3, m = 16(2/3)/(5/3) = 32/5 = 6.4 => r = 6, so T₇ is greatest'),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        'Match the expressions in List I with the coefficient of the specified term in List II:',
        [
            ('Coefficient of x² y³ z⁴ in (x + y + z)⁹', "II", '1260', '9! / (2! 3! 4!) = 362880 / 288 = 1260'),
            ('Coefficient of a² b c³ in (a + b + c)⁶', "I", '60', '6! / (2! 1! 3!) = 720 / 12 = 60'),
            ('Coefficient of x⁴ in (1 + 2x + x²)⁴ = (1 + x)⁸', "IV", '70', 'C(8, 4) = 70'),
            ('Coefficient of x⁵ in (1 - x + x²)⁶', "III", '-126', 'Sum of terms for (p, q, r) with q+2r=5: -6 - 60 - 60 = -126'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        'Match the expression and divisor in List I with the remainder in List II:',
        [
            ('Remainder when 7¹⁰³ is divided by 25', "III", '18', '7(50 - 1)⁵¹ = 7(25k - 1) = 25m - 7 ≡ 18 (mod 25)'),
            ('Remainder when 2²⁰²⁴ is divided by 17', "I", '1', '(2⁴)⁵⁰⁶ = (17 - 1)⁵⁰⁶ ≡ 1 (mod 17)'),
            ('Remainder when 5⁹⁹ is divided by 13', "IV", '8', '5(26 - 1)⁴⁹ = 5(13k - 1) ≡ -5 ≡ 8 (mod 13)'),
            ('Remainder when 9¹⁰⁰ is divided by 7', "II", '2', '9¹⁰⁰ ≡ 2¹⁰⁰ = 2(8)³³ = 2(7+1)³³ ≡ 2 (mod 7)'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        'Match the binomial expansion for |x| < 1 in List I with its infinite series representation in List II:',
        [
            ('(1 - x)⁻¹', "I", '1 + x + x² + x³ + ...', 'Expansion of (1 - x)⁻¹ = ∑_{r=0}^∞ x^r'),
            ('(1 + x)⁻¹', "III", '1 - x + x² - x³ + ...', 'Expansion of (1 + x)⁻¹ = ∑_{r=0}^∞ (-1)^r x^r'),
            ('(1 - x)⁻²', "IV", '1 + 2x + 3x² + 4x³ + ...', 'Expansion of (1 - x)⁻² = ∑_{r=0}^∞ (r + 1) x^r'),
            ('(1 + x)⁻²', "II", '1 - 2x + 3x² - 4x³ + ...', 'Expansion of (1 + x)⁻² = ∑_{r=0}^∞ (-1)^r (r + 1) x^r'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        'Let C_r = C(n, r). Match the summation identities in List I with their closed forms in List II:',
        [
            ('∑_{r=0}^{n-1} C_r · C_{r+1}', "IV", 'C(2n, n - 1)', 'Equating coefficient of x^{n-1} in (1+x)^n (1+x)^n gives C(2n, n - 1)'),
            ('∑_{r=0}^{n-2} C_r · C_{r+2}', "I", 'C(2n, n - 2)', 'Equating coefficient of x^{n-2} in (1+x)^{2n} gives C(2n, n - 2)'),
            ('∑_{r=0}^n (C_r)²', "III", 'C(2n, n)', 'Equating coefficient of x^n in (1+x)^{2n} gives C(2n, n)'),
            ('∑_{r=0}^n (-1)^r (C_r)² for even n', "II", '(-1)^{n/2} C(n, n/2)', 'Coefficient of x^n in (1 - x²)^n is (-1)^{n/2} C(n, n/2)'),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        'For C_r = C(n, r), match the derivative-derived sums in List I with their closed-form expressions in List II:',
        [
            ('∑_{r=1}^n r · C_r', "II", 'n · 2^{n-1}', 'Differentiating (1 + x)^n and setting x = 1 yields n · 2^{n-1}'),
            ('∑_{r=1}^n r² · C_r', "IV", 'n(n + 1) · 2^{n-2}', 'Using r² = r(r-1) + r, derivative yields n(n-1)2^{n-2} + n 2^{n-1} = n(n+1) 2^{n-2}'),
            ('∑_{r=1}^n r(r - 1) · C_r', "I", 'n(n - 1) · 2^{n-2}', 'Second derivative of (1 + x)^n evaluated at x = 1 gives n(n - 1) 2^{n-2}'),
            ('∑_{r=1}^n (-1)^{r-1} r · C_r', "III", '0', 'Differentiating (1 - x)^n gives -n(1 - x)^{n-1}, which vanishes at x = 1 for n > 1'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        'For C_r = C(n, r), match the integral-based sums in List I with their values in List II:',
        [
            ('∑_{r=0}^n C_r / (r + 1)', "III", '(2^{n+1} - 1) / (n + 1)', 'Integrating (1 + x)^n from 0 to 1 gives [(1 + x)^{n+1}/(n+1)]_0^1 = (2^{n+1} - 1)/(n+1)'),
            ('∑_{r=0}^n (-1)^r C_r / (r + 1)', "I", '1 / (n + 1)', 'Integrating (1 - x)^n from 0 to 1 gives [-(1 - x)^{n+1}/(n+1)]_0^1 = 1/(n+1)'),
            ('∑_{r=0}^n C_r / ((r + 1)(r + 2))', "IV", '(2^{n+2} - n - 3) / ((n + 1)(n + 2))', 'Integrating twice from 0 to 1 yields (2^{n+2} - n - 3)/((n+1)(n+2))'),
            ('∑_{r=0}^n (-1)^r C_r / (r + 2)', "II", '1 / ((n + 1)(n + 2))', 'Integrating x(1 - x)^n from 0 to 1 gives Beta(2, n+1) = 1! n! / (n+2)! = 1/((n+1)(n+2))'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        'Match the rational / compound algebraic expressions in List I with the coefficient of the specified power in List II:',
        [
            ('Coefficient of x⁴ in (1 + x + x² + x³)⁶', "I", '120', '((1 - x⁴)/(1 - x))⁶ = (1 - 6x⁴)(1 - x)⁻⁶; coeff is C(9, 4) - 6·C(5, 0) = 126 - 6 = 120'),
            ('Coefficient of x⁵ in (1 - 2x)⁻³ for |x| < 1/2', "III", '672', 'C(5 + 3 - 1, 5) · 2⁵ = C(7, 2) · 32 = 21 × 32 = 672'),
            ('Coefficient of x⁴ in 1 / ((1 - x)(1 - 2x)) for |x| < 1/2', "IV", '31', '2/(1 - 2x) - 1/(1 - x) gives 2 · 2⁴ - 1 = 32 - 1 = 31'),
            ('Coefficient of x³ in (1 + x)² / (1 - x)³ for |x| < 1', "II", '25', '(1 + 2x + x²) ∑ C(r+2, 2) x^r gives 1·10 + 2·6 + 1·3 = 25'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        'Let C_r = C(n, r). Match the multisection sums in List I with their values in List II:',
        [
            ('C_0 + C_3 + C_6 + C_9 + ... (sum of every 3rd coefficient starting at 0)', "IV", '(1/3)[2^n + 2 cos(nπ/3)]', 'Using cube roots of unity: (1/3)[(1+1)^n + (1+ω)^n + (1+ω²)^n] = (1/3)[2^n + 2 cos(nπ/3)]'),
            ('C_1 + C_4 + C_7 + C_{10} + ... (sum of every 3rd coefficient starting at 1)', "I", '(1/3)[2^n + 2 cos((n - 2)π/3)]', 'Using ω²(1+1)^n + ω(1+ω)^n + (1+ω²)^n yields (1/3)[2^n + 2 cos((n - 2)π/3)]'),
            ('C_0 - C_2 + C_4 - C_6 + ... (real part of (1 + i)ⁿ)', "III", '2^{n/2} cos(nπ/4)', 'Real part of (√2 e^{iπ/4})^n is 2^{n/2} cos(nπ/4)'),
            ('C_1 - C_3 + C_5 - C_7 + ... (imaginary part of (1 + i)ⁿ)', "II", '2^{n/2} sin(nπ/4)', 'Imaginary part of (√2 e^{iπ/4})^n is 2^{n/2} sin(nπ/4)'),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        'Match the double sums in List I with their closed-form expressions in List II (where C_r = C(n, r)):',
        [
            ('∑_{0 ≤ i < j ≤ n} (C_i + C_j)', "II", 'n · 2^n', 'Each C_k appears n times in the double sum: n ∑ C_k = n · 2^n'),
            ('∑_{0 ≤ i < j ≤ n} C_i · C_j', "IV", '(2^{2n} - C(2n, n)) / 2', '[(∑ C_i)² - ∑ (C_i)²] / 2 = [2^{2n} - C(2n, n)] / 2'),
            ('∑_{0 ≤ i ≤ j ≤ n} C_i · C_j', "I", '(2^{2n} + C(2n, n)) / 2', 'Includes diagonal terms ∑ (C_i)²: [2^{2n} + C(2n, n)] / 2'),
            ('∑_{0 ≤ i < j ≤ n} (C_i - C_j)²', "III", '(n + 1) C(2n, n) - 2^{2n}', 'n ∑ (C_i)² - 2 ∑_{i<j} C_i C_j = n C(2n, n) - (2^{2n} - C(2n, n)) = (n+1)C(2n, n) - 2^{2n}'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        'Match the infinite binomial series in List I with their exact values in List II:',
        [
            ('1 + (1/2)(1/3) + ((1·3)/(2·4))(1/3²) + ((1·3·5)/(2·4·6))(1/3³) + ...', "III", '√6 / 2', '(1 - 1/3)^{-1/2} = (2/3)^{-1/2} = √(3/2) = √6 / 2'),
            ('1 - (1/2)(1/4) + ((1·3)/(2·4))(1/4²) - ((1·3·5)/(2·4·6))(1/4³) + ...', "I", '2√5 / 5', '(1 + 1/4)^{-1/2} = (5/4)^{-1/2} = 2/√5 = 2√5 / 5'),
            ('1 + (1/3)(1/2) + ((1·4)/(3·6))(1/2²) + ((1·4·7)/(3·6·9))(1/2³) + ...', "IV", '2^{1/3}', '(1 - 1/2)^{-1/3} = (1/2)^{-1/3} = 2^{1/3}'),
            ('1 + 2(1/3) + 3(1/3²) + 4(1/3³) + ...', "II", '9/4', '(1 - 1/3)⁻² = (2/3)⁻² = 9/4'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Let E_p(n!) denote the highest power of prime p dividing n! (Legendre's Formula). Match List I with List II:",
        [
            ('E₂(50!) (highest power of 2 dividing 50!)', "I", '47', '25 + 12 + 6 + 3 + 1 = 47'),
            ('E₃(50!) (highest power of 3 dividing 50!)', "III", '22', '16 + 5 + 1 = 22'),
            ('E₅(50!) (highest power of 5 dividing 50!)', "IV", '12', '10 + 2 = 12'),
            ('E₇(50!) (highest power of 7 dividing 50!)', "II", '8', '7 + 1 = 8'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        'Match the multinomial expressions in List I with their properties in List II:',
        [
            ('Total number of terms in the expansion of (x₁ + x₂ + x₃ + x₄)⁷', "IV", '120', 'C(7 + 4 - 1, 4 - 1) = C(10, 3) = 120'),
            ('Sum of all coefficients in the expansion of (2x - 3y + z)¹⁰', "II", '0', 'Substitute x = y = z = 1: (2 - 3 + 1)¹⁰ = 0'),
            ('Sum of all coefficients in the expansion of (5x - 2y - 2z)⁶', "I", '1', 'Substitute x = y = z = 1: (5 - 2 - 2)⁶ = 1⁶ = 1'),
            ('Coefficient of x³ y² z in the expansion of (2x - y + 3z)⁶', "III", '1440', '6! / (3! 2! 1!) · (2)³ (-1)² (3)¹ = 60 · 8 · 1 · 3 = 1440'),
        ], "D"))

    # ==========================================
    # TOPIC 3: Sequences and Series (20 questions)
    # ==========================================
    t = "Sequences and Series"
    prefix = "math_mat_seqser"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        'For an AP with first term a = 3 and common difference d = 4, match List I with List II:',
        [
            ('10th term (T₁₀)', "II", '39', 'a + 9d = 3 + 36 = 39'),
            ('Sum of first 10 terms (S₁₀)', "IV", '210', '(10/2)[2(3) + 9(4)] = 5(42) = 210'),
            ('15th term (T₁₅)', "I", '59', 'a + 14d = 3 + 56 = 59'),
            ('Sum of first 5 terms (S₅)', "III", '55', '(5/2)[2(3) + 4(4)] = 5 × 11 = 55'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        'For a GP with first term a = 2 and common ratio r = 3, match List I with List II:',
        [
            ('5th term (T₅)', "III", '162', '2 · 3⁴ = 2 · 81 = 162'),
            ('Sum of first 4 terms (S₄)', "I", '80', '2(3⁴ - 1) / (3 - 1) = 80'),
            ('4th term (T₄)', "IV", '54', '2 · 3³ = 2 · 27 = 54'),
            ('Sum of first 5 terms (S₅)', "II", '242', '2(3⁵ - 1) / (3 - 1) = 242'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        'Match the infinite series / recurring decimals in List I with their fractional values in List II:',
        [
            ('Sum of infinite GP: 6 + 2 + 2/3 + 2/9 + ...', "I", '9', 'a / (1 - r) = 6 / (1 - 1/3) = 9'),
            ('Sum of infinite GP: 1/2 + 1/4 + 1/8 + ...', "III", '1', '(1/2) / (1 - 1/2) = 1'),
            ('The recurring decimal 0.27̄ = 0.272727...', "IV", '3/11', '27 / 99 = 3 / 11'),
            ('The recurring decimal 0.16̄ = 0.1666...', "II", '1/6', '(16 - 1) / 90 = 15 / 90 = 1 / 6'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        'Match the finite summation expressions in List I with their numerical values in List II:',
        [
            ('∑_{k=1}^{10} k', "IV", '55', '10 × 11 / 2 = 55'),
            ('∑_{k=1}^{10} k²', "I", '385', '10 × 11 × 21 / 6 = 385'),
            ('∑_{k=1}^{10} k³', "III", '3025', '(55)² = 3025'),
            ('∑_{k=1}^{10} (2k - 1) (sum of first 10 odd integers)', "II", '100', '10² = 100'),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        'For the two positive numbers a = 4 and b = 16, match the means in List I with their values in List II:',
        [
            ('Arithmetic Mean (AM = (a + b)/2)', "II", '10', '(4 + 16)/2 = 10'),
            ('Geometric Mean (GM = √(ab))', "IV", '8', '√(4 × 16) = √64 = 8'),
            ('Harmonic Mean (HM = 2ab/(a + b))', "I", '32/5', '2(64)/20 = 32/5'),
            ('Root Mean Square (RMS = √((a² + b²)/2))', "III", '2√34', '√((16 + 256)/2) = √136 = 2√34'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        'Match the arithmetic-geometric series in List I with their infinite sums S in List II:',
        [
            ('S = 1 + 2/2 + 3/4 + 4/8 + 5/16 + ...', "III", '4', 'r = 1/2: 1/(1/2) + (1)(1/2)/(1/4) = 2 + 2 = 4'),
            ('S = 1 + 2/3 + 3/9 + 4/27 + 5/81 + ...', "I", '9/4', 'r = 1/3: 1/(2/3) + (1/3)/(4/9) = 3/2 + 3/4 = 9/4'),
            ('S = 1 + 3/4 + 5/16 + 7/64 + ...', "IV", '20/9', 'a = 1, d = 2, r = 1/4: 1/(3/4) + 2(1/4)/(9/16) = 4/3 + 8/9 = 20/9'),
            ('S = 2 + 5/2 + 8/4 + 11/8 + ...', "II", '10', 'a = 2, d = 3, r = 1/2: 2/(1/2) + 3(1/2)/(1/4) = 4 + 6 = 10'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        'Let the 3rd term of an HP be 1/5 and the 8th term be 1/15. Match List I with List II:',
        [
            ('1st term of the HP (H₁)', "I", '1', 'In AP: a + 2d = 5, a + 7d = 15 => d = 2, a = 1; H₁ = 1/1 = 1'),
            ('5th term of the HP (H₅)', "III", '1/9', 'In AP: T₅ = 1 + 4(2) = 9 => H₅ = 1/9'),
            ('10th term of the HP (H₁₀)', "IV", '1/19', 'In AP: T₁₀ = 1 + 9(2) = 19 => H₁₀ = 1/19'),
            ('Value of n for which H_n = 1/25', "II", '13', 'In AP: T_n = 25 => 1 + 2(n - 1) = 25 => n = 13'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        'Match the telescoping series in List I with their values in List II:',
        [
            ('∑_{n=1}^∞ 1 / (n(n + 1))', "IV", '1', '∑ (1/n - 1/(n+1)) = 1'),
            ('∑_{n=1}^∞ 1 / (n(n + 1)(n + 2))', "III", '1/4', '(1/2) [1/(1·2)] = 1/4'),
            ('∑_{n=1}^{10} 1 / ((2n - 1)(2n + 1))', "I", '10/21', '(1/2)[1 - 1/21] = 10/21'),
            ('∑_{n=1}^∞ 1 / ((n + 1)(n + 3))', "II", '5/12', '(1/2)[1/2 + 1/3] = 5/12'),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        'Match the cubic equation conditions in List I with the values in List II:',
        [
            ('If roots of x³ - 12x² + 39x - 28 = 0 are in AP, find the common difference magnitude |d|', "II", '3', 'Roots are 4 - d, 4, 4 + d; (16 - d²)4 = 28 => d² = 9 => |d| = 3'),
            ('If roots of x³ - 14x² + 56x - 64 = 0 are in GP, find the common ratio r (with r > 1)', "I", '2', 'Roots 4/r, 4, 4r; 4(1/r + 1 + r) = 14 => r + 1/r = 5/2 => r = 2'),
            ('If roots of 6x³ - 11x² + 6x - 1 = 0 are in HP, find the middle root', "IV", '1/2', 'Reciprocal roots equation has sum 6 => middle AP root is 2, so middle HP root is 1/2'),
            ('If roots of x³ - 9x² + 23x - 15 = 0 are in AP, find the largest root', "III", '5', 'Roots are 3 - d, 3, 3 + d; 3(9 - d²) = 15 => d = 2; roots are 1, 3, 5; largest is 5'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        'Match the mean insertion problems in List I with List II:',
        [
            ('Sum of 5 Arithmetic Means inserted between 2 and 20', "III", '55', '5 × (2 + 20)/2 = 55'),
            ('Product of 4 Geometric Means inserted between 2 and 32', "I", '4096', '(√(2 × 32))⁴ = 8⁴ = 4096'),
            ('Value of the single AM between 12 and 48', "IV", '30', '(12 + 48)/2 = 30'),
            ('Value of the single GM between 12 and 48', "II", '24', '√(12 × 48) = 24'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        'Consider AP₁: 3, 7, 11, 15, ..., 403 and AP₂: 2, 9, 16, 23, ..., 408. Match List I with List II:',
        [
            ('First common term of the two progressions', "I", '23', 'Smallest term in both APs is 23'),
            ('Common difference of the common terms', "IV", '28', 'LCM(4, 7) = 28'),
            ('Number of identical (common) terms', "II", '14', '23 + (n - 1)28 ≤ 403 => n = 14'),
            ('The last common term', "III", '387', '23 + 13(28) = 387'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        'For positive real variables, match the minimum / maximum values in List I with List II:',
        [
            ('Minimum value of x + 4/x for x > 0', "IV", '4', 'By AM-GM, x + 4/x ≥ 2√(4) = 4'),
            ('Minimum value of x² + 16/x² for x > 0', "III", '8', 'By AM-GM, x² + 16/x² ≥ 2√(16) = 8'),
            ('Maximum value of xy given x + y = 10 (x, y > 0)', "I", '25', 'By AM-GM, xy ≤ ((x + y)/2)² = 25'),
            ('Minimum value of 9^x + 9^{1-x} for x ∈ ℝ', "II", '6', 'By AM-GM, 9^x + 9^{1-x} ≥ 2√(9) = 6'),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        'Match the summation of series in List I with their closed-form expressions in List II:',
        [
            ('∑_{k=1}^n k · k!', "II", '(n + 1)! - 1', 'k · k! = (k + 1)! - k!; sum telescopes to (n + 1)! - 1'),
            ('∑_{k=1}^n k / (k + 1)!', "IV", '1 - 1/(n + 1)!', 'k / (k + 1)! = 1/k! - 1/(k + 1)!; sum telescopes to 1 - 1/(n + 1)!'),
            ('∑_{k=1}^n 1 / (k(k + 1)(k + 2))', "I", '1/4 - 1/(2(n + 1)(n + 2))', '(1/2) [1/(k(k+1)) - 1/((k+1)(k+2))]; sum telescopes to 1/4 - 1/(2(n+1)(n+2))'),
            ('∑_{k=1}^n k(k + 1)', "III", 'n(n + 1)(n + 2) / 3', '∑ (k² + k) = n(n + 1)(2n + 1)/6 + n(n + 1)/2 = n(n + 1)(n + 2) / 3'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        'For positive real numbers a, b, c, match the expression in List I with its minimum value in List II:',
        [
            ('(a + b + c)(1/a + 1/b + 1/c)', "III", '9', 'By Cauchy-Schwarz or AM-HM, product is ≥ 9'),
            ('a/b + b/c + c/a', "I", '3', 'By AM-GM on 3 terms, sum is ≥ 3∛(1) = 3'),
            ('a² + b² + c² given ab + bc + ca = 12', "IV", '12', 'a² + b² + c² ≥ ab + bc + ca = 12 (equality when a = b = c = 2)'),
            ('a³ + b³ + c³ given abc = 8', "II", '24', 'By AM-GM, a³ + b³ + c³ ≥ 3 abc = 3(8) = 24'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        'Match the sum of series in List I with the values in List II for n = 10:',
        [
            ('∑_{k=1}^{10} k(k + 1)(k + 2)', "I", '4290', '10 × 11 × 12 × 13 / 4 = 4290'),
            ('∑_{k=1}^{10} (2k - 1)²', "III", '1330', '4(385) - 4(55) + 10 = 1540 - 220 + 10 = 1330'),
            ('∑_{k=1}^{10} k²(k + 1)', "IV", '3410', '∑ k³ + ∑ k² = 3025 + 385 = 3410'),
            ('∑_{k=1}^{10} (k³ - k)', "II", '2970', '3025 - 55 = 2970'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        'For the recurrence relation a_{n+2} = a_{n+1} + 2a_n with a₁ = 3, a₂ = 3, match List I with List II:',
        [
            ('3rd term (a₃)', "IV", '9', 'a₃ = a₂ + 2a₁ = 3 + 6 = 9'),
            ('4th term (a₄)', "I", '15', 'a₄ = a₃ + 2a₂ = 9 + 6 = 15'),
            ('5th term (a₅)', "III", '33', 'a₅ = a₄ + 2a₃ = 15 + 18 = 33'),
            ('6th term (a₆)', "II", '63', 'a₆ = a₅ + 2a₄ = 33 + 30 = 63'),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        'Match the infinite series in List I with their values in List II:',
        [
            ('∑_{n=1}^∞ arctan(1 / (2n²))', "II", 'π/4', 'arctan(2n+1) - arctan(2n-1) telescopes to π/2 - arctan(1) = π/4'),
            ('∑_{n=1}^∞ 1 / (4n² - 1)', "IV", '1/2', '(1/2) ∑ (1/(2n-1) - 1/(2n+1)) = (1/2)[1] = 1/2'),
            ('∑_{n=1}^∞ 1 / (n(n + 1))', "I", '1', 'Telescopes to 1'),
            ('∑_{n=1}^∞ 1 / (n(n + 2))', "III", '3/4', '(1/2) [1 + 1/2] = 3/4'),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        'Let α = e^{i 2π/7}. Match the expressions involving roots of unity in List I with their values in List II:',
        [
            ('∑_{k=0}^6 α^k = 1 + α + α² + ... + α⁶', "III", '0', 'Sum of all 7th roots of unity is 0'),
            ('∑_{k=1}^6 α^k = α + α² + ... + α⁶', "I", '-1', 'Sum of all non-trivial roots is 0 - 1 = -1'),
            ('∏_{k=1}^6 (1 - α^k)', "IV", '7', 'lim_{x→1} (x⁷ - 1)/(x - 1) = 7'),
            ('∏_{k=1}^6 (2 - α^k)', "II", '127', '(2⁷ - 1)/(2 - 1) = 128 - 1 = 127'),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        'Match the infinite higher-order arithmetic-geometric series in List I with their exact values in List II:',
        [
            ('∑_{k=1}^∞ k² (1/2)^k', "I", '6', '(1/2)(3/2) / (1/8) = (3/4) · 8 = 6'),
            ('∑_{k=1}^∞ k² (1/3)^k', "III", '3/2', '(1/3)(4/3) / (8/27) = (4/9) · (27/8) = 3/2'),
            ('∑_{k=1}^∞ k² (1/4)^k', "IV", '20/27', '(1/4)(5/4) / (27/64) = (5/16) · (64/27) = 20/27'),
            ('∑_{k=1}^∞ k³ (1/2)^k', "II", '26', 'r(1 + 4r + r²) / (1 - r)⁴ = (1/2)(13/4) / (1/16) = (13/8) · 16 = 26'),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        'Match the infinite nested sequences in List I with their limiting values in List II:',
        [
            ('x = √(6 + √(6 + √(6 + ...)))', "IV", '3', 'x = √(6 + x) => x² - x - 6 = 0 => x = 3'),
            ('x = √(12 + √(12 + √(12 + ...)))', "III", '4', 'x = √(12 + x) => x² - x - 12 = 0 => x = 4'),
            ('x = √(2 + √(2 + √(2 + ...)))', "I", '2', 'x = √(2 + x) => x² - x - 2 = 0 => x = 2'),
            ('x = 1 + 1 / (1 + 1 / (1 + 1 / ...)) (Golden Ratio φ)', "II", '(1 + √5)/2', 'x = 1 + 1/x => x² - x - 1 = 0 => x = (1 + √5)/2'),
        ], "D"))

    return qs
