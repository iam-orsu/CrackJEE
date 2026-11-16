"""
Part 1: Chemical Thermodynamics (chem_pc2_001 to chem_pc2_020)
20 questions: 4 beginner, 8 intermediate, 8 advanced
Answers: 5 A, 5 B, 5 C, 5 D
"""
from builder import make_matrix_q

def get_thermo_questions() -> list:
    qs = []
    topic = "Chemical Thermodynamics"

    # Q001 (beginner, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_001",
        topic,
        "beginner",
        "Match the thermodynamic quantity or property in List I with its classification / nature in List II:",
        [
            ("Internal energy (U)", "II", "State function and extensive property", "Internal energy depends solely on the initial and final states of the system (state function) and scales directly with the amount of matter in the system (extensive property)."),
            ("Heat capacity at constant volume (Cv)", "IV", "Extensive property whose molar counterpart (Cv,m) is intensive", "Total heat capacity Cv = n · Cv,m depends on mass/moles, so it is extensive, whereas molar heat capacity Cv,m is independent of quantity, making it intensive."),
            ("Work done (w)", "I", "Path function whose value depends on the path traversed", "Mechanical work w = -∫ P_ext dV depends on the process path (reversible vs irreversible) and is not a property of state; hence it is a path function."),
            ("Density (d)", "III", "Intensive property defined as the ratio of two extensive properties", "Density is mass divided by volume (d = m/V). Being the ratio of two extensive properties, it does not depend on system size, making it intensive."),
        ],
        "A"
    ))

    # Q002 (beginner, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_002",
        topic,
        "beginner",
        "For an ideal gas undergoing different thermodynamic processes, match the process in List I with its mathematical condition in List II:",
        [
            ("Reversible isothermal expansion", "III", "ΔT = 0, ΔU = 0, and q = -w = nRT ln(V2/V1)", "Since T is constant, ΔT = 0 and for an ideal gas ΔU = n Cv ΔT = 0. By First Law (ΔU = q + w), q = -w = nRT ln(V2/V1)."),
            ("Reversible adiabatic expansion", "I", "q = 0, ΔU = w < 0, and TV^(γ-1) = constant", "Adiabatic means no heat exchange (q = 0). Thus ΔU = w. Since gas expands (w < 0 in IUPAC), ΔU < 0 and T decreases. TV^(γ-1) is constant."),
            ("Isochoric heating", "IV", "w = 0, ΔV = 0, and q_v = ΔU = n Cv ΔT", "At constant volume, dV = 0, so boundary work w = -∫ P_ext dV = 0. Therefore q_v = ΔU = n Cv ΔT."),
            ("Isobaric expansion", "II", "ΔP = 0, w = -P ΔV = -nR ΔT, and q_p = ΔH = n Cp ΔT", "At constant pressure, w = -P ΔV = -nR ΔT. The heat absorbed at constant pressure equals enthalpy change: q_p = ΔH = n Cp ΔT."),
        ],
        "B"
    ))

    # Q003 (beginner, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_003",
        topic,
        "beginner",
        "Match the signs of enthalpy change (ΔH) and entropy change (ΔS) for a reaction in List I with its spontaneity behavior in List II:",
        [
            ("ΔH < 0 and ΔS > 0", "IV", "Spontaneous at all temperatures (ΔG < 0 always)", "ΔG = ΔH - TΔS. With ΔH negative and ΔS positive, -TΔS is negative at all T > 0, so ΔG is always negative (spontaneous at all temperatures)."),
            ("ΔH > 0 and ΔS < 0", "II", "Non-spontaneous at all temperatures (ΔG > 0 always)", "With ΔH positive and ΔS negative, -TΔS is positive at all T, making ΔG positive at all temperatures (never spontaneous)."),
            ("ΔH < 0 and ΔS < 0", "I", "Spontaneous only at low temperatures (T < ΔH/ΔS)", "Both terms oppose each other: ΔH favors spontaneity (-), but -TΔS opposes (+). ΔG < 0 when |ΔH| > T|ΔS|, i.e., T < ΔH/ΔS (low temperature)."),
            ("ΔH > 0 and ΔS > 0", "III", "Spontaneous only at high temperatures (T > ΔH/ΔS)", "Enthalpy opposes (+), but entropy favors (-TΔS is negative). For ΔG < 0, TΔS must exceed ΔH, which requires T > ΔH/ΔS (high temperature)."),
        ],
        "C"
    ))

    # Q004 (beginner, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_004",
        topic,
        "beginner",
        "Match the enthalpy definition in List I with its standard reaction representation in List II:",
        [
            ("Standard enthalpy of formation (ΔfH°) of CO2(g)", "III", "C(graphite) + O2(g) -> CO2(g)", "Enthalpy of formation is the formation of 1 mole of substance from its constituent elements in their most stable reference states at 298 K (C as graphite, O2 as gas)."),
            ("Standard enthalpy of combustion (ΔcH°) of CH4(g)", "I", "CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)", "Enthalpy of combustion is the heat released when 1 mole of substance is completely burned in excess oxygen with products in standard states (H2O(l))."),
            ("Standard enthalpy of atomization (ΔaH°) of CH4(g)", "IV", "CH4(g) -> C(g) + 4H(g)", "Enthalpy of atomization is the enthalpy change accompanying the complete breaking of all bonds in 1 mole of gaseous substance to form constituent gaseous atoms."),
            ("Standard enthalpy of neutralization of strong acid and strong base", "II", "H+(aq) + OH-(aq) -> H2O(l), ΔH° ≈ -57.1 kJ/mol", "Neutralization of any strong acid by a strong base in dilute solution corresponds to H+(aq) + OH-(aq) -> H2O(l) with ΔH° ≈ -57.1 to -57.3 kJ/mol."),
        ],
        "D"
    ))

    # Q005 (intermediate, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_005",
        topic,
        "intermediate",
        "For 1 mole of an ideal gas expanding from volume V1 to V2 = 2V1 at temperature T, match the process in List I with the magnitude of work done |w| in List II:",
        [
            ("Reversible isothermal expansion", "II", "RT ln 2", "For reversible isothermal expansion, |w| = ∫ P dV = nRT ln(V2/V1) = RT ln 2."),
            ("Irreversible isothermal expansion against constant external pressure P_ext = P2", "IV", "0.5 RT", "P2 = nRT / (2V1) = RT / (2V1). |w_irr| = P_ext (V2 - V1) = [RT / (2V1)] · V1 = 0.5 RT."),
            ("Irreversible isothermal free expansion into vacuum (P_ext = 0)", "I", "0", "In free expansion, the gas expands against P_ext = 0. Thus |w| = P_ext ΔV = 0."),
            ("Reversible adiabatic expansion (monoatomic gas, γ = 5/3)", "III", "1.5 RT [1 - (1/2)^(2/3)]", "For reversible adiabatic expansion, w = nCv (T2 - T1). Since T2 = T1 (V1/V2)^(γ-1) = T (1/2)^(2/3), |w| = (3/2)R (T - T2) = 1.5 RT [1 - (1/2)^(2/3)]."),
        ],
        "A"
    ))

    # Q006 (intermediate, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_006",
        topic,
        "intermediate",
        "Match the gas or thermodynamic relation in List I with its value or mathematical expression in List II:",
        [
            ("Difference between molar heat capacities (Cp,m - Cv,m) for an ideal gas", "IV", "R", "Mayer's relation for an ideal gas states Cp,m - Cv,m = [P + (∂U/∂V)_T](∂V/∂T)_P = R, since (∂U/∂V)_T = 0."),
            ("Ratio of specific heats γ = Cp/Cv for a non-linear triatomic gas (rigid, e.g., SO2)", "II", "4/3 ≈ 1.33", "A non-linear triatomic rigid molecule has 6 degrees of freedom (3 trans + 3 rot). Cv,m = 3R, Cp,m = 4R. Hence γ = 4/3."),
            ("(∂U/∂V)_T (internal pressure) for a Van der Waals gas", "I", "a / V_m^2", "For a Van der Waals gas, (P + a/Vm^2)(Vm - b) = RT. The thermodynamic equation of state gives (∂U/∂V)_T = T(∂P/∂T)_V - P = T[R/(Vm-b)] - P = a / Vm^2."),
            ("(∂H/∂P)_T for an ideal gas", "III", "0", "Enthalpy of an ideal gas depends only on temperature (H = U + PV = U(T) + nRT). Therefore (∂H/∂P)_T = 0."),
        ],
        "B"
    ))

    # Q007 (intermediate, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_007",
        topic,
        "intermediate",
        "Given standard bond enthalpies and reaction data, match the reaction / quantity in List I with its calculated enthalpy value in List II:",
        [
            ("Enthalpy of hydrogenation of ethene: C2H4(g) + H2(g) -> C2H6(g) (C=C: 611, H-H: 436, C-C: 347, 2 C-H: 828 kJ/mol)", "II", "-128 kJ/mol", "Bonds broken: 1 C=C (611) + 1 H-H (436) = 1047 kJ. Bonds formed: 1 C-C (347) + 2 C-H (2 · 414 = 828) = 1175 kJ. ΔH = 1047 - 1175 = -128 kJ/mol."),
            ("Standard enthalpy of formation of methane: C(graphite) + 2H2(g) -> CH4(g) (C_sub: 716, 2 H-H: 872, 4 C-H: 1664 kJ/mol)", "IV", "-76 kJ/mol", "Bonds broken: C(s) -> C(g) (716) + 2 H-H (2 · 436 = 872) = 1588 kJ. Bonds formed: 4 C-H (4 · 416 = 1664 kJ). ΔfH° = 1588 - 1664 = -76 kJ/mol."),
            ("Resonance energy of benzene if experimental ΔfH° = +83 kJ/mol and calculated bond enthalpy ΔfH° = +235 kJ/mol", "I", "-152 kJ/mol", "Resonance energy = ΔH_f(experimental) - ΔH_f(calculated) = 83 - 235 = -152 kJ/mol (stabilization of 152 kJ/mol)."),
            ("Enthalpy of combustion of C(graphite): C(s) -> C(g) (716), O=O (498), two C=O in CO2 (2 · 804 = 1608 kJ/mol)", "III", "-394 kJ/mol", "Bonds broken: 716 + 498 = 1214 kJ. Bonds formed: 2 · 804 = 1608 kJ. ΔH = 1214 - 1608 = -394 kJ/mol."),
        ],
        "C"
    ))

    # Q008 (intermediate, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_008",
        topic,
        "intermediate",
        "Match the thermodynamic transformation in List I with the corresponding entropy change of the universe (ΔS_univ = ΔS_sys + ΔS_surr) in List II:",
        [
            ("Reversible cyclic process", "IV", "ΔS_univ = 0", "In any reversible process, entropy change of the universe is zero (ΔS_sys = -ΔS_surr, hence ΔS_univ = 0)."),
            ("Irreversible spontaneous expansion of an ideal gas into vacuum", "II", "ΔS_univ = nR ln(V2/V1) > 0", "Gas expands into vacuum without doing work and without exchanging heat with surroundings (q = 0, ΔS_surr = 0). Since V2 > V1, ΔS_sys = nR ln(V2/V1) > 0, so ΔS_univ > 0."),
            ("Reversible phase transition (melting of ice at 273 K, 1 atm)", "III", "ΔS_univ = 0, with ΔS_sys = ΔH_fus / T_m", "At the normal equilibrium melting point, ice and water are in dynamic equilibrium. The heat transferred to the system is reversibly taken from surroundings: ΔS_surr = -ΔH_fus/T_m, so ΔS_univ = 0."),
            ("Mixing of two different ideal gases (n moles each) at constant T and P", "I", "ΔS_univ = 2nR ln 2 > 0", "For two ideal gases mixing, ΔH_mix = 0, so ΔS_surr = 0. ΔS_sys = -nR(x1 ln x1 + x2 ln x2) = -nR(0.5 ln 0.5 + 0.5 ln 0.5) · 2 = 2nR ln 2. Thus ΔS_univ = 2nR ln 2 > 0."),
        ],
        "D"
    ))

    # Q009 (intermediate, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_009",
        topic,
        "intermediate",
        "Match the thermodynamic formula / equation in List I with its correct identity / expression in List II:",
        [
            ("Gibbs-Helmholtz equation", "III", "[∂(ΔG/T)/∂T]_P = -ΔH / T^2", "The Gibbs-Helmholtz equation expresses the temperature dependence of Gibbs free energy: [∂(ΔG/T)/∂T]_P = -ΔH / T^2, or ΔG = ΔH + T[∂(ΔG)/∂T]_P."),
            ("Relation between standard Gibbs free energy and equilibrium constant", "I", "ΔG° = -RT ln K_eq", "At chemical equilibrium, ΔG = ΔG° + RT ln K_eq = 0, which directly yields ΔG° = -RT ln K_eq."),
            ("Clapeyron equation for liquid-vapor phase equilibrium", "IV", "dP/dT = ΔH_vap / [T (V_m,vap - V_m,liq)]", "Clapeyron equation relates equilibrium vapor pressure and temperature: dP/dT = ΔS_vap / ΔV_vap = ΔH_vap / (T ΔV)."),
            ("Variation of enthalpy with temperature at constant pressure (Kirchhoff's equation)", "II", "ΔH(T2) - ΔH(T1) = ∫ ΔCp dT", "Kirchhoff's law states that (∂ΔH/∂T)_P = ΔCp, so ΔH(T2) - ΔH(T1) = ∫ ΔCp dT."),
        ],
        "A"
    ))

    # Q010 (intermediate, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_010",
        topic,
        "intermediate",
        "For combustion of 1 mole of liquid benzene at 298 K: C6H6(l) + 15/2 O2(g) -> 6CO2(g) + 3H2O(l). Match the parameter / relation in List I with its value or description in List II (R = 8.314 J/(mol·K)):",
        [
            ("Change in gaseous moles (Δn_g)", "I", "-1.5 mol", "Δn_g = moles of gaseous products - moles of gaseous reactants = 6 - 7.5 = -1.5 mol."),
            ("Difference between enthalpy of combustion and internal energy change (ΔH - ΔU)", "III", "-1.5 RT ≈ -3.72 kJ/mol", "ΔH = ΔU + Δn_g RT. Therefore, ΔH - ΔU = (-1.5 mol) · (8.314 J/(mol·K)) · (298 K) = -3716 J = -3.72 kJ/mol."),
            ("Measurement in a bomb calorimeter", "IV", "Yields q_v = ΔU directly because the reaction occurs at constant volume", "A bomb calorimeter is a rigid, sealed vessel of constant volume (ΔV = 0), so w = 0 and the measured heat is q_v = ΔU."),
            ("Measurement in an open coffee-cup calorimeter", "II", "Yields q_p = ΔH directly because the reaction occurs at constant atmospheric pressure", "A coffee-cup calorimeter is open to atmospheric pressure (P = constant), so the measured heat is q_p = ΔH."),
        ],
        "B"
    ))

    # Q011 (intermediate, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_011",
        topic,
        "intermediate",
        "Match the thermodynamic step in the Born-Haber cycle for the formation of NaCl(s) from Na(s) and 1/2 Cl2(g) in List I with its thermodynamic term in List II:",
        [
            ("Na(s) -> Na(g)", "IV", "Standard enthalpy of sublimation (Δ_sub H° > 0)", "Transformation of solid sodium into gaseous sodium atoms is the enthalpy of sublimation (endothermic, > 0)."),
            ("1/2 Cl2(g) -> Cl(g)", "II", "Half of standard bond dissociation enthalpy (0.5 Δ_bond H° > 0)", "Dissociating half a mole of Cl2 molecules to yield 1 mole of Cl gaseous atoms requires 0.5 of the bond dissociation energy."),
            ("Cl(g) + e- -> Cl-(g)", "I", "Standard electron gain enthalpy (Δ_eg H° < 0)", "Addition of an electron to gaseous neutral chlorine atom releases energy; this is the electron gain enthalpy of chlorine (exothermic, < 0)."),
            ("Na+(g) + Cl-(g) -> NaCl(s)", "III", "Lattice enthalpy of formation (-U_L < 0)", "Combination of isolated gaseous ions to form one mole of solid crystalline lattice is the negative of lattice energy (highly exothermic)."),
        ],
        "C"
    ))

    # Q012 (intermediate, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_012",
        topic,
        "intermediate",
        "Match the substance or concept in List I with its residual entropy / Third Law property at 0 K in List II:",
        [
            ("Carbon monoxide crystal (CO) at 0 K", "II", "S_res = R ln 2 ≈ 5.76 J/(mol·K) due to two random orientations (CO or OC)", "Due to the very small dipole moment of CO, molecules freeze into the crystal with two nearly equal energy orientations (CO and OC), giving W = 2^N and S = k ln W = R ln 2 ≈ 5.76 J/(mol·K)."),
            ("Ice (H2O) at 0 K", "IV", "S_res = R ln(3/2) ≈ 3.37 J/(mol·K) due to hydrogen bond proton disorder", "Linus Pauling derived that proton disorder in ice Ih leads to W = (3/2)^N, giving residual entropy S = R ln(1.5) ≈ 3.37 J/(mol·K)."),
            ("Perfectly ordered crystalline diamond at 0 K", "I", "S = 0 J/(mol·K) according to Planck's formulation of Third Law", "The Third Law of Thermodynamics states that the entropy of a perfectly crystalline, completely ordered substance approaches zero at absolute zero (0 K)."),
            ("Nitrous oxide crystal (N2O) at 0 K", "III", "S_res = R ln 2 ≈ 5.76 J/(mol·K) due to end-to-end disorder (N-N-O vs O-N-N)", "Linear NNO molecules have small dipole moment and freeze randomly oriented as NNO or ONN, giving W = 2^N and S_res = R ln 2."),
        ],
        "D"
    ))

    # Q013 (advanced, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_013",
        topic,
        "advanced",
        "One mole of a monoatomic ideal gas (Cv = 1.5 R) at initial temperature T1 = 400 K and P1 = 10 atm expands to final pressure P2 = 1 atm. Match the expansion pathway in List I with the final state temperature / work in List II:",
        [
            ("Reversible adiabatic expansion", "III", "T2 = 400 · (0.1)^(2/5) ≈ 159.2 K", "For reversible adiabatic expansion, T2/T1 = (P2/P1)^((γ-1)/γ). For monoatomic gas, γ = 5/3, so (γ-1)/γ = (2/3)/(5/3) = 2/5 = 0.4. T2 = 400 · (1/10)^0.4 ≈ 159.2 K."),
            ("Irreversible adiabatic expansion against constant P_ext = 1 atm", "I", "T2 = 256.0 K", "First law for adiabatic: w = ΔU => -P_ext(V2 - V1) = Cv(T2 - T1). -P_ext(RT2/P2 - RT1/P1) = 1.5 R(T2 - T1). Since P_ext = P2 = 1 atm: -(RT2 - RT1 · P2/P1) = 1.5 R(T2 - T1). -T2 + 0.1 T1 = 1.5 T2 - 1.5 T1 => 2.5 T2 = 1.6 T1 => T2 = (1.6/2.5) · 400 = 256 K."),
            ("Irreversible adiabatic free expansion into vacuum", "IV", "T2 = 400 K and w = 0", "In free expansion, P_ext = 0, so w = 0. Since adiabatic, q = 0, giving ΔU = 0. For ideal gas, ΔU = Cv ΔT = 0, hence T2 = T1 = 400 K."),
            ("Reversible isothermal expansion", "II", "T2 = 400 K and w = -R (400) ln 10 ≈ -7657 J", "In isothermal expansion, T remains constant at 400 K. Work done is w = -nRT ln(P1/P2) = -(8.314)(400) ln(10) ≈ -7657 J."),
        ],
        "A"
    ))

    # Q014 (advanced, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_014",
        topic,
        "advanced",
        "Match the thermodynamic potential / fundamental equation in List I with its corresponding Maxwell relation or differential identity in List II:",
        [
            ("Fundamental equation dU = T dS - P dV", "IV", "(∂T/∂V)_S = -(∂P/∂S)_V", "Since dU is an exact differential, applying Euler's reciprocity relation to dU = T dS - P dV gives (∂T/∂V)_S = -(∂P/∂S)_V."),
            ("Fundamental equation dH = T dS + V dP", "II", "(∂T/∂P)_S = (∂V/∂S)_P", "Cross-differentiation of dH = T dS + V dP gives (∂T/∂P)_S = (∂V/∂S)_P."),
            ("Fundamental equation dA = -S dT - P dV (Helmholtz energy)", "I", "(∂S/∂V)_T = (∂P/∂T)_V", "Cross-differentiation of dA = -S dT - P dV gives -(∂S/∂V)_T = -(∂P/∂T)_V, so (∂S/∂V)_T = (∂P/∂T)_V."),
            ("Fundamental equation dG = -S dT + V dP (Gibbs energy)", "III", "-(∂S/∂P)_T = (∂V/∂T)_P", "Cross-differentiation of dG = -S dT + V dP gives -(∂S/∂P)_T = (∂V/∂T)_P, or (∂S/∂P)_T = -(∂V/∂T)_P."),
        ],
        "B"
    ))

    # Q015 (advanced, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_015",
        topic,
        "advanced",
        "For a real gas obeying the Van der Waals equation (P + a/V_m^2)(V_m - b) = RT, match the characteristic temperature or thermodynamic property in List I with its formula in List II:",
        [
            ("Boyle temperature (T_B), where second virial coefficient B(T) = 0", "II", "T_B = a / (R b)", "Expanding the Van der Waals equation in virial form gives Z = 1 + (b - a/(RT))/Vm + ... Setting the second virial coefficient b - a/(RT) = 0 gives T_B = a / (R b)."),
            ("Critical temperature (T_c), where (∂P/∂V)_T = 0 and (∂^2P/∂V^2)_T = 0", "IV", "T_c = 8a / (27 R b)", "At the critical point, the first and second derivatives of P with respect to V vanish, yielding Vc = 3b, Pc = a/(27b^2), and Tc = 8a / (27 R b)."),
            ("Inversion temperature of Joule-Thomson expansion (T_i) at low pressure", "I", "T_i = 2a / (R b) = 2 T_B", "The Joule-Thomson coefficient μ_JT = (1/Cp)[T(∂V/∂T)_P - V]. For Van der Waals gas at low P, μ_JT = (1/Cp)(2a/RT - b). Setting μ_JT = 0 gives T_i = 2a / (R b)."),
            ("Critical compressibility factor Z_c = P_c V_c / (R T_c)", "III", "Z_c = 3/8 = 0.375", "Substituting Pc = a/(27b^2), Vc = 3b, and Tc = 8a/(27Rb) gives Zc = [a/(27b^2) · 3b] / [R · 8a/(27Rb)] = (a/(9b)) / (8a/(27b)) = 27/72 = 3/8 = 0.375."),
        ],
        "C"
    ))

    # Q016 (advanced, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_016",
        topic,
        "advanced",
        "A heat engine executes a reversible Carnot cycle operating between a hot reservoir at T_H = 600 K and a cold reservoir at T_C = 300 K. In each cycle, it absorbs Q_H = 1200 J of heat from the hot reservoir. Match the quantity in List I with its exact value in List II:",
        [
            ("Thermal efficiency (η) of the Carnot engine", "II", "0.50 (or 50%)", "Carnot efficiency η = 1 - T_C / T_H = 1 - 300/600 = 0.50 (50%)."),
            ("Net mechanical work output per cycle (|W_net|)", "IV", "600 J", "Work done per cycle is |W_net| = η · Q_H = 0.50 · 1200 J = 600 J."),
            ("Heat rejected to the cold reservoir per cycle (|Q_C|)", "I", "600 J", "By first law over a cycle, |Q_C| = Q_H - |W_net| = 1200 J - 600 J = 600 J."),
            ("Total entropy change of the working substance per cycle (ΔS_cycle)", "III", "0 J/K", "Entropy is a state function. For any complete reversible cyclic process, the net change in entropy of the working substance is identically zero: ∮ dQ_rev/T = Q_H/T_H - |Q_C|/T_C = 1200/600 - 600/300 = 0."),
        ],
        "D"
    ))

    # Q017 (advanced, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_017",
        topic,
        "advanced",
        "Regarding Ellingham diagrams (plots of standard Gibbs energy of formation ΔfG° vs temperature T for metal oxides), match the feature / reaction in List I with its interpretation in List II:",
        [
            ("Slope of the line for 2M(s) + O2(g) -> 2MO(s)", "II", "Positive (+ΔS° is negative because 1 mole of gas is consumed)", "d(ΔG°)/dT = -ΔS°. In oxidation of solid metals, gaseous O2 is consumed to form solid oxide, so ΔS° < 0. Thus slope = -ΔS° > 0 (positive slope)."),
            ("Slope of the line for C(s) + O2(g) -> CO2(g)", "IV", "Nearly zero (Δn_g = 0, so ΔS° ≈ 0)", "1 mole of solid carbon reacts with 1 mole of O2 gas to form 1 mole of CO2 gas. Δn_g = 1 - 1 = 0, so ΔS° ≈ 0, yielding a horizontal line with zero slope."),
            ("Slope of the line for 2C(s) + O2(g) -> 2CO(g)", "I", "Negative (gas moles increase from 1 to 2, so ΔS° > 0)", "1 mole of O2 gas produces 2 moles of CO gas (Δn_g = +1), so ΔS° > 0. Therefore slope = -ΔS° < 0 (negative slope, curve slopes downward)."),
            ("Abrupt increase in the positive slope at higher temperature", "III", "Phase transition (melting or boiling) of the metal reactant", "When the metal melts or vaporizes, its entropy increases sharply. This makes the reaction entropy change (ΔS° = S°(oxide) - S°(metal) - S°(O2)) much more negative, causing an upward kink in slope."),
        ],
        "A"
    ))

    # Q018 (advanced, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_018",
        topic,
        "advanced",
        "Match the thermodynamic property of mixing for forming an ideal solution from n1 moles of component 1 and n2 moles of component 2 at temperature T and pressure P in List I with its expression in List II (x1, x2 are mole fractions):",
        [
            ("Enthalpy of mixing (ΔH_mix)", "III", "0", "In an ideal solution, intermolecular forces between like and unlike molecules are identical (A-A, B-B ≈ A-B). Hence no heat is absorbed or released: ΔH_mix = 0."),
            ("Volume change of mixing (ΔV_mix)", "I", "0", "Since molecular sizes and interactions are identical, the total volume equals the sum of individual volumes: ΔV_mix = 0."),
            ("Entropy of mixing (ΔS_mix)", "IV", "-n_total R (x1 ln x1 + x2 ln x2) > 0", "Mixing creates disorder. For ideal solution, ΔS_mix = -R (n1 ln x1 + n2 ln x2) = -n_total R (x1 ln x1 + x2 ln x2), which is strictly positive since x_i < 1."),
            ("Gibbs free energy of mixing (ΔG_mix)", "II", "n_total RT (x1 ln x1 + x2 ln x2) < 0", "ΔG_mix = ΔH_mix - T ΔS_mix = 0 - T ΔS_mix = n_total RT (x1 ln x1 + x2 ln x2), which is strictly negative, driving spontaneous mixing."),
        ],
        "B"
    ))

    # Q019 (advanced, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_019",
        topic,
        "advanced",
        "For a chemical equilibrium, match the relation / graph involving the Van 't Hoff equation in List I with its physical deduction in List II:",
        [
            ("Plot of ln K_p vs 1/T with positive slope (slope = -ΔH°/R > 0)", "II", "Exothermic reaction (ΔH° < 0), K_p decreases as T increases", "Van 't Hoff equation is ln K = -ΔH°/(RT) + ΔS°/R. Slope is -ΔH°/R. If slope > 0, then ΔH° < 0 (exothermic), and higher T (lower 1/T) gives smaller K."),
            ("Plot of ln K_p vs 1/T with negative slope (slope = -ΔH°/R < 0)", "IV", "Endothermic reaction (ΔH° > 0), K_p increases as T increases", "If slope = -ΔH°/R < 0, then ΔH° > 0 (endothermic). Increasing T decreases 1/T, moving to higher ln K, so equilibrium shifts forward."),
            ("Reaction with ΔH° = 0", "I", "K_p is independent of temperature (horizontal line in ln K vs 1/T)", "When ΔH° = 0, d(ln K)/dT = ΔH°/(RT^2) = 0. Temperature change has no effect on the equilibrium constant."),
            ("Integrated Van 't Hoff equation: ln(K2/K1)", "III", "(ΔH°/R) · (T2 - T1) / (T1 T2)", "Integrating d(ln K) = (ΔH°/R)(dT/T^2) from T1 to T2 gives ln(K2/K1) = -(ΔH°/R)(1/T2 - 1/T1) = (ΔH°/R)(T2 - T1)/(T1 T2)."),
        ],
        "C"
    ))

    # Q020 (advanced, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_020",
        topic,
        "advanced",
        "For a reversible galvanic cell operating at constant temperature T and pressure P with cell potential E_cell, match the thermodynamic quantity in List I with its electrochemical expression in List II:",
        [
            ("Maximum electrical work done by the cell (w_elec)", "III", "-ΔG = n F E_cell", "By the second law, maximum non-expansion work obtainable at constant T and P equals -ΔG. For an electrochemical cell, -ΔG = n F E_cell."),
            ("Entropy change of the cell reaction (ΔS)", "I", "n F (∂E_cell/∂T)_P", "From dG = -S dT + V dP, (∂G/∂T)_P = -S, so ΔS = -[∂(ΔG)/∂T]_P. Substituting ΔG = -n F E_cell gives ΔS = n F (∂E_cell/∂T)_P."),
            ("Enthalpy change of the cell reaction (ΔH)", "IV", "-n F E_cell + n F T (∂E_cell/∂T)_P", "Since ΔH = ΔG + T ΔS, substituting ΔG = -nFE and ΔS = nFT(∂E/∂T)_P yields ΔH = -n F E_cell + n F T (∂E_cell/∂T)_P."),
            ("Reversible heat exchanged with surroundings (q_rev)", "II", "n F T (∂E_cell/∂T)_P", "For a reversible process at constant T, q_rev = T ΔS = n F T (∂E_cell/∂T)_P. If (∂E/∂T)_P > 0, the cell absorbs heat while operating."),
        ],
        "D"
    ))

    return qs
