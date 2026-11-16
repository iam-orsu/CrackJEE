import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

def get_coord_questions():
    qs = []
    t = "Coordination Compounds"

    # =========================================================================
    # BEGINNER (chem_ioc2_061 to chem_ioc2_064)
    # =========================================================================

    # Q61 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_061", t, "beginner",
        "Match Werner's cobalt(III) ammine complexes in List I with the moles of AgCl precipitated per mole of complex and total ions produced in List II:",
        [
            ("[Co(NH3)6]Cl3 (Hexaamminecobalt(III) chloride)", "III", "Precipitates 3 moles of AgCl; dissociates into 4 ions total in aqueous solution", "All three chloride ions reside in the outer sphere as ionizable counterions: [Co(NH3)6]Cl3 -> [Co(NH3)6]³⁺ + 3Cl⁻, yielding 3 moles of AgCl with excess AgNO3"),
            ("[Co(NH3)5Cl]Cl2 (Pentaamminechloridocobalt(III) chloride)", "I", "Precipitates 2 moles of AgCl; dissociates into 3 ions total in aqueous solution", "One chloride occupies the inner coordination sphere (non-ionizable) while two chlorides reside in the outer sphere: [Co(NH3)5Cl]²⁺ + 2Cl⁻, giving 2 moles of AgCl"),
            ("[Co(NH3)4Cl2]Cl (Tetraamminedichloridocobalt(III) chloride)", "IV", "Precipitates 1 mole of AgCl; dissociates into 2 ions total in aqueous solution", "Two chlorides are bound directly to cobalt in the inner sphere; only one chloride is ionizable: [Co(NH3)4Cl2]⁺ + Cl⁻, giving 1 mole of AgCl"),
            ("[Co(NH3)3Cl3] (Triamminetrichloridocobalt(III))", "II", "Precipitates 0 moles of AgCl; non-electrolyte neutral coordination complex in aqueous solution", "All three chlorides satisfy both primary and secondary valencies in the inner sphere; no ions are released, so it gives zero precipitate with AgNO3"),
        ], "A"
    ))

    # Q62 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_062", t, "beginner",
        "Match the coordination chemical formulas in List I with their correct IUPAC names in List II:",
        [
            ("[Pt(NH3)2Cl(NO2)]", "IV", "Diamminechloridonitrito-N-platinum(II)", "Ligands are named alphabetically: ammine before chlorido before nitrito-N; platinum oxidation state is +2; neutral complex retains metal name platinum"),
            ("K3[Fe(CN)6]", "II", "Potassium hexacyanidoferrate(III)", "Cation potassium is named first; complex anion contains 6 cyanido ligands and iron in +3 oxidation state, taking the Latin suffix -ate to become ferrate(III)"),
            ("[Co(en)3]Cl3", "I", "Tris(ethane-1,2-diamine)cobalt(III) chloride", "Ethane-1,2-diamine is a polydentate ligand with an organic prefix, requiring the multiplicative prefix 'tris'; cobalt is in +3 state, followed by counterion chloride"),
            ("[Cr(H2O)4Cl2]Cl", "III", "Tetraaquadichloridochromium(III) chloride", "Neutral aqua precedes anionic chlorido alphabetically: tetraaqua-dichlorido; chromium is in +3 oxidation state; chloride is the outer sphere anion"),
        ], "B"
    ))

    # Q63 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_063", t, "beginner",
        "Match the coordination ligands in List I with their denticity and bonding classifications in List II:",
        [
            ("Ethylenediaminetetraacetate ion (EDTA⁴⁻)", "II", "Hexadentate chelating ligand containing two donor nitrogen atoms and four donor carboxylate oxygens", "EDTA⁴⁻ wraps completely around metal ions like Ca²⁺ or Mg²⁺ using 6 donor atoms, forming an exceptionally stable octahedral cage of five chelate rings"),
            ("Ethane-1,2-diamine (en, H2N-CH2-CH2-NH2)", "IV", "Neutral bidentate chelating ligand forming a stable 5-membered ring with the metal center", "Each nitrogen atom possesses an unshared lone pair; both nitrogens coordinate simultaneously to a single metal cation, creating a strain-free 5-membered chelate ring"),
            ("Thiocyanate ion (SCN⁻)", "I", "Ambidentate monodentate ligand that can coordinate through sulfur (thiocyanato) or nitrogen (isothiocyanato)", "Can coordinate via sulfur to soft acids like Pt²⁺/Hg²⁺ or via nitrogen to hard acids like Co³⁺/Fe³⁺, giving rise to linkage isomerism"),
            ("Carbon monoxide (CO)", "III", "Monodentate neutral π-acid ligand forming synergic σ-donor and π-acceptor bonds with transition metals", "CO coordinates through the carbon lone pair (σ-donation) while accepting metal d-electron density into its empty π* antibonding molecular orbitals"),
        ], "C"
    ))

    # Q64 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_064", t, "beginner",
        "Match the pairs of coordination isomers in List I with their specific types of structural isomerism in List II:",
        [
            ("[Co(NH3)5SO4]Br and [Co(NH3)5Br]SO4", "III", "Ionization isomerism; yield different precipitates with AgNO3 (AgBr) and BaCl2 (BaSO4) respectively", "Exchange of SO4²⁻ and Br⁻ between coordination sphere and ionization sphere gives different ions in aqueous solution"),
            ("[Cr(H2O)6]Cl3 (violet) and [Cr(H2O)5Cl]Cl2·H2O (grey-green)", "I", "Hydrate (solvate) isomerism; differ in the number of water molecules inside vs outside the coordination sphere", "In the violet form, all 6 water molecules are coordinated; in the grey-green form, one water molecule is in the crystal lattice and one chloride is coordinated"),
            ("[Co(NH3)5(NO2)]Cl2 (yellow) and [Co(NH3)5(ONO)]Cl2 (red)", "IV", "Linkage isomerism; ambidentate NO2⁻ ligand coordinates through nitrogen (nitro) or oxygen (nitrito)", "The ambidentate nitrite ion coordinates through N in the yellow nitro isomer and through O in the red nitrito isomer, having distinct IR stretching frequencies"),
            ("[Co(NH3)6][Cr(CN)6] and [Cr(NH3)6][Co(CN)6]", "II", "Coordination isomerism; interchange of ligands between complex cationic and complex anionic coordination spheres", "Occurs in bimetallic coordination salts where ligands interchange between the two different coordination metal centers"),
        ], "D"
    ))

    # =========================================================================
    # INTERMEDIATE (chem_ioc2_065 to chem_ioc2_072)
    # =========================================================================

    # Q65 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_065", t, "intermediate",
        "Match the coordination complexes in List I with their geometrical isomerism characteristics in List II:",
        [
            ("cis-[Pt(NH3)2Cl2] (cisplatin)", "III", "Square planar MA2B2 complex where identical ligands are adjacent (90°); possesses a non-zero net dipole moment", "The two polar Pt-Cl bond dipoles do not cancel because they lie at 90° to each other, giving cis-[Pt(NH3)2Cl2] a net dipole moment (μ ≈ 4.1 D)"),
            ("trans-[Pt(NH3)2Cl2] (transplatin)", "I", "Square planar MA2B2 complex where identical ligands are opposite (180°); centrosymmetric with zero net dipole moment", "The two Pt-Cl dipoles and two Pt-NH3 dipoles are arranged at 180° trans to each other and cancel by vector addition, resulting in zero dipole moment (μ = 0)"),
            ("fac-[Co(NH3)3(NO2)3]", "IV", "Facial (fac) isomer of MA3B3 where the three identical ligands occupy the vertices of a single triangular face of the octahedron", "All three NH3 ligands are mutually cis (at 90° angles to each other), forming an equilateral triangular face on the octahedral coordination sphere"),
            ("mer-[Co(NH3)3(NO2)3]", "II", "Meridional (mer) isomer of MA3B3 where the three identical ligands span a planar meridian of the octahedron", "Two of the identical ligands are trans to each other (180°) while the third is cis to both, defining a planar arc or meridian bisecting the center"),
        ], "A"
    ))

    # Q66 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_066", t, "intermediate",
        "Match the coordination complexes in List I with their optical isomerism and symmetry features in List II:",
        [
            ("[Co(en)3]³⁺ (Tris(ethane-1,2-diamine)cobalt(III))", "IV", "Chiral complex with D3 symmetry lacking both plane and center of inversion; resolves into d- and l- enantiomers", "The three bidentate en rings wrap in a propeller-like helical arrangement (Δ and Λ enantiomers) that cannot be superimposed on their mirror images"),
            ("cis-[Co(en)2Cl2]⁺", "I", "Optically active chiral complex with C2 symmetry lacking improper rotation axes; resolves into non-superimposable enantiomers", "The cis arrangement of monodentate chlorides prevents the formation of any plane or center of inversion, rendering the complex dissymmetric and optically active"),
            ("trans-[Co(en)2Cl2]⁺", "II", "Optically inactive achiral complex containing a center of inversion (Ci) and horizontal mirror plane (σh)", "The two chlorides lie trans (180°) along the z-axis and the two en ligands lie in the equatorial plane, creating an inversion center and mirror plane that abolish chirality"),
            ("[Cr(ox)3]³⁻ (Trioxalatochromate(III))", "III", "Chiral anionic tris-chelate complex displaying high optical activity and circular dichroism", "Like [Co(en)3]³⁺, the three bidentate planar oxalate ligands form a chiral three-bladed propeller with no reflection symmetry"),
        ], "B"
    ))

    # Q67 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_067", t, "intermediate",
        "Match the Nickel and Platinum complexes in List I with their VBT hybridization, geometry, and magnetic properties in List II:",
        [
            ("[Ni(CO)4] (Tetracarbonylnickel(0))", "II", "sp³ hybridization; regular tetrahedral geometry; diamagnetic (0 unpaired electrons)", "Ni(0) has 3d⁸ 4s² configuration; strong field CO forces all 10 electrons into 3d orbitals (3d¹⁰), leaving empty 4s and 4p orbitals to form four sp³ hybrid orbitals"),
            ("[NiCl4]²⁻ (Tetrachloridonickelate(II))", "IV", "sp³ hybridization; tetrahedral geometry; paramagnetic with 2 unpaired electrons (μ_eff ≈ 2.83 BM)", "Ni²⁺ has 3d⁸ configuration; weak field Cl⁻ cannot force pairing, so electrons occupy 3d orbitals as t2g⁶ eg²; hybridization involves 4s 4p³, giving tetrahedral shape"),
            ("[Ni(CN)4]²⁻ (Tetracyanidonickelate(II))", "I", "dsp² hybridization; square planar geometry; diamagnetic (0 unpaired electrons)", "Strong field CN⁻ ligand forces the two unpaired 3d electrons to pair into one 3d orbital, vacating 3d_x²-y² for dsp² hybridization, giving a square planar complex"),
            ("[PtCl4]²⁻ (Tetrachloridoplatinate(II))", "III", "dsp² hybridization; square planar geometry; diamagnetic despite weak field chloride ligands", "For 5d transition elements, large crystal field splitting (Δ > P) forces d⁸ electrons to pair even with weak field halides, adopting exclusively square planar geometry"),
        ], "C"
    ))

    # Q68 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_068", t, "intermediate",
        "Match the crystal field splitting parameters in List I with their theoretical and physical descriptions in List II:",
        [
            ("Octahedral crystal field splitting (Δo)", "III", "Splits five degenerate d-orbitals into triply degenerate lower t2g (-0.4 Δo) and doubly degenerate higher eg (+0.6 Δo)", "Six ligands approach along the Cartesian axes (x, y, z), repelling axial eg orbitals (dx²-y², dz²) more than non-axial t2g orbitals (dxy, dyz, dzx)"),
            ("Tetrahedral crystal field splitting (Δt)", "I", "Splits d-orbitals inversely into doubly degenerate lower e (-0.6 Δt) and triply degenerate higher t2 (+0.4 Δt)", "Four ligands approach between the Cartesian axes; non-axial orbitals (dxy, dyz, dzx) point more directly at ligands than axial orbitals, inverting the splitting"),
            ("Magnitude relationship between Δt and Δo", "IV", "Δt = (4/9) Δo for identical metal ions, oxidation states, and ligands", "Factor (4/9) arises because there are only 4 ligands instead of 6 (factor 2/3) and ligands do not point directly at any d-orbitals (another factor 2/3; 2/3 × 2/3 = 4/9)"),
            ("Spin states in tetrahedral coordination complexes", "II", "Almost universally high-spin because Δt is much smaller than the electron pairing energy P (Δt < P)", "Because Δt is less than half of Δo, crystal field splitting is insufficient to overcome electron-electron pairing energy, making tetrahedral low-spin complexes virtually unknown"),
        ], "D"
    ))

    # Q69 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_069", t, "intermediate",
        "Match the ligand classes in the Spectrochemical Series in List I with their ligand field strength and π-bonding nature in List II:",
        [
            ("Halide ions (I⁻ < Br⁻ < Cl⁻ < F⁻)", "III", "Weak field ligands; act as π-donors whose filled pπ orbitals destabilize metal t2g orbitals, reducing Δo", "Donation of electron density from halide pπ orbitals into metal t2g orbitals raises the t2g energy level, shrinking the crystal field splitting energy Δo"),
            ("Oxygen donors (OH⁻ < C2O4²⁻ < H2O)", "I", "Intermediate field ligands; act as moderate π-donors that produce weak to moderate crystal field splittings", "H2O and oxalate have moderate electronegativity and mild π-donor properties, lying near the middle of the spectrochemical series"),
            ("Nitrogen donors (NH3 < en < NO2⁻)", "IV", "Strong field ligands; act as pure σ-donors without π-donor ability, producing substantial crystal field splittings", "NH3 has no filled π-symmetry orbitals to destabilize t2g, allowing strong σ-bonding that raises eg orbitals and produces large Δo"),
            ("Carbon π-acid ligands (CN⁻ < CO)", "II", "Extremely strong field ligands; powerful π-acceptors that withdraw electron density from metal t2g orbitals, maximizing Δo", "Empty low-lying π* antibonding orbitals on CO and CN⁻ accept metal t2g electrons via back-bonding, stabilizing t2g and dramatically expanding Δo"),
        ], "A"
    ))

    # Q70 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_070", t, "intermediate",
        "Match the octahedral d-electron configurations in List I with their Crystal Field Stabilization Energy (CFSE) values in List II:",
        [
            ("d³ octahedral (e.g., [Cr(H2O)6]³⁺)", "IV", "CFSE = -1.2 Δo (all 3 electrons occupy t2g: t2g³ eg⁰)", "Each of the 3 electrons in t2g contributes -0.4 Δo; CFSE = 3 × (-0.4 Δo) = -1.2 Δo, providing substantial kinetic inertness"),
            ("d⁶ low-spin octahedral (e.g., [Fe(CN)6]⁴⁻, [Co(NH3)6]³⁺)", "I", "CFSE = -2.4 Δo + 2P (all 6 electrons paired in t2g: t2g⁶ eg⁰)", "All 6 electrons occupy t2g; CFSE = 6 × (-0.4 Δo) = -2.4 Δo; accounts for two additional pairings relative to the free ion (total +2P)"),
            ("d⁶ high-spin octahedral (e.g., [Fe(H2O)6]²⁺)", "II", "CFSE = -0.4 Δo (electron configuration: t2g⁴ eg²)", "Four electrons in t2g and two in eg; CFSE = [4 × (-0.4) + 2 × (+0.6)] Δo = (-1.6 + 1.2) Δo = -0.4 Δo"),
            ("d⁸ octahedral (e.g., [Ni(H2O)6]²⁺)", "III", "CFSE = -1.2 Δo (electron configuration: t2g⁶ eg²)", "Six electrons in t2g and two in eg; CFSE = [6 × (-0.4) + 2 × (+0.6)] Δo = (-2.4 + 1.2) Δo = -1.2 Δo for both weak and strong fields"),
        ], "B"
    ))

    # Q71 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_071", t, "intermediate",
        "Match the Iron coordination complexes in List I with their d-electron configurations and spin-only magnetic moments in List II:",
        [
            ("[Fe(CN)6]⁴⁻ (Hexacyanidoferrate(II))", "II", "Fe²⁺ (3d⁶), low-spin t2g⁶ eg⁰; 0 unpaired electrons, diamagnetic (μ_eff = 0 BM)", "CN⁻ is a strong field ligand (Δo > P); all 6 d-electrons pair up completely in t2g orbitals, leaving 0 unpaired electrons"),
            ("[Fe(H2O)6]²⁺ (Hexaaquairon(II))", "IV", "Fe²⁺ (3d⁶), high-spin t2g⁴ eg²; 4 unpaired electrons, paramagnetic (μ_eff ≈ 4.90 BM)", "H2O is a weak field ligand (Δo < P); Hund's rule is obeyed, giving 4 unpaired electrons; μ = √(4×6) = √24 ≈ 4.90 BM"),
            ("[Fe(CN)6]³⁻ (Hexacyanidoferrate(III))", "I", "Fe³⁺ (3d⁵), low-spin t2g⁵ eg⁰; 1 unpaired electron, paramagnetic (μ_eff ≈ 1.73 BM)", "CN⁻ forces pairing in Fe³⁺ (3d⁵); five electrons fill t2g leaving one unpaired electron; μ = √(1×3) = √3 ≈ 1.73 BM"),
            ("[FeF6]³⁻ (Hexafluoridoferrate(III))", "III", "Fe³⁺ (3d⁵), high-spin t2g³ eg²; 5 unpaired electrons, paramagnetic (μ_eff ≈ 5.92 BM)", "F⁻ is a weak field ligand (Δo < P); each d-orbital receives one electron with parallel spins; μ = √(5×7) = √35 ≈ 5.92 BM"),
        ], "C"
    ))

    # Q72 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_072", t, "intermediate",
        "Match the thermodynamic stability phenomena of coordination complexes in List I with their descriptions in List II:",
        [
            ("Chelate Effect in [Ni(en)3]²⁺ vs [Ni(NH3)6]²⁺", "II", "Enhanced thermodynamic stability driven by a large positive entropy change (ΔS° > 0) upon displacement of monodentate ligands", "Reaction [Ni(NH3)6]²⁺ + 3en <=> [Ni(en)3]²⁺ + 6NH3 releases 6 molecules from 4 reactants, increasing translational degrees of freedom (ΔS° > 0, -TΔS° < 0)"),
            ("Macrocyclic Effect in porphyrin and crown ether complexes", "IV", "Extra thermodynamic stability (> 10⁴-fold) compared to open-chain polydentate ligands due to preorganized ligand conformations", "Cyclic multidentate ligands are preorganized with minimal conformational entropy loss upon metal binding, providing exceptional kinetic and thermodynamic stability"),
            ("Trend in stepwise formation constants (k1 > k2 > k3 > ... > kn)", "I", "Successive formation constants decrease progressively due to statistical factors, steric crowding, and electrostatic effects", "As coordinating ligands accumulate, fewer vacant coordination sites remain and steric repulsion increases, steadily lowering each successive equilibrium constant"),
            ("Irving-Williams stability series for divalent 3d metal complexes", "III", "Follows the sequence Mn²⁺ < Fe²⁺ < Co²⁺ < Ni²⁺ < Cu²⁺ > Zn²⁺, peaking at Cu²⁺ due to Jahn-Teller stabilization", "Combines the steady decrease in ionic radius (increasing electrostatic attraction) with crystal field stabilization, reaching a maximum at Cu²⁺ (d⁹)"),
        ], "D"
    ))

    # =========================================================================
    # ADVANCED (chem_ioc2_073 to chem_ioc2_080)
    # =========================================================================

    # Q73 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_073", t, "advanced",
        "Match the Jahn-Teller distortion manifestations in List I with their electronic configurations and structural consequences in List II:",
        [
            ("Tetragonal elongation (z-out) in Octahedral Copper(II) ([Cu(H2O)6]²⁺)", "III", "d⁹ configuration with unsymmetrically filled eg: (dz²)² (dx²-y²)¹ produces 2 long axial bonds (~2.4 Å) and 4 short equatorial bonds (~2.0 Å)", "Extra electron in dz² shields the z-axis, increasing repulsion towards axial ligands and elongating axial Cu-O bonds while shortening in-plane equatorial bonds"),
            ("High-spin Chromium(II) ([Cr(H2O)6]²⁺)", "I", "d⁴ configuration with t2g³ eg¹ produces pronounced Jahn-Teller elongation due to solitary electron in dz²", "Asymmetric population of the doubly degenerate eg set causes strong geometric distortion, splitting the eg level into lower dz² and higher dx²-y²"),
            ("Low-spin d⁶ complexes (e.g., [Fe(CN)6]⁴⁻, [Co(NH3)6]³⁺)", "IV", "Completely unquenched spherical symmetry (t2g⁶ eg⁰) showing zero Jahn-Teller distortion with six identical bond lengths", "Symmetrically filled subshells (all t2g degenerate orbitals paired, eg completely empty) possess no electronic degeneracy, exhibiting ideal Oh symmetry"),
            ("Weak Jahn-Teller distortion in d¹ and d² complexes (e.g., [Ti(H2O)6]³⁺)", "II", "t2g¹ configuration causes only subtle distortion because t2g orbitals do not point directly at ligand donor atoms", "Because t2g orbitals point between the Cartesian axes (away from ligand lone pairs), asymmetric occupation induces only minor perturbations to metal-ligand bond lengths"),
        ], "A"
    ))

    # Q74 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_074", t, "advanced",
        "Match the Synergic M-CO bonding parameters in List I with their spectroscopic and bond-order consequences in List II:",
        [
            ("M <- C σ-donation combined with M -> C π-backbonding", "IV", "Strengthens and shortens the M-C bond while simultaneously weakening and lengthening the C-O bond", "σ-donation of carbon lone pair into empty metal d orbital is synergically reinforced by π-backbonding from filled metal dπ into CO π* LUMO, lowering C-O bond order"),
            ("Infrared stretching frequency trend: [Mn(CO)6]⁺ > [Cr(CO)6] > [V(CO)6]⁻ > [Ti(CO)6]²⁻", "I", "ν_CO decreases from 2090 to 1750 cm⁻¹ as negative charge increases metal electron density and maximizes π-backbonding into CO π*", "As the formal negative charge increases, metal d-electrons are less tightly bound and back-donate more heavily into CO π* antibonding orbitals, softening the C-O bond vibration"),
            ("Comparison of bridging (μ2-CO) vs terminal (CO) infrared bands", "II", "Bridging CO absorbs at lower frequencies (1750-1850 cm⁻¹) than terminal CO (1850-2125 cm⁻¹)", "Bridging carbonyls accept π-back-donation simultaneously from two metal centers into the same π* orbital, further reducing C-O bond order toward a double bond"),
            ("Effect of replacing CO by phosphines (e.g., PMe3) on remaining M-CO bonds", "III", "Decreases ν_CO of remaining carbonyls because PMe3 is a stronger σ-donor that increases electron density for π-back-donation", "Strong σ-donor ligands pump electron density onto the metal center, compelling the metal to back-donate more electrons into the π* orbitals of remaining CO ligands"),
        ], "B"
    ))

    # Q75 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_075", t, "advanced",
        "Match the homoleptic and polynuclear metal carbonyls in List I with their 18-electron rule counts and metal-metal bonding in List II:",
        [
            ("Iron pentacarbonyl ([Fe(CO)5])", "II", "18-electron mononuclear complex with trigonal bipyramidal geometry; zero metal-metal bonds (8 + 5×2 = 18)", "Fe(0) contributes 8 valence electrons; five CO ligands contribute 10 electrons; 8 + 10 = 18 electrons satisfying the inert gas configuration (Kr)"),
            ("Octacarbonyldicobalt ([Co2(CO)8] in solid state)", "IV", "Contains one Co-Co single bond and two bridging carbonyls, giving 18 electrons per cobalt center", "Solid [Co2(CO)8] has C2v symmetry with a direct Co-Co bond (2.52 Å), two bridging μ2-CO ligands, and six terminal CO ligands; satisfies 18-electron rule per Co"),
            ("Decacarbonyldimanganese ([Mn2(CO)10])", "I", "Contains one Mn-Mn single bond and ten terminal CO ligands with staggered D4d geometry", "Mn(0) has 7 valence electrons; five terminal CO ligands give 10 electrons; the Mn-Mn bond shares 1 electron per Mn; 7 + 10 + 1 = 18 electrons"),
            ("Tri-iron dodecacarbonyl ([Fe3(CO)12])", "III", "Contains three Fe-Fe bonds forming an Fe3 triangular cluster with two bridging CO ligands", "Total valence electrons = 3×8 + 12×2 = 48; number of M-M bonds = (18×3 - 48)/2 = (54 - 48)/2 = 3 bonds forming a three-membered metallic ring"),
        ], "C"
    ))

    # Q76 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_076", t, "advanced",
        "Match the Square Planar substitution reactions and trans-effect series in List I with their mechanistic details in List II:",
        [
            ("Trans-effect order of ligands in square planar substitution", "II", "CO ≈ CN⁻ ≈ C2H4 > PR3 ≈ H⁻ > CH3⁻ ≈ NO2⁻ ≈ I⁻ > Br⁻ > Cl⁻ > NH3 > OH⁻ > H2O", "Reflects the ability of a coordinated ligand to labilize the ligand trans to itself, governed by ground-state σ-polarization and transition-state π-acceptor stabilization"),
            ("Synthesis of cis-[Pt(NH3)2Cl2] from [PtCl4]²⁻", "IV", "Reacting [PtCl4]²⁻ with 2 moles of NH3 yields exclusively the cis isomer because Cl⁻ has a stronger trans-effect than NH3", "After the first NH3 enters, the remaining trans-Cl-Pt-Cl coordinate has higher labilization than trans-NH3-Pt-Cl; hence the second NH3 displaces a Cl trans to another Cl, producing cis"),
            ("Synthesis of trans-[Pt(NH3)2Cl2] from [Pt(NH3)4]²⁺", "I", "Reacting [Pt(NH3)4]²⁺ with 2 moles of HCl yields exclusively the trans isomer because Cl⁻ has a stronger trans-effect than NH3", "Once the first Cl⁻ coordinates, its superior trans-directing power labilizes the NH3 directly trans to it, directing the second incoming Cl⁻ to the trans position"),
            ("Transition state in square planar associative (Ia/A) substitution mechanism", "III", "Passes through a 5-coordinate trigonal bipyramidal (TBP) transition state or intermediate", "Entering nucleophile approaches perpendicular to the square plane, forming a trigonal bipyramid where the trans ligand, entering ligand, and leaving ligand lie in the equatorial plane"),
        ], "D"
    ))

    # Q77 (Answer: A)
    qs.append(make_matrix_q(
        "chem_ioc2_077", t, "advanced",
        "Match the magnetic phenomena and spin-crossover in coordination compounds in List I with their physical mechanisms in List II:",
        [
            ("Quenching of orbital angular momentum in A and E ground terms", "III", "In octahedral fields, non-degenerate A terms and doubly degenerate E terms have L_eff = 0, so μ_eff matches the spin-only value", "The ligand crystal field quenches the circulation of electrons between degenerate orbitals of identical symmetry, removing unquenched orbital angular momentum"),
            ("Unquenched orbital contribution in Octahedral high-spin Co²⁺ (t2g⁵ eg², ⁴T1g)", "I", "Yields an experimental magnetic moment (μ_eff ≈ 4.4-5.2 BM) significantly exceeding the spin-only value (3.87 BM)", "Because the ground state is a triply degenerate T term with an incompletely filled t2g subshell, spin-orbit coupling and orbital circulation remain active"),
            ("Spin-crossover phenomenon in [Fe(phen)2(NCS)2]", "IV", "Reversible temperature-dependent transition between low-spin diamagnetic (¹A1g, S=0) and high-spin paramagnetic (⁵T2g, S=2) states", "Occurs when crystal field splitting Δo is very close to electron pairing energy P (Δo ≈ P); low T favors lower enthalpy low-spin, while high T favors higher entropy high-spin"),
            ("Ferromagnetic coupling in Prussian Blue analogues", "II", "Superexchange interaction mediated by bridging cyanide (-C≡N-) ligands between adjacent orthogonal transition metal orbitals", "Unpaired electrons on adjacent Fe centers couple magnetically through cyanide π and π* molecular orbitals via superexchange, producing macroscopic magnetic ordering"),
        ], "A"
    ))

    # Q78 (Answer: B)
    qs.append(make_matrix_q(
        "chem_ioc2_078", t, "advanced",
        "Match the electronic absorption spectra of octahedral complexes in List I with their spectroscopic assignments in List II:",
        [
            ("[Ti(H2O)6]³⁺ (d¹) optical absorption spectrum", "IV", "Shows a single broad absorption band with a distinct shoulder at ~20,300 cm⁻¹ (490 nm) corresponding to ²T2g -> ²Eg", "The solitary d-electron is excited from t2g to eg; the asymmetric shoulder arises from dynamic Jahn-Teller splitting of the excited ²Eg state into two sub-levels"),
            ("[Ni(H2O)6]²⁺ (d⁸) optical absorption spectrum", "I", "Shows three spin-allowed absorption bands: ³A2g -> ³T2g (ν1), ³A2g -> ³T1g(F) (ν2), and ³A2g -> ³T1g(P) (ν3)", "Octahedral d⁸ has a ³A2g ground state; absorption spectra display three distinct bands in the visible and near-IR regions characteristic of spin-allowed transitions"),
            ("Direct experimental measurement of 10 Dq (Δo) from [Ni(H2O)6]²⁺ spectrum", "II", "The lowest energy transition ν1 (³A2g -> ³T2g) directly equals the crystal field splitting parameter Δo (10 Dq ≈ 8500 cm⁻¹)", "The energy difference between the ³A2g ground state and the lowest excited ³T2g state corresponds exactly to the orbital splitting energy 10 Dq"),
            ("[Cu(H2O)6]²⁺ (d⁹) optical absorption spectrum", "III", "Broad asymmetric band centered at ~12,500 cm⁻¹ resulting from three overlapping transitions split by Jahn-Teller distortion", "Tetragonal elongation lowers symmetry from Oh to D4h, splitting eg into dx²-y² and dz², and t2g into dxy and (dxz, dyz), yielding multiple closely spaced d-d transitions"),
        ], "B"
    ))

    # Q79 (Answer: C)
    qs.append(make_matrix_q(
        "chem_ioc2_079", t, "advanced",
        "Match the redox electron transfer mechanisms in coordination chemistry in List I with their experimental proofs in List II:",
        [
            ("Taube Inner-Sphere electron transfer mechanism", "II", "Requires a bridging ligand (e.g., Cl⁻) that simultaneously coordinates both metal centers in a binuclear precursor intermediate", "Electron transfer proceeds through the bridging ligand orbital; upon electron transfer, the bridging ligand transfers quantitatively from the inert oxidant to the reductant"),
            ("Classic Taube bridging experiment with radioactive ³⁶Cl", "IV", "[Co(NH3)5(³⁶Cl)]²⁺ + [Cr(H2O)6]²⁺ -> [Co(H2O)6]²⁺ + [Cr(H2O)5(³⁶Cl)]²⁺ with 100% transfer of ³⁶Cl to Chromium", "Demonstrates unequivocally that the chloride ion bridges the Co(III) and Cr(II) centers and remains bound to Cr(III) because Cr(III) (d³) is substitutionally inert"),
            ("Outer-Sphere electron transfer mechanism (e.g., [Fe(CN)6]⁴⁻ + [Fe*(CN)6]³⁻)", "I", "Electron tunneling occurs without breaking or forming coordination bonds, governed by the Franck-Condon principle", "Electron transfer is faster than ligand substitution; reactants adjust metal-ligand bond distances to an intermediate transition geometry prior to quantum mechanical tunneling"),
            ("Marcus Cross-Relation in outer-sphere electron transfer", "III", "Relates the rate constant of a cross-redox reaction to the self-exchange rate constants and thermodynamic driving force (ΔG°)", "Predicts electron transfer rates based on the reorganization energies of the inner coordination sphere (bond lengths) and outer solvent dielectric sphere"),
        ], "C"
    ))

    # Q80 (Answer: D)
    qs.append(make_matrix_q(
        "chem_ioc2_080", t, "advanced",
        "Match the bio-inorganic coordination centers in List I with their metal oxidation states and biochemical functions in List II:",
        [
            ("Chlorophyll", "II", "Magnesium(II) coordinated inside a substituted chlorin (dihydroporphyrin) macrocycle; captures photon energy for photosynthesis", "Mg²⁺ coordinates the four pyrrole nitrogens of the planar chlorin ring, maintaining rigidity and tuning the π-π* absorption bands to red and blue visible wavelengths"),
            ("Deoxyhemoglobin vs Oxyhemoglobin", "IV", "Deoxyhemoglobin contains high-spin paramagnetic Fe(II) displaced out of porphyrin plane; Oxyhemoglobin is low-spin diamagnetic Fe(II) resting in-plane", "Binding of O2 produces a strong ligand field, converting high-spin Fe²⁺ (r = 0.78 Å) to smaller low-spin Fe²⁺ (r = 0.61 Å) that snaps into the heme plane, triggering cooperativity"),
            ("Vitamin B12 (Cyanocobalamin)", "I", "Cobalt(III) coordinated within a corrin ring; features a direct organometallic Co-C σ-bond essential for methyl transfer and isomerization", "Cobalamin contains a unique biological cobalt-carbon bond (Co-CH3 or Co-5'-deoxyadenosyl) that undergoes reversible homolytic cleavage to generate radical intermediates"),
            ("Carbonic Anhydrase", "III", "Zinc(II) coordinated tetrahedrally to three histidine imidazoles and an active water molecule; catalyzes CO2 + H2O <=> HCO3⁻ + H⁺", "Zn²⁺ acts as a powerful Lewis acid that lowers the pKa of coordinated water from 14 to ~7, generating a potent nucleophilic Zn-OH⁻ unit that rapidly attacks CO2"),
        ], "D"
    ))

    return qs

get_questions = get_coord_questions
