"""
Group 4: Thermodynamics, Kinetic Theory of Gases, Simple Harmonic Motion, Waves
Matrix Match Questions for JEE Main & Advanced
"""
from builder import make_matrix_q

def get_questions() -> list:
    qs = []

    # ==========================================
    # TOPIC: Thermodynamics (20 questions)
    # ==========================================
    prefix = "phy_thermo"

    # Q01 (beginner, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_01",
        "Thermodynamics",
        "beginner",
        'Match the thermodynamic process of an ideal gas in List I with its defining characteristic property in List II:',
        [
            ('Isothermal process', 'III', 'ΔT = 0, ΔU = 0 for ideal gas, and heat exchange Q = W', 'In an isothermal process of an ideal gas, temperature remains constant (ΔT = 0), so internal energy change ΔU = n Cv ΔT = 0. By First Law, Q = ΔU + W = W.'),
            ('Adiabatic process', 'I', 'ΔQ = 0, and work done W = -ΔU', 'In an adiabatic process, there is no heat exchange with surroundings (ΔQ = 0). By First Law, 0 = ΔU + W, giving W = -ΔU.'),
            ('Isochoric process', 'IV', 'ΔV = 0, work done W = 0, and ΔQ = ΔU = n Cv ΔT', 'In an isochoric process, volume is held constant (ΔV = 0), so boundary work W = ∫ P dV = 0. Therefore ΔQ = ΔU = n Cv ΔT.'),
            ('Isobaric process', 'II', 'ΔP = 0, work done W = PΔV = n R ΔT, and ΔQ = n Cp ΔT', 'In an isobaric process, pressure remains constant (ΔP = 0). The work done is W = P ΔV = n R ΔT, and heat added is ΔQ = n Cp ΔT.'),
        ],
        "A"
    ))

    # Q02 (beginner, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_02",
        "Thermodynamics",
        "beginner",
        'For one mole of an ideal gas, match the gas type in List I with the correct ratio of specific heats γ = Cp/Cv in List II:',
        [
            ('Monoatomic gas (e.g., He, Ne)', 'II', 'γ = 5/3 ≈ 1.67', 'For a monoatomic gas, degrees of freedom f = 3. Cv = 3R/2, Cp = 5R/2, giving γ = Cp/Cv = 5/3 ≈ 1.67.'),
            ('Rigid diatomic gas (e.g., O2, N2 at 300 K)', 'IV', 'γ = 7/5 = 1.40', 'For a rigid diatomic gas, f = 5 (3 trans + 2 rot). Cv = 5R/2, Cp = 7R/2, giving γ = 7/5 = 1.40.'),
            ('Non-linear polyatomic gas (rigid, e.g., H2O vapor)', 'I', 'γ = 4/3 ≈ 1.33', 'For a non-linear rigid polyatomic gas, f = 6 (3 trans + 3 rot). Cv = 3R, Cp = 4R, giving γ = 4/3 ≈ 1.33.'),
            ('Diatomic gas with one active vibrational mode (high T)', 'III', 'γ = 9/7 ≈ 1.29', 'With one vibrational mode, f = 3 + 2 + 2 = 7. Cv = 7R/2, Cp = 9R/2, giving γ = 9/7 ≈ 1.29.'),
        ],
        "B"
    ))

    # Q03 (beginner, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_03",
        "Thermodynamics",
        "beginner",
        'One mole of a monoatomic ideal gas initially at state (P0, V0, T0) expands to volume 2V0. Match the process in List I with the work done by the gas in List II:',
        [
            ('Isobaric expansion to 2V0', 'IV', 'W = P0 V0 = R T0', 'For isobaric expansion at P0, W = P0 (2V0 - V0) = P0 V0 = R T0.'),
            ('Isothermal expansion to 2V0', 'II', 'W = R T0 ln 2 ≈ 0.693 R T0', 'For isothermal expansion at T0, W = n R T0 ln(V2/V1) = R T0 ln 2 ≈ 0.693 R T0.'),
            ('Adiabatic expansion to 2V0 (γ = 5/3)', 'I', 'W = 1.5 P0 V0 [1 - 2^(-2/3)] ≈ 0.555 R T0', 'For adiabatic expansion, W = (P0 V0 - P2 V2)/(γ - 1) = (R T0 / (2/3)) [1 - (V0/2V0)^(γ-1)] = 1.5 R T0 [1 - 2^(-2/3)] ≈ 0.555 R T0.'),
            ('Isochoric heating at V0 from P0 to 2P0', 'III', 'W = 0', 'In an isochoric process, volume does not change (dV = 0), so work done W = 0.'),
        ],
        "C"
    ))

    # Q04 (beginner, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_04",
        "Thermodynamics",
        "beginner",
        'Match the heat engine operating between reservoir temperatures (T_high, T_low) in List I with its maximum theoretical Carnot efficiency η in List II:',
        [
            ('T_high = 600 K, T_low = 300 K', 'I', 'η = 50.0%', 'Carnot efficiency is η = 1 - T_low / T_high = 1 - 300/600 = 0.50 or 50%.'),
            ('T_high = 500 K, T_low = 375 K', 'III', 'η = 25.0%', 'Carnot efficiency is η = 1 - 375/500 = 1 - 0.75 = 0.25 or 25%.'),
            ('T_high = 800 K, T_low = 200 K', 'IV', 'η = 75.0%', 'Carnot efficiency is η = 1 - 200/800 = 1 - 0.25 = 0.75 or 75%.'),
            ('T_high = 500 K, T_low = 400 K', 'II', 'η = 20.0%', 'Carnot efficiency is η = 1 - 400/500 = 1 - 0.80 = 0.20 or 20%.'),
        ],
        "D"
    ))

    # Q05 (intermediate, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_05",
        "Thermodynamics",
        "intermediate",
        'A cyclic process ABCA of an ideal gas is depicted on a P-V diagram where A is (P0, V0), B is (P0, 3V0), and C is (2P0, 3V0). Path CA is a straight line. Match the process stage in List I with the work done in List II:',
        [
            ('Work done along path AB', 'III', 'W_AB = 2 P0 V0', 'Path AB is isobaric at P0: W_AB = P0 (3V0 - V0) = 2 P0 V0.'),
            ('Work done along path BC', 'I', 'W_BC = 0', 'Path BC is isochoric at volume 3V0 (dV = 0): W_BC = 0.'),
            ('Work done along path CA', 'IV', 'W_CA = -3 P0 V0', 'Path CA is a straight line from (2P0, 3V0) to (P0, V0). Area under CA is a trapezium: W_CA = - (1/2)(2P0 + P0)(3V0 - V0) = - (1/2)(3P0)(2V0) = -3 P0 V0.'),
            ('Net work done in the complete cycle ABCA', 'II', 'W_net = - P0 V0', 'Net work is the sum W_AB + W_BC + W_CA = 2 P0 V0 + 0 - 3 P0 V0 = - P0 V0 (counter-clockwise cycle).'),
        ],
        "A"
    ))

    # Q06 (intermediate, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_06",
        "Thermodynamics",
        "intermediate",
        'One mole of a monoatomic ideal gas (Cv = 1.5 R) undergoes a polytropic process PV^n = constant. Match the polytropic index n in List I with the molar heat capacity C = Cv + R/(1 - n) in List II:',
        [
            ('n = 0 (isobaric)', 'II', 'C = 2.5 R', 'For n = 0, C = 1.5 R + R / (1 - 0) = 2.5 R = Cp.'),
            ('n = 2', 'IV', 'C = 0.5 R', 'For n = 2, C = 1.5 R + R / (1 - 2) = 1.5 R - R = 0.5 R.'),
            ('n = -1 (P ∝ V)', 'I', 'C = 2.0 R', 'For n = -1, C = 1.5 R + R / (1 - (-1)) = 1.5 R + 0.5 R = 2.0 R.'),
            ('n = 3', 'III', 'C = 1.0 R', 'For n = 3, C = 1.5 R + R / (1 - 3) = 1.5 R - 0.5 R = 1.0 R.'),
        ],
        "B"
    ))

    # Q07 (intermediate, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_07",
        "Thermodynamics",
        "intermediate",
        'A Carnot engine works with an ideal gas undergoing a reversible 4-stroke cycle ABCD. Match each stroke in List I with its physical description in List II:',
        [
            ('Stroke A → B', 'I', 'Reversible isothermal expansion at T_H with heat absorption Q_H', 'Stroke A→B is isothermal expansion at constant high temperature T_H, absorbing heat Q_H from the heat source.'),
            ('Stroke B → C', 'III', 'Reversible adiabatic expansion with temperature dropping from T_H to T_C', 'Stroke B→C is adiabatic expansion (Q = 0) where the working gas does work at the expense of internal energy, dropping from T_H to T_C.'),
            ('Stroke C → D', 'II', 'Reversible isothermal compression at T_C with heat rejection Q_C', 'Stroke C→D is isothermal compression at constant low temperature T_C, rejecting heat Q_C to the cold reservoir.'),
            ('Stroke D → A', 'IV', 'Reversible adiabatic compression with temperature rising from T_C to T_H', 'Stroke D→A is adiabatic compression (Q = 0) restoring the gas to its initial state A while temperature rises from T_C to T_H.'),
        ],
        "C"
    ))

    # Q08 (intermediate, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_08",
        "Thermodynamics",
        "intermediate",
        'Match the heat engine / refrigerator formula in List I with its exact thermodynamic definition in List II:',
        [
            ('Thermal efficiency η of a heat engine', 'IV', 'η = W / Q_H = 1 - Q_C / Q_H', 'Efficiency is the ratio of network output W to heat absorbed from high-temperature reservoir Q_H: η = W / Q_H = 1 - Q_C / Q_H.'),
            ('Coefficient of performance β of a refrigerator', 'I', 'β = Q_C / W = Q_C / (Q_H - Q_C)', 'The COP of a refrigerator is the ratio of heat extracted from cold reservoir Q_C to work input W: β = Q_C / W = Q_C / (Q_H - Q_C).'),
            ('Relation between Carnot COP β and Carnot efficiency η', 'II', 'β = (1 - η) / η', 'Since η = W / Q_H and β = Q_C / W = (Q_H - W) / W = 1/η - 1 = (1 - η) / η.'),
            ('COP of Carnot heat pump (refrigerator heating mode)', 'III', 'β_HP = Q_H / W = 1 + β = 1 / η', 'For a heat pump, the desired output is heat delivered to hot reservoir Q_H: β_HP = Q_H / W = (Q_C + W)/W = 1 + β = 1 / η.'),
        ],
        "D"
    ))

    # Q09 (intermediate, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_09",
        "Thermodynamics",
        "intermediate",
        'One mole of a monoatomic ideal gas (Cv = 1.5 R, Cp = 2.5 R) undergoes a three-step cycle: 1→2 is isochoric heating (T1 = 300 K to T2 = 600 K), 2→3 is adiabatic expansion to T3 = 400 K, and 3→1 is isobaric cooling back to state 1. Match the process in List I with the heat exchanged Q in List II (R is universal gas constant):',
        [
            ('Heat absorbed along 1 → 2', 'II', 'Q_12 = 450 R', 'Step 1→2 is isochoric: Q_12 = n Cv (T2 - T1) = 1 * (1.5 R)(600 - 300) = 450 R.'),
            ('Heat exchanged along 2 → 3', 'IV', 'Q_23 = 0', 'Step 2→3 is adiabatic: by definition no heat is exchanged, Q_23 = 0.'),
            ('Heat exchanged along 3 → 1', 'I', 'Q_31 = -250 R', 'Step 3→1 is isobaric: Q_31 = n Cp (T1 - T3) = 1 * (2.5 R)(300 - 400) = -250 R.'),
            ('Net heat absorbed in complete cycle Q_net', 'III', 'Q_net = 200 R', 'Net heat per cycle is Q_net = Q_12 + Q_23 + Q_31 = 450 R + 0 - 250 R = 200 R.'),
        ],
        "A"
    ))

    # Q10 (intermediate, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_10",
        "Thermodynamics",
        "intermediate",
        'Match the thermodynamic relation for a reversible adiabatic process of an ideal gas (adiabatic index γ) in List I with its formula in List II:',
        [
            ('Temperature - Volume relation', 'III', 'T V^(γ - 1) = constant', 'From P V^γ = const and P = nRT/V, we get (nRT/V) V^γ = const, so T V^(γ - 1) = const.'),
            ('Pressure - Temperature relation', 'I', 'P^(1 - γ) T^γ = constant', 'From P V^γ = const and V = nRT/P, we get P (nRT/P)^γ = const, so P^(1 - γ) T^γ = const.'),
            ('Adiabatic bulk modulus B_ad', 'IV', 'B_ad = γ P', 'Adiabatic bulk modulus is defined as B_ad = - V (dP/dV)_ad. Since (dP/dV)_ad = - γ P / V, B_ad = γ P.'),
            ('Slope of adiabatic curve compared to isothermal slope', 'II', '(dP/dV)_ad = γ (dP/dV)_iso', 'Slope of adiabatic curve is (dP/dV)_ad = - γ P / V, while isothermal slope is (dP/dV)_iso = - P / V. Thus adiabatic slope is γ times steeper.'),
        ],
        "B"
    ))

    # Q11 (intermediate, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_11",
        "Thermodynamics",
        "intermediate",
        'A mixture of non-reacting ideal gases consists of 2 moles of Helium (monoatomic, Cv1 = 1.5 R) and 3 moles of Nitrogen (rigid diatomic, Cv2 = 2.5 R). Match the property of the mixture in List I with its value in List II:',
        [
            ('Molar heat capacity at constant volume Cv_mix', 'I', 'Cv_mix = 2.1 R', 'Cv_mix = (n1 Cv1 + n2 Cv2)/(n1 + n2) = (2 * 1.5 R + 3 * 2.5 R) / 5 = (3 + 7.5) R / 5 = 2.1 R.'),
            ('Molar heat capacity at constant pressure Cp_mix', 'IV', 'Cp_mix = 3.1 R', "By Mayer's relation for the mixture, Cp_mix = Cv_mix + R = 2.1 R + R = 3.1 R."),
            ('Adiabatic index γ_mix of the mixture', 'II', 'γ_mix = 31 / 21 ≈ 1.476', 'γ_mix = Cp_mix / Cv_mix = 3.1 R / 2.1 R = 31 / 21 ≈ 1.476.'),
            ('Total internal energy of the mixture at temperature T', 'III', 'U = 10.5 R T', 'U = n1 Cv1 T + n2 Cv2 T = (2 * 1.5 R + 3 * 2.5 R) T = 10.5 R T.'),
        ],
        "C"
    ))

    # Q12 (intermediate, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_12",
        "Thermodynamics",
        "intermediate",
        'Match the thermodynamic process for n moles of an ideal gas in List I with the entropy change ΔS of the gas in List II:',
        [
            ('Reversible isothermal expansion from volume V1 to V2', 'IV', 'ΔS = n R ln(V2 / V1)', 'For isothermal expansion, ΔT = 0, so ΔS = ∫ dQ_rev / T = (1/T) ∫ P dV = n R ln(V2 / V1).'),
            ('Reversible isochoric heating from temperature T1 to T2', 'II', 'ΔS = n Cv ln(T2 / T1)', 'For isochoric heating, dQ_rev = n Cv dT, so ΔS = ∫ n Cv dT / T = n Cv ln(T2 / T1).'),
            ('Reversible isobaric heating from temperature T1 to T2', 'III', 'ΔS = n Cp ln(T2 / T1)', 'For isobaric heating, dQ_rev = n Cp dT, so ΔS = ∫ n Cp dT / T = n Cp ln(T2 / T1).'),
            ('Reversible adiabatic process between any two states', 'I', 'ΔS = 0 (isentropic process)', 'In a reversible adiabatic process, dQ_rev = 0 at every stage, so ΔS = ∫ dQ_rev / T = 0.'),
        ],
        "D"
    ))

    # Q13 (advanced, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_13",
        "Thermodynamics",
        "advanced",
        'One mole of a monoatomic ideal gas (Cv = 1.5 R) undergoes an expansion along the straight line P = P0 - α V from V1 = V0/2 to V2 = V0, where α = P0 / (2 V0). Match the thermodynamic quantity in List I with its value in List II:',
        [
            ('Work done by the gas W', 'II', 'W = (5/16) P0 V0 = 0.3125 P0 V0', 'W = ∫ (P0 - α V) dV from V0/2 to V0 = P0 (V0/2) - (α/2)(V0² - V0²/4) = 0.5 P0 V0 - (P0 / (4 V0))(3/4 V0²) = 0.5 - 3/16 = 5/16 P0 V0.'),
            ('Maximum temperature attained during the process T_max', 'I', 'T_max = P0 V0 / (2 R)', 'T(V) = P V / R = (P0 V - α V²) / R. Maximum occurs at dT/dV = 0 => V = P0 / (2α) = V0. T_max = (P0 V0 - α V0²) / R = (P0 V0 - 0.5 P0 V0)/R = P0 V0 / (2 R).'),
            ('Change in internal energy ΔU', 'IV', 'ΔU = (3/16) P0 V0 = 0.1875 P0 V0', 'At V1 = V0/2, P1 = 3/4 P0, so T1 = 3/8 P0 V0 / R. At V2 = V0, P2 = P0/2, so T2 = 1/2 P0 V0 / R. ΔU = Cv (T2 - T1) = 1.5 R (1/8 P0 V0 / R) = 3/16 P0 V0.'),
            ('Total heat absorbed Q during this expansion', 'III', 'Q = (1/2) P0 V0 = 0.5 P0 V0', 'By First Law, Q = ΔU + W = 3/16 P0 V0 + 5/16 P0 V0 = 8/16 P0 V0 = 0.5 P0 V0.'),
        ],
        "A"
    ))

    # Q14 (advanced, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_14",
        "Thermodynamics",
        "advanced",
        'Consider the representation of thermodynamic cycles on a Temperature - Entropy (T-S) diagram. Match the feature in List I with its physical meaning / expression in List II:',
        [
            ('Slope of an isochoric curve (dT/dS)_V', 'III', 'T / Cv', 'For isochoric process, dQ = T dS = n Cv dT (per mole: T dS = Cv dT), hence (dT/dS)_V = T / Cv.'),
            ('Slope of an isobaric curve (dT/dS)_P', 'IV', 'T / Cp (strictly less steep than isochoric slope)', 'For isobaric process, dQ = T dS = Cp dT, so (dT/dS)_P = T / Cp. Since Cp > Cv, the isobaric curve is less steep than the isochoric curve.'),
            ('Enclosed area of a reversible cyclic process on the T-S plane', 'I', 'Net work done W_net by the system in one cycle', 'Area enclosed = ∮ T dS = Q_net. For any closed cycle ΔU = 0, so Q_net = W_net.'),
            ('Carnot cycle shape on the T-S plane', 'II', 'A rectangle bounded by two horizontal and two vertical lines', 'Carnot cycle consists of two isotherms (T = const, horizontal lines) and two reversible adiabatics (isentropes, S = const, vertical lines), forming a rectangle.'),
        ],
        "B"
    ))

    # Q15 (advanced, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_15",
        "Thermodynamics",
        "advanced",
        'One mole of an ideal gas has temperature-dependent molar heat capacity at constant volume Cv(T) = a + b T, where a and b are constants. The gas is heated at constant volume from T1 to T2. Match the thermodynamic quantity in List I with its mathematical expression in List II:',
        [
            ('Change in internal energy ΔU', 'I', 'ΔU = a (T2 - T1) + (b/2)(T2² - T1²)', 'ΔU = ∫ Cv(T) dT from T1 to T2 = ∫ (a + b T) dT = a (T2 - T1) + (b/2)(T2² - T1²).'),
            ('Molar heat capacity at constant pressure Cp(T)', 'III', 'Cp(T) = (a + R) + b T', "By Mayer's relation for an ideal gas, Cp(T) = Cv(T) + R = a + b T + R = (a + R) + b T."),
            ('Change in entropy of the gas ΔS_V', 'II', 'ΔS_V = a ln(T2 / T1) + b (T2 - T1)', 'ΔS_V = ∫ (Cv / T) dT from T1 to T2 = ∫ (a/T + b) dT = a ln(T2 / T1) + b (T2 - T1).'),
            ('Work done by the gas W_V', 'IV', 'W_V = 0', 'The process is isochoric (dV = 0), so boundary work done by the gas is identically zero.'),
        ],
        "C"
    ))

    # Q16 (advanced, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_16",
        "Thermodynamics",
        "advanced",
        'An air-standard Otto cycle operates between minimum temperature T1 and maximum temperature T3 with compression ratio r = V1 / V2 and adiabatic index γ. Match the cycle quantity in List I with its expression in List II:',
        [
            ('Thermal efficiency η_Otto', 'IV', 'η = 1 - 1 / r^(γ - 1)', 'Efficiency of standard Otto cycle depends only on compression ratio and γ: η = 1 - (T4 - T1)/(T3 - T2) = 1 - 1 / r^(γ - 1).'),
            ('Temperature at the end of adiabatic compression T2', 'II', 'T2 = T1 r^(γ - 1)', 'Process 1→2 is adiabatic compression from V1 to V2: T2 = T1 (V1/V2)^(γ-1) = T1 r^(γ - 1).'),
            ('Temperature at the end of adiabatic expansion T4', 'I', 'T4 = T3 / r^(γ - 1)', 'Process 3→4 is adiabatic expansion from V2 to V1: T4 = T3 (V2/V1)^(γ-1) = T3 / r^(γ - 1).'),
            ('Work done per cycle W_net', 'III', 'W_net = Cv [(T3 - T2) - (T4 - T1)]', 'W_net = Q_in - Q_out = Cv (T3 - T2) - Cv (T4 - T1) = Cv [(T3 - T2) - (T4 - T1)].'),
        ],
        "D"
    ))

    # Q17 (advanced, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_17",
        "Thermodynamics",
        "advanced",
        'One mole of a monoatomic ideal gas (Cv = 1.5 R) performs a rectangular cycle 1 → 2 → 3 → 4 → 1 on a P-V diagram with vertices (P0, V0), (P0, 2V0), (P0/2, 2V0), and (P0/2, V0). Match the cycle parameter in List I with its value in List II:',
        [
            ('Net work done per cycle W_net', 'II', 'W_net = 0.50 P0 V0', 'Area of rectangular cycle = (P0 - P0/2)(2V0 - V0) = (P0/2)(V0) = 0.50 P0 V0.'),
            ('Heat absorbed along 4→1 and 1→2 (Q_in)', 'IV', 'Q_in = 3.25 P0 V0', 'Q_41 = Cv (T1 - T4) = 1.5 (P0 V0 - 0.5 P0 V0) = 0.75 P0 V0. Q_12 = Cp (T2 - T1) = 2.5 (2 P0 V0 - P0 V0) = 2.50 P0 V0. Total Q_in = 0.75 + 2.50 = 3.25 P0 V0.'),
            ('Heat rejected along 2→3 and 3→4 (Q_out)', 'I', 'Q_out = 2.75 P0 V0', 'Q_23 = Cv (T2 - T3) = 1.5 (2 P0 V0 - P0 V0) = 1.50 P0 V0. Q_34 = Cp (T3 - T4) = 2.5 (P0 V0 - 0.5 P0 V0) = 1.25 P0 V0. Total Q_out = 1.50 + 1.25 = 2.75 P0 V0.'),
            ('Thermal efficiency of the cycle η', 'III', 'η = 2 / 13 ≈ 15.38%', 'Efficiency is η = W_net / Q_in = 0.50 P0 V0 / 3.25 P0 V0 = (1/2) / (13/4) = 2 / 13 ≈ 15.38%.'),
        ],
        "A"
    ))

    # Q18 (advanced, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_18",
        "Thermodynamics",
        "advanced",
        'An ideal gas undergoes different thermodynamic processes represented on a Pressure vs Temperature (P-T) diagram. Match the process in List I with its graphical curve description in List II:',
        [
            ('Isochoric process (constant volume)', 'III', 'Straight line passing through the origin (P ∝ T)', "By Gay-Lussac's law, P = (nR/V) T. At constant volume V, P is directly proportional to T, represented by a straight line passing through origin."),
            ('Isothermal process (constant temperature)', 'I', 'Vertical straight line parallel to the pressure axis', 'In an isothermal process, T = constant, which corresponds to a vertical straight line on a P-T plane.'),
            ('Isobaric process (constant pressure)', 'IV', 'Horizontal straight line parallel to the temperature axis', 'In an isobaric process, P = constant, which corresponds to a horizontal straight line on a P-T plane.'),
            ('Reversible adiabatic process (PV^γ = const)', 'II', 'Non-linear curve satisfying P^(1 - γ) T^γ = const', 'In a reversible adiabatic process, P^(1 - γ) T^γ = const, so P ∝ T^(γ/(γ-1)), which is a non-linear curve on the P-T plane.'),
        ],
        "B"
    ))

    # Q19 (advanced, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_19",
        "Thermodynamics",
        "advanced",
        'Two identical finite bodies each with constant heat capacity C are initially at temperatures T1 and T2 (with T1 > T2). A Carnot engine operates between them in infinitesimally small cycles until both bodies reach a common final temperature T_f. Match the parameter in List I with its value in List II:',
        [
            ('Final equilibrium temperature T_f', 'I', 'T_f = √(T1 T2)', 'Since the engine is reversible, total entropy change of the isolated system is zero: ΔS1 + ΔS2 = C ln(T_f / T1) + C ln(T_f / T2) = 0 => T_f² = T1 T2 => T_f = √(T1 T2).'),
            ('Maximum work extracted W_max', 'III', 'W_max = C (√T1 - √T2)²', 'W_max = Q1 - Q2 = C (T1 - T_f) - C (T_f - T2) = C (T1 + T2 - 2 √(T1 T2)) = C (√T1 - √T2)².'),
            ('Heat extracted from hotter body Q1', 'IV', 'Q1 = C (T1 - √(T1 T2))', 'Hotter body cools from T1 to T_f = √(T1 T2), so heat extracted is Q1 = C (T1 - √(T1 T2)).'),
            ('Heat delivered to colder body Q2', 'II', 'Q2 = C (√(T1 T2) - T2)', 'Colder body warms from T2 to T_f = √(T1 T2), so heat absorbed is Q2 = C (√(T1 T2) - T2).'),
        ],
        "C"
    ))

    # Q20 (advanced, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_20",
        "Thermodynamics",
        "advanced",
        'Match the thermodynamic law / relation in List I with its fundamental equation in List II:',
        [
            ('First Law of Thermodynamics (infinitesimal quasi-static process)', 'IV', 'dQ = dU + P dV', 'First law states that heat added dQ equals change in internal energy dU plus boundary work dW = P dV.'),
            ('Clausius inequality for any cyclic process', 'II', '∮ (dQ / T) ≤ 0', 'Clausius theorem states ∮ (dQ / T) ≤ 0, where equality holds for reversible cycles and strict inequality for irreversible cycles.'),
            ('General Mayer relation for any substance', 'I', 'Cp - Cv = - T (∂V/∂T)_P² (∂P/∂V)_T = T V α² / κ_T', 'Using Maxwell relations, Cp - Cv = T (∂P/∂T)_V (∂V/∂T)_P = - T (∂V/∂T)_P² (∂P/∂V)_T = T V α² / κ_T, where α is isobaric expansivity and κ_T is isothermal compressibility.'),
            ('Clapeyron equation for phase change', 'III', 'dP / dT = L / [T (V_final - V_initial)]', 'The Clapeyron equation gives the slope of the coexistence curve: dP/dT = ΔS / ΔV = L / [T (V_final - V_initial)].'),
        ],
        "D"
    ))

    # ==========================================
    # TOPIC: Kinetic Theory of Gases (20 questions)
    # ==========================================
    prefix = "phy_ktg"

    # Q21 (beginner, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_21",
        "Kinetic Theory of Gases",
        "beginner",
        'For an ideal gas of molar mass M at absolute temperature T, match the characteristic molecular speed in List I with its formula in List II (R is universal gas constant):',
        [
            ('Root mean square speed v_rms', 'III', 'v_rms = √(3 R T / M)', 'Root mean square speed is defined by v_rms = √(<v²>) = √(3 R T / M).'),
            ('Average (mean) speed v_avg', 'I', 'v_avg = √(8 R T / (π M))', 'The mean speed from Maxwell-Boltzmann distribution is v_avg = <v> = √(8 R T / (π M)).'),
            ('Most probable speed v_mp', 'IV', 'v_mp = √(2 R T / M)', 'Most probable speed corresponds to the peak of the speed distribution curve: v_mp = √(2 R T / M).'),
            ('Ratio v_mp : v_avg : v_rms', 'II', '1 : √(4/π) : √(1.5) ≈ 1 : 1.128 : 1.225', 'Ratio of speeds is √2 : √(8/π) : √3 = 1 : √(4/π) : √(1.5) ≈ 1 : 1.128 : 1.225.'),
        ],
        "A"
    ))

    # Q22 (beginner, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_22",
        "Kinetic Theory of Gases",
        "beginner",
        'Match the kinetic theory quantity for an ideal gas of N molecules in volume V at pressure P and temperature T in List I with its formula in List II:',
        [
            ('Kinetic pressure P', 'II', 'P = (1/3) ρ v_rms²', 'Kinetic theory pressure formula is P = (1/3) (N m / V) v_rms² = (1/3) ρ v_rms².'),
            ('Average translational kinetic energy per molecule', 'IV', '(3/2) k_B T', 'By equipartition theorem, 3 translational degrees of freedom give 3 * (1/2 k_B T) = (3/2) k_B T.'),
            ('Total translational kinetic energy per mole', 'I', '(3/2) R T', "Multiplying molecular kinetic energy by Avogadro's number N_A gives N_A (3/2 k_B T) = (3/2) R T."),
            ('Translational kinetic energy density u (energy per unit volume)', 'III', 'u = (3/2) P', 'Energy density is u = E / V = (3/2 n R T) / V = (3/2) P.'),
        ],
        "B"
    ))

    # Q23 (beginner, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_23",
        "Kinetic Theory of Gases",
        "beginner",
        'Match the gas molecule in List I with its total active degrees of freedom f in List II:',
        [
            ('Helium / Argon (monoatomic)', 'I', 'f = 3 (translational degrees of freedom only)', 'Monoatomic gases have no rotational or vibrational modes, so f = 3 translational degrees of freedom only.'),
            ('Oxygen / Nitrogen at room temperature (rigid diatomic)', 'III', 'f = 5 (3 translational + 2 rotational)', 'Linear diatomic molecules have 3 translational and 2 rotational degrees of freedom at room temperature, total f = 5.'),
            ('Water vapor H2O (non-linear triatomic)', 'II', 'f = 6 (3 translational + 3 rotational)', 'Non-linear molecules have 3 translational and 3 rotational degrees of freedom, giving f = 3 + 3 = 6.'),
            ('Chlorine Cl2 at high temperature (diatomic with active vibration)', 'IV', 'f = 7 (3 translational + 2 rotational + 2 vibrational)', 'At high temperatures, the vibrational mode is active, contributing 2 degrees of freedom (1 KE + 1 PE), giving total f = 3 + 2 + 2 = 7.'),
        ],
        "C"
    ))

    # Q24 (beginner, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_24",
        "Kinetic Theory of Gases",
        "beginner",
        'The mean free path of an ideal gas molecule of diameter d is λ = 1 / (√2 π n d²), where n is molecular number density. Match the thermodynamic process in List I with the dependence of λ in List II:',
        [
            ('Isothermal variation with pressure P', 'IV', 'λ ∝ 1 / P', 'At constant T, n = P / (k_B T) ∝ P, so λ ∝ 1 / n ∝ 1 / P.'),
            ('Isobaric variation with temperature T', 'I', 'λ ∝ T', 'At constant P, n = P / (k_B T) ∝ 1 / T, so λ ∝ 1 / n ∝ T.'),
            ('Isochoric variation with temperature T', 'III', 'λ = constant (independent of T)', 'At constant volume, number of molecules per unit volume n = N / V is constant, so λ remains constant.'),
            ('Expansion in volume V (fixed mass of gas)', 'II', 'λ ∝ V', 'Since n = N / V, λ = V / (√2 π N d²) ∝ V.'),
        ],
        "D"
    ))

    # Q25 (intermediate, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_25",
        "Kinetic Theory of Gases",
        "intermediate",
        'Consider molecular speeds and kinetic properties of different gases at thermal equilibrium at absolute temperature T. Match the ratio in List I with its numerical value in List II:',
        [
            ('Ratio of rms speed of Helium (M=4) to Argon (M=40)', 'II', '√10 ≈ 3.16', 'v_rms ∝ 1/√M, so v_rms,He / v_rms,Ar = √(40 / 4) = √10 ≈ 3.16.'),
            ('Ratio of rms speed of Helium (M=4) to Oxygen (M=32)', 'IV', '2√2 ≈ 2.83', 'v_rms,He / v_rms,O2 = √(32 / 4) = √8 = 2√2 ≈ 2.83.'),
            ('Ratio of rms speed of Helium (M=4) to Methane CH4 (M=16)', 'I', '2.0', 'v_rms,He / v_rms,CH4 = √(16 / 4) = √4 = 2.0.'),
            ('Ratio of average translational kinetic energy per molecule of He to O2', 'III', '1.0 (independent of molecular mass)', 'Average translational kinetic energy per molecule is (3/2) k_B T, depending strictly on temperature, so the ratio is identically 1.0.'),
        ],
        "A"
    ))

    # Q26 (intermediate, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_26",
        "Kinetic Theory of Gases",
        "intermediate",
        'Consider the Maxwell-Boltzmann molecular speed distribution f(v) = 4π (M / (2π R T))^(3/2) v² exp(-M v² / (2 R T)). Match the feature in List I with its physical description in List II:',
        [
            ('Speed at which distribution f(v) attains its maximum', 'III', 'v_mp = √(2 R T / M)', 'Setting df/dv = 0 yields the most probable speed v_mp = √(2 R T / M).'),
            ('Total area under the curve ∫ f(v) dv from 0 to ∞', 'I', 'Exactly 1 (normalized total probability)', 'Because f(v) is a probability density function, the total integral over all possible speeds from 0 to ∞ equals 1.'),
            ('Effect of temperature increase on the distribution curve', 'IV', 'Peak shifts to the right and peak height decreases as T^(-1/2)', 'As T increases, molecules move faster; the peak moves to higher speed (∝ √T) and flattens out (peak height ∝ 1/√T) to preserve total area = 1.'),
            ('Behavior of f(v) for very low speeds (v << v_mp)', 'II', 'Parabolic rise: f(v) ∝ v²', 'For small v, exp(-M v² / 2RT) ≈ 1, so f(v) is dominated by the phase-space volume element factor 4π v².'),
        ],
        "B"
    ))

    # Q27 (intermediate, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_27",
        "Kinetic Theory of Gases",
        "intermediate",
        'For an ideal gas with molecular diameter d, number density n, and mean speed v_avg, match the collision quantity in List I with its formula in List II:',
        [
            ('Collision frequency of a single molecule Z', 'I', 'Z = √2 π n d² v_avg', 'The number of collisions experienced by one molecule per second is Z = √2 π d² n v_avg.'),
            ('Mean free time (relaxation time) τ between collisions', 'III', 'τ = 1 / (√2 π n d² v_avg) = λ / v_avg', 'Mean free time is the inverse of single-molecule collision frequency: τ = 1 / Z = λ / v_avg.'),
            ('Total number of binary collisions per unit volume per second Z_11', 'IV', 'Z_11 = (1/2) √2 π n² d² v_avg', 'Total collision rate per unit volume is (1/2) n Z = (1/2) √2 π n² d² v_avg (factor 1/2 prevents double counting).'),
            ('Collision cross-section area σ', 'II', 'σ = π d²', 'Two spherical molecules of diameter d collide if their centers come within distance d, giving cross-sectional area σ = π d².'),
        ],
        "C"
    ))

    # Q28 (intermediate, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_28",
        "Kinetic Theory of Gases",
        "intermediate",
        "Match the effusion problem involving Graham's Law of effusion in List I with the correct result in List II:",
        [
            ('Ratio of effusion times for equal volumes of SO2 (M=64) and CH4 (M=16) (t_SO2 / t_CH4)', 'IV', '2 : 1', 'Effusion time t ∝ √M. Therefore t_SO2 / t_CH4 = √(64 / 16) = √4 = 2.'),
            ('Ratio of effusion rates of 235-UF6 (M=349) to 238-UF6 (M=352)', 'II', '√(352 / 349) ≈ 1.0043', 'Effusion rate r ∝ 1/√M, so r_235 / r_238 = √(352 / 349) ≈ 1.0043.'),
            ('Dependence of effusion rate on hole area A and pressure P', 'I', 'r ∝ P A / √(M T)', 'Molecular effusion flux is Φ = P / √(2π m k_B T), so total effusion rate is r = A Φ ∝ P A / √(M T).'),
            ('Ratio of volume of H2 (M=2) to O2 (M=32) effusing in the same time interval', 'III', '4 : 1', 'Volume effused per unit time V/t ∝ 1/√M, so V_H2 / V_O2 = √(32 / 2) = √16 = 4.'),
        ],
        "D"
    ))

    # Q29 (intermediate, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_29",
        "Kinetic Theory of Gases",
        "intermediate",
        'For a real gas obeying the van der Waals equation (P + a/V_m²)(V_m - b) = R T, match the parameter / term in List I with its physical significance in List II:',
        [
            ("Van der Waals constant 'a'", 'II', 'Measures intermolecular attractive forces (units: N m⁴ mol⁻² or atm L² mol⁻²)', "The constant 'a' accounts for cohesive attractive forces between gas molecules that pull surface molecules inward."),
            ("Van der Waals constant 'b' (co-volume)", 'I', 'Effective excluded volume per mole due to finite molecular size (b = 4 N_A v_molecule)', "The constant 'b' accounts for the finite incompressible volume occupied by the molecules themselves, equal to 4 times molecular volume."),
            ('Internal pressure term a / V_m²', 'IV', 'Deficit in pressure exerted on container walls caused by inward intermolecular attraction', 'Because molecules near the wall experience a net inward attractive pull from bulk gas, measured pressure P is less than ideal pressure by a / V_m².'),
            ('Compressibility factor Z = P V_m / (R T) at moderate pressure and low temperature', 'III', 'Z ≈ 1 - a / (R T V_m) < 1', 'At moderate pressures where attractive forces dominate over repulsive co-volume effects, Z < 1 and approximates 1 - a / (R T V_m).'),
        ],
        "A"
    ))

    # Q30 (intermediate, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_30",
        "Kinetic Theory of Gases",
        "intermediate",
        'Match the critical constant of a van der Waals gas in List I with its expression in terms of constants a, b, and R in List II:',
        [
            ('Critical temperature T_c', 'III', 'T_c = 8 a / (27 R b)', 'At the critical point (∂P/∂V)_T = 0 and (∂²P/∂V²)_T = 0, giving T_c = 8a / (27 R b).'),
            ('Critical pressure P_c', 'IV', 'P_c = a / (27 b²)', 'Substituting V_c = 3b and T_c = 8a/(27Rb) into the van der Waals equation gives P_c = a / (27 b²).'),
            ('Critical molar volume V_c', 'I', 'V_c = 3 b', 'The inflection point condition for the cubic equation in V yields a triple root at V_c = 3 b.'),
            ('Critical compressibility factor Z_c = P_c V_c / (R T_c)', 'II', 'Z_c = 3 / 8 = 0.375', 'Z_c = [a / (27 b²)] * [3 b] / [R * 8 a / (27 R b)] = (3/27) / (8/27) = 3 / 8 = 0.375, a universal constant for all van der Waals gases.'),
        ],
        "B"
    ))

    # Q31 (intermediate, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_31",
        "Kinetic Theory of Gases",
        "intermediate",
        'Match the characteristic temperature of a real gas in List I with its formula / physical property in List II:',
        [
            ('Boyle temperature T_B', 'I', 'T_B = a / (R b), where second virial coefficient vanishes', "At T_B = a / (R b), the real gas obeys Boyle's law (PV = const) over an extended pressure range as attraction and repulsion balance."),
            ('Inversion temperature T_i', 'II', 'T_i = 2 a / (R b) = 2 T_B, where Joule-Thomson cooling changes to heating', 'At T_i = 2a / (R b), the Joule-Thomson coefficient μ_JT = 0; below T_i expansion causes cooling, above T_i it causes heating.'),
            ('Behavior of gas expanded through porous plug at T > T_i', 'IV', 'Gas warms up upon expansion (heating effect)', 'When initial temperature T > T_i, repulsive forces dominate (co-volume effect), resulting in a temperature increase upon throttling.'),
            ('Behavior of gas expanded through porous plug at T < T_i', 'III', 'Gas cools down upon expansion (cooling effect)', 'When initial temperature T < T_i, work done against attractive forces exceeds co-volume effects, cooling the gas upon throttling.'),
        ],
        "C"
    ))

    # Q32 (intermediate, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_32",
        "Kinetic Theory of Gases",
        "intermediate",
        'Match the transport coefficient of an ideal gas in List I with its theoretical formula and pressure dependence in List II:',
        [
            ('Viscosity coefficient η', 'IV', 'η = (1/3) ρ v_avg λ, independent of pressure at ordinary pressures', 'Because ρ ∝ P and λ ∝ 1/P, their product ρ λ is independent of pressure, making gas viscosity independent of pressure!'),
            ('Thermal conductivity K', 'III', 'K = (1/3) ρ v_avg λ c_v = η c_v, independent of pressure at ordinary pressures', 'Thermal conductivity transfers kinetic energy: K ∝ ρ λ c_v, which like viscosity is independent of gas pressure at ordinary densities.'),
            ('Self-diffusion coefficient D', 'II', 'D = (1/3) v_avg λ ∝ T^(3/2) / P, inversely proportional to pressure', 'Diffusion coefficient D = (1/3) v_avg λ. Since v_avg ∝ √T and λ ∝ T/P, D ∝ T^(3/2) / P, so diffusion slows down at higher pressure.'),
            ('Kinematic viscosity ν = η / ρ', 'I', 'ν = (1/3) v_avg λ ∝ T^(3/2) / P, inversely proportional to pressure', 'Kinematic viscosity ν = η / ρ = (1/3) v_avg λ, having the same pressure and temperature dependence as the diffusion coefficient.'),
        ],
        "D"
    ))

    # Q33 (advanced, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_33",
        "Kinetic Theory of Gases",
        "advanced",
        'Match the kinetic theory quantity of an ideal gas in List I with its temperature scaling dependence in List II:',
        [
            ('Average molecular speed v_avg', 'II', '∝ T^(1/2)', 'Average speed v_avg = √(8 R T / (π M)) scales as T^(1/2).'),
            ('Total translational kinetic energy per mole E_trans', 'IV', '∝ T^1 (linear dependence)', 'Translational kinetic energy is (3/2) R T, which is directly proportional to T^1.'),
            ('Self-diffusion coefficient D at constant pressure', 'I', '∝ T^(3/2)', 'Since D = (1/3) v_avg λ and at constant pressure λ ∝ T while v_avg ∝ T^(1/2), D scales as T^(3/2).'),
            ('Mean relaxation time between collisions τ at constant volume', 'III', '∝ T^(-1/2)', 'At constant volume, λ is constant, so τ = λ / v_avg ∝ 1 / v_avg ∝ T^(-1/2).'),
        ],
        "A"
    ))

    # Q34 (advanced, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_34",
        "Kinetic Theory of Gases",
        "advanced",
        'One mole of a diatomic gas like Hydrogen (H2) exhibits quantum freezing of degrees of freedom. Match the temperature regime in List I with the molar heat capacity Cv in List II:',
        [
            ('Very low temperature (T < 50 K)', 'I', 'Cv = (3/2) R (only translational DOF active)', 'At very low T, thermal energy k_B T is much smaller than rotational energy spacing, so rotational modes are frozen: f = 3, Cv = 1.5 R.'),
            ('Room temperature (T ~ 300 K)', 'III', 'Cv = (5/2) R (3 translational + 2 rotational DOF active)', 'At room temperature, rotational modes are fully excited, but vibrational modes remain frozen: f = 3 + 2 = 5, Cv = 2.5 R.'),
            ('High temperature (T > 2000 K)', 'IV', 'Cv = (7/2) R (3 trans + 2 rot + 2 vib DOF active)', 'At high temperatures, the vibrational mode is excited with 1 kinetic and 1 potential quadratic term (2 DOF): f = 7, Cv = 3.5 R.'),
            ('Adiabatic index γ at high temperature (T > 2000 K)', 'II', 'γ = 9 / 7 ≈ 1.286', 'At high T, Cp = Cv + R = 4.5 R, giving γ = Cp / Cv = (9/2 R) / (7/2 R) = 9/7 ≈ 1.286.'),
        ],
        "B"
    ))

    # Q35 (advanced, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_35",
        "Kinetic Theory of Gases",
        "advanced",
        'The virial equation of state is written as Z = P V_m / (R T) = 1 + B(T)/V_m + C(T)/V_m² + ... Match the property in List I with its expression for a van der Waals gas in List II:',
        [
            ('Second virial coefficient B(T)', 'III', 'B(T) = b - a / (R T)', 'Expanding van der Waals equation in powers of 1/V_m yields Z = 1 + (b - a/(RT))/V_m + b²/V_m² + ..., so B(T) = b - a/(RT).'),
            ('Third virial coefficient C(T)', 'I', 'C(T) = b²', 'The coefficient of 1/V_m² in the expansion is C(T) = b², independent of temperature.'),
            ('Condition for Boyle temperature T_B', 'IV', 'B(T_B) = 0 => T_B = a / (R b)', 'At the Boyle temperature, the second virial coefficient vanishes: b - a/(R T_B) = 0, giving T_B = a / (R b).'),
            ('Initial slope of Z vs P at T = T_B as P → 0', 'II', '(dZ/dP)|_P→0 = 0', 'Since (dZ/dP)|_P→0 = B(T)/(RT), at T = T_B where B(T_B) = 0, the initial slope of Z vs P is zero.'),
        ],
        "C"
    ))

    # Q36 (advanced, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_36",
        "Kinetic Theory of Gases",
        "advanced",
        'Consider an ideal gas confined to a two-dimensional surface of area A. Match the 2D kinetic theory property in List I with its formula in List II:',
        [
            ('Average translational kinetic energy per molecule in 2D', 'IV', 'k_B T', 'In 2D, there are only 2 translational degrees of freedom (x and y), each contributing (1/2) k_B T, so average KE = 2 * (1/2 k_B T) = k_B T.'),
            ('Total internal energy of N molecules in 2D', 'II', 'U = N k_B T', 'Total internal energy is N times the molecular energy: U = N k_B T.'),
            ('Two-dimensional surface pressure (surface tension force per unit length) Π', 'I', 'Π = (N / A) k_B T', 'The 2D ideal gas equation of state is Π A = N k_B T, so 2D pressure is Π = (N/A) k_B T.'),
            ('Root mean square speed v_rms in 2D', 'III', 'v_rms = √(2 k_B T / m)', 'Since (1/2) m <v²> = k_B T in 2D, <v²> = 2 k_B T / m, so v_rms = √(2 k_B T / m).'),
        ],
        "D"
    ))

    # Q37 (advanced, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_37",
        "Kinetic Theory of Gases",
        "advanced",
        'Match the statistical expectation value for a 3D Maxwell-Boltzmann distribution of speeds in List I with its formula in List II (m is molecular mass):',
        [
            ('Mean speed <v>', 'I', '√(8 k_B T / (π m))', 'Integration of v f(v) dv gives <v> = √(8 k_B T / (π m)).'),
            ('Mean square speed <v²>', 'IV', '3 k_B T / m', 'Integration of v² f(v) dv gives <v²> = 3 k_B T / m = v_rms².'),
            ('Mean inverse speed <1/v>', 'II', '√(2 m / (π k_B T))', 'Integration of (1/v) f(v) dv gives <1/v> = √(2 m / (π k_B T)) = 4 / (π <v>).'),
            ('Average relative speed between two colliding molecules <v_rel>', 'III', '√2 <v> = √(16 k_B T / (π m))', 'For two independent Maxwellian particles, relative velocity distribution has reduced mass m/2, giving <v_rel> = √2 <v> = √(16 k_B T / (π m)).'),
        ],
        "A"
    ))

    # Q38 (advanced, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_38",
        "Kinetic Theory of Gases",
        "advanced",
        'Consider an isothermal atmosphere of an ideal gas (molar mass M) at temperature T in a uniform gravitational field g (Barometric formula). Match the atmospheric property in List I with its expression in List II:',
        [
            ('Atmospheric pressure at height z, P(z)', 'II', 'P(z) = P0 exp(- M g z / (R T))', 'From hydrostatic balance dP/dz = - ρ g = - (P M / R T) g, integration gives P(z) = P0 exp(- M g z / (R T)).'),
            ('Scale height H (height at which pressure drops by factor of e)', 'I', 'H = R T / (M g)', 'The scale height H is defined by P(H) = P0 / e, giving H = R T / (M g) = k_B T / (m g).'),
            ('Total mass of the atmosphere per unit ground area', 'IV', 'P0 / g', 'Total mass per unit area is ∫ ρ dz = (1/g) ∫ (-dP/dz) dz = P0 / g.'),
            ('Height of the center of mass of the isothermal atmosphere', 'III', 'z_cm = H = R T / (M g)', 'z_cm = ∫ z ρ dz / ∫ ρ dz = ∫ z exp(-z/H) dz / H = H = R T / (M g).'),
        ],
        "B"
    ))

    # Q39 (advanced, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_39",
        "Kinetic Theory of Gases",
        "advanced",
        'For a real gas undergoing an adiabatic Joule-Thomson expansion (constant enthalpy H), match the thermodynamic parameter in List I with its formula in List II:',
        [
            ('Joule-Thomson coefficient definition μ_JT', 'III', 'μ_JT = (∂T/∂P)_H = (1/Cp) [T (∂V/∂T)_P - V]', 'From dH = Cp dT + [V - T(∂V/∂T)_P] dP = 0, the Joule-Thomson coefficient is μ_JT = (1/Cp) [T(∂V/∂T)_P - V].'),
            ('Joule-Thomson coefficient for an ideal gas', 'IV', 'μ_JT = 0', 'For an ideal gas, V = nRT/P, so T(∂V/∂T)_P - V = T(nR/P) - V = 0, meaning an ideal gas undergoes zero temperature change upon throttling.'),
            ('Approximate μ_JT for a van der Waals gas', 'I', 'μ_JT ≈ (1/Cp) [2a / (R T) - b]', 'Using the virial form V ≈ RT/P + b - a/(RT), we obtain T(∂V/∂T)_P - V ≈ 2a/(RT) - b, so μ_JT ≈ (1/Cp) [2a/(RT) - b].'),
            ('Inversion temperature condition where μ_JT = 0', 'II', 'T_i = 2a / (R b)', 'Setting 2a/(R T_i) - b = 0 yields the inversion temperature T_i = 2a / (R b).'),
        ],
        "C"
    ))

    # Q40 (advanced, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_40",
        "Kinetic Theory of Gases",
        "advanced",
        'Consider the molecular effusion and wall collisions of an ideal gas at pressure P and temperature T. Match the physical quantity in List I with its formula in List II (m is molecular mass, n is number density):',
        [
            ('Effusion flux Φ (molecules striking unit area per second)', 'I', 'Φ = (1/4) n v_avg = P / √(2π m k_B T)', 'Integrating v_z over forward hemisphere gives effusion rate per unit area Φ = (1/4) n v_avg = P / √(2π m k_B T).'),
            ('Rate of mass loss through an orifice of area A into vacuum', 'III', 'dM/dt = P A √(m / (2π k_B T))', 'Mass loss rate is m A Φ = m A P / √(2π m k_B T) = P A √(m / (2π k_B T)).'),
            ('Average normal momentum transferred to a wall per elastic collision', 'II', '2 m <v_z | v_z > 0> = √(2π m k_B T)', 'Momentum transferred per elastic reflection is 2 m v_z. Averaged over colliding flux, this equals 2 m (k_B T / (2π m))^(1/2) * π / 2 ... = √(2π m k_B T).'),
            ('Recoil thrust on a vessel losing gas via Knudsen effusion through area A into vacuum', 'IV', 'F_thrust = (1/2) P A', 'Molecules effusing through area A lack the balancing reaction force on the wall: F_thrust = (1/2) P A.'),
        ],
        "D"
    ))

    # ==========================================
    # TOPIC: Simple Harmonic Motion (20 questions)
    # ==========================================
    prefix = "phy_shm"

    # Q41 (beginner, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_41",
        "Simple Harmonic Motion",
        "beginner",
        'A particle executes SHM along the x-axis described by x(t) = A sin(ωt). Match the kinematic quantity in List I with its formula / property in List II:',
        [
            ('Velocity as a function of position x', 'II', 'v = ± ω √(A² - x²)', 'From v² = ω² (A² cos² ωt) = ω² (A² - A² sin² ωt) = ω² (A² - x²), we get v = ± ω √(A² - x²).'),
            ('Acceleration as a function of position x', 'IV', 'a = - ω² x', 'Differentiating velocity gives a = d²x/dt² = - ω² A sin(ωt) = - ω² x.'),
            ('Phase lead of velocity v(t) over displacement x(t)', 'I', 'π/2 rad (90°)', 'Since v(t) = ω A cos(ωt) = ω A sin(ωt + π/2), velocity leads displacement by π/2 radians.'),
            ('Phase lead of acceleration a(t) over displacement x(t)', 'III', 'π rad (180°)', 'Since a(t) = - ω² A sin(ωt) = ω² A sin(ωt + π), acceleration leads displacement by π radians.'),
        ],
        "A"
    ))

    # Q42 (beginner, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_42",
        "Simple Harmonic Motion",
        "beginner",
        'A particle of mass m executes SHM with amplitude A and angular frequency ω. Match the energy parameter in List I with its expression in List II:',
        [
            ('Kinetic energy K at displacement x', 'III', 'K = (1/2) m ω² (A² - x²)', 'Kinetic energy is K = (1/2) m v² = (1/2) m [ω² (A² - x²)].'),
            ('Potential energy U at displacement x (taking U(0) = 0)', 'I', 'U = (1/2) m ω² x²', 'Restoring force F = - m ω² x, so potential energy U = - ∫ F dx = (1/2) m ω² x².'),
            ('Total mechanical energy E', 'IV', 'E = (1/2) m ω² A²', 'Total energy E = K + U = (1/2) m ω² (A² - x²) + (1/2) m ω² x² = (1/2) m ω² A².'),
            ('Displacement x at which kinetic energy equals potential energy', 'II', 'x = ± A / √2', 'Setting K = U gives (1/2) m ω² (A² - x²) = (1/2) m ω² x² => 2x² = A² => x = ± A / √2.'),
        ],
        "B"
    ))

    # Q43 (beginner, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_43",
        "Simple Harmonic Motion",
        "beginner",
        'Match the simple pendulum setup in List I with its time period / characteristic in List II (g is acceleration due to gravity on Earth):',
        [
            ('Standard pendulum of length L on Earth', 'IV', 'T = 2π √(L / g)', 'For small oscillations, restoring torque is - m g L θ = I α = (m L²) α, giving ω = √(g/L), so T = 2π √(L/g).'),
            ('Seconds pendulum on Earth (T = 2.0 s)', 'I', 'L = g / π² ≈ 0.993 m ≈ 1.0 m', 'A seconds pendulum has period T = 2.0 s, so 2 = 2π √(L/g) => √(L/g) = 1/π => L = g / π² ≈ 1.0 m.'),
            ('Pendulum of length L taken to the Moon (g_moon = g/6)', 'II', "T' = √6 T ≈ 2.45 T", 'Since T ∝ 1/√g, when g is reduced by factor 6, time period increases by factor √6 ≈ 2.45.'),
            ('Pendulum whose length is increased to 4L on Earth', 'III', "T' = 2 T", "Since T ∝ √L, quadrupling length doubles the time period: T' = 2π √(4L/g) = 2 T."),
        ],
        "C"
    ))

    # Q44 (beginner, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_44",
        "Simple Harmonic Motion",
        "beginner",
        'A mass m is attached to ideal springs of stiffness k. Match the configuration in List I with its oscillation time period in List II (T0 = 2π √(m / k)):',
        [
            ('Single spring of stiffness k attached to mass m', 'I', 'T0 = 2π √(m / k)', 'For a single spring-mass system, the restoring force is -kx = m a, giving T0 = 2π √(m/k).'),
            ('Two identical springs of stiffness k in series with mass m', 'III', 'T = √2 T0 (effective stiffness k / 2)', 'In series, effective stiffness is k_eq = (k * k)/(k + k) = k/2. Time period T = 2π √(m / (k/2)) = √2 T0.'),
            ('Two identical springs of stiffness k in parallel with mass m', 'IV', 'T = T0 / √2 (effective stiffness 2k)', 'In parallel, effective stiffness is k_eq = k + k = 2k. Time period T = 2π √(m / (2k)) = T0 / √2.'),
            ('Four identical springs of stiffness k in parallel with mass m', 'II', 'T = T0 / 2 (effective stiffness 4k)', 'With four identical springs in parallel, effective stiffness is 4k. Time period is T = 2π √(m / (4k)) = T0 / 2.'),
        ],
        "D"
    ))

    # Q45 (intermediate, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_45",
        "Simple Harmonic Motion",
        "intermediate",
        'A particle executes SHM with period T and amplitude A, starting from the mean position x = 0 at t = 0 (x = A sin(2πt/T)). Match the transition in List I with the minimum time taken in List II:',
        [
            ('From x = 0 to x = A / 2', 'II', 't = T / 12', 'A sin(2πt/T) = A/2 => 2πt/T = π/6 => t = T / 12.'),
            ('From x = A / 2 to x = A', 'IV', 't = T / 6', 'Time to reach x = A is T/4. Time from A/2 to A is T/4 - T/12 = T/6.'),
            ('From x = 0 to x = A / √2', 'I', 't = T / 8', 'A sin(2πt/T) = A/√2 => 2πt/T = π/4 => t = T / 8.'),
            ('From x = - A / √2 to x = + A / √2', 'III', 't = T / 4', 'Time from -A/√2 to 0 is T/8, and from 0 to +A/√2 is T/8. Total time is T/8 + T/8 = T/4.'),
        ],
        "A"
    ))

    # Q46 (intermediate, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_46",
        "Simple Harmonic Motion",
        "intermediate",
        'A simple pendulum of length L is suspended inside an accelerated frame. Match the motion of the frame in List I with the effective time period T in List II:',
        [
            ('Elevator accelerating upwards with acceleration a', 'III', 'T = 2π √(L / (g + a))', 'In an upward accelerating elevator, effective gravity is g_eff = g + a, so T = 2π √(L / (g + a)).'),
            ('Elevator accelerating downwards with acceleration a (a < g)', 'I', 'T = 2π √(L / (g - a))', 'In a downward accelerating elevator, effective gravity is g_eff = g - a, so T = 2π √(L / (g - a)).'),
            ('Car accelerating horizontally with acceleration a', 'IV', 'T = 2π √(L / √(g² + a²))', 'In a horizontally accelerating car, effective gravity is g_eff = √(g² + a²), so T = 2π √(L / √(g² + a²)).'),
            ('Elevator in free fall under gravity (a = g downwards)', 'II', 'T = ∞ (no oscillation)', 'In free fall, effective gravity is g_eff = g - g = 0. The restoring torque vanishes, so T = ∞ and the pendulum does not oscillate.'),
        ],
        "B"
    ))

    # Q47 (intermediate, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_47",
        "Simple Harmonic Motion",
        "intermediate",
        'A compound (physical) pendulum has mass M, radius of gyration k_g about its center of mass (CM), and is suspended from a pivot at distance d from its CM. Match the pendulum property in List I with its formula in List II:',
        [
            ('Time period of small oscillations T', 'I', 'T = 2π √((k_g² + d²) / (g d))', 'By parallel axis theorem, I = M (k_g² + d²). Restoring torque is - M g d θ, so T = 2π √(I / (M g d)) = 2π √((k_g² + d²) / (g d)).'),
            ('Condition on suspension distance d for minimum time period', 'IV', 'd = k_g', 'Differentiating (k_g² + d²)/d with respect to d gives 1 - k_g²/d² = 0, so minimum occurs at d = k_g.'),
            ('Minimum possible time period T_min', 'II', 'T_min = 2π √(2 k_g / g)', 'Substituting d = k_g yields T_min = 2π √((2 k_g²) / (g k_g)) = 2π √(2 k_g / g).'),
            ('Equivalent length of a simple pendulum L_eq', 'III', 'L_eq = d + k_g² / d', 'Comparing T = 2π √(L_eq / g) with compound pendulum formula yields L_eq = (k_g² + d²) / d = d + k_g² / d.'),
        ],
        "C"
    ))

    # Q48 (intermediate, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_48",
        "Simple Harmonic Motion",
        "intermediate",
        'Match the oscillating physical system in List I with its angular frequency of small oscillations ω in List II:',
        [
            ('Liquid column of length L in a uniform vertical U-tube', 'IV', 'ω = √(2g / L)', 'When displaced by x, restoring force is - (2x A ρ) g = (A L ρ) d²x/dt², so d²x/dt² + (2g/L) x = 0, giving ω = √(2g/L).'),
            ('Cylinder of height H, density ρ floating in liquid of density σ (submerged depth h = Hρ/σ)', 'II', 'ω = √(g / h) = √(σ g / (ρ H))', 'Displacing downward by x produces excess buoyant force - σ A g x = (ρ A H) d²x/dt², so ω = √(σ g / (ρ H)) = √(g / h).'),
            ('Particle inside a straight frictionless tunnel drilled through Earth (radius R)', 'III', 'ω = √(g / R)', 'Gravitational force inside Earth is F = - (G M_E m / R³) x = - (m g / R) x, giving ω = √(g / R) (period ≈ 84.6 minutes).'),
            ('Torsional pendulum of moment of inertia I and torsional constant C', 'I', 'ω = √(C / I)', 'Restoring torque is τ = - C θ = I d²θ/dt², yielding angular frequency ω = √(C / I).'),
        ],
        "D"
    ))

    # Q49 (intermediate, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_49",
        "Simple Harmonic Motion",
        "intermediate",
        'Two blocks of masses m1 and m2 are connected by a spring of stiffness k on a frictionless horizontal floor. Match the oscillator parameter in List I with its formula in List II:',
        [
            ('Reduced mass μ of the system', 'II', 'μ = m1 m2 / (m1 + m2)', 'In the center-of-mass frame, the two-body motion reduces to a single particle of reduced mass μ = m1 m2 / (m1 + m2).'),
            ('Angular frequency of oscillation ω', 'I', 'ω = √(k / μ) = √(k (m1 + m2) / (m1 m2))', 'The equation of relative motion is μ d²x_rel/dt² = - k x_rel, giving ω = √(k / μ).'),
            ('Ratio of oscillation amplitudes (A1 / A2)', 'IV', 'A1 / A2 = m2 / m1', 'Since no external horizontal force acts, the center of mass remains stationary: m1 x1 + m2 x2 = 0, so A1 / A2 = m2 / m1.'),
            ('Distance of stationary node from mass m1 (spring length L0)', 'III', 'x_node = m2 L0 / (m1 + m2)', 'The point on the spring that does not move is the center of mass, located at distance m2 L0 / (m1 + m2) from m1.'),
        ],
        "A"
    ))

    # Q50 (intermediate, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_50",
        "Simple Harmonic Motion",
        "intermediate",
        'Two collinear SHMs x1 = A1 sin(ωt) and x2 = A2 sin(ωt + δ) superpose. Match the phase difference δ in List I with the resultant amplitude A_res in List II:',
        [
            ('Phase difference δ = 0', 'III', 'A_res = A1 + A2', 'When the two oscillations are exactly in phase, cos δ = 1, so A_res = √(A1² + A2² + 2A1 A2) = A1 + A2.'),
            ('Phase difference δ = π', 'IV', 'A_res = |A1 - A2|', 'When the two oscillations are in opposite phase, cos δ = -1, so A_res = √(A1² + A2² - 2A1 A2) = |A1 - A2|.'),
            ('Phase difference δ = π / 2', 'I', 'A_res = √(A1² + A2²)', 'When the two oscillations are in quadrature, cos δ = 0, so A_res = √(A1² + A2²).'),
            ('Phase difference δ = 2π / 3 with A1 = A2 = A', 'II', 'A_res = A', 'With equal amplitudes and δ = 120°, A_res = √(A² + A² + 2A² cos 120°) = √(2A² - A²) = A.'),
        ],
        "B"
    ))

    # Q51 (intermediate, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_51",
        "Simple Harmonic Motion",
        "intermediate",
        'A damped harmonic oscillator obeys m d²x/dt² + b dx/dt + k x = 0. Let γ = b / (2m) and natural frequency ω0 = √(k/m). Match the parameter in List I with its formula in List II:',
        [
            ('Damped angular frequency ω_d (underdamped case γ < ω0)', 'I', 'ω_d = √(ω0² - γ²)', 'The characteristic roots are -γ ± i √(ω0² - γ²), so the oscillation angular frequency is ω_d = √(ω0² - γ²).'),
            ('Damping constant b for critical damping', 'III', 'b = 2 √(k m)', 'Critical damping occurs when γ = ω0 => b / (2m) = √(k/m) => b = 2 √(k m).'),
            ('Time t_half for amplitude to decay to half of its initial value', 'II', 't_half = (ln 2) / γ = 2 m (ln 2) / b', 'Amplitude decays as A(t) = A0 exp(-γ t). Setting A(t) = A0 / 2 gives exp(γ t) = 2, so t_half = (ln 2) / γ = 2m ln 2 / b.'),
            ('Quality factor Q of the oscillator', 'IV', 'Q = ω0 / (2γ) = m ω0 / b', 'Quality factor is defined as 2π * (energy stored / energy dissipated per cycle) = ω0 / (2γ) = m ω0 / b.'),
        ],
        "C"
    ))

    # Q52 (intermediate, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_52",
        "Simple Harmonic Motion",
        "intermediate",
        'A driven damped harmonic oscillator satisfies d²x/dt² + 2γ dx/dt + ω0² x = (F0 / m) cos(ωt). Match the forced oscillation phenomenon in List I with its condition / formula in List II:',
        [
            ('Driving frequency for amplitude resonance ω_res', 'IV', 'ω_res = √(ω0² - 2γ²)', 'Maximizing amplitude A(ω) = (F0/m) / √((ω0² - ω²)² + 4γ²ω²) gives the amplitude resonance condition ω = √(ω0² - 2γ²).'),
            ('Driving frequency for velocity resonance (maximum power absorption)', 'I', 'ω = ω0', 'Velocity amplitude is maximum when the mechanical impedance is purely resistive, which occurs at exactly ω = ω0.'),
            ('Phase lag φ between driving force and displacement at ω = ω0', 'III', 'φ = π / 2', 'At ω = ω0, tan φ = 2γ ω / (ω0² - ω²) → ∞, so the displacement lags the driving force by exactly π/2.'),
            ('Displacement amplitude at very low driving frequency (ω → 0)', 'II', 'A0 = F0 / (m ω0²) = F0 / k', 'When driving frequency ω → 0, inertia and damping forces are negligible; the displacement is simply the static extension A0 = F0 / k.'),
        ],
        "D"
    ))

    # Q53 (advanced, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_53",
        "Simple Harmonic Motion",
        "advanced",
        'Two perpendicular SHMs x = A sin(ωt) and y = B sin(ωt + δ) of identical frequency superpose on a particle. Match the phase difference δ in List I with the resulting particle trajectory (Lissajous figure) in List II:',
        [
            ('Phase difference δ = 0', 'II', 'Straight line y = (B/A) x passing through 1st and 3rd quadrants', 'When δ = 0, y/B = x/A, so y = (B/A) x, which is a straight line of positive slope.'),
            ('Phase difference δ = π / 2 with A = B', 'IV', 'Circle of radius A: x² + y² = A²', 'When δ = π/2 and A = B, x = A sin(ωt) and y = A cos(ωt), giving x² + y² = A².'),
            ('Phase difference δ = π / 2 with A ≠ B', 'I', 'Symmetric ellipse: x² / A² + y² / B² = 1', 'When δ = π/2 and A ≠ B, x/A = sin(ωt) and y/B = cos(ωt), so x²/A² + y²/B² = 1.'),
            ('Phase difference δ = π', 'III', 'Straight line y = - (B/A) x passing through 2nd and 4th quadrants', 'When δ = π, y/B = - sin(ωt) = - x/A, so y = - (B/A) x, which is a straight line of negative slope.'),
        ],
        "A"
    ))

    # Q54 (advanced, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_54",
        "Simple Harmonic Motion",
        "advanced",
        "A simple pendulum has length L comparable to Earth's radius R. Its time period is given by T = 2π / √(g (1/L + 1/R)). Match the pendulum length in List I with its time period in List II:",
        [
            ('Small length L << R (laboratory pendulum)', 'III', 'T = 2π √(L / g)', 'When L << R, 1/L >> 1/R, so 1/L + 1/R ≈ 1/L, giving the familiar formula T = 2π √(L/g).'),
            ('Length equal to Earth radius L = R', 'I', 'T = 2π √(R / (2g)) ≈ 59.8 minutes', 'When L = R, 1/L + 1/R = 2/R, giving T = 2π √(R / (2g)) ≈ 84.6 / √2 ≈ 59.8 minutes.'),
            ('Infinite length L → ∞', 'IV', 'T = 2π √(R / g) ≈ 84.6 minutes', 'When L → ∞, 1/L → 0, so 1/L + 1/R = 1/R, yielding T = 2π √(R / g) ≈ 84.6 minutes.'),
            ('Ratio of time period for L = R to that for L → ∞', 'II', '1 / √2 ≈ 0.707', 'The ratio is [2π √(R/(2g))] / [2π √(R/g)] = 1 / √2 ≈ 0.707.'),
        ],
        "B"
    ))

    # Q55 (advanced, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_55",
        "Simple Harmonic Motion",
        "advanced",
        'Match the rolling / pivoting oscillator in List I with its angular frequency of small oscillations ω in List II:',
        [
            ('Solid cylinder (mass M) rolling without slipping attached to spring k', 'I', 'ω = √(2k / (3M))', 'Total kinetic energy is (1/2) M v² + (1/2) (1/2 M R²)(v/R)² = (3/4) M v². Effective mass is (3/2) M, so ω = √(k / (3M/2)) = √(2k / (3M)).'),
            ('Uniform solid sphere (mass M) rolling without slipping attached to spring k', 'IV', 'ω = √(5k / (7M))', 'Total KE is (1/2) M v² + (1/2) (2/5 M R²)(v/R)² = (7/10) M v². Effective mass is (7/5) M, so ω = √(k / (7M/5)) = √(5k / (7M)).'),
            ('Thin cylindrical hoop / shell (mass M) rolling without slipping attached to spring k', 'II', 'ω = √(k / (2M))', 'Total KE is (1/2) M v² + (1/2) (M R²)(v/R)² = M v². Effective mass is 2M, so ω = √(k / (2M)).'),
            ('Uniform thin rod of mass M, length L hinged at one end swinging under gravity', 'III', 'ω = √(3g / (2L))', 'Restoring torque is - M g (L/2) θ and I_pivot = (1/3) M L². Thus ω = √((M g L / 2) / (M L² / 3)) = √(3g / (2L)).'),
        ],
        "C"
    ))

    # Q56 (advanced, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_56",
        "Simple Harmonic Motion",
        "advanced",
        'A particle of mass m moves in a potential V(x) = V0 [(a/x)² - 2(a/x)]. Match the oscillation parameter in List I with its formula in List II:',
        [
            ('Equilibrium position x0', 'IV', 'x0 = a', 'Setting dV/dx = V0 [-2 a² / x³ + 2 a / x²] = 0 yields x0 = a.'),
            ('Potential energy at equilibrium V(x0)', 'II', 'V_min = - V0', 'Substituting x0 = a gives V(a) = V0 [1 - 2] = - V0.'),
            ('Effective spring constant k_eff = (d²V/dx²)|_x0', 'I', 'k_eff = 2 V0 / a²', 'd²V/dx² = V0 [6 a² / x⁴ - 4 a / x³]. Evaluating at x = a yields k_eff = V0 (6/a² - 4/a²) = 2 V0 / a².'),
            ('Angular frequency of small oscillations ω', 'III', 'ω = √(2 V0 / (m a²))', 'Angular frequency of small oscillations about the stable minimum is ω = √(k_eff / m) = √(2 V0 / (m a²)).'),
        ],
        "D"
    ))

    # Q57 (advanced, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_57",
        "Simple Harmonic Motion",
        "advanced",
        'A bullet of mass m moving horizontally with speed v embeds into a block of mass M attached to a horizontal spring of stiffness k. Match the collision / SHM quantity in List I with its expression in List II:',
        [
            ('Speed V0 of (block + bullet) immediately after collision', 'II', 'V0 = m v / (M + m)', 'By conservation of linear momentum during the instantaneous inelastic impact: m v = (M + m) V0 => V0 = m v / (M + m).'),
            ('Amplitude A of subsequent SHM', 'I', 'A = m v / √((M + m) k)', 'Conservation of mechanical energy after collision: (1/2) (M + m) V0² = (1/2) k A² => A = V0 √((M+m)/k) = m v / √((M + m) k).'),
            ('Fraction of initial kinetic energy dissipated during collision', 'IV', 'M / (M + m)', 'Initial KE = (1/2) m v². Post-impact KE = (1/2) (M+m) V0² = (1/2) m² v² / (M+m). Fraction lost = 1 - m/(M+m) = M / (M + m).'),
            ('Time period of subsequent SHM', 'III', 'T = 2π √((M + m) / k)', 'The oscillating body now has total mass (M + m), so time period is T = 2π √((M + m) / k).'),
        ],
        "A"
    ))

    # Q58 (advanced, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_58",
        "Simple Harmonic Motion",
        "advanced",
        'Two identical masses m are connected to each other and fixed side-walls by three identical springs of stiffness k along a straight line. Match the normal mode parameter in List I with its description / value in List II:',
        [
            ('Angular frequency of symmetric mode ω1', 'III', 'ω1 = √(k / m)', 'In the symmetric mode, both masses move in the same direction with equal displacement (x1 = x2). The middle spring is unstretched, so restoring force on each mass is -kx, giving ω1 = √(k/m).'),
            ('Angular frequency of antisymmetric mode ω2', 'IV', 'ω2 = √(3k / m)', 'In the antisymmetric mode, masses move in opposite directions (x1 = -x2). The middle spring is stretched by 2x, so net restoring force is -kx - 2kx = -3kx, giving ω2 = √(3k/m).'),
            ('Ratio of normal mode frequencies (ω2 / ω1)', 'I', '√3 ≈ 1.732', 'The ratio of the antisymmetric to symmetric normal frequencies is √(3k/m) / √(k/m) = √3 ≈ 1.732.'),
            ('State of the middle coupling spring in symmetric mode', 'II', 'Remains at its natural length (zero tension / compression)', 'Because x1(t) = x2(t) at all times in the symmetric mode, the length of the central spring does not change.'),
        ],
        "B"
    ))

    # Q59 (advanced, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_59",
        "Simple Harmonic Motion",
        "advanced",
        'In phase space (position x vs momentum p = m v), a simple harmonic oscillator of mass m, frequency ω, and total energy E traces a path. Match the phase space property in List I with its formula in List II:',
        [
            ('Equation of the phase space orbit', 'I', 'x² / (2E / (m ω²)) + p² / (2 m E) = 1 (an ellipse)', 'Total energy is E = p² / (2m) + (1/2) m ω² x². Rearranging gives the standard equation of an ellipse.'),
            ('Area enclosed by phase space orbit J = ∮ p dx', 'II', 'J = 2π E / ω', 'The area of the ellipse with semi-axes a = √(2E/(mω²)) and b = √(2mE) is π a b = π √(4 E² / ω²) = 2π E / ω.'),
            ('Adiabatic invariant when spring stiffness k is varied slowly', 'IV', 'J / (2π) = E / ω = constant', 'Under slow (adiabatic) variation of system parameters, the action integral ∮ p dx = 2π E / ω remains strictly invariant.'),
            ('Scaling of amplitude A if spring stiffness k increases slowly by factor of 16', 'III', 'Amplitude decreases by a factor of 2 (A ∝ k^(-1/4))', 'Since E/ω = const, (1/2 m ω² A²)/ω = const => ω A² = const. Since ω ∝ √k, A ∝ k^(-1/4). Increasing k by 16 reduces A by 16^(1/4) = 2.'),
        ],
        "C"
    ))

    # Q60 (advanced, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_60",
        "Simple Harmonic Motion",
        "advanced",
        'For a particle executing SHM with amplitude A, angular frequency ω, and total energy E = (1/2) m ω² A², match the average energy quantity in List I with its value in List II:',
        [
            ('Time average of kinetic energy <K>_time over one period', 'II', '<K>_time = E / 2', 'Time average of sin²(ωt) over a full cycle is 1/2, so <K>_time = (1/2) E.'),
            ('Ratio of time average of kinetic energy to time average of potential energy (<K>_time / <U>_time)', 'IV', '1.0 (equal energy partitioning over time)', 'Since <K>_time = E/2 and <U>_time = E/2, their ratio is identically 1.0.'),
            ('Space average of kinetic energy <K>_space over [-A, +A]', 'I', '<K>_space = 2 E / 3', '<K>_space = (1/(2A)) ∫ (1/2) m ω² (A² - x²) dx = (1/(2A)) (1/2 m ω²) [2A³ - 2A³/3] = (1/2 m ω² A²) (2/3) = 2E / 3.'),
            ('Space average of potential energy <U>_space over [-A, +A]', 'III', '<U>_space = E / 3', '<U>_space = (1/(2A)) ∫ (1/2) m ω² x² dx = (1/(2A)) (1/2 m ω²) (2A³/3) = (1/2 m ω² A²) (1/3) = E / 3.'),
        ],
        "D"
    ))

    # ==========================================
    # TOPIC: Waves (20 questions)
    # ==========================================
    prefix = "phy_waves"

    # Q61 (beginner, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_61",
        "Waves",
        "beginner",
        'For a sinusoidal travelling wave y(x,t) = A sin(kx - ωt + φ), match the wave parameter in List I with its formula in List II:',
        [
            ('Wave propagation speed v', 'III', 'v = ω / k = f λ', 'The phase of the wave is kx - ωt = const, so dx/dt = ω / k = (2π f) / (2π / λ) = f λ.'),
            ('Propagation constant (wave number) k', 'I', 'k = 2π / λ', 'Wave number represents spatial frequency, defined as k = 2π / λ.'),
            ('Maximum transverse particle speed v_p,max', 'IV', 'v_p,max = ω A', 'Particle velocity is v_p = ∂y/∂t = - ω A cos(kx - ωt + φ), whose maximum value is ω A.'),
            ('Relation between particle velocity v_p and wave slope (∂y/∂x)', 'II', 'v_p = - v (∂y/∂x)', 'Since ∂y/∂t = -ω A cos(...) and ∂y/∂x = k A cos(...), dividing gives ∂y/∂t = - (ω/k) (∂y/∂x) = - v (∂y/∂x).'),
        ],
        "A"
    ))

    # Q62 (beginner, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_62",
        "Waves",
        "beginner",
        'A transverse wave travels on a stretched string with initial speed v = √(T / μ). Match the modification in List I with the resulting wave speed in List II:',
        [
            ('Tension is increased to 4T while μ remains constant', 'I', "v' = 2 v", "v' = √(4T / μ) = 2 √(T / μ) = 2 v."),
            ('Linear mass density is increased to 4μ while tension T remains constant', 'III', "v' = v / 2", "v' = √(T / (4μ)) = (1/2) √(T / μ) = v / 2."),
            ('Tension is increased to 9T while μ remains constant', 'II', "v' = 3 v", "v' = √(9T / μ) = 3 √(T / μ) = 3 v."),
            ('Linear mass density is increased to 9μ while tension T remains constant', 'IV', "v' = v / 3", "v' = √(T / (9μ)) = (1/3) √(T / μ) = v / 3."),
        ],
        "B"
    ))

    # Q63 (beginner, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_63",
        "Waves",
        "beginner",
        'Match the formula / medium for longitudinal sound wave speed in List I with its expression in List II:',
        [
            ("Newton's formula for speed of sound in ideal gas (isothermal)", 'IV', 'v = √(P / ρ)', 'Newton assumed sound propagation is isothermal, where isothermal bulk modulus B_iso = P, giving v = √(P / ρ).'),
            ("Laplace's corrected formula for speed of sound in ideal gas (adiabatic)", 'II', 'v = √(γ P / ρ) = √(γ R T / M)', 'Laplace recognized sound vibrations are adiabatic, where B_ad = γ P, giving v = √(γ P / ρ) = √(γ R T / M).'),
            ('Speed of longitudinal sound wave in an extended bulk fluid (bulk modulus B)', 'I', 'v = √(B / ρ)', 'In an extended fluid medium, elastic restoring property is bulk modulus B, so wave speed is v = √(B / ρ).'),
            ("Speed of longitudinal wave along a thin solid rod (Young's modulus Y)", 'III', 'v = √(Y / ρ)', "In a thin rod free to expand laterally, elastic modulus is Young's modulus Y, giving v = √(Y / ρ)."),
        ],
        "C"
    ))

    # Q64 (beginner, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_64",
        "Waves",
        "beginner",
        'A string of length L is fixed at both ends (x = 0 and x = L). Match the standing wave property in List I with its formula in List II (v is wave speed on string):',
        [
            ('Fundamental frequency f1', 'II', 'f1 = v / (2L)', 'In the fundamental mode, L = λ/2 => λ = 2L, giving f1 = v / (2L).'),
            ('Frequency of the nth harmonic fn', 'IV', 'fn = n v / (2L) (n = 1, 2, 3, ...)', 'Harmonics are integer multiples of the fundamental: fn = n f1 = n v / (2L).'),
            ('Distance between two consecutive displacement nodes', 'I', 'λ / 2', 'Nodes occur at sin(kx) = 0 => kx = m π => x = m λ / 2, so distance between consecutive nodes is λ / 2.'),
            ('Distance between an adjacent node and antinode', 'III', 'λ / 4', 'Antinodes occur at kx = (m + 1/2) π => x = (m + 1/2) λ / 2. The separation from the nearest node is λ / 4.'),
        ],
        "D"
    ))

    # Q65 (intermediate, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_65",
        "Waves",
        "intermediate",
        'Match the organ pipe resonant mode in List I with its characteristic frequency expression in List II (v is speed of sound in air, L is pipe length):',
        [
            ('Fundamental frequency of an open organ pipe (both ends open)', 'I', 'f = v / (2L)', 'Both ends are displacement antinodes: L = λ/2, giving fundamental frequency f = v / (2L).'),
            ('Fundamental frequency of a closed organ pipe (one end closed)', 'III', 'f = v / (4L)', 'Closed end is node, open end is antinode: L = λ/4, giving fundamental frequency f = v / (4L).'),
            ('Second harmonic frequency of an open organ pipe', 'IV', 'f = 2 (v / (2L)) = v / L', 'An open pipe produces all integer harmonics: the second harmonic is f2 = 2 * (v / 2L) = v / L.'),
            ('Third harmonic (first overtone) of a closed organ pipe', 'II', 'f = 3 (v / (4L))', 'A closed pipe produces only odd harmonics: the first overtone corresponds to the third harmonic f3 = 3 v / (4L).'),
        ],
        "A"
    ))

    # Q66 (intermediate, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_66",
        "Waves",
        "intermediate",
        'In a resonance tube experiment with end correction e, a tuning fork of frequency f resonates at water column lengths L1 and L2 (first and second resonance). Match the acoustic parameter in List I with its formula in List II:',
        [
            ('First resonance condition', 'III', 'L1 + e = λ / 4', 'The acoustic length for the first resonance of a closed pipe is L1 + e = λ / 4.'),
            ('Second resonance condition', 'I', 'L2 + e = 3λ / 4', 'The acoustic length for the second resonance of a closed pipe is L2 + e = 3λ / 4.'),
            ('Speed of sound v in air', 'IV', 'v = 2 f (L2 - L1)', 'Subtracting the two equations gives (L2 - L1) = λ / 2 => λ = 2 (L2 - L1). Thus v = f λ = 2 f (L2 - L1).'),
            ('End correction e of the tube', 'II', 'e = (L2 - 3 L1) / 2', 'From 3(L1 + e) = L2 + e => 3 L1 + 3e = L2 + e => 2e = L2 - 3 L1 => e = (L2 - 3 L1) / 2.'),
        ],
        "B"
    ))

    # Q67 (intermediate, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_67",
        "Waves",
        "intermediate",
        'Two tuning forks A and B produce beats. Match the tuning fork scenario in List I with the correct frequency deduction in List II:',
        [
            ('Tuning forks of frequencies 256 Hz and 260 Hz sounded together', 'II', 'Beat frequency f_beat = 4 Hz', 'Beat frequency is the absolute difference of the two source frequencies: f_beat = |256 - 260| = 4 Hz.'),
            ('Fork A (256 Hz) gives 4 beats/s with B; loading A with wax decreases beat frequency to 2 beats/s', 'IV', 'Frequency of fork B is 252 Hz', "Loading A with wax lowers f_A below 256 Hz. If f_B = 252 Hz, then |f_A' - 252| decreases from 4 to 2, which matches."),
            ('Fork A (256 Hz) gives 4 beats/s with B; loading A with wax increases beat frequency to 6 beats/s', 'I', 'Frequency of fork B is 260 Hz', "If f_B = 260 Hz, lowering f_A increases the difference |f_A' - 260| from 4 to 6, which matches."),
            ('Time interval between consecutive maximum and minimum sound intensity in beats', 'III', 'Δt = 1 / (2 f_beat)', 'One beat period is T_beat = 1 / f_beat. The time from maximum to adjacent minimum intensity is half of this period: Δt = 1 / (2 f_beat).'),
        ],
        "C"
    ))

    # Q68 (intermediate, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_68",
        "Waves",
        "intermediate",
        "A sound source of frequency f emits sound with speed v in still air. Match the relative motion of source (v_s) and observer (v_o) along the line of sight in List I with the detected frequency f' in List II:",
        [
            ('Source moving toward stationary observer at speed v_s', 'I', "f' = f [v / (v - v_s)]", "Wavelength is compressed in front of the approaching source: λ' = (v - v_s)/f, so detected frequency is f' = v / λ' = f [v / (v - v_s)]."),
            ('Source moving away from stationary observer at speed v_s', 'III', "f' = f [v / (v + v_s)]", "Wavelength is elongated behind the receding source: λ' = (v + v_s)/f, so detected frequency is f' = f [v / (v + v_s)]."),
            ('Observer moving toward stationary source at speed v_o', 'II', "f' = f [(v + v_o) / v]", "Relative speed of wave fronts encountered by approaching observer is v + v_o, so detected frequency is f' = (v + v_o) / λ = f [(v + v_o) / v]."),
            ('Observer moving away from stationary source at speed v_o', 'IV', "f' = f [(v - v_o) / v]", "Relative speed of wave fronts encountered by receding observer is v - v_o, so detected frequency is f' = (v - v_o) / λ = f [(v - v_o) / v]."),
        ],
        "D"
    ))

    # Q69 (intermediate, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_69",
        "Waves",
        "intermediate",
        'For a harmonic wave of amplitude A and angular frequency ω travelling through a medium of density ρ and wave speed v, match the wave energy parameter in List I with its formula in List II:',
        [
            ('Average energy density u_avg (energy per unit volume)', 'IV', 'u_avg = (1/2) ρ ω² A²', 'Energy density is the sum of time-averaged kinetic and potential energy densities: u_avg = (1/4) ρ ω² A² + (1/4) ρ ω² A² = (1/2) ρ ω² A².'),
            ('Wave intensity I (energy transmitted per unit area per second)', 'II', 'I = (1/2) ρ v ω² A²', 'Intensity is energy density times propagation speed: I = u_avg * v = (1/2) ρ v ω² A².'),
            ('Pressure amplitude ΔP0 in a sound wave with displacement amplitude s0', 'I', 'ΔP0 = ρ v ω s0 = B k s0', 'Excess acoustic pressure is ΔP = - B (∂s/∂x) = B k s0 cos(kx - ωt). Since B = ρ v², ΔP0 = (ρ v²) (ω/v) s0 = ρ v ω s0.'),
            ('Intensity of sound in terms of pressure amplitude ΔP0', 'III', 'I = (ΔP0)² / (2 ρ v)', 'Substituting s0 = ΔP0 / (ρ v ω) into I = (1/2) ρ v ω² s0² yields I = (ΔP0)² / (2 ρ v).'),
        ],
        "A"
    ))

    # Q70 (intermediate, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_70",
        "Waves",
        "intermediate",
        'Sound intensity level in decibels is defined by β = 10 log10(I / I0) with reference intensity I0 = 10^(-12) W/m². Match the acoustic change in List I with the resulting decibel level / change in List II:',
        [
            ('Sound intensity is doubled (I2 = 2 I1)', 'II', 'Level increases by +3.01 dB', 'Δβ = 10 log10(2 I1 / I1) = 10 log10(2) ≈ 10 * 0.3010 = +3.01 dB.'),
            ('10 identical uncorrelated sound sources each of 60 dB sound simultaneously', 'I', 'Resultant level is 70 dB', 'Total intensity is 10 * I1. β_tot = 10 log10(10 I1 / I0) = β1 + 10 log10(10) = 60 + 10 = 70 dB.'),
            ('Distance from a point source in open space is doubled (r2 = 2 r1)', 'IV', 'Level decreases by -6.02 dB', 'By inverse square law, I ∝ 1/r², so I2 = I1 / 4. Δβ = 10 log10(1/4) = - 20 log10(2) ≈ -6.02 dB.'),
            ('Intensity equal to the standard threshold of hearing (I = I0)', 'III', 'Level is 0 dB', 'β = 10 log10(I0 / I0) = 10 log10(1) = 0 dB.'),
        ],
        "B"
    ))

    # Q71 (intermediate, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_71",
        "Waves",
        "intermediate",
        'A wave pulse on string 1 (linear density μ1, wave speed v1) meets a junction with string 2 (linear density μ2, wave speed v2). Match the boundary coefficient / phase in List I with its formula in List II:',
        [
            ('Amplitude reflection coefficient r = A_r / A_i', 'III', 'r = (v2 - v1) / (v2 + v1) = (√μ1 - √μ2) / (√μ1 + √μ2)', 'From boundary conditions of continuous displacement and continuous slope, r = (v2 - v1)/(v2 + v1) = (√μ1 - √μ2)/(√μ1 + √μ2).'),
            ('Amplitude transmission coefficient t = A_t / A_i', 'IV', 't = 2 v2 / (v1 + v2) = 2 √μ1 / (√μ1 + √μ2)', 'From continuity of displacement: 1 + r = t, which gives t = 2 v2 / (v1 + v2) = 2 √μ1 / (√μ1 + √μ2).'),
            ('Phase shift upon reflection when string 2 is denser (μ2 > μ1)', 'I', 'π rad (180° inversion)', 'When μ2 > μ1, v2 < v1, making r negative. A negative reflection coefficient corresponds to a phase reversal of π radians.'),
            ('Phase shift upon transmission into string 2', 'II', '0 rad (never inverts)', 'Because t = 2 v2 / (v1 + v2) is always strictly positive for any pair of strings, the transmitted wave is always in phase with the incident wave.'),
        ],
        "C"
    ))

    # Q72 (intermediate, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_72",
        "Waves",
        "intermediate",
        'A uniform heavy rope of mass M and length L hangs vertically from a rigid ceiling under gravity g. Match the wave pulse property in List I with its formula in List II (x is distance measured upward from the lower free end):',
        [
            ('Wave speed at distance x from the bottom v(x)', 'I', 'v(x) = √(g x)', 'Tension at distance x from free end is T(x) = (M/L) x g = μ g x. Wave speed is v(x) = √(T(x)/μ) = √(g x).'),
            ('Acceleration of the wave pulse a = v dv/dx', 'II', 'a = g / 2 (uniform acceleration)', 'v = √(gx), so dv/dx = g / (2 √(gx)). Acceleration is a = v (dv/dx) = √(gx) * [g / (2 √(gx))] = g / 2, which is constant!'),
            ('Total time taken for a pulse to travel from bottom to top', 'IV', 't_total = 2 √(L / g)', 'Using v = dx/dt => dt = dx / √(gx). Integrating from 0 to L gives t = [2 √(x/g)]_0^L = 2 √(L / g).'),
            ('Time taken for pulse to travel the lower half of the rope (x = 0 to L/2)', 'III', 't_half = √2 √(L / g) ≈ 1.414 √(L / g)', 'Integrating from 0 to L/2 gives t = 2 √(L / (2g)) = √2 √(L / g) ≈ 1.414 √(L / g).'),
        ],
        "D"
    ))

    # Q73 (advanced, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_73",
        "Waves",
        "advanced",
        "Match the Doppler effect / sound reflection scenario in List I with the detected frequency f' in List II (v is sound speed, f is source frequency):",
        [
            ('Wind blowing at speed w from stationary source toward stationary observer', 'IV', "f' = f (unaffected by wind when both are stationary)", "Wind increases effective wave speed to v + w and expands wavelength to λ' = (v + w)/f, leaving detected frequency f' = (v + w)/λ' = f unchanged."),
            ('Source moves with speed v_s at angle θ to the line connecting it to stationary observer', 'I', "f' = f [v / (v - v_s cos θ)]", "The component of source velocity along the line of sight is v_s cos θ, so Doppler shifted frequency is f' = f [v / (v - v_s cos θ)]."),
            ('Sound from stationary source reflects off an approaching car (speed u), detected back at source', 'III', "f' = f [(v + u) / (v - u)]", "First, car receives frequency f1 = f (v + u)/v. Then car acts as moving source emitting toward stationary detector: f' = f1 [v / (v - u)] = f [(v + u) / (v - u)]."),
            ('Sound from stationary source reflects off a receding car (speed u), detected back at source', 'II', "f' = f [(v - u) / (v + u)]", "Car receives frequency f1 = f (v - u)/v, then reradiates as receding source: f' = f1 [v / (v + u)] = f [(v - u) / (v + u)]."),
        ],
        "A"
    ))

    # Q74 (advanced, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_74",
        "Waves",
        "advanced",
        'For a standing wave y(x,t) = 2A sin(kx) cos(ωt) on a string of linear mass density μ, match the energy parameter in List I with its formula in List II:',
        [
            ('Condition when total energy in a loop is purely kinetic', 'II', 'cos(ωt) = 0 (when string is completely flat, y = 0 everywhere)', 'When cos(ωt) = 0, y(x,t) = 0 everywhere, so potential (elastic) energy is zero and all energy is kinetic.'),
            ('Condition when total energy in a loop is purely potential', 'IV', 'sin(ωt) = 0 (when all particles momentarily come to rest at extreme displacement)', 'Particle velocity v_p = ∂y/∂t ∝ sin(ωt). When sin(ωt) = 0, velocity is zero everywhere, so kinetic energy is zero and all energy is stored as elastic strain energy.'),
            ('Total energy stored in one loop (between adjacent nodes)', 'I', 'E_loop = (1/2) μ ω² A² λ', 'Integrating energy density over one loop of length λ/2 yields E_loop = (1/4) μ ω² (2A)² (λ/2) = (1/2) μ ω² A² λ.'),
            ('Time-averaged power transmitted across any cross-section of the string', 'III', 'P_avg = 0', 'In an ideal standing wave, energy sloshes back and forth between kinetic and potential forms within each loop, with zero net time-averaged energy transport across nodes.'),
        ],
        "B"
    ))

    # Q75 (advanced, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_75",
        "Waves",
        "advanced",
        'A supersonic aircraft flies horizontally at speed v_s > v (where v is sound speed in air, Mach number M = v_s / v > 1) at altitude h. Match the shock wave parameter in List I with its formula in List II:',
        [
            ('Semi-vertical angle α of the Mach cone', 'III', 'sin α = v / v_s = 1 / M', 'The envelope of spherical wave fronts forms a cone with half-angle satisfying sin α = (v t) / (v_s t) = v / v_s = 1 / M.'),
            ('Mach angle α for an aircraft flying at Mach 2 (M = 2)', 'I', 'α = 30°', 'When M = 2, sin α = 1/2, giving Mach cone half-angle α = 30°.'),
            ('Ground distance behind the aircraft where the shock front meets the ground', 'IV', 'x = h √(M² - 1)', 'From the geometry of the Mach cone, cot α = √(1 - sin²α) / sin α = √(1 - 1/M²) / (1/M) = √(M² - 1). Ground distance is x = h cot α = h √(M² - 1).'),
            ('Time delay between aircraft flying directly overhead and observer hearing sonic boom', 'II', 'Δt = (h / v_s) √(M² - 1)', 'The aircraft travels distance x = h √(M² - 1) before the shock front reaches the observer, taking time Δt = x / v_s = (h / v_s) √(M² - 1).'),
        ],
        "C"
    ))

    # Q76 (advanced, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_76",
        "Waves",
        "advanced",
        'Match the wave dispersion property in List I with its expression in List II (phase velocity v_p = ω/k, group velocity v_g = dω/dk):',
        [
            ('General relationship between group velocity and phase velocity', 'I', 'v_g = v_p + k (dv_p / dk) = v_p - λ (dv_p / dλ)', 'Since ω = k v_p, differentiating with respect to k gives dω/dk = v_p + k (dv_p / dk). In terms of wavelength, v_g = v_p - λ (dv_p / dλ).'),
            ('Deep water gravity waves (dispersion relation ω² = g k)', 'IV', 'v_p = √(g / k) and v_g = v_p / 2', 'ω = √(g k), so v_p = ω/k = √(g/k). Group velocity is v_g = dω/dk = (1/2) √(g/k) = v_p / 2.'),
            ('Capillary surface ripples dominated by surface tension T_s (ω² = T_s k³ / ρ)', 'II', 'v_p = √(T_s k / ρ) and v_g = (3/2) v_p', 'ω = √(T_s / ρ) k^(3/2), so v_p = ω/k = √(T_s k / ρ). Group velocity is v_g = dω/dk = (3/2) v_p.'),
            ('Non-dispersive sound waves in air (ω = v k)', 'III', 'v_g = v_p = constant', 'When ω is linearly proportional to k, dv_p / dk = 0, so group velocity equals phase velocity: v_g = v_p = constant.'),
        ],
        "D"
    ))

    # Q77 (advanced, Choice A)
    qs.append(make_matrix_q(
        f"{prefix}_77",
        "Waves",
        "advanced",
        'Two strings of linear mass densities μ1 and μ2 are joined end-to-end under tension T. A standing wave is established with a node at the junction. Match the composite string property in List I with its ratio / condition in List II:',
        [
            ('Ratio of wavelengths in the two sections (λ1 / λ2)', 'IV', 'λ1 / λ2 = √(μ2 / μ1)', 'Since frequency f is identical in both sections, λ1 / λ2 = v1 / v2 = √(T/μ1) / √(T/μ2) = √(μ2 / μ1).'),
            ('Ratio of oscillation frequencies in the two sections (f1 / f2)', 'II', '1.0 (frequency is invariant across boundary)', 'For a continuous wave across a boundary, the frequency of vibration is dictated by the driving source and is strictly identical everywhere.'),
            ('Ratio of wave numbers (k1 / k2)', 'I', 'k1 / k2 = √(μ1 / μ2)', 'Wave number is inversely proportional to wavelength: k1 / k2 = λ2 / λ1 = √(μ1 / μ2).'),
            ('Condition for junction to be a node for strings of lengths L1 and L2 fixed at outer ends', 'III', 'L1 / λ1 = n1 / 2 and L2 / λ2 = n2 / 2 (n1, n2 are integers)', 'For both outer boundaries and the junction to be nodes, each segment must contain an integral number of half-wavelength loops.'),
        ],
        "A"
    ))

    # Q78 (advanced, Choice B)
    qs.append(make_matrix_q(
        f"{prefix}_78",
        "Waves",
        "advanced",
        "In a Kundt's tube experiment, a metal rod of length L_rod and density ρ clamped at its midpoint vibrates longitudinally in its fundamental mode, producing acoustic standing waves in a gas tube. Match the parameter in List I with its formula in List II:",
        [
            ('Wavelength of longitudinal sound wave in the clamped metal rod', 'II', 'λ_rod = 2 L_rod', 'Clamping at center creates a displacement node at center and antinodes at free ends, so L_rod = λ_rod / 2 => λ_rod = 2 L_rod.'),
            ('Speed of longitudinal sound in the metal rod v_rod', 'I', 'v_rod = √(Y / ρ)', "For longitudinal waves along a solid rod, the speed is determined by Young's modulus: v_rod = √(Y / ρ)."),
            ('Ratio of sound speeds in rod and gas (v_rod / v_gas)', 'IV', 'v_rod / v_gas = 2 L_rod / λ_gas', 'Since frequency is identical, v_rod / v_gas = λ_rod / λ_gas = 2 L_rod / λ_gas.'),
            ('Distance between consecutive Lycopodium powder heaps in the tube', 'III', 'd = λ_gas / 2', 'Powder heaps collect at displacement nodes (regions of quiet air). The distance between consecutive displacement nodes is λ_gas / 2.'),
        ],
        "B"
    ))

    # Q79 (advanced, Choice C)
    qs.append(make_matrix_q(
        f"{prefix}_79",
        "Waves",
        "advanced",
        'A sound source of frequency f0 moves in a horizontal circle of radius R with constant angular speed ω_s (speed v_s = ω_s R < v). A distant stationary observer is in the same plane at distance D >> R. Match the detection state in List I with the observed frequency in List II:',
        [
            ('Maximum observed frequency f_max', 'III', 'f_max = f0 [v / (v - ω_s R)]', "Maximum frequency occurs when the source's velocity vector points directly toward the observer: v_s,eff = + ω_s R, giving f_max = f0 [v / (v - ω_s R)]."),
            ('Minimum observed frequency f_min', 'IV', 'f_min = f0 [v / (v + ω_s R)]', "Minimum frequency occurs when the source's velocity vector points directly away from the observer: v_s,eff = - ω_s R, giving f_min = f0 [v / (v + ω_s R)]."),
            ('Observed frequency when source velocity is perpendicular to line of sight', 'I', 'f = f0', 'When source velocity is perpendicular to the line of sight, radial velocity is zero, so there is no Doppler shift along line of sight: f = f0.'),
            ('Difference between maximum and minimum observed frequencies (f_max - f_min)', 'II', 'f0 [2 v ω_s R / (v² - ω_s² R²)]', 'f_max - f_min = f0 v [1/(v - v_s) - 1/(v + v_s)] = f0 v [2 v_s / (v² - v_s²)] = f0 [2 v ω_s R / (v² - ω_s² R²)].'),
        ],
        "C"
    ))

    # Q80 (advanced, Choice D)
    qs.append(make_matrix_q(
        f"{prefix}_80",
        "Waves",
        "advanced",
        'In an acoustic standing wave in an organ pipe, displacement wave is s(x,t) = s0 cos(kx) sin(ωt) and excess pressure wave is ΔP(x,t) = ΔP0 sin(kx) sin(ωt). Match the boundary / node property in List I with its acoustic description in List II:',
        [
            ('Closed end of an organ pipe (rigid boundary)', 'I', 'Displacement node (s = 0) and pressure antinode (|ΔP| = max)', 'At a rigid wall, air molecules cannot move (displacement node s = 0), which causes maximum compression and rarefaction (pressure antinode).'),
            ('Open end of an organ pipe (boundary open to atmosphere)', 'III', 'Displacement antinode (|s| = max) and pressure node (ΔP = 0)', 'At an open end, pressure must equal atmospheric pressure (pressure node ΔP = 0), allowing air molecules maximum freedom to oscillate (displacement antinode).'),
            ('Spatial phase relationship between displacement and excess pressure waves', 'II', 'Quarter-wavelength shift (π / 2 spatial phase difference)', 'Displacement has spatial factor cos(kx) while excess pressure has sin(kx). They are shifted by λ / 4 (spatial quadrature).'),
            ('Acoustic condition for open end boundary correction', 'IV', 'Pressure node lies slightly outside the physical end of the pipe', 'Due to inertial loading of surrounding air, acoustic pressure does not drop to atmospheric exactly at the rim, but at an effective distance e ≈ 0.6 r outside.'),
        ],
        "D"
    ))

    return qs
