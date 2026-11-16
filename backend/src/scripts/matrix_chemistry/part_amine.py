from builder import make_matrix_q

def get_amine_questions():
    qs = []

    # -------------------------------------------------------------------------
    # chem_org2_041 (Beginner, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_041",
        topic="Amines",
        difficulty="beginner",
        lead="Match the distinguishing qualitative test for amines in List I with its diagnostic observation in List II:",
        pairs=[
            (
                "Hinsberg test with a primary aliphatic amine (e.g., ethylamine + PhSO2Cl followed by KOH)",
                "II",
                "Formation of N-alkylbenzenesulfonamide that dissolves in aqueous KOH and reprecipitates upon acidification",
                "Primary amines react with benzenesulfonyl chloride to form N-alkylbenzenesulfonamides; the remaining proton on nitrogen is strongly acidic due to the adjacent electron-withdrawing sulfonyl group, dissolving in aqueous KOH to form a water-soluble potassium salt"
            ),
            (
                "Hinsberg test with a secondary amine (e.g., diethylamine + PhSO2Cl followed by KOH)",
                "IV",
                "Formation of an insoluble N,N-dialkylbenzenesulfonamide precipitate that remains insoluble in aqueous KOH",
                "Secondary amines react to give N,N-dialkylbenzenesulfonamides lacking any acidic hydrogen on the sulfonamide nitrogen; the product is completely insoluble in alkali and remains as an insoluble precipitate"
            ),
            (
                "Carbylamine test (warming primary amine with chloroform and alcoholic KOH)",
                "I",
                "Evolution of an intolerable, foul-smelling isocyanide (carbylamine)",
                "Both aliphatic and aromatic primary amines react with dichlorocarbene generated from CHCl3 and KOH to produce foul-smelling isocyanides (R-NC); secondary and tertiary amines do not undergo this reaction"
            ),
            (
                "Azo dye test: treating aniline with NaNO2/HCl at 0-5 °C followed by alkaline beta-naphthol",
                "III",
                "Formation of a brilliant orange-red crystalline azo dye precipitate",
                "Primary aromatic amines form stable arenediazonium ions at low temperature, which couple with electron-rich beta-naphthol in alkaline solution to yield an intensely colored, conjugated azo dye"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_042 (Beginner, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_042",
        topic="Amines",
        difficulty="beginner",
        lead="Match the amine preparation method in List I with the resulting amine in List II:",
        pairs=[
            (
                "Reduction of nitrobenzene with tin and concentrated hydrochloric acid (Sn / HCl) followed by base",
                "III",
                "Aniline (benzenamine, C6H5NH2)",
                "Tin in hydrochloric acid (or Fe/HCl) reduces the nitro group through single-electron transfers and protonations to an anilinium salt, which upon basification with NaOH liberates free aniline"
            ),
            (
                "Reduction of benzonitrile (C6H5CN) with lithium aluminum hydride (LiAlH4) in dry ether",
                "I",
                "Benzylamine (C6H5CH2NH2)",
                "LiAlH4 delivers two equivalents of hydride to the nitrile carbon, reducing the cyano group completely to a primary aminomethyl group without cleaving the aromatic ring"
            ),
            (
                "Reduction of ethanamide (CH3CONH2) with LiAlH4 followed by aqueous workup",
                "IV",
                "Ethylamine (ethanamine, CH3CH2NH2)",
                "Hydride reduction of acetamide converts the carbonyl oxygen to a tetrahedral aluminate, which upon oxygen expulsion forms an iminium intermediate that is reduced to ethylamine with conservation of carbon count"
            ),
            (
                "Gabriel phthalimide synthesis: potassium phthalimide treated with ethyl iodide followed by alkaline hydrolysis",
                "II",
                "Pure ethylamine (CH3CH2NH2) free from secondary and tertiary amines",
                "Phthalimide anion undergoes SN2 displacement on ethyl iodide to give N-ethylphthalimide; hydrolysis cleaves both imide C-N bonds to yield pure primary ethylamine and phthalate salt"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_043 (Beginner, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_043",
        topic="Amines",
        difficulty="beginner",
        lead="Match the amine basicity trend or phenomenon in List I with its governing physical explanation in List II:",
        pairs=[
            (
                "Basicity order of methylamines in aqueous solution: (CH3)2NH > CH3NH2 > (CH3)3N > NH3",
                "IV",
                "Delicate interplay of inductive effect (+I), hydration/solvation energy, and steric hindrance of alkyl groups",
                "The inductive effect increases basicity with alkylation, but hydration of the ammonium cation decreases due to steric crowding; secondary dimethylamine represents the optimal balance of +I stabilization and water hydration"
            ),
            (
                "Basicity order of ethylamines in aqueous solution: (C2H5)2NH > (C2H5)3N > C2H5NH2 > NH3",
                "II",
                "Triethylamine is more basic than monoethylamine because ethyl groups exert a greater +I effect than methyl groups",
                "With bulkier ethyl groups, inductive electron donation is larger, making triethylamine more basic than ethylamine; diethylamine remains the most basic due to balanced solvation and inductive factors"
            ),
            (
                "Basicity order of alkylamines in the gas phase: 3° > 2° > 1° > NH3",
                "I",
                "Pure electron-donating inductive effect (+I) stabilizes the cation without any solvent stabilization effects",
                "In the gas phase, solvent hydration is absent; basicity correlates directly with the number of polarizable alkyl groups that disperse positive charge in the conjugate acid"
            ),
            (
                "Low basicity of aniline (pKb = 9.4) compared to aliphatic amines (pKb ~3-4)",
                "III",
                "Delocalization of the nitrogen lone pair into the aromatic ring via resonance decreases electron density",
                "The unshared electron pair on the nitrogen of aniline participates in resonance with the pi-electrons of the benzene ring, reducing its availability for protonation"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_044 (Beginner, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_044",
        topic="Amines",
        difficulty="beginner",
        lead="Match the electrophilic aromatic substitution of aniline in List I with its experimental outcome in List II:",
        pairs=[
            (
                "Reaction of aniline with aqueous bromine water (Br2 / H2O) at room temperature",
                "I",
                "Immediate white precipitate of 2,4,6-tribromoaniline",
                "The amino group strongly activates the aromatic ring through +M resonance donation, causing rapid and uncontrollable electrophilic bromination at all available ortho and para positions"
            ),
            (
                "Monobromination protocol: treatment of aniline with Ac2O/pyridine, followed by Br2/AcOH and acidic hydrolysis",
                "III",
                "4-Bromoaniline (p-bromoaniline) obtained as the exclusive major product",
                "Acetylation converts -NH2 into acetamido (-NHCOCH3), moderating resonance activation by delocalizing nitrogen's lone pair into the acetyl carbonyl; steric bulk directs bromination exclusively to the para position"
            ),
            (
                "Direct nitration of aniline with concentrated HNO3 and concentrated H2SO4 at 288 K",
                "IV",
                "Formation of 51% p-nitroaniline, 47% m-nitroaniline, and 2% o-nitroaniline",
                "In strongly acidic nitration medium, aniline is extensively protonated to the anilinium ion (-NH3+), which is a powerful meta-directing deactivating group, producing an unusually high yield of m-nitroaniline"
            ),
            (
                "Heating aniline with concentrated sulfuric acid at 453-473 K (sulfonation)",
                "II",
                "Sulfanilic acid (4-aminobenzenesulfonic acid), which exists predominantly as a zwitterion",
                "Initial formation of anilinium hydrogen sulfate rearranges upon heating at 180 °C to sulfanilic acid; the basic amino group and acidic sulfonic group undergo internal proton transfer to form a dipolar zwitterion"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_045 (Intermediate, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_045",
        topic="Amines",
        difficulty="intermediate",
        lead="Match the arenediazonium transformation in List I with its specific reagent and product in List II:",
        pairs=[
            (
                "Sandmeyer chlorination of benzenediazonium chloride (PhN2+ Cl-)",
                "II",
                "CuCl dissolved in concentrated HCl yielding chlorobenzene (PhCl) with evolution of N2",
                "Cuprous chloride catalyzes single-electron transfer to the diazonium cation, generating an aryl radical and copper(II) complex that recombine to furnish chlorobenzene and molecular nitrogen"
            ),
            (
                "Sandmeyer cyanation of benzenediazonium chloride",
                "IV",
                "CuCN dissolved in aqueous KCN yielding benzonitrile (PhCN)",
                "Treatment of the diazonium salt with cuprous cyanide introduces the cyano group onto the aromatic ring via an aryl radical mechanism, providing an essential pathway to aromatic carboxylic acid derivatives"
            ),
            (
                "Iodination of benzenediazonium chloride",
                "I",
                "Warming with aqueous potassium iodide (KI) yielding iodobenzene (PhI) without copper catalyst",
                "Iodide ion is a powerful reducing agent that undergoes spontaneous electron transfer with the diazonium cation without requiring cuprous catalysis, precipitating iodobenzene upon warming"
            ),
            (
                "Balz-Schiemann fluorination of benzenediazonium chloride",
                "III",
                "Precipitation with HBF4 to give PhN2+ BF4- followed by dry thermal pyrolysis yielding fluorobenzene (PhF)",
                "Addition of fluoroboric acid precipitates water-insoluble benzenediazonium tetrafluoroborate; controlled dry heating decomposes the salt cleanly into fluorobenzene, gaseous boron trifluoride, and nitrogen"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_046 (Intermediate, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_046",
        topic="Amines",
        difficulty="intermediate",
        lead="Match the arenediazonium coupling or reduction reaction in List I with its outcome in List II:",
        pairs=[
            (
                "Coupling of benzenediazonium chloride with phenol at pH 9-10 (weakly alkaline)",
                "IV",
                "p-Hydroxyazobenzene (orange dye) via electrophilic attack on phenoxide ion",
                "In alkaline medium, phenol is deprotonated to the highly nucleophilic phenoxide ion, which undergoes rapid electrophilic aromatic substitution at the para position with the diazonium electrophile"
            ),
            (
                "Coupling of benzenediazonium chloride with N,N-dimethylaniline at pH 4-5 (weakly acidic)",
                "III",
                "p-(N,N-Dimethylamino)azobenzene (butter yellow dye)",
                "In weakly acidic medium, N,N-dimethylaniline remains largely unprotonated as a free base with high electron density at the para position, coupling efficiently with the diazonium cation"
            ),
            (
                "Coupling of benzenediazonium chloride with beta-naphthol (naphthalen-2-ol) in alkaline solution",
                "II",
                "1-(Phenyldiazenyl)naphthalen-2-ol (Sudan I / intense scarlet-red dye)",
                "The diazonium ion attacks exclusively at the activated C1 position of beta-naphthol; the resulting azo compound is stabilized by strong intramolecular hydrogen bonding between the azo nitrogen and naphtholic OH"
            ),
            (
                "Reduction of benzenediazonium chloride with hypophosphorous acid (H3PO2) in the presence of Cu+",
                "I",
                "Benzene (reductive deamination) with formation of phosphorous acid (H3PO3) and N2",
                "Hypophosphorous acid acts as a hydride donor and single-electron reducing agent, replacing the diazonium group with hydrogen to accomplish reductive deamination of aromatic amines"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_047 (Intermediate, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_047",
        topic="Amines",
        difficulty="intermediate",
        lead="Match the Gabriel phthalimide reaction nuance in List I with its mechanistic explanation in List II:",
        pairs=[
            (
                "Synthesis of ethylamine from potassium phthalimide and ethyl bromide in DMF",
                "III",
                "High-yielding SN2 displacement followed by hydrazinolysis (Ing-Manske procedure)",
                "Phthalimide anion is a strong nucleophile that displaces bromide from primary ethyl bromide via SN2; treatment with hydrazine hydrate releases ethylamine and insoluble phthalhydrazide under mild conditions"
            ),
            (
                "Failure of Gabriel synthesis to prepare aniline from potassium phthalimide and chlorobenzene",
                "I",
                "Aryl halides cannot undergo SN2 displacement due to partial double-bond character of C-Cl and sp2 hybridization",
                "The C-Cl bond of chlorobenzene has partial double bond character due to resonance, and the aryl ring sterically and electronically repels backside nucleophilic attack, completely preventing the initial SN2 alkylation"
            ),
            (
                "Reaction of potassium phthalimide with ethyl 2-bromopropanoate followed by acidic hydrolysis",
                "IV",
                "Facile synthesis of DL-alanine (alpha-amino acid)",
                "The alpha-bromo ester undergoes smooth SN2 substitution by phthalimide anion; vigorous acidic hydrolysis cleaves both the ester and imide bonds, delivering racemic alanine hydrochloride"
            ),
            (
                "Reaction of potassium phthalimide with tert-butyl bromide",
                "II",
                "Exclusive E2 elimination yielding isobutylene (2-methylpropene) and regenerating phthalimide",
                "Phthalimide anion acts as a Bronsted base rather than a nucleophile when confronted with a tertiary alkyl halide, inducing rapid E2 elimination of HBr rather than substitution"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_048 (Intermediate, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_048",
        topic="Amines",
        difficulty="intermediate",
        lead="Match the Hofmann bromamide degradation aspect in List I with its mechanistic detail in List II:",
        pairs=[
            (
                "Reaction of propanamide (CH3CH2CONH2) with Br2 and 4 equivalents of KOH",
                "I",
                "Ethylamine (CH3CH2NH2) with loss of one carbonyl carbon as potassium carbonate (K2CO3)",
                "The reaction degrades the primary carboxamide to a primary amine possessing exactly one fewer carbon atom; the carbonyl carbon is extruded as carbonate"
            ),
            (
                "Relative migration rates of p-methoxyphenyl versus p-nitrophenyl groups in substituted benzamides",
                "III",
                "p-Methoxyphenyl migrates much faster due to electron donation stabilizing the electron-deficient transition state",
                "The migrating aryl group shifts with its bonding electron pair to an electron-deficient nitrogen atom; electron-donating substituents (+M) substantially accelerate the rearrangement"
            ),
            (
                "Stereochemical outcome when chiral (R)-2-methylbutanamide undergoes Hofmann degradation",
                "IV",
                "(R)-sec-Butylamine obtained with complete retention of optical configuration at the chiral center",
                "The 1,2-rearrangement to nitrogen is concerted; the migrating chiral carbon never becomes a free carbanion or planar radical, migrating with 100% retention of stereochemistry"
            ),
            (
                "Trapping of the isocyanate intermediate (RN=C=O) by running the reaction in anhydrous methanol",
                "II",
                "Methyl carbamate (urethane, RNHCOOCH3) isolated without hydrolysis to free amine",
                "The isocyanate intermediate generated upon bromide loss is trapped nucleophilically by methanol before it can be attacked by water, yielding a stable carbamic ester"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_049 (Intermediate, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_049",
        topic="Amines",
        difficulty="intermediate",
        lead="Match the amine elimination transformation in List I with its regiochemical outcome in List II:",
        pairs=[
            (
                "Pyrolysis of sec-butyltrimethylammonium hydroxide: [CH3-CH2-CH(CH3)-N+(CH3)3] OH- at 150 °C",
                "II",
                "Predominantly but-1-ene (~95%) as the major Hofmann elimination product",
                "The bulky trimethylammonium leaving group induces strong steric crowding, forcing base attack on the more accessible, less sterically hindered, and more acidic terminal methyl protons (Hofmann rule)"
            ),
            (
                "Dehydrohalogenation of 2-bromobutane with alcoholic KOH at 80 °C (Saytzeff elimination)",
                "IV",
                "Predominantly but-2-ene (~80%, mainly trans-isomer) as the thermodynamic alkene",
                "Halide leaving groups are relatively compact; the transition state develops significant double bond character, favoring abstraction of the internal proton to form the thermodynamically more stable, more substituted alkene"
            ),
            (
                "Cope elimination: thermal decomposition of N,N-dimethylbutan-2-amine N-oxide at 100 °C",
                "I",
                "But-1-ene formed via a concerted planar syn-5-membered cyclic transition state",
                "The intramolecular oxygen of the amine oxide acts as the base in a concerted cyclic 5-membered transition state; elimination occurs with syn stereochemistry, yielding predominantly the less hindered terminal alkene"
            ),
            (
                "Hofmann elimination of (1-methylpropyl)triethylammonium hydroxide",
                "III",
                "Ethylene (ethene) formed preferentially over butenes",
                "When comparing ethyl groups to the sec-butyl group on nitrogen, the ethyl group beta-hydrogens are less sterically hindered and undergo faster elimination, releasing ethylene and 2-aminobutane derivative"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_050 (Intermediate, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_050",
        topic="Amines",
        difficulty="intermediate",
        lead="Match the reaction of nitrous acid (HNO2 / NaNO2 + HCl) with the amine in List I to its observed behavior in List II:",
        pairs=[
            (
                "Primary aliphatic amine (e.g., n-propylamine) treated with HNO2 at room temperature",
                "IV",
                "Immediate evolution of N2 gas and complex mixture of propan-1-ol, propan-2-ol, and propene",
                "Aliphatic diazonium salts [R-N2]+ are unstable even at 0 °C and decompose instantaneously with loss of N2 to generate carbocations, which undergo elimination, nucleophilic capture, and 1,2-hydride shifts"
            ),
            (
                "Primary aromatic amine (aniline) treated with HNO2 at 0-5 °C",
                "III",
                "Stable aqueous benzenediazonium chloride without immediate nitrogen gas evolution",
                "The arenediazonium ion is stabilized by resonance delocalization of pi-electrons into the benzene ring; at 0-5 °C, it remains intact in aqueous solution for subsequent functional group transformations"
            ),
            (
                "Secondary amine (diethylamine or N-methylaniline) treated with cold HNO2",
                "II",
                "Yellow oily liquid of N-nitrosamine giving positive Liebermann's nitroso test",
                "Secondary amines lack a second proton on nitrogen required for water elimination to a diazonium ion; instead, they stop at stable N-nitroso derivatives (R2N-N=O), appearing as insoluble yellow oils"
            ),
            (
                "Tertiary aliphatic amine (triethylamine) treated with cold HNO2",
                "I",
                "Formation of a clear, water-soluble triethylammonium nitrite salt [Et3NH]+ NO2-",
                "Tertiary aliphatic amines have no hydrogen on nitrogen to form nitrosamines; they undergo simple acid-base neutralization with nitrous acid to form soluble nitrite salts that regenerate the amine on basification"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_051 (Intermediate, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_051",
        topic="Amines",
        difficulty="intermediate",
        lead="Match the amine protection / functionalization strategy in List I with its key reagent / feature in List II:",
        pairs=[
            (
                "Acetylation of aniline to acetanilide prior to electrophilic aromatic substitution",
                "III",
                "Acetic anhydride in pyridine; moderates activation and prevents oxidation by HNO3",
                "Acetanilide delocalizes the nitrogen lone pair into the acetyl carbonyl, reducing the susceptibility of the aromatic ring to oxidation and poly-substitution while retaining ortho/para directing power"
            ),
            (
                "Benzyloxycarbonyl (Cbz / Z) protection of amino group in peptide synthesis",
                "I",
                "Benzyl chloroformate (PhCH2OCOCl); deprotection cleanly achieved by catalytic hydrogenolysis (H2 / Pd-C)",
                "Cbz chloride reacts with primary amines to form benzyl carbamates; the protecting group is robust to mild acids/bases and is selectively removed under neutral conditions by hydrogenolysis to yield toluene, CO2, and free amine"
            ),
            (
                "tert-Butoxycarbonyl (Boc) protection of primary or secondary amines",
                "IV",
                "Di-tert-butyl dicarbonate (Boc2O); deprotection selectively accomplished with trifluoroacetic acid (TFA)",
                "Boc protection forms a tert-butyl carbamate that is completely inert to catalytic hydrogenation and basic nucleophiles, but undergoes rapid cleavage in anhydrous TFA via tert-butyl carbocation formation"
            ),
            (
                "p-Toluenesulfonyl (tosyl, Ts) protection of a primary amine",
                "II",
                "Tosyl chloride (TsCl) in pyridine; acidic sulfonamide N-H enables subsequent selective monoalkylation",
                "The strong electron-withdrawing tosyl group acidifies the N-H bond (pKa ~10), allowing selective deprotonation with NaH and monoalkylation with alkyl halides to furnish secondary amine derivatives"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_052 (Intermediate, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_052",
        topic="Amines",
        difficulty="intermediate",
        lead="Match the amine separation or distinction principle in List I with its operative mechanism in List II:",
        pairs=[
            (
                "Hinsberg method for separating a mixture of 1°, 2°, and 3° amines",
                "I",
                "Extraction protocol based on differing solubilities of sulfonamide derivatives in aqueous alkali and acid",
                "Primary amine sulfonamide dissolves in aqueous KOH as a potassium salt; secondary amine sulfonamide is an insoluble solid filtered off; tertiary amine does not react and is extracted directly with ether"
            ),
            (
                "Resolution of racemic (+/-)-1-phenylethylamine using natural (2R,3R)-(+)-tartaric acid",
                "III",
                "Formation and fractional crystallization of diastereomeric ammonium tartrate salts",
                "Reaction of racemic base with an enantiopure chiral acid yields diastereomeric salts with different physical properties (solubilities, melting points), allowing separation by fractional crystallization"
            ),
            (
                "Distinguishing aniline from benzylamine using nitrous acid test at 0-5 °C",
                "IV",
                "Aniline forms stable arenediazonium salt coupling with beta-naphthol, whereas benzylamine gives immediate N2 gas",
                "Benzylic amines behave as aliphatic amines: their diazonium salts decompose rapidly with effervescence of N2 gas; aromatic amines form stable diazonium cations that couple to form azo dyes"
            ),
            (
                "Boiling point comparison of isomeric amines: n-butylamine (78 °C) vs diethylamine (56 °C) vs ethyldimethylamine (36 °C)",
                "II",
                "Extensive N-H...N intermolecular hydrogen bonding in 1° amines compared to weaker bonding in 2° and none in 3°",
                "Primary amines have two N-H bonds capable of forming extensive intermolecular hydrogen bonding networks; secondary amines have only one N-H bond, and tertiary amines lack N-H entirely"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_053 (Advanced, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_053",
        topic="Amines",
        difficulty="advanced",
        lead="Match the advanced stereoelectronic feature of rearrangements to electron-deficient nitrogen in List I with its experimental proof in List II:",
        pairs=[
            (
                "Crossover experiment in Hofmann bromamide degradation using two different substituted amides",
                "II",
                "No mixed amine products detected, proving the 1,2-migration is strictly intramolecular",
                "When equimolar mixtures of isotopically labeled or differently substituted benzamides undergo Hofmann rearrangement simultaneously, no crossover products are formed, confirming that migrating groups never dissociate"
            ),
            (
                "Hammett correlation study for Curtius rearrangement of substituted benzoyl azides",
                "IV",
                "Negative reaction constant (rho = -0.3 to -0.6), reflecting slight positive charge development at migrating carbon",
                "Electron-donating substituents slightly accelerate the rearrangement, indicating that the migrating aromatic ring functions as an intramolecular nucleophile in a concerted concerted concerted transition state"
            ),
            (
                "Schmidt reaction on optically active (S)-2-phenylpropanoic acid with hydrazoic acid",
                "I",
                "Complete retention of configuration yielding (S)-1-phenylethylamine",
                "The 1,2-migration of the chiral stereocenter to the protonated azide nitrogen occurs in a concerted manner with frontside migration, preserving the absolute spatial configuration"
            ),
            (
                "Beckmann rearrangement of unsymmetrical ketoximes (e.g., acetophenone oxime with PCl5)",
                "III",
                "Exclusive migration of the group anti-periplanar to the leaving hydroxyl/phosphate group",
                "Orbital overlap requires the migrating group's C-C bonding sigma electrons to enter the back of the breaking N-O sigma* orbital; hence, stereoelectronic alignment dictates that only the anti group migrates"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_054 (Advanced, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_054",
        topic="Amines",
        difficulty="advanced",
        lead="Match the chiral amine or nitrogen inversion phenomenon in List I with its structural basis in List II:",
        pairs=[
            (
                "Acyclic tertiary amine (e.g., ethylmethylpropylamine) at room temperature",
                "IV",
                "Rapid pyramidal umbrella inversion (barrier ~5-7 kcal/mol) prevents isolation of enantiomers",
                "The nitrogen lone pair rehybridizes from sp3 to sp2 through a planar transition state thousands of times per second at 25 °C, causing rapid racemization of simple acyclic 3° amines"
            ),
            (
                "Troger's base (bridged methano-diazocine framework)",
                "III",
                "Bicyclic bridgehead geometry prevents planarization of nitrogen, allowing resolution into stable enantiomers",
                "The two nitrogen bridgehead atoms are constrained within a rigid bicyclic framework that cannot achieve planar sp2 geometry without breaking the ring system, making nitrogen inversion impossible"
            ),
            (
                "1-Chloro-2,2-dimethylaziridine",
                "II",
                "High angle strain and electronegative chlorine raise the inversion barrier to >20 kcal/mol, allowing isolation of invertomers",
                "The 60° bond angles in the 3-membered aziridine ring heavily disfavor planarization (which requires 120° angles); the electronegative chlorine further increases the p-character of ring bonds, raising the inversion barrier"
            ),
            (
                "Quaternary ammonium salt with 4 different alkyl groups: [N(CH3)(C2H5)(CH2Ph)(C3H7)]+ Br-",
                "I",
                "Rigid tetrahedral sp3 carbon-like geometry lacking lone pairs, enabling resolution into stable chiral enantiomers",
                "Quaternization removes the unshared electron pair, converting nitrogen into a non-inverting tetrahedral chiral center completely analogous to an asymmetric carbon atom"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_055 (Advanced, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_055",
        topic="Amines",
        difficulty="advanced",
        lead="Match the amine basicity phenomenon or sterically tuned amine in List I with its operative mechanism in List II:",
        pairs=[
            (
                "1,8-Bis(dimethylamino)naphthalene ('Proton Sponge', pKa of conjugate acid = 12.1)",
                "III",
                "Severe steric repulsion of adjacent lone pairs relieved upon protonation, forming a strong [N-H...N]+ hydrogen bond",
                "In the neutral molecule, two dimethylamino groups on the peri-positions force their electron pairs into close steric proximity; protonation relieves this repulsion and forms a symmetrical intramolecular hydrogen-bonded cation"
            ),
            (
                "2,6-Di-tert-butylpyridine",
                "I",
                "Strong Bronsted base toward small protons but completely non-nucleophilic toward alkyl halides or Lewis acids",
                "Bulky tert-butyl groups flank the nitrogen atom, creating immense steric hindrance that prevents coordination to large electrophiles (like methyl iodide or BF3) while remaining accessible to tiny protons"
            ),
            (
                "Quinuclidine (1-azabicyclo[2.2.2]octane) versus triethylamine basicity",
                "IV",
                "Quinuclidine is significantly more basic because its three alkyl chains are tied back in a cage, unhindering the lone pair",
                "In triethylamine, flexible ethyl groups sterically crowd the nitrogen lone pair and hinder hydration of the cation; in bicyclic quinuclidine, the alkyl bridges are held back, exposing the sp3 lone pair"
            ),
            (
                "Steric inhibition of resonance in 2,6-dimethyl-N,N-dimethylaniline",
                "II",
                "Ortho-methyl groups force the -NMe2 group perpendicular to the ring, increasing basicity toward aliphatic levels",
                "Steric crowding between the ortho-methyl substituents and the dimethylamino group prevents the nitrogen lone pair orbital from aligning with the aromatic pi-system, suppressing resonance donation into the ring"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_056 (Advanced, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_056",
        topic="Amines",
        difficulty="advanced",
        lead="Match the reductive amination or enamine transformation in List I with its characteristic mechanism in List II:",
        pairs=[
            (
                "Reductive amination of cyclohexanone with methylamine using NaBH3CN at pH 6-7",
                "I",
                "Selective reduction of the protonated iminium intermediate without competitive reduction of the ketone",
                "At pH 6-7, the iminium ion is protonated and much more electrophilic than the carbonyl group; electron-withdrawing cyano group deactivates NaBH3CN so it reduces iminium ions rapidly while leaving ketones untouched"
            ),
            (
                "Stork enamine reaction: pyrrolidine enamine of cyclohexanone reacted with acetyl chloride followed by hydrolysis",
                "IV",
                "Clean mono-C-acylation yielding 2-acetylcyclohexanone without polyalkylation or self-condensation",
                "Enamines behave as neutral enolate equivalents that attack acyl halides at the beta-carbon; subsequent aqueous hydrolysis regenerates the ketone and expels pyrrolidine cleanly"
            ),
            (
                "Eschweiler-Clarke methylation: heating a primary amine with excess formaldehyde and formic acid",
                "II",
                "Conversion to tertiary N,N-dimethylamine where formic acid serves as the stoichiometric hydride donor",
                "Condensation with formaldehyde forms an iminium cation; formic acid transfers hydride to the iminium carbon with extrusion of carbon dioxide gas, methylating the amine cleanly to the tertiary stage"
            ),
            (
                "Leuckart reaction: heating acetophenone with ammonium formate at 180 °C",
                "III",
                "Formation of alpha-phenylethylamine via an intermediate N-formyl derivative followed by hydrolysis",
                "Ketone reacts with ammonium formate to form an imine that is reduced in situ by formate ion (acting as hydride source with CO2 loss) to an N-formyl amine, which hydrolyzes to alpha-phenylethylamine"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_057 (Advanced, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_057",
        topic="Amines",
        difficulty="advanced",
        lead="Match the specialized amine elimination or rearrangement in List I with its transition state / intermediate in List II:",
        pairs=[
            (
                "Hofmann E2 elimination of quaternary ammonium hydroxides",
                "II",
                "Anti-periplanar E2 transition state where steric bulk dictates deprotonation at the least substituted beta-carbon",
                "The large trimethylammonium group forces the transition state to adopt a conformation minimizing steric repulsion, placing the base attack on the sterically least crowded and most acidic beta-proton"
            ),
            (
                "Cope elimination of aliphatic amine N-oxides upon gentle warming (~100 °C)",
                "IV",
                "Concerted syn-coplanar 5-membered cyclic transition state delivering alkene and N,N-dialkylhydroxylamine",
                "The N-oxide oxygen serves as an internal base, abstracting a beta-hydrogen from the same face of the molecule through a planar 5-membered cyclic transition state without needing external base"
            ),
            (
                "Neber rearrangement of ketoxime tosylates with ethoxide followed by hydrolysis",
                "I",
                "Formation of a transient 2H-azirine 3-membered unsaturated cyclic intermediate yielding alpha-amino ketones",
                "Deprotonation of the alpha-carbon produces a carbanion that internally displaces tosylate from nitrogen to form an azirine ring; aqueous acidic workup hydrolyzes the strained azirine to an alpha-amino ketone"
            ),
            (
                "Sommelet-Hauser rearrangement of benzylic quaternary ammonium ylides with NaNH2",
                "III",
                "[2,3]-Sigmatropic rearrangement of ammonium ylide followed by rearomatization yielding ortho-substituted amine",
                "Deprotonation generates a nitrogen ylide that undergoes an intramolecular [2,3]-sigmatropic shift into the aromatic ring, followed by loss of aromatic proton to re-establish the benzene ring"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_058 (Advanced, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_058",
        topic="Amines",
        difficulty="advanced",
        lead="Match the radical or advanced arenediazonium transformation in List I with its synthetic utility in List II:",
        pairs=[
            (
                "Gomberg-Bachmann reaction: arenediazonium salt treated with aqueous NaOH in a biphasic mixture with benzene",
                "IV",
                "Unsymmetrical biaryl synthesis (Ph-Ar) via generation and addition of neutral aryl radicals",
                "Base converts the diazonium salt to an unstable diazoanhydride that homolytically cleaves to generate neutral aryl radicals (Ar.); the radical attacks benzene, and oxidation of the cyclohexadienyl radical gives biaryls"
            ),
            (
                "Meerwein arylation: arenediazonium chloride reacted with methyl acrylate in the presence of CuCl2",
                "III",
                "Regioselective beta-arylation of activated alkenes yielding methyl 3-arylprop-2-enoate derivatives",
                "Copper(I) generated in situ reduces the diazonium salt to an aryl radical, which adds to the terminal double bond of the conjugated alkene; capture by Cu(II)Cl2 delivers the chlorinated adduct or elimination product"
            ),
            (
                "Pschorr cyclization: copper-catalyzed decomposition of diazotized 2-aminostilbene derivatives",
                "II",
                "Intramolecular radical annulation to synthesize phenanthrene and related polycyclic aromatic hydrocarbons",
                "Diazotization of the amino group followed by copper-catalyzed homolytic extrusion of N2 generates a localized aryl radical that attacks the adjacent aromatic ring intramolecularly, forming phenanthrene derivatives"
            ),
            (
                "Thermal decomposition of dry arenediazonium tetrafluoroborates in non-nucleophilic solvent",
                "I",
                "Heterolytic generation of transient, highly reactive phenyl cation (C6H5+) intermediate",
                "Extrusion of N2 without single electron transfer generates a highly unstable sp-hybridized phenyl cation, which abstracts fluoride from BF4- in the classic Balz-Schiemann fluorination"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_059 (Advanced, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_059",
        topic="Amines",
        difficulty="advanced",
        lead="Match the nitrogen heterocycle in List I with its distinctive basicity and aromatic reactivity in List II:",
        pairs=[
            (
                "Pyridine (C5H5N, pKb = 8.75)",
                "III",
                "Lone pair occupies an sp2 hybrid orbital orthogonal to the pi-system; behaves as a moderate base and nucleophile",
                "Pyridine's lone pair does not contribute to the 6 pi-electron aromatic ring, residing in an sp2 hybrid orbital outside the ring; protonation does not disrupt aromatic stabilization"
            ),
            (
                "Pyrrole (C4H5N, pKb = 13.6)",
                "I",
                "Extremely weak base: nitrogen lone pair is an essential part of the 6 pi aromatic sextet",
                "The unshared pair of electrons on pyrrole nitrogen resides in a 2p orbital and is required to fulfill the 4n+2 Huckel rule; protonation disrupts the aromaticity of the ring and is highly disfavored"
            ),
            (
                "Piperidine (C5H11N, pKb = 2.88)",
                "IV",
                "Fully saturated cyclic secondary amine: lone pair in sp3 orbital exhibits strong aliphatic basicity",
                "Piperidine has no aromatic delocalization; its lone pair resides in a localized sp3 hybrid orbital, making it far more basic than pyridine and comparable to open-chain secondary aliphatic amines"
            ),
            (
                "Chichibabin amination of pyridine: heating pyridine with sodamide (NaNH2) at 100 °C",
                "II",
                "Formation of 2-aminopyridine via nucleophilic aromatic addition-elimination (SNAr) on the electron-deficient ring",
                "The ring nitrogens strongly withdraw electron density, rendering the alpha-positions (C2 and C6) electrophilic; amide ion (NH2-) attacks C2 to form a Meisenheimer-type complex, expelling hydride (as H2 gas)"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_060 (Advanced, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_060",
        topic="Amines",
        difficulty="advanced",
        lead="Match the polyfunctional amine synthesis or pharmaceutical strategy in List I with its synthetic sequence in List II:",
        pairs=[
            (
                "Synthesis of benzocaine (ethyl 4-aminobenzoate) starting from toluene",
                "I",
                "Nitration to 4-nitrotoluene -> KMnO4 oxidation to 4-nitrobenzoic acid -> esterification with EtOH -> Fe/HCl reduction to amine",
                "Nitration of toluene gives 4-nitrotoluene; harsh oxidation converts the methyl group to carboxylic acid; Fischer esterification with ethanol yields ethyl 4-nitrobenzoate, which is selectively reduced to benzocaine"
            ),
            (
                "Synthesis of sulfanilamide (antibacterial) starting from acetanilide",
                "IV",
                "Chlorosulfonation with ClSO3H -> reaction with NH3 -> hydrolytic deprotection of acetyl protecting group",
                "Chlorosulfonation installs the sulfonyl chloride group at the para position of acetanilide; treatment with ammonia forms the sulfonamide, and acid hydrolysis removes the acetyl protecting group to release the free aromatic amine"
            ),
            (
                "Synthesis of alpha-amino acids via phthalimidomalonic ester synthesis",
                "II",
                "Potassium phthalimide + diethyl bromomalonate -> alkylation with R-X -> acid-catalyzed hydrolysis and decarboxylation",
                "Phthalimide displaces bromide from diethyl bromomalonate; base generates an active methine carbanion that is alkylated by R-X; harsh acid hydrolysis cleaves the phthaloyl and ester groups, followed by decarboxylation to give racemic alpha-amino acids"
            ),
            (
                "Pictet-Spengler synthesis of tetrahydroisoquinolines",
                "III",
                "Condensation of beta-arylethylamine with an aldehyde in acid -> iminium ion -> intramolecular electrophilic cyclization",
                "A 2-phenylethylamine condenses with an aldehyde under acidic conditions to generate an iminium cation; the aromatic ring executes an intramolecular electrophilic attack on the iminium carbon, forming the isoquinoline ring"
            ),
        ],
        correct_choice="D"
    ))

    return qs
