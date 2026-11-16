import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_atomic_questions():
    questions = []
    topic = "Atomic Structure"

    # Q21: beginner, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_021",
        topic=topic,
        difficulty="beginner",
        lead="Match the pairs/sets of nuclides or species in List I with their classification in List II:",
        pairs=[
            ("6C14 and 7N14", "I", "Isobars (same mass number A = 14, different atomic numbers)", 
             "Both carbon-14 and nitrogen-14 have mass number A = 14 but different atomic numbers (Z=6 and Z=7), hence they are isobars"),
            ("6C12 and 6C14", "III", "Isotopes (same atomic number Z = 6, different mass numbers)", 
             "Carbon-12 and carbon-14 share the same atomic number Z = 6 but have different mass numbers (A=12 and A=14), hence they are isotopes"),
            ("6C14 and 8O16", "IV", "Isotones (same number of neutrons: N = A - Z = 8)", 
             "For 6C14, N = 14 - 6 = 8 neutrons; for 8O16, N = 16 - 8 = 8 neutrons. Species with identical neutron counts are isotones"),
            ("N3-, O2-, and F-", "II", "Isoelectronic species (each possessing exactly 10 electrons)", 
             "N3- (7+3=10), O2- (8+2=10), and F- (9+1=10) each have 10 electrons, making them isoelectronic")
        ],
        correct_choice="A"
    ))

    # Q22: beginner, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_022",
        topic=topic,
        difficulty="beginner",
        lead="Match the quantum number in List I with the atomic property it dictates in List II:",
        pairs=[
            ("Principal quantum number (n)", "II", "Determines shell size, principal energy level, and mean distance from nucleus", 
             "The principal quantum number n (1, 2, 3...) determines the primary energy level and radial extent of the electron cloud"),
            ("Azimuthal quantum number (l)", "IV", "Determines orbital angular momentum and three-dimensional orbital shape", 
             "The azimuthal quantum number l (from 0 to n-1) defines the shape of the orbital (s, p, d, f) and orbital angular momentum"),
            ("Magnetic quantum number (m_l)", "I", "Determines spatial orientation of the orbital relative to coordinate axes", 
             "The magnetic quantum number m_l (-l to +l) dictates the orientation of the orbital in space"),
            ("Spin quantum number (m_s)", "III", "Determines intrinsic spin angular momentum projection (+1/2 or -1/2)", 
             "The spin quantum number m_s specifies the orientation of the electron's intrinsic magnetic spin along an axis")
        ],
        correct_choice="B"
    ))

    # Q23: beginner, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_023",
        topic=topic,
        difficulty="beginner",
        lead="Match the spectral series of the hydrogen emission spectrum in List I with its spectral region and terminal level (n1) in List II:",
        pairs=[
            ("Lyman series", "III", "Ultraviolet (UV) region, de-excitation terminates at n1 = 1", 
             "Lyman series arises from electronic transitions from n2 >= 2 down to n1 = 1, falling entirely in the UV region"),
            ("Balmer series", "IV", "Visible region, de-excitation terminates at n1 = 2", 
             "Balmer series corresponds to transitions from n2 >= 3 down to n1 = 2, producing prominent visible lines"),
            ("Paschen series", "I", "Near-Infrared (Near-IR) region, de-excitation terminates at n1 = 3", 
             "Paschen series corresponds to transitions from n2 >= 4 down to n1 = 3, occurring in the near-infrared spectrum"),
            ("Brackett series", "II", "Mid-Infrared (Mid-IR) region, de-excitation terminates at n1 = 4", 
             "Brackett series corresponds to transitions from n2 >= 5 down to n1 = 4, occurring in the mid-infrared region")
        ],
        correct_choice="C"
    ))

    # Q24: beginner, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_024",
        topic=topic,
        difficulty="beginner",
        lead="Match the fundamental electronic configuration rule in List I with its operational statement in List II:",
        pairs=[
            ("Aufbau Principle", "IV", "Orbitals are filled in order of increasing energy from lowest to highest", 
             "Aufbau principle dictates that ground state electrons occupy orbitals of progressively higher energies"),
            ("Pauli Exclusion Principle", "II", "No two electrons in an atom can have identical values for all four quantum numbers", 
             "Pauli exclusion ensures that an individual orbital can hold at most two electrons, and their spins must be antiparallel"),
            ("Hund's Rule of Maximum Multiplicity", "I", "Degenerate orbitals are each singly occupied with parallel spins before pairing begins", 
             "Hund's rule minimizes electron repulsion and maximizes exchange energy by favoring maximum unpaired parallel spins"),
            ("(n + l) Energy Rule", "III", "Orbitals with lower (n + l) fill first; if equal, the one with lower n fills first", 
             "Orbital energy in multi-electron atoms scales with (n + l); when (n + l) values match, lower n designates lower energy")
        ],
        correct_choice="D"
    ))

    # Q25: intermediate, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_025",
        topic=topic,
        difficulty="intermediate",
        lead="Match the Bohr orbit parameter for a hydrogen-like atom of nuclear charge Z and shell n in List I with its proportionality in List II:",
        pairs=[
            ("Orbital radius (r_n)", "I", "Proportional to n^2 / Z (r_n = 0.529 n^2 / Z Å)", 
             "Equating electrostatic attraction to centripetal force yields r_n proportional to n^2 / Z"),
            ("Orbital velocity (v_n)", "III", "Proportional to Z / n (v_n = 2.18 x 10^6 Z / n m/s)", 
             "From angular momentum quantization m v r = n h_bar, substituting r gives v_n proportional to Z / n"),
            ("Total electronic energy (E_n)", "IV", "Proportional to -Z^2 / n^2 (E_n = -13.6 Z^2 / n^2 eV)", 
             "Total energy E_n = -KE = -13.6 Z^2 / n^2 eV, proportional to -Z^2 / n^2"),
            ("Frequency of orbital revolution (f_n)", "II", "Proportional to Z^2 / n^3", 
             "Revolution frequency f_n = v_n / (2 pi r_n) proportional to (Z/n) / (n^2/Z) = Z^2 / n^3")
        ],
        correct_choice="A"
    ))

    # Q26: intermediate, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_026",
        topic=topic,
        difficulty="intermediate",
        lead="Match the particle/condition in List I with its de Broglie wavelength expression or value in List II:",
        pairs=[
            ("Electron accelerated from rest through a potential of 150 V", "II", "1.00 Å (0.100 nm)", 
             "For an electron, lambda = sqrt(150 / V) Å = sqrt(150 / 150) = 1.00 Å"),
            ("Particle of mass m with kinetic energy K", "IV", "lambda = h / sqrt(2 m K)", 
             "Since momentum p = sqrt(2 m K), de Broglie wavelength is lambda = h / p = h / sqrt(2 m K)"),
            ("Thermal neutron at absolute temperature T (mass m_n)", "I", "lambda = h / sqrt(3 m_n k_B T)", 
             "Mean kinetic energy of thermal neutron = (3/2) k_B T, yielding lambda = h / sqrt(3 m_n k_B T)"),
            ("Alpha particle accelerated from rest through potential V", "III", "lambda = 0.101 / sqrt(V) Å", 
             "For alpha particle (q=2e, m=4 m_p), lambda = h / sqrt(2 m q V) = 0.101 / sqrt(V) Å")
        ],
        correct_choice="B"
    ))

    # Q27: intermediate, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_027",
        topic=topic,
        difficulty="intermediate",
        lead="Match the uncertainty condition for an electron (mass = 9.1 x 10^-31 kg) in List I with the minimum uncertainty in velocity (Delta v) in List II:",
        pairs=[
            ("Uncertainty in position Delta x = 0.10 nm (atomic scale)", "III", "Delta v >= 5.79 x 10^5 m/s", 
             "By Heisenberg uncertainty: Delta v >= h / (4 pi m Delta x) = 6.626e-34 / (4 pi * 9.109e-31 * 1.0e-10) = 5.79 x 10^5 m/s"),
            ("Uncertainty in position Delta x = 1.0 pm (1.0 x 10^-12 m)", "IV", "Delta v >= 5.79 x 10^7 m/s", 
             "Delta v >= 6.626e-34 / (4 pi * 9.109e-31 * 1.0e-12) = 5.79 x 10^7 m/s"),
            ("Uncertainty in momentum equals total momentum (Delta p = p)", "I", "Delta x >= lambda / (4 pi)", 
             "With Delta p = p = h / lambda, Heisenberg relation gives Delta x * (h / lambda) >= h / (4 pi) => Delta x >= lambda / (4 pi)"),
            ("Uncertainty in position Delta x = 5.29 x 10^-11 m (first Bohr radius a0)", "II", "Delta v >= 1.09 x 10^6 m/s", 
             "Delta v >= 6.626e-34 / (4 pi * 9.109e-31 * 5.29e-11) = 1.09 x 10^6 m/s")
        ],
        correct_choice="C"
    ))

    # Q28: intermediate, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_028",
        topic=topic,
        difficulty="intermediate",
        lead="Match the hydrogenic atomic orbital in List I with its node count in List II:",
        pairs=[
            ("3s orbital", "II", "2 radial nodes and 0 angular nodes (total 2 nodes)", 
             "For 3s: n=3, l=0. Radial nodes = n - l - 1 = 3 - 0 - 1 = 2; angular nodes = l = 0"),
            ("3p orbital", "IV", "1 radial node and 1 angular node (total 2 nodes)", 
             "For 3p: n=3, l=1. Radial nodes = 3 - 1 - 1 = 1; angular nodes = l = 1"),
            ("3d orbital", "I", "0 radial nodes and 2 angular nodes (total 2 nodes)", 
             "For 3d: n=3, l=2. Radial nodes = 3 - 2 - 1 = 0; angular nodes = l = 2"),
            ("4f orbital", "III", "0 radial nodes and 3 angular nodes (total 3 nodes)", 
             "For 4f: n=4, l=3. Radial nodes = 4 - 3 - 1 = 0; angular nodes = l = 3")
        ],
        correct_choice="D"
    ))

    # Q29: intermediate, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_029",
        topic=topic,
        difficulty="intermediate",
        lead="Match the electronic de-excitation in the hydrogen-like species in List I with its wave number in terms of Rydberg constant R_H in List II:",
        pairs=[
            ("H atom (Z = 1): transition from n = 2 to n = 1", "I", "(3/4) R_H", 
             "nu_bar = R_H * Z^2 * (1/1^2 - 1/2^2) = R_H * 1 * (3/4) = (3/4) R_H"),
            ("He+ ion (Z = 2): transition from n = 3 to n = 1", "III", "(32/9) R_H", 
             "nu_bar = R_H * (2)^2 * (1 - 1/9) = 4 * (8/9) R_H = (32/9) R_H"),
            ("Li2+ ion (Z = 3): transition from n = 3 to n = 2", "IV", "(5/4) R_H", 
             "nu_bar = R_H * (3)^2 * (1/4 - 1/9) = 9 * (5/36) R_H = (5/4) R_H"),
            ("Be3+ ion (Z = 4): transition from n = 4 to n = 2", "II", "3 R_H", 
             "nu_bar = R_H * (4)^2 * (1/4 - 1/16) = 16 * (3/16) R_H = 3 R_H")
        ],
        correct_choice="A"
    ))

    # Q30: intermediate, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_030",
        topic=topic,
        difficulty="intermediate",
        lead="Photons of energy 5.00 eV strike various metal surfaces. Match the metal work function (Phi) in List I with the photoelectric outcome in List II:",
        pairs=[
            ("Metal with work function Phi = 2.00 eV", "II", "Stopping potential V0 = 3.00 V and KE_max = 3.00 eV", 
             "Einstein equation: KE_max = h*nu - Phi = 5.00 - 2.00 = 3.00 eV. Stopping potential V0 = 3.00 V"),
            ("Metal with work function Phi = 3.50 eV", "IV", "Stopping potential V0 = 1.50 V and KE_max = 1.50 eV", 
             "KE_max = 5.00 - 3.50 = 1.50 eV; stopping potential V0 = 1.50 V"),
            ("Metal with work function Phi = 4.20 eV", "I", "Stopping potential V0 = 0.80 V and KE_max = 0.80 eV", 
             "KE_max = 5.00 - 4.20 = 0.80 eV; stopping potential V0 = 0.80 V"),
            ("Metal with work function Phi = 5.50 eV", "III", "No photoelectrons emitted (photon energy is below threshold)", 
             "Since incident photon energy 5.00 eV < Phi (5.50 eV), no photoelectric emission occurs")
        ],
        correct_choice="B"
    ))

    # Q31: intermediate, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_031",
        topic=topic,
        difficulty="intermediate",
        lead="Match the first-row transition metal cation in List I with its unpaired electrons and spin-only magnetic moment in List II:",
        pairs=[
            ("Fe2+ (Z = 26, [Ar] 3d6)", "III", "4 unpaired electrons, mu = sqrt(24) = 4.90 BM", 
             "In 3d6, Hund's rule gives 1 pair and 4 unpaired electrons (n=4). mu = sqrt(4(4+2)) = sqrt(24) = 4.90 BM"),
            ("Mn2+ (Z = 25, [Ar] 3d5)", "IV", "5 unpaired electrons, mu = sqrt(35) = 5.92 BM", 
             "In 3d5, each orbital has 1 unpaired electron (n=5). mu = sqrt(5(5+2)) = sqrt(35) = 5.92 BM"),
            ("Cr3+ (Z = 24, [Ar] 3d3)", "I", "3 unpaired electrons, mu = sqrt(15) = 3.87 BM", 
             "In 3d3, there are 3 unpaired electrons (n=3). mu = sqrt(3(3+2)) = sqrt(15) = 3.87 BM"),
            ("Cu2+ (Z = 29, [Ar] 3d9)", "II", "1 unpaired electron, mu = sqrt(3) = 1.73 BM", 
             "In 3d9, there are 4 pairs and 1 unpaired electron (n=1). mu = sqrt(1(1+2)) = sqrt(3) = 1.73 BM")
        ],
        correct_choice="C"
    ))

    # Q32: intermediate, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_032",
        topic=topic,
        difficulty="intermediate",
        lead="Match the atomic orbital in List I with the profile of its radial distribution function 4 pi r^2 R^2(r) in List II:",
        pairs=[
            ("1s orbital", "II", "1 peak (maximum at r = a0) and 0 radial nodes", 
             "For 1s: n=1, l=0. Radial nodes = 0. Curve has a single maximum located at r = a0"),
            ("2s orbital", "IV", "2 peaks separated by 1 radial node at r = 2 a0", 
             "For 2s: n=2, l=0. Radial nodes = 1. Has an inner minor peak, a node at r = 2 a0, and a prominent outer peak"),
            ("2p orbital", "I", "1 peak (maximum at r = 4 a0) and 0 radial nodes", 
             "For 2p: n=2, l=1. Radial nodes = 0. Has exactly one maximum at r = 4 a0"),
            ("3p orbital", "III", "2 peaks separated by 1 radial node", 
             "For 3p: n=3, l=1. Radial nodes = 3 - 1 - 1 = 1. Displays two probability peaks separated by one node")
        ],
        correct_choice="D"
    ))

    # Q33: advanced, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_033",
        topic=topic,
        difficulty="advanced",
        lead="Match the hydrogen-like atomic ion state in List I with its ionization energy (binding energy) in List II:",
        pairs=[
            ("Ground state of He+ ion (Z = 2, n = 1)", "I", "54.40 eV", 
             "Binding energy = 13.6 * Z^2 / n^2 = 13.6 * (4 / 1) = 54.40 eV"),
            ("First excited state of Li2+ ion (Z = 3, n = 2)", "III", "30.60 eV", 
             "Binding energy = 13.6 * (9 / 4) = 30.60 eV"),
            ("Second excited state of Be3+ ion (Z = 4, n = 3)", "IV", "24.18 eV", 
             "Binding energy = 13.6 * (16 / 9) = 24.18 eV"),
            ("Ground state of H atom (Z = 1, n = 1)", "II", "13.60 eV", 
             "Binding energy = 13.6 * (1 / 1) = 13.60 eV")
        ],
        correct_choice="A"
    ))

    # Q34: advanced, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_034",
        topic=topic,
        difficulty="advanced",
        lead="Match the atomic orbital in List I with its mathematical nodal surfaces in List II:",
        pairs=[
            ("d_xy orbital", "II", "Two perpendicular nodal planes: x = 0 (yz-plane) and y = 0 (xz-plane)", 
             "Angular function is proportional to xy. It vanishes whenever x = 0 or y = 0"),
            ("d_x2-y2 orbital", "IV", "Two perpendicular nodal planes: y = x and y = -x", 
             "Angular function is proportional to (x^2 - y^2). It vanishes along the planes y = x and y = -x"),
            ("d_z2 orbital", "I", "Two conical nodal surfaces at cos^2(theta) = 1/3 (theta = 54.74° and 125.26°)", 
             "Angular function is proportional to (3 cos^2 theta - 1). Setting to zero yields two cones opening along z-axis"),
            ("p_z orbital", "III", "One nodal plane: z = 0 (the entire xy-plane)", 
             "Angular function is proportional to z / r = cos(theta). It vanishes for all points on z = 0")
        ],
        correct_choice="B"
    ))

    # Q35: advanced, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_035",
        topic=topic,
        difficulty="advanced",
        lead="Match the electron in the atom in List I with its effective nuclear charge (Z_eff) calculated via Slater's rules in List II:",
        pairs=[
            ("4s electron in Zinc atom (Zn, Z = 30)", "III", "Z_eff = 4.35 (screening constant sigma = 25.65)", 
             "sigma = 1*(0.35) + 18*(0.85) + 10*(1.00) = 25.65. Z_eff = 30 - 25.65 = 4.35"),
            ("3d electron in Zinc atom (Zn, Z = 30)", "IV", "Z_eff = 8.85 (screening constant sigma = 21.15)", 
             "sigma = 9*(0.35) + 18*(1.00) = 21.15. Z_eff = 30 - 21.15 = 8.85"),
            ("2p electron in Carbon atom (C, Z = 6)", "I", "Z_eff = 3.25 (screening constant sigma = 2.75)", 
             "sigma = 3*(0.35) + 2*(0.85) = 2.75. Z_eff = 6 - 2.75 = 3.25"),
            ("3s electron in Sodium atom (Na, Z = 11)", "II", "Z_eff = 2.20 (screening constant sigma = 8.80)", 
             "sigma = 8*(0.85) + 2*(1.00) = 8.80. Z_eff = 11 - 8.80 = 2.20")
        ],
        correct_choice="C"
    ))

    # Q36: advanced, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_036",
        topic=topic,
        difficulty="advanced",
        lead="Match the blackbody radiation property in List I with its physical temperature / frequency relationship in List II:",
        pairs=[
            ("Total emissive power (Stefan-Boltzmann law)", "IV", "Proportional to T^4 (E = sigma * T^4)", 
             "Total power radiated per unit area is proportional to the fourth power of thermodynamic temperature"),
            ("Peak wavelength lambda_max (Wien's displacement law)", "II", "Proportional to 1 / T (lambda_max * T = constant)", 
             "Wien's displacement law establishes that peak emission wavelength is inversely proportional to temperature"),
            ("Low-frequency spectral density (Rayleigh-Jeans limit)", "I", "Proportional to T * nu^2", 
             "In the limit h*nu << k*T, Planck formula reduces to rho(nu) = (8 pi nu^2 / c^3) * k_B T"),
            ("Energy of a single radiation photon (Planck postulate)", "III", "Proportional to nu and independent of T (E = h * nu)", 
             "Photon energy depends strictly on radiation frequency (E = h*nu) and is independent of emitter temperature")
        ],
        correct_choice="D"
    ))

    # Q37: advanced, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_037",
        topic=topic,
        difficulty="advanced",
        lead="In Compton scattering of an X-ray photon by a stationary electron, match the scattering angle theta in List I with the Compton shift Delta lambda in List II:",
        pairs=[
            ("Scattering angle theta = 90°", "I", "Delta lambda = lambda_C = 0.0243 Å", 
             "Compton shift: Delta lambda = lambda_C * (1 - cos theta). For 90°, cos(90°) = 0, so Delta lambda = lambda_C = 0.0243 Å"),
            ("Scattering angle theta = 180° (backscattering)", "III", "Delta lambda = 2 lambda_C = 0.0486 Å", 
             "For 180°, cos(180°) = -1, so Delta lambda = lambda_C * (1 - (-1)) = 2 lambda_C = 0.0486 Å"),
            ("Scattering angle theta = 60°", "IV", "Delta lambda = 0.50 lambda_C = 0.01215 Å", 
             "For 60°, cos(60°) = 0.50, so Delta lambda = lambda_C * (1 - 0.50) = 0.50 lambda_C = 0.01215 Å"),
            ("Scattering angle theta = 0° (forward unscattered transmission)", "II", "Delta lambda = 0 (no wavelength change)", 
             "For theta = 0°, cos(0°) = 1, so Delta lambda = lambda_C * (1 - 1) = 0")
        ],
        correct_choice="A"
    ))

    # Q38: advanced, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_038",
        topic=topic,
        difficulty="advanced",
        lead="Match the atomic transition in atomic hydrogen in List I with its status under electric dipole selection rules (Delta l = +/- 1) in List II:",
        pairs=[
            ("3s -> 2p transition", "II", "Dipole-allowed transition with Delta l = +1 (from l = 0 to l = 1)", 
             "For 3s (l=0) to 2p (l=1), Delta l = 1 - 0 = +1, which strictly satisfies the selection rule Delta l = +/- 1"),
            ("3d -> 2s transition", "IV", "Dipole-forbidden transition with Delta l = -2 across shells (from n = 3 to n = 2)", 
             "For 3d (l=2) to 2s (l=0), Delta l = -2, which violates Delta l = +/- 1 and is forbidden for single-photon dipole emission"),
            ("3p -> 2s transition", "I", "Dipole-allowed transition with Delta l = -1 (from l = 1 to l = 0)", 
             "For 3p (l=1) to 2s (l=0), Delta l = 0 - 1 = -1, which obeys the electric dipole selection rule"),
            ("3d -> 3s transition", "III", "Dipole-forbidden transition with Delta l = -2 within the same shell (Delta n = 0)", 
             "For 3d (l=2) to 3s (l=0), Delta l = -2, violating the dipole selection rule")
        ],
        correct_choice="B"
    ))

    # Q39: advanced, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_039",
        topic=topic,
        difficulty="advanced",
        lead="Match the mean lifetime (tau) of an excited atomic state in List I with its natural energy linewidth (Delta E) in List II:",
        pairs=[
            ("Lifetime tau = 1.0 x 10^-8 s", "III", "Delta E approx 1.05 x 10^-26 J (6.58 x 10^-8 eV)", 
             "Delta E approx h_bar / tau = 1.055e-34 / 1.0e-8 = 1.055 x 10^-26 J = 6.58 x 10^-8 eV"),
            ("Lifetime tau = 1.0 x 10^-10 s", "IV", "Delta E approx 1.05 x 10^-24 J (6.58 x 10^-6 eV)", 
             "Delta E approx h_bar / tau = 1.055e-34 / 1.0e-10 = 1.055 x 10^-24 J = 6.58 x 10^-6 eV"),
            ("Lifetime tau = 1.0 x 10^-12 s", "I", "Delta E approx 1.05 x 10^-22 J (6.58 x 10^-4 eV)", 
             "Delta E approx h_bar / tau = 1.055e-34 / 1.0e-12 = 1.055 x 10^-22 J = 6.58 x 10^-4 eV"),
            ("Lifetime tau = 1.0 x 10^-14 s", "II", "Delta E approx 1.05 x 10^-20 J (6.58 x 10^-2 eV)", 
             "Delta E approx h_bar / tau = 1.055e-34 / 1.0e-14 = 1.055 x 10^-20 J = 6.58 x 10^-2 eV")
        ],
        correct_choice="C"
    ))

    # Q40: advanced, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_040",
        topic=topic,
        difficulty="advanced",
        lead="Match the hydrogen atomic orbital in List I with the most probable electron-nucleus distance (r_mp) in terms of Bohr radius a0 in List II:",
        pairs=[
            ("1s orbital of H atom", "IV", "r_mp = a0", 
             "Radial probability density P(r) is maximum where dP/dr = 0, giving r_mp = a0"),
            ("2p orbital of H atom", "II", "r_mp = 4 a0", 
             "For 2p: P(r) is proportional to r^4 exp(-r/a0). Maximizing gives r_mp = 4 a0"),
            ("3d orbital of H atom", "I", "r_mp = 9 a0", 
             "For 3d: P(r) is proportional to r^6 exp(-2r/(3a0)). Maximizing gives r_mp = 9 a0"),
            ("2s orbital of H atom (outermost maximum)", "III", "r_mp = (3 + sqrt(5)) a0 approx 5.24 a0", 
             "For 2s: P(r) has an outer dominant maximum at r_mp = (3 + sqrt(5)) a0 approx 5.24 a0")
        ],
        correct_choice="D"
    ))

    return questions
