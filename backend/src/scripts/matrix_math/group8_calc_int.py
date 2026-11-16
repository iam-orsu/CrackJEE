from builder import make_matrix_q

def get_questions():
    qs = []

    # ==========================================
    # TOPIC: Indefinite Integration (20 questions)
    # ==========================================
    t = "Indefinite Integration"
    prefix = "math_mat_indef_int"

    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match each indefinite integral in List I with its evaluated antiderivative in List II (where C is the constant of integration):",
        [
            ("∫ x^5 dx", "III", "x^6 / 6 + C", "Using the power rule ∫ x^n dx = x^{n+1}/(n+1) + C with n = 5 gives x^6 / 6 + C"),
            ("∫ e^{3x} dx", "I", "e^{3x} / 3 + C", "Using ∫ e^{kx} dx = (1/k) e^{kx} + C with k = 3 yields e^{3x} / 3 + C"),
            ("∫ sec^2(2x) dx", "IV", "(1/2) tan(2x) + C", "Since d/dx[tan(2x)] = 2 sec^2(2x), ∫ sec^2(2x) dx = (1/2) tan(2x) + C"),
            ("∫ dx / (1 + 4x^2)", "II", "(1/2) arctan(2x) + C", "Let u = 2x, du = 2 dx. Then ∫ du / (2(1 + u^2)) = (1/2) arctan(u) + C = (1/2) arctan(2x) + C"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the integrals using substitution in List I with their corresponding antiderivatives in List II:",
        [
            ("∫ (2x + 3) / (x^2 + 3x + 5) dx", "IV", "ln(x^2 + 3x + 5) + C", "Form ∫ f'(x)/f(x) dx: numerator is the derivative of the denominator, yielding ln(x^2 + 3x + 5) + C"),
            ("∫ 2x (x^2 + 1)^4 dx", "I", "(x^2 + 1)^5 / 5 + C", "Let u = x^2 + 1, du = 2x dx. The integral becomes ∫ u^4 du = u^5 / 5 + C = (x^2 + 1)^5 / 5 + C"),
            ("∫ tan x dx", "II", "ln|sec x| + C", "∫ (sin x / cos x) dx = - ln|cos x| + C = ln|sec x| + C"),
            ("∫ cot x dx", "III", "ln|sin x| + C", "∫ (cos x / sin x) dx = ln|sin x| + C"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the trigonometric integrals in List I with their simplified antiderivatives in List II:",
        [
            ("∫ sin^2 x dx", "II", "x/2 - (sin 2x)/4 + C", "Using sin^2 x = (1 - cos 2x)/2: ∫ (1/2 - (1/2) cos 2x) dx = x/2 - (sin 2x)/4 + C"),
            ("∫ cos^2 x dx", "IV", "x/2 + (sin 2x)/4 + C", "Using cos^2 x = (1 + cos 2x)/2: ∫ (1/2 + (1/2) cos 2x) dx = x/2 + (sin 2x)/4 + C"),
            ("∫ 2 sin 3x cos x dx", "I", "- cos(4x)/4 - cos(2x)/2 + C", "2 sin 3x cos x = sin 4x + sin 2x. Integrating gives - cos(4x)/4 - cos(2x)/2 + C"),
            ("∫ tan^2 x dx", "III", "tan x - x + C", "Using tan^2 x = sec^2 x - 1: ∫ (sec^2 x - 1) dx = tan x - x + C"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the standard inverse trigonometric integrals in List I with their evaluations in List II:",
        [
            ("∫ dx / √(9 - x^2)", "I", "arcsin(x/3) + C", "Standard form ∫ dx / √(a^2 - x^2) = arcsin(x/a) + C with a = 3 gives arcsin(x/3) + C"),
            ("∫ dx / (9 + x^2)", "III", "(1/3) arctan(x/3) + C", "Standard form ∫ dx / (a^2 + x^2) = (1/a) arctan(x/a) + C with a = 3 yields (1/3) arctan(x/3) + C"),
            ("∫ dx / (x √(x^2 - 9))", "IV", "(1/3) arcsec(|x|/3) + C", "Standard form ∫ dx / (x √(x^2 - a^2)) = (1/a) arcsec(|x|/a) + C with a = 3 gives (1/3) arcsec(|x|/3) + C"),
            ("∫ dx / √(x^2 + 9)", "II", "ln|x + √(x^2 + 9)| + C", "Standard form ∫ dx / √(x^2 + a^2) = ln|x + √(x^2 + a^2)| + C gives ln|x + √(x^2 + 9)| + C"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match the products integrated by parts (using ILATE) in List I with their results in List II:",
        [
            ("∫ x e^{2x} dx", "II", "(e^{2x} / 4) (2x - 1) + C", "Integration by parts with u = x, dv = e^{2x} dx: (x/2) e^{2x} - (1/4) e^{2x} + C = (e^{2x}/4)(2x - 1) + C"),
            ("∫ x sin x dx", "I", "sin x - x cos x + C", "u = x, dv = sin x dx: - x cos x - ∫ (- cos x) dx = sin x - x cos x + C"),
            ("∫ ln x dx", "IV", "x ln x - x + C", "u = ln x, dv = dx: x ln x - ∫ x (1/x) dx = x ln x - x + C"),
            ("∫ x^2 ln x dx", "III", "(x^3 / 3) ln x - x^3 / 9 + C", "u = ln x, dv = x^2 dx: (x^3 / 3) ln x - ∫ (x^3 / 3)(1/x) dx = (x^3 / 3) ln x - x^3 / 9 + C"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match the integrals of the form ∫ e^x [f(x) + f'(x)] dx in List I with their evaluations in List II:",
        [
            ("∫ e^x (sin x + cos x) dx", "IV", "e^x sin x + C", "Here f(x) = sin x and f'(x) = cos x, so ∫ e^x [f(x) + f'(x)] dx = e^x sin x + C"),
            ("∫ e^x (1/x - 1/x^2) dx", "II", "e^x / x + C", "Here f(x) = 1/x and f'(x) = -1/x^2, yielding e^x / x + C"),
            ("∫ e^x (tan x + sec^2 x) dx", "I", "e^x tan x + C", "Here f(x) = tan x and f'(x) = sec^2 x, so the integral evaluates to e^x tan x + C"),
            ("∫ e^x (ln x + 1/x) dx", "III", "e^x ln x + C", "Here f(x) = ln x and f'(x) = 1/x, giving e^x ln x + C"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match each rational function integral solved by partial fractions in List I with its antiderivative in List II:",
        [
            ("∫ dx / ((x - 1)(x - 2))", "III", "ln|(x - 2)/(x - 1)| + C", "1/((x-1)(x-2)) = 1/(x-2) - 1/(x-1). Integrating gives ln|x - 2| - ln|x - 1| + C = ln|(x - 2)/(x - 1)| + C"),
            ("∫ x dx / ((x - 1)(x - 2))", "IV", "ln|(x - 2)^2 / (x - 1)| + C", "x/((x-1)(x-2)) = 2/(x-2) - 1/(x-1). Integrating gives 2 ln|x - 2| - ln|x - 1| + C = ln|(x - 2)^2 / (x - 1)| + C"),
            ("∫ dx / (x^2 - 4)", "I", "(1/4) ln|(x - 2)/(x + 2)| + C", "Standard form ∫ dx / (x^2 - a^2) = (1/(2a)) ln|(x - a)/(x + a)| + C with a = 2 gives (1/4) ln|(x - 2)/(x + 2)| + C"),
            ("∫ (2x + 3) dx / ((x + 1)(x + 2))", "II", "ln|(x + 1)(x + 2)| + C", "(2x + 3)/((x + 1)(x + 2)) = 1/(x + 1) + 1/(x + 2). Integrating gives ln|x + 1| + ln|x + 2| + C = ln|(x + 1)(x + 2)| + C"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match the trigonometric integrals of the type ∫ dx / (a sin^2 x + b cos^2 x) in List I with their values in List II:",
        [
            ("∫ dx / (sin^2 x + 4 cos^2 x)", "I", "(1/2) arctan((tan x)/2) + C", "Divide numerator and denominator by cos^2 x: ∫ sec^2 x dx / (tan^2 x + 4) = (1/2) arctan((tan x)/2) + C"),
            ("∫ dx / (4 sin^2 x + cos^2 x)", "IV", "(1/2) arctan(2 tan x) + C", "Dividing by cos^2 x yields ∫ sec^2 x dx / (4 tan^2 x + 1) = (1/2) arctan(2 tan x) + C"),
            ("∫ dx / (3 sin^2 x + cos^2 x)", "II", "(1/√3) arctan(√3 tan x) + C", "Dividing by cos^2 x gives ∫ sec^2 x dx / (3 tan^2 x + 1) = (1/√3) arctan(√3 tan x) + C"),
            ("∫ dx / (sin^2 x + 2 cos^2 x)", "III", "(1/√2) arctan((tan x)/√2) + C", "Dividing by cos^2 x gives ∫ sec^2 x dx / (tan^2 x + 2) = (1/√2) arctan((tan x)/√2) + C"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match the integrals of form ∫ dx / (a + b cos x) using Weierstrass half-angle substitution t = tan(x/2) in List I with their values in List II:",
        [
            ("∫ dx / (5 + 4 cos x)", "III", "(2/3) arctan((1/3) tan(x/2)) + C", "With t = tan(x/2), dx = 2 dt / (1 + t^2) and cos x = (1 - t^2)/(1 + t^2). Integrand becomes 2 dt / (9 + t^2), yielding (2/3) arctan(t/3) + C"),
            ("∫ dx / (5 + 3 cos x)", "I", "(1/2) arctan((1/2) tan(x/2)) + C", "Integrand becomes 2 dt / (8 + 2t^2) = dt / (4 + t^2), yielding (1/2) arctan(t/2) + C = (1/2) arctan((1/2) tan(x/2)) + C"),
            ("∫ dx / (2 + cos x)", "IV", "(2/√3) arctan((1/√3) tan(x/2)) + C", "Integrand becomes 2 dt / (3 + t^2), integrating to (2/√3) arctan(t/√3) + C = (2/√3) arctan((1/√3) tan(x/2)) + C"),
            ("∫ dx / (1 + 2 cos x)", "II", "(1/√3) ln|(√3 + tan(x/2))/(√3 - tan(x/2))| + C", "Integrand becomes 2 dt / (3 - t^2), which integrates to (2 / (2√3)) ln|(√3 + t)/(√3 - t)| + C = (1/√3) ln|(√3 + tan(x/2))/(√3 - tan(x/2))| + C"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match each quadratic irrational integral in List I with its antiderivative in List II:",
        [
            ("∫ (2x + 3) dx / √(x^2 + 3x + 2)", "IV", "2 √(x^2 + 3x + 2) + C", "Numerator is exactly the derivative of the radicand: ∫ u^{-1/2} du = 2 u^{1/2} + C = 2 √(x^2 + 3x + 2) + C"),
            ("∫ x dx / √(1 - x^2)", "I", "- √(1 - x^2) + C", "Let u = 1 - x^2, du = -2x dx: ∫ (-1/2) u^{-1/2} du = - u^{1/2} + C = - √(1 - x^2) + C"),
            ("∫ dx / √(2x - x^2)", "III", "arcsin(x - 1) + C", "Complete the square: 2x - x^2 = 1 - (x - 1)^2. ∫ dx / √(1 - (x - 1)^2) = arcsin(x - 1) + C"),
            ("∫ (x + 1) dx / √(x^2 + 1)", "II", "√(x^2 + 1) + ln|x + √(x^2 + 1)| + C", "Split into ∫ x dx / √(x^2 + 1) + ∫ dx / √(x^2 + 1) = √(x^2 + 1) + ln|x + √(x^2 + 1)| + C"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match the algebraic symmetric quartic integrals in List I with their evaluated antiderivatives in List II:",
        [
            ("∫ (x^2 + 1) dx / (x^4 + 1)", "II", "(1/√2) arctan((x - 1/x)/√2) + C", "Divide numerator and denominator by x^2: ∫ (1 + 1/x^2) dx / ((x - 1/x)^2 + 2) = (1/√2) arctan((x - 1/x)/√2) + C"),
            ("∫ (x^2 - 1) dx / (x^4 + 1)", "III", "(1/(2√2)) ln|(x^2 - x√2 + 1)/(x^2 + x√2 + 1)| + C", "Divide by x^2: ∫ (1 - 1/x^2) dx / ((x + 1/x)^2 - 2) = (1/(2√2)) ln|(x + 1/x - √2)/(x + 1/x + √2)| + C"),
            ("∫ (x^2 + 1) dx / (x^4 + x^2 + 1)", "I", "(1/√3) arctan((x - 1/x)/√3) + C", "Divide by x^2: ∫ (1 + 1/x^2) dx / ((x - 1/x)^2 + 3) = (1/√3) arctan((x - 1/x)/√3) + C"),
            ("∫ (x^2 - 1) dx / (x^4 + 3x^2 + 1)", "IV", "(1/(2√5)) ln|(x + 1/x - √5)/(x + 1/x + √5)| + C", "Divide by x^2: ∫ (1 - 1/x^2) dx / ((x + 1/x)^2 - 5) = (1/(2√5)) ln|(x + 1/x - √5)/(x + 1/x + √5)| + C"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match each irrational integrand in List I with its antiderivative in List II:",
        [
            ("∫ dx / (x √(x + 1))", "I", "ln|(√(x + 1) - 1)/(√(x + 1) + 1)| + C", "Let u = √(x + 1), x = u^2 - 1, dx = 2u du. The integral becomes ∫ 2 du / (u^2 - 1) = ln|(u - 1)/(u + 1)| + C"),
            ("∫ √x dx / (1 + x)", "IV", "2√x - 2 arctan(√x) + C", "Let x = u^2, dx = 2u du: ∫ 2u^2 du / (1 + u^2) = 2 ∫ (1 - 1/(1 + u^2)) du = 2u - 2 arctan(u) + C = 2√x - 2 arctan(√x) + C"),
            ("∫ dx / (x^2 √(1 + x^2))", "III", "- √(1 + x^2) / x + C", "Let x = tan θ, dx = sec^2 θ dθ: ∫ sec^2 θ dθ / (tan^2 θ sec θ) = ∫ csc θ cot θ dθ = - csc θ + C = - √(1 + x^2) / x + C"),
            ("∫ dx / ((x - 1) √(x + 2))", "II", "(1/√3) ln|(√(x + 2) - √3)/(√(x + 2) + √3)| + C", "Let u = √(x + 2), x - 1 = u^2 - 3, dx = 2u du: ∫ 2 du / (u^2 - 3) = (1/√3) ln|(u - √3)/(u + √3)| + C"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Match the standard reduction formulas for I_n in List I with their corresponding recurrence relations in List II:",
        [
            ("I_n = ∫ sin^n x dx", "III", "- (sin^{n-1} x cos x)/n + ((n-1)/n) I_{n-2}", "Integrating by parts with u = sin^{n-1} x and dv = sin x dx yields I_n = - sin^{n-1} x cos x + (n-1) ∫ sin^{n-2} x cos^2 x dx, giving n I_n = - sin^{n-1} x cos x + (n-1) I_{n-2}"),
            ("I_n = ∫ cos^n x dx", "II", "(cos^{n-1} x sin x)/n + ((n-1)/n) I_{n-2}", "Integrating by parts with u = cos^{n-1} x and dv = cos x dx gives n I_n = cos^{n-1} x sin x + (n-1) I_{n-2}"),
            ("I_n = ∫ tan^n x dx", "IV", "(tan^{n-1} x)/(n - 1) - I_{n-2}", "Write tan^n x = tan^{n-2} x (sec^2 x - 1) = tan^{n-2} x sec^2 x - tan^{n-2} x, integrating to (tan^{n-1} x)/(n - 1) - I_{n-2}"),
            ("I_n = ∫ sec^n x dx", "I", "(sec^{n-2} x tan x)/(n - 1) + ((n-2)/(n - 1)) I_{n-2}", "Integrating by parts with u = sec^{n-2} x, dv = sec^2 x dx yields (n - 1) I_n = sec^{n-2} x tan x + (n - 2) I_{n-2}"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match each higher-order trigonometric integral in List I with its evaluated expression in List II:",
        [
            ("∫ tan^4 x dx", "IV", "(tan^3 x)/3 - tan x + x + C", "∫ tan^2 x (sec^2 x - 1) dx = ∫ tan^2 x sec^2 x dx - ∫ (sec^2 x - 1) dx = (tan^3 x)/3 - tan x + x + C"),
            ("∫ sec^4 x dx", "I", "tan x + (tan^3 x)/3 + C", "∫ sec^2 x (1 + tan^2 x) dx = ∫ (1 + u^2) du with u = tan x gives tan x + (tan^3 x)/3 + C"),
            ("∫ sin^3 x dx", "II", "- cos x + (cos^3 x)/3 + C", "∫ (1 - cos^2 x) sin x dx = ∫ (u^2 - 1) du with u = cos x gives (cos^3 x)/3 - cos x + C"),
            ("∫ cos^3 x dx", "III", "sin x - (sin^3 x)/3 + C", "∫ (1 - sin^2 x) cos x dx = ∫ (1 - u^2) du with u = sin x gives sin x - (sin^3 x)/3 + C"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match the advanced algebraic integrals requiring factoring out highest powers in List I with their antiderivatives in List II:",
        [
            ("∫ dx / (x^2 (x^4 + 1)^{3/4})", "II", "- ((x^4 + 1)/x^4)^{1/4} + C", "Factor x^4 out of the bracket: x^2 (x^3) (1 + x^{-4})^{3/4} = x^5 (1 + x^{-4})^{3/4}. Let u = 1 + x^{-4}, du = -4 x^{-5} dx, giving - (1/4)(4) u^{1/4} + C = - (1 + x^{-4})^{1/4} + C"),
            ("∫ (x^4 - 1) dx / (x^2 √(x^4 + x^2 + 1))", "IV", "√(x^2 + 1 + 1/x^2) + C", "Divide numerator and denominator by x^2: ∫ (1 - 1/x^2) dx / √(x^2 + 1 + 1/x^2). Let u = x + 1/x, then u^2 - 1 = x^2 + 1 + 1/x^2 and du = (1 - 1/x^2) dx, giving √(u^2 - 1) + C = √(x^2 + 1 + 1/x^2) + C"),
            ("∫ (2x^{12} + 5x^9) dx / (x^5 + x^3 + 1)^3", "I", "x^{10} / (2 (x^5 + x^3 + 1)^2) + C", "Divide numerator and denominator by x^{15}: ∫ (2 x^{-3} + 5 x^{-6}) dx / (1 + x^{-2} + x^{-5})^3. Let u = 1 + x^{-2} + x^{-5}, du = -(2x^{-3} + 5x^{-6}) dx, giving 1/(2u^2) + C = x^{10}/(2(x^5 + x^3 + 1)^2) + C"),
            ("∫ dx / (x^3 (1 + x^3)^{1/3})", "III", "- (1 + x^{-3})^{2/3} / 2 + C", "Factor x from the bracket: denominator becomes x^4 (1 + x^{-3})^{1/3}. Let u = 1 + x^{-3}, du = -3 x^{-4} dx, yielding (-1/3)(3/2) u^{2/3} + C = - (1 + x^{-3})^{2/3} / 2 + C"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match each linear combination trigonometric integral ∫ (a sin x + b cos x)/(c sin x + d cos x) dx in List I with its evaluation in List II:",
        [
            ("∫ (sin x + 2 cos x) dx / (2 sin x + cos x)", "I", "(4/5)x + (3/5) ln|2 sin x + cos x| + C", "Express numerator as A(2 sin x + cos x) + B(2 cos x - sin x). Equating coefficients gives 2A - B = 1, A + 2B = 2 => A = 4/5, B = 3/5. Thus the integral is (4/5)x + (3/5) ln|2 sin x + cos x| + C"),
            ("∫ (3 sin x + 2 cos x) dx / (sin x + 4 cos x)", "III", "(11/17)x - (10/17) ln|sin x + 4 cos x| + C", "Express numerator as A(sin x + 4 cos x) + B(cos x - 4 sin x). Solving gives A = 11/17, B = -10/17, yielding (11/17)x - (10/17) ln|sin x + 4 cos x| + C"),
            ("∫ (cos x) dx / (sin x + cos x)", "IV", "x/2 + (1/2) ln|sin x + cos x| + C", "Write cos x = (1/2)(sin x + cos x) + (1/2)(cos x - sin x). Integrating gives x/2 + (1/2) ln|sin x + cos x| + C"),
            ("∫ (sin x) dx / (sin x + cos x)", "II", "x/2 - (1/2) ln|sin x + cos x| + C", "Write sin x = (1/2)(sin x + cos x) - (1/2)(cos x - sin x). Integrating gives x/2 - (1/2) ln|sin x + cos x| + C"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match the inverse trigonometric integrals evaluated via integration by parts in List I with their antiderivatives in List II:",
        [
            ("∫ arcsin x dx", "III", "x arcsin x + √(1 - x^2) + C", "u = arcsin x, dv = dx: x arcsin x - ∫ x / √(1 - x^2) dx = x arcsin x + √(1 - x^2) + C"),
            ("∫ arctan x dx", "I", "x arctan x - (1/2) ln(1 + x^2) + C", "u = arctan x, dv = dx: x arctan x - ∫ x / (1 + x^2) dx = x arctan x - (1/2) ln(1 + x^2) + C"),
            ("∫ (arcsin x)^2 dx", "IV", "x (arcsin x)^2 + 2 √(1 - x^2) arcsin x - 2x + C", "Integrating by parts twice: u = (arcsin x)^2, dv = dx gives x (arcsin x)^2 - 2 ∫ x arcsin x / √(1 - x^2) dx, which evaluates to x (arcsin x)^2 + 2 √(1 - x^2) arcsin x - 2x + C"),
            ("∫ x arctan x dx", "II", "((x^2 + 1)/2) arctan x - x/2 + C", "u = arctan x, dv = x dx: (x^2 / 2) arctan x - (1/2) ∫ (x^2 / (1 + x^2)) dx = (x^2 / 2) arctan x - x/2 + (1/2) arctan x + C = ((x^2 + 1)/2) arctan x - x/2 + C"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match each rational function integral involving higher powers in the denominator in List I with its evaluation in List II:",
        [
            ("∫ dx / (x (x^4 + 1))", "IV", "(1/4) ln(x^4 / (x^4 + 1)) + C", "Multiply numerator and denominator by x^3: ∫ x^3 dx / (x^4 (x^4 + 1)). Let u = x^4, du = 4x^3 dx: (1/4) ∫ du / (u(u + 1)) = (1/4) ln(u / (u + 1)) + C = (1/4) ln(x^4 / (x^4 + 1)) + C"),
            ("∫ dx / (x (x^3 + 1))", "I", "(1/3) ln|x^3 / (x^3 + 1)| + C", "Multiply by x^2: ∫ x^2 dx / (x^3 (x^3 + 1)). Let u = x^3, du = 3x^2 dx: (1/3) ln|u / (u + 1)| + C = (1/3) ln|x^3 / (x^3 + 1)| + C"),
            ("∫ x dx / ((x^2 + 1)(x^2 + 2))", "II", "(1/2) ln((x^2 + 1)/(x^2 + 2)) + C", "Let u = x^2, du = 2x dx: (1/2) ∫ du / ((u + 1)(u + 2)) = (1/2) [ln(u + 1) - ln(u + 2)] + C = (1/2) ln((x^2 + 1)/(x^2 + 2)) + C"),
            ("∫ (x^2 + 1) dx / (x (x^2 - 1))", "III", "ln|(x^2 - 1)/x| + C", "Decompose into -1/x + 1/(x - 1) + 1/(x + 1). Integrating gives -ln|x| + ln|x - 1| + ln|x + 1| + C = ln|(x^2 - 1)/x| + C"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match each advanced non-trivial exponential integral in List I with its closed-form antiderivative in List II:",
        [
            ("∫ e^x [(x - 1) / (x + 1)^3] dx", "II", "e^x / (x + 1)^2 + C", "Write (x - 1)/(x + 1)^3 = 1/(x + 1)^2 - 2/(x + 1)^3. With f(x) = 1/(x + 1)^2, f'(x) = -2/(x + 1)^3, the integral is e^x f(x) + C = e^x / (x + 1)^2 + C"),
            ("∫ e^x [(x^2 + 1) / (x + 1)^2] dx", "IV", "e^x (x - 1) / (x + 1) + C", "Write (x^2 + 1)/(x + 1)^2 = (x - 1)/(x + 1) + 2/(x + 1)^2. With f(x) = (x - 1)/(x + 1), f'(x) = 2/(x + 1)^2, yielding e^x (x - 1)/(x + 1) + C"),
            ("∫ e^x [(2 + sin 2x) / (1 + cos 2x)] dx", "I", "e^x tan x + C", "(2 + 2 sin x cos x)/(2 cos^2 x) = sec^2 x + tan x. With f(x) = tan x, f'(x) = sec^2 x, giving e^x tan x + C"),
            ("∫ e^x [(1 - sin x) / (1 - cos x)] dx", "III", "- e^x cot(x/2) + C", "(1 - 2 sin(x/2)cos(x/2))/(2 sin^2(x/2)) = (1/2) csc^2(x/2) - cot(x/2). With f(x) = - cot(x/2), f'(x) = (1/2) csc^2(x/2), giving - e^x cot(x/2) + C"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match the advanced irrational integrals involving Euler and trigonometric substitutions in List I with their antiderivatives in List II:",
        [
            ("∫ dx / ((x + 1) √(x^2 - 1))", "I", "√((x - 1)/(x + 1)) + C", "Substitute x + 1 = 1/t or observe d/dx[√((x - 1)/(x + 1))] = 1/((x + 1) √(x^2 - 1)), yielding √((x - 1)/(x + 1)) + C"),
            ("∫ dx / (x √(1 - x^3))", "III", "(1/3) ln|(1 - √(1 - x^3))/(1 + √(1 - x^3))| + C", "Let u = √(1 - x^3), so u^2 = 1 - x^3 and 2u du = -3x^2 dx. The integral becomes (2/3) ∫ du / (u^2 - 1) = (1/3) ln|(1 - u)/(1 + u)| + C"),
            ("∫ dx / ((1 + x^2) √(1 - x^2))", "IV", "(1/√2) arctan((x √2) / √(1 - x^2)) + C", "Let x = sin θ: dx = cos θ dθ and √(1 - x^2) = cos θ. Then ∫ dθ / (1 + sin^2 θ) = ∫ sec^2 θ dθ / (1 + 2 tan^2 θ) = (1/√2) arctan(√2 tan θ) + C = (1/√2) arctan((x √2)/√(1 - x^2)) + C"),
            ("∫ dx / (x^4 √(1 + x^2))", "II", "((2x^2 - 1) √(1 + x^2)) / (3x^3) + C", "Substitute x = tan θ or factor x: let 1 + 1/x^2 = t^2. -2/x^3 dx = 2t dt. The integral reduces to ∫ -(t^2 - 1) dt = t - t^3 / 3 + C = ((2x^2 - 1) √(1 + x^2)) / (3x^3) + C"),
        ], "D"))

    # ==========================================
    # TOPIC: Definite Integration (20 questions)
    # ==========================================
    t = "Definite Integration"
    prefix = "math_mat_def_int"

    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match each definite integral evaluated via the Fundamental Theorem of Calculus in List I with its value in List II:",
        [
            ("∫_0^2 (3x^2 + 2x + 1) dx", "III", "14", "Antiderivative is [x^3 + x^2 + x]_0^2 = (8 + 4 + 2) - 0 = 14"),
            ("∫_0^{π/4} sec^2 x dx", "I", "1", "Antiderivative is [tan x]_0^{π/4} = 1 - 0 = 1"),
            ("∫_1^{e^2} (1/x) dx", "IV", "2", "Antiderivative is [ln x]_1^{e^2} = 2 - 0 = 2"),
            ("∫_0^1 e^{2x} dx", "II", "(e^2 - 1) / 2", "Antiderivative is [(1/2) e^{2x}]_0^1 = (e^2 - 1)/2"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match each definite integral over a symmetric interval [-a, a] in List I with its evaluated result in List II:",
        [
            ("∫_{-1}^1 x^7 dx", "IV", "0", "Since f(x) = x^7 is an odd function, the integral over [-1, 1] is 0"),
            ("∫_{-2}^2 x^2 dx", "I", "16/3", "Since f(x) = x^2 is even: 2 ∫_0^2 x^2 dx = 2 [x^3/3]_0^2 = 16/3"),
            ("∫_{-1}^1 |x| dx", "II", "1", "Since |x| is even: 2 ∫_0^1 x dx = 2(1/2) = 1"),
            ("∫_{-π/2}^{π/2} cos x dx", "III", "2", "Since cos x is even: 2 ∫_0^{π/2} cos x dx = 2 [sin x]_0^{π/2} = 2(1) = 2"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each definite integral solvable by King's Property (∫_0^a f(x) dx = ∫_0^a f(a - x) dx) in List I with its value in List II:",
        [
            ("∫_0^{π/2} sin^3 x / (sin^3 x + cos^3 x) dx", "II", "π/4", "By King's property, 2I = ∫_0^{π/2} 1 dx = π/2, so I = π/4"),
            ("∫_0^π x sin x dx", "IV", "π", "By King's property: 2I = π ∫_0^π sin x dx = π [ - cos x ]_0^π = 2π, so I = π"),
            ("∫_0^1 x (1 - x)^3 dx", "I", "1/20", "By King's property: ∫_0^1 (1 - x) x^3 dx = ∫_0^1 (x^3 - x^4) dx = 1/4 - 1/5 = 1/20"),
            ("∫_0^π x dx", "III", "π^2 / 2", "Direct integration: [x^2 / 2]_0^π = π^2 / 2"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match each definite integral involving floor [x] and fractional part {x} in List I with its evaluated value in List II:",
        [
            ("∫_0^3 [x] dx", "I", "3", "Piecewise constant: 0(1) + 1(1) + 2(1) = 3"),
            ("∫_0^2 {x} dx", "III", "1", "Fractional part is periodic with period 1: 2 ∫_0^1 x dx = 2(1/2) = 1"),
            ("∫_0^2 [x^2] dx", "IV", "5 - √2 - √3", "Breaks at 1, √2, √3, 2: 0(1) + 1(√2 - 1) + 2(√3 - √2) + 3(2 - √3) = 5 - √2 - √3"),
            ("∫_0^4 [x] dx", "II", "6", "Piecewise constant: 0 + 1 + 2 + 3 = 6"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each classic logarithmic-trigonometric definite integral in List I with its value in List II:",
        [
            ("∫_0^{π/2} ln(sin x) dx", "III", "- (π/2) ln 2", "Using King's property and 2 sin x cos x = sin 2x: 2I = - (π/2) ln 2 + I => I = - (π/2) ln 2"),
            ("∫_0^{π/2} ln(tan x) dx", "I", "0", "Using King's property: tan(π/2 - x) = cot x = 1/tan x, so 2I = ∫_0^{π/2} ln(1) dx = 0 => I = 0"),
            ("∫_0^{π/4} ln(1 + tan x) dx", "IV", "(π/8) ln 2", "Using x -> π/4 - x gives 1 + tan(π/4 - x) = 2/(1 + tan x). Thus 2I = (π/4) ln 2 => I = (π/8) ln 2"),
            ("∫_0^π ln(sin x) dx", "II", "- π ln 2", "By Queen's property, ∫_0^π ln(sin x) dx = 2 ∫_0^{π/2} ln(sin x) dx = 2(- (π/2) ln 2) = - π ln 2"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match each limit of a sum as n → ∞ in List I with its evaluated definite integral value in List II:",
        [
            ("lim_{n→∞} ∑_{r=1}^n r / (n^2 + r^2)", "IV", "(1/2) ln 2", "Write as lim (1/n) ∑ (r/n)/(1 + (r/n)^2) = ∫_0^1 x/(1 + x^2) dx = (1/2) ln(1 + x^2)|_0^1 = (1/2) ln 2"),
            ("lim_{n→∞} ∑_{r=1}^n 1 / (n + r)", "II", "ln 2", "Write as lim (1/n) ∑ 1/(1 + r/n) = ∫_0^1 dx / (1 + x) = ln 2"),
            ("lim_{n→∞} (1/n) ∑_{r=1}^n (r/n)^2", "I", "1/3", "Direct Riemann sum: ∫_0^1 x^2 dx = [x^3 / 3]_0^1 = 1/3"),
            ("lim_{n→∞} (1/n) ∑_{r=1}^n 1 / √(n^2 - r^2)", "III", "π/2", "Write as lim (1/n^2) ∑ 1/√(1 - (r/n)^2)... wait, lim (1/n) ∑ 1/√(1 - (r/n)^2) = ∫_0^1 dx / √(1 - x^2) = [arcsin x]_0^1 = π/2"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match each definite integral reducible by Queen's Property (∫_0^{2a} f(x) dx) in List I with its value in List II:",
        [
            ("∫_0^{2π} cos^5 x dx", "II", "0", "Since cos(2π - x) = cos x, but cos(π - x) = -cos x, Queen's property yields 0"),
            ("∫_0^π |cos x| dx", "IV", "2", "Split at π/2: ∫_0^{π/2} cos x dx - ∫_{π/2}^π cos x dx = 1 - (-1) = 2"),
            ("∫_0^{2π} sin^4 x dx", "I", "3π/4", "By Queen's property applied twice: 4 ∫_0^{π/2} sin^4 x dx = 4 * (3/4 * 1/2 * π/2) = 3π/4"),
            ("∫_0^π sin^2 x dx", "III", "π/2", "Since sin(π - x) = sin x: 2 ∫_0^{π/2} sin^2 x dx = 2 * (π/4) = π/2"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match each derivative or evaluation using the Leibniz Integral Rule in List I with its expression/value in List II:",
        [
            ("d/dx [ ∫_0^x t^2 dt ] evaluated at x = 2", "I", "4", "By Fundamental Theorem, d/dx = x^2. At x = 2, the value is 2^2 = 4"),
            ("d/dx [ ∫_0^{x^2} sin(t) dt ]", "IV", "2x sin(x^2)", "By Leibniz rule: sin(x^2) * d/dx(x^2) = 2x sin(x^2)"),
            ("d/dx [ ∫_x^{x^2} t dt ]", "II", "2x^3 - x", "By Leibniz rule: x^2 * (2x) - x * (1) = 2x^3 - x"),
            ("d/dx [ ∫_1^x (ln t) dt ]", "III", "ln x", "By the Fundamental Theorem of Calculus: d/dx = ln x"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match each definite integral evaluated via Walli's formula / beta function in List I with its exact value in List II:",
        [
            ("∫_0^{π/2} sin^6 x dx", "III", "5π/32", "By Walli's formula: (5/6) * (3/4) * (1/2) * (π/2) = 5π/32"),
            ("∫_0^{π/2} sin^5 x dx", "I", "8/15", "By Walli's formula: (4/5) * (2/3) * 1 = 8/15"),
            ("∫_0^{π/2} sin^4 x cos^2 x dx", "IV", "π/32", "By Walli's formula: [(3 * 1) * 1] / [6 * 4 * 2] * (π/2) = 3 / 48 * (π/2) = π/32"),
            ("∫_0^{π/2} sin^3 x cos^3 x dx", "II", "1/12", "By Walli's formula: (2 * 2) / (6 * 4 * 2) = 4 / 48 = 1/12"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match each integral of a periodic function (∫_0^{nT} f(x) dx = n ∫_0^T f(x) dx) in List I with its value in List II:",
        [
            ("∫_0^{10π} |sin x| dx", "IV", "20", "Period of |sin x| is π. 10 ∫_0^π sin x dx = 10 * 2 = 20"),
            ("∫_0^{100} (x - [x]) dx", "I", "50", "Period of {x} is 1. 100 ∫_0^1 x dx = 100 * (1/2) = 50"),
            ("∫_0^{8π} sin^2 x dx", "II", "4π", "Period is π. 8 ∫_0^π sin^2 x dx = 8 * (π/2) = 4π"),
            ("∫_0^{6π} |cos x| dx", "III", "12", "Period is π. 6 ∫_0^π |cos x| dx = 6 * 2 = 12"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match each definite integral of piecewise absolute value functions in List I with its value in List II:",
        [
            ("∫_0^1 |2x - 1| dx", "II", "1/2", "Breaks at x = 1/2: ∫_0^{1/2} (1 - 2x) dx + ∫_{1/2}^1 (2x - 1) dx = 1/4 + 1/4 = 1/2"),
            ("∫_0^2 |x - 1| dx", "IV", "1", "Breaks at x = 1: ∫_0^1 (1 - x) dx + ∫_1^2 (x - 1) dx = 1/2 + 1/2 = 1"),
            ("∫_0^3 |x - 1| dx", "I", "5/2", "Breaks at x = 1: ∫_0^1 (1 - x) dx + ∫_1^3 (x - 1) dx = 1/2 + 2 = 5/2"),
            ("∫_0^4 |x - 2| dx", "III", "4", "Breaks at x = 2: ∫_0^2 (2 - x) dx + ∫_2^4 (x - 2) dx = 2 + 2 = 4"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match each exponential and logarithmic definite integral in List I with its value in List II:",
        [
            ("∫_0^1 x e^x dx", "I", "1", "Integration by parts: [(x - 1)e^x]_0^1 = 0 - (-1) = 1"),
            ("∫_0^1 x^2 e^x dx", "III", "e - 2", "Integration by parts: [(x^2 - 2x + 2)e^x]_0^1 = e - 2"),
            ("∫_0^1 x e^{-x} dx", "IV", "1 - 2/e", "Integration by parts: [- (x + 1)e^{-x}]_0^1 = -2/e - (-1) = 1 - 2/e"),
            ("∫_1^e x ln x dx", "II", "(e^2 + 1) / 4", "Integration by parts: [(x^2 / 2) ln x - x^2 / 4]_1^e = e^2/4 - (-1/4) = (e^2 + 1)/4"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Match each limit of an integral expression evaluated using Leibniz rule in List I with its value in List II:",
        [
            ("lim_{x→0} (∫_0^x sin(t^2) dt) / x^3", "III", "1/3", "By L'Hopital's rule: lim sin(x^2)/(3x^2) = 1/3"),
            ("lim_{x→0} (∫_0^{x^2} cos(t^2) dt) / (x sin x)", "I", "1", "Differentiating: lim (2x cos(x^4)) / (sin x + x cos x) = lim 2 / (1 + 1) = 1"),
            ("lim_{x→0} (x ∫_0^x e^{t^2} dt) / (1 - e^{x^2})", "IV", "-1", "Differentiating: lim (∫_0^x e^{t^2} dt + x e^{x^2}) / (-2x e^{x^2}) = lim (x + x)/(-2x) = -1"),
            ("lim_{x→0} (∫_0^x ln(1 + t) dt) / x^2", "II", "1/2", "By L'Hopital's rule: lim ln(1 + x)/(2x) = 1/2"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match each advanced definite integral evaluated by King's Property in List I with its value in List II:",
        [
            ("∫_0^{π/2} (x sin x cos x) / (sin^4 x + cos^4 x) dx", "IV", "π^2 / 16", "Replacing x with π/2 - x gives 2I = (π/2) ∫_0^{π/2} (sin x cos x)/(sin^4 x + cos^4 x) dx = (π/2)*(π/8) = π^2 / 16"),
            ("∫_0^π x / (1 + sin x) dx", "I", "π", "Replacing x with π - x gives 2I = π ∫_0^π dx / (1 + sin x) = π * 2 = 2π, so I = π"),
            ("∫_0^π (x tan x) / (sec x + cos x) dx", "II", "π^2 / 4", "Simplifying integrand gives x sin x / (1 + cos^2 x). 2I = π ∫_0^π sin x / (1 + cos^2 x) dx = π [ - arctan(cos x) ]_0^π = π^2 / 2, so I = π^2 / 4"),
            ("∫_0^1 (ln(1 + x)) / (1 + x^2) dx", "III", "(π/8) ln 2", "Substitute x = tan θ: ∫_0^{π/4} ln(1 + tan θ) dθ = (π/8) ln 2"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match each advanced infinite limit of products and sums in List I with its closed-form value in List II:",
        [
            ("lim_{n→∞} [ (n!)^{1/n} / n ]", "II", "1/e", "Taking ln: (1/n) ∑ ln(r/n) -> ∫_0^1 ln x dx = -1. Exponentiating gives e^{-1} = 1/e"),
            ("lim_{n→∞} ∏_{r=1}^n (1 + r/n)^{1/n}", "IV", "4/e", "Taking ln: (1/n) ∑ ln(1 + r/n) -> ∫_0^1 ln(1 + x) dx = 2 ln 2 - 1. Exponentiating gives e^{2 ln 2 - 1} = 4/e"),
            ("lim_{n→∞} ∑_{r=1}^n 1 / √(4n^2 - r^2)", "I", "π/6", "Write as lim (1/n) ∑ 1/√(4 - (r/n)^2) = ∫_0^1 dx / √(4 - x^2) = [arcsin(x/2)]_0^1 = π/6"),
            ("lim_{n→∞} ∑_{r=1}^n n / (n^2 + r^2)", "III", "π/4", "Write as lim (1/n) ∑ 1/(1 + (r/n)^2) = ∫_0^1 dx / (1 + x^2) = [arctan x]_0^1 = π/4"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match the asymptotic limit of each sequence of definite integrals lim_{n→∞} n ∫_0^1 x^n f(x) dx in List I with its limit in List II:",
        [
            ("lim_{n→∞} n ∫_0^1 x^n ln(1 + x) dx", "I", "ln 2", "By boundary layer localization / integration by parts: lim n/(n+1) [ln(1+1) - ∫_0^1 x^{n+1}/(1+x) dx] = ln 2"),
            ("lim_{n→∞} n ∫_0^1 x^{n-1} e^x dx", "III", "e", "Integration by parts gives [x^n e^x]_0^1 - ∫_0^1 x^n e^x dx = e - 0 = e"),
            ("lim_{n→∞} n ∫_0^1 x^n sin(π x / 2) dx", "IV", "1", "As n → ∞, the integrand concentrates at x = 1, giving f(1) = sin(π/2) = 1"),
            ("lim_{n→∞} n ∫_0^1 x^n (2 + x) dx", "II", "3", "Concentration at x = 1 yields f(1) = 2 + 1 = 3"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match each Frullani and improper integral in List I with its evaluated value in List II:",
        [
            ("∫_0^∞ (e^{-x} - e^{-2x}) / x dx", "III", "ln 2", "Frullani's integral: (f(0) - f(∞)) ln(b/a) = (1 - 0) ln(2/1) = ln 2"),
            ("∫_0^∞ (e^{-x} - e^{-3x}) / x dx", "I", "ln 3", "Frullani's integral: (1 - 0) ln(3/1) = ln 3"),
            ("∫_0^∞ (cos(2x) - cos(3x)) / x dx", "IV", "ln(3/2)", "Frullani's theorem with cos gives (f(0) - f(∞)) ln(b/a) = (1 - 0) ln(3/2) = ln(3/2)"),
            ("∫_0^∞ (arctan(2x) - arctan(x)) / x dx", "II", "(π/2) ln 2", "Frullani's theorem: (f(∞) - f(0)) ln(b/a) = (π/2 - 0) ln(2/1) = (π/2) ln 2"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match each advanced floor and fractional part definite integral in List I with its exact value in List II:",
        [
            ("∫_0^{10} [x] {x} dx", "IV", "45/2", "∑_{k=0}^9 k ∫_0^1 t dt = (0 + 1 + ... + 9) * (1/2) = 45 * (1/2) = 45/2"),
            ("∫_0^2 x [x] dx", "I", "3/2", "Split into ∫_0^1 x(0) dx + ∫_1^2 x(1) dx = [x^2 / 2]_1^2 = 2 - 1/2 = 3/2"),
            ("∫_0^3 x [x^2] dx", "II", "18", "Let u = x^2, du = 2x dx: (1/2) ∫_0^9 [u] du = (1/2)(0 + 1 + 2 + ... + 8) = 36/2 = 18"),
            ("∫_0^2 [x^2 - 2x] dx", "III", "-2", "x^2 - 2x = (x - 1)^2 - 1. For x ∈ (0, 2), -1 < x^2 - 2x < 0, so [x^2 - 2x] = -1. Integral = -1 * 2 = -2"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match each advanced symmetry and logarithmic integral in List I with its closed-form value in List II:",
        [
            ("∫_0^{π/2} x cot x dx", "II", "(π/2) ln 2", "Integrating by parts: [x ln(sin x)]_0^{π/2} - ∫_0^{π/2} ln(sin x) dx = 0 - (- (π/2) ln 2) = (π/2) ln 2"),
            ("∫_0^{π/2} ln(sin x) dx", "IV", "- (π/2) ln 2", "Classic Euler definite integral evaluates to - (π/2) ln 2"),
            ("∫_0^1 (ln(1 + x)) / (1 + x^2) dx", "I", "(π/8) ln 2", "Substitute x = tan θ to get ∫_0^{π/4} ln(1 + tan θ) dθ = (π/8) ln 2"),
            ("∫_0^1 (ln x) / (1 + x) dx", "III", "- π^2 / 12", "Expanding 1/(1+x) as power series and integrating term by term gives - (1 - 1/4 + 1/9 - ...) = - π^2 / 12"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each functional equation integral in List I with its evaluated result in List II:",
        [
            ("If f(x) + f(π - x) = sin^2 x, then ∫_0^π f(x) dx", "I", "π/4", "King's property: 2I = ∫_0^π sin^2 x dx = π/2 => I = π/4"),
            ("If f(x) + f(1 - x) = 2, then ∫_0^1 f(x) dx", "III", "1", "King's property: 2I = ∫_0^1 2 dx = 2 => I = 1"),
            ("If f(x) + f(2 - x) = x^2, then ∫_0^2 f(x) dx", "IV", "4/3", "King's property: 2I = ∫_0^2 x^2 dx = [x^3 / 3]_0^2 = 8/3 => I = 4/3"),
            ("If f(x) f(4 - x) = 1 and f(x) > 0, then ∫_0^4 dx / (1 + f(x))", "II", "2", "Let I = ∫_0^4 dx / (1 + f(x)). Replacing x with 4 - x: f(4-x) = 1/f(x), giving 1/(1 + 1/f(x)) = f(x)/(1 + f(x)). Adding gives 2I = ∫_0^4 1 dx = 4 => I = 2"),
        ], "D"))

    # ==========================================
    # TOPIC: Applications of Integrals (20 questions)
    # ==========================================
    t = "Applications of Integrals"
    prefix = "math_mat_app_int"

    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match each parabola and line enclosed region in List I with its area in List II:",
        [
            ("Area bounded by y = x^2 and y = 4", "III", "32/3", "By symmetry: 2 ∫_0^2 (4 - x^2) dx = 2 [4x - x^3/3]_0^2 = 2(8 - 8/3) = 32/3"),
            ("Area bounded by y^2 = 4x and x = 4", "I", "64/3", "By symmetry: 2 ∫_0^4 2√x dx = 4 [ (2/3) x^{3/2} ]_0^4 = (8/3)(8) = 64/3"),
            ("Area bounded by y = x^2 and y = x", "IV", "1/6", "Curves intersect at x = 0, 1: ∫_0^1 (x - x^2) dx = [x^2/2 - x^3/3]_0^1 = 1/2 - 1/3 = 1/6"),
            ("Area bounded by y = x^2 and y = 2x", "II", "4/3", "Curves intersect at x = 0, 2: ∫_0^2 (2x - x^2) dx = [x^2 - x^3/3]_0^2 = 4 - 8/3 = 4/3"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match each standard conic section region in List I with its bounded area in List II:",
        [
            ("Area of circle x^2 + y^2 = 9", "IV", "9π", "Area of circle of radius r = 3 is π r^2 = 9π"),
            ("Area of ellipse x^2/16 + y^2/9 = 1", "I", "12π", "Area of ellipse is π a b = π (4)(3) = 12π"),
            ("Area of circle x^2 + y^2 = 4 in the first quadrant", "II", "π", "Quarter circle area of radius r = 2: (1/4) π (2^2) = π"),
            ("Area of ellipse x^2/25 + y^2/4 = 1 in the upper half", "III", "5π", "Half ellipse area with a = 5, b = 2: (1/2) π (5)(2) = 5π"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each trigonometric curve region in List I with its bounded area in List II:",
        [
            ("Area under one arch of y = sin x from x = 0 to x = π", "II", "2", "∫_0^π sin x dx = [- cos x]_0^π = 1 - (-1) = 2"),
            ("Area bounded by y = sin x and y = cos x from x = 0 to x = π/4", "IV", "√2 - 1", "∫_0^{π/4} (cos x - sin x) dx = [sin x + cos x]_0^{π/4} = √2 - 1"),
            ("Area bounded by y = sin 2x from x = 0 to x = π/2 with x-axis", "I", "1", "∫_0^{π/2} sin 2x dx = [ - (cos 2x)/2 ]_0^{π/2} = 1/2 - (-1/2) = 1"),
            ("Total area enclosed by y = sin x and x-axis from x = 0 to x = 2π", "III", "4", "Total geometric area is ∫_0^π sin x dx + ∫_π^{2π} (-sin x) dx = 2 + 2 = 4"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match each piecewise absolute value enclosed region in List I with its area in List II:",
        [
            ("Area enclosed by |x| + |y| = 1", "I", "2", "Square with diagonals along axes of length 2: Area = (1/2) * 2 * 2 = 2"),
            ("Area enclosed by |x| + |y| = 2", "III", "8", "Square with diagonals of length 4: Area = (1/2) * 4 * 4 = 8"),
            ("Area bounded by y = |x| and y = 2", "IV", "4", "Triangle with base from x = -2 to 2 (base 4) and height 2: Area = (1/2) * 4 * 2 = 4"),
            ("Area bounded by y = |x - 1| and y = 3", "II", "9", "Triangle with base from x = -2 to 4 (base 6) and height 3: Area = (1/2) * 6 * 3 = 9"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each region bounded by two intersecting parabolas y^2 = 4ax and x^2 = 4by (Area = 16ab/3) in List I with its area in List II:",
        [
            ("Area between y^2 = 4x and x^2 = 4y", "III", "16/3", "Here 4a = 4 => a = 1, 4b = 4 => b = 1. Area = (16/3)(1)(1) = 16/3"),
            ("Area between y^2 = 8x and x^2 = 8y", "I", "64/3", "Here a = 2, b = 2. Area = (16/3)(2)(2) = 64/3"),
            ("Area between y^2 = 12x and x^2 = 12y", "IV", "48", "Here a = 3, b = 3. Area = (16/3)(3)(3) = 48"),
            ("Area between y^2 = 4x and x^2 = 8y", "II", "32/3", "Here a = 1, b = 2. Area = (16/3)(1)(2) = 32/3"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match each region bounded by parabola y^2 = 4ax and line y = mx (Area = 8a^2 / (3m^3)) in List I with its area in List II:",
        [
            ("Area between y^2 = 4x and y = x", "IV", "8/3", "Here a = 1, m = 1. Area = 8(1)^2 / (3(1)^3) = 8/3"),
            ("Area between y^2 = 4x and y = 2x", "II", "1/3", "Here a = 1, m = 2. Area = 8(1) / (3(8)) = 1/3"),
            ("Area between y^2 = 8x and y = x", "I", "32/3", "Here a = 2, m = 1. Area = 8(4) / 3 = 32/3"),
            ("Area between y^2 = 2x and y = x", "III", "2/3", "Here 4a = 2 => a = 1/2, m = 1. Area = 8(1/4) / 3 = 2/3"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match each circular segment or bounded region in List I with its area in List II:",
        [
            ("Smaller area cut off from circle x^2 + y^2 = 4 by line x = √2", "II", "π - 2", "Radius r = 2. Chord subtends 90°: Sector area is (1/4)π(4) = π; triangle area is (1/2)(2)(2) = 2. Area = π - 2"),
            ("Smaller area cut off from circle x^2 + y^2 = 1 by line x = 1/2", "IV", "π/3 - √3/4", "Angle θ = π/3: Sector area is (1/2)(1)^2(2π/3) = π/3; triangle is (1/2)(1)(√3/2) = √3/4. Area = π/3 - √3/4"),
            ("Smaller area cut off from circle x^2 + y^2 = 2 by line x + y = √2", "I", "π/2 - 1", "Radius √2. Distance to chord is 1, chord length 2: Sector is π/2; triangle is (1/2)(√2)(√2) = 1. Area = π/2 - 1"),
            ("Area enclosed between x^2 + y^2 = 4 and lines y = |x| above the x-axis", "III", "π", "Quarter circle of radius 2: (1/4) π (2^2) = π"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match each region bounded by exponential or logarithmic curves in List I with its area in List II:",
        [
            ("Area bounded by y = e^x, y = e^{-x}, and x = 1", "I", "e + 1/e - 2", "∫_0^1 (e^x - e^{-x}) dx = [e^x + e^{-x}]_0^1 = (e + 1/e) - 2"),
            ("Area bounded by y = ln x, x-axis, and x = e", "III", "1", "∫_1^e ln x dx = [x ln x - x]_1^e = (e - e) - (0 - 1) = 1"),
            ("Area bounded by y = ln x and y = (ln x)^2", "IV", "3 - e", "Curves intersect at x = 1 and x = e. ∫_1^e (ln x - (ln x)^2) dx = 1 - (e - 2) = 3 - e"),
            ("Area bounded by y = e^x, y = x, x = 0, and x = 1", "II", "e - 3/2", "∫_0^1 (e^x - x) dx = [e^x - x^2/2]_0^1 = (e - 1/2) - 1 = e - 3/2"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match each region bounded by cubic curves and lines in List I with its area in List II:",
        [
            ("Area bounded by y = x^3 and y = x", "III", "1/2", "By symmetry: 2 ∫_0^1 (x - x^3) dx = 2 [x^2/2 - x^4/4]_0^1 = 2(1/4) = 1/2"),
            ("Area bounded by y = x^3 and y = 4x", "I", "8", "By symmetry: 2 ∫_0^2 (4x - x^3) dx = 2 [2x^2 - x^4/4]_0^2 = 2(8 - 4) = 8"),
            ("Area bounded by y = x^3 - 3x and the x-axis", "IV", "9/2", "Roots at -√3, 0, √3. By symmetry: 2 ∫_0^{√3} (3x - x^3) dx = 2 [3x^2/2 - x^4/4]_0^{√3} = 2(9/2 - 9/4) = 9/2"),
            ("Area bounded by y = x^3 and y = x^2", "II", "1/12", "Intersect at x = 0, 1: ∫_0^1 (x^2 - x^3) dx = 1/3 - 1/4 = 1/12"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match each multi-inequality region in List I with its area in List II:",
        [
            ("Region {(x,y): y ≥ x^2 and y ≤ |x|}", "IV", "1/3", "By symmetry: 2 ∫_0^1 (x - x^2) dx = 2 [1/2 - 1/3] = 2(1/6) = 1/3"),
            ("Region {(x,y): x^2 + y^2 ≤ 1 and x + y ≥ 1}", "II", "π/4 - 1/2", "Area of quarter circle minus area of right triangle: π/4 - 1/2"),
            ("Region {(x,y): y^2 ≤ 2x and x - y ≤ 4}", "I", "18", "Intersections at y = -2, 4: ∫_{-2}^4 (y + 4 - y^2/2) dy = [y^2/2 + 4y - y^3/6]_{-2}^4 = 40/3 - (-14/3) = 18"),
            ("Region {(x,y): 0 ≤ y ≤ x^2 + 1, 0 ≤ y ≤ x + 1, 0 ≤ x ≤ 2}", "III", "23/6", "Split at x = 1: ∫_0^1 (x^2 + 1) dx + ∫_1^2 (x + 1) dx = (1/3 + 1) + (3/2 + 1) = 4/3 + 5/2 = 23/6"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match each region involving reciprocal or rational curves in List I with its area in List II:",
        [
            ("Area bounded by y = 1/x, y = 0, x = 1, and x = e^2", "II", "2", "∫_1^{e^2} (1/x) dx = [ln x]_1^{e^2} = 2 - 0 = 2"),
            ("Area bounded by y = 1/(1 + x^2), y = 0, x = -1, and x = 1", "IV", "π/2", "∫_{-1}^1 dx / (1 + x^2) = [arctan x]_{-1}^1 = π/4 - (-π/4) = π/2"),
            ("Area bounded by y = 1/x, y = x, and y = x/4 in the first quadrant", "I", "ln 2", "Intersections at (1,1) and (2, 1/2): ∫_0^1 (x - x/4) dx + ∫_1^2 (1/x - x/4) dx = 3/8 + (ln 2 - 3/8) = ln 2"),
            ("Area bounded by y = 4/x^2, y = 0, x = 1, and x = 4", "III", "3", "∫_1^4 (4/x^2) dx = [-4/x]_1^4 = -1 - (-4) = 3"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match each region bounded by inverse trigonometric curves in List I with its area in List II:",
        [
            ("Area bounded by y = arcsin x, x = 0, and y = π/2", "I", "1", "Integrating with respect to y: ∫_0^{π/2} sin y dy = [- cos y]_0^{π/2} = 1"),
            ("Area bounded by y = arctan x, x = 0, x = 1, and y = 0", "III", "π/4 - (1/2) ln 2", "∫_0^1 arctan x dx = [x arctan x - (1/2) ln(1 + x^2)]_0^1 = π/4 - (1/2) ln 2"),
            ("Area bounded by y = arccos x, y = 0, x = -1, and x = 1", "IV", "π", "By point symmetry around (0, π/2): Area = π * 1 = π"),
            ("Area bounded by y = arctan x, y = arccot x, and y-axis in the first quadrant", "II", "ln 2", "Curves meet at x = 1: ∫_0^1 (arccot x - arctan x) dx = π/2 - 2(π/4 - (1/2) ln 2) = ln 2"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Match each parametric area optimization / parameter condition in List I with its value in List II:",
        [
            ("Value of m > 0 such that area bounded by y = mx - x^2 and y = 0 is 36", "III", "6", "Area = m^3 / 6 = 36 => m^3 = 216 => m = 6"),
            ("Value of c > 0 such that area bounded by y = x^2 - c^2 and y = c^2 - x^2 is 72", "I", "3", "Area = 2 ∫_{-c}^c (c^2 - x^2) dx = (8/3) c^3 = 72 => c^3 = 27 => c = 3"),
            ("Value of a > 0 such that area between y = ax^2 and y = 1 is 8/3", "IV", "1/4", "Area = 4 / (3√a) = 8/3 => √a = 1/2 => a = 1/4"),
            ("Value of k > 0 such that area bounded by y = e^{kx}, y = 0, x = 0, x = 1 is (e^2 - 1)/2", "II", "2", "Area = (e^k - 1)/k = (e^2 - 1)/2 => k = 2"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match each algebraic curve with closed loops in List I with its enclosed loop area in List II:",
        [
            ("Area of the loop of 4 y^2 = x^2 (4 - x)", "IV", "128/15", "Loop exists for x ∈ [0, 4]: 2 ∫_0^4 (x/2) √(4 - x) dx = ∫_0^4 x √(4 - x) dx = 4^{5/2} B(2, 3/2) = 128/15"),
            ("Area of the loop of y^2 = x (x - 1)^2", "I", "8/15", "Loop exists for x ∈ [0, 1]: 2 ∫_0^1 (1 - x) √x dx = 2 [2/3 - 2/5] = 8/15"),
            ("Area of one loop of y^2 = x^2 (1 - x^2)", "II", "2/3", "For x ∈ [0, 1]: 2 ∫_0^1 x √(1 - x^2) dx = 2 [- (1/3)(1 - x^2)^{3/2}]_0^1 = 2/3"),
            ("Area of the loop of y^2 = (x - 1)(3 - x)^2", "III", "32√2 / 15", "For x ∈ [1, 3]: 2 ∫_1^3 (3 - x) √(x - 1) dx = 2 ∫_0^2 (2 - u) √u du = 32√2 / 15"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match each area bounded by curves, their tangents, or normals in List I with its value in List II:",
        [
            ("Area bounded by y = x^2, tangent at (1, 1), and x-axis", "II", "1/12", "Tangent is y = 2x - 1, meets x-axis at 1/2. Area = ∫_0^1 x^2 dx - (1/2)(1/2)(1) = 1/3 - 1/4 = 1/12"),
            ("Area bounded by y = x^2, tangent at (2, 4), and y-axis", "IV", "8/3", "Tangent is y = 4x - 4. Area = ∫_0^2 (x^2 - (4x - 4)) dx = [x^3/3 - 2x^2 + 4x]_0^2 = 8/3"),
            ("Area bounded by y^2 = 4x and its normal at (1, 2)", "I", "64/3", "Normal is x + y = 3. Points of intersection with parabola are y = -6, 2. Area = ∫_{-6}^2 (3 - y - y^2/4) dy = 64/3"),
            ("Area bounded by y = ln x, tangent at (e, 1), and x-axis", "III", "e/2 - 1", "Tangent is y = x/e (passes through origin). Area = (1/2)(e)(1) - ∫_1^e ln x dx = e/2 - 1"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match each advanced region involving nested absolute values in List I with its area in List II:",
        [
            ("Area enclosed by |x| + |y| ≤ 1 and x^2 + y^2 ≥ 1/2", "I", "2 - π/2", "Square area is 2, inscribed circle area is π(1/√2)^2 = π/2. Enclosed region = 2 - π/2"),
            ("Area enclosed by ||x| - 1| + ||y| - 1| ≤ 1", "III", "8", "Consists of 4 disjoint diamonds centered at (±1, ±1), each of area 2: Total area = 4 * 2 = 8"),
            ("Area enclosed by |x - y| + |x + y| ≤ 2", "IV", "4", "A square with vertices at (±1, ±1) and side length 2: Area = 2 * 2 = 4"),
            ("Area bounded by y = |x^2 - 4| and y = 5", "II", "44/3", "Intersects at x = ±3: 2 [ ∫_0^2 (x^2 + 1) dx + ∫_2^3 (9 - x^2) dx ] = 2 [ 14/3 + 8/3 ] = 44/3"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match each parametric or polar curve region in List I with its enclosed area in List II:",
        [
            ("Total area enclosed by astroid x = 2 cos^3 t, y = 2 sin^3 t", "III", "3π/2", "Total area = (3/8) π a^2 = (3/8) π (4) = 3π/2"),
            ("Area under one arch of cycloid x = t - sin t, y = 1 - cos t", "I", "3π", "Area under one arch is 3π a^2 = 3π(1)^2 = 3π"),
            ("Area enclosed by cardioid r = 2(1 + cos θ)", "IV", "6π", "Area = (1/2) ∫_0^{2π} r^2 dθ = (3/2) π a^2 = (3/2) π (4) = 6π"),
            ("Loop area of Folium of Descartes x^3 + y^3 = 6xy", "II", "6", "Loop area = 3 a^2 / 2. Here 3a = 6 => a = 2, so area = 3(4)/2 = 6"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match each division/ratio of area problem in List I with its result in List II:",
        [
            ("Ratio of smaller to larger area when y^2 = 4x is divided by x = 1 (up to x = 4)", "IV", "1/7", "Area from 0 to 1 is 8/3; total area to 4 is 64/3; larger area is 56/3. Ratio = (8/3)/(56/3) = 1/7"),
            ("Value of m such that y = mx divides area between y = x^2 and y = x into equal halves", "I", "1/2^{1/3}", "Total area is 1/6. Area between y = x^2 and y = mx is m^3 / 6 = 1/12 => m^3 = 1/2 => m = 1/2^{1/3}"),
            ("Value of c such that y = c divides area bounded by y = x^2 and y = 4 into equal halves", "II", "2^{4/3}", "Area below y = c is (4/3) c^{3/2} = 16/3 => c^{3/2} = 4 => c = 2^{4/3}"),
            ("Ratio in which y = sin x divides area of rectangle [0, π/2] × [0, 1]", "III", "2 / (π - 2)", "Area under curve is 1, area above is π/2 - 1. Ratio = 1 / (π/2 - 1) = 2 / (π - 2)"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match each region involving min and max functions in List I with its area in List II:",
        [
            ("Area bounded by y = max{x, x^2} for x ∈ [0, 2] and x-axis", "II", "17/6", "Split at x = 1: ∫_0^1 x dx + ∫_1^2 x^2 dx = 1/2 + 7/3 = 17/6"),
            ("Area bounded by y = min{x, x^2} for x ∈ [0, 2] and x-axis", "IV", "11/6", "Split at x = 1: ∫_0^1 x^2 dx + ∫_1^2 x dx = 1/3 + 3/2 = 11/6"),
            ("Area bounded by y = min{x + 2, 4 - x^2} above x-axis", "I", "37/6", "Intersection at x = 1: ∫_{-2}^1 (x + 2) dx + ∫_1^2 (4 - x^2) dx = 9/2 + 5/3 = 37/6"),
            ("Area bounded by y = max{sin x, cos x} for x ∈ [0, π/2] and x-axis", "III", "√2", "Split at π/4: ∫_0^{π/4} cos x dx + ∫_{π/4}^{π/2} sin x dx = 1/√2 + 1/√2 = √2"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each region bounded by rational or transcendental curves in List I with its exact area in List II:",
        [
            ("Area enclosed between y = 1/(1 + x^2) and y = x^2 / 2", "I", "π/2 - 1/3", "Intersects at x = ±1: 2 ∫_0^1 (1/(1 + x^2) - x^2/2) dx = 2 [π/4 - 1/6] = π/2 - 1/3"),
            ("Area bounded by y = ln(x + e), x-axis, and y-axis", "III", "1", "Meets x-axis at 1 - e: ∫_{1-e}^0 ln(x + e) dx = [u ln u - u]_1^e = 1"),
            ("Area bounded by y = x e^x, y = 0, and x = 2", "IV", "e^2 + 1", "∫_0^2 x e^x dx = [(x - 1)e^x]_0^2 = e^2 - (-1) = e^2 + 1"),
            ("Area enclosed by y = 2x / (1 + x^2) and y = x", "II", "2 ln 2 - 1", "Intersects at x = 0, ±1: 2 ∫_0^1 (2x/(1 + x^2) - x) dx = 2 [ln(1 + x^2) - x^2/2]_0^1 = 2 ln 2 - 1"),
        ], "D"))

    # ==========================================
    # TOPIC: Differential Equations (20 questions)
    # ==========================================
    t = "Differential Equations"
    prefix = "math_mat_diff_eq"

    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match each differential equation in List I with its order and degree in List II:",
        [
            ("(d^2 y/dx^2)^3 + (dy/dx)^4 + y = sin x", "III", "Order 2, Degree 3", "Highest order derivative is d^2 y/dx^2 (order 2), and its highest exponent is 3 (degree 3)"),
            ("(d^3 y/dx^3) + x (dy/dx)^2 = 0", "I", "Order 3, Degree 1", "Highest order derivative is d^3 y/dx^3 (order 3), and its highest exponent is 1 (degree 1)"),
            ("[1 + (dy/dx)^2]^{3/2} = d^2 y/dx^2", "IV", "Order 2, Degree 2", "Squaring both sides eliminates fractional powers: [1 + (dy/dx)^2]^3 = (d^2 y/dx^2)^2, yielding order 2, degree 2"),
            ("d^2 y/dx^2 + sin(dy/dx) = 0", "II", "Order 2, Degree not defined", "The highest derivative is order 2, but because dy/dx occurs within a sine function, the equation is not a polynomial in derivatives; degree is not defined"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match each family of curves in List I with its governing differential equation in List II:",
        [
            ("Family of concentric circles x^2 + y^2 = r^2", "IV", "x + y (dy/dx) = 0", "Differentiating gives 2x + 2y dy/dx = 0 => x + y dy/dx = 0"),
            ("Family of straight lines passing through origin y = mx", "I", "y = x (dy/dx)", "Differentiating gives dy/dx = m. Substituting m into y = mx gives y = x dy/dx"),
            ("Family of parabolas y^2 = 4ax", "II", "2x (dy/dx) = y", "2y dy/dx = 4a. Substituting into y^2 = 4ax gives y^2 = (2y dy/dx) x => y = 2x dy/dx"),
            ("Family of curves y = A e^x + B e^{-x}", "III", "d^2 y/dx^2 - y = 0", "Differentiating twice yields d^2 y/dx^2 = A e^x + B e^{-x} = y => d^2 y/dx^2 - y = 0"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each variable-separable differential equation in List I with its general solution in List II:",
        [
            ("dy/dx = (1 + y^2) / (1 + x^2)", "II", "arctan y = arctan x + C", "Separating variables: dy / (1 + y^2) = dx / (1 + x^2) integrates directly to arctan y = arctan x + C"),
            ("dy/dx = y / x", "IV", "y = C x", "Separating variables: dy/y = dx/x integrates to ln|y| = ln|x| + c => y = C x"),
            ("dy/dx = e^{x - y}", "I", "e^y = e^x + C", "Write e^y dy = e^x dx, which integrates to e^y = e^x + C"),
            ("dy/dx = - y / x", "III", "x y = C", "Separating variables: dy/y = - dx/x integrates to ln|y| + ln|x| = c => x y = C"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match each linear first-order differential equation in List I with its integrating factor (IF) in List II:",
        [
            ("dy/dx + (1/x) y = x^2", "I", "x", "P(x) = 1/x: IF = e^{∫ (1/x) dx} = e^{ln x} = x"),
            ("dy/dx + (2/x) y = sin x", "III", "x^2", "P(x) = 2/x: IF = e^{∫ (2/x) dx} = e^{2 ln x} = x^2"),
            ("dy/dx + (tan x) y = sec x", "IV", "sec x", "P(x) = tan x: IF = e^{∫ tan x dx} = e^{ln|sec x|} = sec x"),
            ("dy/dx + (cot x) y = x", "II", "sin x", "P(x) = cot x: IF = e^{∫ cot x dx} = e^{ln|sin x|} = sin x"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each first-order linear differential equation (dy/dx + Py = Q) in List I with its general solution in List II:",
        [
            ("dy/dx + y/x = x^2", "III", "y = x^3 / 4 + C / x", "IF = x: d(xy)/dx = x^3 => xy = x^4/4 + C => y = x^3/4 + C/x"),
            ("dy/dx + 2y = e^{-x}", "I", "y = e^{-x} + C e^{-2x}", "IF = e^{2x}: d(y e^{2x})/dx = e^x => y e^{2x} = e^x + C => y = e^{-x} + C e^{-2x}"),
            ("dy/dx + y cot x = 2 cos x", "IV", "y = sin x + C csc x", "IF = sin x: d(y sin x)/dx = 2 sin x cos x => y sin x = sin^2 x + C => y = sin x + C csc x"),
            ("dy/dx - y/x = 2x^2", "II", "y = x^3 + C x", "IF = 1/x: d(y/x)/dx = 2x => y/x = x^2 + C => y = x^3 + C x"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match each homogeneous differential equation in List I with its general solution in List II:",
        [
            ("dy/dx = (x + y) / x", "IV", "y = x ln|x| + C x", "Substitute y = vx: v + x dv/dx = 1 + v => dv = dx/x => v = ln|x| + C => y = x ln|x| + C x"),
            ("dy/dx = (x^2 + y^2) / (2xy)", "II", "x^2 - y^2 = C x", "Substitute y = vx: v + x dv/dx = (1 + v^2)/(2v) => 2v dv / (1 - v^2) = dx/x => x^2 - y^2 = C x"),
            ("dy/dx = y/x + tan(y/x)", "I", "sin(y/x) = C x", "Substitute y = vx: v + x dv/dx = v + tan v => cot v dv = dx/x => sin v = C x => sin(y/x) = C x"),
            ("(x^2 - y^2) dx + 2xy dy = 0", "III", "x^2 + y^2 = C x", "dy/dx = (y^2 - x^2)/(2xy). With y = vx: 2v dv / (1 + v^2) = - dx/x => x^2 + y^2 = C x"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match each differential equation linear in x (dx/dy + P(y)x = Q(y)) in List I with its general solution in List II:",
        [
            ("(x + 2y^3) dy/dx = y", "II", "x = y^3 + C y", "dx/dy - x/y = 2y^2. IF = 1/y: d(x/y) = 2y dy => x/y = y^2 + C => x = y^3 + C y"),
            ("(1 + y^2) dx + (x - e^{-arctan y}) dy = 0", "IV", "x e^{arctan y} = arctan y + C", "dx/dy + x/(1 + y^2) = e^{-arctan y}/(1 + y^2). IF = e^{arctan y}: d(x e^{arctan y}) = dy/(1 + y^2) => x e^{arctan y} = arctan y + C"),
            ("y dx - x dy + ln y dy = 0", "I", "x = ln y + 1 + C y", "dx/dy - x/y = - (ln y)/y. IF = 1/y: d(x/y) = - (ln y)/y^2 dy => x/y = (ln y + 1)/y + C => x = ln y + 1 + C y"),
            ("dx/dy - x / (y + 1) = 1", "III", "x = (y + 1) ln|y + 1| + C (y + 1)", "IF = 1/(y + 1): d(x/(y + 1)) = dy/(y + 1) => x/(y + 1) = ln|y + 1| + C => x = (y + 1) ln|y + 1| + C (y + 1)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match each exact differential equation M dx + N dy = 0 in List I with its potential function solution in List II:",
        [
            ("(2xy + 1) dx + x^2 dy = 0", "I", "x^2 y + x = C", "∂M/∂y = 2x = ∂N/∂x. Integrating M wrt x: x^2 y + x = C"),
            ("(y e^{xy} + 2x) dx + x e^{xy} dy = 0", "IV", "e^{xy} + x^2 = C", "∂M/∂y = e^{xy} + xy e^{xy} = ∂N/∂x. Exact equation with potential e^{xy} + x^2 = C"),
            ("(3x^2 y + 2xy) dx + (x^3 + x^2) dy = 0", "II", "x^3 y + x^2 y = C", "Exact: ∂M/∂y = 3x^2 + 2x = ∂N/∂x. Integrating gives x^3 y + x^2 y = C"),
            ("(cos x cos y - cot x) dx - (sin x sin y) dy = 0", "III", "sin x cos y - ln|sin x| = C", "∂M/∂y = - cos x sin y = ∂N/∂x. Integrating gives sin x cos y - ln|sin x| = C"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match each Bernoulli differential equation in List I with its transformed general solution in List II:",
        [
            ("dy/dx + y/x = y^2", "III", "1/y = x (C - ln x)", "Divide by y^2 and substitute v = 1/y: dv/dx - v/x = -1. IF = 1/x: v/x = - ln x + C => 1/y = x (C - ln x)"),
            ("dy/dx + y = y^3 e^x", "I", "1/y^2 = 2e^x + C e^{2x}", "Substitute v = 1/y^2: dv/dx - 2v = -2e^x. IF = e^{-2x}: v e^{-2x} = 2e^{-x} + C => 1/y^2 = 2e^x + C e^{2x}"),
            ("dy/dx + (2/x) y = y^2 / x", "IV", "1/y = 1/2 + C x^2", "Substitute v = 1/y: dv/dx - (2/x)v = - 1/x. IF = 1/x^2: v/x^2 = 1/(2x^2) + C => 1/y = 1/2 + C x^2"),
            ("x dy/dx + y = y^2 ln x", "II", "1/y = ln x + 1 + C x", "Substitute v = 1/y: dv/dx - v/x = - (ln x)/x. IF = 1/x: v/x = (ln x + 1)/x + C => 1/y = ln x + 1 + C x"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match each differential equation reducible by linear substitution z = ax + by + c in List I with its solution in List II:",
        [
            ("dy/dx = (x + y)^2", "IV", "arctan(x + y) = x + C", "Let u = x + y, du/dx = 1 + u^2. du / (1 + u^2) = dx integrates to arctan(x + y) = x + C"),
            ("dy/dx = cos(x + y)", "II", "tan((x + y)/2) = x + C", "Let u = x + y, du/dx = 1 + cos u = 2 cos^2(u/2). (1/2) sec^2(u/2) du = dx => tan((x + y)/2) = x + C"),
            ("dy/dx = (x + y + 1)^2", "I", "arctan(x + y + 1) = x + C", "Let u = x + y + 1, du/dx = 1 + u^2 => arctan(u) = x + C => arctan(x + y + 1) = x + C"),
            ("dy/dx = (4x + y + 1)^2", "III", "(1/2) arctan((4x + y + 1)/2) = x + C", "Let u = 4x + y + 1, du/dx = 4 + u^2. du / (u^2 + 4) = dx => (1/2) arctan(u/2) = x + C => (1/2) arctan((4x + y + 1)/2) = x + C"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match each initial value problem in List I with its particular solution in List II:",
        [
            ("dy/dx = 2xy with y(0) = 1", "II", "y = e^{x^2}", "dy/y = 2x dx => ln y = x^2 + c. y(0) = 1 gives c = 0, so y = e^{x^2}"),
            ("dy/dx + 2y = 4 with y(0) = 1", "IV", "y = 2 - e^{-2x}", "Linear ODE: y = 2 + C e^{-2x}. y(0) = 1 gives 1 = 2 + C => C = -1, so y = 2 - e^{-2x}"),
            ("dy/dx = (x + 1)/(y + 1) with y(0) = 0", "I", "(y + 1)^2 = (x + 1)^2", "(y + 1) dy = (x + 1) dx => (y + 1)^2 = (x + 1)^2 + C. y(0) = 0 gives 1 = 1 + C => C = 0, so (y + 1)^2 = (x + 1)^2"),
            ("dy/dx = y/x with y(1) = 2", "III", "y = 2x", "dy/y = dx/x => y = C x. y(1) = 2 gives C = 2, so y = 2x"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match each family of plane curves in List I with its family of orthogonal trajectories in List II:",
        [
            ("Family of parabolas y = c x^2", "I", "x^2 + 2y^2 = C", "dy/dx = 2y/x. Orthogonal trajectories have -dx/dy = 2y/x => x dx + 2y dy = 0 => x^2 + 2y^2 = C"),
            ("Family of circles x^2 + y^2 = 2cx", "III", "x^2 + y^2 = C y", "Differentiating gives 2x + 2y y' = (x^2 + y^2)/x. Replacing y' with -1/y' yields x^2 + y^2 = C y"),
            ("Family of rectangular hyperbolas xy = c", "IV", "x^2 - y^2 = C", "dy/dx = -y/x. Orthogonal trajectories satisfy -dx/dy = -y/x => y dy = x dx => x^2 - y^2 = C"),
            ("Family of straight lines through origin y = cx", "II", "x^2 + y^2 = C", "dy/dx = y/x. Orthogonal trajectories satisfy -dx/dy = y/x => x dx + y dy = 0 => x^2 + y^2 = C"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Match each differential equation solvable by recognizing exact differentials in List I with its solution in List II:",
        [
            ("(x dy - y dx) / (x^2 + y^2) = dx", "III", "arctan(y/x) = x + C", "LHS is d(arctan(y/x)). Integrating directly yields arctan(y/x) = x + C"),
            ("(x dx + y dy) / (x^2 + y^2) = dx", "I", "(1/2) ln(x^2 + y^2) = x + C", "LHS is (1/2) d(x^2 + y^2) / (x^2 + y^2) = d((1/2) ln(x^2 + y^2)). Integrating yields (1/2) ln(x^2 + y^2) = x + C"),
            ("x dy + y dx = x^3 dx", "IV", "xy = x^4 / 4 + C", "LHS is d(xy). Integrating both sides gives xy = x^4 / 4 + C"),
            ("(x dy - y dx) / y^2 = e^x dx", "II", "- x/y = e^x + C", "LHS is d(- x/y). Integrating both sides gives - x/y = e^x + C"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match each advanced initial value problem in List I with its evaluated point or limit in List II:",
        [
            ("dy/dx + 2y = 6 with y(0) = 1. Find lim_{x→∞} y(x)", "IV", "3", "Solution is y(x) = 3 - 2e^{-2x}. As x → ∞, e^{-2x} → 0, so lim y(x) = 3"),
            ("dy/dx + y = e^{-x} with y(0) = 0. Find y(1)", "I", "1/e", "IF = e^x: d(y e^x) = dx => y e^x = x + C. With y(0)=0, C=0, so y = x e^{-x}. At x=1, y(1) = 1/e"),
            ("dy/dx = (y^2 - 1)/(x^2 - 1) with y(2) = 3. Find y(3)", "II", "7", "Separating variables: (y - 1)/(y + 1) = C (x - 1)/(x + 1). At (2,3): 2/4 = C(1/3) => C = 3/2. At x = 3: (y - 1)/(y + 1) = (3/2)(2/4) = 3/4 => 4y - 4 = 3y + 3 => y = 7"),
            ("x dy/dx + y = 2x with y(1) = 1. Find y(2)", "III", "2", "d(xy)/dx = 2x => xy = x^2 + C. y(1)=1 gives 1 = 1 + C => C = 0, so y = x. At x = 2, y(2) = 2"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match each second-order differential equation reducible to first order in List I with its particular solution in List II:",
        [
            ("d^2 y/dx^2 = dy/dx with y(0) = 1, y'(0) = 1", "II", "y = e^x", "Let p = dy/dx: dp/dx = p => p = e^x. Then dy/dx = e^x => y = e^x + c. y(0)=1 gives c=0, so y = e^x"),
            ("d^2 y/dx^2 + y = 0 with y(0) = 0, y'(0) = 1", "IV", "y = sin x", "Auxiliary equation m^2 + 1 = 0 => y = A cos x + B sin x. y(0)=0 => A=0, y'(0)=1 => B=1, so y = sin x"),
            ("d^2 y/dx^2 - 4y = 0 with y(0) = 2, y'(0) = 0", "I", "y = e^{2x} + e^{-2x}", "Auxiliary equation m^2 - 4 = 0 => y = A e^{2x} + B e^{-2x}. y(0)=2 => A+B=2, y'(0)=0 => 2A-2B=0 => A=1, B=1, so y = e^{2x} + e^{-2x}"),
            ("x d^2 y/dx^2 + dy/dx = 0 with y(1) = 0, y'(1) = 1", "III", "y = ln x", "Rewrite as d/dx(x dy/dx) = 0 => x dy/dx = C_1 = 1 => dy/dx = 1/x => y = ln x + C_2. y(1)=0 gives C_2=0, so y = ln x"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match each geometric description of a family of curves in List I with its geometric identity in List II:",
        [
            ("Curves whose sub-normal is constant k", "I", "Parabolas (y^2 = 2kx + C)", "Sub-normal is |y dy/dx| = k => y dy = k dx => y^2 = 2kx + C, representing parabolas"),
            ("Curves whose sub-tangent is constant k", "III", "Exponential curves (y = C e^{x/k})", "Sub-tangent is |y / (dy/dx)| = k => dy/y = dx/k => y = C e^{x/k}, representing exponential curves"),
            ("Curves whose normal length is constant a", "IV", "Circles (x^2 + y^2 = a^2)", "Normal length is y √(1 + (dy/dx)^2) = a => y^2 (1 + (y')^2) = a^2 => x^2 + y^2 = a^2, representing circles"),
            ("Curves whose tangent passes through origin", "II", "Straight lines (y = C x)", "Tangent is Y - y = y'(X - x). Passing through (0,0) implies -y = -x y' => dy/y = dx/x => y = C x, representing straight lines"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match each differential equation involving absolute values or sign functions in List I with its solution in List II:",
        [
            ("dy/dx = |x| with y(0) = 0", "III", "y = (x |x|) / 2", "For x ≥ 0, y = x^2/2; for x < 0, y = -x^2/2. In unified notation, y = (x |x|) / 2"),
            ("dy/dx + |y| = 0 for y > 0 with y(0) = 1", "I", "y = e^{-x}", "For y > 0, dy/dx + y = 0 => dy/y = - dx => ln y = -x + c. y(0)=1 gives c=0, so y = e^{-x}"),
            ("|dy/dx| + |y| = 0", "IV", "y = 0", "Since both terms are non-negative, each must be identically zero: y = 0 and dy/dx = 0"),
            ("dy/dx = sgn(x) with y(0) = 1", "II", "y = |x| + 1", "Integrating sgn(x) with y(0)=1 yields y = x + 1 for x > 0 and y = -x + 1 for x < 0, which is y = |x| + 1"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match each Clairaut's differential equation y = x p + f(p) (where p = dy/dx) in List I with its general solution in List II:",
        [
            ("y = x (dy/dx) + (dy/dx)^2", "IV", "y = c x + c^2", "Clairaut's form with f(p) = p^2 has general solution y = c x + c^2"),
            ("y = x (dy/dx) + 1/(dy/dx)", "I", "y = c x + 1/c", "Clairaut's form with f(p) = 1/p has general solution y = c x + 1/c"),
            ("y = x (dy/dx) - (dy/dx)^3", "II", "y = c x - c^3", "Clairaut's form with f(p) = -p^3 has general solution y = c x - c^3"),
            ("y = x (dy/dx) + e^{dy/dx}", "III", "y = c x + e^c", "Clairaut's form with f(p) = e^p has general solution y = c x + e^c"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match each physical application modeled by differential equations in List I with its calculated value in List II:",
        [
            ("Newton's Cooling: dT/dt = -k(T - 20) with T(0)=100, T(1)=60. Find T(2)", "II", "40", "T - 20 = 80 e^{-kt}. At t=1: 40 = 80 e^{-k} => e^{-k} = 1/2. At t=2: T - 20 = 80(1/4) = 20 => T(2) = 40"),
            ("Radioactive decay: dN/dt = -λ N with half-life 5 hrs. Fraction remaining after 15 hrs", "IV", "1/8", "Elapsed time 15 hrs is 3 half-lives: fraction remaining is (1/2)^3 = 1/8"),
            ("Population growth: dP/dt = k P. If population doubles in 10 yrs, factor of increase after 30 yrs", "I", "8", "30 years is 3 doubling periods: factor of increase is 2^3 = 8"),
            ("Torricelli draining: dh/dt = - c √h. Water drops 4m to 1m in 2 hrs. Total time to empty", "III", "4 hours", "2(√4 - √h) = ct. At t=2, h=1: 2(2 - 1) = 2c => c = 1. Complete emptying (h=0): 2(2 - 0) = 1*t => t = 4 hours"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each functional equation related to differential equations in List I with its unique solution in List II:",
        [
            ("f(x + y) = f(x) f(y) for all x, y with f'(0) = 2, f(0) = 1", "I", "f(x) = e^{2x}", "f'(x) = f(x) f'(0) = 2 f(x) => df/f = 2 dx => ln f = 2x => f(x) = e^{2x}"),
            ("f(xy) = f(x) + f(y) for all x, y > 0 with f'(1) = 3", "III", "f(x) = 3 ln x", "Differentiating wrt y at y=1 gives x f'(x) = f'(1) = 3 => f'(x) = 3/x => f(x) = 3 ln x"),
            ("f(x + y) = f(x) + f(y) + 2xy with f'(0) = 1", "IV", "f(x) = x^2 + x", "f'(x) = f'(0) + 2x = 1 + 2x => f(x) = x^2 + x + C. f(0)=0 gives C=0, so f(x) = x^2 + x"),
            ("f(x + y) = f(x) + f(y) for all x, y with f(1) = 5", "II", "f(x) = 5x", "Cauchy's equation has solution f(x) = kx. With f(1) = 5, k = 5, so f(x) = 5x"),
        ], "D"))

    return qs
