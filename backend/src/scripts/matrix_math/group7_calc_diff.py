from builder import make_matrix_q

def get_questions():
    qs = []

    # ============================================================
    # TOPIC: Limits and Derivatives (20 questions)
    # ============================================================
    t = "Limits and Derivatives"
    prefix = "math_mat_lim"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match each standard limit in List I with its evaluated value in List II:",
        [
            ("lim_{x -> 0} (sin 3x)/x", "II", "3", "Using standard limit lim_{u -> 0} (sin u)/u = 1, lim_{x -> 0} 3(sin 3x)/(3x) = 3"),
            ("lim_{x -> 0} (1 - cos x)/x²", "IV", "1/2", "Using standard limit lim_{x -> 0} (1 - cos x)/x² = 2 sin²(x/2)/x² = 1/2"),
            ("lim_{x -> 0} ln(1 + 4x)/x", "I", "4", "Using standard limit lim_{u -> 0} ln(1 + u)/u = 1, lim_{x -> 0} 4 ln(1 + 4x)/(4x) = 4"),
            ("lim_{x -> 0} (e^(2x) - 1)/x", "III", "2", "Using standard limit lim_{u -> 0} (e^u - 1)/u = 1, lim_{x -> 0} 2(e^(2x) - 1)/(2x) = 2")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match each function f(x) in List I with its first derivative f'(1) evaluated at x = 1 in List II:",
        [
            ("f(x) = x⁴ - 3x² + 5x", "III", "3", "f'(x) = 4x³ - 6x + 5. At x = 1, f'(1) = 4 - 6 + 5 = 3"),
            ("f(x) = x/(x + 1)", "I", "1/4", "By quotient rule, f'(x) = ((x+1) - x)/(x+1)² = 1/(x+1)². At x = 1, f'(1) = 1/4"),
            ("f(x) = x ln x", "IV", "1", "By product rule, f'(x) = ln x + 1. At x = 1, f'(1) = 0 + 1 = 1"),
            ("f(x) = e^(2x - 2)", "II", "2", "By chain rule, f'(x) = 2e^(2x - 2). At x = 1, f'(1) = 2e^0 = 2")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each algebraic limit in List I with its finite evaluated value in List II:",
        [
            ("lim_{x -> 2} (x³ - 8)/(x - 2)", "IV", "12", "Factor numerator: (x - 2)(x² + 2x + 4)/(x - 2) = x² + 2x + 4. At x = 2: 4 + 4 + 4 = 12"),
            ("lim_{x -> 1} (√x - 1)/(x - 1)", "II", "1/2", "Factor denominator as (√x - 1)(√x + 1), giving 1/(√x + 1) -> 1/2 as x -> 1"),
            ("lim_{x -> 3} (x² - 9)/(x² - 2x - 3)", "I", "3/2", "Factor: (x - 3)(x + 3)/((x - 3)(x + 1)) = (x + 3)/(x + 1). At x = 3: 6/4 = 3/2"),
            ("lim_{x -> ∞} (4x² + 3x)/(2x² - 5)", "III", "2", "Divide numerator and denominator by x²: lim (4 + 3/x)/(2 - 5/x²) = 4/2 = 2")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match each trigonometric derivative in List I with its exact value at the specified point in List II:",
        [
            ("d/dx (x sin x) at x = π", "III", "-π", "d/dx(x sin x) = sin x + x cos x. At x = π: sin π + π cos π = 0 + π(-1) = -π"),
            ("d/dx (sin² x) at x = π/4", "I", "1", "d/dx(sin² x) = 2 sin x cos x = sin 2x. At x = π/4: sin(π/2) = 1"),
            ("d/dx (sec x) at x = π/4", "IV", "√2", "d/dx(sec x) = sec x tan x. At x = π/4: sec(π/4) tan(π/4) = √2 * 1 = √2"),
            ("d/dx (cos 2x) at x = π/4", "II", "-2", "d/dx(cos 2x) = -2 sin 2x. At x = π/4: -2 sin(π/2) = -2")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each indeterminate limit of 1^∞ form in List I with its evaluated value in List II:",
        [
            ("lim_{x -> 0} (1 + 2x)^(1/x)", "I", "e²", "Standard 1^∞ limit: e^(lim_{x -> 0} 2x * 1/x) = e²"),
            ("lim_{x -> 0} (cos x)^(1/x²)", "III", "e^(-1/2)", "1^∞ limit: e^(lim_{x -> 0} (cos x - 1)/x²) = e^(-1/2)"),
            ("lim_{x -> ∞} ((x + 3)/(x - 1))^x", "IV", "e⁴", "((x + 3)/(x - 1))^x = (1 + 4/(x - 1))^x -> e^(lim_{x -> ∞} 4x/(x - 1)) = e⁴"),
            ("lim_{x -> 0} (1 + sin 3x)^(cot x)", "II", "e³", "1^∞ form: e^(lim_{x -> 0} sin 3x * cot x) = e^(lim_{x -> 0} (sin 3x / x) * (x / tan x)) = e³")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match each limit evaluated using L'Hôpital's rule or series expansion in List I with its finite value in List II:",
        [
            ("lim_{x -> 0} (e^x - 1 - x)/x²", "IV", "1/2", "Using Taylor expansion e^x = 1 + x + x²/2 + ..., limit is 1/2"),
            ("lim_{x -> 0} (x - sin x)/x³", "II", "1/6", "Using sin x = x - x³/6 + ..., limit is 1/6"),
            ("lim_{x -> 0} (tan x - x)/x³", "I", "1/3", "Using tan x = x + x³/3 + ..., limit is 1/3"),
            ("lim_{x -> 0} (ln(1 + x) - x)/x²", "III", "-1/2", "Using ln(1 + x) = x - x²/2 + ..., limit is -1/2")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match each parametric curve in List I with the value of dy/dx at the specified parameter value in List II:",
        [
            ("x = a cos θ, y = a sin θ at θ = π/4", "II", "-1", "dy/dx = (dy/dθ)/(dx/dθ) = (a cos θ)/(-a sin θ) = -cot θ. At θ = π/4, -cot(π/4) = -1"),
            ("x = a t², y = 2at at t = 2", "IV", "1/2", "dy/dx = (2a)/(2at) = 1/t. At t = 2, dy/dx = 1/2"),
            ("x = a(θ - sin θ), y = a(1 - cos θ) at θ = π/2", "I", "1", "dy/dx = (a sin θ)/(a(1 - cos θ)) = sin θ / (1 - cos θ). At θ = π/2: 1/(1 - 0) = 1"),
            ("x = 2 cos t, y = 3 sin t at t = π/6", "III", "-3√3/2", "dy/dx = (3 cos t)/(-2 sin t) = -(3/2) cot t. At t = π/6: -(3/2)(√3) = -3√3/2")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match each limit at infinity involving radical expressions in List I with its finite value in List II:",
        [
            ("lim_{x -> ∞} (√(x² + 4x) - x)", "I", "2", "Rationalizing gives 4x / (√(x² + 4x) + x) -> 4/(1 + 1) = 2"),
            ("lim_{x -> ∞} (√(x² + 6x + 1) - x)", "III", "3", "Rationalizing gives (6x + 1) / (√(x² + 6x + 1) + x) -> 6/2 = 3"),
            ("lim_{x -> ∞} x(√(x² + 1) - x)", "IV", "1/2", "Rationalizing gives x / (√(x² + 1) + x) -> 1/(1 + 1) = 1/2"),
            ("lim_{x -> ∞} ((x³ + 3x²)^(1/3) - x)", "II", "1", "Using binomial expansion x(1 + 3/x)^(1/3) - x = x(1 + 1/x + O(1/x²)) - x -> 1")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match each function y = f(x) in List I with the value of its second derivative y''(0) at x = 0 in List II:",
        [
            ("y = e^(x²)", "III", "2", "y' = 2x e^(x²), y'' = 2e^(x²) + 4x² e^(x²). At x = 0: y''(0) = 2"),
            ("y = cos(3x)", "I", "-9", "y' = -3 sin(3x), y'' = -9 cos(3x). At x = 0: y''(0) = -9"),
            ("y = ln(1 + 2x)", "IV", "-4", "y' = 2/(1 + 2x), y'' = -4/(1 + 2x)². At x = 0: y''(0) = -4"),
            ("y = (1 + x)⁴", "II", "12", "y' = 4(1 + x)³, y'' = 12(1 + x)². At x = 0: y''(0) = 12")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match each limit involving inverse trigonometric functions in List I with its value in List II:",
        [
            ("lim_{x -> 0} (sin⁻¹ x - x)/x³", "I", "1/6", "Since sin⁻¹ x = x + x³/6 + O(x⁵), the limit is 1/6"),
            ("lim_{x -> 0} (tan⁻¹ x - x)/x³", "III", "-1/3", "Since tan⁻¹ x = x - x³/3 + O(x⁵), the limit is -1/3"),
            ("lim_{x -> 0} sin⁻¹(2x) / tan⁻¹(3x)", "IV", "2/3", "lim (sin⁻¹(2x)/(2x)) * (3x / tan⁻¹(3x)) * (2/3) = 1 * 1 * (2/3) = 2/3"),
            ("lim_{x -> 1} (sin⁻¹ x - π/2)/√(1 - x²)", "II", "-1", "Let x = cos θ as θ -> 0⁺: (π/2 - θ - π/2)/sin θ = -θ/sin θ -> -1")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Given differentiable functions with f(1) = 2, f'(1) = 3, g(1) = 4, g'(1) = -1, match each derivative in List I with its evaluated value at x = 1 in List II:",
        [
            ("d/dx [f(x) g(x)] at x = 1", "IV", "10", "Product rule: f'(1)g(1) + f(1)g'(1) = 3(4) + 2(-1) = 12 - 2 = 10"),
            ("d/dx [f(x)/g(x)] at x = 1", "I", "7/8", "Quotient rule: (f'(1)g(1) - f(1)g'(1))/(g(1)²) = (12 - (-2))/16 = 14/16 = 7/8"),
            ("d/dx [f(x)² + g(x)²] at x = 1", "II", "4", "Chain rule: 2f(1)f'(1) + 2g(1)g'(1) = 2(2)(3) + 2(4)(-1) = 12 - 8 = 4"),
            ("d/dx [√(f(x) + g(x))] at x = 1", "III", "1/√6", "Chain rule: (f'(1) + g'(1))/(2√(f(1) + g(1))) = (3 - 1)/(2√6) = 2/(2√6) = 1/√6")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match each first principles difference quotient limit in List I with its evaluated derivative expression in List II:",
        [
            ("lim_{h -> 0} (sin(x + h) - sin x)/h", "III", "cos x", "Derivative of sin x from first principles is cos x"),
            ("lim_{h -> 0} (e^(x + h) - e^x)/h", "I", "e^x", "Derivative of e^x from first principles is e^x"),
            ("lim_{h -> 0} (ln(x + h) - ln x)/h for x > 0", "IV", "1/x", "Derivative of ln x from first principles is 1/x"),
            ("lim_{h -> 0} (√(x + h) - √x)/h for x > 0", "II", "1/(2√x)", "Derivative of √x from first principles is 1/(2√x)")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Match each higher-order limit evaluated using series expansion or Leibniz rule in List I with its value in List II:",
        [
            ("lim_{x -> 0} (sin x - x + x³/6)/x⁵", "II", "1/120", "sin x = x - x³/6 + x⁵/120 - ..., so (sin x - x + x³/6)/x⁵ -> 1/120"),
            ("lim_{x -> 0} (cos x - 1 + x²/2)/x⁴", "IV", "1/24", "cos x = 1 - x²/2 + x⁴/24 - ..., so (cos x - 1 + x²/2)/x⁴ -> 1/24"),
            ("lim_{x -> 0} (e^x - 1 - x - x²/2)/x³", "I", "1/6", "e^x = 1 + x + x²/2 + x³/6 + ..., so the limit is 1/6"),
            ("lim_{x -> 0} (∫_0^x sin(t²) dt) / x³", "III", "1/3", "By Leibniz rule: lim sin(x²)/(3x²) = (1/3) lim sin(x²)/x² = 1/3")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match each non-standard indeterminate limit in List I with its evaluated finite value in List II:",
        [
            ("lim_{x -> 0⁺} x^x", "III", "1", "ln L = lim_{x -> 0⁺} x ln x = lim (ln x)/(1/x) = lim (-1/x)/(1/x²) = 0, so L = e⁰ = 1"),
            ("lim_{x -> 0} (1/x - 1/(e^x - 1))", "I", "1/2", "(e^x - 1 - x)/(x(e^x - 1)) ~ (x²/2)/x² = 1/2"),
            ("lim_{x -> 0} (cot² x - 1/x²)", "IV", "-2/3", "(x² cos² x - sin² x)/(x⁴) ~ -2x⁴/3 / x⁴ = -2/3 using Taylor series"),
            ("lim_{x -> π/2} (sec x - tan x)", "II", "0", "(1 - sin x)/cos x -> (-cos x)/(-sin x) -> 0/1 = 0")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match each logarithmic or implicit differentiation problem in List I with the derivative dy/dx at the specified point in List II:",
        [
            ("y = x^x at x = e", "I", "2e^e", "dy/dx = x^x(1 + ln x). At x = e: e^e(1 + ln e) = 2e^e"),
            ("x² + y² = 25 at (3, 4)", "III", "-3/4", "Differentiating: 2x + 2y y' = 0 -> y' = -x/y = -3/4"),
            ("y = (ln x)^x at x = e", "IV", "1", "ln y = x ln(ln x) -> y'/y = ln(ln x) + 1/ln x. At x = e: y = 1, y' = 1*(0 + 1) = 1"),
            ("y² = 4x at (4, 4)", "II", "1/2", "2y y' = 4 -> y' = 2/y. At (4, 4): y' = 2/4 = 1/2")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match each parametric system in List I with the value of d²y/dx² at the specified parameter in List II:",
        [
            ("x = t², y = t³ at t = 1", "IV", "3/4", "dy/dx = 3t/2. d²y/dx² = (d/dt(dy/dx))/(dx/dt) = (3/2)/(2t) = 3/(4t). At t = 1: 3/4"),
            ("x = cos θ, y = sin θ at θ = π/2", "II", "-1", "dy/dx = -cot θ. d²y/dx² = (csc² θ)/(-sin θ) = -csc³ θ. At θ = π/2: -1"),
            ("x = 2t, y = t⁴ at t = 1", "I", "3", "dy/dx = 4t³/2 = 2t³. d²y/dx² = (6t²)/2 = 3t². At t = 1: 3"),
            ("x = e^t, y = e^(-t) at t = 0", "III", "2", "dy/dx = -e^(-2t). d²y/dx² = (2e^(-2t))/(e^t) = 2e^(-3t). At t = 0: 2")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match each limit involving the Squeeze Theorem or definite integral definition in List I with its value in List II:",
        [
            ("lim_{n -> ∞} Σ_{k=1}^n k/(n² + k)", "I", "1/2", "Bounded between (n(n+1)/2)/(n²+n) and (n(n+1)/2)/(n²+1), both approaching 1/2"),
            ("lim_{n -> ∞} (1/n) Σ_{k=1}^n 1/(1 + (k/n)²)", "III", "π/4", "Riemann sum converges to ∫_0^1 dx/(1 + x²) = [tan⁻¹ x]_0^1 = π/4"),
            ("lim_{n -> ∞} Σ_{k=1}^n 1/(n + k)", "IV", "ln 2", "Riemann sum converges to ∫_0^1 dx/(1 + x) = ln(2) - ln(1) = ln 2"),
            ("lim_{x -> 0} x² ⌊1/x⌋", "II", "0", "Since 1/x - 1 < ⌊1/x⌋ <= 1/x, multiplying by x² gives bounds tending to 0 as x -> 0")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match each one-sided limit involving fractional parts {x} = x - ⌊x⌋ or floor ⌊x⌋ in List I with its value in List II:",
        [
            ("lim_{x -> 0⁺} ({x} sin {x})/x²", "IV", "1", "For x ∈ (0, 1), {x} = x, so lim (x sin x)/x² = 1"),
            ("lim_{x -> 2⁺} (⌊x⌋² - 4)/(x² - 4)", "II", "0", "For x ∈ (2, 3), ⌊x⌋ = 2, so numerator is 2² - 4 = 0 for all such x, limit is 0"),
            ("lim_{x -> 1⁻} (⌊x⌋ + {x})/(x² + 1)", "I", "1/2", "As x -> 1⁻, ⌊x⌋ = 0 and {x} -> 1, while x² + 1 -> 2, yielding 1/2"),
            ("lim_{x -> 0⁺} (⌊x⌋ + 2)/({x} + 1)", "III", "2", "As x -> 0⁺, ⌊x⌋ = 0 and {x} -> 0, yielding (0 + 2)/(0 + 1) = 2")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match each higher-order trigonometric limit in List I with its evaluated value in List II:",
        [
            ("lim_{x -> 0} (x cos x - sin x)/x³", "II", "-1/3", "x(1 - x²/2) - (x - x³/6) = -x³/3 + O(x⁵), giving -1/3"),
            ("lim_{x -> 0} (e^x - e^(sin x))/(x - sin x)", "IV", "1", "e^(sin x)(e^(x - sin x) - 1)/(x - sin x) -> 1 * 1 = 1"),
            ("lim_{x -> 0} ln(cos x)/x²", "I", "-1/2", "ln(cos x) = ln(1 - (1 - cos x)) ~ -(1 - cos x) ~ -x²/2, giving -1/2"),
            ("lim_{x -> 0} (tan x - sin x)/x³", "III", "1/2", "tan x (1 - cos x)/x³ = (tan x / x) * ((1 - cos x)/x²) -> 1 * (1/2) = 1/2")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each inverse trigonometric composite function in List I with the evaluated derivative in List II:",
        [
            ("d/dx [tan⁻¹(2x/(1 - x²))] at x = 1/2", "III", "8/5", "For |x| < 1, f(x) = 2 tan⁻¹ x -> f'(x) = 2/(1 + x²). At x = 1/2: 2/(1 + 1/4) = 8/5"),
            ("d/dx [sin⁻¹(2x/(1 + x²))] at x = 0", "I", "2", "For |x| < 1, f(x) = 2 tan⁻¹ x -> f'(x) = 2/(1 + x²). At x = 0: 2"),
            ("d/dx [cos⁻¹((1 - x²)/(1 + x²))] at x = 1", "IV", "1", "For x > 0, f(x) = 2 tan⁻¹ x -> f'(x) = 2/(1 + x²). At x = 1: 2/(1 + 1) = 1"),
            ("d/dx [tan⁻¹((3x - x³)/(1 - 3x²))] at x = 0", "II", "3", "For |x| < 1/√3, f(x) = 3 tan⁻¹ x -> f'(x) = 3/(1 + x²). At x = 0: 3")
        ], "D"))

    # ============================================================
    # TOPIC: Continuity and Differentiability (20 questions)
    # ============================================================
    t = "Continuity and Differentiability"
    prefix = "math_mat_cont"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "For each piecewise function defined on ℝ, match it with the value of parameter k in List II that makes it continuous at x = 0:",
        [
            ("f(x) = (sin 4x)/x for x ≠ 0, f(0) = k", "II", "4", "lim_{x -> 0} (sin 4x)/x = 4, so continuity requires k = 4"),
            ("f(x) = (1 - cos 2x)/x² for x ≠ 0, f(0) = k", "IV", "2", "lim_{x -> 0} 2 sin² x / x² = 2, so continuity requires k = 2"),
            ("f(x) = (e^(3x) - 1)/x for x ≠ 0, f(0) = k", "I", "3", "lim_{x -> 0} (e^(3x) - 1)/x = 3, so continuity requires k = 3"),
            ("f(x) = ln(1 + 5x)/x for x ≠ 0, f(0) = k", "III", "5", "lim_{x -> 0} ln(1 + 5x)/x = 5, so continuity requires k = 5")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match each function in List I with its type of discontinuity at x = 0 in List II:",
        [
            ("f(x) = (sin x)/|x|", "III", "Jump discontinuity", "LHL = -1 and RHL = 1, so limits exist but differ, giving a finite jump"),
            ("f(x) = x² for x ≠ 0, f(0) = 1", "I", "Removable discontinuity", "LHL = RHL = 0 ≠ f(0) = 1, so discontinuity can be removed by redefining f(0) = 0"),
            ("f(x) = 1/x", "IV", "Infinite discontinuity", "Limits as x -> 0 approach ±∞, so it has an infinite discontinuity"),
            ("f(x) = sin(1/x)", "II", "Oscillatory discontinuity", "Function oscillates infinitely between -1 and 1 as x -> 0, so limit does not exist")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each function in List I with the number of points in ℝ where it is NOT differentiable in List II:",
        [
            ("f(x) = |x - 2|", "I", "1 point", "Has a sharp corner at x = 2, so non-differentiable at exactly 1 point"),
            ("f(x) = |x - 1| + |x + 3|", "III", "2 points", "Has sharp corners at x = 1 and x = -3, so non-differentiable at 2 points"),
            ("f(x) = |x(x - 1)(x - 2)|", "IV", "3 points", "Vanishes with simple roots at x = 0, 1, 2, giving sharp corners at 3 points"),
            ("f(x) = x |x|", "II", "0 points", "f'(x) = 2|x| and f'(0) = 0, so differentiable everywhere on ℝ (0 points)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "For the function f(x) = |x - 3|, match each evaluated quantity in List I with its value in List II:",
        [
            ("Left Hand Limit: lim_{x -> 3⁻} f(x)", "III", "0", "lim_{x -> 3⁻} |x - 3| = 0"),
            ("Right Hand Derivative: f'(3⁺)", "I", "1", "For x > 3, f(x) = x - 3, so f'(3⁺) = 1"),
            ("Left Hand Derivative: f'(3⁻)", "IV", "-1", "For x < 3, f(x) = -(x - 3), so f'(3⁻) = -1"),
            ("Function value: f(5)", "II", "2", "f(5) = |5 - 3| = 2")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each piecewise function in List I with the parameter value in List II that ensures differentiability at the boundary:",
        [
            ("f(x) = ax + b for x ≤ 1, x² + 3 for x > 1 (value of a)", "II", "2", "f'(1⁺) = 2(1) = 2, so f'(1⁻) = a = 2"),
            ("g(x) = ax² + 1 for x ≤ 2, 4x + b for x > 2 (value of b)", "IV", "-3", "g'(2⁻) = 4a = g'(2⁺) = 4 -> a = 1. Continuity: 1(4)+1 = 4(2)+b -> b = -3"),
            ("h(x) = a sin x + b cos x for x ≤ 0, 2x + 3 for x > 0 (value of b)", "I", "3", "Continuity at 0: h(0⁻) = b = h(0⁺) = 3 -> b = 3"),
            ("k(x) = x³ + a for x ≤ 1, bx - 1 for x > 1 (value of a)", "III", "1", "k'(1⁻) = 3 = b. Continuity: 1 + a = b - 1 = 2 -> a = 1")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match each function involving floor ⌊x⌋ in List I with the number of points of discontinuity in (0, 3) in List II:",
        [
            ("f(x) = ⌊x⌋", "I", "2 points", "Discontinuous at integer points x = 1 and x = 2 in (0, 3), total 2 points"),
            ("f(x) = ⌊x²⌋", "III", "8 points", "Discontinuous at x = 1, √2, √3, 2, √5, √6, √7, √8, total 8 points"),
            ("f(x) = (x - 1) ⌊x⌋", "IV", "1 point", "Continuous at x = 1 because (1-1)*0 = (1-1)*1 = 0; discontinuous only at x = 2, so 1 point"),
            ("f(x) = sin(π x) ⌊x⌋", "II", "0 points", "At both integers x = 1 and x = 2, sin(π x) = 0, so limits match 0 from both sides, 0 points")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match each function f(x) in List I with its exact set of non-differentiable points in List II:",
        [
            ("f(x) = max{x, x³}", "IV", "{-1, 0, 1}", "x³ - x = 0 at x = -1, 0, 1 with differing slopes of x and x³ at all three intersections"),
            ("f(x) = |x² - 4|", "II", "{-2, 2}", "Absolute value of polynomial has sharp corners at roots x = ±2"),
            ("f(x) = |x - 1| + |x - 3|", "I", "{1, 3}", "Sharp corners occur at x = 1 and x = 3"),
            ("f(x) = |sin x| on (0, 2π)", "III", "{π}", "sin x changes sign at x = π in (0, 2π), giving a sharp corner at {π}")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "For the functions f_p(x) = x^p sin(1/x) for x ≠ 0 and f_p(0) = 0, match each power p in List I with its property at x = 0 in List II:",
        [
            ("p = 0", "III", "Discontinuous at x = 0", "sin(1/x) oscillates with no limit as x -> 0, so discontinuous at x = 0"),
            ("p = 1", "I", "Continuous but not differentiable at x = 0", "lim x sin(1/x) = 0 (continuous), but difference quotient sin(1/h) has no limit (non-differentiable)"),
            ("p = 2", "IV", "Differentiable with discontinuous derivative at x = 0", "f'(0) = 0, but f'(x) = 2x sin(1/x) - cos(1/x) has no limit as x -> 0"),
            ("p = 3", "II", "Differentiable with continuous derivative at x = 0", "f'(x) = 3x² sin(1/x) - x cos(1/x) -> 0 as x -> 0, so f'(x) is continuous at x = 0")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match each function in List I with the number of non-differentiable points in the interval (-2, 2) in List II:",
        [
            ("f(x) = |x| + |x² - 1|", "II", "3 points", "Non-differentiable at x = 0 (from |x|) and x = ±1 (from |x² - 1|), total 3 points in (-2, 2)"),
            ("f(x) = |cos x| on (-2, 2)", "IV", "2 points", "cos x = 0 at x = ±π/2 ≈ ±1.57 ∈ (-2, 2), giving 2 points"),
            ("f(x) = x² |x|", "I", "0 points", "f(x) = x³ for x ≥ 0 and -x³ for x < 0; f'(0) = 0, differentiable everywhere in (-2, 2) (0 points)"),
            ("f(x) = |x - 1| on (-2, 2)", "III", "1 point", "Only one sharp corner at x = 1 in (-2, 2), so 1 point")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "By the Intermediate Value Theorem, match each polynomial in List I with the interval in List II containing at least one real root:",
        [
            ("f(x) = x³ - 3x + 1 = 0", "I", "(0, 1)", "f(0) = 1 > 0 and f(1) = -1 < 0, so by IVT there is a root in (0, 1)"),
            ("g(x) = x⁴ - 2x³ - 2 = 0", "III", "(2, 3)", "g(2) = -2 < 0 and g(3) = 25 > 0, so by IVT there is a root in (2, 3)"),
            ("h(x) = x³ + 2x - 5 = 0", "IV", "(1, 2)", "h(1) = -2 < 0 and h(2) = 7 > 0, so by IVT there is a root in (1, 2)"),
            ("k(x) = x⁵ + x + 1 = 0", "II", "(-1, 0)", "k(-1) = -1 < 0 and k(0) = 1 > 0, so by IVT there is a root in (-1, 0)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match each composite function h(x) = (f ∘ g)(x) in List I with its continuity/differentiability behavior at x = 0 in List II:",
        [
            ("f(u) = |u|, g(x) = x²", "II", "Differentiable at x = 0", "h(x) = |x²| = x², which is differentiable everywhere including x = 0"),
            ("f(u) = |u|, g(x) = x", "IV", "Continuous but not differentiable at x = 0", "h(x) = |x|, continuous with sharp corner at x = 0 (non-differentiable)"),
            ("f(u) = sgn(u), g(x) = x", "I", "Discontinuous with a jump at x = 0", "h(x) = sgn(x), LHL = -1 and RHL = 1, so discontinuous with finite jump"),
            ("f(u) = sgn(u), g(x) = x²", "III", "Discontinuous with a removable discontinuity at x = 0", "h(x) = 1 for all x ≠ 0 while h(0) = 0, giving a removable discontinuity")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match each function in List I with the evaluated value of its Right Hand Derivative f'(0⁺) in List II:",
        [
            ("f(x) = |x|", "III", "1", "For x > 0, f(x) = x -> f'(0⁺) = 1"),
            ("f(x) = |sin 2x|", "I", "2", "For x > 0 small, sin 2x > 0 so f(x) = sin 2x -> f'(0⁺) = 2"),
            ("f(x) = √x", "IV", "+∞ (does not exist)", "lim_{h -> 0⁺} (√h - 0)/h = lim 1/√h = +∞"),
            ("f(x) = x |x|", "II", "0", "For x > 0, f(x) = x² -> f'(0⁺) = 0")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Match each integral function F(x) = ∫_0^x g(t) dt in List I with its differentiability characteristic on ℝ in List II:",
        [
            ("F(x) = ∫_0^x |t| dt", "II", "Continuously differentiable (C¹), but second derivative does not exist at x = 0", "F'(x) = |x| is continuous everywhere, but F''(0) does not exist"),
            ("F(x) = ∫_0^x ⌊t⌋ dt", "IV", "Continuous everywhere, not differentiable at all integer points", "⌊t⌋ has jump discontinuities at integers, so F(x) has corners at x ∈ ℤ"),
            ("F(x) = ∫_0^x sgn(t) dt", "I", "Continuous everywhere, not differentiable only at x = 0", "F(x) = |x|, which is continuous everywhere but not differentiable only at x = 0"),
            ("F(x) = ∫_0^x t² dt", "III", "Infinitely differentiable (C^∞) on ℝ", "F(x) = x³/3 is a smooth polynomial, infinitely differentiable")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match each functional equation in List I with the resulting property/form of f(x) in List II:",
        [
            ("f(x + y) = f(x) + f(y) for all x, y ∈ ℝ, continuous at 0", "III", "f(x) = cx for some constant c", "Cauchy functional equation with continuity implies linearity f(x) = cx"),
            ("f(xy) = f(x) + f(y) for all x, y > 0 with f'(1) = k", "I", "f(x) = k ln x for x > 0", "Logarithmic functional equation with derivative condition yields f(x) = k ln x"),
            ("f(x + y) = f(x)f(y) for all x, y ∈ ℝ with f(0) ≠ 0, f'(0) = k", "IV", "f(x) = e^(kx)", "Exponential functional equation with f'(0) = k yields f(x) = e^(kx)"),
            ("f(x + y) = f(x) + f(y) + 3xy(x + y) with f'(0) = 1", "II", "f(x) = x³ + x", "Let g(x) = f(x) - x³: g(x+y) = g(x) + g(y) with g'(0) = 1, so g(x) = x, f(x) = x³ + x")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match each sequence-defined function f(x) = lim_{n -> ∞} f_n(x) in List I with its continuity description in List II:",
        [
            ("f(x) = lim_{n -> ∞} (x^(2n) - 1)/(x^(2n) + 1)", "IV", "Discontinuous at x = -1 and x = 1", "f(x) = -1 for |x| < 1, 0 for |x| = 1, and 1 for |x| > 1; jump discontinuities at x = ±1"),
            ("f(x) = lim_{n -> ∞} (ln(2 + x) - x^(2n) sin x)/(1 + x^(2n)) for x ≥ 0", "I", "Discontinuous only at x = 1", "For x < 1, f(x) = ln(2 + x); for x > 1, f(x) = -sin x. Discontinuous only at x = 1"),
            ("f(x) = lim_{n -> ∞} cos^(2n)(π x)", "II", "Discontinuous at all integer points x ∈ ℤ", "f(x) = 1 for x ∈ ℤ and 0 for x ∉ ℤ, so discontinuous at every integer"),
            ("f(x) = lim_{n -> ∞} x/(1 + n x²)", "III", "Continuous everywhere on ℝ", "For x ≠ 0, limit is 0; at x = 0, value is 0. Thus f(x) = 0 everywhere, continuous on ℝ")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match each function in List I with the exact number of non-differentiable points on ℝ in List II:",
        [
            ("f(x) = max{|x|, x²}", "III", "3 points", "Non-differentiable at x = 0 (sharp corner of |x|) and at intersections x = ±1, total 3 points"),
            ("f(x) = max{1 - x², 0}", "I", "2 points", "Equals 1 - x² on [-1, 1] and 0 elsewhere, with sharp corners at x = ±1, total 2 points"),
            ("f(x) = |x(x - 1)(x - 2)(x - 3)|", "IV", "4 points", "Four distinct real roots create 4 sharp corners on the real line"),
            ("f(x) = |x|³", "II", "0 points", "f'(x) = 3x|x| and f''(x) = 6|x| with f'(0) = f''(0) = 0, differentiable everywhere (0 points)")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "For invertible functions f(x), match each derivative of the inverse (f⁻¹)'(y₀) at y₀ = f(x₀) in List I with its value in List II:",
        [
            ("f(x) = x³ + 3x + 1 at y₀ = 5 (x₀ = 1)", "II", "1/6", "f'(x) = 3x² + 3 -> f'(1) = 6. (f⁻¹)'(5) = 1/f'(1) = 1/6"),
            ("f(x) = x⁵ + 2x³ + x - 1 at y₀ = 3 (x₀ = 1)", "IV", "1/12", "f'(x) = 5x⁴ + 6x² + 1 -> f'(1) = 12. (f⁻¹)'(3) = 1/12"),
            ("f(x) = e^x + x at y₀ = 1 (x₀ = 0)", "I", "1/2", "f'(x) = e^x + 1 -> f'(0) = 2. (f⁻¹)'(1) = 1/2"),
            ("f(x) = x³ + x at y₀ = 2 (x₀ = 1)", "III", "1/4", "f'(x) = 3x² + 1 -> f'(1) = 4. (f⁻¹)'(2) = 1/4")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match each function in List I with its exact differentiability behavior at x = 0 in List II:",
        [
            ("f(x) = x² |cos(π/(2x))| for x ≠ 0, f(0) = 0", "I", "Differentiable at x = 0 with f'(0) = 0", "f'(0) = lim_{h -> 0} h |cos(π/(2h))| = 0 by squeeze theorem"),
            ("g(x) = x |cos(π/(2x))| for x ≠ 0, g(0) = 0", "III", "Continuous but not differentiable at x = 0", "Continuous because lim x |cos| = 0, but difference quotient has no limit"),
            ("h(x) = (sin x²)/x for x ≠ 0, h(0) = 0", "IV", "Differentiable at x = 0 with f'(0) = 1", "h(x) ~ x³/x = x², so lim h(x)/x = lim (sin x²)/x² = 1"),
            ("k(x) = e^(-1/x²) for x ≠ 0, k(0) = 0", "II", "Infinitely differentiable with all derivatives equal to 0 at x = 0", "Classic non-analytic smooth function where k^(n)(0) = 0 for all n ≥ 1")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match each function in List I with the nature of its derivative at and around x = 0 in List II:",
        [
            ("f(x) = x² sin(1/x) for x ≠ 0, f(0) = 0", "IV", "f'(0) exists, but f'(x) is discontinuous at x = 0", "f'(0) = 0, but f'(x) = 2x sin(1/x) - cos(1/x) has no limit as x -> 0"),
            ("f(x) = |x|³", "II", "f'(0) exists and is continuously differentiable", "f'(x) = 3x|x| and f''(x) = 6|x|, both continuous at 0"),
            ("f(x) = x |x|", "I", "f'(0) exists and is continuous, but f''(0) does not exist", "f'(x) = 2|x| is continuous at 0, but f''(0) does not exist due to sharp corner"),
            ("f(x) = x + 2x² sin(1/x) for x ≠ 0, f(0) = 0", "III", "f'(0) = 1, but f is not monotonic in any interval around 0", "f'(x) = 1 + 4x sin(1/x) - 2 cos(1/x) oscillates between -1 and 3 in every neighborhood of 0")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "For hybrid functions involving floor ⌊x⌋ and fractional part {x}, match each function in List I with its behavior at x = 1 in List II:",
        [
            ("f(x) = ⌊x⌋ + √{x}", "III", "Continuous with infinite RHD (+∞)", "f(1) = 1, LHL = RHL = 1, but RHD is lim_{h -> 0⁺} √h / h = +∞"),
            ("g(x) = ⌊x⌋ + {x}²", "I", "Continuous with LHD = 2 and RHD = 0", "Continuous at 1 with LHD = d/dx((x)²)|_{x=1} = 2 and RHD = d/dx(x²)|_{x=0} = 0"),
            ("h(x) = ⌊x⌋ - {x}", "IV", "Discontinuous with jump of magnitude 2", "LHL = 0 - 1 = -1, RHL = 1 - 0 = 1, jump magnitude = 1 - (-1) = 2"),
            ("k(x) = {x} ⌊x⌋", "II", "Continuous with LHD = 0 and RHD = 1", "k(x) = 0 for x < 1 (LHD = 0); k(x) = x - 1 for x ∈ (1, 2) (RHD = 1)")
        ], "D"))

    # ============================================================
    # TOPIC: Applications of Derivatives (20 questions)
    # ============================================================
    t = "Applications of Derivatives"
    prefix = "math_mat_aod"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match each curve and point in List I with the slope m = dy/dx of its tangent line in List II:",
        [
            ("y = x² - 4x + 3 at x = 3", "II", "2", "y' = 2x - 4. At x = 3: y' = 6 - 4 = 2"),
            ("y = x³ - 3x² + 5 at x = 2", "IV", "0", "y' = 3x² - 6x. At x = 2: y' = 12 - 12 = 0"),
            ("y = 1/x at x = 1", "I", "-1", "y' = -1/x². At x = 1: y' = -1"),
            ("y = √(2x + 1) at x = 4", "III", "1/3", "y' = 1/√(2x + 1). At x = 4: y' = 1/√9 = 1/3")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match each rate-of-change scenario in List I with its evaluated rate in List II:",
        [
            ("dA/dr for circle area A = πr² when r = 5", "III", "10π", "dA/dr = 2πr. At r = 5: 10π"),
            ("dV/dr for sphere volume V = (4/3)πr³ when r = 3", "I", "36π", "dV/dr = 4πr². At r = 3: 4π(9) = 36π"),
            ("dS/dx for cube surface area S = 6x² when x = 4", "IV", "48", "dS/dx = 12x. At x = 4: 12(4) = 48"),
            ("dP/dr for circle perimeter P = 2πr", "II", "2π", "dP/dr = 2π (constant for all r)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each function in List I with the interval in List II where it is strictly increasing:",
        [
            ("f(x) = x² - 4x + 5", "I", "(2, ∞)", "f'(x) = 2x - 4 > 0 implies x > 2, interval (2, ∞)"),
            ("f(x) = -x² + 6x - 1", "III", "(-∞, 3)", "f'(x) = -2x + 6 > 0 implies x < 3, interval (-∞, 3)"),
            ("f(x) = x³ - 3x", "IV", "(-∞, -1) ∪ (1, ∞)", "f'(x) = 3(x² - 1) > 0 implies |x| > 1, interval (-∞, -1) ∪ (1, ∞)"),
            ("f(x) = e^(-x)", "II", "∅ (empty set)", "f'(x) = -e^(-x) < 0 for all x ∈ ℝ, strictly increasing nowhere: ∅")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match each curve in List I with the equation of its normal line at the given point in List II:",
        [
            ("y = x² at (1, 1)", "III", "x + 2y - 3 = 0", "y' = 2, so normal slope is -1/2: y - 1 = -(1/2)(x - 1) -> x + 2y - 3 = 0"),
            ("y = x³ at (1, 1)", "I", "x + 3y - 4 = 0", "y' = 3, so normal slope is -1/3: y - 1 = -(1/3)(x - 1) -> x + 3y - 4 = 0"),
            ("y = 4/x at (2, 2)", "IV", "x - y = 0", "y' = -4/x² = -1, normal slope is 1: y - 2 = 1(x - 2) -> x - y = 0"),
            ("y = √x at (4, 2)", "II", "4x + y - 18 = 0", "y' = 1/(2√4) = 1/4, normal slope is -4: y - 2 = -4(x - 4) -> 4x + y - 18 = 0")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each function and interval in List I with the value of c satisfying Rolle's Theorem in List II:",
        [
            ("f(x) = x² - 4x + 3 on [1, 3]", "II", "2", "f'(x) = 2x - 4 = 0 implies c = 2 ∈ (1, 3)"),
            ("f(x) = x³ - 3x on [-√3, √3] (positive root)", "IV", "1", "f'(x) = 3x² - 3 = 0 implies x = ±1, positive root is c = 1"),
            ("f(x) = sin x on [0, π]", "I", "π/2", "f'(x) = cos x = 0 implies c = π/2 ∈ (0, π)"),
            ("f(x) = x(x - 2)² on [0, 2]", "III", "2/3", "f'(x) = (x - 2)(3x - 2) = 0 implies c = 2/3 ∈ (0, 2)")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match each function and interval in List I with the value of c satisfying Lagrange's Mean Value Theorem in List II:",
        [
            ("f(x) = x² on [1, 3]", "I", "2", "(f(3) - f(1))/(3 - 1) = (9 - 1)/2 = 4 = 2c implies c = 2"),
            ("f(x) = √x on [1, 4]", "III", "9/4", "(2 - 1)/(4 - 1) = 1/3 = 1/(2√c) implies 2√c = 3 -> c = 9/4"),
            ("f(x) = x³ on [0, 3]", "IV", "√3", "(27 - 0)/(3 - 0) = 9 = 3c² implies c² = 3 -> c = √3"),
            ("f(x) = ln x on [1, e]", "II", "e - 1", "(ln e - ln 1)/(e - 1) = 1/(e - 1) = 1/c implies c = e - 1")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match each related rates problem in List I with its correct answer in List II:",
        [
            ("Speed top of 5m ladder slides down when bottom is 3m from wall and sliding at 2 m/s", "II", "3/2 m/s", "x² + y² = 25 -> 2(3)(2) + 2(4)(dy/dt) = 0 -> dy/dt = -3/2 m/s, speed is 3/2 m/s"),
            ("Rate water level rises in cone (h=10m, r=5m) when depth is 4m with inflow 2 m³/s", "IV", "1/(2π) m/s", "V = πh³/12 -> dV/dt = (πh²/4)(dh/dt). When h=4: 2 = 4π(dh/dt) -> dh/dt = 1/(2π) m/s"),
            ("Rate length of shadow increases for 2m person walking at 4 m/s from 6m lamp", "I", "2 m/s", "s/2 = (x + s)/6 -> s = x/2 -> ds/dt = (1/2)(dx/dt) = (1/2)(4) = 2 m/s"),
            ("Rate surface area increases for bubble of radius r=2cm expanding at 0.5 cm/s", "III", "8π cm²/s", "S = 4πr² -> dS/dt = 8πr(dr/dt) = 8π(2)(0.5) = 8π cm²/s")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match each function in List I with the x-coordinate of its local minimum in List II:",
        [
            ("f(x) = 2x³ - 9x² + 12x", "IV", "x = 2", "f'(x) = 6(x - 1)(x - 2) = 0. f''(2) = 6 > 0, so local minimum at x = 2"),
            ("f(x) = x³ - 6x² + 9x", "II", "x = 3", "f'(x) = 3(x - 1)(x - 3) = 0. f''(3) = 6 > 0, so local minimum at x = 3"),
            ("f(x) = x + 16/x for x > 0", "I", "x = 4", "f'(x) = 1 - 16/x² = 0 implies x = 4 for x > 0; f''(4) = 32/64 > 0, local min at x = 4"),
            ("f(x) = x² - 10x + 7", "III", "x = 5", "f'(x) = 2x - 10 = 0 implies x = 5, local minimum at x = 5")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match each curve in List I with the length of its subtangent or subnormal in List II:",
        [
            ("Length of subtangent to y = e^(x/a)", "II", "a", "Subtangent = |y/y'| = |y / (y/a)| = a (constant)"),
            ("Length of subnormal to parabola y² = 4ax", "IV", "2a", "2y y' = 4a -> y y' = 2a. Subnormal = |y y'| = 2a (constant)"),
            ("Length of subtangent to y = x² at (1, 1)", "I", "1/2", "y' = 2x = 2. Subtangent = |y/y'| = 1/2"),
            ("Length of subnormal to y = x³ at (1, 1)", "III", "3", "y' = 3x² = 3. Subnormal = |y y'| = |1 * 3| = 3")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match each pair of curves in List I with the acute angle of intersection θ at the specified point in List II:",
        [
            ("y = x² and x = y² at (0, 0)", "I", "π/2", "y = x² has horizontal tangent (m=0), x = y² has vertical tangent (m=∞), orthogonal: π/2"),
            ("y = sin x and y = cos x at x = π/4", "III", "tan⁻¹(2√2)", "m₁ = 1/√2, m₂ = -1/√2 -> tan θ = |(2/√2)/(1 - 1/2)| = 2√2"),
            ("y = x² and x = y² at (1, 1)", "IV", "tan⁻¹(3/4)", "m₁ = 2, m₂ = 1/2 -> tan θ = |(2 - 1/2)/(1 + 1)| = 3/4"),
            ("y = 2x and y = 3x at (0, 0)", "II", "tan⁻¹(1/7)", "m₁ = 2, m₂ = 3 -> tan θ = |(3 - 2)/(1 + 6)| = 1/7")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match each function in List I with the inflection point (x, y) of its graph in List II:",
        [
            ("f(x) = x³ - 3x² + 2", "II", "(1, 0)", "f''(x) = 6x - 6 = 0 -> x = 1. f(1) = 1 - 3 + 2 = 0. Point: (1, 0)"),
            ("f(x) = x³ - 6x² + 12x - 5", "IV", "(2, 3)", "f''(x) = 6x - 12 = 0 -> x = 2. f(2) = 8 - 24 + 24 - 5 = 3. Point: (2, 3)"),
            ("f(x) = x⁴ - 6x² (positive x)", "I", "(1, -5)", "f''(x) = 12(x² - 1) = 0 -> x = 1. f(1) = 1 - 6 = -5. Point: (1, -5)"),
            ("f(x) = x e^x", "III", "(-2, -2/e²)", "f''(x) = (x + 2)e^x = 0 -> x = -2. f(-2) = -2e⁻². Point: (-2, -2/e²)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match each function in List I with its absolute (global) maximum value on the specified interval in List II:",
        [
            ("f(x) = 2x³ - 15x² + 36x + 1 on [1, 5]", "III", "56", "Critical points x = 2 (f=29), x = 3 (f=28). Endpoints: f(1)=24, f(5)=56. Absolute max is 56"),
            ("f(x) = x + sin 2x on [0, π]", "I", "π", "f'(x) = 1 + 2 cos 2x = 0 -> x = π/3 (f ≈ 1.91). At endpoints f(0)=0, f(π)=π ≈ 3.14. Max is π"),
            ("f(x) = sin x + cos x on [0, π/2]", "IV", "√2", "Max occurs at x = π/4 where f(π/4) = √2"),
            ("f(x) = x(4 - x) on [0, 4]", "II", "4", "Vertex at x = 2: f(2) = 2(2) = 4")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Match each geometric optimization problem in List I with its maximized quantity in List II:",
        [
            ("Maximum volume of cylinder inscribed in cone of height H and base radius R", "II", "4/27 π R² H", "V = πr² H(1 - r/R). Maximized at r = 2R/3, yielding V_max = 4/27 π R² H"),
            ("Maximum area of rectangle inscribed in ellipse x²/a² + y²/b² = 1", "IV", "2ab", "Area = 4ab cos θ sin θ = 2ab sin 2θ, maximized when sin 2θ = 1 to 2ab"),
            ("Maximum perimeter of rectangle inscribed in circle of radius R", "I", "4√2 R", "Sides 2R cos θ, 2R sin θ. Perimeter = 4R(cos θ + sin θ) <= 4√2 R"),
            ("Maximum volume of cone inscribed in sphere of radius R", "III", "32/81 π R³", "V = (π/3)(2Rh² - h³). Maximized at h = 4R/3, yielding V_max = 32/81 π R³")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match each shortest distance problem between curves in List I with its exact value in List II:",
        [
            ("Shortest distance between parabola y = x² and line y = 2x - 4", "I", "3/√5", "Parallel tangent y' = 2x = 2 -> x = 1, y = 1. Distance from (1, 1) to 2x - y - 4 = 0 is |2 - 1 - 4|/√5 = 3/√5"),
            ("Shortest distance between circle x² + y² = 1 and line y = x - 2", "III", "√2 - 1", "Distance from origin to x - y - 2 = 0 is |-2|/√2 = √2. Shortest distance to circle is √2 - 1"),
            ("Shortest distance between parabola y² = 4x and point (1, 0)", "IV", "1", "D² = (x - 1)² + 4x = (x + 1)². For x ≥ 0, minimum is at x = 0, D = 1"),
            ("Shortest distance between parabola y = x² and point (0, 3/2)", "II", "√5/2", "D² = x² + (y - 3/2)² = y + y² - 3y + 9/4 = (y - 1)² + 5/4. Min at y = 1 gives D = √5/2")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match each cubic polynomial f(x) in List I with the parameter condition in List II for f(x) to be strictly increasing on ℝ:",
        [
            ("f(x) = x³ + 3kx² + 3x + 1", "II", "k ∈ [-1, 1]", "f'(x) = 3x² + 6kx + 3 ≥ 0 iff D = 36k² - 36 ≤ 0 -> k² ≤ 1 -> k ∈ [-1, 1]"),
            ("f(x) = x³ + kx² + 12x + 5", "IV", "k ∈ [-6, 6]", "f'(x) = 3x² + 2kx + 12 ≥ 0 iff D = 4k² - 144 ≤ 0 -> k² ≤ 36 -> k ∈ [-6, 6]"),
            ("f(x) = 2x³ - 3kx² + 6x - 4", "I", "k ∈ [-2, 2]", "f'(x) = 6x² - 6kx + 6 ≥ 0 iff k² - 4 ≤ 0 -> k ∈ [-2, 2]"),
            ("f(x) = x³/3 + kx² + 9x + 2", "III", "k ∈ [-3, 3]", "f'(x) = x² + 2kx + 9 ≥ 0 iff 4k² - 36 ≤ 0 -> k² ≤ 9 -> k ∈ [-3, 3]")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match each polynomial equation in List I with the exact number of real roots in List II:",
        [
            ("P(x) = x⁵ + 2x - 3 = 0", "III", "1 real root", "P'(x) = 5x⁴ + 2 > 0 everywhere, strictly increasing, so exactly 1 real root (at x = 1)"),
            ("P(x) = x³ - 3x - 1 = 0", "I", "3 real roots", "Local max P(-1) = 1 > 0, local min P(1) = -3 < 0. Changes sign three times on ℝ, giving 3 real roots"),
            ("P(x) = x⁴ - 2x² - 3 = 0", "IV", "2 real roots", "(x² - 3)(x² + 1) = 0 has only two real roots x = ±√3"),
            ("P(x) = x⁴ + 2x² + 5 = 0", "II", "0 real roots", "(x² + 1)² + 4 ≥ 4 > 0 everywhere on ℝ, so 0 real roots")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match each curve in List I with the number of tangents that can be drawn from the specified external point in List II:",
        [
            ("From (0, 0) to parabola y = x² + 1", "II", "2 tangents", "Line y = mx: x² - mx + 1 = 0. Tangency condition D = m² - 4 = 0 gives m = ±2, exactly 2 tangents"),
            ("From (0, 0) to circle x² + y² = 4", "IV", "0 tangents", "(0, 0) is inside the circle of radius 2, so 0 tangents can be drawn"),
            ("From (0, 1) to cubic y = x³", "I", "1 tangent", "Tangent condition 2t³ + 1 = 0 has only 1 real root t = -1/2^(1/3), so 1 tangent"),
            ("From (2, 4) to cubic y = x³", "III", "3 tangents", "Tangent condition 2(t - 1)(t² - 2t - 2) = 0 has 3 distinct real roots, so 3 tangents")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match each common tangent problem between curves in List I with its equation in List II:",
        [
            ("Common tangent to y² = 4x and x² = 4y", "I", "x + y + 1 = 0", "y = mx + 1/m on x² = 4y gives m³ = -1 -> m = -1, tangent is y = -x - 1 -> x + y + 1 = 0"),
            ("Common tangent to y² = 4x and x² = -32y", "III", "x - 2y + 4 = 0", "x² + 32mx + 32/m = 0 -> D = 0 gives 8m³ = 1 -> m = 1/2, tangent is y = x/2 + 2 -> x - 2y + 4 = 0"),
            ("Common tangent to y² = 8x and circle x² + y² = 2", "IV", "x - y + 2 = 0", "Tangent y = mx + 2/m at distance √2 from origin gives m = 1 -> y = x + 2 -> x - y + 2 = 0"),
            ("Common tangent to y = x² and y = -(x - 2)²", "II", "4x - y - 4 = 0", "Tangency conditions yield non-zero slope m = 4, c = -4, giving 4x - y - 4 = 0")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Using Cauchy's Mean Value Theorem f'(c)/g'(c) = (f(b)-f(a))/(g(b)-g(a)), match each pair in List I with the value of c in List II:",
        [
            ("f(x) = x², g(x) = x on [a, b] (0 < a < b)", "II", "(a + b)/2", "2c/1 = (b² - a²)/(b - a) = a + b implies c = (a + b)/2 (arithmetic mean)"),
            ("f(x) = 1/x², g(x) = 1/x on [a, b] (0 < a < b)", "IV", "2ab/(a + b)", "(-2/c³)/(-1/c²) = 2/c = (a + b)/(ab) implies c = 2ab/(a + b) (harmonic mean)"),
            ("f(x) = sin x, g(x) = cos x on [0, π/2]", "I", "π/4", "-cot c = (1 - 0)/(0 - 1) = -1 implies cot c = 1 -> c = π/4"),
            ("f(x) = e^x, g(x) = e^(-x) on [0, 1]", "III", "1/2", "-e^(2c) = (e - 1)/(1/e - 1) = -e implies 2c = 1 -> c = 1/2")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each inequality for x > 0 in List I with the auxiliary function f(x) whose derivative proves it in List II:",
        [
            ("sin x < x for all x > 0", "III", "f(x) = x - sin x", "f(0) = 0 and f'(x) = 1 - cos x > 0 for x > 0, so f(x) is strictly increasing and f(x) > 0"),
            ("ln(1 + x) < x for all x > 0", "I", "f(x) = x - ln(1 + x)", "f(0) = 0 and f'(x) = 1 - 1/(1 + x) = x/(1 + x) > 0, so f(x) > 0"),
            ("e^x > 1 + x for all x > 0", "IV", "f(x) = e^x - 1 - x", "f(0) = 0 and f'(x) = e^x - 1 > 0 for x > 0, so f(x) > 0"),
            ("tan x > x for all x ∈ (0, π/2)", "II", "f(x) = tan x - x", "f(0) = 0 and f'(x) = sec² x - 1 = tan² x > 0 for x ∈ (0, π/2), so f(x) > 0")
        ], "D"))

    return qs
