"""
Part 2: Chemical Equilibrium (chem_pc2_021 to chem_pc2_040)
20 questions: 4 beginner, 8 intermediate, 8 advanced
Answers: 5 A, 5 B, 5 C, 5 D
"""
from builder import make_matrix_q

def get_chemeq_questions() -> list:
    qs = []
    topic = "Chemical Equilibrium"

    # Q021 (beginner, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_021",
        topic,
        "beginner",
        "Match the gaseous equilibrium reaction in List I with the relation between its equilibrium constants K_p and K_c in List II (where Δn_g = n_products(g) - n_reactants(g)):",
        [
            ("N2(g) + 3H2(g) ⇌ 2NH3(g)", "II", "K_p = K_c (RT)^(-2)", "Δn_g = 2 - (1 + 3) = -2. Therefore K_p = K_c (RT)^Δn_g = K_c (RT)^(-2)."),
            ("PCl5(g) ⇌ PCl3(g) + Cl2(g)", "IV", "K_p = K_c (RT)^(+1)", "Δn_g = (1 + 1) - 1 = +1. Therefore K_p = K_c (RT)^1."),
            ("H2(g) + I2(g) ⇌ 2HI(g)", "I", "K_p = K_c", "Δn_g = 2 - (1 + 1) = 0. Therefore K_p = K_c (RT)^0 = K_c."),
            ("2SO2(g) + O2(g) ⇌ 2SO3(g)", "III", "K_p = K_c (RT)^(-1)", "Δn_g = 2 - (2 + 1) = -1. Therefore K_p = K_c (RT)^(-1)."),
        ],
        "A"
    ))

    # Q022 (beginner, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_022",
        topic,
        "beginner",
        "Match the relationship between the reaction quotient (Q) and the equilibrium constant (K) in List I with the predicted system behavior in List II:",
        [
            ("Q < K", "III", "Net reaction proceeds forward (left to right) to form more products", "When Q < K, product concentrations are smaller than at equilibrium. The forward reaction rate exceeds reverse rate, so reaction shifts forward."),
            ("Q = K", "I", "System is in dynamic chemical equilibrium; forward rate equals reverse rate", "When Q = K, concentrations satisfy the equilibrium condition. There is no net change in macroscopic properties; forward and reverse rates are equal."),
            ("Q > K", "IV", "Net reaction proceeds in reverse (right to left) to consume products", "When Q > K, product concentrations exceed equilibrium values. The reverse reaction dominates, shifting equilibrium toward reactants."),
            ("Addition of a non-reacting catalyst at equilibrium", "II", "Q remains equal to K; reaction rates increase equally in both directions", "A catalyst lowers activation energy for both forward and reverse paths equally without altering thermodynamic potentials or K."),
        ],
        "B"
    ))

    # Q023 (beginner, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_023",
        topic,
        "beginner",
        "Match the heterogeneous equilibrium system in List I with its correct equilibrium constant expression K_p in List II:",
        [
            ("CaCO3(s) ⇌ CaO(s) + CO2(g)", "II", "K_p = P_CO2", "Pure solids have unit activity (activity = 1). Thus solid CaCO3 and CaO do not appear in K_p, giving K_p = P_CO2."),
            ("NH4HS(s) ⇌ NH3(g) + H2S(g)", "IV", "K_p = (P_NH3) · (P_H2S)", "Solid NH4HS has unit activity. The gaseous products both exert partial pressures, so K_p = P_NH3 · P_H2S."),
            ("C(s) + CO2(g) ⇌ 2CO(g)", "I", "K_p = (P_CO)^2 / (P_CO2)", "Solid carbon activity is 1. The equilibrium constant in terms of partial pressures is K_p = (P_CO)^2 / P_CO2."),
            ("3Fe(s) + 4H2O(g) ⇌ Fe3O4(s) + 4H2(g)", "III", "K_p = (P_H2)^4 / (P_H2O)^4", "Fe(s) and Fe3O4(s) are pure solid phases with activity 1. Hence K_p = (P_H2)^4 / (P_H2O)^4."),
        ],
        "C"
    ))

    # Q024 (beginner, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_024",
        topic,
        "beginner",
        "Match the equilibrium reaction and disturbance in List I with the Le Chatelier direction of shift in List II:",
        [
            ("N2(g) + 3H2(g) ⇌ 2NH3(g) (ΔH = -92 kJ/mol), temperature is increased", "II", "Shifts in reverse (left) to absorb heat", "The forward reaction is exothermic (ΔH < 0). By Le Chatelier's principle, increasing temperature favors the endothermic (reverse) reaction."),
            ("2NO2(g, brown) ⇌ N2O4(g, colorless) (ΔH = -57 kJ/mol), container is cooled in ice", "IV", "Shifts forward (right), mixture turns paler", "Lowering temperature favors the heat-releasing exothermic direction (forward formation of N2O4), turning the mixture colorless/paler."),
            ("N2O4(g) ⇌ 2NO2(g) (ΔH = +57 kJ/mol), total pressure is increased by compression", "I", "Shifts in reverse (left) toward fewer gas moles", "Increasing pressure favors the side with fewer moles of gas (1 mole N2O4 vs 2 moles NO2), shifting the equilibrium in reverse."),
            ("H2(g) + I2(g) ⇌ 2HI(g) (ΔH = -10 kJ/mol), volume of container is halved", "III", "No shift in equilibrium position (Δn_g = 0)", "Since Δn_g = 2 - 2 = 0, pressure changes alter all partial pressures equally without changing the reaction quotient Q relative to K."),
        ],
        "D"
    ))

    # Q025 (intermediate, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_025",
        topic,
        "intermediate",
        "Match the system and condition of inert gas (e.g., Argon) addition in List I with the effect on chemical equilibrium in List II:",
        [
            ("PCl5(g) ⇌ PCl3(g) + Cl2(g) (Δn_g > 0), inert gas added at constant pressure", "II", "Shifts forward (dissociation increases)", "At constant total pressure P, adding inert gas increases total volume. The partial pressures of reactants and products decrease, favoring the side with more moles (forward)."),
            ("N2(g) + 3H2(g) ⇌ 2NH3(g) (Δn_g < 0), inert gas added at constant pressure", "IV", "Shifts in reverse (yield of NH3 decreases)", "At constant pressure, volume expands. This decreases partial pressures and shifts equilibrium toward the side with more gas moles (reverse, towards reactants)."),
            ("Any gaseous equilibrium, inert gas added at constant volume", "I", "No shift in equilibrium position", "At constant volume, adding inert gas increases total pressure, but does not alter the molar concentration (n/V) or partial pressure of any reacting species; Q remains equal to K."),
            ("H2(g) + I2(g) ⇌ 2HI(g) (Δn_g = 0), inert gas added at constant pressure", "III", "No shift in equilibrium position", "For a reaction with Δn_g = 0, dilution at constant pressure scales all partial pressures by the same factor, leaving Q_p = K_p unchanged."),
        ],
        "A"
    ))

    # Q026 (intermediate, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_026",
        topic,
        "intermediate",
        "Match the gas dissociation system in List I with the relation connecting degree of dissociation (α), initial vapor density (D), and equilibrium vapor density (d) in List II:",
        [
            ("PCl5(g) ⇌ PCl3(g) + Cl2(g) (1 mole produces 2 moles, n = 2)", "III", "α = (D - d) / d", "Total moles at equilibrium = 1 + α. Since vapor density is inversely proportional to number of moles: D/d = 1 + α => α = (D - d)/d."),
            ("N2O4(g) ⇌ 2NO2(g) (n = 2), with theoretical density D = 46 and observed d = 30", "I", "α = (46 - 30) / 30 = 16/30 ≈ 0.533 (53.3%)", "Molar mass of N2O4 = 92 g/mol, so D = M/2 = 46. With observed d = 30, α = (D - d)/d = (46 - 30)/30 = 16/30 ≈ 0.533."),
            ("2NH3(g) ⇌ N2(g) + 3H2(g) (2 moles produce 4 moles; 1 mole produces n = 2 moles)", "IV", "α = (D - d) / d", "2NH3 ⇌ N2 + 3H2. Starting with 1 mole NH3: 1 - α + α/2 + 3α/2 = 1 + α. D/d = 1 + α => α = (D - d)/d."),
            ("Polymerization: n A(g) ⇌ A_n(g) (association to form n-mer)", "II", "Degree of association β = (d - D) / [d (1 - 1/n)]", "For association, total moles = 1 - β + β/n = 1 - β(1 - 1/n). D/d = 1 - β(1 - 1/n) => β = (d - D) / [d(1 - 1/n)]."),
        ],
        "B"
    ))

    # Q027 (intermediate, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_027",
        topic,
        "intermediate",
        "For dissociation of 1 mole of a gas at total equilibrium pressure P, match the dissociation reaction in List I with its equilibrium constant expression K_p in terms of degree of dissociation α and P in List II:",
        [
            ("PCl5(g) ⇌ PCl3(g) + Cl2(g)", "II", "K_p = [α^2 / (1 - α^2)] · P", "Equilibrium moles: PCl5 = 1 - α, PCl3 = α, Cl2 = α. Total moles = 1 + α. Partial pressures: P_PCl3 = [α/(1+α)]P, P_Cl2 = [α/(1+α)]P, P_PCl5 = [(1-α)/(1+α)]P. K_p = [α^2 / (1 - α^2)] P."),
            ("N2O4(g) ⇌ 2NO2(g)", "IV", "K_p = [4α^2 / (1 - α^2)] · P", "Moles: N2O4 = 1 - α, NO2 = 2α. Total = 1 + α. P_NO2 = [2α/(1+α)]P, P_N2O4 = [(1-α)/(1+α)]P. K_p = (P_NO2)^2 / P_N2O4 = [4α^2 / (1 - α^2)] P."),
            ("2HI(g) ⇌ H2(g) + I2(g)", "I", "K_p = α^2 / [4 (1 - α)^2], independent of P", "Moles: HI = 1 - α, H2 = α/2, I2 = α/2. Total moles = 1. Since Δn_g = 0, P cancels out completely: K_p = (α/2)^2 / (1 - α)^2 = α^2 / [4(1-α)^2]."),
            ("COCl2(g) ⇌ CO(g) + Cl2(g)", "III", "K_p = [α^2 / (1 - α^2)] · P", "Identical stoichiometry to PCl5 (1 mole -> 2 moles): K_p = [α^2 / (1 - α^2)] P."),
        ],
        "C"
    ))

    # Q028 (intermediate, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_028",
        topic,
        "intermediate",
        "Solid NH4HS decomposes: NH4HS(s) ⇌ NH3(g) + H2S(g) with K_p1 = 64 atm^2 at T. In a first flask (initially evacuated), solid NH4HS reaches equilibrium. In a second flask, some gaseous NH3 is already present at 12 atm before adding NH4HS(s). Match the parameter in List I with its value in List II:",
        [
            ("Total pressure at equilibrium in the first (initially evacuated) flask", "II", "16 atm", "In evacuated flask, P_NH3 = P_H2S = p. K_p1 = p^2 = 64 => p = 8 atm. Total pressure P_total = p + p = 16 atm."),
            ("Partial pressure of H2S at equilibrium in the second flask", "IV", "4 atm", "In second flask, P_NH3 = 12 + x, P_H2S = x. K_p1 = (12 + x)x = 64 => x^2 + 12x - 64 = 0 => (x + 16)(x - 4) = 0 => x = 4 atm."),
            ("Partial pressure of NH3 at equilibrium in the second flask", "I", "16 atm", "P_NH3 = 12 + x = 12 + 4 = 16 atm."),
            ("Total pressure at equilibrium in the second flask", "III", "20 atm", "P_total = P_NH3 + P_H2S = 16 + 4 = 20 atm."),
        ],
        "D"
    ))

    # Q029 (intermediate, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_029",
        topic,
        "intermediate",
        "Given the standard equilibrium constant K1 for reaction: N2(g) + 3H2(g) ⇌ 2NH3(g), match the modified reaction in List I with its equilibrium constant in terms of K1 in List II:",
        [
            ("2NH3(g) ⇌ N2(g) + 3H2(g)", "III", "1 / K1", "Reversing a reaction inverts its equilibrium constant: K_rev = 1 / K1."),
            ("1/2 N2(g) + 3/2 H2(g) ⇌ NH3(g)", "I", "K1^(1/2) = √K1", "Multiplying stoichiometric coefficients by 1/2 raises the equilibrium constant to the power of 1/2: K' = (K1)^(1/2)."),
            ("NH3(g) ⇌ 1/2 N2(g) + 3/2 H2(g)", "IV", "1 / √K1 = K1^(-1/2)", "Reversing the reaction and dividing by 2 gives K' = (1/K1)^(1/2) = K1^(-1/2)."),
            ("2N2(g) + 6H2(g) ⇌ 4NH3(g)", "II", "K1^2", "Multiplying stoichiometric coefficients by 2 squares the equilibrium constant: K' = K1^2."),
        ],
        "A"
    ))

    # Q030 (intermediate, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_030",
        topic,
        "intermediate",
        "Given equilibrium constants: (1) C(s) + CO2(g) ⇌ 2CO(g), K1 = 10; (2) CO(g) + Cl2(g) ⇌ COCl2(g), K2 = 5; (3) H2O(g) + CO(g) ⇌ CO2(g) + H2(g), K3 = 2. Match the overall reaction in List I with its equilibrium constant K in List II:",
        [
            ("C(s) + CO2(g) + 2Cl2(g) ⇌ 2COCl2(g)", "IV", "K = K1 · (K2)^2 = 10 · 25 = 250", "Reaction is (1) + 2·(2). Adding reactions multiplies their equilibrium constants: K = K1 · (K2)^2 = 10 · 25 = 250."),
            ("C(s) + H2O(g) ⇌ CO(g) + H2(g)", "II", "K = K1 · K3 = 10 · 2 = 20", "Adding (1) C + CO2 ⇌ 2CO and (3) H2O + CO ⇌ CO2 + H2 gives C + H2O ⇌ CO + H2. Therefore K = K1 · K3 = 10 · 2 = 20."),
            ("2CO(g) ⇌ C(s) + CO2(g)", "I", "K = 1 / K1 = 0.10", "Reverse of reaction (1). K = 1 / K1 = 1 / 10 = 0.10."),
            ("CO2(g) + H2(g) ⇌ H2O(g) + CO(g)", "III", "K = 1 / K3 = 0.50", "Reverse of reaction (3). K = 1 / K3 = 1 / 2 = 0.50."),
        ],
        "B"
    ))

    # Q031 (intermediate, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_031",
        topic,
        "intermediate",
        "For the reaction A(g) + B(g) ⇌ 2C(g) carried out at 300 K with initial concentrations [A]0 = [B]0 = 1.0 M, [C]0 = 0. Match the equilibrium constant K_c in List I with the equilibrium concentration of C ([C]_eq) in List II:",
        [
            ("K_c = 4", "II", "[C]_eq = 1.0 M", "[A] = 1 - x, [B] = 1 - x, [C] = 2x. K_c = (2x)^2 / (1 - x)^2 = 4 => 2x / (1 - x) = 2 => 2x = 2 - 2x => 4x = 2 => x = 0.5 M. [C]_eq = 2x = 1.0 M."),
            ("K_c = 16", "IV", "[C]_eq = 1.33 M (4/3 M)", "2x / (1 - x) = √16 = 4 => 2x = 4 - 4x => 6x = 4 => x = 2/3 M. [C]_eq = 2x = 4/3 ≈ 1.33 M."),
            ("K_c = 1", "I", "[C]_eq = 0.67 M (2/3 M)", "2x / (1 - x) = √1 = 1 => 2x = 1 - x => 3x = 1 => x = 1/3 M. [C]_eq = 2x = 2/3 ≈ 0.67 M."),
            ("K_c = 0.25", "III", "[C]_eq = 0.40 M (2/5 M)", "2x / (1 - x) = √0.25 = 0.5 => 2x = 0.5 - 0.5x => 2.5x = 0.5 => x = 0.2 M. [C]_eq = 2x = 0.40 M."),
        ],
        "C"
    ))

    # Q032 (intermediate, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_032",
        topic,
        "intermediate",
        "A reversible elementary reaction A(g) ⇌ B(g) has forward rate constant k_f and reverse rate constant k_b. Match the kinetic / thermodynamic parameter in List I with its deduction in List II:",
        [
            ("At chemical equilibrium", "II", "Rate_forward = Rate_reverse, so k_f [A]_eq = k_b [B]_eq and K_c = k_f / k_b", "Dynamic equilibrium requires forward and reverse rates to be identical. Hence k_f [A] = k_b [B], giving K_c = [B]/[A] = k_f / k_b."),
            ("Forward activation energy E_a,f is greater than reverse activation energy E_a,b", "IV", "Reaction is endothermic (ΔH° = E_a,f - E_a,b > 0)", "ΔH° = E_a,f - E_a,b. If E_a,f > E_a,b, ΔH° > 0, meaning the reaction absorbs heat (endothermic)."),
            ("Forward activation energy E_a,f is less than reverse activation energy E_a,b", "I", "Reaction is exothermic (ΔH° = E_a,f - E_a,b < 0)", "If E_a,f < E_a,b, ΔH° < 0, meaning the reaction releases heat (exothermic)."),
            ("Addition of a positive catalyst", "III", "Increases both k_f and k_b by the same factor; K_c remains unchanged", "A catalyst lowers the activation barrier E_a by the same amount for both directions. Therefore, both k_f and k_b increase by factor exp(ΔE_a/RT), leaving K_c unchanged."),
        ],
        "D"
    ))

    # Q033 (advanced, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_033",
        topic,
        "advanced",
        "Two solid salts decompose in the same closed vessel at temperature T according to simultaneous equilibria: (1) A(s) ⇌ B(g) + C(g), K_p1 = 40 atm^2; (2) D(s) ⇌ B(g) + E(g), K_p2 = 60 atm^2. Match the equilibrium quantity in List I with its calculated value in List II:",
        [
            ("Partial pressure of common gas B (P_B)", "II", "10 atm", "Let P_C = x, P_E = y. Since both reactions produce B, P_B = x + y. K_p1 = P_B · P_C = (x + y)x = 40. K_p2 = P_B · P_E = (x + y)y = 60. Adding the two: (x + y)^2 = 40 + 60 = 100. Thus P_B = x + y = √100 = 10 atm."),
            ("Partial pressure of gas C (P_C)", "IV", "4 atm", "P_B · P_C = 40 => 10 · P_C = 40 => P_C = 4 atm."),
            ("Partial pressure of gas E (P_E)", "I", "6 atm", "P_B · P_E = 60 => 10 · P_E = 60 => P_E = 6 atm."),
            ("Total gaseous pressure in the vessel (P_total)", "III", "20 atm", "P_total = P_B + P_C + P_E = 10 + 4 + 6 = 20 atm."),
        ],
        "A"
    ))

    # Q034 (advanced, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_034",
        topic,
        "advanced",
        "At 250 °C, PCl5 is 50% dissociated (α = 0.50) into PCl3 and Cl2 at a total pressure of P1 = 3.0 atm. Match the condition / parameter in List I with its calculated value in List II:",
        [
            ("Equilibrium constant K_p at 250 °C", "III", "1.0 atm", "K_p = [α^2 / (1 - α^2)] · P1 = [0.25 / (1 - 0.25)] · 3.0 = (0.25 / 0.75) · 3.0 = (1/3) · 3.0 = 1.0 atm."),
            ("Total pressure P2 required to reduce the dissociation to α = 0.20 at the same temperature", "I", "24.0 atm", "Since T is constant, K_p = 1.0 atm. K_p = [α2^2 / (1 - α2^2)] · P2 => 1.0 = [0.04 / (1 - 0.04)] · P2 = (0.04 / 0.96) · P2 = (1/24) · P2 => P2 = 24.0 atm."),
            ("Ratio of equilibrium vapor density to initial theoretical vapor density (d/D) at 50% dissociation", "IV", "2/3 ≈ 0.667", "D/d = 1 + α = 1 + 0.5 = 1.5 = 3/2. Therefore d/D = 2/3 ≈ 0.667."),
            ("Partial pressure of Cl2 at the initial state (P1 = 3.0 atm, α = 0.50)", "II", "1.0 atm", "P_Cl2 = [α / (1 + α)] · P1 = [0.5 / 1.5] · 3.0 = (1/3) · 3.0 = 1.0 atm."),
        ],
        "B"
    ))

    # Q035 (advanced, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_035",
        topic,
        "advanced",
        "For the gas phase equilibrium: N2O4(g) ⇌ 2NO2(g), match the thermodynamic derivative / expression in List I with its physical significance in List II:",
        [
            ("[∂(ln K_p)/∂T]_P", "II", "ΔH° / (R T^2), positive since dimerization of NO2 is exothermic and dissociation of N2O4 is endothermic", "Van 't Hoff isochore: d(ln K_p)/dT = ΔH°/(RT^2). Since dissociation is endothermic (ΔH° > 0), this derivative is positive."),
            ("[∂(ln K_c)/∂V]_T", "IV", "0 (K_c depends solely on temperature, not on volume)", "Thermodynamic equilibrium constants K_c and K_p are strictly functions of temperature alone; they are independent of container volume."),
            ("[∂(ΔG)/∂ξ]_{T,P} at chemical equilibrium (where ξ is extent of reaction)", "I", "0, representing the minimum in Gibbs free energy", "At constant T and P, chemical equilibrium corresponds to the minimum of G(ξ), so the slope (∂G/∂ξ)_{T,P} = ΔG_rxn = 0."),
            ("Standard reaction Gibbs energy ΔrG°", "III", "-RT ln K_p = ΔrH° - T ΔrS°", "ΔrG° is the change in Gibbs energy when reactants in standard states are converted to products in standard states: ΔrG° = -RT ln K_p."),
        ],
        "C"
    ))

    # Q036 (advanced, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_036",
        topic,
        "advanced",
        "For the gaseous reaction: 2A(g) + B(g) ⇌ 2C(g) with K_p = 100 atm^(-1) at 500 K. Match the mixture composition at total pressure P = 3 atm in List I with the reaction quotient Q_p and its immediate shift in List II:",
        [
            ("Partial pressures: P_A = 0.1 atm, P_B = 0.1 atm, P_C = 1.0 atm", "II", "Q_p = 1000 atm^(-1); Q_p > K_p, shifts in reverse (left)", "Q_p = (P_C)^2 / [(P_A)^2 · P_B] = (1.0)^2 / [(0.1)^2 · 0.1] = 1.0 / 0.001 = 1000 atm^(-1). Since Q_p > K_p (1000 > 100), reaction shifts reverse."),
            ("Partial pressures: P_A = 0.2 atm, P_B = 0.25 atm, P_C = 1.0 atm", "IV", "Q_p = 100 atm^(-1); Q_p = K_p, system is at equilibrium", "Q_p = (1.0)^2 / [(0.2)^2 · 0.25] = 1.0 / [0.04 · 0.25] = 1.0 / 0.01 = 100 atm^(-1). Since Q_p = K_p, system is at equilibrium."),
            ("Partial pressures: P_A = 0.5 atm, P_B = 0.4 atm, P_C = 0.5 atm", "I", "Q_p = 2.5 atm^(-1); Q_p < K_p, shifts forward (right)", "Q_p = (0.5)^2 / [(0.5)^2 · 0.4] = 0.25 / [0.25 · 0.4] = 1 / 0.4 = 2.5 atm^(-1). Since Q_p < K_p (2.5 < 100), reaction shifts forward."),
            ("Partial pressures: P_A = 0.1 atm, P_B = 0.4 atm, P_C = 0.2 atm", "III", "Q_p = 10 atm^(-1); Q_p < K_p, shifts forward (right)", "Q_p = (0.2)^2 / [(0.1)^2 · 0.4] = 0.04 / [0.01 · 0.4] = 0.04 / 0.004 = 10 atm^(-1). Since Q_p < K_p, reaction shifts forward."),
        ],
        "D"
    ))

    # Q037 (advanced, Choice A)
    qs.append(make_matrix_q(
        "chem_pc2_037",
        topic,
        "advanced",
        "For the dissociation of ammonium carbamate: NH2COONH4(s) ⇌ 2NH3(g) + CO2(g) at 300 K, the total equilibrium pressure is 0.30 atm. Match the parameter in List I with its value in List II:",
        [
            ("Partial pressure of NH3 at equilibrium", "II", "0.20 atm", "Stoichiometry gives 2 moles of NH3 for every 1 mole of CO2. Total pressure P = P_NH3 + P_CO2 = 3x. 3x = 0.30 atm => x = P_CO2 = 0.10 atm, and P_NH3 = 2x = 0.20 atm."),
            ("Partial pressure of CO2 at equilibrium", "IV", "0.10 atm", "From P_CO2 = P_total / 3 = 0.30 / 3 = 0.10 atm."),
            ("Equilibrium constant K_p", "I", "4.0 × 10^(-3) atm^3", "K_p = (P_NH3)^2 · (P_CO2) = (0.20)^2 · (0.10) = 0.04 · 0.10 = 4.0 · 10^(-3) atm^3."),
            ("Partial pressure of NH3 if solid ammonium carbamate is added to a vessel already containing CO2 at 0.40 atm (assuming x is small)", "III", "0.10 atm", "(P_NH3)^2 · (0.40 + P_CO2) ≈ (P_NH3)^2 · 0.40 = 4.0 · 10^(-3) => (P_NH3)^2 = 1.0 · 10^(-2) => P_NH3 = 0.10 atm."),
        ],
        "A"
    ))

    # Q038 (advanced, Choice B)
    qs.append(make_matrix_q(
        "chem_pc2_038",
        topic,
        "advanced",
        "Match the reaction system in List I with the effect of doubling the container volume at constant temperature on the equilibrium mole fraction of the underlined product in List II:",
        [
            ("N2(g) + 3H2(g) ⇌ 2_NH3_(g) (Δn_g = -2)", "III", "Decreases (shifts reverse toward reactants, decreasing NH3 yield)", "Doubling volume decreases total pressure. By Le Chatelier's principle, system shifts toward the side with more moles (left). Hence mole fraction of NH3 decreases."),
            ("PCl5(g) ⇌ PCl3(g) + _Cl2_(g) (Δn_g = +1)", "I", "Increases (shifts forward toward products, increasing Cl2 yield)", "Decreasing pressure favors the side with more gas moles (products). Degree of dissociation α increases, so Cl2 mole fraction increases."),
            ("H2(g) + I2(g) ⇌ 2_HI_(g) (Δn_g = 0)", "IV", "Remains unchanged (independent of volume because Δn_g = 0)", "Since Δn_g = 0, pressure and volume changes do not shift the equilibrium position; mole fractions remain strictly unchanged."),
            ("C(s) + CO2(g) ⇌ 2_CO_(g) (Δn_g = +1)", "II", "Increases (shifts forward as gas volume increases)", "Solid carbon does not contribute to gas moles. Moles of gas increase from 1 to 2; volume expansion shifts reaction forward, increasing CO fraction."),
        ],
        "B"
    ))

    # Q039 (advanced, Choice C)
    qs.append(make_matrix_q(
        "chem_pc2_039",
        topic,
        "advanced",
        "For the liquid-vapor equilibrium of pure water: H2O(l) ⇌ H2O(g), ΔH_vap = 40.6 kJ/mol (assumed constant between 300 K and 373 K). Match the property / calculation in List I with its result in List II (R = 8.314 J/(mol·K)):",
        [
            ("Clausius-Clapeyron equation", "II", "ln(P2/P1) = -(ΔH_vap / R) · (1/T2 - 1/T1)", "Integrating the Clapeyron equation d(ln P)/dT = ΔH_vap / (RT^2) yields ln(P2/P1) = -(ΔH_vap / R)(1/T2 - 1/T1)."),
            ("Vapor pressure at 373 K (normal boiling point at 1 atm)", "IV", "1.00 atm (760 mmHg)", "Normal boiling point is defined as the temperature at which vapor pressure equals 1 atmosphere (1.00 atm = 760 Torr)."),
            ("Slope of ln P vs 1/T plot", "I", "-ΔH_vap / R ≈ -4883 K", "The Clausius-Clapeyron relation is ln P = -ΔH_vap/(RT) + C. Slope = -40600 / 8.314 ≈ -4883 K."),
            ("Boiling point of water on a high mountain where P_ext = 0.50 atm (using Clausius-Clapeyron)", "III", "≈ 354 K (81 °C)", "ln(0.5/1.0) = -4883 · (1/T - 1/373) => -0.693 = -4883 · (1/T - 0.002681) => 1/T - 0.002681 = 0.000142 => 1/T = 0.002823 => T ≈ 354.2 K (81.2 °C)."),
        ],
        "C"
    ))

    # Q040 (advanced, Choice D)
    qs.append(make_matrix_q(
        "chem_pc2_040",
        topic,
        "advanced",
        "For the industrial synthesis of ammonia: N2(g) + 3H2(g) ⇌ 2NH3(g) (ΔH° = -92 kJ/mol), match the operational condition / parameter in List I with its engineering / chemical rationale in List II:",
        [
            ("High pressure (150 - 250 atm)", "II", "Increases equilibrium yield of NH3 and accelerates reaction rate", "Since Δn_g = -2, higher pressure shifts equilibrium forward according to Le Chatelier's principle and increases reactant collision frequency."),
            ("Moderate temperature (400 - 450 °C) instead of room temperature", "IV", "Optimum compromise between thermodynamic yield (favored at low T) and kinetic rate (favored at high T)", "Lower temperature gives higher equilibrium K_p, but the reaction rate is prohibitively slow due to high activation energy of N≡N bond (945 kJ/mol)."),
            ("Iron catalyst promoted with K2O and Al2O3", "I", "Lowers activation energy without altering the equilibrium constant K_p", "The catalyst provides a low-activation path for N2 dissociation on the Fe surface. Promoters enhance surface area and structural stability."),
            ("Continuous condensation and removal of liquid NH3 from the recycling loop", "III", "Keeps Q_p < K_p, driving conversion of unreacted N2 and H2 to completion", "Removing product NH3 lowers its partial pressure, continuously driving the reaction forward by Le Chatelier's principle."),
        ],
        "D"
    ))

    return qs
