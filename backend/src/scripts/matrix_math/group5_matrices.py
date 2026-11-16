from builder import make_matrix_q

def get_questions():
    qs = []
    
    # ==========================================
    # TOPIC 1: Matrices (20 questions)
    # ==========================================
    t = "Matrices"
    prefix = "math_mat_matrices"
    
    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the types of square matrices in List I with their defining algebraic conditions in List II (where I is the identity matrix and O is the null matrix):",
        [
            ("Idempotent matrix", "II", "A² = A", "A matrix A is idempotent if multiplying it by itself yields A, so A² = A"),
            ("Involutory matrix", "I", "A² = I", "A matrix A is involutory if its square is the identity matrix, so A² = I"),
            ("Nilpotent matrix of index k", "IV", "A^k = O with A^(k-1) ≠ O", "A matrix is nilpotent of index k if A^k = O and no lower power vanishes"),
            ("Orthogonal matrix", "III", "A^T A = I", "A real square matrix is orthogonal if A^T A = A A^T = I")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "For the 2×2 matrix A = [[2, 3], [1, 4]], match the matrix quantities in List I with their numerical values in List II:",
        [
            ("Trace tr(A)", "II", "6", "tr(A) = 2 + 4 = 6"),
            ("Determinant det(A)", "I", "5", "det(A) = (2)(4) - (3)(1) = 8 - 3 = 5"),
            ("Determinant det(2A)", "III", "20", "For a 2×2 matrix, det(2A) = 2² det(A) = 4 × 5 = 20"),
            ("Determinant det(A⁻¹)", "IV", "1/5", "det(A⁻¹) = 1 / det(A) = 1/5")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "For any real square matrix A, match each expression or property in List I with its correct classification in List II:",
        [
            ("The matrix A + A^T is always", "II", "Symmetric", "(A + A^T)^T = A^T + A = A + A^T, hence symmetric"),
            ("The matrix A - A^T is always", "I", "Skew-symmetric", "(A - A^T)^T = A^T - A = -(A - A^T), hence skew-symmetric"),
            ("The matrix (A^T)^T is", "IV", "Equal to matrix A", "The transpose of the transpose of any matrix A is A itself"),
            ("All diagonal entries of a real skew-symmetric matrix are", "III", "All equal to 0", "For a skew-symmetric matrix, a_ii = -a_ii implies 2a_ii = 0, so a_ii = 0")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the matrix transpose and trace properties in List I with their identities in List II (where A and B are conformal square matrices and k is a scalar):",
        [
            ("(A B)^T", "I", "B^T A^T", "By the reversal law of transpose, (AB)^T = B^T A^T"),
            ("(A + B)^T", "III", "A^T + B^T", "Transpose distributes linearly over matrix addition"),
            ("(k A)^T", "IV", "k A^T", "Scalars pull out unchanged under transpose"),
            ("tr(A B)", "II", "tr(B A)", "The trace is cyclic: tr(AB) = tr(BA)")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Let A = [[3, 1], [5, 2]]. Match the matrix expressions in List I with their values in List II:",
        [
            ("det(adj(A))", "III", "1", "det(adj A) = det(A)^(2-1) = 1¹ = 1"),
            ("Element in 1st row, 2nd column of A⁻¹", "I", "-1", "A⁻¹ = [[2, -1], [-5, 3]], so the (1,2) entry is -1"),
            ("Element in 2nd row, 1st column of adj(A)", "IV", "-5", "adj(A) = [[2, -1], [-5, 3]], so the (2,1) entry is -5"),
            ("Trace tr(A⁻¹)", "II", "5", "tr(A⁻¹) = 2 + 3 = 5")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Let A = [[1, 2], [0, 1]]. For positive integers n, A^n = [[1, 2n], [0, 1]]. Match the quantities in List I with their values in List II:",
        [
            ("(1, 2)-entry of A¹⁰", "II", "20", "The (1,2) entry of A^n is 2n; for n = 10 it is 2(10) = 20"),
            ("Sum of all entries of A⁵", "IV", "12", "A⁵ = [[1, 10], [0, 1]], sum of entries is 1 + 10 + 0 + 1 = 12"),
            ("Trace tr(A¹⁰⁰)", "I", "2", "Diagonal entries of A¹⁰⁰ are 1 and 1, so trace is 1 + 1 = 2"),
            ("Determinant det(A⁵⁰)", "III", "1", "det(A^n) = (det A)^n = 1^n = 1")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Let A and B be 3×3 real matrices such that tr(A) = 5, tr(B) = -2, and tr(A B) = 8. Match the trace evaluations in List I with their values in List II:",
        [
            ("tr(2A + 3B)", "I", "4", "tr(2A + 3B) = 2 tr(A) + 3 tr(B) = 2(5) + 3(-2) = 4"),
            ("tr(B A)", "III", "8", "By cyclic property of trace, tr(BA) = tr(AB) = 8"),
            ("tr(A - B)", "II", "7", "tr(A - B) = tr(A) - tr(B) = 5 - (-2) = 7"),
            ("tr(A^T)", "IV", "5", "The trace of a matrix equals the trace of its transpose, so tr(A^T) = 5")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Let P be a 3×3 real orthogonal matrix (P^T P = I). Match the expressions in List I with their evaluations in List II:",
        [
            ("Possible values of det(P)", "IV", "±1", "det(P^T P) = (det P)² = 1 implies det(P) = ±1"),
            ("Inverse matrix P⁻¹", "II", "P^T", "Since P^T P = I, P⁻¹ = P^T"),
            ("det(3P) when det(P) = 1", "III", "27", "det(3P) = 3³ det(P) = 27(1) = 27"),
            ("det(adj(P)) when det(P) = -1", "I", "1", "det(adj P) = (det P)^(3-1) = (-1)² = 1")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Let A = [[2, 1], [3, 4]]. By the Cayley-Hamilton theorem, A satisfies its characteristic equation det(A - λI) = 0. Match the quantities in List I with their values or expressions in List II:",
        [
            ("A² expressed in terms of A and I", "II", "6A - 5I", "Characteristic equation is λ² - 6λ + 5 = 0, so A² = 6A - 5I"),
            ("det(A)", "I", "5", "det(A) = (2)(4) - (1)(3) = 8 - 3 = 5"),
            ("Trace tr(A²)", "IV", "26", "Eigenvalues of A are 1 and 5, so eigenvalues of A² are 1 and 25, giving tr(A²) = 1 + 25 = 26"),
            ("A⁻¹ expressed in terms of A and I", "III", "(6I - A)/5", "Multiplying A² - 6A + 5I = O by A⁻¹ gives A - 6I + 5A⁻¹ = O, so A⁻¹ = (6I - A)/5")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Let A be a 3×3 non-singular matrix with det(A) = 3. Match the determinant values in List I with their numerical values in List II:",
        [
            ("det(adj(A))", "III", "9", "det(adj A) = |A|^(3-1) = 3² = 9"),
            ("det(adj(adj(A)))", "IV", "81", "det(adj(adj A)) = |A|^((3-1)²) = 3⁴ = 81"),
            ("det(2A)", "I", "24", "det(2A) = 2³ det(A) = 8 × 3 = 24"),
            ("det(A⁻¹ adj(A))", "II", "3", "det(A⁻¹ adj A) = det(A⁻¹) det(adj A) = (1/3)(9) = 3")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Any square matrix A can be uniquely written as A = P + Q, where P = (A + A^T)/2 is symmetric and Q = (A - A^T)/2 is skew-symmetric. For A = [[2, 5], [1, 4]], match List I with List II:",
        [
            ("(1, 2)-entry of symmetric matrix P", "I", "3", "P = (A + A^T)/2 = [[2, 3], [3, 4]], so (1,2) entry is (5+1)/2 = 3"),
            ("(1, 2)-entry of skew-symmetric matrix Q", "IV", "2", "Q = (A - A^T)/2 = [[0, 2], [-2, 0]], so (1,2) entry is (5-1)/2 = 2"),
            ("det(P)", "II", "-1", "det(P) = (2)(4) - (3)(3) = 8 - 9 = -1"),
            ("det(Q)", "III", "4", "det(Q) = (0)(0) - (2)(-2) = 4")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Let A be an idempotent matrix (A² = A) and B be a nilpotent matrix with B³ = O. Match the algebraic expressions in List I with their simplified forms in List II:",
        [
            ("(I - A)²", "IV", "I - A", "(I - A)² = I - 2A + A² = I - 2A + A = I - A"),
            ("(I + A)³", "III", "I + 7A", "(I + A)³ = I + 3A + 3A² + A³ = I + 3A + 3A + A = I + 7A"),
            ("(I - B)⁻¹", "II", "I + B + B²", "(I - B)(I + B + B²) = I - B³ = I, hence (I - B)⁻¹ = I + B + B²"),
            ("det(B)", "I", "0", "Nilpotent matrices have all eigenvalues zero, so det(B) = 0")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Let A = [[1, 0, 0], [2, 2, 0], [3, 1, 4]]. The eigenvalues of A are 1, 2, 4. Match the matrix evaluations in List I with their values in List II:",
        [
            ("Trace tr(A)", "II", "7", "Eigenvalues are diagonal entries 1, 2, 4, so tr(A) = 1 + 2 + 4 = 7"),
            ("Determinant det(A)", "III", "8", "det(A) = product of eigenvalues = 1 × 2 × 4 = 8"),
            ("Trace tr(A²)", "IV", "21", "Eigenvalues of A² are 1²=1, 2²=4, 4²=16, so tr(A²) = 1 + 4 + 16 = 21"),
            ("det(A³ - 7A² + 14A - 5I)", "I", "27", "By Cayley-Hamilton, A³ - 7A² + 14A = 8I, so det(8I - 5I) = det(3I) = 3³ = 27")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Let R(θ) = [[cos θ, -sin θ], [sin θ, cos θ]] be the standard 2D rotation matrix. Match each operation in List I with its result in List II:",
        [
            ("R(α) R(β)", "I", "R(α + β)", "Angle addition formulas yield R(α) R(β) = R(α + β)"),
            ("(R(θ))^n for integer n", "II", "R(nθ)", "By De Moivre's theorem applied to rotation matrices, [R(θ)]^n = R(nθ)"),
            ("Inverse matrix [R(θ)]⁻¹", "III", "R(-θ)", "Rotation by -θ reverses the rotation: [R(θ)]⁻¹ = R(-θ) = R(θ)^T"),
            ("det(R(θ))", "IV", "1", "det(R(θ)) = cos² θ - (-sin² θ) = cos² θ + sin² θ = 1")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Let A be an invertible 3×3 real matrix with det(A) = 2. Match the adjoint expressions in List I with their evaluations in List II:",
        [
            ("det(adj(A))", "III", "4", "det(adj A) = |A|^(n-1) = 2² = 4"),
            ("det(adj(adj(A)))", "II", "16", "det(adj(adj A)) = |A|^((n-1)²) = 2⁴ = 16"),
            ("Scalar k such that adj(adj(A)) = k A", "I", "2", "adj(adj A) = |A|^(n-2) A = 2¹ A = 2A, so k = 2"),
            ("det(A adj(A))", "IV", "8", "A adj(A) = |A| I = 2 I₃, so det(2 I₃) = 2³ = 8")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Let A = [[0, 1, 2], [0, 0, 3], [0, 0, 0]] and M = I + A. Match the matrix quantities in List I with their values in List II:",
        [
            ("(1, 3)-entry of A²", "IV", "3", "A² has (1,3) entry equal to (0)(2) + (1)(3) + (2)(0) = 3"),
            ("(1, 3)-entry of M⁵ = (I + A)⁵", "I", "40", "M⁵ = I + 5A + 10A²; the (1,3) entry is 5(2) + 10(3) = 10 + 30 = 40"),
            ("(1, 3)-entry of M³ = (I + A)³", "III", "15", "M³ = I + 3A + 3A²; the (1,3) entry is 3(2) + 3(3) = 6 + 9 = 15"),
            ("Determinant det(M)", "II", "1", "M is an upper triangular matrix with 1 on the main diagonal, so det(M) = 1")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Let A be a 3×3 real skew-symmetric matrix (A^T = -A). Match the mathematical statements in List I with their results in List II:",
        [
            ("Value of det(A)", "II", "0", "det(A) = det(A^T) = det(-A) = (-1)³ det(A) = -det(A) implies det(A) = 0"),
            ("Character of matrix A²", "IV", "Symmetric matrix", "(A²)^T = (A^T)² = (-A)² = A², hence symmetric"),
            ("Cayley transform matrix (I - A)(I + A)⁻¹ is", "III", "Orthogonal matrix", "The Cayley transform of any real skew-symmetric matrix is an orthogonal matrix"),
            ("Relationship between det(I + A) and det(I - A)", "I", "det(I + A) = det(I - A)", "det(I + A) = det((I + A)^T) = det(I - A)")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Let A = [[1, 1, 1], [1, 2, 3], [1, 4, 9]] (Vandermonde matrix). Match the determinant expressions in List I with their numerical values in List II:",
        [
            ("det(A)", "I", "2", "det(A) = (2 - 1)(3 - 1)(3 - 2) = 1 × 2 × 1 = 2"),
            ("det(adj(A))", "III", "4", "det(adj A) = |A|^(3-1) = 2² = 4"),
            ("det(adj(2A))", "IV", "256", "det(2A) = 2³(2) = 16, so det(adj(2A)) = 16^(3-1) = 16² = 256"),
            ("det(A⁻¹)", "II", "1/2", "det(A⁻¹) = 1 / det(A) = 1/2")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Let A be a 2×2 matrix satisfying A² - 5A + 7I = O. Match the quantities and expressions in List I with their values in List II:",
        [
            ("det(A)", "IV", "7", "From characteristic polynomial λ² - 5λ + 7 = 0, product of roots det(A) = 7"),
            ("tr(A)", "II", "5", "Sum of roots tr(A) = 5"),
            ("Inverse A⁻¹ in terms of A and I", "I", "(5I - A)/7", "A² - 5A + 7I = O implies 7I = 5A - A², so A⁻¹ = (5I - A)/7"),
            ("Value of coefficient p when A³ = p A + q I", "III", "18", "A³ = 5A² - 7A = 5(5A - 7I) - 7A = 18A - 35I, so p = 18")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Let P be an n×n real idempotent matrix (P² = P). Match the properties and expressions in List I with their values or descriptions in List II:",
        [
            ("Possible eigenvalues of P", "III", "0 or 1", "P v = λ v implies P² v = λ² v = λ v, so λ² = λ => λ ∈ {0, 1}"),
            ("(2P - I)² simplifies to", "I", "I", "(2P - I)² = 4P² - 4P + I = 4P - 4P + I = I"),
            ("Trace tr(P) equals", "II", "Rank of P", "For an idempotent matrix, eigenvalues are 1 and 0, so trace equals the number of nonzero eigenvalues which is rank(P)"),
            ("Matrix I - P satisfies", "IV", "(I - P)² = I - P", "(I - P)² = I - 2P + P² = I - 2P + P = I - P, so it is also idempotent")
        ], "D"))

    # ==========================================
    # TOPIC 2: Determinants (20 questions)
    # ==========================================
    t = "Determinants"
    prefix = "math_mat_determinants"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match each 2×2 determinant in List I with its evaluated numerical value in List II:",
        [
            ("|[[3, 4], [2, 5]]|", "II", "7", "(3)(5) - (4)(2) = 15 - 8 = 7"),
            ("|[[6, -2], [3, 1]]|", "IV", "12", "(6)(1) - (-2)(3) = 6 + 6 = 12"),
            ("|[[5, 3], [4, 2]]|", "I", "-2", "(5)(2) - (3)(4) = 10 - 12 = -2"),
            ("|[[7, 1], [-3, 2]]|", "III", "17", "(7)(2) - (1)(-3) = 14 + 3 = 17")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "For the matrix A = [[1, 2, 3], [0, 4, 5], [1, 0, 6]], match the minor and cofactor values in List I with their values in List II:",
        [
            ("Minor M₁₁", "IV", "24", "M₁₁ = (4)(6) - (5)(0) = 24"),
            ("Minor M₁₂", "I", "-5", "M₁₂ = (0)(6) - (5)(1) = -5"),
            ("Cofactor C₁₂", "III", "5", "C₁₂ = (-1)¹⁺² M₁₂ = -(-5) = 5"),
            ("Cofactor C₂₂", "II", "3", "C₂₂ = (-1)²⁺² M₂₂ = (1)(6) - (3)(1) = 3")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the fundamental determinant properties of an n×n matrix A in List I with their expressions in List II (where k is a scalar and B is an n×n matrix):",
        [
            ("det(A^T)", "I", "det(A)", "The determinant of a transpose equals the determinant of the original matrix"),
            ("det(k A)", "III", "kⁿ det(A)", "Multiplying an n×n matrix by scalar k factors k out from each of the n rows"),
            ("det(A B)", "IV", "det(A) det(B)", "The determinant of a product of square matrices is the product of their determinants"),
            ("Determinant of a matrix with two identical rows", "II", "0", "If any two rows of a determinant are identical, its value is 0")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the 3×3 special matrices in List I with their determinant values in List II:",
        [
            ("Determinant of diagonal matrix diag(2, 3, 5)", "III", "30", "Determinant of a diagonal matrix is product of diagonal entries: 2 × 3 × 5 = 30"),
            ("Determinant of upper triangular matrix with diagonal (1, 4, 6)", "II", "24", "Determinant of a triangular matrix is product of diagonal entries: 1 × 4 × 6 = 24"),
            ("Determinant of identity matrix I₃", "I", "1", "det(I₃) = 1"),
            ("Determinant of any 3×3 matrix with a row of all zeros", "IV", "0", "Expanding along the zero row yields 0")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each 3×3 determinant in List I with its evaluated value in List II using row and column operations:",
        [
            ("|[[1, x, y+z], [1, y, z+x], [1, z, x+y]]|", "I", "0", "Adding C₃ to C₂ makes column 2 proportional to column 1, so the determinant is 0"),
            ("|[[1, 1, 1], [1, 2, 3], [1, 3, 6]]|", "IV", "1", "Row operations R₂ - R₁ and R₃ - R₁ simplify the determinant to 1(5 - 4) = 1"),
            ("|[[2, 1, 1], [1, 2, 1], [1, 1, 2]]|", "II", "4", "Adding rows gives factor (2+1+1)=4, remaining determinant evaluates to 1, total is 4"),
            ("|[[1, 2, 3], [0, 2, 4], [0, 0, 5]]|", "III", "10", "Product of main diagonal entries of triangular matrix: 1 × 2 × 5 = 10")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "The Vandermonde determinant is given by V(a, b, c) = |[[1, a, a²], [1, b, b²], [1, c, c²]]| = (b - a)(c - a)(c - b). Match the parameter triples in List I with the determinant values in List II:",
        [
            ("(a, b, c) = (1, 2, 3)", "II", "2", "(2 - 1)(3 - 1)(3 - 2) = 1 × 2 × 1 = 2"),
            ("(a, b, c) = (1, 2, 4)", "III", "6", "(2 - 1)(4 - 1)(4 - 2) = 1 × 3 × 2 = 6"),
            ("(a, b, c) = (1, 3, 5)", "IV", "16", "(3 - 1)(5 - 1)(5 - 3) = 2 × 4 × 2 = 16"),
            ("(a, b, c) = (1, 2, 5)", "I", "12", "(2 - 1)(5 - 1)(5 - 2) = 1 × 4 × 3 = 12")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "For a system of 3 linear equations in 3 variables with coefficient determinant Δ and Cramer determinants Δ_x, Δ_y, Δ_z, match the conditions in List I with their geometric descriptions in List II:",
        [
            ("Condition for a unique solution", "III", "Δ ≠ 0", "When the coefficient determinant Δ is non-zero, Cramer's rule yields a unique solution"),
            ("Condition for infinitely many solutions", "I", "Δ = Δ_x = Δ_y = Δ_z = 0", "All determinants vanishing with rank 2 or 1 gives consistent dependent system"),
            ("Condition for inconsistent system (no solution)", "IV", "Δ = 0 and at least one Δ_i ≠ 0", "If Δ = 0 while any numerator determinant is non-zero, the system is inconsistent"),
            ("Cramer's rule formula for variable x", "II", "x = Δ_x / Δ", "By Cramer's rule, x = Δ_x / Δ when Δ ≠ 0")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Consider the linear system: x + y + z = 9, 2x + 5y + 7z = 52, 2x + y - z = 0. Match the system quantities in List I with their values in List II:",
        [
            ("Coefficient determinant Δ", "IV", "-4", "Δ = |[[1, 1, 1], [2, 5, 7], [2, 1, -1]]| = 1(-12) - 1(-16) + 1(-8) = -12 + 16 - 8 = -4"),
            ("Solution value of x", "II", "1", "Solving gives x = 1, y = 3, z = 5"),
            ("Solution value of y", "III", "3", "Substituting x = 1 into 3x + 2y = 9 gives y = 3"),
            ("Solution value of z", "I", "5", "From 2x + y - z = 0, z = 2(1) + 3 = 5")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "The circulant determinant C(a, b, c) = |[[a, b, c], [b, c, a], [c, a, b]]| = -(a³ + b³ + c³ - 3abc). Match the triples (a, b, c) in List I with the evaluated circulant determinants in List II:",
        [
            ("(a, b, c) = (1, 0, 0)", "I", "-1", "C(1,0,0) = -(1³ + 0 + 0 - 0) = -1"),
            ("(a, b, c) = (0, 1, 1)", "III", "-2", "C(0,1,1) = -(0 + 1³ + 1³ - 0) = -2"),
            ("(a, b, c) = (1, 2, 0)", "II", "-9", "C(1,2,0) = -(1³ + 2³ + 0 - 0) = -(1 + 8) = -9"),
            ("(a, b, c) = (1, 2, 3)", "IV", "-18", "C(1,2,3) = -(1 + 8 + 27 - 18) = -18")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the trigonometric determinant expressions in List I with their evaluated values in List II:",
        [
            ("|[[sin² x, cos² x, 1], [cos² x, sin² x, 1], [-10, 12, 2]]|", "II", "0", "C₁ + C₂ = [1, 1, 2]^T, which is identical to column 3, hence determinant is 0"),
            ("|[[cos 15°, sin 15°], [sin 15°, cos 15°]]|", "IV", "√3 / 2", "cos² 15° - sin² 15° = cos(30°) = √3 / 2"),
            ("|[[sec θ, tan θ], [tan θ, sec θ]]|", "I", "1", "sec² θ - tan² θ = 1 for all valid θ"),
            ("|[[2, sin(π/6)], [2 sin(π/6), 1]]|", "III", "3/2", "sin(π/6) = 1/2, so (2)(1) - 2(1/2)² = 2 - 1/2 = 3/2")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "For a real skew-symmetric matrix A (A^T = -A), match the determinant statements in List I with their values or characterizations in List II:",
        [
            ("Determinant of any real skew-symmetric matrix of order 3", "III", "0", "For odd order n, det(A) = det(-A^T) = (-1)ⁿ det(A) = -det(A) => det(A) = 0"),
            ("General form of determinant of real 2×2 skew-symmetric matrix", "IV", "Always a non-negative square", "det([[0, k], [-k, 0]]) = k² ≥ 0"),
            ("det([[0, 3], [-3, 0]])", "II", "9", "(0)(0) - (3)(-3) = 9"),
            ("det([[0, 4], [-4, 0]])", "I", "16", "(0)(0) - (4)(-4) = 16")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Let Δ(x) = |[[x², 2x], [3, x]]| = x³ - 6x. Match the derivatives and evaluations at x = 3 in List I with their values in List II:",
        [
            ("Value of Δ(3)", "IV", "9", "Δ(x) = x³ - 6x, so Δ(3) = 27 - 18 = 9"),
            ("Value of Δ′(3)", "I", "21", "Δ′(x) = 3x² - 6, so Δ′(3) = 3(9) - 6 = 21"),
            ("Value of Δ″(3)", "II", "18", "Δ″(x) = 6x, so Δ″(3) = 6(3) = 18"),
            ("Value of Δ‴(3)", "III", "6", "Δ‴(x) = 6 for all x, so Δ‴(3) = 6")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Consider the system of equations: x + y + z = 6, x + 2y + 3z = 10, x + 2y + λ z = μ. Match the conditions in List I with their solvability descriptions in List II:",
        [
            ("The system has a unique solution if", "I", "λ ≠ 3", "Coefficient determinant is Δ = λ - 3; unique solution requires Δ ≠ 0, so λ ≠ 3"),
            ("The system has infinitely many solutions if", "II", "λ = 3 and μ = 10", "When λ = 3 and μ = 10, the third equation becomes identical to the second, giving infinitely many solutions"),
            ("The system is inconsistent (no solution) if", "IV", "λ = 3 and μ ≠ 10", "When λ = 3, LHS becomes 0x + 0y + 0z while RHS is μ - 10 ≠ 0, contradiction"),
            ("Value of Δ when λ = 5", "III", "2", "Δ = λ - 3 = 5 - 3 = 2")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Let ω be a non-real complex cube root of unity (1 + ω + ω² = 0, ω³ = 1). Match the complex determinants in List I with their values in List II:",
        [
            ("|[[1, ω, ω²], [ω, ω², 1], [ω², 1, ω]]|", "II", "0", "Adding all columns yields C₁ = [1+ω+ω², 1+ω+ω², 1+ω+ω²]^T = [0, 0, 0]^T, so det = 0"),
            ("|[[ω, 0], [0, ω²]]|", "I", "1", "Product of diagonal entries: ω × ω² = ω³ = 1"),
            ("|[[2, ω], [ω², 2]]|", "III", "3", "(2)(2) - (ω)(ω²) = 4 - ω³ = 4 - 1 = 3"),
            ("|[[3, ω], [ω², 2]]|", "IV", "5", "(3)(2) - (ω)(ω²) = 6 - ω³ = 6 - 1 = 5")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Consider Δ = |[[a, b, c], [b, c, a], [c, a, b]]| = -(a + b + c)/2 · [(a - b)² + (b - c)² + (c - a)²]. Match the properties and cases in List I with their values in List II:",
        [
            ("Sign of Δ when a, b, c are distinct positive real numbers", "IV", "Strictly negative (< 0)", "Since a+b+c > 0 and sum of squares > 0, the leading negative sign makes Δ < 0"),
            ("Value of Δ when a = b = c = 2", "III", "0", "All rows become identical [2, 2, 2], so Δ = 0"),
            ("Value of Δ when a = 1, b = 2, c = 3", "I", "-18", "-(1 + 8 + 27 - 18) = -18"),
            ("Value of Δ when a = 1, b = 1, c = 2", "II", "-4", "-(1 + 1 + 8 - 6) = -4")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Consider the determinant D(x) = |[[x+a, b, c], [a, x+b, c], [a, b, x+c]]| = x²(x + a + b + c). Match List I with List II:",
        [
            ("Value of D(0)", "III", "0", "D(0) = 0²(0 + a + b + c) = 0"),
            ("Roots of the equation D(x) = 0", "IV", "x = 0 (double root) and x = -(a + b + c)", "Factoring yields D(x) = x²(x + a + b + c) = 0"),
            ("Value of D(1) when a = 1, b = 2, c = 3", "I", "7", "D(1) = 1²(1 + 1 + 2 + 3) = 7"),
            ("Value of D(2) when a = 1, b = 2, c = 3", "II", "32", "D(2) = 2²(2 + 1 + 2 + 3) = 4(8) = 32")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Consider the homogeneous system: x + k y + 3z = 0, 4x + 3y + k z = 0, 2x + y + 2z = 0. Its coefficient determinant is Δ = k(2k - 9). Match List I with List II:",
        [
            ("Condition for only the trivial solution (0, 0, 0)", "I", "k ≠ 0 and k ≠ 9/2", "Homogeneous system has unique trivial solution iff Δ ≠ 0, so k(2k - 9) ≠ 0"),
            ("Values of k for which non-trivial solutions exist", "IV", "k = 0 or k = 9/2", "Non-trivial solutions exist iff Δ = 0, so k = 0 or k = 9/2"),
            ("Value of Δ when k = 1", "II", "-7", "Δ = 1(2(1) - 9) = -7"),
            ("Value of Δ when k = 5", "III", "5", "Δ = 5(2(5) - 9) = 5(1) = 5")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match each determinant in List I with its evaluated value in List II using row and column linear combination properties:",
        [
            ("|[[x+1, x+2, x+a], [x+2, x+3, x+b], [x+3, x+4, x+c]]| for a, b, c in A.P.", "II", "0", "Operation R₁ - 2R₂ + R₃ produces a row of zeros because a - 2b + c = 0, so determinant is 0"),
            ("|[[1, 2, 3], [4, 5, 6], [7, 8, 10]]|", "III", "-3", "Expanding gives 1(50 - 48) - 2(40 - 42) + 3(32 - 35) = 2 + 4 - 9 = -3"),
            ("|[[1, 0, 2], [2, 1, 0], [0, 3, 1]]|", "IV", "13", "Expanding along row 1 gives 1(1 - 0) + 2(6 - 0) = 1 + 12 = 13"),
            ("|[[2, 1, 3], [1, 3, 2], [3, 2, 1]]|", "I", "-18", "Expanding gives 2(3 - 4) - 1(1 - 6) + 3(2 - 9) = -2 + 5 - 21 = -18")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Let f(x) = |[[cos x, 1, 0], [1, 2 cos x, 1], [0, 1, 2 cos x]]| = cos(3x). Match the function values and derivatives in List I with their values in List II:",
        [
            ("f(0)", "IV", "1", "f(0) = cos(0) = 1"),
            ("f(π/6)", "I", "0", "f(π/6) = cos(3 × π/6) = cos(π/2) = 0"),
            ("f′(π/6)", "III", "-3", "f′(x) = -3 sin(3x), so f′(π/6) = -3 sin(π/2) = -3"),
            ("f″(0)", "II", "-9", "f″(x) = -9 cos(3x), so f″(0) = -9 cos(0) = -9")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Let A and B be 3×3 real matrices such that det(A) = 3 and det(B) = -2. Match the composite determinant expressions in List I with their evaluated values in List II:",
        [
            ("det(A B)", "III", "-6", "det(AB) = det(A) det(B) = (3)(-2) = -6"),
            ("det(2 A B⁻¹)", "II", "-12", "det(2 A B⁻¹) = 2³ det(A) / det(B) = 8(3)/(-2) = -12"),
            ("det(adj(A) B²)", "IV", "36", "det(adj A) det(B²) = |A|² |B|² = (3)²(-2)² = 9 × 4 = 36"),
            ("det(A^T (adj(B))⁻¹)", "I", "3/4", "det(A^T)/det(adj B) = |A|/|B|² = 3/(-2)² = 3/4")
        ], "D"))

    return qs
