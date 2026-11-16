from builder import make_matrix_q

def get_bio_questions():
    qs = []

    # -------------------------------------------------------------------------
    # chem_org2_061 (Beginner, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_061",
        topic="Biomolecules",
        difficulty="beginner",
        lead="Match the carbohydrate in List I with its constituent monomeric units and glycosidic linkage in List II:",
        pairs=[
            (
                "Maltose (malt sugar)",
                "II",
                "Two alpha-D-glucopyranose units linked via an alpha-(1->4) glycosidic bond",
                "Maltose is a reducing disaccharide produced by starch hydrolysis, consisting of two alpha-D-glucose molecules where C1 of one unit is joined to C4 of the second unit"
            ),
            (
                "Sucrose (table / cane sugar)",
                "IV",
                "alpha-D-glucopyranose and beta-D-fructofuranose linked via an alpha,beta-(1->2) glycosidic bond",
                "Sucrose is a non-reducing disaccharide where the hemiacetal hydroxyl of C1 of alpha-D-glucose is linked directly to the hemiketal hydroxyl of C2 of beta-D-fructose, locking both anomeric centers"
            ),
            (
                "Lactose (milk sugar)",
                "I",
                "beta-D-galactopyranose and beta-D-glucopyranose linked via a beta-(1->4) glycosidic bond",
                "Lactose is a reducing disaccharide found in milk; C1 of beta-D-galactose forms a glycosidic bond with C4 of beta-D-glucose, leaving glucose C1 free to mutarotate and reduce Fehling's solution"
            ),
            (
                "Cellulose",
                "III",
                "Linear unbranched polymer of beta-D-glucopyranose units linked via beta-(1->4) glycosidic bonds",
                "Cellulose is the primary structural component of plant cell walls; extended linear chains of beta-D-glucose with beta-(1->4) linkages pack tightly via intra- and inter-chain hydrogen bonds into rigid insoluble microfibrils"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_062 (Beginner, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_062",
        topic="Biomolecules",
        difficulty="beginner",
        lead="Match the standard amino acid in List I with its side-chain characteristic / chirality in List II:",
        pairs=[
            (
                "Glycine (Gly, G)",
                "III",
                "Achiral amino acid lacking an asymmetric alpha-carbon (R = -H)",
                "Glycine is the only common proteinogenic amino acid without optical activity because its alpha-carbon is bonded to two identical hydrogen atoms"
            ),
            (
                "Alanine (Ala, A)",
                "I",
                "Non-polar aliphatic neutral amino acid with a methyl side chain (R = -CH3)",
                "Alanine has a simple hydrocarbon methyl side chain, imparting hydrophobic characteristics to protein interiors and possessing a single stereocenter (L-configuration in nature)"
            ),
            (
                "Lysine (Lys, K)",
                "IV",
                "Basic amino acid possessing an additional terminal epsilon-amino group (R = -(CH2)4-NH2)",
                "Lysine contains an aliphatic four-carbon chain terminating in a primary amino group (pKa ~10.5), which is positively charged at physiological pH (7.4)"
            ),
            (
                "Glutamic acid (Glu, E)",
                "II",
                "Acidic amino acid possessing an additional gamma-carboxyl group (R = -(CH2)2-COOH)",
                "Glutamic acid has an ionizable carboxyl group on its side chain (pKa ~4.25), existing predominantly as a negatively charged glutamate carboxylate anion at physiological pH"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_063 (Beginner, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_063",
        topic="Biomolecules",
        difficulty="beginner",
        lead="Match the nucleic acid component in List I with its structural definition in List II:",
        pairs=[
            (
                "Adenine and Guanine",
                "IV",
                "Purine nitrogenous bases possessing fused 9-membered bicyclic heteroaromatic rings",
                "Adenine (6-aminopurine) and guanine (2-amino-6-oxypurine) are purine bases with fused imidazole and pyrimidine rings found in both DNA and RNA"
            ),
            (
                "Cytosine, Thymine, and Uracil",
                "II",
                "Pyrimidine nitrogenous bases possessing 6-membered monocyclic heteroaromatic rings",
                "Cytosine is present in both DNA and RNA, thymine is exclusive to DNA (5-methyluracil), and uracil replaces thymine in RNA; all three share a 6-membered pyrimidine framework"
            ),
            (
                "D-Ribose versus 2-Deoxy-D-ribose",
                "I",
                "Aldopentose sugars differing by the absence of a hydroxyl group at the C-2' position in deoxyribose",
                "RNA contains beta-D-ribofuranose with an -OH at C-2', whereas DNA contains beta-D-2'-deoxyribofuranose where C-2' is a methylene (-CH2-) group, increasing resistance to alkaline hydrolysis"
            ),
            (
                "Nucleoside versus Nucleotide",
                "III",
                "A nucleoside is a base-sugar adduct; a nucleotide is a nucleoside phosphorylated at the C-5' hydroxyl",
                "Nucleosides consist of a purine or pyrimidine base attached to C-1' of a pentose sugar via a beta-glycosidic bond; esterification with phosphoric acid at C-5' converts it into a nucleotide"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_064 (Beginner, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_064",
        topic="Biomolecules",
        difficulty="beginner",
        lead="Match the vitamin in List I with its chemical name and primary deficiency disease in List II:",
        pairs=[
            (
                "Vitamin A",
                "I",
                "Retinol / axerophthol; deficiency causes night blindness (nyctalopia) and xerophthalmia",
                "Vitamin A is a fat-soluble isoprenoid alcohol essential for rhodopsin synthesis in retinal rod cells; its deficiency leads to impaired dark adaptation and keratinization of the cornea"
            ),
            (
                "Vitamin B1",
                "III",
                "Thiamine; deficiency impairs pyruvate dehydrogenase causing beriberi and nerve damage",
                "Thiamine is converted to thiamine pyrophosphate (TPP), an essential coenzyme for oxidative decarboxylation of alpha-keto acids; its deficiency leads to beriberi and Wernicke-Korsakoff syndrome"
            ),
            (
                "Vitamin C",
                "IV",
                "Ascorbic acid; deficiency impairs collagen prolyl/lysyl hydroxylation causing scurvy",
                "Ascorbic acid acts as a water-soluble reducing agent maintaining Fe2+ in prolyl hydroxylase; without it, defective collagen synthesis leads to bleeding gums, fragile capillaries, and scurvy"
            ),
            (
                "Vitamin D",
                "II",
                "Cholecalciferol / ergocalciferol; deficiency impairs intestinal calcium absorption causing rickets and osteomalacia",
                "Vitamin D is converted to 1,25-dihydroxycholecalciferol (calcitriol), which promotes calcium and phosphate absorption in the gut; deficiency causes defective bone mineralization (rickets in children)"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_065 (Intermediate, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_065",
        topic="Biomolecules",
        difficulty="intermediate",
        lead="Match the chemical transformation of D-glucose in List I with its definitive structural proof in List II:",
        pairs=[
            (
                "Prolonged heating of D-glucose with concentrated hydroiodic acid (HI) and red phosphorus at 100 °C",
                "II",
                "Formation of n-hexane, proving that all six carbon atoms are linked in an unbranched continuous chain",
                "Vigorous reduction by HI/P reduces all carbonyl and hydroxyl groups to methylene/methyl groups, yielding unbranched n-hexane and confirming the straight-chain carbon skeleton of glucose"
            ),
            (
                "Mild oxidation of D-glucose with bromine water (Br2 / H2O)",
                "IV",
                "Selective oxidation of the formyl group to carboxyl yielding gluconic acid (C6H12O7)",
                "Bromine water is a mild oxidant that oxidizes aldehydes without affecting secondary or primary alcohol groups, demonstrating that the carbonyl group in glucose is an aldehyde (aldose)"
            ),
            (
                "Strong oxidation of D-glucose with warm concentrated nitric acid (HNO3)",
                "I",
                "Oxidation of both C-1 formyl and C-6 primary alcohol groups yielding dicarboxylic saccharic (glucaric) acid",
                "Nitric acid oxidizes both the terminal -CHO and the terminal -CH2OH group to -COOH, proving that glucose contains a primary alcohol at the opposite end of the chain"
            ),
            (
                "Acetylation of D-glucose with excess acetic anhydride in pyridine",
                "III",
                "Formation of glucose pentaacetate, proving the presence of five independent hydroxyl groups",
                "Because stable organic molecules rarely have more than one hydroxyl group on a single carbon atom, pentaacetate formation proves that each of the five carbons C2-C6 bears one hydroxyl group"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_066 (Intermediate, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_066",
        topic="Biomolecules",
        difficulty="intermediate",
        lead="Match the cyclic structure feature / anomeric behavior of D-glucose in List I with its physical description in List II:",
        pairs=[
            (
                "alpha-D-Glucopyranose crystalline anomer",
                "IV",
                "C-1 hydroxyl group is axial (trans to C5-CH2OH in Haworth projection); specific rotation [alpha]D = +112°",
                "In alpha-D-glucopyranose, the anomeric hydroxyl group at C-1 occupies an axial position in the standard 4C1 chair conformation, with a melting point of 146 °C and initial rotation of +112°"
            ),
            (
                "beta-D-Glucopyranose crystalline anomer",
                "III",
                "C-1 hydroxyl group is equatorial (cis to C5-CH2OH); specific rotation [alpha]D = +18.7°",
                "In beta-D-glucopyranose, all non-hydrogen substituents including the C-1 hydroxyl occupy equatorial positions, minimizing steric strain and rendering beta-D-glucose thermodynamically more stable (~64% at equilibrium)"
            ),
            (
                "Mutarotation phenomenon of glucose in aqueous solution",
                "II",
                "Spontaneous equilibration of optical rotation from +112° or +18.7° to +52.7° via the open-chain aldehyde",
                "Dissolution of either pure anomer in water results in ring-chain tautomerism catalyzed by acid or base; reversible opening to the free aldehyde allows re-closure to an equilibrium mixture (36% alpha, 64% beta, <0.02% open-chain)"
            ),
            (
                "Reaction of D-glucose with methanol in the presence of dry HCl gas",
                "I",
                "Formation of methyl alpha- and beta-D-glucopyranosides (stable acetals that do not undergo mutarotation)",
                "Methanol reacts with the hemiacetal hydroxyl at C-1 to form full acetals (glycosides); lacking a free hemiacetal group, methyl glucosides cannot open into an aldehyde, do not reduce Fehling's solution, and do not mutarotate"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_067 (Intermediate, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_067",
        topic="Biomolecules",
        difficulty="intermediate",
        lead="Match the polysaccharide or sugar linkage in List I with its reducing property and architecture in List II:",
        pairs=[
            (
                "Sucrose (alpha-D-glucopyranosyl-(1->2)-beta-D-fructofuranoside)",
                "III",
                "Non-reducing sugar: both anomeric carbons (C1 of Glc and C2 of Fru) are locked in the glycosidic bond",
                "Because both potential carbonyl carbons are engaged in the acetal/ketal bond, sucrose cannot equilibrate with an open-chain form, giving negative Tollens', Fehling's, and Benedict's tests"
            ),
            (
                "Maltose (alpha-D-glucopyranosyl-(1->4)-D-glucopyranose)",
                "I",
                "Reducing sugar: retains one free hemiacetal hydroxyl group at C-1 of the second glucose unit",
                "The second glucose residue has an unbonded anomeric center that can undergo ring-opening to expose a free aldehyde group, mutarotating and reducing alkaline copper(II) reagents"
            ),
            (
                "Amylose component of starch (15-20% of starch)",
                "IV",
                "Water-soluble linear polymer of alpha-D-glucose linked exclusively by alpha-(1->4) bonds, forming blue iodine helices",
                "Amylose adopts a continuous helical coil with about 6 glucose residues per turn; iodine molecules slip into the interior core of the helix to produce an intense deep-blue inclusion complex"
            ),
            (
                "Amylopectin component of starch (80-85% of starch)",
                "II",
                "Water-insoluble branched polymer with alpha-(1->4) linear chains and alpha-(1->6) branch points every 24-30 residues",
                "Branching by alpha-(1->6) linkages prevents tight helical packing, yielding reddish-purple coloration with iodine and providing multiple non-reducing ends for rapid enzymatic mobilization"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_068 (Intermediate, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_068",
        topic="Biomolecules",
        difficulty="intermediate",
        lead="Match the amino acid ionic equilibrium state in List I with its electrical behavior / pI calculation in List II:",
        pairs=[
            (
                "Alanine at its isoelectric point (pI = 6.00, pK1 = 2.34, pK2 = 9.69)",
                "I",
                "Dipolar zwitterion (+H3N-CH(CH3)-COO-) with net charge zero; does not migrate in an electric field",
                "At pI = (pK1 + pK2)/2, the concentrations of cationic and anionic forms are equal; the amino acid exists predominantly as a zwitterion and exhibits minimum solubility in water"
            ),
            (
                "Alanine in strongly acidic aqueous solution (pH = 1.0)",
                "IV",
                "Fully protonated cation (+H3N-CH(CH3)-COOH) with net charge +1; migrates toward the cathode",
                "At pH well below pK1, both the carboxylate group and amino group are protonated, giving a net positive charge that causes migration toward the negative electrode"
            ),
            (
                "Lysine isoelectric point calculation (pK1 = 2.18, pK2 = 8.95, pK3(side chain) = 10.53)",
                "II",
                "pI = (pK2 + pK3) / 2 = 9.74; basic side chain requires high pH to achieve net electrical neutrality",
                "For basic amino acids with two amino groups, neutrality is achieved between the deprotonation of the alpha-ammonium and the side-chain ammonium; hence pI is the average of the two highest pKa values"
            ),
            (
                "Aspartic acid isoelectric point calculation (pK1 = 1.88, pK2(side chain) = 3.65, pK3 = 9.60)",
                "III",
                "pI = (pK1 + pK2) / 2 = 2.77; acidic side chain requires low pH to suppress carboxylate ionization",
                "For acidic amino acids with two carboxyl groups, electrical neutrality occurs between the ionization of the alpha-carboxyl and beta-carboxyl groups; hence pI is the average of the two lowest pKa values"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_069 (Intermediate, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_069",
        topic="Biomolecules",
        difficulty="intermediate",
        lead="Match the protein structural level or stabilizing force in List I with its molecular description in List II:",
        pairs=[
            (
                "Peptide bond planarity and rigidity",
                "II",
                "Partial double-bond character (~40%) due to C-N resonance prevents rotation, keeping 6 atoms coplanar",
                "Delocalization of the nitrogen lone pair into the carbonyl pi system shortens the C-N bond (1.32 A vs normal 1.47 A) and restricts rotation, constraining the peptide group to trans-planar geometry"
            ),
            (
                "alpha-Helix secondary structure",
                "IV",
                "Right-handed coil stabilized by intrachain hydrogen bonds between C=O of residue i and N-H of residue i+4",
                "Each turn of the alpha-helix contains 3.6 amino acid residues with a pitch of 5.4 A; all peptide C=O and N-H groups are hydrogen-bonded parallel to the helical axis"
            ),
            (
                "beta-Pleated sheet secondary structure",
                "I",
                "Extended polypeptide strands arranged side-by-side stabilized by interchain hydrogen bonds",
                "Adjacent polypeptide chains run parallel or antiparallel, forming a pleated sheet where side chains alternate above and below the plane with hydrogen bonds perpendicular to the chain direction"
            ),
            (
                "Tertiary structure stabilization",
                "III",
                "3D folding driven by hydrophobic interactions, disulfide (-S-S-) bridges, salt bridges, and van der Waals forces",
                "The overall 3D conformation of a globular protein is stabilized by burying hydrophobic side chains in the core, accompanied by covalent disulfide bonds between cysteine residues and ionic salt bridges"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_070 (Intermediate, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_070",
        topic="Biomolecules",
        difficulty="intermediate",
        lead="Match the biochemical test for proteins/amino acids in List I with its specific reagent and observation in List II:",
        pairs=[
            (
                "Biuret test for peptide linkages",
                "IV",
                "Alkaline CuSO4 solution; forms a violet-purple coordination complex with at least two peptide bonds",
                "Cu2+ ions coordinate with the nitrogen atoms of four adjacent peptide linkages in alkaline medium to form a characteristic violet-colored chelate complex; dipeptides do not give a positive test"
            ),
            (
                "Ninhydrin test for alpha-amino acids",
                "III",
                "Triketohydrindene hydrate; produces an intense blue-violet Ruhemann's purple complex and CO2",
                "Ninhydrin oxidatively decarboxylates alpha-amino acids to aldehydes, releasing NH3 which condenses with reduced and oxidized ninhydrin molecules to yield the colored chromophore Ruhemann's purple"
            ),
            (
                "Xanthoproteic test for aromatic amino acids",
                "II",
                "Concentrated HNO3 followed by aqueous alkali; yellow color turning bright orange",
                "Nitration of activated benzene rings (as in tyrosine and tryptophan) yields yellow nitro derivatives; addition of alkali converts the phenolic OH of nitrotyrosine to phenoxide, deepening the color to orange"
            ),
            (
                "Millon's test for phenolic amino acids",
                "I",
                "Mercuric nitrate and nitrite in nitric acid; forms a white precipitate turning brick-red upon heating with tyrosine",
                "Millon's reagent reacts specifically with the phenolic ring of tyrosine via nitrosation followed by chelation of mercuric ions, producing a characteristic brick-red precipitate"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_071 (Intermediate, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_071",
        topic="Biomolecules",
        difficulty="intermediate",
        lead="Match the cane sugar inversion parameter in List I with its precise quantitative/mechanistic value in List II:",
        pairs=[
            (
                "Optical rotation of pure sucrose before hydrolysis",
                "III",
                "Dextrorotatory with specific rotation [alpha]D = +66.5°",
                "Cane sugar is naturally dextrorotatory, rotating plane-polarized sodium D-light to the right with [alpha]D = +66.5° in aqueous solution"
            ),
            (
                "Optical rotation of D-(+)-glucose and D-(-)-fructose produced upon complete hydrolysis",
                "I",
                "D-Glucose: [alpha]D = +52.7°; D-Fructose: [alpha]D = -92.4°",
                "Hydrolysis of sucrose yields equimolar amounts of D-glucose and D-fructose; fructose exhibits a much stronger negative optical rotation than the positive rotation of glucose"
            ),
            (
                "Net optical rotation of the resulting equimolar hydrolysate ('invert sugar')",
                "IV",
                "Levorotatory with net specific rotation [alpha]D = -19.85°",
                "The algebraic average of +52.7° and -92.4° is (-39.7° / 2) = -19.85°; the inversion from positive (+66.5°) to negative (-19.85°) rotation gives rise to the term 'inversion of sugar'"
            ),
            (
                "Enzymatic catalyst that specifically cleaves the glycosidic bond in sucrose",
                "II",
                "Invertase (sucrase / beta-fructofuranosidase)",
                "Invertase catalyzes the hydrolytic cleavage of the beta-fructofuranoside bond in sucrose without affecting alpha-glucoside linkages of maltose, producing honey-like invert sugar"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_072 (Intermediate, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_072",
        topic="Biomolecules",
        difficulty="intermediate",
        lead="Match the nucleic acid structural feature in List I with its molecular description in List II:",
        pairs=[
            (
                "Watson-Crick Adenine-Thymine (A-T) base pair",
                "I",
                "Two complementary interstrand hydrogen bonds: one between N1 and N3-H, one between C6-NH2 and C4=O",
                "In B-DNA, adenine forms exactly two hydrogen bonds with thymine, maintaining an identical glycosidic distance (~10.85 A) as the G-C pair across the double helix"
            ),
            (
                "Watson-Crick Guanine-Cytosine (G-C) base pair",
                "IV",
                "Three complementary interstrand hydrogen bonds, conferring higher thermal stability (Tm) to the duplex",
                "Guanine pairs with cytosine through three hydrogen bonds; DNA molecules with higher G-C content possess significantly higher melting temperatures (Tm) due to greater base-pairing enthalpy"
            ),
            (
                "Phosphodiester linkage in polynucleotide backbones",
                "II",
                "Ester bond connecting the 3'-OH of one pentose sugar to the 5'-phosphate of the next pentose",
                "The repeating backbone of alternating pentose sugars and phosphate groups imparts a 5' to 3' directional polarity to the nucleic acid chain, with negative charges along the exterior"
            ),
            (
                "RNA specific structural distinction from DNA",
                "III",
                "Contains uracil instead of thymine and ribose (with 2'-OH) instead of 2'-deoxyribose",
                "The 2'-hydroxyl group in ribose makes RNA chemically less stable and susceptible to alkaline hydrolysis, while uracil lacks the C5 methyl group present in thymine"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_073 (Advanced, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_073",
        topic="Biomolecules",
        difficulty="advanced",
        lead="Match the carbohydrate epimerization / osazone mechanism in List I with its mechanistic explanation in List II:",
        pairs=[
            (
                "Identical phenylosazone formation from D-glucose, D-mannose, and D-fructose",
                "II",
                "All three hexoses share identical stereochemical configurations at C-3, C-4, and C-5",
                "Osazone formation destroys the chiral center at C-2 and converts C-1 into a hydrazone; because D-glucose, D-mannose, and D-fructose differ only at C-1 and C-2, they yield the exact same crystalline glucosazone"
            ),
            (
                "Stoichiometry and role of phenylhydrazine in osazone formation",
                "IV",
                "Three moles of PhNHNH2 consumed per mole of aldose: 2 moles form hydrazones, 1 mole oxidizes C-2 to carbonyl",
                "The first equivalent forms a phenylhydrazone; the second oxidizes the adjacent C-2 carbinol to a ketone (being itself reduced to aniline and ammonia); the third equivalent condenses with the newly formed carbonyl"
            ),
            (
                "C-2 epimer relationship between D-glucose and D-mannose",
                "I",
                "Diastereomers differing only in spatial configuration at the alpha-carbon (C-2)",
                "D-Glucose and D-mannose have opposite configurations exclusively at C-2 (-OH on right in glucose, on left in mannose in Fischer projection), making them classic epimers"
            ),
            (
                "Lobry de Bruyn-Alberda van Ekenstein rearrangement of D-glucose in alkaline medium",
                "III",
                "Reversible enolization via an enediol intermediate interconverting D-glucose, D-mannose, and D-fructose",
                "Base abstracts the alpha-proton at C-2 to generate a planar 1,2-enediolate intermediate; reprotonation from either face of the double bond produces an equilibrium mixture of glucose, mannose, and fructose"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_074 (Advanced, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_074",
        topic="Biomolecules",
        difficulty="advanced",
        lead="Match the sugar degradation / chain-extension reaction in List I with its key reagent and pathway in List II:",
        pairs=[
            (
                "Kiliani-Fischer synthesis: chain elongation of an aldopentose to aldohexoses",
                "IV",
                "Addition of HCN to form diastereomeric cyanohydrins followed by hydrolysis to lactones and Na-Hg reduction",
                "Nucleophilic addition of cyanide creates a new stereocenter at C-2, yielding two diastereomeric cyanohydrins; hydrolysis to carboxylic acids, lactonization, and reduction with sodium amalgam gives two epimeric aldohexoses"
            ),
            (
                "Ruff degradation: chain shortening of an aldohexose to an aldopentose",
                "III",
                "Bromine water oxidation to aldonobarium/calcium salt followed by H2O2 / Fe3+ (Fenton's reagent) decarboxylation",
                "Aldose is oxidized to calcium aldonate; treatment with hydrogen peroxide and ferric acetate oxidatively cleaves the C1-C2 bond with loss of CO2, converting C-2 into the new aldehyde group"
            ),
            (
                "Wohl degradation: chain shortening via aldoxime dehydration",
                "II",
                "Reaction with NH2OH followed by Ac2O dehydration to cyanohydrin acetate and basic cleavage of HCN",
                "The aldose oxime is dehydrated by acetic anhydride to an acetylated cyanohydrin; treatment with sodium methoxide removes acetyl groups and expels cyanide ion, furnishing the one-carbon shortened aldose"
            ),
            (
                "Periodic acid (HIO4) oxidative cleavage of 1 mole of open-chain D-glucose",
                "I",
                "Consumes 5 moles of HIO4 to produce 5 moles of formic acid (HCOOH) and 1 mole of formaldehyde (HCHO)",
                "Periodic acid oxidatively cleaves all five C-C single bonds between vicinal diol / alpha-hydroxy carbonyl carbons: the four secondary alcohol carbons and C-1 aldehyde yield 5 HCOOH, while the terminal primary alcohol yields 1 HCHO"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_075 (Advanced, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_075",
        topic="Biomolecules",
        difficulty="advanced",
        lead="Match the conformational / anomeric stereoelectronic effect in pyranoses in List I with its physical basis in List II:",
        pairs=[
            (
                "Ground-state conformation of beta-D-glucopyranose in aqueous solution",
                "III",
                "All non-hydrogen substituents (-OH and -CH2OH) occupy stable equatorial orientations in the 4C1 chair",
                "Equatorial placement eliminates all 1,3-diaxial interactions and gauche steric repulsions, making beta-D-glucopyranose the thermodynamically most stable aldohexose isomer in nature"
            ),
            (
                "The anomeric effect in glycosyl halides and pyranosides in non-polar solvents",
                "I",
                "Preference of electronegative C-1 substituents for the axial position due to n -> sigma* hyperconjugation",
                "The ring oxygen lone pair (n) delocalizes into the antiperiplanar sigma* C1-X antibonding orbital; this stabilizing orbital interaction occurs only when the electronegative substituent X is in the axial position"
            ),
            (
                "1,3-Diaxial steric interactions in alpha-D-glucopyranose",
                "IV",
                "Axial C-1 hydroxyl experiences non-bonded van der Waals repulsion with axial hydrogens at C-3 and C-5",
                "In the alpha-anomer, the axial -OH at C-1 points toward the same face of the ring as axial C3-H and C5-H, creating steric strain that destabilizes it relative to the beta-anomer in water"
            ),
            (
                "Rate of acid-catalyzed hydrolysis of glycosides (pyranosides)",
                "II",
                "Protonation of exocyclic oxygen followed by rate-determining C-O cleavage to form a planar oxocarbenium ion",
                "Hydrolysis proceeds via an oxocarbenium intermediate stabilized by resonance donation from the ring oxygen; the transition state requires a half-chair conformation, sensitive to steric and stereoelectronic factors"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_076 (Advanced, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_076",
        topic="Biomolecules",
        difficulty="advanced",
        lead="Match the solid-phase peptide synthesis (SPPS) reagent/principle in List I with its functional role in List II:",
        pairs=[
            (
                "Merrifield solid-phase resin (chloromethylated cross-linked polystyrene)",
                "I",
                "Insoluble polymeric support anchoring the growing peptide chain at its C-terminus",
                "The C-terminal amino acid is covalently linked via an ester or amide bond to the insoluble resin beads, allowing excess reagents and byproducts to be removed simply by filtration and washing"
            ),
            (
                "Fluorenylmethyloxycarbonyl (Fmoc) amino protecting group",
                "IV",
                "Base-labile N-protecting group cleaved cleanly by 20% piperidine in DMF via an E1cB mechanism",
                "Piperidine abstracts the acidic fluorenyl proton (pKa ~12) to trigger beta-elimination of dibenzofulvene, deprotecting the alpha-amino group under mild non-acidic conditions"
            ),
            (
                "Dicyclohexylcarbodiimide (DCC) coupling reagent",
                "II",
                "Activates the free carboxyl group by forming a reactive O-acylisourea intermediate for amide bond formation",
                "DCC activates the incoming amino acid's -COOH group toward nucleophilic attack by the resin-bound free alpha-amino group, precipitating insoluble dicyclohexylurea (DCU) as byproduct"
            ),
            (
                "1-Hydroxybenzotriazole (HOBt) or Oxyma additive in peptide coupling",
                "III",
                "Converts the O-acylisourea to an active OBt ester, suppressing oxazolone formation and racemization",
                "HOBt reacts rapidly with the reactive O-acylisourea before intramolecular cyclization to an oxazolone can occur, preserving the stereochemical optical purity (chirality) of the amino acid residue"
            ),
        ],
        correct_choice="D"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_077 (Advanced, Choice A)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_077",
        topic="Biomolecules",
        difficulty="advanced",
        lead="Match the protein denaturation / folding thermodynamic property in List I with its molecular basis in List II:",
        pairs=[
            (
                "Maintenance of primary structure during thermal or chemical denaturation",
                "II",
                "Covalent peptide (amide) bonds have high bond energies (~400 kJ/mol) that resist physical unfolding",
                "Denaturation disrupts secondary, tertiary, and quaternary structures held by weak non-covalent interactions (hydrogen bonds, salt bridges, hydrophobic forces), leaving the covalent primary sequence completely intact"
            ),
            (
                "Conformational entropy change (Delta S_conf) upon protein unfolding",
                "IV",
                "Large positive entropy change driven by dramatic increase in degrees of freedom of the polypeptide chain",
                "Transition from a single ordered native 3D conformation to millions of disordered random-coil states produces a large positive Delta S_conf, favoring unfolding at elevated temperatures (T * Delta S term)"
            ),
            (
                "Denaturing mechanism of concentrated guanidinium chloride or 8 M urea",
                "I",
                "Disrupts water structure and directly solvates peptide backbone groups and hydrophobic side chains",
                "Chaotropic agents weaken hydrophobic interactions and form competitive hydrogen bonds with the peptide backbone, stabilizing the exposed unfolded state relative to the folded native state"
            ),
            (
                "Heat coagulation of ovalbumin (egg white)",
                "III",
                "Irreversible hydrophobic aggregation and intermolecular disulfide cross-linking upon unfolding",
                "Thermal energy unfolds the protein, exposing buried hydrophobic residues; to minimize contact with water, the exposed hydrophobic surfaces aggregate rapidly, forming an insoluble white cross-linked protein gel"
            ),
        ],
        correct_choice="A"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_078 (Advanced, Choice B)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_078",
        topic="Biomolecules",
        difficulty="advanced",
        lead="Match the enzyme catalytic mechanism / inhibition type in List I with its mechanistic signature in List II:",
        pairs=[
            (
                "Chymotrypsin catalytic triad (Ser195-His57-Asp102) charge-relay network",
                "IV",
                "His57 deprotonates Ser195 to generate a potent alkoxide nucleophile that attacks the substrate peptide carbonyl",
                "Asp102 polarizes His57 through a low-barrier hydrogen bond, enabling His57 to act as a general base that extracts the proton from Ser195-OH, forming a covalent tetrahedral acyl-enzyme intermediate"
            ),
            (
                "Michaelis-Menten constant (Km)",
                "III",
                "Substrate concentration [S] at which initial reaction velocity is exactly half of Vmax (Vmax / 2)",
                "Km = (k-1 + k2) / k1; a lower Km value signifies higher affinity of the enzyme for its substrate under Briggs-Haldane steady-state assumptions"
            ),
            (
                "Competitive enzyme inhibition",
                "II",
                "Inhibitor competes with substrate for the active site: apparent Km increases while Vmax remains unchanged",
                "The competitive inhibitor binds reversibly to the free enzyme (E); high substrate concentrations outcompete the inhibitor, reaching the same maximal velocity (Vmax) but requiring higher [S]"
            ),
            (
                "Non-competitive enzyme inhibition",
                "I",
                "Inhibitor binds to an allosteric site equally on E and ES: Vmax decreases while Km remains unaltered",
                "The inhibitor reduces the turnover number (kcat) without altering substrate binding affinity; because substrate cannot displace the inhibitor, maximal rate decreases while Km is unaffected"
            ),
        ],
        correct_choice="B"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_079 (Advanced, Choice C)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_079",
        topic="Biomolecules",
        difficulty="advanced",
        lead="Match the nucleic acid biophysical property in List I with its underlying molecular explanation in List II:",
        pairs=[
            (
                "Major and minor grooves in B-DNA double helix",
                "III",
                "Asymmetrical attachment of base pairs via glycosidic bonds at an angle (~120°/240°) relative to the helix axis",
                "Because base pairs do not attach directly opposite each other across the diameter, the helical surface displays alternating wide, deep major grooves and narrow, shallow minor grooves for protein recognition"
            ),
            (
                "Base stacking interactions in DNA duplex stability",
                "I",
                "Dominant thermodynamic driving force: vertical van der Waals and hydrophobic pi-pi interactions between aromatic rings",
                "While Watson-Crick hydrogen bonding provides base-pairing specificity, the overwhelming thermodynamic stability of the double helix arises from hydrophobic exclusion and pi-pi stacking of adjacent planar aromatic bases"
            ),
            (
                "Hyperchromic effect observed upon DNA thermal melting",
                "IV",
                "30-40% increase in UV absorbance at 260 nm as base stacking is lost upon duplex separation into single strands",
                "In native double-stranded DNA, pi-electron interactions between closely stacked base rings suppress UV light absorption; thermal denaturation into disordered random coils un-shields the chromophores, increasing absorbance"
            ),
            (
                "Alkaline hydrolysis susceptibility of RNA versus chemical stability of DNA",
                "II",
                "RNA has a 2'-OH that executes intramolecular nucleophilic attack on the 3'-phosphodiester bond via a cyclic phosphate",
                "Hydroxide deprotonates the 2'-OH of ribose in RNA, forming an alkoxide that attacks the adjacent phosphodiester to yield a cyclic 2',3'-monophosphate; DNA lacks the 2'-OH and is completely resistant to alkaline cleavage"
            ),
        ],
        correct_choice="C"
    ))

    # -------------------------------------------------------------------------
    # chem_org2_080 (Advanced, Choice D)
    # -------------------------------------------------------------------------
    qs.append(make_matrix_q(
        qid="chem_org2_080",
        topic="Biomolecules",
        difficulty="advanced",
        lead="Match the metabolic cofactor or bioenergetic molecule in List I with its chemical driving force in List II:",
        pairs=[
            (
                "Nicotinamide adenine dinucleotide (NAD+ / NADH) redox mechanism",
                "I",
                "Reversible stereospecific transfer of a hydride ion (:H-) to the C-4 position of the pyridinium nicotinamide ring",
                "Enzymes catalyze hydride transfer from substrate to C-4 of NAD+, reducing the electron-deficient aromatic pyridinium ring to a neutral 1,4-dihydropyridine (NADH) with loss of aromaticity"
            ),
            (
                "Acetyl-Coenzyme A (Acetyl-CoA) high acyl-group transfer potential",
                "IV",
                "Thioester bond (-CO-S-) lacks significant resonance stabilization compared to oxygen esters, raising free energy",
                "Poor 2p-3p orbital overlap between carbon and sulfur prevents resonance donation of sulfur's lone pair into the carbonyl, making thioesters thermodynamically unstable and chemically active acyl donors (Delta G°' = -31.5 kJ/mol)"
            ),
            (
                "Adenosine triphosphate (ATP) phosphoanhydride bond hydrolysis thermodynamics",
                "II",
                "Relief of electrostatic repulsion between clustered negative charges and superior resonance stabilization of Pi",
                "At physiological pH, ATP carries four closely clustered negative charges; hydrolysis to ADP and inorganic phosphate relieves charge repulsion and generates resonance-stabilized orthophosphate (Delta G°' = -30.5 kJ/mol)"
            ),
            (
                "Self-assembly of phospholipids into lipid bilayers and liposomes in aqueous solution",
                "III",
                "Hydrophobic effect: non-polar hydrocarbon tails cluster together to maximize conformational entropy of surrounding water",
                "Amphipathic glycerophospholipids contain hydrophilic polar head groups and hydrophobic dual fatty acyl chains; spontaneous bilayer formation minimizes ordered water clathrates around hydrocarbon tails"
            ),
        ],
        correct_choice="D"
    ))

    return qs
