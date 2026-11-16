from builder import make_matrix_q

def get_questions():
    qs = []

    # ==========================================
    # TOPIC: Units and Dimensions (20 questions)
    # ==========================================
    t = "Units and Dimensions"
    prefix = "phy_mat_ud"

    # Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the fundamental SI base quantities in List I with their base units and symbols in List II:",
        [
            ("Electric current", "III", "Ampere (A)", "The SI base unit of electric current is Ampere (symbol A)"),
            ("Thermodynamic temperature", "I", "Kelvin (K)", "The SI base unit of thermodynamic temperature is Kelvin (symbol K)"),
            ("Amount of substance", "IV", "Mole (mol)", "The SI base unit of amount of substance is Mole (symbol mol)"),
            ("Luminous intensity", "II", "Candela (cd)", "The SI base unit of luminous intensity is Candela (symbol cd)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the common mechanical physical quantities in List I with their dimensional formulas in List II:",
        [
            ("Force", "IV", "[M L T^-2]", "Force = mass × acceleration = [M][L T^-2] = [M L T^-2]"),
            ("Work or Energy", "II", "[M L^2 T^-2]", "Work = force × displacement = [M L T^-2][L] = [M L^2 T^-2]"),
            ("Power", "I", "[M L^2 T^-3]", "Power = work / time = [M L^2 T^-2] / [T] = [M L^2 T^-3]"),
            ("Pressure or Stress", "III", "[M L^-1 T^-2]", "Pressure = force / area = [M L T^-2] / [L^2] = [M L^-1 T^-2]")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each rate or gradient quantity in List I with its dimensional formula in List II:",
        [
            ("Velocity gradient", "II", "[M^0 L^0 T^-1]", "Velocity gradient = dv/dx = [L T^-1] / [L] = [T^-1]"),
            ("Pressure gradient", "IV", "[M L^-2 T^-2]", "Pressure gradient = dP/dx = [M L^-1 T^-2] / [L] = [M L^-2 T^-2]"),
            ("Energy density", "I", "[M L^-1 T^-2]", "Energy density = energy / volume = [M L^2 T^-2] / [L^3] = [M L^-1 T^-2]"),
            ("Surface tension", "III", "[M L^0 T^-2]", "Surface tension = force / length = [M L T^-2] / [L] = [M T^-2]")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the measured numbers in List I with the correct number of significant figures in List II according to standard rules:",
        [
            ("0.0052", "III", "2", "Leading zeros are not significant; only digits 5 and 2 are significant, giving 2"),
            ("0.00520", "I", "3", "Leading zeros are not significant; 5, 2 and the trailing zero after decimal are significant, giving 3"),
            ("4500. (with explicit decimal point)", "IV", "4", "An explicit decimal point after trailing zeros makes all zeros significant, giving 4"),
            ("3.0800", "II", "5", "All non-zero digits and zeros between or trailing after decimal are significant, giving 5")
        ], "D"))

    # Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match the universal physical constants in List I with their dimensional formulas in List II:",
        [
            ("Planck's constant (h)", "II", "[M L^2 T^-1]", "From E = h ν, [h] = [E] / [ν] = [M L^2 T^-2] / [T^-1] = [M L^2 T^-1]"),
            ("Universal gravitational constant (G)", "IV", "[M^-1 L^3 T^-2]", "From F = G m_1 m_2 / r^2, [G] = [F r^2 / m^2] = [M^-1 L^3 T^-2]"),
            ("Stefan-Boltzmann constant (σ)", "I", "[M L^0 T^-3 K^-4]", "From E / (A t) = σ T^4, [σ] = [M T^-3] / [K^4] = [M T^-3 K^-4]"),
            ("Boltzmann constant (k_B)", "III", "[M L^2 T^-2 K^-1]", "From E = k_B T, [k_B] = [E] / [T] = [M L^2 T^-2 K^-1]")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match the electromagnetic constants and quantities in List I with their dimensional formulas in List II:",
        [
            ("Permittivity of free space (ε_0)", "IV", "[M^-1 L^-3 T^4 A^2]", "From Coulomb's Law F = q^2 / (4πε_0 r^2), [ε_0] = [A^2 T^2] / ([M L T^-2][L^2]) = [M^-1 L^-3 T^4 A^2]"),
            ("Permeability of free space (μ_0)", "I", "[M L T^-2 A^-2]", "From F/L = μ_0 I^2 / (2π d), [μ_0] = [M T^-2 A^-2][L] = [M L T^-2 A^-2]"),
            ("Magnetic flux (Φ_B)", "II", "[M L^2 T^-2 A^-1]", "Magnetic flux Φ = B A = [M T^-2 A^-1][L^2] = [M L^2 T^-2 A^-1]"),
            ("Self-inductance (L)", "III", "[M L^2 T^-2 A^-2]", "From ε = -L (di/dt), [L] = [ε] / [di/dt] = [M L^2 T^-3 A^-1] / [A T^-1] = [M L^2 T^-2 A^-2]")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match the electrical circuit combinations in List I with their dimensions and physical meanings in List II:",
        [
            ("Product of resistance and capacitance (R C)", "III", "[T] (Time constant of capacitive circuit)", "Dimensions of R = [M L^2 T^-3 A^-2] and C = [M^-1 L^-2 T^4 A^2], giving [R C] = [T]"),
            ("Inverse square root of product of L and C (1 / √(L C))", "I", "[T^-1] (Resonant angular frequency)", "Resonant angular frequency ω_0 = 1 / √(LC), with dimension [T^-1]"),
            ("Inverse square root of product of μ_0 and ε_0 (1 / √(μ_0 ε_0))", "IV", "[L T^-1] (Speed of electromagnetic waves)", "c = 1 / √(μ_0 ε_0) represents the speed of light in vacuum, dimension [L T^-1]"),
            ("Square root of ratio of L to C (√(L / C))", "II", "[M L^2 T^-3 A^-2] (Characteristic wave impedance)", "Characteristic impedance Z_0 = √(L/C), having dimensions of electrical resistance [M L^2 T^-3 A^-2]")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match the transport and material coefficients in List I with their SI derived units in List II:",
        [
            ("Coefficient of dynamic viscosity (η)", "II", "Pa·s (or N·s·m^-2)", "From F = η A (dv/dx), unit of η is N·m^-2 / (s^-1) = Pa·s"),
            ("Surface tension (T)", "IV", "N·m^-1 (or J·m^-2)", "Surface tension is force per unit length (N/m) or energy per unit area (J/m^2)"),
            ("Thermal conductivity (K)", "I", "W·m^-1·K^-1", "From dQ/dt = K A (ΔT/Δx), unit of K is W / (m · K) = W·m^-1·K^-1"),
            ("Coefficient of thermal expansion (α)", "III", "K^-1 (per Kelvin)", "From ΔL = L_0 α ΔT, unit of α is K^-1")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "A physical quantity Z is given by Z = (A^2 · B^(1/3)) / (C^3 · D^(1/2)). The percentage errors in A, B, C, and D are 1.0%, 3.0%, 2.0%, and 4.0% respectively. Match each error contribution in List I with its value in List II:",
        [
            ("Percentage error contribution from A (2 × ΔA/A)", "III", "2.0%", "Contribution from A is 2 × 1.0% = 2.0%"),
            ("Percentage error contribution from B ((1/3) × ΔB/B)", "I", "1.0%", "Contribution from B is (1/3) × 3.0% = 1.0%"),
            ("Percentage error contribution from C (3 × ΔC/C)", "IV", "6.0%", "Contribution from C is 3 × 2.0% = 6.0%"),
            ("Maximum total percentage error in Z (ΔZ/Z)", "II", "11.0%", "Total error = 2(1%) + (1/3)(3%) + 3(2%) + (1/2)(4%) = 2% + 1% + 6% + 2% = 11.0%")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the measuring instruments and their scale specifications in List I with their least count in List II:",
        [
            ("Vernier callipers: 1 MSD = 1 mm, 10 VSD = 9 MSD", "IV", "0.1 mm", "LC = 1 MSD - 1 VSD = 1 mm - 0.9 mm = 0.1 mm"),
            ("Vernier callipers: 1 MSD = 1 mm, 20 VSD = 19 MSD", "II", "0.05 mm", "LC = 1 MSD - 19/20 MSD = 1/20 mm = 0.05 mm"),
            ("Screw gauge: Pitch = 0.5 mm, 50 circular scale divisions", "I", "0.01 mm", "LC = Pitch / No. of circular divisions = 0.5 mm / 50 = 0.01 mm"),
            ("Spherometer: Pitch = 1.0 mm, 200 circular scale divisions", "III", "0.005 mm", "LC = Pitch / No. of circular divisions = 1.0 mm / 200 = 0.005 mm")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "The velocity v of a particle depends on time t according to the equation v = A t + B / (t + C) + D t^2. Match each constant in List I with its dimensional formula in List II:",
        [
            ("Constant A", "I", "[M^0 L T^-2]", "Dimensions of A t must equal [L T^-1], so [A] = [L T^-2]"),
            ("Constant B", "III", "[M^0 L T^0]", "Dimensions of B / [T] must equal [L T^-1], so [B] = [L]"),
            ("Constant C", "IV", "[M^0 L^0 T]", "In the term (t + C), C is added to time, so [C] = [T]"),
            ("Constant D", "II", "[M^0 L T^-3]", "Dimensions of D t^2 must equal [L T^-1], so [D] = [L T^-3]")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match the conversion of units from SI to CGS or other metric systems in List I with the correct conversion factor in List II:",
        [
            ("1 Joule in ergs", "II", "10^7 erg", "1 J = 1 kg·m^2·s^-2 = (10^3 g)(10^4 cm^2)·s^-2 = 10^7 erg"),
            ("1 Newton in dynes", "IV", "10^5 dyne", "1 N = 1 kg·m·s^-2 = (10^3 g)(10^2 cm)·s^-2 = 10^5 dyne"),
            ("1 Pascal in CGS pressure units (dyn/cm^2)", "I", "10 dyn/cm^2", "1 Pa = 1 N/m^2 = 10^5 dyn / 10^4 cm^2 = 10 dyn/cm^2"),
            ("1 kg/m^3 in CGS density units (g/cm^3)", "III", "10^-3 g/cm^3", "1 kg/m^3 = 10^3 g / 10^6 cm^3 = 10^-3 g/cm^3")
        ], "D"))

    # Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "If Planck's constant (h), the speed of light in vacuum (c), and the universal gravitational constant (G) are chosen as the base fundamental dimensions, match the Planck scale quantities in List I with their expressions in List II:",
        [
            ("Planck length (l_p)", "III", "√(h G / c^3)", "[l_p] = [h]^a [G]^b [c]^c gives a = 1/2, b = 1/2, c = -3/2, so l_p = √(h G / c^3)"),
            ("Planck time (t_p)", "I", "√(h G / c^5)", "t_p = l_p / c = √(h G / c^5)"),
            ("Planck mass (m_p)", "IV", "√(h c / G)", "[m_p] = [h]^a [G]^b [c]^c gives a = 1/2, b = -1/2, c = 1/2, so m_p = √(h c / G)"),
            ("Planck energy (E_p)", "II", "√(h c^5 / G)", "E_p = m_p c^2 = √(h c^5 / G)")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match the dimensionless combinations of fundamental constants in List I with their physical significance in List II:",
        [
            ("Fine structure constant (e^2 / (4πε_0 ħ c))", "IV", "~ 1/137 (Electromagnetic coupling strength)", "The fine structure constant α = e^2 / (4πε_0 ħ c) characterizes the strength of electromagnetic interaction, value ~ 1/137"),
            ("Gravitational coupling constant for protons (G m_p^2 / (ħ c))", "II", "~ 5.9 × 10^-39 (Strength of gravity vs quantum force)", "Characterizes the relative weakness of gravity between elementary particles, order 10^-39"),
            ("Reynolds number (ρ v D / η)", "I", "Ratio of inertial forces to viscous forces in fluid flow", "Dimensionless Reynolds number determines laminar vs turbulent flow regime"),
            ("Quality factor of an RLC circuit ((1/R) √(L/C))", "III", "2π × (Energy stored / Energy dissipated per cycle)", "Dimensionless Q factor characterizes resonator damping and sharpness of resonance")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "In experimental error analysis, match each physical relation in List I with the formula for its maximum fractional error in List II:",
        [
            ("Acceleration due to gravity: g = 4π^2 L / T^2", "II", "ΔL / L + 2(ΔT / T)", "Taking natural logarithm ln g = ln(4π^2) + ln L - 2 ln T, maximum relative error is ΔL/L + 2(ΔT/T)"),
            ("Density of a solid sphere: ρ = M / ((4/3) π R^3)", "IV", "ΔM / M + 3(ΔR / R)", "Taking ln ρ = ln M - ln(4π/3) - 3 ln R, maximum relative error is ΔM/M + 3(ΔR/R)"),
            ("Equivalent resistance in parallel: 1/R = 1/R_1 + 1/R_2", "I", "(R / R_1)^2 (ΔR_1 / R_1) + (R / R_2)^2 (ΔR_2 / R_2)", "Differentiating -dR/R^2 = -dR_1/R_1^2 - dR_2/R_2^2 gives ΔR/R = (R/R_1)(ΔR_1/R_1) + (R/R_2)(ΔR_2/R_2) = (R/R_1)^2 (ΔR_1/R_1) + (R/R_2)^2 (ΔR_2/R_2)"),
            ("Focal length of thin lens: 1/f = 1/v - 1/u", "III", "(f / v)^2 (Δv / v) + (f / u)^2 (Δu / u)", "Differentiating -df/f^2 = -dv/v^2 + du/u^2 gives max error Δf/f = (f/v)^2 (Δv/v) + (f/u)^2 (Δu/u)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match the electromagnetic field combinations in List I with their dimensions and physical descriptions in List II:",
        [
            ("Energy density of electromagnetic field (ε_0 E^2 / 2)", "III", "[M L^-1 T^-2] (Energy per unit volume / Pressure)", "Energy density has dimensions [Energy / Volume] = [M L^2 T^-2] / [L^3] = [M L^-1 T^-2]"),
            ("Poynting vector magnitude (|E × B| / μ_0)", "I", "[M L^0 T^-3] (Energy flux per unit area per second)", "Poynting vector represents power per unit area, [Power / Area] = [M L^2 T^-3] / [L^2] = [M T^-3]"),
            ("Free space characteristic wave impedance (√(μ_0 / ε_0))", "IV", "[M L^2 T^-3 A^-2] (Wave resistance ~ 377 Ω)", "√(μ_0 / ε_0) has the dimensions of electrical resistance: [M L^2 T^-3 A^-2]"),
            ("Magnetic dipole moment (M = I A)", "II", "[M^0 L^2 T^0 A] (Current × Area)", "Magnetic moment M = current × area = [A][L^2] = [L^2 A]")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Using dimensional analysis, match each oscillating or propagating physical system in List I with its dimensionally derived expression in List II:",
        [
            ("Time period T of liquid droplet oscillation (radius r, density ρ, surface tension S)", "II", "√(ρ r^3 / S)", "Setting T ∝ r^a ρ^b S^c gives dimensions [T] = [L]^a [M L^-3]^b [M T^-2]^c, solving gives a = 3/2, b = 1/2, c = -1/2"),
            ("Fundamental frequency ν of a stretched string (length L, linear density μ, tension T_s)", "IV", "(1 / L) √(T_s / μ)", "Frequency ν ∝ L^a μ^b T_s^c gives [T^-1] = [L]^a [M L^-1]^b [M L T^-2]^c, leading to (1/L) √(T_s / μ)"),
            ("Speed of longitudinal wave v in a solid rod (Young's modulus Y, density ρ)", "I", "√(Y / ρ)", "Dimensions [v] = [L T^-1], [Y] = [M L^-1 T^-2], [ρ] = [M L^-3] gives v = √(Y / ρ)"),
            ("Volume flow rate Q through a capillary tube (Poiseuille: radius r, length l, pressure ΔP, viscosity η)", "III", "ΔP r^4 / (η l)", "Dimensions of volume flow rate [L^3 T^-1] = [ΔP/l] [r^4] / [η] = ([M L^-2 T^-2][L^4]) / [M L^-1 T^-1] = [L^3 T^-1]")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "A screw gauge has a pitch of 0.5 mm and 50 divisions on its circular scale (least count = 0.01 mm). Match each measurement setting in List I with the true corrected thickness in List II:",
        [
            ("Main scale reading = 2.0 mm, circular scale reading = 30 divisions, zero error = 0 mm", "IV", "2.30 mm", "True reading = 2.0 mm + 30 × 0.01 mm - 0 = 2.30 mm"),
            ("Main scale reading = 2.0 mm, circular scale reading = 30 divisions, positive zero error = +0.05 mm", "II", "2.25 mm", "True reading = Observed (2.30 mm) - (+0.05 mm) = 2.25 mm"),
            ("Main scale reading = 2.0 mm, circular scale reading = 30 divisions, negative zero error = -0.04 mm", "I", "2.34 mm", "True reading = Observed (2.30 mm) - (-0.04 mm) = 2.34 mm"),
            ("Main scale reading = 1.5 mm, circular scale reading = 45 divisions, positive zero error = +0.02 mm", "III", "1.93 mm", "Observed reading = 1.5 + 45 × 0.01 = 1.95 mm; True reading = 1.95 - 0.02 = 1.93 mm")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match the dimensional quantities in List I with their Planck expressions formed by Planck's constant (h), gravitational constant (G), and speed of light (c) in List II:",
        [
            ("Mass dimension [M]", "I", "√(h c / G)", "[√(h c / G)] = [M L^2 T^-1 · L T^-1 / (M^-1 L^3 T^-2)]^(1/2) = [M^2]^(1/2) = [M]"),
            ("Length dimension [L]", "III", "√(h G / c^3)", "[√(h G / c^3)] = [M L^2 T^-1 · M^-1 L^3 T^-2 / (L^3 T^-3)]^(1/2) = [L^2]^(1/2) = [L]"),
            ("Time dimension [T]", "IV", "√(h G / c^5)", "[√(h G / c^5)] = [M L^2 T^-1 · M^-1 L^3 T^-2 / (L^5 T^-5)]^(1/2) = [T^2]^(1/2) = [T]"),
            ("Force dimension [M L T^-2]", "II", "c^4 / G", "[c^4 / G] = [L^4 T^-4] / [M^-1 L^3 T^-2] = [M L T^-2] (Planck force)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "The density of a solid metal cylinder of mass m, radius r, and length L is given by ρ = m / (π r^2 L). Given measured values m = (100.0 ± 0.1) g, r = (10.0 ± 0.1) mm, and L = (10.0 ± 0.1) cm. Match each error component in List I with its value in List II:",
        [
            ("Percentage error in mass (Δm / m × 100)", "II", "0.1%", "Δm/m = 0.1 / 100.0 = 0.001 = 0.1%"),
            ("Percentage error contribution from radius (2 × Δr / r × 100)", "IV", "2.0%", "Δr/r = 0.1 / 10.0 = 0.01 = 1.0%; contribution = 2 × 1.0% = 2.0%"),
            ("Percentage error contribution from length (ΔL / L × 100)", "I", "1.0%", "ΔL/L = 0.1 / 10.0 = 0.01 = 1.0%"),
            ("Maximum total percentage error in density (Δρ / ρ × 100)", "III", "3.1%", "Total percentage error = 0.1% + 2.0% + 1.0% = 3.1%")
        ], "D"))

    # ==========================================
    # TOPIC: Kinematics (20 questions)
    # ==========================================
    t = "Kinematics"
    prefix = "phy_mat_kin"

    # Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "A ball is dropped from rest from the top of a tower of height H = 80 m (take g = 10 m/s^2). Match the kinematic quantities in List I with their values in List II:",
        [
            ("Total time of flight to reach the ground", "III", "4 s", "H = (1/2) g t^2 gives t = √(2H / g) = √(160 / 10) = 4 s"),
            ("Speed just before striking the ground", "I", "40 m/s", "v = √(2 g H) = √(2 × 10 × 80) = 40 m/s"),
            ("Distance fallen during the 1st second", "IV", "5 m", "s_1 = (1/2) × 10 × 1^2 = 5 m"),
            ("Distance fallen during the 4th second", "II", "35 m", "s_n = (g / 2)(2n - 1) = 5(2×4 - 1) = 35 m")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "A car starts from rest at t = 0 and accelerates uniformly along a straight track with a = 2 m/s^2 for 10 s. Match each kinematic parameter in List I with its value in List II:",
        [
            ("Speed at t = 10 s", "IV", "20 m/s", "v = u + a t = 0 + 2 × 10 = 20 m/s"),
            ("Total distance traveled in 10 s", "II", "100 m", "s = u t + (1/2) a t^2 = 0 + (1/2) × 2 × 100 = 100 m"),
            ("Average speed over the first 10 s", "I", "10 m/s", "v_avg = Total distance / Total time = 100 m / 10 s = 10 m/s"),
            ("Distance covered during the 5th second", "III", "9 m", "s_5th = u + (a/2)(2n - 1) = 0 + (2/2)(2×5 - 1) = 9 m")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the 1D motion graph features in List I with their physical kinematic interpretations in List II:",
        [
            ("Slope of position-time (x-t) curve", "II", "Instantaneous velocity", "v = dx/dt, which is the slope of the position-time curve"),
            ("Slope of velocity-time (v-t) curve", "IV", "Instantaneous acceleration", "a = dv/dt, which is the slope of the velocity-time curve"),
            ("Area under velocity-time (v-t) curve", "I", "Displacement (change in position)", "Δx = ∫ v dt, which is the area under the v-t curve"),
            ("Area under acceleration-time (a-t) curve", "III", "Change in velocity", "Δv = ∫ a dt, which is the area under the a-t curve")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "A particle moves in a circular path of radius r = 2 m at a constant angular speed ω = 3 rad/s. Match each circular motion quantity in List I with its value in List II:",
        [
            ("Linear speed v", "III", "6 m/s", "Linear speed v = ω r = 3 × 2 = 6 m/s"),
            ("Centripetal (radial) acceleration a_c", "I", "18 m/s^2", "a_c = ω^2 r = (3)^2 × 2 = 18 m/s^2"),
            ("Time period of one revolution T", "IV", "2π/3 s", "T = 2π / ω = 2π / 3 s"),
            ("Tangential acceleration a_t", "II", "0 m/s^2", "Since angular speed is constant (dω/dt = 0), a_t = r α = 0 m/s^2")
        ], "D"))

    # Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "A projectile is launched from ground level with initial speed u = 50 m/s at an angle θ = 53° to the horizontal (sin 53° = 4/5, cos 53° = 3/5, g = 10 m/s^2). Match the trajectory parameters in List I with their values in List II:",
        [
            ("Total time of flight T", "II", "8 s", "T = 2 u sin θ / g = 2 × (50 × 4/5) / 10 = 80 / 10 = 8 s"),
            ("Maximum height reached H", "IV", "80 m", "H = (u sin θ)^2 / (2g) = 40^2 / 20 = 1600 / 20 = 80 m"),
            ("Horizontal range R", "I", "240 m", "R = (u cos θ) × T = 30 × 8 = 240 m"),
            ("Speed at the highest point of the trajectory", "III", "30 m/s", "At highest point v_y = 0, so v = u cos θ = 50 × (3/5) = 30 m/s")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match the projectile motion concepts and formulas in List I with their expressions in List II (launch speed u, angle θ, range R, max height H):",
        [
            ("Trajectory equation relating y, x, θ, and R", "IV", "y = x tan θ (1 - x / R)", "y = x tan θ - g x^2 / (2 u^2 cos^2 θ) = x tan θ (1 - x / R)"),
            ("Relation between launch angle θ, max height H, and range R", "I", "tan θ = 4H / R", "H = u^2 sin^2 θ / 2g, R = 2 u^2 sin θ cos θ / g gives H/R = tan θ / 4, so tan θ = 4H/R"),
            ("Maximum horizontal range (achieved at θ = 45°)", "II", "u^2 / g", "R_max = u^2 sin(90°) / g = u^2 / g"),
            ("Radius of curvature at the highest point of trajectory", "III", "u^2 cos^2 θ / g", "At apex, v = u cos θ and normal acceleration is g, so ρ = v^2 / a_n = u^2 cos^2 θ / g")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "A swimmer can swim with speed v_s = 5 km/h in still water. A river of width d = 1 km flows with a steady current v_r = 3 km/h. Match each crossing condition in List I with the resulting value in List II:",
        [
            ("Minimum time required to cross the river", "III", "12 min (0.2 h)", "Swims perpendicular to flow: t_min = d / v_s = 1 / 5 h = 0.2 h = 12 min"),
            ("Drift of swimmer when crossing in minimum time", "I", "600 m (0.6 km)", "Drift x = v_r × t_min = 3 km/h × 0.2 h = 0.6 km = 600 m"),
            ("Crossing angle with downstream direction for zero drift", "IV", "127° (or 37° upstream from normal)", "For zero drift, sin α = v_r / v_s = 3/5 -> α = 37° upstream from normal, so angle with flow is 90° + 37° = 127°"),
            ("Time taken to cross along the shortest path (zero drift)", "II", "15 min (0.25 h)", "Effective speed v_net = √(5^2 - 3^2) = 4 km/h; time t = 1 / 4 h = 0.25 h = 15 min")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Rain is falling vertically downwards at 20 m/s. A man walks horizontally along a straight road at 15 m/s. Match each relative velocity parameter in List I with its value in List II:",
        [
            ("Magnitude of relative velocity of rain with respect to the walking man", "II", "25 m/s", "v_rel = √((15)^2 + (20)^2) = √(225 + 400) = 25 m/s"),
            ("Angle with vertical at which man should hold his umbrella", "IV", "tan^-1(3/4) (~ 37°)", "tan θ = v_man / v_rain = 15 / 20 = 3/4, so θ = tan^-1(3/4)"),
            ("Magnitude of relative velocity of rain when man runs at 20 m/s", "I", "20√2 m/s (~ 28.3 m/s)", "v_rel = √((20)^2 + (20)^2) = 20√2 m/s"),
            ("Angle with vertical to hold umbrella when running at 20 m/s", "III", "45°", "tan θ = v_man / v_rain = 20 / 20 = 1, so θ = 45°")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "A stone is thrown horizontally from the top of a cliff of height H = 45 m with an initial speed u = 20 m/s (take g = 10 m/s^2). Match the kinematic quantities in List I with their values in List II:",
        [
            ("Time taken to strike the ground", "III", "3 s", "t = √(2H / g) = √(90 / 10) = 3 s"),
            ("Horizontal distance from the base of the cliff", "I", "60 m", "x = u × t = 20 × 3 = 60 m"),
            ("Vertical component of velocity at impact", "IV", "30 m/s", "v_y = g t = 10 × 3 = 30 m/s"),
            ("Resultant speed of the stone at impact", "II", "10√13 m/s (~ 36.1 m/s)", "v = √(u^2 + v_y^2) = √(20^2 + 30^2) = √(1300) = 10√13 m/s")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "A particle moves along the x-axis such that its position as a function of time is x(t) = 2 t^3 - 9 t^2 + 12 t (in SI units). Match the kinematic descriptions in List I with their values in List II:",
        [
            ("Times at which the particle is momentarily at rest", "IV", "t = 1 s and t = 2 s", "v(t) = 6 t^2 - 18 t + 12 = 6 (t - 1)(t - 2) = 0 at t = 1 s and t = 2 s"),
            ("Time at which the particle's acceleration is zero", "II", "t = 1.5 s", "a(t) = 12 t - 18 = 0 gives t = 18/12 = 1.5 s"),
            ("Total distance traveled by particle from t = 0 to t = 2 s", "I", "6 m", "x(0)=0, x(1)=5, x(2)=4. Distance = |5-0| + |4-5| = 5 + 1 = 6 m"),
            ("Displacement of particle from t = 0 to t = 2 s", "III", "4 m", "Displacement Δx = x(2) - x(0) = 4 - 0 = 4 m")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "A particle moves in a circular path of radius R = 4 m with its speed increasing uniformly as v(t) = 2 t (in m/s). Match the kinematic quantities at t = 2 s in List I with their values in List II:",
        [
            ("Tangential acceleration a_t", "I", "2 m/s^2", "a_t = dv/dt = 2 m/s^2"),
            ("Centripetal acceleration a_c at t = 2 s", "III", "4 m/s^2", "At t = 2 s, v = 4 m/s; a_c = v^2 / R = 16 / 4 = 4 m/s^2"),
            ("Magnitude of net acceleration at t = 2 s", "IV", "2√5 m/s^2 (~ 4.47 m/s^2)", "a_net = √(a_t^2 + a_c^2) = √(2^2 + 4^2) = √20 = 2√5 m/s^2"),
            ("Angular speed ω at t = 2 s", "II", "1 rad/s", "ω = v / R = 4 / 4 = 1 rad/s")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Two cars A and B are initially separated by 200 m on a straight road with Car A behind Car B. Car A moves with constant speed 30 m/s, while Car B starts from rest at t = 0 with constant acceleration 2 m/s^2. Match each relative motion event in List I with its value in List II:",
        [
            ("Time when Car A first catches up with Car B", "II", "10 s", "x_A = 30 t, x_B = 200 + t^2. Setting x_A = x_B gives t^2 - 30t + 200 = 0 -> (t-10)(t-20) = 0. First catch-up at t = 10 s"),
            ("Time when Car B overtakes Car A back", "IV", "20 s", "Second root of t^2 - 30t + 200 = 0 is t = 20 s"),
            ("Time when Car A reaches maximum lead over Car B", "I", "15 s", "Relative velocity v_A - v_B = 30 - 2t = 0 gives t = 15 s"),
            ("Maximum lead distance of Car A ahead of Car B", "III", "25 m", "At t = 15 s, x_A = 450 m and x_B = 200 + 225 = 425 m, so lead is 450 - 425 = 25 m")
        ], "D"))

    # Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A projectile is launched up an inclined plane of inclination angle β = 30° with an initial speed u = 40 m/s at an angle α = 60° with the horizontal (angle with incline θ = 30°). Take g = 10 m/s^2. Match the inclined plane projectile quantities in List I with their values in List II:",
        [
            ("Total time of flight on the inclined plane", "III", "8/√3 s", "T = 2 u sin(α - β) / (g cos β) = 2 × 40 × sin 30° / (10 cos 30°) = 40 / (5√3) = 8/√3 s"),
            ("Total range along the incline", "I", "320/3 m", "R = u_x T - (1/2) g sin β T^2 = (40 cos 30°)(8/√3) - 0.5(5)(64/3) = 160 - 160/3 = 320/3 m"),
            ("Time to reach maximum perpendicular height from incline", "IV", "4/√3 s", "t_apex = T / 2 = 4/√3 s"),
            ("Maximum perpendicular distance from the inclined plane", "II", "40/√3 m", "H_max = (u sin 30°)^2 / (2 g cos 30°) = 400 / (10√3) = 40/√3 m")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "For a projectile fired from the base of an incline of slope angle β at launch angle α with the horizontal, match each physical condition in List I with its formula in List II:",
        [
            ("Condition to strike the inclined plane perpendicularly", "IV", "cot β = 2 tan(α - β)", "At impact, v_x' = 0 -> u cos(α - β) - g sin β T = 0 with T = 2 u sin(α - β) / (g cos β), giving cot β = 2 tan(α - β)"),
            ("Launch angle α for maximum range up the incline", "II", "π/4 + β/2", "Maximum range up incline occurs when α = π/4 + β/2"),
            ("Launch angle α for maximum range down the incline", "I", "π/4 - β/2", "Maximum range down incline occurs when α = π/4 - β/2"),
            ("Maximum range achievable up an incline of angle β", "III", "u^2 / (g (1 + sin β))", "Substituting optimal angle into range gives R_max = u^2 / (g (1 + sin β))")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "For a projectile launched with speed u at angle θ to the horizontal, match each point along the trajectory in List I with its radius of curvature ρ in List II:",
        [
            ("At the initial point of launch", "II", "u^2 / (g cos θ)", "At launch, velocity is u, normal acceleration is g cos θ, so ρ = u^2 / (g cos θ)"),
            ("At the highest point (apex) of the trajectory", "IV", "u^2 cos^2 θ / g", "At apex, velocity is u cos θ, normal acceleration is g, so ρ = (u cos θ)^2 / g"),
            ("At any point where velocity makes angle α with horizontal", "I", "u^2 cos^2 θ / (g cos^3 α)", "At any point v cos α = u cos θ, normal acceleration is g cos α, so ρ = v^2 / (g cos α) = u^2 cos^2 θ / (g cos^3 α)"),
            ("For a horizontal projection from cliff at time t", "III", "(u^2 + g^2 t^2)^(3/2) / (g u)", "Speed v = √(u^2 + g^2 t^2), normal acceleration a_n = g u / v, so ρ = v^3 / (g u) = (u^2 + g^2 t^2)^(3/2) / (g u)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Three particles A, B, and C are located at the vertices of an equilateral triangle of side L = 60 m. Each starts moving at t = 0 with constant speed v = 10 m/s heading toward the next. Match the pursuit kinematic quantities in List I with their values in List II:",
        [
            ("Time taken for particles to meet at the centroid", "III", "4 s", "Approach speed between adjacent particles = v - (-v cos 60°) = v (1 + 1/2) = 1.5 v = 15 m/s. Time t = L / (1.5 v) = 60 / 15 = 4 s"),
            ("Total distance traveled by each particle before meeting", "I", "40 m", "Distance s = v × t = 10 m/s × 4 s = 40 m"),
            ("Initial distance of each particle from the centroid", "IV", "20√3 m", "Distance to centroid = L / √3 = 60 / √3 = 20√3 m"),
            ("Initial magnitude of relative velocity between any two particles", "II", "10√3 m/s", "Vector difference |v_A - v_B| = √(v^2 + v^2 - 2 v^2 cos 120°) = v√3 = 10√3 m/s")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "At t = 0, Ship B is 10 km East of Ship A. Ship A sails due East at constant speed 30 km/h, while Ship B sails due North at 40 km/h. Match each relative motion quantity in List I with its value in List II:",
        [
            ("Magnitude of relative velocity of Ship B relative to Ship A", "II", "50 km/h", "v_rel = v_B - v_A = -30 i + 40 j; |v_rel| = √(30^2 + 40^2) = 50 km/h"),
            ("Time elapsed until minimum distance of separation", "IV", "0.12 h (7.2 min)", "r_rel(t) = (10 - 30t) i + 40t j. Setting d/dt |r_rel|^2 = 0 gives 2(10 - 30t)(-30) + 2(40t)(40) = 0 -> 5000t = 600 -> t = 0.12 h"),
            ("Minimum distance of separation between the two ships", "I", "8 km", "At t = 0.12 h, Δx = 10 - 3.6 = 6.4 km and Δy = 4.8 km; d_min = √(6.4^2 + 4.8^2) = 8.0 km"),
            ("Distance sailed by Ship A up to closest approach", "III", "3.6 km", "Distance = v_A × t_min = 30 km/h × 0.12 h = 3.6 km")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "A particle of mass m = 1 kg moves along the x-axis under a position-dependent acceleration a(x) = 6 x - 4 (in m/s^2). It starts from rest at x = 2 m. Match each kinematic parameter in List I with its value in List II:",
        [
            ("Position where acceleration is zero", "IV", "x = 2/3 m", "a(x) = 6x - 4 = 0 gives x = 4/6 = 2/3 m"),
            ("Speed of the particle when it reaches x = 3 m", "II", "√22 m/s (~ 4.69 m/s)", "v dv/dx = 6x - 4 -> v^2 / 2 = 3x^2 - 4x + C. At x=2, v=0 -> C = -4. At x=3, v^2 = 2(3(9) - 12 - 4) = 22, so v = √22 m/s"),
            ("Acceleration of the particle at x = 3 m", "I", "14 m/s^2", "a(3) = 6(3) - 4 = 14 m/s^2"),
            ("Kinetic energy of the particle at x = 3 m", "III", "11 J", "KE = (1/2) m v^2 = (1/2)(1)(22) = 11 J")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "A particle moves in a circle of radius R = 1 m with initial speed v(0) = 1 m/s. Its tangential acceleration is maintained equal to its centripetal acceleration at every instant (a_t = a_c). Match each parameter in List I with its value in List II:",
        [
            ("Speed of the particle at t = 0.5 s", "I", "2 m/s", "dv/dt = v^2/R = v^2 -> -1/v = t - 1 -> v(t) = 1 / (1 - t). At t = 0.5 s, v = 1 / 0.5 = 2 m/s"),
            ("Net acceleration at t = 0.5 s", "III", "4√2 m/s^2", "At t = 0.5 s, a_t = a_c = v^2/R = 4 m/s^2, so a_net = √(4^2 + 4^2) = 4√2 m/s^2"),
            ("Distance traveled along the circle in time t = 0.5 s", "IV", "ln 2 m (~ 0.693 m)", "s = ∫_0^0.5 dt / (1 - t) = [-ln(1 - t)]_0^0.5 = -ln(0.5) = ln 2 m"),
            ("Time at which the speed becomes mathematically singular", "II", "1.0 s", "As t -> 1 s, denominator (1 - t) -> 0 and v(t) -> ∞, so singularity is at t = 1.0 s")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Two projectiles 1 and 2 are launched simultaneously from the origin. Projectile 1 has u_1 = 20 m/s at 60° to the horizontal, and projectile 2 has u_2 = 20√3 m/s at 30° to the horizontal (take g = 10 m/s^2). Match the relative kinematic quantities in List I with their values in List II:",
        [
            ("Relative acceleration between the two projectiles during flight", "II", "0 m/s^2", "Both experience the same downward acceleration g, so a_rel = g - g = 0 m/s^2"),
            ("Magnitude of relative velocity at any instant during flight", "IV", "20 m/s", "u_1 = (10 i + 10√3 j), u_2 = (30 i + 10√3 j). v_rel = u_2 - u_1 = 20 i m/s, magnitude = 20 m/s"),
            ("Separation distance between the two particles at t = 1 s", "I", "20 m", "Since relative acceleration is zero, separation d = v_rel × t = 20 × 1 = 20 m"),
            ("Distance between their landing points on the ground", "III", "40√3 m", "Both have vertical velocity 10√3 m/s, so flight time T = 2(10√3)/10 = 2√3 s. Landing separation = 20 × 2√3 = 40√3 m")
        ], "D"))

    # ==========================================
    # TOPIC: Laws of Motion (20 questions)
    # ==========================================
    t = "Laws of Motion"
    prefix = "phy_mat_lom"

    # Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "A person of mass m = 60 kg stands on a weighing machine inside an elevator (take g = 10 m/s^2). Match each elevator motion condition in List I with the scale reading (normal reaction N) in List II:",
        [
            ("Elevator accelerating upward at a = 2 m/s^2", "III", "720 N", "N = m(g + a) = 60(10 + 2) = 720 N"),
            ("Elevator accelerating downward at a = 2 m/s^2", "I", "480 N", "N = m(g - a) = 60(10 - 2) = 480 N"),
            ("Elevator moving upward with constant speed v = 5 m/s", "IV", "600 N", "When velocity is constant (a = 0), N = m g = 60 × 10 = 600 N"),
            ("Elevator cable snaps and falls freely under gravity", "II", "0 N (weightlessness)", "In free fall a = g downward, N = m(g - g) = 0 N")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "In an ideal Atwood machine, two masses m_1 = 3 kg and m_2 = 2 kg are connected over a light frictionless pulley (take g = 10 m/s^2). Match the dynamical quantities in List I with their values in List II:",
        [
            ("Common acceleration of the two blocks", "IV", "2 m/s^2", "a = (m_1 - m_2) g / (m_1 + m_2) = (3 - 2) × 10 / 5 = 2 m/s^2"),
            ("Tension in the connecting string", "II", "24 N", "T = 2 m_1 m_2 g / (m_1 + m_2) = 2 × 3 × 2 × 10 / 5 = 24 N"),
            ("Total downward force exerted by the string on the pulley", "I", "48 N", "Force on pulley support = 2 T = 2 × 24 = 48 N"),
            ("Magnitude of acceleration of the center of mass", "III", "0.4 m/s^2", "a_cm = ((m_1 - m_2)/(m_1 + m_2))^2 g = (1/5)^2 × 10 = 0.4 m/s^2")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the fundamental laws and principles of Newtonian mechanics in List I with their mathematical formulations in List II:",
        [
            ("Newton's Second Law for a variable mass system", "II", "F_ext = m (dv/dt) + v_rel (dm/dt)", "The general form of Newton's second law accounting for ejected or added mass with relative velocity v_rel"),
            ("Impulse-Momentum Theorem", "IV", "J = ∫ F dt = Δp", "Impulse J is the time integral of net force, equal to the change in linear momentum Δp"),
            ("Lami's Theorem for three concurrent forces in equilibrium", "I", "F_1 / sin α = F_2 / sin β = F_3 / sin γ", "For three coplanar concurrent forces in equilibrium, each force magnitude is proportional to the sine of the angle between the other two"),
            ("Newton's Third Law of Motion", "III", "F_12 = - F_21", "Action and reaction are equal in magnitude, opposite in direction, and act on different interacting bodies")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Three blocks of masses m_1 = 1 kg, m_2 = 2 kg, and m_3 = 3 kg are placed in contact on a frictionless horizontal floor. A horizontal force F = 12 N is applied to m_1 pushing the group towards m_3. Match the dynamical parameters in List I with their values in List II:",
        [
            ("Common acceleration of the three blocks", "III", "2 m/s^2", "a = F / (m_1 + m_2 + m_3) = 12 / (1 + 2 + 3) = 2 m/s^2"),
            ("Normal contact force between block 1 and block 2", "I", "10 N", "N_12 = (m_2 + m_3) a = (2 + 3) × 2 = 10 N"),
            ("Normal contact force between block 2 and block 3", "IV", "6 N", "N_23 = m_3 a = 3 × 2 = 6 N"),
            ("Net resultant horizontal force acting on block 2", "II", "4 N", "F_net2 = m_2 a = 2 × 2 = 4 N (or N_12 - N_23 = 10 - 6 = 4 N)")
        ], "D"))

    # Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "A simple pendulum of mass m is suspended from the roof of a car accelerating horizontally with constant acceleration a = g / √3. Match each equilibrium parameter relative to the car in List I with its value in List II:",
        [
            ("Deflection angle θ of the string from the vertical", "II", "30°", "tan θ = a / g = (g / √3) / g = 1 / √3, so θ = 30°"),
            ("Effective gravitational acceleration inside the car", "IV", "2g / √3", "g_eff = √(g^2 + a^2) = √(g^2 + g^2/3) = 2g / √3"),
            ("Tension in the pendulum string in equilibrium", "I", "2mg / √3", "T = m g_eff = 2 m g / √3"),
            ("Magnitude of horizontal pseudo-force on the bob", "III", "mg / √3", "F_pseudo = m a = m (g / √3) = mg / √3")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "A block of mass M = 4 kg sits on a smooth horizontal table connected via a light string over a frictionless pulley to a hanging mass m = 1 kg. Take g = 10 m/s^2. Match each dynamical quantity in List I with its value in List II:",
        [
            ("Acceleration of the system", "IV", "2 m/s^2", "a = m g / (M + m) = (1 × 10) / (4 + 1) = 2 m/s^2"),
            ("Tension in the connecting string", "I", "8 N", "T = M a = 4 × 2 = 8 N"),
            ("Net force exerted by the string on the pulley", "II", "8√2 N", "Force on pulley = √(T^2 + T^2) = T√2 = 8√2 N"),
            ("Speed of the blocks after moving 4 m from rest", "III", "4 m/s", "v = √(2 a s) = √(2 × 2 × 4) = 4 m/s")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "In a movable pulley arrangement, block A of mass m_A = 2 kg rests on a smooth table and is connected to a string that passes around a movable pulley supporting block B of mass m_B = 2 kg. Take g = 10 m/s^2. Match the dynamical quantities in List I with their values in List II:",
        [
            ("Acceleration of hanging block B", "III", "2 m/s^2", "String constraint gives a_A = 2 a_B. Dynamic equations: T = m_A a_A = 4 a_B; m_B g - 2T = m_B a_B -> 20 - 8 a_B = 2 a_B -> 10 a_B = 20 -> a_B = 2 m/s^2"),
            ("Acceleration of block A on the table", "I", "4 m/s^2", "a_A = 2 a_B = 2 × 2 = 4 m/s^2"),
            ("Tension in the connecting string", "IV", "8 N", "T = m_A a_A = 2 × 4 = 8 N"),
            ("Upward force exerted by string on the movable pulley", "II", "16 N", "Upward force = 2 T = 2 × 8 = 16 N")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "A conical pendulum consists of a bob of mass m = 2 kg attached to a light string of length L = 1 m swinging in a horizontal circle at angle θ = 60° to the vertical (take g = 10 m/s^2, cos 60° = 0.5, sin 60° = √3/2). Match the dynamical quantities in List I with their values in List II:",
        [
            ("Tension in the string", "II", "40 N", "T cos 60° = m g -> T × 0.5 = 20 -> T = 40 N"),
            ("Radius of the circular trajectory", "IV", "(√3/2) m", "r = L sin 60° = 1 × (√3/2) = √3/2 m"),
            ("Angular speed of revolution ω", "I", "2√5 rad/s", "ω = √(g / (L cos θ)) = √(10 / (1 × 0.5)) = √20 = 2√5 rad/s"),
            ("Centripetal force maintaining the circular orbit", "III", "20√3 N", "F_c = T sin 60° = 40 × (√3/2) = 20√3 N")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "A rocket of initial mass m_0 = 1000 kg ejects fuel gases at a constant exhaust speed u = 2000 m/s relative to the rocket (take g = 10 m/s^2). Match each condition in List I with its value in List II:",
        [
            ("Minimum rate of fuel consumption to just overcome initial weight", "III", "5 kg/s", "dm/dt = m_0 g / u = (1000 × 10) / 2000 = 5 kg/s"),
            ("Upward thrust force when fuel consumption rate is 10 kg/s", "I", "20000 N", "Thrust F = u (dm/dt) = 2000 × 10 = 20000 N"),
            ("Initial upward acceleration when fuel consumption rate is 10 kg/s", "IV", "10 m/s^2", "a = F_thrust / m_0 - g = 20000 / 1000 - 10 = 10 m/s^2"),
            ("Final speed in gravity-free space when mass reduces to m_0 / e", "II", "2000 m/s", "v = u ln(m_0 / m) = 2000 ln(e) = 2000 m/s")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Two blocks of masses m_1 = 4 kg and m_2 = 6 kg on a smooth horizontal floor are connected by a spring of stiffness k = 200 N/m. A constant horizontal force F = 20 N is applied pulling m_2 away from m_1. Match each dynamical quantity in List I with its value in List II:",
        [
            ("Acceleration of the center of mass of the system", "IV", "2 m/s^2", "a_cm = F / (m_1 + m_2) = 20 / 10 = 2 m/s^2"),
            ("Extension of the spring when both blocks have equal acceleration", "II", "4 cm (0.04 m)", "k x_eq = m_1 a_cm = 4 × 2 = 8 N -> x_eq = 8 / 200 = 0.04 m = 4 cm"),
            ("Maximum extension of the spring during the motion", "I", "8 cm (0.08 m)", "In center of mass frame, maximum elongation is 2 × x_eq = 2 × 4 cm = 8 cm"),
            ("Initial acceleration of block m_2 when force is first applied", "III", "10/3 m/s^2", "Initially spring force is zero, so a_2 = F / m_2 = 20 / 6 = 10/3 m/s^2")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "A system consists of two masses A (3 kg) and B (1 kg) connected by a light string over a pulley with a spring balance S in line with the string (take g = 10 m/s^2). Match each setup in List I with the scale reading in List II:",
        [
            ("Masses A and B hang freely on either side of the pulley (Atwood machine)", "I", "15 N", "T = 2 m_A m_B g / (m_A + m_B) = 2 × 3 × 1 × 10 / 4 = 15 N"),
            ("Mass A is on a smooth horizontal table and B hangs vertically", "III", "7.5 N", "a = m_B g / (m_A + m_B) = 10 / 4 = 2.5 m/s^2; T = m_A a = 3 × 2.5 = 7.5 N"),
            ("Pulley is accelerated vertically upward with force of 80 N", "IV", "40 N", "String tension on each side T = 80 / 2 = 40 N"),
            ("Mass A is held stationary at rest by applying an external downward pull on B", "II", "30 N", "For mass A (3 kg) to be in equilibrium, tension must balance its weight: T = m_A g = 30 N")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "A block of mass m = 2 kg is placed on a smooth wedge of inclination θ = 30°. The wedge is accelerated horizontally with acceleration a (take g = 10 m/s^2). Match each horizontal acceleration in List I with the normal reaction N between block and wedge in List II:",
        [
            ("a = 0 (stationary wedge)", "II", "10√3 N", "N = m g cos 30° = 2 × 10 × (√3/2) = 10√3 N"),
            ("a = 10/√3 m/s^2 (block remains stationary relative to wedge)", "IV", "40/√3 N", "At no relative slipping, N = m g / cos 30° = 20 / (√3/2) = 40/√3 N"),
            ("a = 10 m/s^2 to the right", "I", "10(√3 + 1) N", "N = m(g cos 30° + a sin 30°) = 2(10 × √3/2 + 10 × 0.5) = 10(√3 + 1) N"),
            ("a = 10√3 m/s^2 to the left (critical acceleration where block leaves wedge)", "III", "0 N", "N = m(g cos 30° - a sin 30°) = 2(5√3 - 10√3 × 0.5) = 0 N")
        ], "D"))

    # Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A smooth wedge of mass M = 3 kg with inclination angle θ = 45° is free to slide on a frictionless horizontal floor. A small block of mass m = 1 kg is released from rest on the incline (take g = 10 m/s^2). Match each kinematic/dynamic parameter in List I with its value in List II:",
        [
            ("Horizontal acceleration of the wedge", "III", "10/7 m/s^2", "A = (m g sin θ cos θ) / (M + m sin^2 θ) = (1 × 10 × 0.5) / (3 + 1 × 0.5) = 5 / 3.5 = 10/7 m/s^2"),
            ("Normal contact force between block and wedge", "I", "30√2/7 N", "N = M A / sin θ = 3 × (10/7) / (1/√2) = 30√2 / 7 N"),
            ("Vertical downward acceleration of the block", "IV", "40/7 m/s^2", "a_y = (M + m) g sin^2 θ / (M + m sin^2 θ) = 4 × 10 × 0.5 / 3.5 = 20 / 3.5 = 40/7 m/s^2"),
            ("Horizontal acceleration of the block relative to ground", "II", "30/7 m/s^2", "From momentum conservation, m a_x = M A -> a_x = 3 × (10/7) = 30/7 m/s^2")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Two blocks A (mass 2 kg) and B (mass 1 kg) are suspended in equilibrium by two vertical springs S_1 (upper) and S_2 (lower) (take g = 10 m/s^2). Match each cutting event in List I with the instantaneous acceleration of the specified block immediately after the cut in List II:",
        [
            ("Acceleration of block A immediately after lower spring S_2 is cut", "IV", "5 m/s^2 upward", "Upper spring tension is 30 N. Gravity on A is 20 N. Net force = 30 - 20 = 10 N up -> a_A = 10 / 2 = 5 m/s^2 upward"),
            ("Acceleration of block A immediately after upper spring S_1 is cut", "II", "15 m/s^2 downward", "Lower spring still exerts 10 N down on A. Gravity is 20 N down. Net force = 30 N down -> a_A = 30 / 2 = 15 m/s^2 downward"),
            ("Acceleration of block B immediately after lower spring S_2 is cut", "I", "10 m/s^2 downward", "Lower spring tension vanishes immediately; only gravity acts on B -> a_B = 10 m/s^2 downward"),
            ("Acceleration of block B immediately after upper spring S_1 is cut", "III", "0 m/s^2 (momentarily at rest)", "Lower spring tension is still 10 N upward, balancing B's weight (10 N downward) -> net force = 0 -> a_B = 0 m/s^2")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "A small bead of mass m is threaded on a smooth circular wire hoop of radius R in a vertical plane. The hoop rotates about its vertical diameter with constant angular velocity ω. Match each condition in List I with its value in List II:",
        [
            ("Critical angular velocity ω_c below which the bead can only rest at the bottom", "II", "√(g / R)", "For equilibrium at angle θ, cos θ = g / (ω^2 R). Real non-zero θ requires ω > √(g / R)"),
            ("Equilibrium angle θ from lowest point when ω = √(2g / R)", "IV", "60° (cos^-1(1/2))", "cos θ = g / (ω^2 R) = g / (2g) = 1/2 -> θ = 60°"),
            ("Equilibrium angle θ when ω = 2√(g / R)", "I", "cos^-1(1/4) (~ 75.5°)", "cos θ = g / (4g) = 1/4 -> θ = cos^-1(1/4)"),
            ("Normal reaction from the hoop at the equilibrium angle θ = 60°", "III", "2mg", "N = mg / cos θ = mg / 0.5 = 2mg")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "A small block of mass m slides inside a smooth vertical circular track of radius R. It is projected from the lowest point with speed u. Match each initial speed u in List I with the resulting motion in List II:",
        [
            ("u = √(2gR)", "III", "Oscillates in lower semicircle, comes to rest at θ = 90°", "Velocity becomes zero at the horizontal level (h = R) while normal force is non-zero, executing oscillation"),
            ("u = √(3gR)", "I", "Leaves the circular track between θ = 90° and 180°", "Normal reaction vanishes before velocity becomes zero in the upper semicircle, so the block behaves as a projectile"),
            ("u = √(5gR)", "IV", "Just completes the full vertical circle (N = 0 at the top)", "At the highest point, speed is √(gR) and normal force just reaches zero, completing full revolution"),
            ("u = √(6gR)", "II", "Completes vertical circle with minimum normal force N_top = mg", "At top, v_top^2 = u^2 - 4gR = 2gR. N_top = m v_top^2 / R - mg = 2mg - mg = mg")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "A uniform flexible rope of mass M and length L hangs vertically from a ceiling with a block of mass m attached to its bottom end. Match each physical parameter in List I with its formula in List II (y measured upward from bottom):",
        [
            ("Tension in the rope at height y from the bottom", "II", "(m + M y / L) g", "T(y) supports the mass m plus the weight of rope segment of length y: T = (m + M y / L) g"),
            ("Speed of transverse mechanical pulse at height y", "IV", "√((m + M y / L) g L / M)", "v = √(T / μ) where μ = M / L, giving v = √((m + M y/L) g L / M)"),
            ("Time for a pulse to travel the entire length L when m = 0", "I", "2 √(L / g)", "When m = 0, v(y) = √(g y); t = ∫_0^L dy / √(gy) = 2 √(L / g)"),
            ("Total downward force exerted by the system on the ceiling", "III", "(M + m) g", "The ceiling supports the entire mass of the rope plus the hanging block: (M + m) g")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "A flexible chain of length L = 2 m and linear mass density λ = 1.5 kg/m is held vertically with its lower end touching a table, then released from rest (take g = 10 m/s^2). Match each stage in List I with the total normal force on the table in List II:",
        [
            ("Total force on table when half the chain has fallen (x = 1.0 m)", "IV", "45 N", "Total force N = 3 λ g x = 3 × 1.5 × 10 × 1.0 = 45 N"),
            ("Total force on table just before the last link hits (x = 2.0 m)", "II", "90 N", "N = 3 λ g L = 3 × 1.5 × 10 × 2.0 = 90 N"),
            ("Total force on table when x = 0.5 m has fallen", "I", "22.5 N", "N = 3 λ g x = 3 × 1.5 × 10 × 0.5 = 22.5 N"),
            ("Final scale reading after the entire chain has settled at rest", "III", "30 N", "Static weight of entire chain = λ L g = 1.5 × 2.0 × 10 = 30 N")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "A uniform rigid rod of length L and mass M is held horizontally and pivoted smoothly at one end. Match each dynamical quantity immediately after release from rest in List I with its value in List II:",
        [
            ("Initial angular acceleration α about the hinge", "I", "3g / (2L)", "Torque τ = M g (L/2). Moment of inertia I = M L^2 / 3. α = τ / I = (M g L / 2) / (M L^2 / 3) = 3g / (2L)"),
            ("Initial vertical downward acceleration of the center of mass", "III", "3g / 4", "a_cm = α (L/2) = (3g / (2L)) × (L/2) = 3g / 4"),
            ("Vertical reaction force exerted by the hinge on the rod", "IV", "Mg / 4", "M g - N_y = M a_cm = 3 M g / 4 -> N_y = M g / 4"),
            ("Initial acceleration of the free end of the rod", "II", "3g / 2", "a_tip = α L = (3g / (2L)) × L = 3g / 2")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "A block of mass m = 5 kg rests on the floor of an elevator. The elevator accelerates upward with time-dependent acceleration a(t) = 2 t (in m/s^2). Take g = 10 m/s^2. Match each time instant in List I with the normal reaction N on the block in List II:",
        [
            ("Normal reaction at t = 0 s", "II", "50 N", "N = m(g + a(0)) = 5(10 + 0) = 50 N"),
            ("Normal reaction at t = 1 s", "IV", "60 N", "N = m(g + a(1)) = 5(10 + 2) = 60 N"),
            ("Normal reaction at t = 3 s", "I", "80 N", "N = m(g + a(3)) = 5(10 + 6) = 80 N"),
            ("Normal reaction at t = 5 s", "III", "100 N", "N = m(g + a(5)) = 5(10 + 10) = 100 N")
        ], "D"))

    # ==========================================
    # TOPIC: Friction (20 questions)
    # ==========================================
    t = "Friction"
    prefix = "phy_mat_fric"

    # Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "A block of mass m = 5 kg rests on a rough horizontal floor (μ_s = 0.4, μ_k = 0.3, g = 10 m/s^2). A horizontal force F is applied. Match each applied force in List I with the resulting friction force in List II:",
        [
            ("F = 10 N", "III", "10 N (static friction)", "Limiting static friction is f_s,max = 0.4 × 50 = 20 N. Since F = 10 N < 20 N, block is static and f = F = 10 N"),
            ("F = 18 N", "I", "18 N (static friction)", "F = 18 N < 20 N, block remains at rest and f = 18 N"),
            ("F = 20 N", "IV", "20 N (limiting static friction)", "F = 20 N reaches limiting friction, block is on verge of motion, f = 20 N"),
            ("F = 30 N", "II", "15 N (kinetic friction)", "F = 30 N > 20 N, block moves, so friction is kinetic: f_k = μ_k N = 0.3 × 50 = 15 N")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the friction definitions and relationships in List I with their descriptions in List II:",
        [
            ("Angle of friction λ", "IV", "tan^-1(μ_s), angle between total contact reaction and normal reaction", "By definition, tan λ = f_s,max / N = μ_s"),
            ("Angle of repose θ_r", "II", "Maximum incline angle at which a body rests without sliding down", "At angle of repose, mg sin θ = μ_s mg cos θ -> tan θ_r = μ_s"),
            ("Rolling friction", "I", "Much smaller than sliding friction, caused by surface deformation", "Rolling friction arises due to deformation of contact surfaces and has a much lower coefficient"),
            ("Coefficient of kinetic friction μ_k", "III", "Dimensionless ratio of kinetic friction to normal force, with μ_k < μ_s", "μ_k = f_k / N, generally less than static coefficient μ_s")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "A block of mass m = 2 kg is placed on an incline of angle θ = 30° with μ_s = 0.6 and μ_k = 0.5 (take g = 10 m/s^2). Match each parameter in List I with its value in List II:",
        [
            ("Normal reaction force on the block", "II", "10√3 N", "N = mg cos 30° = 2 × 10 × (√3/2) = 10√3 N"),
            ("Maximum available limiting friction force", "IV", "6√3 N (~ 10.39 N)", "f_s,max = μ_s N = 0.6 × 10√3 = 6√3 N"),
            ("Actual static friction force acting on the block", "I", "10 N", "Downhill gravity component = mg sin 30° = 2 × 10 × 0.5 = 10 N. Since 10 N < 6√3 N, block stays at rest and f = 10 N"),
            ("Acceleration of the block down the incline", "III", "0 m/s^2", "Since downhill gravity is less than limiting friction, the block does not slide: a = 0 m/s^2")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "A body of mass m = 10 kg is projected on a rough horizontal surface with initial speed u = 12 m/s (coefficient of kinetic friction μ_k = 0.3, g = 10 m/s^2). Match each kinematic parameter in List I with its value in List II:",
        [
            ("Deceleration of the body", "III", "3 m/s^2", "a = μ_k g = 0.3 × 10 = 3 m/s^2"),
            ("Time taken to come to a complete stop", "I", "4 s", "t = u / a = 12 / 3 = 4 s"),
            ("Stopping distance traveled", "IV", "24 m", "s = u^2 / (2a) = 144 / 6 = 24 m"),
            ("Total work done by friction on the body", "II", "-720 J", "W = ΔKE = 0 - (1/2)(10)(12)^2 = -720 J")
        ], "D"))

    # Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "A block of mass m = 10 kg rests on a rough floor with friction coefficient μ = 0.5 (take g = 10 m/s^2). Match each force direction in List I with the minimum magnitude required to just move the block in List II:",
        [
            ("Horizontal pulling force (θ = 0°)", "II", "50 N", "F = μ mg = 0.5 × 100 = 50 N"),
            ("Minimum pulling force at optimal angle θ = tan^-1(0.5)", "IV", "20√5 N (~ 44.7 N)", "F_min = μ mg / √(1 + μ^2) = 50 / √(1.25) = 100 / √5 = 20√5 N"),
            ("Pulling force required at angle θ = 45° above the horizontal", "I", "100√2/3 N (~ 47.1 N)", "F cos 45° = μ (mg - F sin 45°) -> F / √2 = 0.5(100 - F/√2) -> 1.5 F / √2 = 50 -> F = 100√2 / 3 N"),
            ("Pushing force required at angle θ = 45° below the horizontal", "III", "100√2 N (~ 141.4 N)", "F cos 45° = μ (mg + F sin 45°) -> F / √2 = 0.5(100 + F/√2) -> 0.5 F / √2 = 50 -> F = 100√2 N")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "A block of mass m = 4 kg is pressed against a vertical rough wall by applying a horizontal force F (μ_s = 0.5, μ_k = 0.4, g = 10 m/s^2). Match each scenario in List I with the resulting value in List II:",
        [
            ("Friction force when F = 100 N (block held stationary)", "IV", "40 N upward (static)", "Weight mg = 40 N. Limiting friction = 0.5 × 100 = 50 N. Since 40 N < 50 N, static friction = 40 N upward"),
            ("Friction force when F = 60 N (block slips downward)", "I", "24 N upward (kinetic)", "Limiting friction = 0.5 × 60 = 30 N < 40 N, so block slips. Kinetic friction = μ_k F = 0.4 × 60 = 24 N upward"),
            ("Friction force when F = 40 N (block slips downward)", "II", "16 N upward (kinetic)", "Kinetic friction = μ_k F = 0.4 × 40 = 16 N upward"),
            ("Minimum horizontal force required to prevent block from slipping", "III", "80 N", "μ_s F ≥ mg -> 0.5 F = 40 -> F = 80 N")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "A block of mass m = 5 kg is on an inclined plane of angle θ = 37° (sin 37° = 0.6, cos 37° = 0.8) with friction coefficient μ = 0.5 (take g = 10 m/s^2). Match each force applied along the incline in List I with the description/value in List II:",
        [
            ("Minimum upward force along incline to prevent block from sliding down", "III", "10 N", "mg sin 37° = 30 N, f_max = μ mg cos 37° = 0.5 × 40 = 20 N. F_min = 30 - 20 = 10 N"),
            ("Minimum upward force along incline to start moving block upward", "I", "50 N", "F_up = mg sin 37° + f_max = 30 + 20 = 50 N"),
            ("Friction force acting on block when an upward force of 30 N is applied", "IV", "0 N", "Applied force exactly balances gravity downhill component (30 N), so friction is 0 N"),
            ("Acceleration down the incline when no external force is applied", "II", "2 m/s^2", "Net force = 30 - 20 = 10 N down incline; a = 10 / 5 = 2 m/s^2")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Two blocks A (mass 2 kg) and B (mass 4 kg) are stacked with A on top of B on a frictionless horizontal floor. The coefficient of friction between A and B is μ = 0.3 (take g = 10 m/s^2). Match each applied force case in List I with its value in List II:",
        [
            ("Maximum acceleration without slipping when force is applied to block A", "II", "1.5 m/s^2", "f_max = μ m_A g = 0.3 × 20 = 6 N. Max acceleration of B is a_max = f_max / m_B = 6 / 4 = 1.5 m/s^2"),
            ("Maximum horizontal force applied to block A for both to move together", "IV", "9 N", "F_max,A = (m_A + m_B) a_max = (2 + 4) × 1.5 = 9 N"),
            ("Maximum acceleration without slipping when force is applied to block B", "I", "3 m/s^2", "Max acceleration of A is a_max = f_max / m_A = 6 / 2 = 3 m/s^2"),
            ("Maximum horizontal force applied to block B for both to move together", "III", "18 N", "F_max,B = (m_A + m_B) a_max = 6 × 3 = 18 N")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "A coin of mass m is placed on a horizontal turntable at a distance r from the central rotation axis with coefficient of static friction μ. Match each condition in List I with its formula/value in List II:",
        [
            ("Maximum angular speed ω_max without slipping at radius r", "III", "√(μ g / r)", "Centripetal force m ω^2 r ≤ μ m g -> ω_max = √(μ g / r)"),
            ("Maximum radial distance r_max for a given angular speed ω", "I", "μ g / ω^2", "r ≤ μ g / ω^2"),
            ("Factor by which ω_max changes if radius r is doubled", "IV", "1/√2 (~ 0.707)", "ω_max ∝ 1/√r, so doubling r scales ω_max by 1/√2"),
            ("Static friction force when rotating at half of maximum speed (ω = ω_max / 2)", "II", "μ mg / 4", "f = m ω^2 r = m (ω_max/2)^2 r = (1/4) m ω_max^2 r = μ mg / 4")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "A car of mass 1000 kg travels on a circular curve of radius R = 50 m (take g = 10 m/s^2). Match each speed or friction quantity in List I with its value in List II:",
        [
            ("Maximum speed on an unbanked flat road with μ_s = 0.5 without skidding", "IV", "5√10 m/s (~ 15.8 m/s)", "v_max = √(μ_s g R) = √(0.5 × 10 × 50) = √250 = 5√10 m/s"),
            ("Optimum speed on a road banked at 45° where zero friction is required", "II", "10√5 m/s (~ 22.4 m/s)", "v_banked = √(g R tan 45°) = √(10 × 50 × 1) = √500 = 10√5 m/s"),
            ("Friction force on the flat road when traveling at v = 10 m/s", "I", "2000 N", "f = m v^2 / R = 1000 × 100 / 50 = 2000 N"),
            ("Maximum available limiting friction force on the flat road (μ_s = 0.5)", "III", "5000 N", "f_max = μ_s m g = 0.5 × 1000 × 10 = 5000 N")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "A block is projected up a rough incline of angle θ with initial speed u (coefficient of kinetic friction μ, with tan θ > μ). Match each kinematic quantity in List I with its formula in List II:",
        [
            ("Retardation during upward motion (a_up)", "I", "g (sin θ + μ cos θ)", "Both gravity component and friction oppose upward motion: a_up = g(sin θ + μ cos θ)"),
            ("Acceleration during downward return motion (a_down)", "III", "g (sin θ - μ cos θ)", "Gravity pulls down while friction opposes downward motion: a_down = g(sin θ - μ cos θ)"),
            ("Ratio of time of descent to time of ascent (t_down / t_up)", "IV", "√((sin θ + μ cos θ) / (sin θ - μ cos θ))", "Since s = (1/2) a t^2, t ∝ 1/√a, so t_down / t_up = √(a_up / a_down)"),
            ("Speed of the block upon returning to the launch point", "II", "u √((sin θ - μ cos θ) / (sin θ + μ cos θ))", "v^2 = 2 a_down s and u^2 = 2 a_up s gives v = u √(a_down / a_up)")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "A conveyor belt moves horizontally at constant speed v = 4 m/s. A package of mass m = 2 kg is placed gently on it with zero initial velocity (μ_k = 0.2, g = 10 m/s^2). Match the physical quantities in List I with their values in List II:",
        [
            ("Time duration during which the package slips on the belt", "II", "2 s", "Acceleration a = μ_k g = 0.2 × 10 = 2 m/s^2. Time to match belt speed t = v / a = 4 / 2 = 2 s"),
            ("Distance traveled by the package relative to ground during slipping", "IV", "4 m", "s_pkg = v^2 / (2a) = 16 / 4 = 4 m"),
            ("Work done by the motor driving the conveyor belt during slipping", "I", "32 J", "Belt moves distance s_belt = v t = 4 × 2 = 8 m. Work done = f_k × s_belt = (0.2 × 20) × 8 = 4 × 8 = 32 J"),
            ("Kinetic energy gained by the package", "III", "16 J", "KE = (1/2) m v^2 = (1/2)(2)(16) = 16 J (the other 16 J dissipates as heat)")
        ], "D"))

    # Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Block A (mass 2 kg) rests on Block B (mass 3 kg), which rests on a rough horizontal floor (μ_1 = 0.4 between A and B, μ_2 = 0.2 with floor, g = 10 m/s^2). A horizontal force F is applied to lower block B. Match the applied force F in List I with the resulting accelerations in List II:",
        [
            ("F = 8 N applied to block B", "III", "a_A = 0 m/s^2, a_B = 0 m/s^2 (system at rest)", "Limiting friction with floor = 0.2 × (2 + 3) × 10 = 10 N. Since F = 8 N < 10 N, system remains at rest"),
            ("F = 20 N applied to block B", "I", "a_A = 2 m/s^2, a_B = 2 m/s^2 (moving together)", "Limiting friction between A and B is 0.4 × 20 = 8 N, allowing max acceleration of A = 4 m/s^2. For F = 20 N, common acceleration is (20 - 10)/5 = 2 m/s^2 < 4 m/s^2, so they move together"),
            ("F = 30 N applied to block B", "IV", "a_A = 4 m/s^2, a_B = 4 m/s^2 (verge of relative slipping)", "Common acceleration = (30 - 10)/5 = 4 m/s^2, exactly the maximum acceleration A can sustain without slipping"),
            ("F = 42 N applied to block B", "II", "a_A = 4 m/s^2, a_B = 8 m/s^2 (relative slipping occurs)", "Since F > 30 N, relative slipping occurs. Friction on A is 8 N -> a_A = 8/2 = 4 m/s^2. Net force on B = 42 - 8 - 10 = 24 N -> a_B = 24/3 = 8 m/s^2")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "In the same system (m_A = 2 kg on m_B = 3 kg on rough floor with μ_1 = 0.4 between blocks, μ_2 = 0.2 with floor, g = 10 m/s^2), a horizontal force F is now applied to top block A. Match each applied force in List I with the outcome in List II:",
        [
            ("F = 6 N applied to block A", "IV", "Both blocks remain at rest (a_A = 0, a_B = 0)", "Limiting friction between A and B is 8 N. Since F = 6 N < 8 N, A does not slip on B, and max force on floor (6 N) < 10 N, so neither moves"),
            ("F = 16 N applied to block A", "II", "Block A accelerates at 4 m/s^2 while block B remains at rest", "F > 8 N, so A slips. Friction on A is 8 N -> a_A = (16 - 8)/2 = 4 m/s^2. Force transmitted to B is 8 N < 10 N (floor friction), so B remains at rest"),
            ("F = 24 N applied to block A", "I", "Block A accelerates at 8 m/s^2 while block B remains at rest", "A slips with 8 N friction -> a_A = (24 - 8)/2 = 8 m/s^2. Force transmitted to B is still 8 N < 10 N, so B remains at rest"),
            ("Minimum force on block A required to cause motion of block B", "III", "Impossible (Block B will never move)", "The maximum friction force that A can exert on B is 8 N, which is strictly less than the 10 N needed to overcome floor friction")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "A block of mass m is placed on a rough wedge of inclination angle θ = 45° with coefficient of static friction μ = 0.5. The wedge is accelerated horizontally with acceleration a (take g = 10 m/s^2). Match each condition in List I with its value in List II:",
        [
            ("Minimum horizontal acceleration to prevent slipping down", "II", "10/3 m/s^2", "a_min = g (sin 45° - μ cos 45°) / (cos 45° + μ sin 45°) = 10 (1 - 0.5) / (1 + 0.5) = 10 / 3 m/s^2"),
            ("Maximum horizontal acceleration before block slips up the incline", "IV", "30 m/s^2", "a_max = g (sin 45° + μ cos 45°) / (cos 45° - μ sin 45°) = 10 (1 + 0.5) / (1 - 0.5) = 30 m/s^2"),
            ("Horizontal acceleration at which friction force is strictly zero", "I", "10 m/s^2", "Zero friction requires a_0 = g tan 45° = 10 × 1 = 10 m/s^2"),
            ("Normal reaction on the block when a = 10 m/s^2", "III", "10√2 m N (or √2 mg)", "N = m (g cos 45° + a sin 45°) = m (10/√2 + 10/√2) = 10√2 m N")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "A heavy cable is wrapped around a rough fixed horizontal cylinder by total contact angle θ with friction coefficient μ. Match each configuration in List I with the tension ratio T_2 / T_1 in List II (Capstan equation):",
        [
            ("Wrapped by half a turn (θ = π rad) with μ = 0.2", "III", "e^(0.2π) (~ 1.87)", "T_2 / T_1 = e^(μ θ) = e^(0.2 × π) ≈ 1.87"),
            ("Wrapped by one full turn (θ = 2π rad) with μ = 0.2", "I", "e^(0.4π) (~ 3.51)", "T_2 / T_1 = e^(0.2 × 2π) = e^(0.4π) ≈ 3.51"),
            ("Wrapped by two full turns (θ = 4π rad) with μ = 0.2", "IV", "e^(0.8π) (~ 12.34)", "T_2 / T_1 = e^(0.2 × 4π) = e^(0.8π) ≈ 12.34"),
            ("General Capstan formula for tension amplification ratio", "II", "e^(μ θ)", "Integration of dT / T = μ dθ yields the exponential tension ratio e^(μ θ)")
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "An insect of mass m = 0.1 kg crawls slowly up the inside of a rough hemispherical bowl of radius R = 1 m with friction coefficient μ = 0.75 (take g = 10 m/s^2). Match each parameter in List I with its value in List II:",
        [
            ("Maximum angle θ from the lowest point the insect can reach", "II", "tan^-1(0.75) (~ 37°)", "At limiting equilibrium, mg sin θ = μ mg cos θ -> tan θ = μ = 0.75 = 3/4"),
            ("Maximum vertical height reached above the bottom of the bowl", "IV", "0.2 m (20 cm)", "h = R (1 - cos θ) = 1 × (1 - 4/5) = 0.2 m"),
            ("Maximum horizontal distance from the vertical axis of symmetry", "I", "0.6 m (60 cm)", "r = R sin θ = 1 × (3/5) = 0.6 m"),
            ("Normal force exerted by the bowl on the insect at the highest point", "III", "0.8 N", "N = mg cos θ = (0.1 × 10) × (4/5) = 0.8 N")
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "A rotor of radius R = 2 m spins about its vertical axis. A person of mass m = 50 kg leans against the rough inner wall with static friction coefficient μ_s = 0.5 (take g = 10 m/s^2). Match each parameter in List I with its value in List II:",
        [
            ("Minimum angular velocity ω_min to prevent slipping down", "IV", "√10 rad/s (~ 3.16 rad/s)", "μ_s (m ω^2 R) ≥ mg -> ω ≥ √(g / (μ_s R)) = √(10 / (0.5 × 2)) = √10 rad/s"),
            ("Minimum normal reaction required from the wall", "II", "1000 N", "N_min = mg / μ_s = (50 × 10) / 0.5 = 1000 N"),
            ("Actual vertical friction force when spinning at ω = 2√10 rad/s", "I", "500 N", "In static equilibrium the vertical friction force simply balances the weight: f = mg = 500 N"),
            ("Normal reaction force on the person when spinning at ω = 2√10 rad/s", "III", "4000 N", "N = m ω^2 R = 50 × (40) × 2 = 4000 N")
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "A uniform horizontal rod of mass M = 3 kg and length L = 1 m rests symmetrically on two counter-rotating rough rollers separated by 2d = 0.6 m (d = 0.3 m). Both rollers have kinetic friction coefficient μ = 0.4 (take g = 10 m/s^2). Match each oscillation parameter in List I with its value in List II:",
        [
            ("Effective restoring force constant k_eff", "I", "40 N/m", "Restoring force F = μ M g x / d -> k_eff = μ M g / d = (0.4 × 30) / 0.3 = 40 N/m"),
            ("Restoring force on the rod when displaced by x = 5 cm (0.05 m)", "III", "2 N", "F = k_eff x = 40 × 0.05 = 2.0 N"),
            ("Angular frequency ω_0 of resulting harmonic oscillations", "IV", "2√(10/3) rad/s (~ 3.65 rad/s)", "ω_0 = √(k_eff / M) = √(40 / 3) = 2√(10/3) rad/s"),
            ("Time period of the horizontal simple harmonic oscillations", "II", "π√(3/10) s (~ 1.72 s)", "T = 2π / ω_0 = 2π √(3/40) = π √(3/10) s")
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "A block of mass m is projected with initial speed u = 6 m/s on a rough horizontal floor where the coefficient of friction varies as μ(x) = 0.2 x (take g = 10 m/s^2). Match each kinematic/dynamic parameter in List I with its value in List II:",
        [
            ("Maximum distance traveled by the block before stopping", "II", "3√2 m (~ 4.24 m)", "v dv/dx = -μ(x) g = -2x -> v^2 = u^2 - 2x^2 = 36 - 2x^2. Setting v = 0 gives x = √18 = 3√2 m"),
            ("Speed of the block when it reaches x = 4 m", "IV", "2 m/s", "v = √(36 - 2(16)) = √4 = 2 m/s"),
            ("Maximum deceleration experienced by the block", "I", "6√2 m/s^2", "Max deceleration occurs at the stopping point: a_max = 2 x_max = 2 × 3√2 = 6√2 m/s^2"),
            ("Friction force on a 2 kg block at the stopping point", "III", "12√2 N", "f = m a_max = 2 × 6√2 = 12√2 N")
        ], "D"))

    return qs
