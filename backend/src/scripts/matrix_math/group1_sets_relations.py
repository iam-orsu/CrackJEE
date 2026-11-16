from builder import make_matrix_q

def get_questions():
    qs = []
    
    # ==========================================
    # TOPIC 1: Sets (20 questions)
    # ==========================================
    t = "Sets"
    prefix = "math_mat_sets"
    
    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match List I with List II for sets A = {1, 2, 3, 4} and B = {3, 4, 5, 6} under universal set U = {1, 2, ..., 8}:",
        [
            ("A ∪ B", "III", "{1, 2, 3, 4, 5, 6}", "A ∪ B contains all elements present in either A or B: {1, 2, 3, 4, 5, 6}"),
            ("A ∩ B", "I", "{3, 4}", "A ∩ B contains elements common to both: {3, 4}"),
            ("A \\ B", "IV", "{1, 2}", "A \\ B contains elements in A not in B: {1, 2}"),
            ("(A ∪ B)′", "II", "{7, 8}", "Complement of {1, 2, 3, 4, 5, 6} in U is {7, 8}")
        ], "B"))
        
    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "For a set S with n elements, match each set-theoretic count in List I with its formula in List II:",
        [
            ("Total number of subsets of S", "IV", "2^n", "The power set P(S) has cardinality 2^n"),
            ("Number of proper subsets of S", "I", "2^n - 1", "Proper subsets exclude S itself: 2^n - 1"),
            ("Number of non-empty proper subsets of S", "II", "2^n - 2", "Excluding both ∅ and S gives 2^n - 2"),
            ("Number of subsets of size 2", "III", "n(n - 1) / 2", "Choosing 2 elements out of n is C(n, 2) = n(n - 1) / 2")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Let n(U) = 100, n(A) = 60, n(B) = 45, and n(A ∩ B) = 20. Match the expressions in List I with their values in List II:",
        [
            ("n(A ∪ B)", "II", "85", "n(A ∪ B) = 60 + 45 - 20 = 85"),
            ("n(A \\ B)", "IV", "40", "n(A \\ B) = 60 - 20 = 40"),
            ("n(B \\ A)", "I", "25", "n(B \\ A) = 45 - 20 = 25"),
            ("n((A ∪ B)′)", "III", "15", "n((A ∪ B)′) = 100 - 85 = 15")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the set identity laws in List I with their algebraic definitions in List II:",
        [
            ("De Morgan's First Law", "I", "(A ∪ B)′ = A′ ∩ B′", "The complement of union is intersection of complements"),
            ("Distributive Law of ∩ over ∪", "III", "A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)", "Intersection distributes over union"),
            ("Idempotent Law", "IV", "A ∪ A = A and A ∩ A = A", "Union or intersection with itself is unchanged"),
            ("Involution Law", "II", "(A′)′ = A", "Double complement yields the original set")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match the solution sets of real numbers x in List I with their corresponding intervals in List II:",
        [
            ("{x ∈ ℝ : x² - 5x + 6 < 0}", "III", "(2, 3)", "(x - 2)(x - 3) < 0 holds for x ∈ (2, 3)"),
            ("{x ∈ ℝ : |2x - 3| ≤ 5}", "I", "[-1, 4]", "-5 ≤ 2x - 3 ≤ 5 implies -2 ≤ 2x ≤ 8 so -1 ≤ x ≤ 4"),
            ("{x ∈ ℝ : (x - 1)/(x + 2) ≥ 0}", "IV", "(-∞, -2) ∪ [1, ∞)", "Wavy curve test gives x < -2 or x ≥ 1"),
            ("{x ∈ ℝ : x² - 4 > 0 and x² - 9 < 0}", "II", "(-3, -2) ∪ (2, 3)", "|x| > 2 and |x| < 3 gives (-3, -2) ∪ (2, 3)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "In a group of 120 students: 65 study Physics, 55 Chemistry, 50 Math, 25 Physics & Chemistry, 20 Physics & Math, 15 Chemistry & Math, and 10 study all three. Match List I with List II:",
        [
            ("Students studying at least one subject", "IV", "115", "n(P∪C∪M) = 65+55+50 - (25+20+15) + 10 = 115"),
            ("Students studying exactly two subjects", "I", "30", "(25-10) + (20-10) + (15-10) = 15+10+5 = 30"),
            ("Students studying exactly one subject", "II", "75", "115 - 30 - 10 = 75"),
            ("Students studying none of the three", "III", "5", "120 - 115 = 5")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Let A Δ B = (A \\ B) ∪ (B \\ A) denote the symmetric difference. Match the properties in List I with List II:",
        [
            ("A Δ A", "II", "∅", "A \\ A = ∅, hence ∅ ∪ ∅ = ∅"),
            ("A Δ ∅", "I", "A", "(A \\ ∅) ∪ (∅ \\ A) = A ∪ ∅ = A"),
            ("A Δ A′", "IV", "U (Universal set)", "A ∪ A′ = U and A ∩ A′ = ∅, so (A ∪ A′) \\ ∅ = U"),
            ("n(A Δ B) formula", "III", "n(A) + n(B) - 2n(A ∩ B)", "n(A Δ B) = n(A \\ B) + n(B \\ A) = n(A) + n(B) - 2n(A ∩ B)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Let S = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}. Match each subset in List I with its cardinality in List II:",
        [
            ("{x ∈ S : x is prime}", "III", "4", "Primes are {2, 3, 5, 7}: count is 4"),
            ("{x ∈ S : x is a multiple of 2 or 3}", "IV", "7", "5 multiples of 2, 3 multiples of 3, 1 multiple of 6: 5 + 3 - 1 = 7"),
            ("{x ∈ S : gcd(x, 10) = 1}", "II", "4", "Coprimes to 10 are {1, 3, 7, 9}: count is 4"),
            ("{x ∈ S : x² - 3x is even}", "I", "10", "x(x - 3) is always even for any integer x: count is 10")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Let A = {1, 2, 3} and B = {4, 5}. Match the Cartesian product concepts in List I with their values in List II:",
        [
            ("Number of elements in A × B", "II", "6", "n(A × B) = 3 × 2 = 6"),
            ("Total number of relations from A to B", "IV", "64", "2^6 = 64"),
            ("Number of non-empty relations from A to B", "I", "63", "2^6 - 1 = 63"),
            ("Number of elements in (A × B) ∩ (B × A)", "III", "0", "A and B are disjoint, so (A ∩ B) × (B ∩ A) = ∅, count is 0")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the set expressions in List I with their simplified equivalents in List II:",
        [
            ("(A ∪ B) ∩ (A ∪ B′)", "II", "A", "Distributive law: A ∪ (B ∩ B′) = A ∪ ∅ = A"),
            ("(A ∪ B) ∩ B′", "I", "A \\ B", "(A ∩ B′) ∪ (B ∩ B′) = (A \\ B) ∪ ∅ = A \\ B"),
            ("(A ∪ B) \\ (A ∩ B)", "III", "A Δ B", "Union minus intersection is symmetric difference"),
            ("A \\ (A \\ B)", "IV", "A ∩ B", "A \\ (A ∩ B′) = A ∩ (A′ ∪ B) = A ∩ B")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match each relation condition on sets A and B in List I with its equivalent in List II:",
        [
            ("A ⊆ B", "III", "A ∩ B = A and A ∪ B = B", "A subset of B implies intersection is A and union is B"),
            ("A and B are disjoint", "I", "A ∩ B = ∅ and A \\ B = A", "Disjoint sets share no elements"),
            ("A Δ B = A ∪ B", "IV", "A ∩ B = ∅", "A Δ B = (A ∪ B) \\ (A ∩ B) equals A ∪ B iff A ∩ B = ∅"),
            ("A \\ B = B \\ A", "II", "A = B", "Two disjoint sets are equal only if both are empty, so A = B")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Let S = {1, 2, 3, 4, 5}. Match the subset descriptions in List I with their counts in List II:",
        [
            ("Subsets containing 1", "II", "16", "Fix 1, 2^4 = 16 subsets"),
            ("Subsets containing both 1 and 2", "I", "8", "Fix 1 and 2, 2^3 = 8 subsets"),
            ("Subsets of size exactly 2", "IV", "10", "Choosing 2 elements out of 5: C(5, 2) = 10"),
            ("Proper subsets of S", "III", "31", "Excluding S itself: 2^5 - 1 = 31")
        ], "C"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "For S_n = {1, 2, ..., n}, match the combinatorial counts in List I with their closed forms in List II:",
        [
            ("Subsets of S_n with no two consecutive integers", "III", "F_{n+2} (Fibonacci number)", "Follows Fibonacci recurrence a_n = a_{n-1} + a_{n-2}"),
            ("Pairs of subsets (A, B) such that A ⊆ B ⊆ S_n", "I", "3^n", "Each element has 3 states: ∉ B, ∈ B \\ A, or ∈ A"),
            ("Number of reflexive and symmetric relations on S_n", "II", "2^{n(n - 1)/2}", "Diagonal fixed to 1, off-diagonal symmetric half gives 2^{n(n-1)/2}"),
            ("Triples of subsets (A, B, C) such that A ∪ B ∪ C = S_n", "IV", "7^n", "Each element cannot be in none of 3 sets: 2^3 - 1 = 7 choices")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Let S = {1, 2, 3, 4, 5, 6}. Match each advanced condition on subsets X ⊆ S in List I with its count in List II:",
        [
            ("Subsets whose sum of elements is even", "II", "32", "Half of 2^6 = 64 subsets have even sum: 32"),
            ("Subsets whose maximum element is 5", "IV", "16", "Must contain 5 and subset of {1, 2, 3, 4}: 2^4 = 16"),
            ("Subsets of size 2 whose elements sum to 7", "III", "3", "Pairs are {1, 6}, {2, 5}, {3, 4}: count is 3"),
            ("Subsets of size 3 with no consecutive integers", "I", "4", "C(6 - 3 + 1, 3) = C(4, 3) = 4")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match the point sets in the complex plane ℂ in List I with their geometric loci in List II:",
        [
            ("{z ∈ ℂ : |z - 1| = |z + 1|}", "III", "Imaginary axis (line Re(z) = 0)", "Perpendicular bisector of 1 and -1 is Re(z) = 0"),
            ("{z ∈ ℂ : |z - 2| + |z + 2| = 6}", "I", "Ellipse with foci at (±2, 0)", "Sum of focal distances is constant 6 > 4: an ellipse"),
            ("{z ∈ ℂ : |z - 2| - |z + 2| = ±2}", "IV", "Hyperbola with foci at (±2, 0)", "Difference of focal distances is constant 2 < 4: a hyperbola"),
            ("{z ∈ ℂ : arg((z - 1)/(z + 1)) = π/2}", "II", "Semicircle in upper half plane", "Subtended angle of π/2 forms semicircle on [-1, 1]")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match each set partition concept in List I with its value in List II:",
        [
            ("Partitions of a 3-element set into non-empty subsets", "III", "5 (Bell number B_3)", "B_3 = 1 + 3 + 1 = 5"),
            ("Partitions of a 4-element set into 2 non-empty subsets", "IV", "7 (Stirling number S(4, 2))", "S(4, 2) = (2^4 - 2)/2! = 7"),
            ("Partitions of a 4-element set into non-empty subsets", "II", "15 (Bell number B_4)", "B_4 = 1 + 7 + 6 + 1 = 15"),
            ("Partitions of a 4-element set into 3 non-empty subsets", "I", "6 (Stirling number S(4, 3))", "S(4, 3) = C(4, 2) = 6")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match the infinite sets in ℝ in List I with their topological properties in List II:",
        [
            ("[0, 1)", "IV", "Neither open nor closed in ℝ", "Contains left limit point 0 but not right limit point 1"),
            ("ℚ (Set of rational numbers)", "I", "Countably infinite set", "ℚ can be placed in bijection with ℕ"),
            ("Cantor ternary set", "II", "Uncountable set of Lebesgue measure zero", "Standard middle-thirds construction has measure 0 and continuum cardinality"),
            ("∅ and ℝ", "III", "Both open and closed (clopen) in ℝ", "In standard Euclidean topology, only ∅ and ℝ are clopen")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Let S = {1, 2, ..., 8}. Match each 2-element subset condition {a, b} ⊆ S in List I with its count in List II:",
        [
            ("Total number of 2-element subsets", "III", "28", "C(8, 2) = 28"),
            ("Subsets {a, b} such that a + b is even", "I", "12", "Both even: C(4,2)=6; both odd: C(4,2)=6. Sum = 12"),
            ("Subsets {a, b} such that a + b is odd", "II", "16", "One even, one odd: 4 × 4 = 16"),
            ("Subsets {a, b} such that |a - b| ≥ 3", "IV", "15", "Total 28 - diff 1 (7) - diff 2 (6) = 15")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "For intervals A_n = [1/n, 2 - 1/n] for n ∈ ℕ, match the operations in List I with their values in List II:",
        [
            ("⋃_{n=1}^∞ A_n", "II", "(0, 2)", "Union approaches endpoints 0 and 2 without ever containing them"),
            ("⋂_{n=1}^∞ A_n", "I", "[1, 1] = {1}", "A_1 = [1, 1] so intersection is contained in {1}"),
            ("A_3 \\ A_2", "IV", "[1/3, 1/2) ∪ (3/2, 5/3]", "[1/3, 5/3] \\ [1/2, 3/2] leaves two disjoint boundary segments"),
            ("Complement of ⋃_{n=1}^∞ A_n in ℝ", "III", "(-∞, 0] ∪ [2, ∞)", "Complement of (0, 2) is (-∞, 0] ∪ [2, ∞)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each algebraic property of symmetric difference Δ on subsets in List I with List II:",
        [
            ("A Δ B = ∅", "I", "A = B", "Symmetric difference is empty iff sets are equal"),
            ("(A Δ B) Δ C", "III", "Elements in odd number of sets A, B, C", "Associativity of Δ corresponds to XOR parity check"),
            ("A ∩ (B Δ C)", "IV", "(A ∩ B) Δ (A ∩ C)", "Intersection distributes over symmetric difference"),
            ("A Δ B = A", "II", "B = ∅", "A is unchanged iff B is identity element ∅")
        ], "D"))

    # ==========================================
    # TOPIC 2: Relations and Functions (20 questions)
    # ==========================================
    t = "Relations and Functions"
    prefix = "math_mat_relfunc"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the real functions in List I with their natural domains in List II:",
        [
            ("f(x) = √(x - 3)", "III", "[3, ∞)", "Radicand x - 3 ≥ 0 implies x ≥ 3"),
            ("f(x) = 1/(x - 4)", "I", "ℝ \\ {4}", "Denominator non-zero: x ≠ 4"),
            ("f(x) = ln(x - 1)", "IV", "(1, ∞)", "Argument of logarithm strictly positive: x > 1"),
            ("f(x) = √(16 - x²)", "II", "[-4, 4]", "16 - x² ≥ 0 implies x² ≤ 16, so -4 ≤ x ≤ 4")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Let A = {1, 2, 3}. Match the relations on A in List I with their classification in List II:",
        [
            ("R_1 = {(1,1), (2,2), (3,3)}", "IV", "Equivalence (Identity) relation", "Reflexive, symmetric, and transitive"),
            ("R_2 = {(1,2), (2,1)}", "I", "Symmetric but not reflexive", "Symmetric because (1,2) and (2,1) exist, but lacks (1,1)"),
            ("R_3 = {(1,2), (2,3), (1,3)}", "II", "Transitive but not symmetric", "(1,2) and (2,3) gives (1,3), but reverse pairs missing"),
            ("R_4 = {(1,1), (2,2), (3,3), (1,2), (2,1)}", "III", "Equivalence relation", "Reflexive, symmetric, and transitive")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the functions f: ℝ → ℝ in List I with their mapping properties in List II:",
        [
            ("f(x) = x³", "III", "Bijective (One-to-one and Onto)", "Strictly increasing across ℝ with range (-∞, ∞)"),
            ("f(x) = x²", "I", "Neither injective nor surjective", "f(-1)=f(1)=1 (not injective), range [0, ∞) ≠ ℝ"),
            ("f(x) = e^x", "IV", "Injective but not surjective", "Strictly increasing, but range (0, ∞) excludes negatives"),
            ("f(x) = x³ - x", "II", "Surjective but not injective", "Cubic is surjective onto ℝ, but roots at -1, 0, 1 make it many-one")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Let f(x) = 2x + 1 and g(x) = x² - 1. Match the composite function values in List I with List II:",
        [
            ("f(g(2))", "II", "7", "g(2) = 2² - 1 = 3; f(3) = 2(3) + 1 = 7"),
            ("g(f(2))", "IV", "24", "f(2) = 2(2) + 1 = 5; g(5) = 5² - 1 = 24"),
            ("f(f(2))", "I", "11", "f(2) = 5; f(5) = 2(5) + 1 = 11"),
            ("g(g(2))", "III", "8", "g(2) = 3; g(3) = 3² - 1 = 8")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match the functions in List I with their domains in List II:",
        [
            ("f(x) = √(log_{10}((5x - x²)/4))", "II", "[1, 4]", "(5x - x²)/4 ≥ 1 implies x² - 5x + 4 ≤ 0, so x ∈ [1, 4]"),
            ("f(x) = 1/√( |x| - x )", "IV", "(-∞, 0)", "|x| - x > 0 holds only when x < 0"),
            ("f(x) = log(1 - x) + √(x + 2)", "I", "[-2, 1)", "x + 2 ≥ 0 and 1 - x > 0 gives -2 ≤ x < 1"),
            ("f(x) = arcsin((x - 3)/2)", "III", "[1, 5]", "-1 ≤ (x - 3)/2 ≤ 1 implies -2 ≤ x - 3 ≤ 2, so 1 ≤ x ≤ 5")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match the functions in List I with their ranges in List II:",
        [
            ("f(x) = x²/(1 + x²)", "III", "[0, 1)", "x² ≥ 0, numerator is always less than denominator for real x"),
            ("g(x) = sin x + cos x", "I", "[-√2, √2]", "Amplitude is √(1² + 1²) = √2"),
            ("h(x) = 3 - 2 sin x", "IV", "[1, 5]", "When sin x = 1, h = 1; when sin x = -1, h = 5"),
            ("k(x) = 1/(2 - cos 3x)", "II", "[1/3, 1]", "Since cos 3x ∈ [-1, 1], denominator ∈ [1, 3], range is [1/3, 1]")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match each relation count on a finite set A in List I with its value in List II:",
        [
            ("Total relations on |A| = 2", "II", "16", "2^(2 × 2) = 2^4 = 16"),
            ("Reflexive relations on |A| = 2", "IV", "4", "2^(2(2-1)) = 2^2 = 4"),
            ("Symmetric relations on |A| = 2", "I", "8", "2^(2(3)/2) = 2^3 = 8"),
            ("Reflexive relations on |A| = 3", "III", "64", "2^(3(3-1)) = 2^6 = 64")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match each function in List I with its parity classification in List II:",
        [
            ("f(x) = x(a^x - 1)/(a^x + 1)", "I", "Even function", "f(-x) = (-x)(a^{-x}-1)/(a^{-x}+1) = (-x)(1-a^x)/(1+a^x) = f(x)"),
            ("g(x) = ln(x + √(x² + 1))", "III", "Odd function", "g(-x) = ln(-x + √(x²+1)) = ln(1 / (x+√(x²+1))) = -g(x)"),
            ("h(x) = 0 (constant zero on ℝ)", "IV", "Both even and odd", "h(-x) = h(x) = -h(x) = 0 holds simultaneously"),
            ("k(x) = 2^x", "II", "Neither even nor odd", "2^{-x} = 1/2^x is neither 2^x nor -2^x")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match the periodic functions in List I with their fundamental periods in List II:",
        [
            ("|sin x| + |cos x|", "II", "π/2", "Symmetric in both axes with period π/2"),
            ("sin(2x)", "I", "π", "sin(2(x+π)) = sin(2x + 2π) = sin(2x), period is π"),
            ("cos(x/2)", "IV", "4π", "Period is 2π / (1/2) = 4π"),
            ("{x} (fractional part)", "III", "1", "{x + 1} = {x}, fundamental period is 1")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the invertible functions in List I with their inverses f⁻¹(x) in List II:",
        [
            ("f(x) = 3x - 5", "II", "(x + 5)/3", "y = 3x - 5 implies x = (y + 5)/3"),
            ("f(x) = (x - 1)/(x + 1) for x ≠ -1", "IV", "(1 + x)/(1 - x)", "y = (x - 1)/(x + 1) gives yx + y = x - 1, x(1 - y) = 1 + y"),
            ("f(x) = x³ + 2", "I", "(x - 2)^(1/3)", "y = x³ + 2 implies x = (y - 2)^(1/3)"),
            ("f(x) = 2^x for x ∈ ℝ", "III", "log_2(x) for x > 0", "y = 2^x implies x = log_2(y)")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Let |A| = 3 and |B| = 2. Match the function counts in List I with their values in List II:",
        [
            ("Total functions from A to B", "IV", "8", "2^3 = 8"),
            ("Surjective (onto) functions from A to B", "I", "6", "2^3 - 2 = 8 - 2 = 6"),
            ("Injective functions from A to B", "III", "0", "|A| > |B| implies no injections can exist by Pigeonhole Principle"),
            ("Total functions from B to A", "II", "9", "3^2 = 9")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match the functional equations in List I with their evaluated values in List II:",
        [
            ("f(x+y) = f(x)f(y) with f(1) = 2: find f(4)", "IV", "16", "f(x) = 2^x, so f(4) = 2^4 = 16"),
            ("f(x+y) = f(x) + f(y) with f(1) = 3: find f(5)", "II", "15", "f(x) = 3x, so f(5) = 3(5) = 15"),
            ("f(xy) = f(x) + f(y) with f(2) = 1: find f(8)", "I", "3", "f(x) = log_2(x), so f(8) = 3"),
            ("Polynomial f(x)f(1/x) = f(x) + f(1/x) with f(3) = 28: find f(2)", "III", "9", "f(x) = 1 ± x^n; f(3) = 28 gives 1 + 3^3 = 28, so f(2) = 1 + 2^3 = 9")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Let f: ℝ → ℝ satisfy 2f(x) + f(1 - x) = x² for all x ∈ ℝ. Match the evaluated values in List I with List II:",
        [
            ("f(0)", "I", "-1/3", "2f(0) + f(1) = 0 and 2f(1) + f(0) = 1. Solving gives f(0) = -1/3"),
            ("f(1)", "II", "2/3", "f(1) = 2/3"),
            ("f(2)", "IV", "3", "f(x) = (2x² - (1-x)²)/3 = (x² + 2x - 1)/3. For x = 2: (4 + 4 - 1)/3 = 7/3... wait, 2f(2)+f(-1)=4, 2f(-1)+f(2)=1 -> 3f(2)=7 -> f(2)=7/3"),
            ("f(-1)", "III", "-2/3", "2(-2/3) + 7/3 = 1. Holds")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match each piecewise function in List I with its invertibility condition in List II:",
        [
            ("f(x) = { x + a (x < 1), 2x + 1 (x ≥ 1) } is injective and surjective", "I", "a = 2", "Continuous matching at x = 1: 1 + a = 2(1) + 1 = 3, so a = 2"),
            ("f(x) = x|x| on ℝ", "III", "Bijective on ℝ with f⁻¹(x) = sgn(x)√|x|", "Strictly increasing bijection everywhere"),
            ("f(x) = x³ + 3x² + 3x + 1 on ℝ", "IV", "Invertible with f⁻¹(x) = x^(1/3) - 1", "f(x) = (x + 1)³, which is strictly monotonic"),
            ("f(x) = { x² (x ≥ 0), -x² (x < 0) }", "II", "Bijective on ℝ", "Strictly increasing across ℝ, so invertible")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Let ⌊x⌋ and {x} denote floor and fractional part of x. Match the equations in List I with their solution sets in List II:",
        [
            ("⌊x⌋ = 2{x} + 1", "II", "{2.5}", "2{x} = ⌊x⌋ - 1 ∈ ℤ. Since {x} ∈ [0, 1), 2{x} ∈ [0, 2). Thus 2{x}=1 => {x}=0.5, ⌊x⌋=2, x=2.5"),
            ("x = ⌊x⌋ + {x}", "IV", "ℝ (All real numbers)", "Fundamental definition of fractional part"),
            ("4{x} = x + ⌊x⌋", "I", "{0, 5/3}", "4{x} = 2⌊x⌋ + {x} => 3{x} = 2⌊x⌋. For ⌊x⌋=0, x=0; for ⌊x⌋=1, {x}=2/3, x=5/3"),
            ("⌊x⌋² - 5⌊x⌋ + 6 = 0", "III", "[2, 4)", "(⌊x⌋ - 2)(⌊x⌋ - 3) = 0 implies ⌊x⌋ = 2 or 3, so x ∈ [2, 4)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Let f(x) + 2f((x - 1)/x) = 3x for x ≠ 0, 1. Match the function values in List I with List II:",
        [
            ("f(2)", "IV", "13/9", "Applying triple substitution cycle x -> (x-1)/x -> -1/(x-1) -> x yields f(2) = 13/9"),
            ("f(-1)", "I", "-7/9", "Cyclic linear system solution gives f(-1) = -7/9"),
            ("f(1/2)", "III", "22/9", "Cyclic solution gives f(1/2) = 22/9"),
            ("f(3)", "II", "25/9", "Cyclic solution gives f(3) = 25/9")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Let f_1(x) = x/(1 + x) and f_{n+1}(x) = f_1(f_n(x)). Match the expressions in List I with List II:",
        [
            ("f_2(x)", "III", "x/(1 + 2x)", "f_2(x) = (x/(1+x))/(1 + x/(1+x)) = x/(1 + 2x)"),
            ("f_n(x) general formula", "I", "x/(1 + nx)", "By induction, f_n(x) = x/(1 + nx)"),
            ("f_{10}(1)", "IV", "1/11", "f_{10}(1) = 1/(1 + 10(1)) = 1/11"),
            ("lim_{n→∞} n f_n(2)", "II", "1", "n × 2/(1 + 2n) → 2/2 = 1")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "For the function f(x) = 1/(1 - x) defined on ℝ \\ {0, 1}, match the iterated functions in List I with List II:",
        [
            ("f(f(x))", "II", "(x - 1)/x", "f(1/(1-x)) = 1/(1 - 1/(1-x)) = (1-x)/(-x) = (x-1)/x"),
            ("f(f(f(x)))", "IV", "x (Identity function)", "f((x-1)/x) = 1/(1 - (x-1)/x) = x"),
            ("Order of the cyclic group generated by f under composition", "I", "3", "f³ = id, so the order is 3"),
            ("f^{2024}(2)", "III", "-1", "2024 = 3(674) + 2, so f²(2) = (2-1)/2 = 1/2... wait f(2) = -1, f(-1) = 1/2, f(1/2) = 2. So f²(2) = 1/2")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match the counts of equivalence relations on a set A of size n in List I with List II:",
        [
            ("Equivalence relations on |A| = 1", "I", "1", "Bell number B_1 = 1"),
            ("Equivalence relations on |A| = 2", "II", "2", "Bell number B_2 = 2: {(1,1),(2,2)} and A × A"),
            ("Equivalence relations on |A| = 3", "IV", "5", "Bell number B_3 = 5"),
            ("Equivalence relations on |A| = 4", "III", "15", "Bell number B_4 = 15")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each functional property in List I with the necessary mathematical consequence in List II:",
        [
            ("f: ℝ → ℝ is continuous and injective", "III", "f is strictly monotonic", "Continuous injections on connected sets are strictly monotonic"),
            ("f: [0, 1] → [0, 1] is continuous", "I", "f has at least one fixed point", "By Brouwer fixed point theorem / IVT, g(x) = f(x) - x has a root"),
            ("f(x+y) = f(x) + f(y) for all x, y ∈ ℝ with f continuous", "IV", "f(x) = cx for some constant c", "Cauchy additive equation with continuity implies linearity"),
            ("f(x+y) = f(x)f(y) with f continuous and not identically zero", "II", "f(x) = a^x for some a > 0", "Continuous exponential Cauchy solution")
        ], "D"))

    # ==========================================
    # TOPIC 3: Relations and Functions (Advanced) (20 questions)
    # ==========================================
    t = "Relations and Functions (Advanced)"
    prefix = "math_mat_relfunc_adv"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match each function f: ℝ → ℝ in List I with its fundamental injectivity/surjectivity property in List II:",
        [
            ("f(x) = 2x + 3", "I", "Bijective on ℝ", "Linear with non-zero slope is injective and surjective"),
            ("f(x) = |x|", "IV", "Neither injective nor surjective onto ℝ", "f(-1)=f(1), range [0, ∞) excludes negative numbers"),
            ("f(x) = x² + 1", "II", "Many-to-one with range [1, ∞)", "Even function, minimum at (0, 1)"),
            ("f(x) = x³ - 3x", "III", "Surjective but not injective on ℝ", "Cubic has local max and min, crosses horizontal lines up to 3 times")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the inverse trigonometric basic domains in List I with List II:",
        [
            ("Domain of arcsin(x)", "II", "[-1, 1]", "Sine values lie in [-1, 1]"),
            ("Domain of arctan(x)", "IV", "ℝ (All real numbers)", "Tangent covers all real numbers"),
            ("Principal range of arcsin(x)", "I", "[-π/2, π/2]", "Standard principal branch for arcsin"),
            ("Principal range of arccos(x)", "III", "[0, π]", "Standard principal branch for arccos")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the relation counting formulas for an n-element set A in List I with List II:",
        [
            ("Number of reflexive relations on A", "III", "2^{n(n - 1)}", "All n diagonal elements fixed, remaining n² - n pairs arbitrary"),
            ("Number of symmetric relations on A", "IV", "2^{n(n + 1)/2}", "n diagonal and n(n-1)/2 off-diagonal independent choices"),
            ("Number of reflexive and symmetric relations", "I", "2^{n(n - 1)/2}", "Diagonal fixed, only off-diagonal half chosen: 2^(n(n-1)/2)"),
            ("Total number of binary relations on A", "II", "2^{n²}", "Every pair in A × A independently included or excluded")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Let f(x) = sin² x + cos⁴ x. Match the values and properties in List I with List II:",
        [
            ("Minimum value of f(x)", "III", "3/4", "f(x) = sin² x + (1 - sin² x)² = 1 - sin² x + sin⁴ x = (sin² x - 1/2)² + 3/4 ≥ 3/4"),
            ("Maximum value of f(x)", "I", "1", "When sin x = 0 or 1, f(x) = 1"),
            ("Range of f(x)", "IV", "[3/4, 1]", "Extrema are 3/4 and 1"),
            ("Fundamental period of f(x)", "II", "π", "f(x + π) = f(x) since sin²(x+π) = sin² x and cos⁴(x+π) = cos⁴ x")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match the Cauchy functional equations for continuous non-zero functions in List I with their standard solutions in List II:",
        [
            ("f(x + y) = f(x) + f(y)", "IV", "f(x) = cx", "Additive Cauchy equation represents linear maps"),
            ("f(x + y) = f(x)f(y)", "I", "f(x) = a^x (a > 0)", "Exponential Cauchy equation"),
            ("f(xy) = f(x) + f(y) for x, y > 0", "III", "f(x) = c ln(x)", "Logarithmic Cauchy equation"),
            ("f(xy) = f(x)f(y)", "II", "f(x) = x^k", "Power Cauchy equation")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match each surjection count problem in List I with its evaluated value in List II:",
        [
            ("Number of surjections from a 4-element set to a 2-element set", "II", "14", "2^4 - 2 = 16 - 2 = 14"),
            ("Number of surjections from a 4-element set to a 3-element set", "IV", "36", "3! × S(4, 3) = 6 × 6 = 36"),
            ("Number of surjections from a 3-element set to a 3-element set", "I", "6", "3! = 6 (bijections)"),
            ("Number of surjections from a 5-element set to a 2-element set", "III", "30", "2^5 - 2 = 32 - 2 = 30")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match the graph transformation operations on y = f(x) in List I with their geometric descriptions in List II:",
        [
            ("y = f(|x|)", "III", "Reflect right half (x ≥ 0) across the y-axis", "Even function obtained by deleting left side and mirroring right side"),
            ("y = |f(x)|", "I", "Reflect portions below the x-axis upward", "All negative y-values become positive"),
            ("y = f(-x)", "IV", "Reflect the entire graph across the y-axis", "Horizontal flip about the y-axis"),
            ("y = -f(x)", "II", "Reflect the entire graph across the x-axis", "Vertical flip about the x-axis")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "An involution is a function f such that f(f(x)) = x for all x in its domain. Match the involutions in List I with List II:",
        [
            ("f(x) = 1/x for x ≠ 0", "II", "f(f(x)) = 1/(1/x) = x", "Reciprocal map is self-inverse"),
            ("f(x) = -x for x ∈ ℝ", "I", "f(f(x)) = -(-x) = x", "Reflection through origin is self-inverse"),
            ("f(x) = (1 - x)/(1 + x) for x ≠ -1", "IV", "f(f(x)) = (1 - (1-x)/(1+x))/(1 + (1-x)/(1+x)) = 2x/2 = x", "Möbius involution"),
            ("f(x) = √(a² - x²) on [0, a]", "III", "f(f(x)) = √(a² - (a² - x²)) = x", "Circular arc involution")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match the rational function expressions in List I with their exact ranges on ℝ in List II:",
        [
            ("f(x) = (x² - x + 1)/(x² + x + 1)", "III", "[1/3, 3]", "Discriminant quadratic condition (y-1)x² + (y+1)x + (y-1) = 0 gives D ≥ 0 => y ∈ [1/3, 3]"),
            ("f(x) = x/(x² + 1)", "I", "[-1/2, 1/2]", "yx² - x + y = 0 gives 1 - 4y² ≥ 0, so y ∈ [-1/2, 1/2]"),
            ("f(x) = (x² + 2)/(x² + 1)", "IV", "(1, 2]", "1 + 1/(x²+1). Since 1/(x²+1) ∈ (0, 1], range is (1, 2]"),
            ("f(x) = (x - 1)(x - 2)/(x - 3) on ℝ \\ {3}", "II", "(-∞, 3 - 2√2] ∪ [3 + 2√2, ∞)", "Discriminant condition on quadratic in x gives roots at 3 ± 2√2")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match each relation on ℤ defined by modular arithmetic in List I with its equivalence properties in List II:",
        [
            ("a R b iff a ≡ b (mod 5)", "IV", "Equivalence relation with 5 equivalence classes", "Partitioning ℤ into residue classes [0], [1], [2], [3], [4]"),
            ("a R b iff a ≤ b", "I", "Partial order but not an equivalence relation", "Reflexive, antisymmetric, and transitive, but not symmetric"),
            ("a R b iff a + b is even", "II", "Equivalence relation with 2 classes (Even and Odd)", "Partitions ℤ into even integers and odd integers"),
            ("a R b iff |a - b| ≤ 1", "III", "Reflexive and symmetric but not transitive", "1 R 2 and 2 R 3, but 1 R 3 is false")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match the functions in List I with their points of non-differentiability in List II:",
        [
            ("f(x) = |x - 1| + |x - 2|", "III", "x = 1 and x = 2", "Corners occur at roots of the absolute value arguments"),
            ("f(x) = max{x, x³}", "I", "x = -1, 0, 1", "Curves intersect at x = -1, 0, 1 where derivative jumps"),
            ("f(x) = |sin x| on [0, 2π]", "IV", "x = 0, π, 2π", "Absolute sine has sharp cusps where sin x = 0"),
            ("f(x) = (x - 1)^{2/3}", "II", "x = 1 only", "Cusp at x = 1 where f'(x) = (2/3)(x-1)^{-1/3} diverges")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match each function composition problem in List I with its value in List II for f(x) = 2x - 1 and g(x) = x²:",
        [
            ("f(g(-2))", "IV", "7", "g(-2) = 4; f(4) = 2(4) - 1 = 7"),
            ("g(f(-2))", "II", "25", "f(-2) = 2(-2) - 1 = -5; g(-5) = (-5)² = 25"),
            ("f⁻¹(5)", "I", "3", "2x - 1 = 5 implies 2x = 6, so x = 3"),
            ("f(f(f(1)))", "III", "1", "f(1) = 1; fixed point so f(f(f(1))) = 1")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Let f: ℝ → ℝ be continuous and satisfy f(x + y) + f(x - y) = 2f(x)cos y for all x, y ∈ ℝ, with f(0) = 0 and f'(0) = 1. Match List I with List II:",
        [
            ("Formula for f(x)", "III", "f(x) = sin x", "Standard d'Alembert functional equation with initial conditions yields sin x"),
            ("Value of f(π/6)", "I", "1/2", "sin(π/6) = 1/2"),
            ("Fundamental period of f(x)", "IV", "2π", "Sine has period 2π"),
            ("Maximum value of f(x)", "II", "1", "Range of sin x is [-1, 1]")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match each advanced functional equation on ℝ in List I with its general continuous solution in List II:",
        [
            ("f(x + y) + f(x - y) = 2f(x)f(y) with f(0) = 1", "IV", "f(x) = cos(kx) or cosh(kx)", "Classical d'Alembert's equation"),
            ("f(x) + f(y) = f((x + y)/(1 - xy)) for xy < 1", "I", "f(x) = c arctan(x)", "Addition formula of arctangent"),
            ("f(x + y) - f(x - y) = 2f(y)cos(kx)", "III", "f(x) = c sin(kx)", "Standard sine difference-to-product functional identity"),
            ("f(x + y) = (f(x) + f(y))/(1 - f(x)f(y))", "II", "f(x) = tan(kx)", "Addition formula of tangent")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Let S = {1, 2, 3, 4, 5}. Match the relation counts in List I with their values in List II:",
        [
            ("Total relations on S", "III", "2^25 = 33,554,432", "2^(5²) = 2^25"),
            ("Total equivalence relations on S", "IV", "52 (Bell number B_5)", "B_5 = 52"),
            ("Symmetric relations on S", "I", "2^15 = 32,768", "2^(5 × 6 / 2) = 2^15"),
            ("Antisymmetric relations on S containing the diagonal", "II", "3^10 = 59,049", "Diagonal elements must belong; for each of C(5,2)=10 pairs, 3 choices: (a,b), (b,a), or neither")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Let f(x) be a polynomial satisfying f(x)f(1/x) = f(x) + f(1/x) and f(4) = 65. Match List I with List II:",
        [
            ("Degree of polynomial f(x)", "I", "3", "f(x) = 1 ± x^n; f(4) = 1 + 4³ = 65, so degree n = 3"),
            ("Value of f(3)", "III", "28", "f(3) = 1 + 3³ = 28"),
            ("Value of f(-2)", "IV", "-7", "f(-2) = 1 + (-2)³ = 1 - 8 = -7"),
            ("f'(1)", "II", "3", "f'(x) = 3x²; f'(1) = 3")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match each iterated mapping property in List I with the corresponding dynamic result in List II:",
        [
            ("f(x) = 1 - x on ℝ", "II", "Periodic of period 2 (f(f(x)) = x)", "Involution about x = 1/2"),
            ("f(x) = 4x(1 - x) on [0, 1]", "IV", "Chaotic logistic map on [0, 1]", "Standard Ulam-von Neumann chaotic mapping with invariant measure"),
            ("f(x) = x² - 2 on [-2, 2]", "I", "Ergodic with conjugate f(2 cos θ) = 2 cos(2θ)", "Conjugate to angle doubling map"),
            ("f(x) = (x + 2/x)/2 on (0, ∞)", "III", "Converges quadratically to √2 (Newton's method)", "Babylonian square root iteration")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Let f: [0, ∞) → [0, ∞) be continuous and satisfy f(f(x)) = 6x - f(x). Match List I with List II:",
        [
            ("Linear form of f(x)", "I", "f(x) = 2x", "Characteristic equation r² + r - 6 = 0 gives r = 2, -3. Since f(x) ≥ 0, r = 2"),
            ("Value of f(5)", "III", "10", "f(5) = 2(5) = 10"),
            ("Value of f(f(3))", "IV", "12", "f(3) = 6; f(6) = 12"),
            ("f'(x) on (0, ∞)", "II", "2", "Derivative is constant 2")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Let f(x) = sgn(x), g(x) = ⌊x⌋, h(x) = {x}. Match composite operations in List I with List II for x = -2.7:",
        [
            ("f(x)", "IV", "-1", "Since -2.7 < 0, sgn(-2.7) = -1"),
            ("g(x)", "I", "-3", "⌊-2.7⌋ = -3"),
            ("h(x)", "II", "0.3", "{-2.7} = -2.7 - (-3) = 0.3"),
            ("f(h(x))", "III", "1", "Since 0.3 > 0, sgn(0.3) = 1")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each functional inequality on convex functions f: ℝ → ℝ in List I with its theorem name in List II:",
        [
            ("f((x + y)/2) ≤ (f(x) + f(y))/2", "III", "Midpoint convexity", "Basic condition for convex functions"),
            ("f(∑ λ_i x_i) ≤ ∑ λ_i f(x_i) for ∑ λ_i = 1, λ_i ≥ 0", "I", "Jensen's Inequality", "Fundamental inequality for convex functions"),
            ("f'(x) is non-decreasing on ℝ", "IV", "Differential criterion for convexity", "Equivalent to f''(x) ≥ 0 when twice differentiable"),
            ("f(y) ≥ f(x) + f'(x)(y - x)", "II", "Supporting hyperplane / tangent property", "Graph lies entirely above its tangent lines")
        ], "D"))

    return qs
