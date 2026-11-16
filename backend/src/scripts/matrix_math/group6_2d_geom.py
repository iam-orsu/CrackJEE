from builder import make_matrix_q

def get_questions():
    qs = []

    # ==========================================
    # TOPIC: Straight Lines (20 questions)
    # ==========================================
    t = "Straight Lines"
    prefix = "math_mat_lines"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "For the straight line L: 3x - 4y + 12 = 0, match the geometric properties in List I with their values in List II:",
        [
            ("Slope of L", "III", "3/4", "Slope m = -a/b = -3/(-4) = 3/4"),
            ("x-intercept of L", "I", "-4", "Setting y = 0 gives 3x + 12 = 0 => x = -4"),
            ("y-intercept of L", "IV", "3", "Setting x = 0 gives -4y + 12 = 0 => y = 3"),
            ("Perpendicular distance from origin", "II", "12/5", "Distance d = |12|/√(3² + 4²) = 12/5"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the pairs of parallel lines in List I with the distance between them in List II:",
        [
            ("3x + 4y - 7 = 0 and 3x + 4y + 13 = 0", "II", "4", "Distance d = |13 - (-7)|/√(3² + 4²) = 20/5 = 4"),
            ("5x + 12y - 10 = 0 and 5x + 12y + 29 = 0", "IV", "3", "Distance d = |29 - (-10)|/√(5² + 12²) = 39/13 = 3"),
            ("x - y + 1 = 0 and x - y - 3 = 0", "I", "2√2", "Distance d = |-3 - 1|/√2 = 4/√2 = 2√2"),
            ("6x + 8y - 5 = 0 and 3x + 4y + 5 = 0", "III", "3/2", "Rewriting second line as 6x + 8y + 10 = 0 gives d = |10 - (-5)|/10 = 15/10 = 3/2"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each point and line in List I with the perpendicular distance from the point to the line in List II:",
        [
            ("Point (1, 1) and line 3x + 4y - 12 = 0", "IV", "1", "d = |3(1) + 4(1) - 12|/5 = |-5|/5 = 1"),
            ("Point (2, 3) and line 5x + 12y - 7 = 0", "II", "3", "d = |5(2) + 12(3) - 7|/13 = 39/13 = 3"),
            ("Point (-1, 2) and line 4x - 3y - 10 = 0", "III", "4", "d = |4(-1) - 3(2) - 10|/5 = |-20|/5 = 4"),
            ("Point (0, 0) and line 8x + 15y - 34 = 0", "I", "2", "d = |-34|/√(64 + 225) = 34/17 = 2"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "For a triangle with vertices at A(0, 0), B(6, 0), and C(0, 8), match the triangle centers in List I with their coordinates in List II:",
        [
            ("Centroid G", "I", "(2, 8/3)", "G = ((0+6+0)/3, (0+0+8)/3) = (2, 8/3)"),
            ("Circumcenter S", "III", "(3, 4)", "Right triangle at origin: circumcenter is midpoint of hypotenuse BC = (3, 4)"),
            ("Orthocenter H", "II", "(0, 0)", "Right triangle at origin: orthocenter is the vertex with right angle = (0, 0)"),
            ("Incenter I", "IV", "(2, 2)", "Inradius r = (6 + 8 - 10)/2 = 2; center I = (2, 2)"),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each point and line in List I with the foot of the perpendicular from the point to the line in List II:",
        [
            ("Point (2, 3) to line x + y - 1 = 0", "II", "(0, 1)", "(x-2)/1 = (y-3)/1 = -(2+3-1)/2 = -2 => (0, 1)"),
            ("Point (1, 2) to line 2x - y + 5 = 0", "IV", "(-1, 3)", "(x-1)/2 = (y-2)/(-1) = -(2-2+5)/5 = -1 => x = 1 - 2 = -1, y = 2 + 1 = 3 => (-1, 3)"),
            ("Point (0, 0) to line 3x + 4y - 25 = 0", "I", "(3, 4)", "(x-0)/3 = (y-0)/4 = -(-25)/25 = 1 => (3, 4)"),
            ("Point (2, 4) to line x - y = 0", "III", "(3, 3)", "(x-2)/1 = (y-4)/(-1) = -(2-4)/2 = 1 => x = 3, y = 3 => (3, 3)"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match each point and line in List I with the image (reflection) of the point with respect to the line in List II:",
        [
            ("Point (1, 2) in line x + y - 1 = 0", "III", "(-1, 0)", "(x-1)/1 = (y-2)/1 = -2(1+2-1)/2 = -2 => x = -1, y = 0 => (-1, 0)"),
            ("Point (3, 4) in line y = x", "I", "(4, 3)", "Reflection across y = x swaps coordinates: (4, 3)"),
            ("Point (2, -3) in line y = 0 (x-axis)", "IV", "(2, 3)", "Reflection in x-axis negates y-coordinate: (2, 3)"),
            ("Point (0, 0) in line 3x + 4y - 50 = 0", "II", "(12, 16)", "(x-0)/3 = (y-0)/4 = -2(-50)/25 = 4 => x = 12, y = 16 => (12, 16)"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match the line pairs and conditions in List I with their angle bisector equations in List II:",
        [
            ("Acute angle bisector of 3x - 4y + 7 = 0 and -12x - 5y + 2 = 0", "IV", "11x - 3y + 9 = 0", "a1 a2 + b1 b2 = -36 + 20 = -16 < 0; '+' gives acute bisector: (3x-4y+7)/5 = (-12x-5y+2)/13 => 11x - 3y + 9 = 0"),
            ("Obtuse angle bisector of 3x - 4y + 7 = 0 and -12x - 5y + 2 = 0", "II", "21x + 77y - 101 = 0", "'-' gives obtuse bisector: (3x-4y+7)/5 = -(-12x-5y+2)/13 => 21x + 77y - 101 = 0"),
            ("Bisector of coordinate axes containing Quadrant I and III", "I", "x - y = 0", "Bisects the angle between positive axes: y = x => x - y = 0"),
            ("Bisector of coordinate axes containing Quadrant II and IV", "III", "x + y = 0", "Bisects the second and fourth quadrants: y = -x => x + y = 0"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match the sets of three concurrent lines in List I with the value of the parameter k in List II:",
        [
            ("x + 2y - 5 = 0, 2x - y - 5 = 0, and kx + y - 1 = 0", "I", "0", "Intersection of first two is (3, 1); substituting into third gives 3k + 1 - 1 = 0 => k = 0"),
            ("2x + y - 5 = 0, x - y - 1 = 0, and 4x + ky - 11 = 0", "III", "3", "Intersection is (2, 1); substituting gives 4(2) + k(1) - 11 = 0 => k = 3"),
            ("x + y - 4 = 0, 2x - y - 2 = 0, and kx - 3y + 2 = 0", "II", "2", "Intersection is (2, 2); substituting gives 2k - 6 + 2 = 0 => k = 2"),
            ("3x - 2y - 7 = 0, x + y - 4 = 0, and 2x + ky - 5 = 0", "IV", "-1", "Intersection is (3, 1); substituting gives 2(3) + k(1) - 5 = 0 => k = -1"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "For the family of lines passing through the intersection of 2x + y - 4 = 0 and x - y + 1 = 0 (point P(1, 2)), match the geometric conditions in List I with the line equations in List II:",
        [
            ("Line passing through the origin (0, 0)", "II", "2x - y = 0", "Slope m = (2-0)/(1-0) = 2 => y = 2x => 2x - y = 0"),
            ("Line parallel to 3x + y = 0", "IV", "3x + y - 5 = 0", "Slope m = -3 => y - 2 = -3(x - 1) => 3x + y - 5 = 0"),
            ("Line perpendicular to 2x - 3y = 0", "I", "3x + 2y - 7 = 0", "Slope m = -3/2 => y - 2 = -3/2(x - 1) => 3x + 2y - 7 = 0"),
            ("Line with equal positive intercepts on both axes", "III", "x + y - 3 = 0", "Slope m = -1 => x + y = a; since (1, 2) lies on it, 1 + 2 = 3 => x + y - 3 = 0"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the sets of lines forming a triangle in List I with the area of the triangle in List II:",
        [
            ("Coordinate axes and line 3x + 4y - 24 = 0", "III", "24", "Intercepts are a = 8, b = 6; Area = (1/2)(8)(6) = 24"),
            ("Coordinate axes and line x + y - 6 = 0", "I", "18", "Intercepts are a = 6, b = 6; Area = (1/2)(6)(6) = 18"),
            ("Lines y = x, y = -x, and y = 4", "IV", "16", "Vertices at (0, 0), (4, 4), (-4, 4); Area = (1/2)(base 8)(height 4) = 16"),
            ("Lines y = 0, y = 2x, and x + y = 6", "II", "12", "Vertices are (0, 0), (6, 0), and intersection (2, 4); Area = (1/2)(6)(4) = 12"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match each pair of lines passing through the origin in List I with the tangent of the acute angle tan θ (or condition) between them in List II:",
        [
            ("2x² + 7xy + 3y² = 0", "IV", "1", "tan θ = 2√(49/4 - 6)/|2 + 3| = 2(5/2)/5 = 1"),
            ("x² - 4xy + y² = 0", "II", "√3", "tan θ = 2√(4 - 1)/|1 + 1| = 2√3/2 = √3"),
            ("3x² + 8xy - 3y² = 0", "I", "Perpendicular (θ = π/2)", "a + b = 3 + (-3) = 0 => lines are mutually perpendicular"),
            ("4x² + 12xy + 9y² = 0", "III", "0 (Coincident lines)", "h² - ab = 36 - 36 = 0 => (2x + 3y)² = 0 => lines are coincident, tan θ = 0"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match the second-degree equations in List I with the value of parameter λ in List II for which each represents a pair of straight lines:",
        [
            ("2x² + 5xy + 2y² + 3x + 3y + λ = 0", "I", "1", "Δ = 0 => 4λ + 45/4 - 9/2 - 9/2 - 25λ/4 = 9/4 - 9λ/4 = 0 => λ = 1"),
            ("x² - xy - 2y² + 3x - 6y + λ = 0", "III", "0", "Factors as (x - 2y)(x + y + 3) = x² - xy - 2y² + 3x - 6y => λ = 0"),
            ("3x² + 10xy + 8y² + 14x + 22y + λ = 0", "II", "15", "Factors as (3x + 4y + 5)(x + 2y + 3) => constant term is 5 × 3 = 15"),
            ("2x² + 3xy - 2y² + 2x + 9y + λ = 0", "IV", "-4", "Factors as (x + 2y - 1)(2x - y + 4) => constant term is (-1)(4) = -4"),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Match each equation of a pair of straight lines in List I with its point of intersection in List II:",
        [
            ("2x² + 5xy + 2y² + 3x + 3y + 1 = 0", "II", "(-1/3, -1/3)", "Solving ∂F/∂x = 4x + 5y + 3 = 0 and ∂F/∂y = 5x + 4y + 3 = 0 yields x = y = -1/3"),
            ("x² - xy - 2y² + 3x - 6y = 0", "IV", "(-2, -1)", "Solving 2x - y + 3 = 0 and -x - 4y - 6 = 0 yields x = -2, y = -1"),
            ("3x² + 10xy + 8y² + 14x + 22y + 15 = 0", "I", "(1, -2)", "Solving 6x + 10y + 14 = 0 and 10x + 16y + 22 = 0 yields x = 1, y = -2"),
            ("x² - y² - 4x - 2y + 3 = 0", "III", "(2, -1)", "Solving 2x - 4 = 0 and -2y - 2 = 0 yields x = 2, y = -1"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match the pairs of lines passing through the origin in List I with their joint equation of angle bisectors in List II:",
        [
            ("2x² + 6xy + 2y² = 0", "III", "x² - y² = 0", "a = b = 2 => (x² - y²)/(a - b) = xy/h => a - b = 0 implies x² - y² = 0"),
            ("x² + 3xy - y² = 0", "I", "3x² - 4xy - 3y² = 0", "a = 1, b = -1, h = 3/2 => (x² - y²)/2 = xy/(3/2) => 3(x² - y²) = 4xy => 3x² - 4xy - 3y² = 0"),
            ("x² + 2xy - 2y² = 0", "IV", "x² - 3xy - y² = 0", "a = 1, b = -2, h = 1 => (x² - y²)/3 = xy/1 => x² - 3xy - y² = 0"),
            ("3x² + 8xy - 3y² = 0", "II", "2x² - 3xy - 2y² = 0", "a = 3, b = -3, h = 4 => (x² - y²)/6 = xy/4 => 2(x² - y²) = 3xy => 2x² - 3xy - 2y² = 0"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match each curve and intersecting line in List I with the joint equation of lines joining the origin to their points of intersection (obtained by homogenization) in List II:",
        [
            ("x² + y² = 9 and x + y = 3", "IV", "2xy = 0", "Line (x+y)/3 = 1 => x² + y² = 9((x+y)/3)² = (x+y)² => 2xy = 0"),
            ("x² + y² = 4 and x = 2", "II", "y² = 0", "Line x/2 = 1 => x² + y² = 4(x/2)² = x² => y² = 0"),
            ("x² + 2y² = 4 and x + 2y = 2", "I", "2xy + y² = 0", "Line (x+2y)/2 = 1 => x² + 2y² = (x+2y)² = x² + 4xy + 4y² => 4xy + 2y² = 0 => 2xy + y² = 0"),
            ("y² = 4x and x - y = 3", "III", "4x² - 4xy - 3y² = 0", "Line (x-y)/3 = 1 => y² = 4x(x-y)/3 => 3y² = 4x² - 4xy => 4x² - 4xy - 3y² = 0"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match the sets of four lines in List I forming a parallelogram with the area of the enclosed parallelogram in List II:",
        [
            ("x + 2y = 1, x + 2y = 5 and 2x - y = 2, 2x - y = 7", "I", "4", "Area = |5 - 1| × |7 - 2| / |1(-1) - 2(2)| = (4 × 5)/5 = 4"),
            ("2x + 3y = 0, 2x + 3y = 6 and 3x - 2y = 1, 3x - 2y = 14", "III", "6", "Area = |6 - 0| × |14 - 1| / |-4 - 9| = (6 × 13)/13 = 6"),
            ("x + y = 2, x + y = 8 and x - y = 1, x - y = 5", "II", "12", "Area = |8 - 2| × |5 - 1| / |-1 - 1| = (6 × 4)/2 = 12"),
            ("3x + 4y = 0, 3x + 4y = 10 and 4x - 3y = 0, 4x - 3y = 20", "IV", "8", "Area = |10 - 0| × |20 - 0| / |-9 - 16| = (10 × 20)/25 = 8"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "For the line L: 2x + 3y - 6 = 0, match the line segments joining points A and B in List I with the ratio in which L divides AB in List II:",
        [
            ("A(1, 2) and B(4, 3)", "II", "2 : 11 externally", "L(1, 2) = 2, L(4, 3) = 11; ratio = -2/11, external division 2 : 11"),
            ("A(0, 0) and B(3, 4)", "IV", "1 : 2 internally", "L(0, 0) = -6, L(3, 4) = 12; ratio = -(-6)/12 = 1/2, internal division 1 : 2"),
            ("A(-1, 1) and B(2, 5)", "I", "5 : 13 internally", "L(-1, 1) = -5, L(2, 5) = 13; ratio = -(-5)/13 = 5/13, internal division 5 : 13"),
            ("A(3, 1) and B(6, -1)", "III", "1 : 1 externally", "L(3, 1) = 3, L(6, -1) = 3; ratio = -3/3 = -1, external division 1 : 1"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match the geometric conditions on a moving point P(x, y) in List I with the resulting locus in List II:",
        [
            ("Sum of squares of distances from (1, 0) and (-1, 0) is 6", "III", "x² + y² = 2", "(x-1)² + y² + (x+1)² + y² = 6 => 2x² + 2y² + 2 = 6 => x² + y² = 2"),
            ("Difference of squares of distances from (2, 0) and (-2, 0) is 8", "I", "x = -1", "(x-2)² + y² - [(x+2)² + y²] = 8 => -8x = 8 => x = -1"),
            ("Point P is equidistant from (2, 3) and (4, -1)", "IV", "x - 2y - 1 = 0", "Perpendicular bisector: midpoint (3, 1), slope 1/2 => y - 1 = (1/2)(x - 3) => x - 2y - 1 = 0"),
            ("Ratio of distances from (1, 0) and (4, 0) is 1 : 2", "II", "x² + y² = 4", "4[(x-1)² + y²] = (x-4)² + y² => 3x² + 3y² = 12 => x² + y² = 4"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "When the coordinate axes are rotated counter-clockwise through an angle of 45° (π/4), match the original equations in (x, y) in List I with their transformed equations in (X, Y) in List II:",
        [
            ("2xy = a²", "IV", "X² - Y² = a²", "x = (X-Y)/√2, y = (X+Y)/√2 => 2xy = X² - Y² = a²"),
            ("x² - y² = c²", "II", "-2XY = c²", "x² - y² = ((X-Y)² - (X+Y)²)/2 = -2XY = c²"),
            ("x + y = √2", "I", "X = 1", "(X-Y)/√2 + (X+Y)/√2 = √2 => √2 X = √2 => X = 1"),
            ("x² + y² = 4", "III", "X² + Y² = 4", "Distance from origin is rotation invariant: X² + Y² = 4"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each point, line, and direction in List I with the distance of the point to the line measured along the specified direction in List II:",
        [
            ("Point (1, 2) to line x + y = 7 measured along θ = 45°", "I", "2√2", "(1 + r/√2) + (2 + r/√2) = 7 => 3 + r√2 = 7 => r = 2√2"),
            ("Point (2, 3) to line 2x - y = 5 measured along θ = 45°", "III", "4√2", "2(2 + r/√2) - (3 + r/√2) = 5 => 1 + r/√2 = 5 => r = 4√2"),
            ("Point (1, -2) to line x - y = 5 along slope tan θ = 3/4", "II", "10", "(1 + 4r/5) - (-2 + 3r/5) = 5 => 3 + r/5 = 5 => r = 10"),
            ("Point (3, 5) to line 2x + 3y = 14 measured along θ = 45°", "IV", "7√2/5", "2(3 + r/√2) + 3(5 + r/√2) = 14 => 21 + 5r/√2 = 14 => |r| = 7√2/5"),
        ], "D"))

    # ==========================================
    # TOPIC: Circles (20 questions)
    # ==========================================
    t = "Circles"
    prefix = "math_mat_circles"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the circles in List I with their center and radius in List II:",
        [
            ("x² + y² - 4x - 6y - 12 = 0", "II", "Center (2, 3), Radius = 5", "Center (-g, -f) = (2, 3); Radius = √(4 + 9 - (-12)) = 5"),
            ("x² + y² + 8x - 6y = 0", "IV", "Center (-4, 3), Radius = 5", "Center = (-4, 3); Radius = √(16 + 9 - 0) = 5"),
            ("x² + y² - 10x + 24y = 0", "I", "Center (5, -12), Radius = 13", "Center = (5, -12); Radius = √(25 + 144) = 13"),
            ("x² + y² + 2x + 4y - 11 = 0", "III", "Center (-1, -2), Radius = 4", "Center = (-1, -2); Radius = √(1 + 4 + 11) = 4"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the diameter endpoints in List I with the equation of the circle in List II:",
        [
            ("(1, 2) and (3, 4)", "III", "x² + y² - 4x - 6y + 11 = 0", "(x-1)(x-3) + (y-2)(y-4) = x² - 4x + 3 + y² - 6y + 8 = x² + y² - 4x - 6y + 11 = 0"),
            ("(0, 0) and (4, 6)", "I", "x² + y² - 4x - 6y = 0", "x(x-4) + y(y-6) = x² + y² - 4x - 6y = 0"),
            ("(-2, 1) and (2, -1)", "IV", "x² + y² - 5 = 0", "(x+2)(x-2) + (y-1)(y+1) = x² - 4 + y² - 1 = x² + y² - 5 = 0"),
            ("(1, 0) and (0, 1)", "II", "x² + y² - x - y = 0", "(x-1)x + y(y-1) = x² - x + y² - y = x² + y² - x - y = 0"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the circles in List I with the length of the intercept they make on the x-axis in List II:",
        [
            ("x² + y² - 6x - 4y + 5 = 0", "IV", "4", "Length = 2√(g² - c) = 2√(9 - 5) = 4"),
            ("x² + y² - 8x + 2y + 7 = 0", "II", "6", "Length = 2√(g² - c) = 2√(16 - 7) = 6"),
            ("x² + y² - 10x - 6y + 9 = 0", "I", "8", "Length = 2√(g² - c) = 2√(25 - 9) = 8"),
            ("x² + y² - 4x + 8y + 3 = 0", "III", "2", "Length = 2√(g² - c) = 2√(4 - 3) = 2"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "For the circle x² + y² = 25, match the points of contact in List I with their tangent equations in List II:",
        [
            ("Point (3, 4)", "I", "3x + 4y = 25", "Tangent is xx1 + yy1 = 25 => 3x + 4y = 25"),
            ("Point (-4, 3)", "III", "4x - 3y = -25", "-4x + 3y = 25 => 4x - 3y = -25"),
            ("Point (5, 0)", "II", "x = 5", "5x + 0y = 25 => x = 5"),
            ("Point (0, -5)", "IV", "y = -5", "0x - 5y = 25 => y = -5"),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each external point and circle in List I with the length of the tangent drawn from the point to the circle in List II:",
        [
            ("Point (5, 5) and circle x² + y² = 9", "II", "√41", "L = √(25 + 25 - 9) = √41"),
            ("Point (4, 3) and circle x² + y² - 2x - 4y + 1 = 0", "IV", "√6", "L = √(16 + 9 - 8 - 12 + 1) = √6"),
            ("Point (0, 5) and circle x² + y² - 4x - 2y - 4 = 0", "I", "√11", "L = √(0 + 25 - 0 - 10 - 4) = √11"),
            ("Point (6, 8) and circle x² + y² = 25", "III", "5√3", "L = √(36 + 64 - 25) = √75 = 5√3"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "For tangents to the circle x² + y² = 16 of the form y = mx + c, match the slope m in List I with the positive value of intercept c in List II:",
        [
            ("m = 1", "III", "4√2", "c = a√(1 + m²) = 4√(1 + 1) = 4√2"),
            ("m = 2", "I", "4√5", "c = 4√(1 + 4) = 4√5"),
            ("m = 3/4", "IV", "5", "c = 4√(1 + 9/16) = 4(5/4) = 5"),
            ("m = √3", "II", "8", "c = 4√(1 + 3) = 8"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "For tangents drawn to the circle x² + y² = 12, match the external points in List I with the equation of their chord of contact in List II:",
        [
            ("Point (3, 3)", "IV", "x + y = 4", "Chord of contact is T = 0: 3x + 3y = 12 => x + y = 4"),
            ("Point (4, 2)", "II", "2x + y = 6", "4x + 2y = 12 => 2x + y = 6"),
            ("Point (6, 0)", "I", "x = 2", "6x = 12 => x = 2"),
            ("Point (2, -4)", "III", "x - 2y = 6", "2x - 4y = 12 => x - 2y = 6"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "For the circle x² + y² - 4x - 6y + 9 = 0 (center at (2, 3)), match the points on the circle in List I with the equations of the normals at those points in List II:",
        [
            ("Point (2, 5)", "I", "x = 2", "Normal passes through center (2, 3) and (2, 5): vertical line x = 2"),
            ("Point (4, 3)", "III", "y = 3", "Normal passes through center (2, 3) and (4, 3): horizontal line y = 3"),
            ("Point (2 + √2, 3 + √2)", "II", "x - y + 1 = 0", "Slope m = √2/√2 = 1 => y - 3 = 1(x - 2) => x - y + 1 = 0"),
            ("Point (2 + √2, 3 - √2)", "IV", "x + y - 5 = 0", "Slope m = -√2/√2 = -1 => y - 3 = -1(x - 2) => x + y - 5 = 0"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match the pairs of circles in List I with the number of common tangents they possess in List II:",
        [
            ("x² + y² = 4 and (x - 6)² + y² = 9", "II", "4", "r1 = 2, r2 = 3, d = 6; d > r1 + r2 (6 > 5) => 4 common tangents"),
            ("x² + y² = 4 and (x - 5)² + y² = 9", "IV", "3", "r1 = 2, r2 = 3, d = 5; d = r1 + r2 (5 = 5) => 3 common tangents"),
            ("x² + y² = 9 and (x - 4)² + y² = 4", "I", "2", "r1 = 3, r2 = 2, d = 4; |r1 - r2| < d < r1 + r2 (1 < 4 < 5) => 2 common tangents"),
            ("x² + y² = 16 and (x - 1)² + y² = 1", "III", "0", "r1 = 4, r2 = 1, d = 1; d < |r1 - r2| (1 < 3) => 0 common tangents"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Given circle C1: x² + y² - 4x - 2y + 1 = 0, match each second circle C2 in List I with the equation of their radical axis in List II:",
        [
            ("C2: x² + y² - 2x - 6y + 5 = 0", "III", "x - 2y + 2 = 0", "C1 - C2 = 0 => -2x + 4y - 4 = 0 => x - 2y + 2 = 0"),
            ("C2: x² + y² + 2x + 4y - 3 = 0", "I", "3x + 3y - 2 = 0", "C1 - C2 = 0 => -6x - 6y + 4 = 0 => 3x + 3y - 2 = 0"),
            ("C2: x² + y² - 4x + 6y - 7 = 0", "IV", "y = 1", "C1 - C2 = 0 => -8y + 8 = 0 => y = 1"),
            ("C2: x² + y² - 8x - 2y + 9 = 0", "II", "x = 2", "C1 - C2 = 0 => 4x - 8 = 0 => x = 2"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match the circles in List I with the equation of their director circle in List II:",
        [
            ("x² + y² = 9", "IV", "x² + y² = 18", "Radius becomes √2(3) = √18 => x² + y² = 18"),
            ("x² + y² - 4x - 6y + 9 = 0", "II", "(x - 2)² + (y - 3)² = 8", "Center (2, 3), r² = 4 => Director circle has R² = 8: (x - 2)² + (y - 3)² = 8"),
            ("x² + y² + 2x = 0", "I", "(x + 1)² + y² = 2", "Center (-1, 0), r² = 1 => R² = 2: (x + 1)² + y² = 2"),
            ("x² + y² = 25", "III", "x² + y² = 50", "Radius becomes √2(5) = √50 => x² + y² = 50"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Given circle C1: x² + y² - 2x - 4y + 1 = 0, match each circle C2 in List I with the value of parameter k in List II such that C1 and C2 cut orthogonally:",
        [
            ("C2: x² + y² + 4x + 2ky - 5 = 0", "I", "0", "2(-1)(2) + 2(-2)(k) = 1 + (-5) => -4 - 4k = -4 => k = 0"),
            ("C2: x² + y² + 2kx + 2y - 1 = 0", "III", "-2", "2(-1)(k) + 2(-2)(1) = 1 + (-1) => -2k - 4 = 0 => k = -2"),
            ("C2: x² + y² - 4x + 2ky + 7 = 0", "II", "-1", "2(-1)(-2) + 2(-2)(k) = 1 + 7 => 4 - 4k = 8 => k = -1"),
            ("C2: x² + y² - 2x + 2ky - 11 = 0", "IV", "3", "2(-1)(-1) + 2(-2)(k) = 1 + (-11) => 2 - 4k = -10 => k = 3"),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Match the triads of circles in List I with their radical center in List II:",
        [
            ("x² + y² = 1, x² + y² - 4x = 1, and x² + y² - 6y = 1", "II", "(0, 0)", "Radical axes are 4x = 0 (x = 0) and 6y = 0 (y = 0) => Center (0, 0)"),
            ("x² + y² + 2x = 0, x² + y² + 2y = 0, and x² + y² + 2x + 2y - 4 = 0", "IV", "(2, 2)", "Radical axes: x = y and -2y + 4 = 0 => y = 2, x = 2 => (2, 2)"),
            ("x² + y² - 2x - 2y + 1 = 0, x² + y² + 4x - 2y + 7 = 0, and x² + y² - 2x + 6y - 7 = 0", "I", "(-1, 1)", "Radical axes: 6x + 6 = 0 (x = -1) and 8y - 8 = 0 (y = 1) => (-1, 1)"),
            ("x² + y² - 6x = 0, x² + y² - 8y = 0, and x² + y² - 6x - 8y + 24 = 0", "III", "(4, 3)", "Radical axes: -8y + 24 = 0 (y = 3) and -6x + 24 = 0 (x = 4) => (4, 3)"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match the pairs of intersecting circles in List I with the length of their common chord in List II:",
        [
            ("x² + y² = 25 and (x - 4)² + y² = 9", "III", "6", "Radical axis is x = 4; for x = 4 on x² + y² = 25, y = ±3 => Length = 6"),
            ("x² + y² = 20 and (x - 4)² + y² = 20", "I", "8", "Radical axis is x = 2; for x = 2, y = ±4 => Length = 8"),
            ("x² + y² = 10 and (x - 2)² + y² = 6", "IV", "2√6", "Radical axis is x = 2; for x = 2, y = ±√6 => Length = 2√6"),
            ("x² + y² = 5 and (x - 1)² + y² = 4", "II", "4", "Radical axis is x = 1; for x = 1, y = ±2 => Length = 4"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "For Circle Pair 1 (C1: x² + y² = 16, C2: (x - 10)² + y² = 4) and Circle Pair 2 (C3: x² + y² = 25, C4: (x - 13)² + y² = 4), match the common tangent descriptions in List I with their lengths in List II:",
        [
            ("Direct common tangent of Pair 1", "IV", "4√6", "√(d² - (r1 - r2)²) = √(100 - (4 - 2)²) = √96 = 4√6"),
            ("Transverse common tangent of Pair 1", "II", "8", "√(d² - (r1 + r2)²) = √(100 - (4 + 2)²) = √64 = 8"),
            ("Direct common tangent of Pair 2", "I", "4√10", "√(169 - (5 - 2)²) = √160 = 4√10"),
            ("Transverse common tangent of Pair 2", "III", "2√30", "√(169 - (5 + 2)²) = √120 = 2√30"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "For the circle x² + y² = 25, match the lines in List I with the coordinates of their pole in List II:",
        [
            ("3x + 4y = 25", "I", "(3, 4)", "Comparing with xx1 + yy1 = 25 gives x1 = 3, y1 = 4"),
            ("x - 2y = 5", "III", "(5, -10)", "Rewriting as 5x - 10y = 25 gives pole (5, -10)"),
            ("2x + y = 10", "II", "(5, 5/2)", "Rewriting as 5x + (5/2)y = 25 gives pole (5, 5/2)"),
            ("x = 5", "IV", "(5, 0)", "Rewriting as 5x + 0y = 25 gives pole (5, 0)"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "For the circle x² + y² - 4x - 6y + 4 = 0, match the midpoints of chords M(x1, y1) in List I with the equation of the chord (T = S1) in List II:",
        [
            ("Midpoint (3, 4)", "II", "x + y - 7 = 0", "(x - 3)(3 - 2) + (y - 4)(4 - 3) = 0 => (x - 3) + (y - 4) = 0 => x + y - 7 = 0"),
            ("Midpoint (1, 2)", "IV", "x + y - 3 = 0", "(x - 1)(1 - 2) + (y - 2)(2 - 3) = 0 => -(x - 1) - (y - 2) = 0 => x + y - 3 = 0"),
            ("Midpoint (2, 5)", "I", "y = 5", "(x - 2)(2 - 2) + (y - 5)(5 - 3) = 0 => 2(y - 5) = 0 => y = 5"),
            ("Midpoint (4, 3)", "III", "x = 4", "(x - 4)(4 - 2) + (y - 3)(3 - 3) = 0 => 2(x - 4) = 0 => x = 4"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Consider the family of circles x² + y² - 4 + λ(x + y - 2) = 0 passing through the intersection of circle x² + y² = 4 and line x + y = 2. Match the geometric conditions in List I with the resulting circle equation in List II:",
        [
            ("Circle passing through origin (0, 0)", "III", "x² + y² - 2x - 2y = 0", "Substituting (0, 0) gives -4 - 2λ = 0 => λ = -2 => x² + y² - 2x - 2y = 0"),
            ("Circle passing through point (1, 3)", "I", "x² + y² - 3x - 3y + 2 = 0", "Substituting (1, 3) gives 1 + 9 - 4 + λ(1 + 3 - 2) = 6 + 2λ = 0 => λ = -3 => x² + y² - 3x - 3y + 2 = 0"),
            ("Circle with parameter λ = 0", "IV", "x² + y² - 4 = 0", "For λ = 0, the equation reduces directly to x² + y² - 4 = 0"),
            ("Circle passing through point (3, 0)", "II", "x² + y² - 5x - 5y + 6 = 0", "Substituting (3, 0) gives 9 - 4 + λ(3 - 2) = 5 + λ = 0 => λ = -5 => x² + y² - 5x - 5y + 6 = 0"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match the coaxial systems of circles in List I with their limiting points (point circles of radius zero) in List II:",
        [
            ("x² + y² + 2gx + 9 = 0", "IV", "(±3, 0)", "Radius r² = g² - 9 = 0 => g = ±3 => Limiting points (-g, 0) = (±3, 0)"),
            ("x² + y² + 2fy + 16 = 0", "II", "(0, ±4)", "Radius r² = f² - 16 = 0 => f = ±4 => Limiting points (0, -f) = (0, ±4)"),
            ("x² + y² + 2gx + 25 = 0", "I", "(±5, 0)", "Radius r² = g² - 25 = 0 => g = ±5 => Limiting points (±5, 0)"),
            ("x² + y² + 2fy + 1 = 0", "III", "(0, ±1)", "Radius r² = f² - 1 = 0 => f = ±1 => Limiting points (0, ±1)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match the pairs of intersecting circles in List I with the cosine of their angle of intersection cos θ in List II:",
        [
            ("x² + y² = 9 and (x - 3)² + y² = 9", "I", "1/2", "r1 = 3, r2 = 3, d = 3 => cos θ = (9 + 9 - 9)/(2 × 3 × 3) = 9/18 = 1/2"),
            ("x² + y² = 4 and x² + y² - 4x - 4y = 0", "III", "1/(2√2)", "r1 = 2, r2 = √8 = 2√2, d = √8 => cos θ = (4 + 8 - 8)/(2 × 2 × 2√2) = 1/(2√2)"),
            ("x² + y² = 16 and (x - 4)² + (y - 3)² = 9", "II", "0", "r1 = 4, r2 = 3, d = 5 => cos θ = (16 + 9 - 25)/(2 × 4 × 3) = 0"),
            ("x² + y² = 4 and (x - 2)² + y² = 1", "IV", "1/4", "r1 = 2, r2 = 1, d = 2 => cos θ = (4 + 1 - 4)/(2 × 2 × 1) = 1/4"),
        ], "D"))

    # ==========================================
    # TOPIC: Conic Sections (20 questions)
    # ==========================================
    t = "Conic Sections"
    prefix = "math_mat_conics"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "For the parabola y² = 12x (a = 3), match the geometric features in List I with their descriptions in List II:",
        [
            ("Focus", "II", "(3, 0)", "Focus of y² = 4ax is (a, 0) = (3, 0)"),
            ("Directrix", "IV", "x = -3", "Directrix is x = -a => x = -3"),
            ("Length of latus rectum", "I", "12", "Length of latus rectum is 4a = 12"),
            ("Equation of latus rectum", "III", "x = 3", "Line passing through focus perpendicular to axis: x = a => x = 3"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "For the ellipse x²/25 + y²/16 = 1 (a = 5, b = 4), match the parameters in List I with their values in List II:",
        [
            ("Eccentricity e", "III", "3/5", "e = √(1 - b²/a²) = √(1 - 16/25) = 3/5"),
            ("Coordinates of foci", "I", "(±3, 0)", "(±ae, 0) = (±5 × (3/5), 0) = (±3, 0)"),
            ("Length of latus rectum", "IV", "32/5", "2b²/a = 2(16)/5 = 32/5"),
            ("Equations of directrices", "II", "x = ±25/3", "x = ±a/e = ±5/(3/5) = ±25/3"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "For the hyperbola x²/16 - y²/9 = 1 (a = 4, b = 3), match the properties in List I with their values in List II:",
        [
            ("Eccentricity e", "IV", "5/4", "e = √(1 + b²/a²) = √(1 + 9/16) = 5/4"),
            ("Coordinates of foci", "II", "(±5, 0)", "(±ae, 0) = (±4 × (5/4), 0) = (±5, 0)"),
            ("Length of latus rectum", "I", "9/2", "2b²/a = 2(9)/4 = 9/2"),
            ("Equations of asymptotes", "III", "3x ± 4y = 0", "y = ±(b/a)x => y = ±(3/4)x => 3x ± 4y = 0"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the eccentricity value e in List I with the corresponding conic section in List II:",
        [
            ("e = 0", "I", "Circle", "A conic section with zero eccentricity is a circle"),
            ("e = 1", "III", "Parabola", "A conic section with eccentricity equal to 1 is a parabola"),
            ("e = 1/2", "II", "Ellipse", "A conic section with 0 < e < 1 is an ellipse"),
            ("e = √2", "IV", "Rectangular Hyperbola", "A hyperbola with e = √2 has perpendicular asymptotes, hence rectangular hyperbola"),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "For tangents to the parabola y² = 8x (a = 2), match the slope m in List I with the equation of the tangent (y = mx + a/m) in List II:",
        [
            ("m = 1", "II", "y = x + 2", "y = x + 2/1 => y = x + 2"),
            ("m = 2", "IV", "y = 2x + 1", "y = 2x + 2/2 => y = 2x + 1"),
            ("m = 1/2", "I", "x - 2y + 8 = 0", "y = (1/2)x + 2/(1/2) = (1/2)x + 4 => x - 2y + 8 = 0"),
            ("m = -1", "III", "x + y + 2 = 0", "y = -x + 2/(-1) = -x - 2 => x + y + 2 = 0"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "For tangents to the ellipse x²/9 + y²/4 = 1 of the form y = mx + c, match the slope m in List I with the positive value of the y-intercept c in List II:",
        [
            ("m = 0", "III", "2", "c = √(9(0) + 4) = 2"),
            ("m = 1", "I", "√13", "c = √(9(1) + 4) = √13"),
            ("m = 2", "IV", "2√10", "c = √(9(4) + 4) = √40 = 2√10"),
            ("m = 1/√3", "II", "√7", "c = √(9(1/3) + 4) = √7"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "For tangents to the hyperbola x²/16 - y²/9 = 1 of the form y = mx + c, match the slope m (|m| > 3/4) in List I with the positive value of intercept c in List II:",
        [
            ("m = 1", "IV", "√7", "c = √(16(1) - 9) = √7"),
            ("m = 5/4", "II", "4", "c = √(16(25/16) - 9) = √(25 - 9) = 4"),
            ("m = 3/2", "I", "3√3", "c = √(16(9/4) - 9) = √(36 - 9) = √27 = 3√3"),
            ("m = 2", "III", "√55", "c = √(16(4) - 9) = √(64 - 9) = √55"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match the conic sections in List I with their director circle (locus of points of intersection of perpendicular tangents) in List II:",
        [
            ("Parabola y² = 4ax", "I", "Directrix: x + a = 0", "Perpendicular tangents to a parabola intersect on its directrix: x + a = 0"),
            ("Ellipse x²/16 + y²/9 = 1", "III", "x² + y² = 25", "Director circle is x² + y² = a² + b² = 16 + 9 = 25"),
            ("Hyperbola x²/25 - y²/9 = 1", "II", "x² + y² = 16", "Director circle is x² + y² = a² - b² = 25 - 9 = 16"),
            ("Rectangular hyperbola x² - y² = 16", "IV", "x² + y² = 0 (Point circle at origin)", "a² - b² = 16 - 16 = 0 => Director circle degenerates to origin: x² + y² = 0"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "For the parabola y² = 4x (a = 1), match the slope of the normal m in List I with the equation of the normal (y = mx - 2m - m³) in List II:",
        [
            ("m = 1", "II", "x - y - 3 = 0", "y = x - 2(1) - 1³ = x - 3 => x - y - 3 = 0"),
            ("m = -1", "IV", "x + y - 3 = 0", "y = -x - 2(-1) - (-1)³ = -x + 3 => x + y - 3 = 0"),
            ("m = 2", "I", "2x - y - 12 = 0", "y = 2x - 2(2) - 2³ = 2x - 12 => 2x - y - 12 = 0"),
            ("m = 0", "III", "y = 0", "y = 0(x) - 0 - 0 = 0 (the axis of the parabola)"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the conic sections in List I with the equation of their auxiliary circle in List II:",
        [
            ("Ellipse x²/25 + y²/9 = 1", "III", "x² + y² = 25", "Major axis length 2a = 10 along x-axis => x² + y² = 25"),
            ("Ellipse x²/16 + y²/36 = 1", "I", "x² + y² = 36", "Major axis length 2b = 12 along y-axis => x² + y² = 36"),
            ("Hyperbola x²/49 - y²/16 = 1", "IV", "x² + y² = 49", "Transverse axis length 2a = 14 => x² + y² = 49"),
            ("Hyperbola y²/64 - x²/36 = 1", "II", "x² + y² = 64", "Transverse axis length 2b = 16 along y-axis => x² + y² = 64"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "For the rectangular hyperbola xy = 16 (c = 4) with parametric form (ct, c/t), match the properties in List I with their values in List II:",
        [
            ("Parametric point coordinates at t = 2", "IV", "(8, 2)", "(ct, c/t) = (4(2), 4/2) = (8, 2)"),
            ("Equation of tangent at t = 2", "II", "x + 4y = 16", "x/t + yt = 2c => x/2 + 2y = 8 => x + 4y = 16"),
            ("Slope of tangent at point (8, 2)", "I", "-1/4", "dy/dx = -y/x = -2/8 = -1/4"),
            ("Eccentricity e of xy = 16", "III", "√2", "Every rectangular hyperbola has eccentricity e = √2"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match the conic sections and points in List I with the focal distance (or sum/difference of focal distances) in List II:",
        [
            ("Parabola y² = 8x, focal distance of point (2, 4)", "I", "4", "Focal distance = x1 + a = 2 + 2 = 4"),
            ("Ellipse x²/25 + y²/16 = 1, sum of focal distances SP + S'P", "III", "10", "Sum of focal distances = 2a = 2(5) = 10"),
            ("Hyperbola x²/16 - y²/9 = 1, difference of focal distances |SP - S'P|", "II", "8", "Difference of focal distances = 2a = 2(4) = 8"),
            ("Parabola x² = 12y, focal distance of point (6, 3)", "IV", "6", "Focal distance = y1 + a = 3 + 3 = 6"),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "For the parabola y² = 4x (a = 1), match the pairs of parameters (t1, t2) of contact points in List I with the point of intersection of the tangents (t1 t2, t1 + t2) in List II:",
        [
            ("t1 = 1, t2 = 2", "II", "(2, 3)", "(t1 t2, t1 + t2) = (1(2), 1 + 2) = (2, 3)"),
            ("t1 = -1, t2 = 3", "IV", "(-3, 2)", "((-1)(3), -1 + 3) = (-3, 2)"),
            ("t1 = 2, t2 = -2", "I", "(-4, 0)", "((2)(-2), 2 + (-2)) = (-4, 0)"),
            ("t1 = 1, t2 = -3", "III", "(-3, -2)", "((1)(-3), 1 + (-3)) = (-3, -2)"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "For the parabola y² = 8x (a = 2), match the parameter t of one end of a focal chord in List I with the length of the focal chord L = a(t + 1/t)² in List II:",
        [
            ("t = 1", "III", "8", "L = 2(1 + 1)² = 8 (latus rectum)"),
            ("t = 2", "I", "25/2", "L = 2(2 + 1/2)² = 2(25/4) = 25/2"),
            ("t = 3", "IV", "200/9", "L = 2(3 + 1/3)² = 2(100/9) = 200/9"),
            ("t = √2", "II", "9", "L = 2(√2 + 1/√2)² = 2(3/√2)² = 9"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "For the ellipse x²/16 + y²/9 = 1 (a = 4, b = 3), match the eccentric angles of chord endpoints (φ1, φ2) in List I with the equation of the chord in List II:",
        [
            ("φ1 = 0, φ2 = π/2", "IV", "3x + 4y = 12", "(x/4)cos(π/4) + (y/3)sin(π/4) = cos(-π/4) => x/4 + y/3 = 1 => 3x + 4y = 12"),
            ("φ1 = π/2, φ2 = π", "II", "-3x + 4y = 12", "(x/4)cos(3π/4) + (y/3)sin(3π/4) = cos(-π/4) => -x/4 + y/3 = 1 => -3x + 4y = 12"),
            ("φ1 = -π/2, φ2 = π/2", "I", "x = 0", "(x/4)cos(0) + (y/3)sin(0) = cos(-π/2) = 0 => x/4 = 0 => x = 0 (y-axis)"),
            ("φ1 = 0, φ2 = π", "III", "y = 0", "(x/4)cos(π/2) + (y/3)sin(π/2) = cos(-π/2) = 0 => y/3 = 0 => y = 0 (x-axis)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "For the hyperbola H: x²/16 - y²/9 = 1, match the related geometric objects and parameters in List I with their equations or values in List II:",
        [
            ("Combined equation of asymptotes", "I", "9x² - 16y² = 0", "x²/16 - y²/9 = 0 => 9x² - 16y² = 0"),
            ("Equation of conjugate hyperbola H'", "III", "y²/9 - x²/16 = 1", "-x²/16 + y²/9 = 1 => y²/9 - x²/16 = 1"),
            ("Eccentricity e of H", "II", "5/4", "e = √(1 + 9/16) = 5/4"),
            ("Eccentricity e' of conjugate hyperbola H'", "IV", "5/3", "e' = √(1 + 16/9) = 5/3 (note 1/e² + 1/e'² = 1)"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Normals are drawn from point (h, k) to the parabola y² = 4x (a = 1). Match the coordinates of point (h, k) in List I with the sum of squares of the slopes of the three normals m1² + m2² + m3² = 2(h - 2) in List II:",
        [
            ("Point (5, 1)", "II", "6", "Sum of squares = 2(5 - 2) = 6"),
            ("Point (6, 3)", "IV", "8", "Sum of squares = 2(6 - 2) = 8"),
            ("Point (8, -2)", "I", "12", "Sum of squares = 2(8 - 2) = 12"),
            ("Point (4, 0)", "III", "4", "Sum of squares = 2(4 - 2) = 4"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "For the parabola y² = 4x (a = 1), match the triplets of contact parameters (t1, t2, t3) in List I with the area of the triangle formed by the tangents at these points in List II:",
        [
            ("(0, 1, 2)", "III", "1", "Area = (1/2)|(0-1)(1-2)(2-0)| = (1/2)|(-1)(-1)(2)| = 1"),
            ("(1, 2, 4)", "I", "3", "Area = (1/2)|(1-2)(2-4)(4-1)| = (1/2)|(-1)(-2)(3)| = 3"),
            ("(0, 1, 4)", "IV", "6", "Area = (1/2)|(0-1)(1-4)(4-0)| = (1/2)|(-1)(-3)(4)| = 6"),
            ("(0, 1, 5)", "II", "10", "Area = (1/2)|(0-1)(1-5)(5-0)| = (1/2)|(-1)(-4)(5)| = 10"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match the central conics in List I with the product of the lengths of perpendiculars drawn from their foci onto any tangent in List II:",
        [
            ("Ellipse x²/25 + y²/9 = 1", "IV", "9", "Product of perpendiculars from foci onto any tangent is b² = 9"),
            ("Ellipse x²/16 + y²/7 = 1", "II", "7", "Product of perpendiculars = b² = 7"),
            ("Hyperbola x²/25 - y²/16 = 1", "I", "16", "Product of perpendiculars from foci onto any tangent is b² = 16"),
            ("Hyperbola x²/9 - y²/4 = 1", "III", "4", "Product of perpendiculars = b² = 4"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match the hyperbola equations in List I with their eccentricity e in List II:",
        [
            ("x² - y² = 16", "I", "√2", "Rectangular hyperbola: e = √(1 + 1) = √2"),
            ("x²/3 - y²/1 = 1", "III", "2/√3", "e = √(1 + 1/3) = √(4/3) = 2/√3"),
            ("x²/1 - y²/3 = 1", "II", "2", "e = √(1 + 3/1) = √4 = 2"),
            ("x²/16 - y²/9 = 1", "IV", "5/4", "e = √(1 + 9/16) = √(25/16) = 5/4"),
        ], "D"))

    return qs
