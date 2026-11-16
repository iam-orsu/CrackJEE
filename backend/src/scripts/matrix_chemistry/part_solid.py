import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_solid_questions():
    questions = []
    topic = "Solid State"

    # Q61: beginner, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_061",
        topic=topic,
        difficulty="beginner",
        lead="Match the cubic unit cell type in List I with the effective number of constituent atoms per unit cell (Z) in List II:",
        pairs=[
            ("Simple Cubic (SC) unit cell", "I", "Z = 1 (8 corners x 1/8)", 
             "In simple cubic, atoms reside only at the 8 corners: Z = 8 x (1/8) = 1"),
            ("Body-Centered Cubic (BCC) unit cell", "III", "Z = 2 (8 corners x 1/8 + 1 body center x 1)", 
             "In BCC, 8 corners contribute 1 and 1 body center atom contributes 1: Z = 1 + 1 = 2"),
            ("Face-Centered Cubic (FCC / CCP) unit cell", "IV", "Z = 4 (8 corners x 1/8 + 6 face centers x 1/2)", 
             "In FCC, 8 corners contribute 1 and 6 face centers contribute 3: Z = 1 + 3 = 4"),
            ("End-Centered Orthorhombic unit cell", "II", "Z = 2 (8 corners x 1/8 + 2 opposite faces x 1/2)", 
             "In end-centered cell, 8 corners give 1 atom and 2 opposite faces contribute 1 atom: Z = 1 + 1 = 2")
        ],
        correct_choice="A"
    ))

    # Q62: beginner, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_062",
        topic=topic,
        difficulty="beginner",
        lead="Match the crystal lattice arrangement in List I with the coordination number of each constituent sphere in List II:",
        pairs=[
            ("Simple Cubic lattice", "II", "Coordination Number = 6", 
             "In simple cubic lattice, each sphere touches 6 immediate neighbors (4 in-plane, 1 above, 1 below)"),
            ("Body-Centered Cubic (BCC) lattice", "IV", "Coordination Number = 8", 
             "In BCC, the central sphere touches all 8 corner spheres, giving coordination number 8"),
            ("Face-Centered Cubic (FCC / CCP) lattice", "I", "Coordination Number = 12", 
             "In FCC/CCP, each sphere contacts 12 nearest neighbors (6 in its plane, 3 in layer above, 3 in layer below)"),
            ("Diamond cubic lattice", "III", "Coordination Number = 4", 
             "In diamond, each carbon atom is tetrahedrally bonded to 4 neighboring carbon atoms")
        ],
        correct_choice="B"
    ))

    # Q63: beginner, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_063",
        topic=topic,
        difficulty="beginner",
        lead="Match the cubic crystal structure in List I with its packing efficiency (packing fraction) in List II:",
        pairs=[
            ("Face-Centered Cubic (FCC / CCP)", "III", "74.05% (packing fraction = pi / (3 sqrt(2)))", 
             "In FCC, packing efficiency = (4 x (4/3) pi r^3) / a^3 with a = 2 sqrt(2) r, yielding 74.05%"),
            ("Body-Centered Cubic (BCC)", "IV", "68.02% (packing fraction = sqrt(3) pi / 8)", 
             "In BCC, packing efficiency = (2 x (4/3) pi r^3) / a^3 with a = 4r / sqrt(3), yielding 68.02%"),
            ("Simple Cubic (SC)", "I", "52.36% (packing fraction = pi / 6)", 
             "In SC, packing efficiency = ((4/3) pi r^3) / a^3 with a = 2r, yielding pi / 6 = 52.36%"),
            ("Diamond cubic lattice", "II", "34.01% (packing fraction = sqrt(3) pi / 16)", 
             "In diamond, Z = 8 and 8r = sqrt(3) a, yielding packing efficiency = sqrt(3) pi / 16 = 34.01%")
        ],
        correct_choice="C"
    ))

    # Q64: beginner, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_064",
        topic=topic,
        difficulty="beginner",
        lead="Match the type of crystalline solid in List I with its primary binding force and example in List II:",
        pairs=[
            ("Molecular solid", "IV", "London dispersion / dipole forces / H-bonds (e.g. Dry ice CO2, I2, Solid H2O)", 
             "Molecular solids consist of discrete molecules bonded by intermolecular forces, yielding relatively low melting points"),
            ("Ionic solid", "II", "Electrostatic attractions between cations and anions (e.g. NaCl, MgO, ZnS)", 
             "Ionic solids feature strong non-directional electrostatic bonding, giving high melting points and brittleness"),
            ("Covalent / Network solid", "I", "Directional covalent bonds in continuous 3D network (e.g. Diamond, Quartz SiO2)", 
             "Network solids consist of atoms linked by strong covalent bonds throughout the entire crystal"),
            ("Metallic solid", "III", "Delocalized electron sea bonding positive metal cations (e.g. Cu, Fe, Na)", 
             "Metallic solids comprise positive ions surrounded by mobile conduction electrons, conferring electrical conductivity")
        ],
        correct_choice="D"
    ))

    # Q65: intermediate, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_065",
        topic=topic,
        difficulty="intermediate",
        lead="Match the cubic unit cell type of edge length 'a' in List I with the relation to constituent sphere radius 'r' in List II:",
        pairs=[
            ("Simple Cubic (SC)", "I", "a = 2 r (touching along unit cell edge)", 
             "In simple cubic, spheres touch directly along cell edges: a = 2r"),
            ("Face-Centered Cubic (FCC)", "III", "a = 2 sqrt(2) r (touching along face diagonal: 4r = sqrt(2) a)", 
             "In FCC, spheres touch along face diagonal: sqrt(2) a = 4r => a = 2 sqrt(2) r"),
            ("Body-Centered Cubic (BCC)", "IV", "a = 4 r / sqrt(3) (touching along body diagonal: 4r = sqrt(3) a)", 
             "In BCC, spheres touch along body diagonal: sqrt(3) a = 4r => a = 4r / sqrt(3)"),
            ("Diamond cubic", "II", "a = 8 r / sqrt(3) (touching along 1/4 of body diagonal: 2r = sqrt(3) a / 4)", 
             "In diamond, carbon atoms touch along body diagonal: 2r = sqrt(3) a / 4 => a = 8r / sqrt(3)")
        ],
        correct_choice="A"
    ))

    # Q66: intermediate, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_066",
        topic=topic,
        difficulty="intermediate",
        lead="For a close-packed lattice (CCP/FCC) consisting of N constituent spheres, match the void parameter in List I with its count / position in List II:",
        pairs=[
            ("Octahedral voids (total count = N)", "II", "1 at body center + 12 at edge centers (contributing 1 + 12 x 1/4 = 4 per unit cell)", 
             "In FCC (Z=4), octahedral voids equal N = 4: 1 at body center and 12 at edge centers (12 x 1/4 = 3)"),
            ("Tetrahedral voids (total count = 2N)", "IV", "8 located along the four body diagonals (2 per body diagonal at distance sqrt(3) a / 4 from corners)", 
             "In FCC (Z=4), tetrahedral voids equal 2N = 8: each body diagonal houses 2 tetrahedral voids inside the cell"),
            ("Distance between body-center octahedral void and tetrahedral void", "I", "sqrt(3) a / 4", 
             "Vector displacement from (1/2, 1/2, 1/2)a to (1/4, 1/4, 1/4)a has magnitude sqrt(3) a / 4"),
            ("Distance between two tetrahedral voids along the same body diagonal", "III", "sqrt(3) a / 2", 
             "The two tetrahedral voids on a body diagonal are at sqrt(3)a/4 and 3sqrt(3)a/4, separated by sqrt(3) a / 2")
        ],
        correct_choice="B"
    ))

    # Q67: intermediate, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_067",
        topic=topic,
        difficulty="intermediate",
        lead="Match the limiting radius ratio (r+ / r-) in List I with the coordination geometry and coordination number in List II:",
        pairs=[
            ("0.155 <= r+ / r- < 0.225", "III", "Planar triangular geometry, Coordination Number = 3 (e.g. B2O3)", 
             "Cation fits tightly between 3 coplanar contacting anions; limiting ratio = 2/sqrt(3) - 1 = 0.155"),
            ("0.225 <= r+ / r- < 0.414", "IV", "Tetrahedral geometry, Coordination Number = 4 (e.g. ZnS)", 
             "Cation occupies tetrahedral interstitial void formed by 4 anions; limiting ratio = sqrt(6)/2 - 1 = 0.225"),
            ("0.414 <= r+ / r- < 0.732", "I", "Octahedral geometry, Coordination Number = 6 (e.g. NaCl)", 
             "Cation fits into octahedral void of 6 contacting anions; limiting ratio = sqrt(2) - 1 = 0.414"),
            ("0.732 <= r+ / r- < 1.000", "II", "Cubic geometry, Coordination Number = 8 (e.g. CsCl)", 
             "Cation fits into cubic void of 8 anions; limiting ratio = sqrt(3) - 1 = 0.732")
        ],
        correct_choice="C"
    ))

    # Q68: intermediate, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_068",
        topic=topic,
        difficulty="intermediate",
        lead="Match the AB-type ionic crystal structure in List I with its structural arrangement and coordination numbers in List II:",
        pairs=[
            ("NaCl (Rock salt structure)", "IV", "FCC lattice of Cl- with Na+ in all octahedral voids; Coordination numbers: 6 : 6", 
             "In NaCl, Cl- forms FCC and Na+ fills all octahedral voids; each ion is 6-coordinated"),
            ("CsCl structure", "II", "Simple cubic lattice of Cl- with Cs+ in body-center cubic void; Coordination numbers: 8 : 8", 
             "In CsCl, Cl- forms primitive cubic lattice with Cs+ at body center; each ion has 8 nearest neighbors"),
            ("ZnS (Zinc blende structure)", "I", "FCC lattice of S2- with Zn2+ in alternate (half) tetrahedral voids; Coordination numbers: 4 : 4", 
             "In zinc blende, S2- forms FCC (Z=4) and Zn2+ occupies 4 of the 8 tetrahedral voids (4:4 coordination)"),
            ("ZnS (Wurtzite structure)", "III", "HCP lattice of S2- with Zn2+ in alternate (half) tetrahedral voids; Coordination numbers: 4 : 4", 
             "In wurtzite, S2- forms HCP lattice and Zn2+ occupies half the tetrahedral voids (4:4 coordination)")
        ],
        correct_choice="D"
    ))

    # Q69: intermediate, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_069",
        topic=topic,
        difficulty="intermediate",
        lead="Match the binary ionic crystal structure in List I with its structural features and coordination numbers in List II:",
        pairs=[
            ("CaF2 (Fluorite structure)", "I", "FCC lattice of Ca2+ with F- occupying all 8 tetrahedral voids; Coordination numbers: 8 : 4", 
             "In fluorite, Ca2+ forms FCC (Z=4) and F- occupies all 8 tetrahedral voids; Ca2+ is 8-coordinated and F- is 4-coordinated"),
            ("Na2O (Antifluorite structure)", "III", "FCC lattice of O2- with Na+ occupying all 8 tetrahedral voids; Coordination numbers: 4 : 8", 
             "In antifluorite, O2- forms FCC and Na+ occupies all 8 tetrahedral voids; Na+ is 4-coordinated and O2- is 8-coordinated"),
            ("TiO2 (Rutile structure)", "IV", "Tetragonal lattice; Ti4+ has CN = 6 and O2- has CN = 3", 
             "In rutile, Ti4+ ions are 6-coordinated (octahedral) and O2- ions are 3-coordinated (trigonal planar)"),
            ("Coordination number relationship in AxBy ionic crystal", "II", "CN(A) / CN(B) = y / x", 
             "Charge neutrality requires x * CN(A) = y * CN(B), hence CN ratio is inversely proportional to stoichiometry")
        ],
        correct_choice="A"
    ))

    # Q70: intermediate, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_070",
        topic=topic,
        difficulty="intermediate",
        lead="Match the point defect / crystal feature in List I with its characteristic property in List II:",
        pairs=[
            ("Schottky defect", "II", "Equal numbers of cation and anion vacancies; crystal density decreases; found in high CN salts", 
             "Schottky defects involve stoichiometric pairs of missing ions, lowering overall crystal density"),
            ("Frenkel defect", "IV", "Cation dislocated into an interstitial site; crystal density unchanged; found in low CN salts", 
             "Frenkel defects involve dislocation of smaller cations to interstitial positions without changing density"),
            ("Silver bromide (AgBr)", "I", "Exhibits both Schottky and Frenkel defects simultaneously", 
             "AgBr has intermediate radius ratio and high polarizability, showing both Schottky and Frenkel defects"),
            ("F-center (Farbe center)", "III", "Electrons trapped in anion vacancies; imparts color and paramagnetism to crystal", 
             "Heating alkali halides in metal vapor generates anion vacancies with trapped electrons called F-centers")
        ],
        correct_choice="B"
    ))

    # Q71: intermediate, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_071",
        topic=topic,
        difficulty="intermediate",
        lead="Match the magnetic classification of solids in List I with its magnetic domain behavior in List II:",
        pairs=[
            ("Diamagnetic substance (e.g. TiO2, NaCl, H2O)", "III", "Weakly repelled by magnetic field; all electrons paired; susceptibility chi < 0", 
             "Diamagnetism arises from induced magnetic moments opposing the external field in paired electron systems"),
            ("Paramagnetic substance (e.g. O2, Cu2+, Fe3+)", "IV", "Weakly attracted by magnetic field; permanent unpaired spins; susceptibility chi > 0", 
             "Paramagnetism is caused by permanent electron spin moments aligning parallel to external field"),
            ("Ferromagnetic substance (e.g. Fe, Co, Ni, CrO2)", "I", "Spontaneous parallel domain alignment; permanent magnetization; susceptibility chi >> 0", 
             "Ferromagnets exhibit strong quantum exchange interactions aligning magnetic domains permanently"),
            ("Antiferromagnetic substance (e.g. MnO, FeO)", "II", "Magnetic domains align in equal opposite directions; net magnetic moment is zero", 
             "Antiferromagnetic materials have antiparallel compensatory magnetic moments that cancel completely")
        ],
        correct_choice="C"
    ))

    # Q72: intermediate, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_072",
        topic=topic,
        difficulty="intermediate",
        lead="Match the crystallographic / diffraction parameter for a cubic crystal in List I with its formula in List II:",
        pairs=[
            ("Bragg's law of diffraction", "II", "2 d sin(theta) = n lambda", 
             "Bragg's law expresses the condition for constructive interference of X-rays scattered from crystal planes"),
            ("Interplanar spacing d_hkl for cubic lattice of edge 'a'", "IV", "d_hkl = a / sqrt(h^2 + k^2 + l^2)", 
             "In a cubic crystal, the perpendicular distance between planes (h k l) is a / sqrt(h^2 + k^2 + l^2)"),
            ("Ratio d_100 : d_110 : d_111 for Simple Cubic lattice", "I", "1 : (1 / sqrt(2)) : (1 / sqrt(3)) = 1 : 0.707 : 0.577", 
             "For SC: d_100 = a, d_110 = a/sqrt(2), d_111 = a/sqrt(3). The ratio is 1 : 1/sqrt(2) : 1/sqrt(3)"),
            ("First-order Bragg diffraction condition (n = 1)", "III", "sin(theta) = lambda / (2 d)", 
             "Setting n = 1 in Bragg's law yields sin(theta) = lambda / (2 d)")
        ],
        correct_choice="D"
    ))

    # Q73: advanced, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_073",
        topic=topic,
        difficulty="advanced",
        lead="Match the non-stoichiometric / doped crystal in List I with the quantitative defect composition in List II:",
        pairs=[
            ("Non-stoichiometric wüstite of composition Fe_0.93 O", "I", "Ratio of Fe3+ to Fe2+ = 14 / 79 approx 0.177 (Fe3+ = 15.05% of total Fe)", 
             "Charge neutrality: 2(Fe2+) + 3(Fe3+) = 2. With Fe2+ + Fe3+ = 0.93: Fe2+ = 0.79, Fe3+ = 0.14. Ratio = 14/79"),
            ("NaCl crystal doped with 10^-4 mol % SrCl2", "III", "6.022 x 10^17 cation vacancies per mole of NaCl", 
             "Each Sr2+ replaces two Na+ ions, leaving 1 cation vacancy: 10^-6 mol vacancies x N_A = 6.022 x 10^17 per mole"),
            ("CdCl2 crystal doped with 10^-3 mol % AgCl", "IV", "10^-5 mol anion vacancies (or interstitial cations) per mole of crystal", 
             "Monovalent Ag+ replacing divalent Cd2+ requires anion vacancies for charge neutrality: 10^-5 mol/mol"),
            ("Silicon crystal doped with Group 13 Boron (B)", "II", "p-type semiconductor with positive electron holes as majority carriers", 
             "Trivalent B introduces acceptor levels and mobile electron holes in tetravalent silicon")
        ],
        correct_choice="A"
    ))

    # Q74: advanced, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_074",
        topic=topic,
        difficulty="advanced",
        lead="Match the Hexagonal Close-Packed (HCP) unit cell parameter for spheres of radius r and lattice parameters a, c in List I with its value in List II:",
        pairs=[
            ("Ideal axial ratio (c / a)", "II", "sqrt(8 / 3) approx 1.633", 
             "In ideal HCP packing of hard spheres, c / a = sqrt(8 / 3) approx 1.633"),
            ("Effective number of atoms per HCP unit cell (Z)", "IV", "Z = 6 (12 corners x 1/6 + 2 face centers x 1/2 + 3 interior x 1)", 
             "In HCP, 12 corners contribute 2, 2 face centers contribute 1, and 3 interior atoms contribute 3: Z = 6"),
            ("Volume of HCP unit cell (V_cell)", "I", "24 sqrt(2) r^3 (or (3 sqrt(3) / 2) a^2 c)", 
             "Base area = (3 sqrt(3) / 2) a^2. Multiplying by height c = a sqrt(8/3) gives V = 24 sqrt(2) r^3"),
            ("Unit cell height (c) in terms of sphere radius r", "III", "4 r * sqrt(2 / 3) = 2 r * sqrt(8 / 3)", 
             "The height spans two tetrahedral layer separations, each 2r sqrt(2/3), so c = 4 r sqrt(2/3)")
        ],
        correct_choice="B"
    ))

    # Q75: advanced, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_075",
        topic=topic,
        difficulty="advanced",
        lead="Match the complex mineral crystal structure in List I with its cation site distribution in List II:",
        pairs=[
            ("Perovskite structure (CaTiO3)", "III", "Ca2+ at 8 cube corners, O2- at 6 face centers, Ti4+ at cube body center", 
             "In cubic CaTiO3, Ca2+ is at corners (CN=12), O2- at face centers, and Ti4+ occupies the body center octahedral void (CN=6)"),
            ("Normal Spinel structure (MgAl2O4)", "IV", "O2- forms CCP; Mg2+ in 1/8 of tetrahedral voids; Al3+ in 1/2 of octahedral voids", 
             "In normal spinel, divalent Mg2+ occupies tetrahedral sites and trivalent Al3+ occupies octahedral sites"),
            ("Inverse Spinel structure (Fe3O4 = Fe^III[Fe^II Fe^III]O4)", "I", "Fe3+ equally divided between tetrahedral and octahedral sites; Fe2+ in octahedral sites", 
             "In Fe3O4, half of Fe3+ is in tetrahedral sites, while Fe2+ and remaining Fe3+ occupy octahedral sites"),
            ("Fluorite structure defect state (ThO2 or UO2)", "II", "FCC cations with all tetrahedral voids filled by anions; accommodates interstitial oxygen", 
             "Fluorite lattice has empty octahedral sites that readily incorporate interstitial oxygen atoms")
        ],
        correct_choice="C"
    ))

    # Q76: advanced, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_076",
        topic=topic,
        difficulty="advanced",
        lead="Match the cubic Bravais lattice in List I with its powder X-ray diffraction reflection condition in List II:",
        pairs=[
            ("Primitive / Simple Cubic (P)", "IV", "All reflections (h, k, l) allowed (no systematic absences)", 
             "Simple cubic lattice has no centering translations; all Miller indices produce allowed reflections"),
            ("Body-Centered Cubic (I)", "II", "Reflections allowed only when (h + k + l) is an even integer", 
             "Destructive interference cancels all reflections for which (h + k + l) is odd"),
            ("Face-Centered Cubic (F)", "I", "Reflections allowed only when (h, k, l) are unmixed (all even or all odd)", 
             "Face-centering produces destructive interference unless h, k, l are all even or all odd"),
            ("Diamond Cubic structure (Fd-3m)", "III", "Unmixed (all even or all odd); if all even, then (h + k + l) must equal 4n", 
             "The 8-atom basis produces additional extinction: even reflections require h + k + l to be a multiple of 4")
        ],
        correct_choice="D"
    ))

    # Q77: advanced, correct_choice: 'A'
    questions.append(make_matrix_q(
        qid="chem_pc1_077",
        topic=topic,
        difficulty="advanced",
        lead="Match the electronic band state of the solid in List I with its electrical conductivity behavior in List II:",
        pairs=[
            ("Metallic conductor", "I", "Overlapping valence and conduction bands; conductivity decreases with increasing T", 
             "Zero energy gap (Eg = 0); higher temperature increases lattice phonon scattering, decreasing conductivity"),
            ("Intrinsic semiconductor", "III", "Small band gap (0 < Eg < 3.0 eV); conductivity increases exponentially with T", 
             "Thermal excitation promotes carriers across the small gap, increasing conductivity exponentially with T"),
            ("Insulator", "IV", "Large band gap (Eg > 3.0 eV, e.g. Diamond Eg = 5.5 eV); negligible electrical conductivity", 
             "Valence band is completely filled and conduction band is empty with a wide forbidden energy gap"),
            ("Superconductor below critical temperature (T < T_c)", "II", "Zero electrical resistivity (rho = 0) and complete expulsion of magnetic flux (Meissner effect)", 
             "Cooper pairs condense into a macroscopic superconducting state with zero resistance and perfect diamagnetism")
        ],
        correct_choice="A"
    ))

    # Q78: advanced, correct_choice: 'B'
    questions.append(make_matrix_q(
        qid="chem_pc1_078",
        topic=topic,
        difficulty="advanced",
        lead="Match the colored / non-stoichiometric crystal in List I with the microscopic origin of its optical absorption in List II:",
        pairs=[
            ("Yellow color of NaCl heated in sodium vapor", "II", "Anion vacancies trapping electrons (F-centers) absorbing blue light", 
             "Excess sodium creates Cl- vacancies occupied by trapped electrons (F-centers) that absorb blue light"),
            ("Violet / lilac color of KCl heated in potassium vapor", "IV", "F-centers in KCl absorbing yellow-green light and transmitting lilac/violet", 
             "F-centers in KCl have an excitation absorption band in the yellow region, resulting in violet transmission"),
            ("Pink / ruby-red color of LiCl heated in lithium vapor", "I", "F-centers in LiCl absorbing green-blue photons", 
             "Trapped electrons at anion vacancies in LiCl absorb green-blue wavelengths, imparting a pink hue"),
            ("Blackish-green color and p-type conduction in non-stoichiometric NiO", "III", "Ni2+ cation vacancies compensated by presence of Ni3+ ions (hole conduction)", 
             "Absence of Ni2+ is compensated by oxidation of adjacent Ni2+ to Ni3+, producing hole conduction and dark color")
        ],
        correct_choice="B"
    ))

    # Q79: advanced, correct_choice: 'C'
    questions.append(make_matrix_q(
        qid="chem_pc1_079",
        topic=topic,
        difficulty="advanced",
        lead="Match the close-packed interstitial void type formed by close-packed spheres of radius R in List I with its limiting radius (r_void) in List II:",
        pairs=[
            ("Triangular void (formed by 3 contacting spheres)", "III", "r_void = (2 / sqrt(3) - 1) R approx 0.155 R", 
             "Distance from centroid to sphere center is 2R / sqrt(3) = R + r_void => r_void = (2/sqrt(3) - 1) R = 0.155 R"),
            ("Tetrahedral void (formed by 4 contacting spheres)", "IV", "r_void = (sqrt(6) / 2 - 1) R approx 0.225 R", 
             "Distance from center of tetrahedron to vertex is sqrt(6)/2 R = R + r_void => r_void = (sqrt(6)/2 - 1) R = 0.225 R"),
            ("Octahedral void (formed by 6 contacting spheres)", "I", "r_void = (sqrt(2) - 1) R approx 0.414 R", 
             "Diagonal of equatorial square is 2 sqrt(2) R = 2R + 2 r_void => r_void = (sqrt(2) - 1) R = 0.414 R"),
            ("Cubic void (formed by 8 contacting spheres)", "II", "r_void = (sqrt(3) - 1) R approx 0.732 R", 
             "Body diagonal of cubic cage is 2 sqrt(3) R = 2R + 2 r_void => r_void = (sqrt(3) - 1) R = 0.732 R")
        ],
        correct_choice="C"
    ))

    # Q80: advanced, correct_choice: 'D'
    questions.append(make_matrix_q(
        qid="chem_pc1_080",
        topic=topic,
        difficulty="advanced",
        lead="Match the dielectric / electrical crystal phenomenon in List I with its physical definition and material in List II:",
        pairs=[
            ("Piezoelectricity", "IV", "Generation of electric potential across crystal under mechanical stress (e.g. Quartz)", 
             "Mechanical stress shifts positive and negative charge centers in non-centrosymmetric crystals, inducing polarization"),
            ("Pyroelectricity", "II", "Generation of electric charge on crystal faces upon heating (e.g. Tourmaline)", 
             "Temperature change alters spontaneous dipole moment, producing surface charge"),
            ("Ferroelectricity", "I", "Spontaneous electric polarization reversible by an external electric field (e.g. BaTiO3, Rochelle salt)", 
             "Ferroelectric crystals have permanent dipole domains that can be reoriented by an applied electric field"),
            ("Antiferroelectricity", "III", "Dipoles in adjacent unit cells point in opposite antiparallel directions (e.g. PbZrO3)", 
             "Antiparallel alignment of adjacent cell dipoles produces zero net spontaneous polarization")
        ],
        correct_choice="D"
    ))

    return questions
