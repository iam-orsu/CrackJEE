from builder import make_matrix_q

def get_questions():
    qs = []

    # ==========================================
    # TOPIC 1: Introduction to 3D Geometry (20 questions)
    # ==========================================
    t = "Introduction to 3D Geometry"
    prefix = "math_mat_intro3d"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the given points in List I with the octant in which they lie in List II:",
        [
            ("P(3, -2, 5)", "IV", "Octant IV", "In P(3, -2, 5), x > 0, y < 0, z > 0, which corresponds to Octant IV"),
            ("Q(-4, -1, 6)", "III", "Octant III", "In Q(-4, -1, 6), x < 0, y < 0, z > 0, which corresponds to Octant III"),
            ("R(-2, 5, -7)", "I", "Octant VI", "In R(-2, 5, -7), x < 0, y > 0, z < 0, which corresponds to Octant VI"),
            ("S(1, -3, -4)", "II", "Octant VIII", "In S(1, -3, -4), x > 0, y < 0, z < 0, which corresponds to Octant VIII"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "For the point P(2, 3, 6) in three-dimensional space, match the geometric distances in List I with their values in List II:",
        [
            ("Distance of P from the origin O(0,0,0)", "IV", "7", "Distance from origin is √(2² + 3² + 6²) = √(4 + 9 + 36) = √49 = 7"),
            ("Distance of P from the xy-plane", "I", "6", "Distance from xy-plane is |z| = |6| = 6"),
            ("Distance of P from the z-axis", "II", "√13", "Distance from z-axis is √(x² + y²) = √(4 + 9) = √13"),
            ("Distance of P from the x-axis", "III", "3√5", "Distance from x-axis is √(y² + z²) = √(9 + 36) = √45 = 3√5"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each geometric center or dividing point in List I with its coordinates in List II:",
        [
            ("Centroid of triangle ABC with A(1, 2, 3), B(4, 5, 6), C(7, 8, 9)", "II", "(4, 5, 6)", "Centroid is ((1+4+7)/3, (2+5+8)/3, (3+6+9)/3) = (4, 5, 6)"),
            ("Centroid of tetrahedron ABCD with A(1,0,0), B(0,2,0), C(0,0,3), D(3,2,1)", "IV", "(1, 1, 1)", "Centroid is ((1+0+0+3)/4, (0+2+0+2)/4, (0+0+3+1)/4) = (1, 1, 1)"),
            ("Midpoint of segment joining P(2, -4, 6) and Q(6, 2, -2)", "I", "(4, -1, 2)", "Midpoint is ((2+6)/2, (-4+2)/2, (6-2)/2) = (4, -1, 2)"),
            ("Point dividing segment joining (1, 2, 3) and (4, 5, 6) internally in ratio 2 : 1", "III", "(3, 4, 5)", "Section formula gives ((2·4 + 1·1)/3, (2·5 + 1·2)/3, (2·6 + 1·3)/3) = (3, 4, 5)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Let α, β, γ be the direction angles of a directed line in ℝ³. Match the trigonometric expressions in List I with their exact values in List II:",
        [
            ("cos²α + cos²β + cos²γ", "I", "1", "Fundamental direction cosine identity: l² + m² + n² = 1"),
            ("sin²α + sin²β + sin²γ", "III", "2", "sin²α + sin²β + sin²γ = (1 - cos²α) + (1 - cos²β) + (1 - cos²γ) = 3 - 1 = 2"),
            ("cos 2α + cos 2β + cos 2γ", "IV", "-1", "cos 2α + cos 2β + cos 2γ = 2(cos²α + cos²β + cos²γ) - 3 = 2(1) - 3 = -1"),
            ("cos⁴α + cos⁴β + cos⁴γ when the line is equally inclined to all coordinate axes", "II", "1/3", "When α = β = γ, 3 cos²α = 1 ⇒ cos²α = 1/3, so sum of fourth powers is 3(1/3)² = 1/3"),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Consider the line segment joining points P(2, -3, 4) and Q(3, 1, -2). Match the intersecting plane in List I with the ratio in which it divides PQ in List II:",
        [
            ("xy-plane (z = 0)", "III", "2 : 1 internally", "Point on segment has z = (-2k + 4)/(k + 1) = 0 ⇒ k = 2, so 2 : 1 internally"),
            ("yz-plane (x = 0)", "I", "2 : 3 externally", "Point on segment has x = (3k + 2)/(k + 1) = 0 ⇒ k = -2/3, so 2 : 3 externally"),
            ("zx-plane (y = 0)", "IV", "3 : 1 internally", "Point on segment has y = (k - 3)/(k + 1) = 0 ⇒ k = 3, so 3 : 1 internally"),
            ("Plane x + y + z = 1", "II", "2 : 1 externally", "(3k+2 + k-3 - 2k+4)/(k+1) = (2k+3)/(k+1) = 1 ⇒ 2k + 3 = k + 1 ⇒ k = -2, so 2 : 1 externally"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match the given direction ratios (a, b, c) of a line in List I with its normalized direction cosines (l, m, n) having l > 0 in List II:",
        [
            ("(1, -2, 2)", "IV", "(1/3, -2/3, 2/3)", "√(1 + 4 + 4) = 3, so direction cosines are (1/3, -2/3, 2/3)"),
            ("(2, 3, 6)", "I", "(2/7, 3/7, 6/7)", "√(4 + 9 + 36) = 7, so direction cosines are (2/7, 3/7, 6/7)"),
            ("(3, -4, 12)", "II", "(3/13, -4/13, 12/13)", "√(9 + 16 + 144) = 13, so direction cosines are (3/13, -4/13, 12/13)"),
            ("(1, 1, √2)", "III", "(1/2, 1/2, 1/√2)", "√(1 + 1 + 2) = 2, so direction cosines are (1/2, 1/2, √2/2) = (1/2, 1/2, 1/√2)"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match each pair of lines with given direction ratios in List I with the acute angle θ between them in List II:",
        [
            ("Line 1: (1, 1, 0) and Line 2: (0, 1, 1)", "II", "π/3", "cos θ = |0 + 1 + 0| / (√2 · √2) = 1/2 ⇒ θ = π/3"),
            ("Line 1: (1, 2, 2) and Line 2: (2, 3, 6)", "I", "arccos(20/21)", "cos θ = |2 + 6 + 12| / (3 · 7) = 20/21 ⇒ θ = arccos(20/21)"),
            ("Line 1: (1, 1, 1) and Line 2: (1, -1, 0)", "IV", "π/2", "cos θ = |1 - 1 + 0| / (√3 · √2) = 0 ⇒ θ = π/2"),
            ("Line 1: (2, 2, 1) and Line 2: (1, 0, 0)", "III", "arccos(2/3)", "cos θ = |2 + 0 + 0| / (3 · 1) = 2/3 ⇒ θ = arccos(2/3)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "For the line segment joining A(1, 2, 3) and B(4, 6, 15), match each projection described in List I with its length in List II:",
        [
            ("Projection of AB on the xy-plane", "III", "5", "Projection on xy-plane is √((4-1)² + (6-2)²) = √(9 + 16) = 5"),
            ("Projection of AB on the z-axis", "IV", "12", "Projection on z-axis is |15 - 3| = 12"),
            ("Projection of AB on line with direction cosines (1/√3, 1/√3, 1/√3)", "I", "19/√3", "|3(1/√3) + 4(1/√3) + 12(1/√3)| = 19/√3"),
            ("Projection of AB on line joining (0,0,0) and (2, 3, 6)", "II", "90/7", "Direction cosines are (2/7, 3/7, 6/7); projection = |3(2/7) + 4(3/7) + 12(6/7)| = 90/7"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match each geometric condition on collinearity or distance in List I with the corresponding value of parameter k in List II:",
        [
            ("Value of k such that points (1, 2, 3), (3, k, 7), and (5, 6, 11) are collinear", "IV", "4", "Differences Δx = 2, Δz = 4 are constant; y-coordinates form an AP: 2, k, 6 ⇒ k = 4"),
            ("Value of k such that points (k, 1, 5), (1, 0, 3), and (7, 3, 9) are collinear", "III", "3", "Direction ratios of line are (6, 3, 6) ~ (2, 1, 2); (k-1, 1, 2) ~ (2, 1, 2) ⇒ k - 1 = 2 ⇒ k = 3"),
            ("Positive value of k such that distance between (k, 1, -1) and (1, -1, 1) is √24", "I", "5", "(k-1)² + (1 - (-1))² + (-1 - 1)² = (k-1)² + 8 = 24 ⇒ (k-1)² = 16 ⇒ k = 5"),
            ("z-coordinate k of point dividing segment joining (2, 3, 4) and (5, 6, 10) in ratio 1 : 2 internally", "II", "6", "k = (1·10 + 2·4)/(1 + 2) = 18/3 = 6"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match each geometric locus of point P(x, y, z) in List I with its algebraic equation in List II:",
        [
            ("Locus of points equidistant from A(1, 2, 3) and B(3, 2, -1)", "I", "x - 2z = 0", "PA² = PB² ⇒ (x-1)² + (z-3)² = (x-3)² + (z+1)² ⇒ -2x - 6z + 10 = -6x + 2z + 10 ⇒ 4x - 8z = 0 ⇒ x - 2z = 0"),
            ("Locus of points such that PA² + PB² = 10 where A(1, 0, 0) and B(-1, 0, 0)", "IV", "x² + y² + z² = 4", "(x-1)² + y² + z² + (x+1)² + y² + z² = 10 ⇒ 2(x² + y² + z² + 1) = 10 ⇒ x² + y² + z² = 4"),
            ("Locus of points whose sum of distances from (0, 0, 3) and (0, 0, -3) equals 10", "II", "x²/16 + y²/16 + z²/25 = 1", "Ellipsoid of revolution with semi-major axis a = 5, c = 3 ⇒ b² = 25 - 9 = 16 ⇒ x²/16 + y²/16 + z²/25 = 1"),
            ("Locus of points whose perpendicular distance from the z-axis is 3", "III", "x² + y² = 9", "Distance from z-axis is √(x² + y²) = 3 ⇒ x² + y² = 9"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "For tetrahedron OABC with vertices O(0,0,0), A(a,0,0), B(0,b,0), C(0,0,c), match the geometric quantities in List I with their values in List II:",
        [
            ("Volume of tetrahedron OABC when a = 2, b = 3, c = 4", "IV", "4", "Volume V = (1/6)abc = (1/6)(2 · 3 · 4) = 4"),
            ("Distance of centroid of tetrahedron OABC from origin when a = 4, b = 4, c = 2", "II", "3/2", "Centroid is (1, 1, 1/2); distance = √(1 + 1 + 1/4) = √(9/4) = 3/2"),
            ("Area of triangle ABC when a = 2, b = 2, c = 1", "I", "√6", "Area = (1/2)√((ab)² + (bc)² + (ca)²) = (1/2)√(16 + 4 + 4) = (1/2)√24 = √6"),
            ("Radius of sphere passing through O, A, B, C when a = 2, b = 4, c = 4", "III", "3", "Sphere equation x² + y² + z² - 2x - 4y - 4z = 0; center (1, 2, 2), radius = √(1 + 4 + 4) = 3"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "A line segment AB in space has projections dx = 3, dy = 4, dz = 12 on the coordinate axes. Match the geometric quantities in List I with their values in List II:",
        [
            ("Length of line segment AB", "II", "13", "Length |AB| = √(dx² + dy² + dz²) = √(9 + 16 + 144) = √169 = 13"),
            ("Direction cosine n = cos γ with positive z-axis", "III", "12/13", "n = dz / |AB| = 12/13"),
            ("Length of projection of AB on the xy-plane", "IV", "5", "Projection on xy-plane is √(dx² + dy²) = √(9 + 16) = 5"),
            ("Sum of squares of projections of AB on the three coordinate planes", "I", "338", "p_xy² + p_yz² + p_zx² = 2(dx² + dy² + dz²) = 2(169) = 338"),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A variable line through the origin makes angles α, β, γ, δ with the four main diagonals of a cube. Match the expressions in List I with their values in List II:",
        [
            ("cos²α + cos²β + cos²γ + cos²δ", "I", "4/3", "Diagonals have direction cosines (±1/√3, ±1/√3, ±1/√3). Sum of cos² = (1/3) · 4(l² + m² + n²) = 4/3"),
            ("sin²α + sin²β + sin²γ + sin²δ", "IV", "8/3", "Sum of sin² = 4 - (cos²α + cos²β + cos²γ + cos²δ) = 4 - 4/3 = 8/3"),
            ("cos 2α + cos 2β + cos 2γ + cos 2δ", "III", "-4/3", "Sum of cos 2θ = 2(4/3) - 4 = 8/3 - 4 = -4/3"),
            ("Value of cos α cos β cos γ cos δ when line is directed along a cube edge", "II", "1/9", "When line is along an edge, cos θ = 1/√3 for all diagonals; product is (1/√3)⁴ = 1/9"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "For the triangle with vertices A(1, 0, 0), B(0, 2, 0), and C(0, 0, 2), match the triangle centers and geometric properties in List I with their values in List II:",
        [
            ("Coordinates of centroid G", "I", "(1/3, 2/3, 2/3)", "G = ((1+0+0)/3, (0+2+0)/3, (0+0+2)/3) = (1/3, 2/3, 2/3)"),
            ("Coordinates of circumcenter S", "II", "(1/6, 5/6, 5/6)", "S lies on 2x + y + z = 2 and is equidistant from vertices; solving yields (1/6, 5/6, 5/6)"),
            ("Coordinates of orthocenter H", "III", "(2/3, 1/3, 1/3)", "Using Euler line relation H = 3G - 2S gives H = 3(1/3, 2/3, 2/3) - 2(1/6, 5/6, 5/6) = (2/3, 1/3, 1/3)"),
            ("Square of circumradius R²", "IV", "25/12", "R² = |SA|² = (1/6 - 1)² + (5/6)² + (5/6)² = 25/36 + 25/36 + 25/36 = 75/36 = 25/12"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "For the point P(1, 2, 3), match the reflections and orthogonal projections in List I with their coordinates in List II:",
        [
            ("Reflection of P in the xy-plane", "III", "(1, 2, -3)", "Reflecting across xy-plane inverts the z-coordinate: (1, 2, -3)"),
            ("Reflection of P in the y-axis", "I", "(-1, 2, -3)", "Reflecting across y-axis inverts both x and z: (-1, 2, -3)"),
            ("Reflection of P in the origin", "II", "(-1, -2, -3)", "Reflecting across the origin inverts all three coordinates: (-1, -2, -3)"),
            ("Foot of perpendicular from P onto line r = t(1, 1, 1)", "IV", "(2, 2, 2)", "Projection parameter t = ((1,2,3)·(1,1,1))/3 = 6/3 = 2, so foot is (2, 2, 2)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "In a regular tetrahedron, match the geometric angle descriptions in List I with their exact values in List II:",
        [
            ("Angle θ between any two adjacent faces (dihedral angle)", "II", "arccos(1/3)", "In a regular tetrahedron, cos θ = 1/3, so θ = arccos(1/3)"),
            ("Angle between any two edges meeting at the same vertex", "IV", "π/3", "Each face is an equilateral triangle, so the angle between adjacent edges is 60° = π/3"),
            ("Angle between an edge and the altitude to an adjacent face", "III", "arccos(1/√3)", "The angle between an edge and the perpendicular from a vertex to the opposite face satisfies cos φ = 1/√3"),
            ("Angle between any pair of mutually opposite edges", "I", "π/2", "Opposite edges of a regular tetrahedron are mutually skew and perpendicular: θ = π/2"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "For tetrahedron OABC with O(0,0,0), A(2,0,0), B(0,4,0), and C(0,0,4), match each geometric property in List I with its value in List II:",
        [
            ("Radius of circumscribing sphere", "IV", "3", "Circumscribing sphere equation x² + y² + z² - 2x - 4y - 4z = 0; center (1, 2, 2), radius R = √(1 + 4 + 4) = 3"),
            ("Perpendicular distance from origin O to plane ABC", "I", "2√6 / 3", "Plane ABC is x/2 + y/4 + z/4 = 1 ⇒ 2x + y + z = 4; distance = 4/√(4+1+1) = 4/√6 = 2√6 / 3"),
            ("Area of triangular face ABC", "III", "4√6", "Area = (1/2)√((2·4)² + (4·4)² + (4·2)²) = (1/2)√(64 + 256 + 64) = (1/2)√384 = 4√6"),
            ("Inradius of tetrahedron OABC", "II", "2(4 - √6)/5", "r = 3V / S_total = 3(16/3) / (16 + 4√6) = 16 / (16 + 4√6) = 4 / (4 + √6) = 2(4 - √6)/5"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match the coupled direction cosine conditions in List I with the angle θ or number of lines in List II:",
        [
            ("Acute angle between lines satisfying l + m + n = 0 and l² + m² - n² = 0", "III", "π/3", "Substituting n = -(l+m) gives -2lm = 0 ⇒ l = 0 or m = 0; direction ratios (0, 1, -1) and (1, 0, -1) give cos θ = 1/2 ⇒ θ = π/3"),
            ("Acute angle between lines satisfying 2l + 2m - n = 0 and mn + nl + lm = 0", "IV", "π/2", "Substituting n = 2(l+m) yields 2l² + 5lm + 2m² = 0 ⇒ (2l+m)(l+2m) = 0; lines have direction ratios (1, -2, -2) and (-2, 1, -2), giving dot product 0 ⇒ θ = π/2"),
            ("Acute angle between lines satisfying l - 5m + 3n = 0 and 7l² + 5m² - 3n² = 0", "I", "arccos(√21 / 6)", "Eliminating l gives 6m² - 7mn + 2n² = 0 ⇒ (2m - n)(3m - 2n) = 0; direction ratios (-1, 1, 2) and (1, 2, 3) yield cos θ = 7/(√6 · √14) = √21 / 6"),
            ("Number of distinct lines passing through the origin equally inclined to coordinate axes", "II", "4", "Direction cosines (±1/√3, ±1/√3, ±1/√3) give 8 combinations, which pairwise represent 4 distinct lines"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match each geometric locus or distance configuration in List I with its formula or value in List II:",
        [
            ("Perpendicular distance from origin to plane cutting axes at A, B, C with 1/a² + 1/b² + 1/c² = 1/k²", "II", "k", "Distance p = 1 / √(1/a² + 1/b² + 1/c²) = 1 / √(1/k²) = k"),
            ("Locus of centroid of triangle ABC if plane passes through fixed point (1, 2, 3)", "I", "1/x + 2/y + 3/z = 3", "Centroid (x, y, z) = (a/3, b/3, c/3); substituting a = 3x, b = 3y, c = 3z into 1/a + 2/b + 3/c = 1 gives 1/x + 2/y + 3/z = 3"),
            ("Square of chord length made by unit sphere x² + y² + z² = 1 on line through origin with direction ratios (1, 2, 2)", "IV", "4", "The line passes through the center of the sphere, so chord is a diameter of length 2; square of length = 4"),
            ("Shortest distance between z-axis and line x - 1 = y = z", "III", "1/√2", "z-axis has point (0,0,0), dir (0,0,1); line has point (1,0,0), dir (1,1,1); shortest distance = |(1,0,0)·(-1, 1, 0)| / √2 = 1/√2"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Consider points A(2, 3, 5) and B(4, 7, 9). Match the harmonic division quantities in List I with their values in List II:",
        [
            ("Coordinates of point P dividing AB internally in ratio 3 : 1", "I", "(7/2, 6, 8)", "P = ((3·4 + 1·2)/4, (3·7 + 1·3)/4, (3·9 + 1·5)/4) = (14/4, 24/4, 32/4) = (7/2, 6, 8)"),
            ("Coordinates of point Q dividing AB externally in ratio 3 : 1 (harmonic conjugate of P)", "II", "(5, 9, 11)", "Q = ((3·4 - 1·2)/2, (3·7 - 1·3)/2, (3·9 - 1·5)/2) = (10/2, 18/2, 22/2) = (5, 9, 11)"),
            ("Length of segment PQ", "III", "9/2", "|PQ| = √((5 - 7/2)² + (9 - 6)² + (11 - 8)²) = √(9/4 + 9 + 9) = √(81/4) = 9/2"),
            ("Ratio in which midpoint M(3, 5, 7) of AB divides segment PQ", "IV", "1 : 4 externally", "M - P = (-1/2, -1, -1) and Q - M = (2, 4, 4); PM/MQ = -1/4, so 1 : 4 externally"),
        ], "D"))

    # ==========================================
    # TOPIC 2: Three Dimensional Geometry (20 questions)
    # ==========================================
    t = "Three Dimensional Geometry"
    prefix = "math_mat_3dgeom"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match each geometric description of a line or plane in List I with its Cartesian equation in List II:",
        [
            ("Line passing through (1, 2, 3) with direction ratios (2, -1, 4)", "II", "(x - 1)/2 = (y - 2)/(-1) = (z - 3)/4", "Standard symmetric form of a line"),
            ("Plane passing through (1, 2, 3) with normal vector (2, -1, 4)", "IV", "2x - y + 4z - 12 = 0", "2(x-1) - 1(y-2) + 4(z-3) = 0 ⇒ 2x - y + 4z - 12 = 0"),
            ("Plane with intercepts a = 2, b = 3, c = 6 on the coordinate axes", "I", "3x + 2y + z - 6 = 0", "Intercept form x/2 + y/3 + z/6 = 1 ⇒ 3x + 2y + z - 6 = 0"),
            ("Line passing through the origin with direction ratios (1, 1, 1)", "III", "x = y = z", "Symmetric form x/1 = y/1 = z/1 ⇒ x = y = z"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the perpendicular distance from point P(1, 2, 3) to the plane in List I with its value in List II:",
        [
            ("Plane 2x - 2y + z + 5 = 0", "IV", "2", "Distance = |2(1) - 2(2) + 3 + 5| / √(4 + 4 + 1) = |6| / 3 = 2"),
            ("Plane x + 2y + 2z - 20 = 0", "I", "3", "Distance = |1 + 2(2) + 2(3) - 20| / √(1 + 4 + 4) = |-9| / 3 = 3"),
            ("Plane 3x + 4y + 9 = 0", "II", "4", "Distance = |3(1) + 4(2) + 9| / √(9 + 16) = 20 / 5 = 4"),
            ("Plane 2x + y - 2z + 17 = 0", "III", "5", "Distance = |2(1) + 2 - 2(3) + 17| / √(4 + 1 + 4) = 15 / 3 = 5"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each pair of planes in List I with the acute angle θ between them in List II:",
        [
            ("x + y + z = 1 and x - y + z = 2", "II", "arccos(1/3)", "cos θ = |1(1) + 1(-1) + 1(1)| / (√3 · √3) = 1/3 ⇒ θ = arccos(1/3)"),
            ("2x - y + z = 3 and x + y + 2z = 5", "IV", "π/3", "cos θ = |2(1) - 1(1) + 1(2)| / (√6 · √6) = 3/6 = 1/2 ⇒ θ = π/3"),
            ("x + 2y - 2z = 4 and 2x - y = 1", "I", "π/2", "n₁·n₂ = 1(2) + 2(-1) - 2(0) = 0 ⇒ planes are perpendicular, θ = π/2"),
            ("x = 0 and x + y = 0", "III", "π/4", "cos θ = |1(1) + 0(1) + 0(0)| / (1 · √2) = 1/√2 ⇒ θ = π/4"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match each pair of parallel planes in List I with the perpendicular distance between them in List II:",
        [
            ("2x - y + 2z + 4 = 0 and 2x - y + 2z - 5 = 0", "I", "3", "d = |4 - (-5)| / √(4 + 1 + 4) = 9/3 = 3"),
            ("x + 2y + 2z - 1 = 0 and 2x + 4y + 4z + 10 = 0", "III", "2", "Dividing 2nd by 2 gives x + 2y + 2z + 5 = 0; d = |5 - (-1)| / 3 = 6/3 = 2"),
            ("3x - 4y + 12z - 2 = 0 and 3x - 4y + 12z + 11 = 0", "IV", "1", "d = |11 - (-2)| / √(9 + 16 + 144) = 13/13 = 1"),
            ("4x - 2y + 4z - 8 = 0 and 2x - y + 2z + 8 = 0", "II", "4", "Dividing 1st by 2 gives 2x - y + 2z - 4 = 0; d = |8 - (-4)| / 3 = 12/3 = 4"),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match the line and plane pair in List I with the angle θ between the line and the plane in List II:",
        [
            ("Line (x - 1)/1 = (y - 2)/1 = (z - 3)/√2 and Plane x + y - √2 z = 5", "III", "0", "b·n = 1(1) + 1(1) + √2(-√2) = 0 ⇒ sin θ = 0 ⇒ θ = 0 (line is parallel to plane)"),
            ("Line x/2 = y/2 = z/1 and Plane 2x + 2y + z = 4", "I", "π/2", "Direction vector of line is parallel to normal of plane ⇒ line is perpendicular to plane, θ = π/2"),
            ("Line x/1 = y/0 = z/0 (x-axis) and Plane x + y = 1", "IV", "π/4", "sin θ = |1(1) + 0 + 0| / (1 · √2) = 1/√2 ⇒ θ = π/4"),
            ("Line (x - 2)/3 = (y + 1)/4 = (z - 1)/12 and Plane 2x - 2y + z = 3", "II", "arcsin(10/39)", "sin θ = |3(2) + 4(-2) + 12(1)| / (13 · 3) = 10/39 ⇒ θ = arcsin(10/39)"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match the point P and plane π in List I with the coordinates of the foot of the perpendicular from P to π in List II:",
        [
            ("P(1, 2, 3) to plane x + y + z = 0", "IV", "(-1, 0, 1)", "k = -(1 + 2 + 3)/3 = -2; foot = (1 - 2, 2 - 2, 3 - 2) = (-1, 0, 1)"),
            ("P(0, 0, 0) to plane 2x - 3y + 6z - 49 = 0", "I", "(2, -3, 6)", "k = -(-49)/(4 + 9 + 36) = 1; foot = (0 + 2, 0 - 3, 0 + 6) = (2, -3, 6)"),
            ("P(1, 3, 4) to plane 2x - y + z + 3 = 0", "II", "(-1, 4, 3)", "k = -(2 - 3 + 4 + 3)/(4 + 1 + 1) = -6/6 = -1; foot = (1 - 2, 3 + 1, 4 - 1) = (-1, 4, 3)"),
            ("P(2, 3, 1) to plane x + 2y - z - 13 = 0", "III", "(3, 5, 0)", "k = -(2 + 6 - 1 - 13)/(1 + 4 + 1) = 6/6 = 1; foot = (2 + 1, 3 + 2, 1 - 1) = (3, 5, 0)"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match each point P and reflecting plane π in List I with the coordinates of the mirror image of P in π in List II:",
        [
            ("P(1, 2, 0) in plane x + y + z - 6 = 0", "II", "(3, 4, 2)", "k = -2(1 + 2 + 0 - 6)/3 = -2(-3)/3 = 2; image = (1 + 2, 2 + 2, 0 + 2) = (3, 4, 2)"),
            ("P(0, 0, 0) in plane x + y + z - 3 = 0", "I", "(2, 2, 2)", "k = -2(-3)/3 = 2; image = (0 + 2, 0 + 2, 0 + 2) = (2, 2, 2)"),
            ("P(1, 2, 3) in plane y - z = 0", "IV", "(1, 3, 2)", "k = -2(2 - 3)/2 = 1; image = (1, 2 + 1, 3 - 1) = (1, 3, 2)"),
            ("P(3, 1, 5) in plane x + y + z - 3 = 0", "III", "(-1, -3, 1)", "k = -2(3 + 1 + 5 - 3)/3 = -4; image = (3 - 4, 1 - 4, 5 - 4) = (-1, -3, 1)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match each line and plane pair in List I with their unique point of intersection in List II:",
        [
            ("Line (x - 1)/2 = (y + 1)/3 = (z - 2)/1 and Plane 2x + y + z = 11", "III", "(3, 2, 3)", "Point is (2t+1, 3t-1, t+2); 2(2t+1) + (3t-1) + (t+2) = 8t + 3 = 11 ⇒ t = 1; point = (3, 2, 3)"),
            ("Line (x + 1)/1 = (y - 1)/2 = (z - 2)/2 and Plane x + y + z = 7", "IV", "(0, 3, 4)", "Point is (t-1, 2t+1, 2t+2); (t-1) + (2t+1) + (2t+2) = 5t + 2 = 7 ⇒ t = 1; point = (0, 3, 4)"),
            ("Line x/1 = (y - 1)/(-1) = (z + 1)/1 and Plane 2x - y + 3z = 2", "I", "(1, 0, 0)", "Point is (t, 1-t, t-1); 2t - (1-t) + 3(t-1) = 6t - 4 = 2 ⇒ t = 1; point = (1, 0, 0)"),
            ("Line (x - 2)/3 = (y + 1)/4 = (z - 2)/12 and Plane x - y + z = 16", "II", "(5, 3, 14)", "Point is (3t+2, 4t-1, 12t+2); (3t+2) - (4t-1) + (12t+2) = 11t + 5 = 16 ⇒ t = 1; point = (5, 3, 14)"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match the coplanarity condition of two lines in List I with the corresponding value of parameter k in List II:",
        [
            ("Lines (x - 1)/2 = (y - 2)/3 = (z - 3)/4 and (x - 2)/1 = (y - 3)/2 = (z - k)/3 are coplanar", "IV", "4", "Determinant with Δ = (1, 1, k-3), b₁ = (2, 3, 4), b₂ = (1, 2, 3) gives 1(1) - 1(2) + (k-3)(1) = k - 4 = 0 ⇒ k = 4"),
            ("Lines (x - 1)/1 = (y - 2)/1 = (z - 1)/2 and x/2 = y/1 = z/k are coplanar", "III", "5", "Determinant with Δ = (1, 2, 1), b₁ = (1, 1, 2), b₂ = (2, 1, k) gives 1(k-2) - 2(k-4) + 1(1-2) = -k + 5 = 0 ⇒ k = 5"),
            ("Lines (x - 1)/1 = (y - 1)/0 = (z - 1)/1 and x/2 = y/1 = z/k are coplanar", "I", "2", "Determinant with Δ = (1, 1, 1), b₁ = (1, 0, 1), b₂ = (2, 1, k) gives 1(-1) - 1(k-2) + 1(1) = 2 - k = 0 ⇒ k = 2"),
            ("Lines (x - 1)/1 = y/1 = (z - 1)/0 and x/2 = y/1 = z/k are coplanar", "II", "1", "Determinant with Δ = (1, 0, 1), b₁ = (1, 1, 0), b₂ = (2, 1, k) gives 1(k) + 1(1-2) = k - 1 = 0 ⇒ k = 1"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match each pair of lines in List I with the shortest distance between them in List II:",
        [
            ("Lines r = (1, 2, 3) + λ(1, -3, 2) and r = (4, 5, 6) + μ(2, 3, 1)", "I", "3/√19", "b₁ × b₂ = (-9, 3, 9); |b₁ × b₂| = 3√19; (a₂ - a₁)·(b₁ × b₂) = 9; d = 9/(3√19) = 3/√19"),
            ("Lines (x - 3)/3 = (y - 8)/(-1) = (z - 3)/1 and (x + 3)/(-3) = (y + 7)/2 = (z - 6)/4", "IV", "3√30", "a₂ - a₁ = (-6, -15, 3); b₁ × b₂ = (-6, -15, 3); d = |270| / (3√30) = 3√30"),
            ("Lines (x - 1)/2 = (y - 2)/3 = (z - 3)/4 and (x - 2)/3 = (y - 4)/4 = (z - 5)/5", "II", "1/√6", "b₁ × b₂ = (-1, 2, -1); |b₁ × b₂| = √6; (a₂ - a₁)·(b₁ × b₂) = 1; d = 1/√6"),
            ("Parallel lines x/1 = y/0 = z/0 and x/1 = (y - 3)/0 = (z - 4)/0", "III", "5", "Distance between parallel lines along x-axis with offset Δy = 3, Δz = 4 is √(3² + 4²) = 5"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "For the point P(1, 2, 3) and line L: (x - 6)/3 = (y - 7)/2 = (z - 7)/(-2), match the geometric quantities in List I with their values in List II:",
        [
            ("Coordinates of the foot of the perpendicular from P to line L", "II", "(3, 5, 9)", "General point Q(3λ+6, 2λ+7, -2λ+7); PQ ⊥ L gives 17λ + 17 = 0 ⇒ λ = -1; Q = (3, 5, 9)"),
            ("Perpendicular distance from P to line L", "I", "7", "|PQ| = √((3-1)² + (5-2)² + (9-3)²) = √(4 + 9 + 36) = √49 = 7"),
            ("Coordinates of the mirror image of P in line L", "IV", "(5, 8, 15)", "Image P' = 2Q - P = (6 - 1, 10 - 2, 18 - 3) = (5, 8, 15)"),
            ("Distance from P(1, 2, 3) to the point A(6, 7, 7) on the line", "III", "√66", "|PA| = √((6-1)² + (7-2)² + (7-3)²) = √(25 + 25 + 16) = √66"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "For the line of intersection of planes π₁: x + 2y - z = 1 and π₂: 2x - y + z = 2, match the geometric quantities in List I with their values in List II:",
        [
            ("Direction ratios of the line of intersection", "III", "(1, -3, -5)", "n₁ × n₂ = (1, 2, -1) × (2, -1, 1) = (1, -3, -5)"),
            ("Point of intersection of the line with the plane x = 0", "IV", "(0, 3, 5)", "Setting x = 0 gives 2y - z = 1 and -y + z = 2 ⇒ y = 3, z = 5; point is (0, 3, 5)"),
            ("Equation of the plane passing through the line and the origin", "I", "5y - 3z = 0", "π₁ + λπ₂ = 0 passing through (0,0,0) yields λ = -1/2 ⇒ 2(x+2y-z-1) - (2x-y+z-2) = 5y - 3z = 0"),
            ("Acute angle between the planes π₁ and π₂", "II", "arccos(1/6)", "cos θ = |1(2) + 2(-1) - 1(1)| / (√6 · √6) = |-1|/6 = 1/6 ⇒ θ = arccos(1/6)"),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Two lines L₁: (x - 1)/2 = (y - 2)/3 = (z - 3)/4 and L₂: (x - 2)/3 = (y - 3)/4 = (z - 4)/5 intersect at a point. Match the geometric quantities in List I with their values in List II:",
        [
            ("Point of intersection of lines L₁ and L₂", "I", "(-1, -1, -1)", "Equating parameters gives t = -1 on L₁ and s = -1 on L₂, yielding intersection point (-1, -1, -1)"),
            ("Direction ratios of the normal to the plane containing both lines", "IV", "(1, -2, 1)", "Normal n = b₁ × b₂ = (2, 3, 4) × (3, 4, 5) = (-1, 2, -1) ~ (1, -2, 1)"),
            ("Equation of the plane containing both lines", "III", "x - 2y + z = 0", "1(x + 1) - 2(y + 1) + 1(z + 1) = 0 ⇒ x - 2y + z = 0"),
            ("Perpendicular distance from point (2, 1, 3) to this plane", "II", "√6 / 2", "Distance = |2 - 2(1) + 3| / √(1 + 4 + 1) = 3/√6 = √6 / 2"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "For the family of planes (x + 2y + 3z - 4) + λ(2x + y - z + 5) = 0 passing through the intersection of two planes, match the condition in List I with the value of λ in List II:",
        [
            ("The plane is perpendicular to the plane 3x - y - z = 0", "IV", "1/3", "3(1 + 2λ) - 1(2 + λ) - 1(3 - λ) = 6λ - 2 = 0 ⇒ λ = 1/3"),
            ("The plane is parallel to the x-axis", "I", "-1/2", "Coefficient of x must be 0: 1 + 2λ = 0 ⇒ λ = -1/2"),
            ("The plane passes through the point (1, 1, 1)", "II", "-2/7", "(1 + 2 + 3 - 4) + λ(2 + 1 - 1 + 5) = 2 + 7λ = 0 ⇒ λ = -2/7"),
            ("The plane is perpendicular to the line x/1 = y/2 = z/3", "III", "0", "(1+2λ)/1 = (2+λ)/2 = (3-λ)/3 holds simultaneously when λ = 0"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Consider the sphere S: x² + y² + z² - 2x - 4y + 2z - 3 = 0 and plane π: 2x - 2y + z + 12 = 0. Match the geometric properties in List I with their descriptions/values in List II:",
        [
            ("Center of the sphere S", "II", "(1, 2, -1)", "Center is (-(-2)/2, -(-4)/2, -(2)/2) = (1, 2, -1)"),
            ("Radius of the sphere S", "I", "3", "Radius R = √(1² + 2² + (-1)² - (-3)) = √(1 + 4 + 1 + 3) = √9 = 3"),
            ("Geometric relation between plane π and sphere S", "IV", "Plane touches sphere (tangent plane)", "Distance from center to plane is |2(1) - 2(2) + (-1) + 12|/3 = 9/3 = 3 = R, so it is a tangent plane"),
            ("Point of tangency of plane π with sphere S", "III", "(-1, 4, -2)", "Foot of perpendicular from center (1, 2, -1) to plane is (1 + 2(-1), 2 - 2(-1), -1 + 1(-1)) = (-1, 4, -2)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "For the line of intersection of planes x + y - z = 1 and 2x - y + z = 2, match the geometric quantities in List I with their values in List II:",
        [
            ("Direction ratios of the line of intersection", "III", "(0, 1, 1)", "Adding equations gives 3x = 3 ⇒ x = 1, then y = z; line has direction (0, 1, 1)"),
            ("A point lying on the line of intersection", "IV", "(1, 0, 0)", "Setting y = 0 gives z = 0, x = 1; point is (1, 0, 0)"),
            ("Perpendicular distance from the origin (0, 0, 0) to this line", "I", "1", "Distance from origin to line x=1, y=z is √((1-0)² + 0) = 1"),
            ("Perpendicular distance from the point (1, 2, 4) to this line", "II", "√2", "Closest point on line x=1, y=z is (1, 3, 3); distance = √((2-3)² + (4-3)²) = √(1 + 1) = √2"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Consider lines L₁: r = λ(1, 0, 0) (the x-axis) and L₂: r = (0, 2, 3) + μ(0, 1, 0). Match the shortest distance properties in List I with their values in List II:",
        [
            ("Shortest distance between lines L₁ and L₂", "IV", "3", "L₁ lies in z = 0 and L₂ lies in z = 3; both are horizontal and orthogonal, so shortest distance is 3"),
            ("Point on line L₁ closest to line L₂", "II", "(0, 0, 0)", "Distance between (λ, 0, 0) and (0, 2+μ, 3) is √(λ² + (2+μ)² + 9), minimized at λ = 0 ⇒ (0, 0, 0)"),
            ("Point on line L₂ closest to line L₁", "I", "(0, 0, 3)", "Minimized at μ = -2 ⇒ (0, 2 - 2, 3) = (0, 0, 3)"),
            ("Equation of the line of shortest distance", "III", "x/0 = y/0 = z/1", "Line joining (0, 0, 0) and (0, 0, 3) is the z-axis: x/0 = y/0 = z/1"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Consider the planes π₁: 2x - y + 2z + 3 = 0 and π₂: 3x - 2y + 6z + 8 = 0. Match the bisector plane properties in List I with their values/equations in List II:",
        [
            ("Equation of the acute angle bisector plane", "I", "23x - 13y + 32z + 45 = 0", "a₁a₂ + b₁b₂ + c₁c₂ = 6 + 2 + 12 = 20 > 0; acute bisector corresponds to '-' sign: 7(2x-y+2z+3) = -3(3x-2y+6z+8) ⇒ 23x - 13y + 32z + 45 = 0"),
            ("Equation of the obtuse angle bisector plane", "IV", "5x - y - 4z - 3 = 0", "Obtuse bisector corresponds to '+' sign: 7(2x-y+2z+3) = 3(3x-2y+6z+8) ⇒ 5x - y - 4z - 3 = 0"),
            ("Position of the origin with respect to the angles between the planes", "II", "Origin lies in the obtuse angle", "Since constant terms d₁, d₂ have same sign and a₁a₂ + b₁b₂ + c₁c₂ > 0, the origin lies in the obtuse angle"),
            ("Angle between the acute and obtuse bisector planes", "III", "π/2", "The two angle bisector planes are always mutually perpendicular: angle = π/2"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "A variable plane at constant distance p from the origin intersects the coordinate axes at A, B, C. Match the loci and quantities in List I with their formulas in List II:",
        [
            ("Locus of the centroid of triangle ABC", "II", "1/x² + 1/y² + 1/z² = 9/p²", "Plane is lx + my + nz = p; centroid (x,y,z) = (p/(3l), p/(3m), p/(3n)) ⇒ l = p/(3x), etc.; l² + m² + n² = 1 ⇒ 1/x² + 1/y² + 1/z² = 9/p²"),
            ("Locus of the circumcenter of tetrahedron OABC", "I", "1/x² + 1/y² + 1/z² = 4/p²", "Circumcenter is (a/2, b/2, c/2) = (p/(2l), p/(2m), p/(2n)); l² + m² + n² = 1 ⇒ 1/x² + 1/y² + 1/z² = 4/p²"),
            ("Volume of tetrahedron OABC when l = m = n = 1/√3 and p = √3", "IV", "9/2", "Intercepts a = b = c = √3 / (1/√3) = 3; Volume = (1/6)abc = (1/6)(27) = 9/2"),
            ("Area of triangle ABC when l = m = n = 1/√3 and p = √3", "III", "9√3 / 2", "Triangle ABC is equilateral with side 3√2; Area = (√3 / 4)(3√2)² = 18√3 / 4 = 9√3 / 2"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Consider the reflection of line L: (x - 1)/1 = (y - 2)/2 = (z - 3)/3 in the plane π: x + y + z = 6. Match each geometric object in List I with its result in List II:",
        [
            ("Point of intersection of line L with plane π", "III", "(1, 2, 3)", "Substituting (t+1, 2t+2, 3t+3) into x + y + z = 6 gives 6t + 6 = 6 ⇒ t = 0; point is (1, 2, 3)"),
            ("Mirror image of point (2, 4, 6) on line L in plane π", "IV", "(-2, 0, 2)", "k = -2(2 + 4 + 6 - 6)/3 = -4; image = (2 - 4, 4 - 4, 6 - 4) = (-2, 0, 2)"),
            ("Direction ratios of the reflected line", "I", "(3, 2, 1)", "Line joins (1, 2, 3) and (-2, 0, 2); vector = (1 - (-2), 2 - 0, 3 - 2) = (3, 2, 1)"),
            ("Cartesian equation of the reflected line", "II", "(x - 1)/3 = (y - 2)/2 = (z - 3)/1", "Passing through (1, 2, 3) with direction (3, 2, 1): (x - 1)/3 = (y - 2)/2 = (z - 3)/1"),
        ], "D"))

    # ==========================================
    # TOPIC 3: Vectors (20 questions)
    # ==========================================
    t = "Vectors"
    prefix = "math_mat_vectors"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "For vectors a = 2i + j - 2k and b = i - 2j + 2k, match each vector quantity in List I with its value in List II:",
        [
            ("Magnitude |a|", "II", "3", "|a| = √(2² + 1² + (-2)²) = √(4 + 1 + 4) = 3"),
            ("Dot product a · b", "IV", "-4", "a · b = 2(1) + 1(-2) + (-2)(2) = 2 - 2 - 4 = -4"),
            ("Magnitude of cross product |a × b|", "I", "√65", "Lagrange's identity: |a × b|² = |a|²|b|² - (a·b)² = (9)(9) - (-4)² = 81 - 16 = 65 ⇒ |a × b| = √65"),
            ("Scalar projection of a on b", "III", "-4/3", "Scalar projection = (a · b) / |b| = -4 / 3"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the vector products of standard Cartesian unit vectors {i, j, k} in List I with their evaluated results in List II:",
        [
            ("i × j", "IV", "k", "By standard right-hand cyclic rule: i × j = k"),
            ("k × j", "I", "-i", "Inverted cyclic order: k × j = -(j × k) = -i"),
            ("i · (j × k)", "II", "1", "j × k = i, so i · i = 1"),
            ("(i × j) × k", "III", "0", "i × j = k, and k × k = 0 (cross product of any vector with itself is the zero vector)"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "For vector a = 2i + 3j - k, match the condition on vector b in List I with the corresponding value of parameter λ in List II:",
        [
            ("b = 4i + λj - 2k is collinear with a", "II", "6", "Collinearity requires 4/2 = λ/3 = (-2)/(-1) ⇒ λ/3 = 2 ⇒ λ = 6"),
            ("b = λi + 2j + 8k is perpendicular to a", "IV", "1", "a · b = 0 ⇒ 2λ + 3(2) - 1(8) = 0 ⇒ 2λ - 2 = 0 ⇒ λ = 1"),
            ("b = i - λj + 5k satisfies a · b = -9", "I", "2", "a · b = 2(1) + 3(-λ) - 1(5) = -3 - 3λ = -9 ⇒ 3λ = 6 ⇒ λ = 2"),
            ("b = λi - 7j + 2k is perpendicular to c = i + j + 2k", "III", "3", "b · c = 0 ⇒ λ(1) - 7(1) + 2(2) = 0 ⇒ λ - 3 = 0 ⇒ λ = 3"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match each geometric figure described in List I with its area in List II:",
        [
            ("Parallelogram with adjacent sides a = 3i + j - 2k and b = i - 3j + 4k", "I", "10√3", "a × b = (-2, -14, -10); Area = |a × b| = 2√(1 + 49 + 25) = 2√75 = 10√3"),
            ("Triangle with vertices A(1, 0, 0), B(0, 2, 0), and C(0, 0, 3)", "III", "7/2", "AB = (-1, 2, 0), AC = (-1, 0, 3); AB × AC = (6, 3, 2); Area = (1/2)√(36 + 9 + 4) = 7/2"),
            ("Parallelogram with diagonals d₁ = 2i + 4j - 6k and d₂ = 4i - 2j + 4k", "IV", "6√10", "d₁ × d₂ = (4, -32, -20); Area = (1/2)|d₁ × d₂| = (1/2)(4√90) = 6√10"),
            ("Triangle with adjacent sides a = 2i + 3j and b = -i + 4k", "II", "√217 / 2", "a × b = (12, -8, 3); Area = (1/2)√(144 + 64 + 9) = √217 / 2"),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Let a and b be unit vectors with angle θ between them. Match each vector expression in List I with its simplified trigonometric value in List II:",
        [
            ("|a + b|", "III", "2 cos(θ/2)", "|a + b|² = 1 + 1 + 2 cos θ = 2(1 + cos θ) = 4 cos²(θ/2) ⇒ |a + b| = 2 cos(θ/2)"),
            ("|a - b|", "I", "2 sin(θ/2)", "|a - b|² = 1 + 1 - 2 cos θ = 2(1 - cos θ) = 4 sin²(θ/2) ⇒ |a - b| = 2 sin(θ/2)"),
            ("|a × b|", "IV", "sin θ", "|a × b| = |a||b| sin θ = 1 · 1 · sin θ = sin θ"),
            ("(a + b) · (a - b)", "II", "0", "(a + b) · (a - b) = |a|² - |b|² = 1 - 1 = 0"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "For vectors a = i + j + k, b = i - j + k, and c = i + 2j - k, match the triple product quantities in List I with their values in List II:",
        [
            ("Volume of parallelepiped with edges a, b, c, given by [a b c]", "IV", "4", "Determinant with rows (1,1,1), (1,-1,1), (1,2,-1) gives 1(1-2) - 1(-1-1) + 1(2 - (-1)) = -1 + 2 + 3 = 4"),
            ("Volume of tetrahedron with coterminous edges a, b, c", "I", "2/3", "Volume = (1/6)[a b c] = (1/6)(4) = 2/3"),
            ("Scalar triple product [2a  3b  c]", "II", "24", "[2a  3b  c] = 2 · 3 · 1 · [a b c] = 6 · 4 = 24"),
            ("Scalar triple product [a+b  b+c  c+a]", "III", "8", "Identity [a+b  b+c  c+a] = 2[a b c] = 2 · 4 = 8"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "For vectors a = i + j, b = j + k, and c = i + k, match each vector triple product expression in List I with its simplified vector in List II:",
        [
            ("a × (b × c)", "II", "-i + j", "a·c = 1, a·b = 1; a × (b × c) = (a·c)b - (a·b)c = 1(j+k) - 1(i+k) = -i + j"),
            ("(a × b) × c", "I", "-i + k", "(a·c)b - (b·c)a; with a·c = 1, b·c = 1 gives 1(j+k) - 1(i+j) = -i + k"),
            ("b × (c × a)", "IV", "-j + k", "b·a = 1, b·c = 1; (b·a)c - (b·c)a = 1(i+k) - 1(i+j) = -j + k"),
            ("a × (b × c) + b × (c × a) + c × (a × b)", "III", "0", "By Jacobi's Identity for vector triple products, the cyclic sum is identically the zero vector 0"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match the coplanarity condition in List I with the corresponding value of parameter λ in List II:",
        [
            ("Points A(3, 2, 1), B(4, λ, 5), C(4, 2, -2), D(6, 5, -1) are coplanar", "III", "5", "Determinant of AB=(1, λ-2, 4), AC=(1, 0, -3), AD=(3, 3, -2) gives 35 - 7λ = 0 ⇒ λ = 5"),
            ("Vectors 2i - j + k, i + 2j - 3k, and 3i + λj + 5k are coplanar", "IV", "-4", "Determinant with rows (2,-1,1), (1,2,-3), (3,λ,5) gives 7λ + 28 = 0 ⇒ λ = -4"),
            ("Vectors i + 3j + k, 2i - j - k, and λi + 7j + 3k are coplanar", "I", "0", "Determinant with rows (1,3,1), (2,-1,-1), (λ,7,3) gives -2λ = 0 ⇒ λ = 0"),
            ("[a+b  b+c  c+λa] = 0 for non-coplanar vectors a, b, c", "II", "-1", "Identity gives [a+b  b+c  c+λa] = (1 + λ)[a b c] = 0 ⇒ λ = -1"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "For vectors a = 2i + 3j + 6k and b = i + 2j + 2k, match each projection/component quantity in List I with its value in List II:",
        [
            ("Scalar projection of a along b", "IV", "20/3", "|b| = √(1 + 4 + 4) = 3; a · b = 2(1) + 3(2) + 6(2) = 20; projection = 20/3"),
            ("Vector component of a parallel to b", "III", "(20/9)(i + 2j + 2k)", "a_parallel = ((a · b)/|b|²)b = (20/9)(i + 2j + 2k)"),
            ("Vector component of a perpendicular to b", "I", "(1/9)(-2i - 13j + 14k)", "a_perp = a - a_parallel = (2, 3, 6) - (20/9, 40/9, 40/9) = (1/9)(-2i - 13j + 14k)"),
            ("Magnitude of the component of a perpendicular to b", "II", "√41 / 3", "|a_perp| = √(|a|² - (a_parallel)²) = √(49 - 400/9) = √(41/9) = √41 / 3"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Let vectors a and b satisfy |a| = 2, |b| = 5, and a · b = 8. Match each expression in List I with its exact value in List II:",
        [
            ("|a × b|", "I", "6", "Lagrange's identity: |a × b|² = |a|²|b|² - (a·b)² = 4(25) - 64 = 36 ⇒ |a × b| = 6"),
            ("|a + b|", "IV", "3√5", "|a + b|² = |a|² + |b|² + 2(a · b) = 4 + 25 + 16 = 45 ⇒ |a + b| = √45 = 3√5"),
            ("|a - b|", "II", "√13", "|a - b|² = |a|² + |b|² - 2(a · b) = 4 + 25 - 16 = 13 ⇒ |a - b| = √13"),
            ("|a × b|² + (a · b)²", "III", "100", "By Lagrange's identity, |a × b|² + (a · b)² = |a|²|b|² = 4 · 25 = 100"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Let {a, b, c} be a non-coplanar system of vectors with scalar triple product [a b c] = 4, and let {a', b', c'} be its reciprocal system. Match List I with List II:",
        [
            ("a · a' + b · b' + c · c'", "II", "3", "By definition of reciprocal vectors, a · a' = b · b' = c · c' = 1, so the sum is 1 + 1 + 1 = 3"),
            ("Scalar triple product of reciprocal vectors [a'  b'  c']", "I", "1/4", "[a'  b'  c'] = 1 / [a b c] = 1/4"),
            ("Dot product a · b'", "IV", "0", "a · b' = a · ((c × a)/[a b c]) = [a c a]/[a b c] = 0 (since two vectors are identical)"),
            ("Scalar triple product [2a  2b  2c]", "III", "32", "[2a  2b  2c] = 2³ [a b c] = 8 · 4 = 32"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match each set of vectors in List I with its linear dependence status and dimension of its span in List II:",
        [
            ("{i + j, j + k, k + i}", "III", "Linearly independent, span dimension 3", "Determinant with rows (1,1,0), (0,1,1), (1,0,1) is 2 ≠ 0; they are linearly independent and span ℝ³"),
            ("{i - j, j - k, k - i}", "IV", "Linearly dependent, span dimension 2", "The sum of the three vectors is 0; any two are independent, so they span a 2D plane"),
            ("{2i - 4j + 6k, -3i + 6j - 9k}", "I", "Linearly dependent, span dimension 1", "The second vector is (-3/2) times the first; they are collinear, spanning a 1D line"),
            ("{0} (the singleton containing the zero vector)", "II", "Linearly dependent, span dimension 0", "Any set containing the zero vector is linearly dependent; span({0}) = {0} with dimension 0"),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Match the vector equation or geometric condition in List I with the resulting vector r in List II:",
        [
            ("r satisfying r × b = a × b and r · b = 0, where a = 2i + j + k and b = i + 2j - k", "I", "(3/2)(i + k)", "r = a + λb; r · b = a · b + λ|b|² = 3 + 6λ = 0 ⇒ λ = -1/2; r = a - (1/2)b = (3/2)i + (3/2)k"),
            ("r satisfying r + r × a = b where a = i, b = j", "IV", "(1/2)(j + k)", "Dotting and crossing with a gives r(1 + |a|²) = b + (b·a)a + a×b = j + 0 + k = j + k ⇒ r = (1/2)(j + k)"),
            ("r satisfying r × i = j and r · i = 0", "II", "k", "r is perpendicular to i; r × i = j implies r = k since k × i = j"),
            ("Unit vector r perpendicular to both i + j and j + k with positive k component", "III", "(1/√3)(i - j + k)", "(i + j) × (j + k) = i - j + k; normalizing gives (1/√3)(i - j + k)"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match the four-vector product expressions in List I with their standard vector identities in List II:",
        [
            ("(a × b) · (c × d)", "II", "(a·c)(b·d) - (a·d)(b·c)", "Lagrange's identity for scalar product of four vectors: (a × b) · (c × d) = (a·c)(b·d) - (a·d)(b·c)"),
            ("(a × b) × (c × d)", "IV", "[a b d]c - [a b c]d", "Treating (a × b) as a single vector: ((a × b)·d)c - ((a × b)·c)d = [a b d]c - [a b c]d"),
            ("[a × b  b × c  c × a]", "I", "[a b c]²", "Standard JEE Advanced identity: scalar triple product of the cross products equals [a b c]²"),
            ("[a + b  b + c  c + a]", "III", "2[a b c]", "Determinant expansion yields [a b c] + [b c a] = 2[a b c]"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Let u, v, w be unit vectors in ℝ³ such that u + v + w = 0. Match the expressions in List I with their values in List II:",
        [
            ("u · v + v · w + w · u", "IV", "-3/2", "|u + v + w|² = |u|² + |v|² + |w|² + 2(u·v + v·w + w·u) = 3 + 2S = 0 ⇒ S = -3/2"),
            ("|u - v|² + |v - w|² + |w - u|²", "I", "9", "Sum = 2(|u|² + |v|² + |w|²) - 2(u·v + v·w + w·u) = 2(3) - 2(-3/2) = 6 + 3 = 9"),
            ("Magnitude of cross product |u × v|", "II", "√3 / 2", "Vectors form an equilateral triangle with 120° between any pair: |u × v| = 1 · 1 · sin 120° = √3 / 2"),
            ("Scalar triple product [u v w]", "III", "0", "Since u + v + w = 0, the three vectors are coplanar, so [u v w] = 0"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Let a, b, c be unit vectors such that a × (b × c) = (√3 / 2)b + (1/2)c, with b and c non-collinear. Match List I with List II:",
        [
            ("Angle between vectors a and c", "III", "π/6", "a × (b × c) = (a·c)b - (a·b)c = (√3/2)b + (1/2)c ⇒ a·c = √3/2 ⇒ angle = π/6"),
            ("Angle between vectors a and b", "IV", "2π/3", "-(a·b) = 1/2 ⇒ a·b = -1/2 ⇒ angle = 2π/3"),
            ("Value of |a + 2b - 2c|² when b ⊥ c", "I", "7 - 2√3", "|a|² + 4|b|² + 4|c|² + 4(a·b) - 4(a·c) - 8(b·c) = 1 + 4 + 4 + 4(-1/2) - 4(√3/2) - 0 = 7 - 2√3"),
            ("Value of (a · b)² + (a · c)²", "II", "1", "(-1/2)² + (√3/2)² = 1/4 + 3/4 = 1"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "In tetrahedron OABC, edges OA, OB, OC are mutually perpendicular with lengths a = 2, b = 3, c = 4. Match the geometric quantities in List I with their values in List II:",
        [
            ("Vector sum of outward vector areas of all four faces S₁ + S₂ + S₃ + S_ABC", "I", "0", "For any closed polyhedron, the vector sum of outward normal area vectors is identically zero vector 0"),
            ("Volume of tetrahedron OABC", "IV", "4", "Volume = (1/6)abc = (1/6)(2 · 3 · 4) = 4"),
            ("Scalar area of triangular face ABC", "II", "√61", "Area = (1/2)√((ab)² + (bc)² + (ca)²) = (1/2)√(36 + 144 + 64) = (1/2)√244 = √61"),
            ("Inradius of tetrahedron OABC", "III", "(13 - √61) / 9", "r = 3V / S_total = 12 / (13 + √61) = 12(13 - √61) / 108 = (13 - √61) / 9"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match each vector equation for position vector r in List I with its geometric surface or line locus in List II:",
        [
            ("(r - a) · (r - b) = 0", "II", "Sphere with diameter segment AB", "Vectors (r - a) and (r - b) are orthogonal for all points on the sphere having AB as diameter"),
            ("r · n = d (where n is a non-zero vector and d is a constant)", "IV", "Plane with normal vector n", "Standard vector equation of a plane with normal vector n"),
            ("|r - a| = |r - b|", "I", "Perpendicular bisector plane of segment AB", "Equidistant points from a and b form the perpendicular bisector plane"),
            ("r = a + λb (where λ ∈ ℝ)", "III", "Straight line passing through point a parallel to vector b", "Parametric vector equation of a straight line"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "For vectors a = 2i + j + 2k and b = i + 2j - k, match each vector quantity in List I with its value in List II:",
        [
            ("Cross product a × b", "IV", "-5i + 4j + 3k", "a × b = (1(-1) - 2(2))i - (2(-1) - 2(1))j + (2(2) - 1(1))k = -5i + 4j + 3k"),
            ("Magnitude |a × b|", "I", "5√2", "|a × b| = √((-5)² + 4² + 3²) = √(25 + 16 + 9) = √50 = 5√2"),
            ("Acute angle θ between vectors a and b", "II", "arccos(√6 / 9)", "a · b = 2(1) + 1(2) + 2(-1) = 2; |a| = 3, |b| = √6; cos θ = 2 / (3√6) = √6 / 9 ⇒ θ = arccos(√6 / 9)"),
            ("Scalar projection of a × b on the vector i + j + k", "III", "2/√3", "Projection = ((a × b) · (i + j + k)) / √3 = (-5 + 4 + 3) / √3 = 2/√3"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "For linearly independent vectors a, b, c, match the Gram determinant and reciprocal system properties in List I with their values in List II:",
        [
            ("Determinant of the 3×3 Gram matrix G where G_ij = v_i · v_j", "I", "[a b c]²", "The Gram determinant det(G) for three vectors in ℝ³ equals the square of their scalar triple product [a b c]²"),
            ("Value of [a b c] if a, b, c are mutually orthogonal with lengths 1, 2, 3", "III", "6", "For mutually orthogonal vectors, [a b c] = |a||b||c| = 1 · 2 · 3 = 6"),
            ("Magnitude |a'| of reciprocal vector a' for this orthogonal system", "IV", "1", "|a'| = |b × c| / [a b c] = (2 · 3) / 6 = 1 = 1/|a|"),
            ("Magnitude |c'| of reciprocal vector c' for this orthogonal system", "II", "1/3", "|c'| = |a × b| / [a b c] = (1 · 2) / 6 = 2/6 = 1/3 = 1/|c|"),
        ], "D"))

    return qs
