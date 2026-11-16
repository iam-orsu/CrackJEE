import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_states_questions():
    questions = []
    topic = "States of Matter"

    # Q41: beginner, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_041",
        topic=topic,
        difficulty="beginner",
        lead="Match the classical gas law in List I with its constant thermodynamic condition and relation in List II:",
        pairs=[
            ("Boyle's Law", "I", "At constant T and n: P is inversely proportional to V (P * V = constant)", 
             "Boyle's law dictates that the volume of a fixed mass of gas is inversely proportional to pressure at constant temperature"),
            ("Charles's Law", "III", "At constant P and n: V is directly proportional to T (V / T = constant)", 
             "Charles's law states that volume is directly proportional to absolute temperature for a fixed mass of gas at constant pressure"),
            ("Gay-Lussac's Law", "IV", "At constant V and n: P is directly proportional to T (P / T = constant)", 
             "Gay-Lussac's law establishes that gas pressure is directly proportional to absolute temperature at fixed volume and mole count"),
            ("Avogadro's Law", "II", "At constant T and P: V is directly proportional to n (V / n = constant)", 
             "Avogadro's principle establishes that equal volumes of gases at identical T and P contain identical numbers of moles")
        ],
        correct_choice="A"
    ))

    # Q42: beginner, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_042",
        topic=topic,
        difficulty="beginner",
        lead="Match the gas mixture at 300 K in List I with the mole fraction or partial pressure parameters in List II:",
        pairs=[
            ("Equal masses (4.0 g each) of Helium (He) and Methane (CH4)", "II", "Mole fraction X_He = 0.80 and X_CH4 = 0.20", 
             "Moles He = 4/4 = 1.0 mol; moles CH4 = 4/16 = 0.25 mol. Total = 1.25 mol. X_He = 1.0 / 1.25 = 0.80, X_CH4 = 0.20"),
            ("Equal masses (16.0 g each) of O2 and SO2", "IV", "Mole fraction X_O2 = 0.67 and X_SO2 = 0.33", 
             "Moles O2 = 16/32 = 0.50 mol; moles SO2 = 16/64 = 0.25 mol. Total = 0.75 mol. X_O2 = 0.50 / 0.75 = 0.67, X_SO2 = 0.33"),
            ("Equimolar mixture (1.0 mol each) of N2 and CO2 at P_total = 2.0 atm", "I", "Partial pressure of each component = 1.0 atm", 
             "For equimolar binary mixture, X_N2 = X_CO2 = 0.5. Partial pressures = 0.5 x 2.0 atm = 1.0 atm"),
            ("Mixture containing 8.0 g of O2 and 14.0 g of N2", "III", "Partial pressure ratio p_O2 : p_N2 = 1 : 2", 
             "Moles O2 = 8/32 = 0.25 mol; moles N2 = 14/28 = 0.50 mol. Partial pressure ratio = 0.25 : 0.50 = 1 : 2")
        ],
        correct_choice="B"
    ))

    # Q43: beginner, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_043",
        topic=topic,
        difficulty="beginner",
        lead="Match the pair of gases in List I with their relative rate of effusion (r1 / r2) via Graham's law in List II:",
        pairs=[
            ("H2 (M1 = 2 g/mol) and O2 (M2 = 32 g/mol)", "III", "r_H2 / r_O2 = 4.00", 
             "By Graham's law: r1 / r2 = sqrt(M2 / M1) = sqrt(32 / 2) = sqrt(16) = 4.00"),
            ("CH4 (M1 = 16 g/mol) and SO2 (M2 = 64 g/mol)", "IV", "r_CH4 / r_SO2 = 2.00", 
             "r1 / r2 = sqrt(64 / 16) = sqrt(4) = 2.00"),
            ("H2 (M1 = 2 g/mol) and He (M2 = 4 g/mol)", "I", "r_H2 / r_He = sqrt(2) approx 1.414", 
             "r1 / r2 = sqrt(4 / 2) = sqrt(2) approx 1.414"),
            ("CO2 (M1 = 44 g/mol) and N2O (M2 = 44 g/mol)", "II", "r_CO2 / r_N2O = 1.00 (identical effusion rates)", 
             "Both gases have identical molar mass (44 g/mol), hence r1 / r2 = sqrt(44 / 44) = 1.00")
        ],
        correct_choice="C"
    ))

    # Q44: beginner, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_044",
        topic=topic,
        difficulty="beginner",
        lead="Match the molecular speed definition for an ideal gas of molar mass M at temperature T in List I with its formula in List II:",
        pairs=[
            ("Root mean square speed (u_rms)", "IV", "sqrt(3 R T / M); largest speed among the three (ratio 1.224 relative to u_mp)", 
             "u_rms = sqrt(3RT/M) = sqrt(3/2) u_mp approx 1.224 u_mp"),
            ("Average speed (u_avg)", "II", "sqrt(8 R T / (pi M)); intermediate speed (ratio 1.128 relative to u_mp)", 
             "u_avg = sqrt(8RT/(pi M)) = sqrt(4/pi) u_mp approx 1.128 u_mp"),
            ("Most probable speed (u_mp)", "I", "sqrt(2 R T / M); peak of Maxwell-Boltzmann distribution (reference ratio 1.000)", 
             "u_mp = sqrt(2RT/M), the velocity corresponding to the distribution maximum"),
            ("Ratio of speeds u_mp : u_avg : u_rms", "III", "1.000 : 1.128 : 1.224 (or sqrt(2) : sqrt(8/pi) : sqrt(3))", 
             "The three speeds bear the ratio sqrt(2) : sqrt(8/pi) : sqrt(3) approx 1.000 : 1.128 : 1.224")
        ],
        correct_choice="D"
    ))

    # Q45: intermediate, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_045",
        topic=topic,
        difficulty="intermediate",
        lead="Match the kinetic molecular property for an ideal gas in List I with its mathematical formulation in List II:",
        pairs=[
            ("Total translational kinetic energy of 1.0 mol of gas", "I", "(3/2) R T", 
             "For 1 mole of gas, total translational kinetic energy = (3/2) R T"),
            ("Average translational kinetic energy per individual molecule", "III", "(3/2) k_B T", 
             "Dividing molar kinetic energy by Avogadro's number gives (3/2) k_B T per molecule"),
            ("Pressure expression from kinetic gas theory", "IV", "P = (1/3) (m N / V) u_rms^2 = (1/3) rho u_rms^2", 
             "The kinetic gas equation expresses macroscopic pressure in terms of density and root mean square speed"),
            ("Energy per translational degree of freedom per molecule", "II", "(1/2) k_B T", 
             "Equipartition theorem assigns (1/2) k_B T of energy per degree of freedom per particle")
        ],
        correct_choice="A"
    ))

    # Q46: intermediate, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_046",
        topic=topic,
        difficulty="intermediate",
        lead="Match the van der Waals parameter / correction in List I with its physical significance in List II:",
        pairs=[
            ("van der Waals constant 'a'", "II", "Measures magnitude of intermolecular attractive forces; units: atm L^2 mol^-2", 
             "Constant 'a' corrects for cohesive attractive forces between gas molecules"),
            ("van der Waals constant 'b'", "IV", "Measures excluded volume (co-volume = 4 * N_A * V_molecule); units: L mol^-1", 
             "Constant 'b' accounts for the finite incompressible volume occupied by molecules"),
            ("Internal pressure term (P_internal)", "I", "a / V_m^2; cohesive pressure added to measured pressure", 
             "Internal pressure a / V_m^2 accounts for attractive intermolecular forces in real gases"),
            ("Effective volume available for molecular motion", "III", "(V - n b); container volume corrected for particle volume", 
             "Molecules can move only within the free volume (V - nb) after excluding their finite size")
        ],
        correct_choice="B"
    ))

    # Q47: intermediate, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_047",
        topic=topic,
        difficulty="intermediate",
        lead="Match the real gas pressure/temperature regime in List I with the approximate compressibility factor (Z) in List II:",
        pairs=[
            ("Extremely low pressure (P -> 0) at any temperature", "III", "Z approx 1 (behaves as ideal gas, P V_m = R T)", 
             "At near-zero pressure, both intermolecular forces and molecular volume corrections become negligible, so Z -> 1"),
            ("Low to moderate pressure below Boyle temperature", "IV", "Z = 1 - a / (R T V_m) < 1 (intermolecular attractions dominate)", 
             "At moderate pressure, attractive forces predominate, compressing the gas and reducing Z below 1"),
            ("High pressure (P >> 1 atm) at any temperature", "I", "Z = 1 + P b / (R T) > 1 (molecular size / repulsions dominate)", 
             "At high pressure, excluded volume 'b' becomes significant, resisting further compression and driving Z > 1"),
            ("Extremely high temperature (T >> Tc) at moderate pressure", "II", "Z approx 1 + P b / (R T) approx 1 (kinetic energy dominates attraction)", 
             "At very high temperatures, thermal energy overwhelms attractive forces (a/RTV -> 0), so Z approaches 1 from above")
        ],
        correct_choice="C"
    ))

    # Q48: intermediate, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_048",
        topic=topic,
        difficulty="intermediate",
        lead="Match the critical state parameter of a van der Waals gas in List I with its formula in terms of a, b, and R in List II:",
        pairs=[
            ("Critical temperature (T_c)", "II", "8a / (27 R b)", 
             "At the critical point, (dP/dV) = 0 and (d2P/dV2) = 0, yielding T_c = 8a / (27 R b)"),
            ("Critical pressure (P_c)", "IV", "a / (27 b^2)", 
             "Substituting critical volume and critical temperature gives P_c = a / (27 b^2)"),
            ("Critical molar volume (V_c)", "I", "3 b", 
             "The inflection condition produces three identical volume roots at V_c = 3b"),
            ("Critical compressibility factor (Z_c = P_c V_c / (R T_c))", "III", "3 / 8 = 0.375 (universal constant for all van der Waals gases)", 
             "Z_c = (a / 27 b^2) * (3 b) / (R * 8a / 27 R b) = 3 / 8 = 0.375")
        ],
        correct_choice="D"
    ))

    # Q49: intermediate, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_049",
        topic=topic,
        difficulty="intermediate",
        lead="Match the characteristic thermodynamic temperature / phenomenon in List I with its formula or consequence in List II:",
        pairs=[
            ("Boyle temperature (T_B)", "I", "T_B = a / (R b); real gas obeys ideal gas law over wide pressure range", 
             "At T_B = a / (Rb), attractive and repulsive forces cancel, making second virial coefficient zero"),
            ("Inversion temperature (T_i)", "III", "T_i = 2a / (R b) = 2 T_B; Joule-Thomson coefficient mu_JT changes sign", 
             "At T_i = 2a / (Rb), mu_JT = 0. Expansion cools below T_i and heats above T_i"),
            ("Joule-Thomson expansion below inversion temperature (T < T_i)", "IV", "mu_JT > 0; gas cools upon adiabatic throttling expansion", 
             "Below T_i, attractive forces dominate; doing work against attraction during expansion cools the gas"),
            ("Joule-Thomson expansion above inversion temperature (T > T_i, e.g. H2 at 300 K)", "II", "mu_JT < 0; gas warms upon adiabatic throttling expansion", 
             "Above T_i, repulsive forces dominate; adiabatic expansion results in an increase in temperature")
        ],
        correct_choice="A"
    ))

    # Q50: intermediate, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_050",
        topic=topic,
        difficulty="intermediate",
        lead="Match the modification of the Maxwell-Boltzmann molecular speed distribution in List I with its effect in List II:",
        pairs=[
            ("Increasing the temperature of a gas sample", "II", "Peak broadens, shifts to higher speed, and maximum height decreases", 
             "Higher temperature shifts distribution rightward; conservation of total probability lowers and broadens the peak"),
            ("Increasing the molar mass of the gas at constant temperature", "IV", "Peak narrows, shifts to lower speed, and maximum height increases", 
             "Heavier molecules move slower on average; the peak compresses leftward and rises to maintain unit area"),
            ("Total area under the Maxwell-Boltzmann distribution curve", "I", "Remains constant (= 1.0), representing total probability", 
             "The integral of probability density over all speeds from 0 to infinity is strictly normalised to 1.0"),
            ("Fraction of molecules in the high-speed tail (speeds >> u_mp)", "III", "Increases exponentially with temperature according to exp(-E / k_B T)", 
             "The population of high-energy molecules grows exponentially with temperature, explaining Arrhenius activation kinetics")
        ],
        correct_choice="B"
    ))

    # Q51: intermediate, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_051",
        topic=topic,
        difficulty="intermediate",
        lead="Match the gas at 300 K and 1 atm in List I with its non-ideal behavior and liquefaction properties in List II:",
        pairs=[
            ("Hydrogen gas (H2)", "III", "Z > 1 at all pressures at 300 K; difficult to liquefy (T_B = 110 K < 300 K)", 
             "Due to low polarizability and tiny 'a', 300 K is well above Boyle temperature, so Z > 1 for all positive pressures"),
            ("Helium gas (He)", "IV", "Z > 1 at all pressures at 300 K; lowest boiling point of all elements (4.2 K)", 
             "He has minimal attractive forces (very low 'a'); repulsive volume effects dominate at 300 K, giving Z > 1"),
            ("Ammonia gas (NH3)", "I", "Z << 1 at moderate pressure; readily liquefied by modest compression at room temperature", 
             "NH3 exhibits strong dipole-dipole attractions and hydrogen bonding (large 'a'), giving high T_c (405.5 K)"),
            ("Carbon dioxide gas (CO2)", "II", "Z < 1 at moderate pressure; liquefiable at 300 K under approx 56 atm (T_c = 304.2 K)", 
             "CO2 has significant polarizability (moderate 'a') and critical temperature of 304.2 K, liquefying under pressure at 300 K")
        ],
        correct_choice="C"
    ))

    # Q52: intermediate, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_052",
        topic=topic,
        difficulty="intermediate",
        lead="Match the liquid physical property in List I with its definition and characteristics in List II:",
        pairs=[
            ("Surface tension (gamma)", "II", "Work required to increase surface area by unity; units: N/m or J/m^2; decreases with T", 
             "Surface tension arises from unbalanced inward cohesive forces on surface molecules and drops to zero at critical temperature"),
            ("Viscosity coefficient (eta)", "IV", "Frictional resistance between adjacent fluid layers in laminar flow; decreases with T", 
             "Viscosity measures internal fluid shear resistance and decreases exponentially with rising temperature in liquids"),
            ("Equilibrium vapor pressure", "I", "Pressure of vapor in dynamic equilibrium with liquid in a closed vessel; increases with T", 
             "At liquid-vapor equilibrium, rates of vaporization and condensation equalize; vapor pressure rises exponentially with T"),
            ("Normal boiling point", "III", "Temperature at which liquid vapor pressure equals exactly 1.0 atm (1.01325 bar)", 
             "Boiling commences throughout the liquid when vapor pressure matches external 1 atm pressure")
        ],
        correct_choice="D"
    ))

    # Q53: advanced, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_053",
        topic=topic,
        difficulty="advanced",
        lead="Match the kinetic theory collision parameter for a gas with molecular diameter d and number density n* in List I with its formula in List II:",
        pairs=[
            ("Mean free path (lambda)", "I", "1 / (sqrt(2) * pi * d^2 * n*)", 
             "The average distance between successive molecular collisions is lambda = 1 / (sqrt(2) pi d^2 n*)"),
            ("Collision frequency of a single molecule (Z1)", "III", "sqrt(2) * pi * d^2 * u_avg * n*", 
             "Number of collisions experienced by one molecule per second is Z1 = sqrt(2) pi d^2 u_avg n*"),
            ("Total bimolecular collision frequency per unit volume (Z11)", "IV", "(1/2) * sqrt(2) * pi * d^2 * u_avg * (n*)^2", 
             "Total collisions occurring per unit volume per second is Z11 = (1/2) n* Z1 = (1/sqrt(2)) pi d^2 u_avg (n*)^2"),
            ("Collision diameter (d)", "II", "Closest distance of approach between centers of two colliding spherical molecules", 
             "Collision diameter d is the distance between centers of two molecular spheres during collision impact")
        ],
        correct_choice="A"
    ))

    # Q54: advanced, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_054",
        topic=topic,
        difficulty="advanced",
        lead="In the virial expansion Z = 1 + B(T)/V_m + C(T)/V_m^2 + ..., match the virial parameter in List I with its van der Waals relation in List II:",
        pairs=[
            ("Second virial coefficient B(T)", "II", "B(T) = b - a / (R T)", 
             "Expanding the van der Waals equation in powers of 1/V_m gives second virial coefficient B(T) = b - a / (RT)"),
            ("Third virial coefficient C(T)", "IV", "C(T) = b^2", 
             "The third virial coefficient from the van der Waals equation is temperature-independent and equals b^2"),
            ("Boyle temperature condition", "I", "B(T_B) = 0, giving T_B = a / (R b)", 
             "At T_B, the second virial coefficient vanishes: b - a/(RT_B) = 0 => T_B = a / (Rb)"),
            ("Initial slope of Z versus P as P -> 0", "III", "lim_{P->0} (del Z / del P)_T = B(T) / (R T) = (b - a / (RT)) / (R T)", 
             "As P -> 0, dZ/dP = B(T) / (RT). The slope is negative below T_B, zero at T_B, and positive above T_B")
        ],
        correct_choice="B"
    ))

    # Q55: advanced, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_055",
        topic=topic,
        difficulty="advanced",
        lead="Match the barometric distribution parameter for an isothermal ideal atmosphere in List I with its expression in List II:",
        pairs=[
            ("Pressure at altitude h (Barometric equation)", "III", "P(h) = P0 * exp(-M * g * h / (R * T))", 
             "Hydrostatic equilibrium dP = -rho g dh integrated with ideal gas density gives P(h) = P0 exp(-Mgh / RT)"),
            ("Atmospheric scale height (H)", "IV", "H = R * T / (M * g)", 
             "Scale height H represents the vertical distance over which atmospheric pressure drops by factor of 1/e: H = RT / (Mg)"),
            ("Ratio of pressure at altitude h = 2 H to sea-level pressure P0", "I", "P(2H) / P0 = e^-2 approx 0.1353", 
             "At h = 2H, P(2H) / P0 = exp(-2H / H) = e^-2 approx 0.1353"),
            ("Ratio of density of heavy gas (M2) to light gas (M1) at altitude h", "II", "(rho2 / rho1)_h = (rho2 / rho1)_0 * exp(-(M2 - M1) * g * h / (R * T))", 
             "Heavier gases settle lower in the gravitational field because their density decays faster with increasing altitude")
        ],
        correct_choice="C"
    ))

    # Q56: advanced, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_056",
        topic=topic,
        difficulty="advanced",
        lead="Match the reduced state parameter in the Law of Corresponding States in List I with its formulation in List II:",
        pairs=[
            ("Reduced pressure (P_r)", "IV", "P / P_c", 
             "Reduced pressure is the actual pressure scaled by the critical pressure: P_r = P / P_c"),
            ("Reduced temperature (T_r)", "II", "T / T_c", 
             "Reduced temperature is absolute temperature scaled by critical temperature: T_r = T / T_c"),
            ("Reduced molar volume (V_r)", "I", "V_m / V_c", 
             "Reduced volume is molar volume scaled by critical molar volume: V_r = V_m / V_c"),
            ("Reduced van der Waals equation of state", "III", "(P_r + 3 / V_r^2) * (3 V_r - 1) = 8 T_r", 
             "Expressing van der Waals equation in reduced variables eliminates constants a and b, yielding a universal equation")
        ],
        correct_choice="D"
    ))

    # Q57: advanced, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_057",
        topic=topic,
        difficulty="advanced",
        lead="Match the Knudsen effusion and gas separation parameter in List I with its mathematical formulation in List II:",
        pairs=[
            ("Effusion flux per unit orifice area (Phi)", "I", "P / sqrt(2 * pi * m * k_B * T)", 
             "The rate of molecular escape per unit area into vacuum under molecular flow is Phi = P / sqrt(2 pi m k_B T)"),
            ("Single-stage separation factor (alpha) for binary gas mixture (A, B)", "III", "alpha = sqrt(M_B / M_A)", 
             "From Graham's law, relative effusion rate gives the separation factor alpha = sqrt(M_B / M_A)"),
            ("Single-stage separation factor for 235UF6 (349 g/mol) and 238UF6 (352 g/mol)", "IV", "alpha = sqrt(352 / 349) approx 1.00429", 
             "For gaseous uranium hexafluoride isotopes, alpha = sqrt(352 / 349) = 1.00429"),
            ("Overall separation factor after N cascaded enrichment stages", "II", "alpha_total = alpha^N", 
             "In a series of N ideal enrichment stages without remixing, separation factor multiplies as alpha^N")
        ],
        correct_choice="A"
    ))

    # Q58: advanced, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_058",
        topic=topic,
        difficulty="advanced",
        lead="Match the capillary and surface tension phenomenon in List I with its formula in List II:",
        pairs=[
            ("Excess pressure inside a spherical liquid droplet of radius R", "II", "Delta P = 2 gamma / R", 
             "A liquid droplet has a single surface interface; Young-Laplace gives Delta P = 2 gamma / R"),
            ("Excess pressure inside a hollow spherical soap bubble of radius R", "IV", "Delta P = 4 gamma / R", 
             "A soap bubble has two liquid-gas interfaces (interior and exterior), doubling excess pressure to Delta P = 4 gamma / R"),
            ("Capillary rise height (h) in tube of radius r (contact angle theta, density rho)", "I", "h = (2 gamma cos theta) / (r rho g)", 
             "Balancing vertical surface tension force 2 pi r gamma cos theta with column weight pi r^2 h rho g gives h = 2 gamma cos theta / (r rho g)"),
            ("Contact angle condition theta < 90° (e.g. water on clean glass)", "III", "Liquid wets the solid; meniscus is concave upward", 
             "Adhesive forces exceed liquid cohesive forces, resulting in complete/partial wetting and concave meniscus")
        ],
        correct_choice="B"
    ))

    # Q59: advanced, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_059",
        topic=topic,
        difficulty="advanced",
        lead="Match the temperature-dependent fluid phenomenon in List I with its governing equation / behavior in List II:",
        pairs=[
            ("Clausius-Clapeyron equation for vapor pressure", "III", "ln(P2 / P1) = (Delta H_vap / R) * (1 / T1 - 1 / T2)", 
             "Relates vapor pressure of a liquid to temperature via the molar enthalpy of vaporization Delta H_vap"),
            ("Andrade equation for liquid viscosity eta(T)", "IV", "eta = A * exp(E_vis / (R T))", 
             "Liquid viscosity decreases exponentially with temperature as molecules overcome activation barrier E_vis for shear flow"),
            ("Temperature effect on gas viscosity versus liquid viscosity", "I", "Gas viscosity increases with T (eta proportional to sqrt(T)); liquid viscosity decreases with T", 
             "Gas viscosity arises from momentum exchange via thermal molecular collisions; liquid viscosity is governed by cohesive intermolecular bonds"),
            ("Critical opalescence phenomenon near T_c", "II", "Intense light scattering due to macroscopic density fluctuations near critical point", 
             "At the critical point, infinite compressibility leads to large density fluctuations that scatter visible light milky white")
        ],
        correct_choice="C"
    ))

    # Q60: advanced, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_060",
        topic=topic,
        difficulty="advanced",
        lead="Match the Joule-Thomson expansion parameter in List I with its thermodynamic definition or value in List II:",
        pairs=[
            ("Joule-Thomson coefficient (mu_JT)", "IV", "(del T / del P)_H (rate of temperature change with pressure at constant enthalpy)", 
             "The Joule-Thomson coefficient measures temperature change during adiabatic throttling per unit drop in pressure"),
            ("Enthalpy change during steady-state throttling through porous plug", "II", "Delta H = 0 (strictly isenthalpic process)", 
             "In steady adiabatic flow without external shaft work, initial and final enthalpies are identical (Delta H = 0)"),
            ("Maximum inversion temperature for van der Waals gas (T_i,max)", "I", "2a / (R b)", 
             "Setting mu_JT = 0 as P -> 0 gives T_i,max = 2a / (Rb) = 2 T_B"),
            ("Joule-Thomson inversion curve locus in P-T space", "III", "Boundary locus where mu_JT = 0, separating cooling (mu_JT > 0) and heating (mu_JT < 0) zones", 
             "The inversion curve delineates thermodynamic states where throttling produces cooling from states where it produces heating")
        ],
        correct_choice="D"
    ))

    return questions
