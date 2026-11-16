from builder import make_matrix_q

def get_questions():
    qs = []
    
    # ==========================================
    # TOPIC 1: Trigonometric Functions (20 questions)
    # ==========================================
    t = "Trigonometric Functions"
    prefix = "math_mat_trig"
    
    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the fundamental trigonometric identities in List I with their equivalent expressions in List II:",
        [
            ("sin² θ + cos² θ", "III", "1", "Fundamental Pythagorean identity: sin² θ + cos² θ = 1"),
            ("1 + tan² θ", "I", "sec² θ", "Standard identity: 1 + tan² θ = sec² θ"),
            ("1 + cot² θ", "IV", "csc² θ", "Standard identity: 1 + cot² θ = csc² θ"),
            ("sin(2θ)", "II", "2 sin θ cos θ", "Double-angle formula for sine: sin(2θ) = 2 sin θ cos θ")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the exact trigonometric values in List I with their radical forms in List II:",
        [
            ("sin(π/12) = sin(15°)", "II", "(√6 - √2)/4", "sin(45° - 30°) = sin 45° cos 30° - cos 45° sin 30° = (√6 - √2)/4"),
            ("cos(π/12) = cos(15°)", "IV", "(√6 + √2)/4", "cos(45° - 30°) = cos 45° cos 30° + sin 45° sin 30° = (√6 + √2)/4"),
            ("tan(π/8) = tan(22.5°)", "I", "√2 - 1", "tan(45°/2) = (1 - cos 45°)/sin 45° = (1 - 1/√2)/(1/√2) = √2 - 1"),
            ("sin(π/10) = sin(18°)", "III", "(√5 - 1)/4", "Standard golden ratio angle identity: sin(18°) = (√5 - 1)/4")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the trigonometric expressions in List I with their maximum values on ℝ in List II:",
        [
            ("3 sin x + 4 cos x", "III", "5", "Maximum value of a sin x + b cos x is √(a² + b²) = √(9 + 16) = 5"),
            ("5 sin x - 12 cos x", "IV", "13", "Maximum value is √(5² + (-12)²) = √(25 + 144) = 13"),
            ("sin x + cos x", "I", "√2", "Maximum value is √(1² + 1²) = √2"),
            ("√3 sin x + cos x", "II", "2", "Maximum value is √((√3)² + 1²) = √(3 + 1) = 2")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the sign conditions in List I with the corresponding quadrant in List II:",
        [
            ("sin θ < 0 and cos θ > 0", "IV", "Quadrant IV", "Sine is negative and cosine is positive exclusively in Quadrant IV"),
            ("sin θ > 0 and cos θ < 0", "II", "Quadrant II", "Sine is positive and cosine is negative exclusively in Quadrant II"),
            ("sin θ < 0 and cos θ < 0", "III", "Quadrant III", "Both sine and cosine are negative exclusively in Quadrant III"),
            ("sin θ > 0 and cos θ > 0", "I", "Quadrant I", "Both sine and cosine are positive exclusively in Quadrant I")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match the trigonometric equations in List I with the set of their principal solutions in [0, 2π) in List II:",
        [
            ("sin x = 1/2", "II", "{π/6, 5π/6}", "Positive sine occurs in Q1 and Q2 at x = π/6 and x = π - π/6 = 5π/6"),
            ("cos x = -1/2", "IV", "{2π/3, 4π/3}", "Negative cosine occurs in Q2 and Q3 at x = π - π/3 = 2π/3 and x = π + π/3 = 4π/3"),
            ("tan x = √3", "I", "{π/3, 4π/3}", "Positive tangent occurs in Q1 and Q3 at x = π/3 and x = π + π/3 = 4π/3"),
            ("cos x = 1/√2", "III", "{π/4, 7π/4}", "Positive cosine occurs in Q1 and Q4 at x = π/4 and x = 2π - π/4 = 7π/4")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match the classic trigonometric products in List I with their evaluated rational values in List II:",
        [
            ("cos(20°) cos(40°) cos(80°)", "I", "1/8", "Using cos θ cos(60°-θ) cos(60°+θ) = (1/4) cos(3θ) with θ = 20°: (1/4) cos(60°) = 1/8"),
            ("sin(20°) sin(40°) sin(80°)", "III", "√3/8", "Using sin θ sin(60°-θ) sin(60°+θ) = (1/4) sin(3θ) with θ = 20°: (1/4) sin(60°) = √3/8"),
            ("tan(20°) tan(40°) tan(80°)", "IV", "√3", "Ratio of sine product to cosine product: (√3/8) / (1/8) = √3"),
            ("cos(π/7) cos(2π/7) cos(4π/7)", "II", "-1/8", "Multiplying and dividing by 8 sin(π/7) telescopes to sin(8π/7)/(8 sin(π/7)) = -sin(π/7)/(8 sin(π/7)) = -1/8")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "For any non-right triangle ABC (A + B + C = π), match the conditional trigonometric expressions in List I with their equivalent identities in List II:",
        [
            ("tan A + tan B + tan C", "III", "tan A tan B tan C", "tan(A + B) = -tan C => (tan A + tan B)/(1 - tan A tan B) = -tan C => tan A + tan B + tan C = tan A tan B tan C"),
            ("cot A cot B + cot B cot C + cot C cot A", "I", "1", "Dividing tan A + tan B + tan C = tan A tan B tan C by tan A tan B tan C gives cot B cot C + cot A cot C + cot A cot B = 1"),
            ("cos² A + cos² B + cos² C", "IV", "1 - 2 cos A cos B cos C", "Standard identity: cos² A + cos² B + cos² C = 1 - 2 cos A cos B cos C"),
            ("sin(2A) + sin(2B) + sin(2C)", "II", "4 sin A sin B sin C", "Using sum-to-product: 2 sin(A+B) cos(A-B) + 2 sin C cos C = 2 sin C [cos(A-B) - cos(A+B)] = 4 sin A sin B sin C")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match the trigonometric expressions in List I with their minimum values over their real domains in List II:",
        [
            ("sec² x + csc² x (for x ≠ kπ/2)", "I", "4", "sec² x + csc² x = tan² x + cot² x + 2 ≥ 2√(tan² x cot² x) + 2 = 4 (equality at tan² x = 1)"),
            ("tan² x + cot² x (for x ≠ kπ/2)", "II", "2", "By AM-GM, tan² x + cot² x ≥ 2√(tan² x cot² x) = 2 (equality at tan² x = 1)"),
            ("4 tan² x + 9 cot² x (for x ≠ kπ/2)", "IV", "12", "By AM-GM, 4 tan² x + 9 cot² x ≥ 2√(36) = 12 (equality at tan² x = 3/2)"),
            ("3 sin² x + 8 cos² x (for x ∈ ℝ)", "III", "3", "3 sin² x + 8 cos² x = 3(sin² x + cos² x) + 5 cos² x = 3 + 5 cos² x ≥ 3 (equality when cos x = 0)")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match the trigonometric equations in List I with the number of their distinct real solutions in [0, 2π] in List II:",
        [
            ("sin x = 1", "II", "1", "In [0, 2π], sin x = 1 only at x = π/2, giving 1 solution"),
            ("cos x = 1", "IV", "2", "In [0, 2π], cos x = 1 at x = 0 and x = 2π, giving 2 solutions"),
            ("sin x = 0", "I", "3", "In [0, 2π], sin x = 0 at x = 0, π, 2π, giving 3 solutions"),
            ("|cos x| = 1/2", "III", "4", "cos x = ±1/2 gives solutions at π/3, 2π/3, 4π/3, 5π/3, giving 4 solutions")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "For a triangle ABC with sides a, b, c, semi-perimeter s, area Δ, inradius r, and circumradius R, match List I with List II:",
        [
            ("a / sin A", "IV", "2R", "By the Sine Rule, a / sin A = b / sin B = c / sin C = 2R"),
            ("r in terms of R and half-angles", "I", "4R sin(A/2) sin(B/2) sin(C/2)", "Standard half-angle inradius formula: r = 4R sin(A/2) sin(B/2) sin(C/2)"),
            ("Area Δ in terms of r and s", "II", "r s", "Standard inradius-area formula: Δ = r s"),
            ("abc / (4Δ)", "III", "R", "Standard circumradius-area formula: R = abc / (4Δ)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match the trigonometric reduction formulas in List I with their simplified expressions in List II:",
        [
            ("sin(π - θ)", "I", "sin θ", "In Quadrant II, sine is positive: sin(π - θ) = sin θ"),
            ("cos(π - θ)", "III", "-cos θ", "In Quadrant II, cosine is negative: cos(π - θ) = -cos θ"),
            ("tan(π/2 + θ)", "IV", "-cot θ", "Cofunction in Quadrant II: tan(π/2 + θ) = -cot θ"),
            ("cos(π/2 + θ)", "II", "-sin θ", "Cofunction in Quadrant II: cos(π/2 + θ) = -sin θ")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match each trigonometric equation in List I with its general solution in List II (where n ∈ ℤ):",
        [
            ("sin θ = 0", "II", "θ = nπ", "Sine vanishes at all integer multiples of π: θ = nπ"),
            ("cos θ = 0", "IV", "θ = (2n + 1)π/2", "Cosine vanishes at all odd multiples of π/2: θ = (2n + 1)π/2"),
            ("tan θ = 1", "I", "θ = nπ + π/4", "tan θ = 1 has principal solution π/4, so general solution is θ = nπ + π/4"),
            ("sin θ = 1", "III", "θ = 2nπ + π/2", "sin θ = 1 has principal solution π/2, repeating every 2π: θ = 2nπ + π/2")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "In any acute-angled triangle ABC, match the trigonometric expressions in List I with their extreme values in List II:",
        [
            ("Maximum of cos A cos B cos C", "II", "1/8", "By Jensen's inequality for concave ln(cos x) on (0, π/2), maximum occurs when A = B = C = π/3: cos³(π/3) = 1/8"),
            ("Maximum of sin A + sin B + sin C", "IV", "3√3/2", "Since sine is concave on (0, π), maximum occurs at equilateral triangle: 3 sin(π/3) = 3√3/2"),
            ("Maximum of cos A + cos B + cos C", "I", "3/2", "Since cosine is concave on (0, π/2), maximum occurs at equilateral triangle: 3 cos(π/3) = 3/2"),
            ("Minimum of tan A + tan B + tan C", "III", "3√3", "In acute triangle, tan A, tan B, tan C > 0 and tan A + tan B + tan C = tan A tan B tan C. By AM-GM, minimum is 3√3 at A = B = C = π/3")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match the finite trigonometric products in List I with their evaluated values in List II:",
        [
            ("sin(π/5) sin(2π/5) sin(3π/5) sin(4π/5)", "II", "5/16", "Using ∏_{k=1}^{n-1} sin(kπ/n) = n / 2^{n-1} with n = 5: 5 / 2⁴ = 5/16"),
            ("sin(π/7) sin(2π/7) sin(3π/7)", "IV", "√7/8", "Since sin(kπ/7) = sin((7-k)π/7), the square of the product is 7 / 2⁶ = 7/64, giving √7/8"),
            ("cos(π/5) cos(2π/5)", "I", "1/4", "cos(36°) cos(72°) = ((√5 + 1)/4)((√5 - 1)/4) = 4/16 = 1/4"),
            ("tan(π/7) tan(2π/7) tan(3π/7)", "III", "√7", "The ratio of the sine product (√7/8) to the cosine product (1/8) gives √7")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match the trigonometric polynomials in List I with their expressions in terms of x = cos θ in List II:",
        [
            ("cos(2θ)", "II", "2x² - 1", "Double angle cosine identity: cos(2θ) = 2 cos² θ - 1 = 2x² - 1"),
            ("cos(3θ)", "IV", "4x³ - 3x", "Triple angle cosine identity: cos(3θ) = 4 cos³ θ - 3 cos θ = 4x³ - 3x"),
            ("cos(4θ)", "I", "8x⁴ - 8x² + 1", "Using cos(4θ) = 2 cos²(2θ) - 1 = 2(2x² - 1)² - 1 = 8x⁴ - 8x² + 1"),
            ("sin(3θ)/sin θ (for sin θ ≠ 0)", "III", "4x² - 1", "sin(3θ)/sin θ = (3 sin θ - 4 sin³ θ)/sin θ = 3 - 4 sin² θ = 3 - 4(1 - x²) = 4x² - 1")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match each trigonometric summation in List I with its closed form in List II:",
        [
            ("∑_{k=1}^n sin(kx)", "III", "sin(nx/2) sin((n+1)x/2) / sin(x/2)", "Multiplying by 2 sin(x/2) telescopes into cos(x/2) - cos((2n+1)x/2) = 2 sin(nx/2) sin((n+1)x/2)"),
            ("∑_{k=1}^n cos(kx)", "IV", "sin(nx/2) cos((n+1)x/2) / sin(x/2)", "Multiplying by 2 sin(x/2) telescopes into sin((2n+1)x/2) - sin(x/2) = 2 sin(nx/2) cos((n+1)x/2)"),
            ("∑_{k=1}^n tan(x/2^k) sec(x/2^{k-1})", "I", "tan x - tan(x/2^n)", "Telescoping identity: tan(A) - tan(B) = sin(A - B)/(cos A cos B) with A = x/2^{k-1}, B = x/2^k"),
            ("∑_{k=1}^∞ (1/2^k) tan(x/2^k) (x ∈ (0, π/2))", "II", "1/x - cot x", "Derived by logarithmic differentiation of ∏_{k=1}^∞ cos(x/2^k) = sin x / x, giving ∑ (1/2^k) tan(x/2^k) = 1/x - cot x")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Let a, b, c be the sides of triangle ABC with area Δ and semi-perimeter s. Match each exradius expression in List I with its formula in List II:",
        [
            ("r₁ (exradius opposite vertex A)", "II", "Δ / (s - a)", "Standard exradius formula: r₁ = Δ / (s - a)"),
            ("r₁ + r₂ + r₃ - r", "IV", "4R", "Classic relation connecting the sum of exradii, inradius, and circumradius: r₁ + r₂ + r₃ - r = 4R"),
            ("1/r₁ + 1/r₂ + 1/r₃", "I", "1/r", "(s - a)/Δ + (s - b)/Δ + (s - c)/Δ = (3s - 2s)/Δ = s/Δ = 1/r"),
            ("r₁ r₂ + r₂ r₃ + r₃ r₁", "III", "s²", "Standard symmetric exradii identity: r₁ r₂ + r₂ r₃ + r₃ r₁ = s²")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match each transcendental equation in List I with the exact number of its real roots in List II:",
        [
            ("sin x = x/10 for x ∈ ℝ", "IV", "7", "Since |sin x| ≤ 1, roots lie in [-10, 10]. In (0, 10] there are 3 roots; in [-10, 0) there are 3 roots; and x = 0 is a root. Total = 7"),
            ("cos x = x for x ∈ ℝ", "I", "1", "f(x) = x - cos x has f'(x) = 1 + sin x ≥ 0 (strictly increasing), with f(0) = -1 < 0 and f(1) > 0, so exactly 1 real root"),
            ("tan x = x for x ∈ (0, 3π)", "II", "2", "In (0, π/2) tan x > x; exactly one root in (π/2, 3π/2); exactly one root in (3π/2, 5π/2); no roots in [5π/2, 3π). Total = 2"),
            ("sin x = x² + x + 1 for x ∈ ℝ", "III", "0", "x² + x + 1 = (x + 1/2)² + 3/4 ≥ 3/4. Graphically and analytically, x² + x + 1 > sin x for all x ∈ ℝ, giving 0 roots")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match the trigonometric limits as x → 0 in List I with their evaluated values in List II:",
        [
            ("lim_{x→0} (tan x - sin x) / x³", "II", "1/2", "tan x - sin x = (x + x³/3 + ...) - (x - x³/6 + ...) = x³/2 + ..., so the limit is 1/2"),
            ("lim_{x→0} (x - sin x) / x³", "I", "1/6", "sin x = x - x³/6 + o(x³), so (x - sin x)/x³ → 1/6"),
            ("lim_{x→0} (sin x - x cos x) / x³", "III", "1/3", "(x - x³/6) - x(1 - x²/2) = x³/3 + o(x³), so the limit is 1/3"),
            ("lim_{x→0} (sin(tan x) - tan(sin x)) / x⁷", "IV", "-1/30", "By 7th order Taylor expansions, sin(tan x) - tan(sin x) = -x⁷/30 + o(x⁷), so the limit is -1/30")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match the trigonometric inequalities valid for x ∈ (0, π/2) in List I with their mathematical descriptions in List II:",
        [
            ("sin x < x < tan x", "I", "Fundamental classical trigonometric inequality", "Proved by comparing areas of the inscribed triangle, circular sector, and circumscribed triangle"),
            ("2x/π < sin x < x", "III", "Jordan's inequality", "Concavity of sin x on [0, π/2] implies the curve lies above the secant line y = 2x/π"),
            ("cos x > 1 - x²/2", "IV", "Taylor quadratic lower bound for cosine", "Follows from alternating series truncation or integrating sin t < t twice"),
            ("tan x > x + x³/3", "II", "Convexity bound for tangent", "Follows from the first two non-zero terms of the Taylor series of tan x on (0, π/2)")
        ], "D"))

    # ==========================================
    # TOPIC 2: Inverse Trigonometric Functions (20 questions)
    # ==========================================
    t = "Inverse Trigonometric Functions"
    prefix = "math_mat_invtrig"
    
    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the principal values of the inverse trigonometric expressions in List I with List II:",
        [
            ("arcsin(1/2)", "II", "π/6", "In the principal range [-π/2, π/2], sin(π/6) = 1/2, so arcsin(1/2) = π/6"),
            ("arccos(-1/2)", "IV", "2π/3", "In the principal range [0, π], cos(2π/3) = -1/2, so arccos(-1/2) = 2π/3"),
            ("arctan(-1)", "I", "-π/4", "In the principal range (-π/2, π/2), tan(-π/4) = -1, so arctan(-1) = -π/4"),
            ("arcsec(2)", "III", "π/3", "arcsec(2) = arccos(1/2) = π/3")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the inverse trigonometric expressions in List I with their evaluated constant values in List II:",
        [
            ("arcsin(x) + arccos(x) for x ∈ [-1, 1]", "IV", "π/2", "Standard complementary identity: arcsin x + arccos x = π/2 for all x ∈ [-1, 1]"),
            ("arctan(1) + arctan(2) + arctan(3)", "II", "π", "arctan 1 = π/4; since 2×3 > 1, arctan 2 + arctan 3 = π + arctan((2+3)/(1-6)) = 3π/4. Total = π"),
            ("arctan(1) + arctan(0)", "I", "π/4", "arctan(1) = π/4 and arctan(0) = 0, so the sum is π/4"),
            ("arccos(1) + arcsin(0)", "III", "0", "arccos(1) = 0 and arcsin(0) = 0, so 0 + 0 = 0")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the composite trigonometric evaluations in List I with their values in List II:",
        [
            ("sin(arcsin(0.6))", "II", "0.6", "sin(arcsin x) = x for all x ∈ [-1, 1]"),
            ("cos(arccos(-0.4))", "IV", "-0.4", "cos(arccos x) = x for all x ∈ [-1, 1]"),
            ("tan(arctan(5))", "I", "5", "tan(arctan x) = x for all x ∈ ℝ"),
            ("sin(arccos(3/5))", "III", "4/5", "sin(arccos(3/5)) = √(1 - (3/5)²) = √(16/25) = 4/5")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match each inverse trigonometric function in List I with its standard principal range in List II:",
        [
            ("arcsin(x)", "III", "[-π/2, π/2]", "The principal range of arcsine is the closed interval [-π/2, π/2]"),
            ("arccos(x)", "IV", "[0, π]", "The principal range of arccosine is the closed interval [0, π]"),
            ("arctan(x)", "I", "(-π/2, π/2)", "The principal range of arctangent is the open interval (-π/2, π/2)"),
            ("arccot(x)", "II", "(0, π)", "The principal range of arccotangent is the open interval (0, π)")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match the evaluations of composite functions in List I with their exact angles in List II:",
        [
            ("arcsin(sin(5π/6))", "I", "π/6", "5π/6 ∈ [π/2, 3π/2], so arcsin(sin(5π/6)) = π - 5π/6 = π/6"),
            ("arcsin(sin(7π/6))", "IV", "-π/6", "7π/6 ∈ [π/2, 3π/2], so arcsin(sin(7π/6)) = π - 7π/6 = -π/6"),
            ("arccos(cos(4π/3))", "II", "2π/3", "4π/3 ∈ [π, 2π], so arccos(cos(4π/3)) = 2π - 4π/3 = 2π/3"),
            ("arctan(tan(3π/4))", "III", "-π/4", "3π/4 ∈ (π/2, 3π/2), so arctan(tan(3π/4)) = 3π/4 - π = -π/4")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match the arctangent operations in List I with their evaluated results in List II:",
        [
            ("arctan(1/2) + arctan(1/3)", "II", "π/4", "arctan((1/2 + 1/3)/(1 - 1/6)) = arctan((5/6)/(5/6)) = arctan(1) = π/4"),
            ("2 arctan(1/3)", "IV", "arctan(3/4)", "arctan(2(1/3)/(1 - 1/9)) = arctan((2/3)/(8/9)) = arctan(3/4)"),
            ("arctan(2) - arctan(1)", "I", "arctan(1/3)", "arctan((2 - 1)/(1 + 2×1)) = arctan(1/3)"),
            ("2 arctan(1/2)", "III", "arctan(4/3)", "arctan(2(1/2)/(1 - 1/4)) = arctan(1/(3/4)) = arctan(4/3)")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match the trigonometric-inverse expressions in List I with their algebraic equivalents for x ∈ (0, 1) in List II:",
        [
            ("sin(2 arctan x)", "III", "2x / (1 + x²)", "Let θ = arctan x. Then sin(2θ) = 2 tan θ / (1 + tan² θ) = 2x / (1 + x²)"),
            ("cos(2 arctan x)", "I", "(1 - x²) / (1 + x²)", "cos(2θ) = (1 - tan² θ) / (1 + tan² θ) = (1 - x²) / (1 + x²)"),
            ("tan(2 arctan x)", "IV", "2x / (1 - x²)", "tan(2θ) = 2 tan θ / (1 - tan² θ) = 2x / (1 - x²)"),
            ("cos(arcsin x)", "II", "√(1 - x²)", "Let θ = arcsin x. Then cos θ = √(1 - sin² θ) = √(1 - x²)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match each equation in List I with its unique positive real solution x > 0 in List II:",
        [
            ("arctan(2x) + arctan(3x) = π/4", "IV", "x = 1/6", "5x / (1 - 6x²) = 1 => 6x² + 5x - 1 = 0 => (6x - 1)(x + 1) = 0. Since x > 0, x = 1/6"),
            ("arccos x + arccos(x√3) = π/2", "II", "x = 1/2", "arccos(x√3) = π/2 - arccos x = arcsin x => x√3 = √(1 - x²) => 3x² = 1 - x² => 4x² = 1 => x = 1/2"),
            ("arcsin x = arccos x", "I", "x = 1/√2", "arcsin x = π/2 - arcsin x => 2 arcsin x = π/2 => arcsin x = π/4 => x = 1/√2"),
            ("arctan(x + 1) + arctan(x - 1) = arctan(8/31)", "III", "x = 1/4", "2x / (1 - (x² - 1)) = 8/31 => 2x / (2 - x²) = 8/31 => 4x² + 31x - 8 = 0 => (4x - 1)(x + 8) = 0 => x = 1/4")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match the composite trigonometric evaluations in List I with their numerical values in List II:",
        [
            ("sin(2 arctan(1/3))", "II", "3/5", "2(1/3) / (1 + (1/3)²) = (2/3)/(10/9) = 3/5"),
            ("cos(2 arctan(2))", "IV", "-3/5", "(1 - 2²) / (1 + 2²) = (1 - 4)/(1 + 4) = -3/5"),
            ("tan(2 arcsin(1/√5))", "I", "4/3", "sin θ = 1/√5 => tan θ = 1/2. tan(2θ) = 2(1/2)/(1 - 1/4) = 1/(3/4) = 4/3"),
            ("sin(3 arcsin(1/3))", "III", "23/27", "3(1/3) - 4(1/3)³ = 1 - 4/27 = 23/27")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the inverse trigonometric functions in List I with their maximal real domains in List II:",
        [
            ("f(x) = arcsin(2x - 1)", "I", "[0, 1]", "-1 ≤ 2x - 1 ≤ 1 => 0 ≤ 2x ≤ 2 => 0 ≤ x ≤ 1"),
            ("f(x) = arccos(x² - 1)", "III", "[-√2, √2]", "-1 ≤ x² - 1 ≤ 1 => 0 ≤ x² ≤ 2 => |x| ≤ √2"),
            ("f(x) = arctan(√(x - 2))", "IV", "[2, ∞)", "Square root requires x - 2 ≥ 0 => x ≥ 2; arctangent accepts all real inputs"),
            ("f(x) = arcsec(x/3)", "II", "(-∞, -3] ∪ [3, ∞)", "|x/3| ≥ 1 => |x| ≥ 3 => x ≤ -3 or x ≥ 3")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match each inverse trigonometric series in List I with its evaluation in List II:",
        [
            ("∑_{n=1}^N arctan(1 / (n² + n + 1))", "III", "arctan(N + 1) - π/4", "Telescopes as ∑ [arctan(n+1) - arctan n] = arctan(N+1) - arctan 1 = arctan(N+1) - π/4"),
            ("lim_{N→∞} ∑_{n=1}^N arctan(1 / (n² + n + 1))", "I", "π/4", "Taking N → ∞ in arctan(N+1) - π/4 yields π/2 - π/4 = π/4"),
            ("lim_{N→∞} ∑_{n=1}^N arctan(2 / n²)", "II", "3π/4", "Telescopes as ∑ [arctan(n+1) - arctan(n-1)] = arctan(N+1) + arctan(N) - arctan 1 - arctan 0 → π/2 + π/2 - π/4 = 3π/4"),
            ("∑_{n=1}^N arctan(2 / n²)", "IV", "arctan(N + 1) + arctan(N) - π/4", "Summing the telescoping terms gives arctan(N+1) + arctan N - arctan 1 = arctan(N+1) + arctan N - π/4")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match the reflection identities for negative arguments in List I with their expressions in List II (valid on respective domains):",
        [
            ("arcsin(-x)", "IV", "-arcsin x", "Arcsine is an odd function: arcsin(-x) = -arcsin x"),
            ("arccos(-x)", "II", "π - arccos x", "Arccosine reflection property: arccos(-x) = π - arccos x"),
            ("arctan(-x)", "III", "-arctan x", "Arctangent is an odd function: arctan(-x) = -arctan x"),
            ("arccot(-x)", "I", "π - arccot x", "Arccotangent reflection property: arccot(-x) = π - arccot x")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Match the inverse trigonometric series and sums in List I with their evaluated results in List II:",
        [
            ("∑_{n=1}^∞ arctan(1 / (2n²))", "II", "π/4", "arctan(1/(2n²)) = arctan(2n+1) - arctan(2n-1). Telescoping sum yields lim_{N→∞} arctan(2N+1) - arctan(1) = π/2 - π/4 = π/4"),
            ("∑_{n=1}^∞ arctan(2 / n²)", "IV", "3π/4", "Decomposition arctan(n+1) - arctan(n-1) yields π/2 + π/2 - arctan 1 = 3π/4"),
            ("∑_{n=1}^∞ arctan(1 / (n² + 3n + 3))", "I", "arctan(1/2)", "arctan((n+2)-(n+1))/(1+(n+1)(n+2)) = arctan(n+2) - arctan(n+1). Sum to infinity is π/2 - arctan 2 = arccot 2 = arctan(1/2)"),
            ("arctan(1) + arctan(1/2) + arctan(1/3)", "III", "π/2", "arctan(1/2) + arctan(1/3) = arctan(1) = π/4, so the total sum is π/4 + π/4 = π/2")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match the derivative expressions in List I with their simplified formulas in List II:",
        [
            ("d/dx [arcsin(x)]", "III", "1 / √(1 - x²)", "Standard derivative of arcsine on (-1, 1)"),
            ("d/dx [arctan(x)]", "I", "1 / (1 + x²)", "Standard derivative of arctangent on ℝ"),
            ("d/dx [arcsec(x)] for x > 1", "IV", "1 / (x √(x² - 1))", "Standard derivative of arcsecant for x > 1"),
            ("d/dx [arccos(x)]", "II", "-1 / √(1 - x²)", "Derivative of arccosine is the negative of the derivative of arcsine")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "For the function f(x) = arccos(2x² - 1) defined on [-1, 1], match List I with List II:",
        [
            ("f(x) for x ∈ [0, 1]", "II", "2 arccos x", "Let x = cos θ with θ ∈ [0, π/2]. Then 2θ ∈ [0, π], so arccos(cos 2θ) = 2θ = 2 arccos x"),
            ("f(x) for x ∈ [-1, 0]", "IV", "2π - 2 arccos x", "Let x = cos θ with θ ∈ [π/2, π]. Then 2θ ∈ [π, 2π], so arccos(cos 2θ) = 2π - 2θ = 2π - 2 arccos x"),
            ("f'(x) for x ∈ (0, 1)", "I", "-2 / √(1 - x²)", "Differentiating 2 arccos x gives -2 / √(1 - x²)"),
            ("f'(x) for x ∈ (-1, 0)", "III", "2 / √(1 - x²)", "Differentiating 2π - 2 arccos x gives -2(-1 / √(1 - x²)) = 2 / √(1 - x²)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match each system of equations in List I with its solution set in List II:",
        [
            ("arcsin x + arcsin y = 2π/3 and arccos x - arccos y = π/3", "IV", "(x, y) = (1/2, 1)", "Adding equations: (arcsin x + arccos x) + (arcsin y - arccos y) = π => π - 2 arccos y = π/2 => arccos y = 0 => y = 1; then x = 1/2"),
            ("arctan x + arctan y = π/2 for x, y > 0", "I", "xy = 1", "arctan y = π/2 - arctan x = arctan(1/x) => y = 1/x => xy = 1"),
            ("arcsin x + arccos y = 2π", "III", "No real solution", "Max of arcsin x is π/2 and max of arccos y is π, so arcsin x + arccos y ≤ 3π/2 < 2π, hence no real solution exists"),
            ("arcsin x = 2 arcsin y with x = 1", "II", "y = 1/√2", "arcsin 1 = π/2 => 2 arcsin y = π/2 => arcsin y = π/4 => y = 1/√2")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match the limits involving inverse trigonometric functions in List I with their evaluated values in List II:",
        [
            ("lim_{x→0} (arcsin x - x) / x³", "I", "1/6", "Using arcsin x = x + x³/6 + o(x³), the limit is 1/6"),
            ("lim_{x→0} (x - arctan x) / x³", "III", "1/3", "Using arctan x = x - x³/3 + o(x³), the limit is 1/3"),
            ("lim_{x→0} (arcsin x - arctan x) / x³", "II", "1/2", "(x + x³/6) - (x - x³/3) = x³/2 + o(x³), so the limit is 1/6 + 1/3 = 1/2"),
            ("lim_{x→∞} x (π/2 - arctan x)", "IV", "1", "π/2 - arctan x = arctan(1/x), and as x → ∞, x arctan(1/x) → 1")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match the definite integrals of inverse trigonometric functions in List I with their values in List II:",
        [
            ("∫_0^1 arcsin x dx", "II", "π/2 - 1", "Integration by parts gives [x arcsin x + √(1 - x²)]_0^1 = (1·(π/2) + 0) - (0 + 1) = π/2 - 1"),
            ("∫_0^1 arctan x dx", "IV", "π/4 - (1/2)ln 2", "Integration by parts gives [x arctan x - (1/2)ln(1 + x²)]_0^1 = π/4 - (1/2)ln 2"),
            ("∫_0^1 arccos x dx", "I", "1", "Integration by parts gives [x arccos x - √(1 - x²)]_0^1 = (0 - 0) - (0 - 1) = 1"),
            ("∫_0^1 (arctan x / (1 + x²)) dx", "III", "π²/32", "With u = arctan x, du = dx/(1 + x²): ∫_0^{π/4} u du = [u²/2]_0^{π/4} = π²/32")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match the composite inverse trigonometric expressions in List I with their simplified forms on the specified intervals in List II:",
        [
            ("arcsin(2x √(1 - x²)) for x ∈ (1/√2, 1]", "III", "π - 2 arcsin x", "Let x = sin θ with θ ∈ (π/4, π/2]. Then 2θ ∈ (π/2, π], so arcsin(sin 2θ) = π - 2θ = π - 2 arcsin x"),
            ("arcsin(2x √(1 - x²)) for x ∈ [-1/√2, 1/√2]", "I", "2 arcsin x", "Let x = sin θ with θ ∈ [-π/4, π/4]. Then 2θ ∈ [-π/2, π/2], so arcsin(sin 2θ) = 2θ = 2 arcsin x"),
            ("arccos(2x² - 1) for x ∈ [-1, 0)", "IV", "2π - 2 arccos x", "Let x = cos θ with θ ∈ (π/2, π]. Then 2θ ∈ (π, 2π], so arccos(cos 2θ) = 2π - 2θ = 2π - 2 arccos x"),
            ("arctan(2x / (1 - x²)) for x > 1", "II", "2 arctan x - π", "For x > 1, let x = tan θ with θ ∈ (π/4, π/2). Then 2θ ∈ (π/2, π), so arctan(tan 2θ) = 2θ - π = 2 arctan x - π")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "For the function f(x) = (arcsin x)³ + (arccos x)³ defined for x ∈ [-1, 1], match List I with List II:",
        [
            ("Absolute minimum value of f(x)", "III", "π³/32", "Using a³ + b³ with a + b = π/2 gives minimum at a = b = π/4 (x = 1/√2): 2(π/4)³ = π³/32"),
            ("Absolute maximum value of f(x)", "IV", "7π³/8", "Maximum occurs at x = -1 where a = -π/2, b = π: (-π/2)³ + π³ = -π³/8 + π³ = 7π³/8"),
            ("Value of x where f(x) attains its minimum", "I", "1/√2", "f(x) attains its unique minimum when arcsin x = arccos x, which gives x = 1/√2"),
            ("Value of f(0)", "II", "π³/8", "At x = 0, arcsin 0 = 0 and arccos 0 = π/2, so 0³ + (π/2)³ = π³/8")
        ], "D"))

    return qs
