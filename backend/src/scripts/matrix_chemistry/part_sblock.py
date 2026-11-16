from builder import make_matrix_q

def get_sblock_questions():
    qs = []
    t = "s-Block Elements"
    prefix = "chem_ioc1"

    # =========================================================================
    # BEGINNER (4 questions: 061 - 064)
    # =========================================================================

    # 061 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_061", t, "beginner",
        "Match the s-block elements in List I with their characteristic flame emission colors in List II:",
        [
            ("Lithium (Li)", "III",
             "Crimson red flame (characteristic emission at ~670.8 nm)",
             "Thermal energy of the Bunsen flame excites the 2s valence electron of lithium to higher energy levels; upon returning to ground state, it emits light in the red region of the spectrum at 670.8 nm"),
            ("Sodium (Na)", "I",
             "Golden yellow flame (characteristic emission at ~589 nm, Na D-line)",
             "Sodium atoms emit intensely at the famous 589.0 nm and 589.6 nm doublet lines (3p -> 3s transition), imparting an intense golden yellow color to the flame"),
            ("Potassium (K)", "IV",
             "Violet / Lilac flame (characteristic emission at ~766 nm and 404 nm)",
             "Potassium imparts a pale violet or lilac color to the flame, which can be viewed through cobalt blue glass to filter out yellow sodium impurities"),
            ("Calcium (Ca)", "II",
             "Brick red flame (characteristic emission at ~622 nm)",
             "Calcium salts volatilized in the flame produce an emission spectrum with prominent bands in the orange-red region (~622 nm), resulting in a distinctive brick red flame")
        ],
        "B"
    ))

    # 062 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_062", t, "beginner",
        "Match the alkaline earth metals in List I with their flame test responses and spectral behaviors in List II:",
        [
            ("Strontium (Sr)", "IV",
             "Crimson / Scarlet red flame (prominent emission at ~606 nm and 668 nm)",
             "Strontium compounds impart a brilliant crimson/scarlet red coloration to the Bunsen flame, used extensively in fireworks and emergency marine flares"),
            ("Barium (Ba)", "II",
             "Apple green flame (prominent emission at ~524 nm and 553 nm)",
             "Barium salts volatilized in the flame produce characteristic apple green emission lines corresponding to transitions in the green portion of the visible spectrum"),
            ("Beryllium (Be)", "I",
             "No characteristic flame color; valence electrons are too tightly held to be excited by flame temperatures",
             "Beryllium has a very small atomic size and exceptionally high ionization energy. The thermal energy of a laboratory Bunsen flame is insufficient to excite its valence electrons into higher states"),
            ("Magnesium (Mg)", "III",
             "No characteristic flame color; emitted radiation falls outside the visible spectrum (in the UV region)",
             "Because of its small size and high effective nuclear charge, electronic excitation in magnesium requires high energy, and the resulting de-excitation photons fall primarily in the ultraviolet range")
        ],
        "A"
    ))

    # 063 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_063", t, "beginner",
        "Match the alkali metals in List I with the principal oxide type formed upon combustion in excess oxygen in List II:",
        [
            ("Lithium (Li)", "II",
             "Predominantly forms monoxide (Li2O) containing the oxide ion (O^2-)",
             "Due to its tiny ionic radius, Li+ has a strong positive electrostatic field that stabilizes the small oxide ion O^2- through high lattice energy, preventing further oxidation to peroxide"),
            ("Sodium (Na)", "IV",
             "Predominantly forms peroxide (Na2O2) containing the peroxide ion (O2^2-)",
             "The intermediate size of Na+ is unable to stabilize the small oxide ion as effectively, favoring formation of the peroxide ion (O2^2-) with formula Na2O2 (along with traces of Na2O)"),
            ("Potassium (K)", "I",
             "Predominantly forms superoxide (KO2) containing the paramagnetic superoxide ion (O2^-)",
             "The large K+ cation stabilizes the bulky, low charge density superoxide anion O2^- through favorable crystal lattice packing energy, forming yellow-orange KO2"),
            ("Cesium (Cs)", "III",
             "Predominantly forms superoxide (CsO2) stabilized by the large cation radius",
             "Cesium has the largest cation radius among alkali metals; it readily forms orange CsO2 because large cations are best stabilized by large polyatomic anions through high lattice enthalpy")
        ],
        "C"
    ))

    # 064 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_064", t, "beginner",
        "Match the commercial s-block compounds in List I with their chemical formulas and industrial descriptions in List II:",
        [
            ("Washing soda", "III",
             "Na2CO3·10H2O; efflorescent decahydrate used in laundry detergents and water softening",
             "Washing soda crystallizes as a decahydrate. On exposure to dry air, it undergoes efflorescence, losing 9 water molecules to form a white monohydrate: Na2CO3·10H2O -> Na2CO3·H2O + 9H2O"),
            ("Baking soda", "I",
             "NaHCO3; mild non-corrosive base used in baking powders and antacids, releasing CO2 on heating",
             "Sodium hydrogencarbonate decomposes upon mild heating (2NaHCO3 -> Na2CO3 + H2O + CO2). The generated CO2 bubbles aerate dough, making cakes and breads light and fluffy"),
            ("Quick lime", "IV",
             "CaO; manufactured by thermal decomposition (calcination) of limestone in a rotary kiln at 1070-1270 K",
             "CaCO3(s) ⇌ CaO(s) + CO2(g). The reaction is reversible; continuous removal of CO2 in rotary kilns shifts the equilibrium to completion, yielding lumps of quicklime"),
            ("Slaked lime", "II",
             "Ca(OH)2; formed by the highly exothermic slaking of quicklime with water, used in whitewashing and mortar",
             "Adding water to quicklime results in a vigorous, highly exothermic reaction (slaking): CaO + H2O -> Ca(OH)2 + Heat, producing a white powder or suspension (milk of lime)")
        ],
        "D"
    ))

    # =========================================================================
    # INTERMEDIATE (8 questions: 065 - 072)
    # =========================================================================

    # 065 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_065", t, "intermediate",
        "Match the stages and chemical principles of the Solvay process in List I with their descriptions in List II:",
        [
            ("Carbonation tower precipitation", "III",
             "NH4HCO3 + NaCl -> NaHCO3(s) + NH4Cl; sodium bicarbonate precipitates due to common ion effect and low solubility",
             "Ammoniated brine is saturated with CO2 to produce ammonium bicarbonate, which precipitates sodium bicarbonate because NaHCO3 has relatively low solubility in presence of excess Na+ ions"),
            ("Ammonia recovery tower reaction", "I",
             "2NH4Cl + Ca(OH)2 -> CaCl2 + 2H2O + 2NH3; recovers ammonia while producing CaCl2 as byproduct",
             "The mother liquor containing NH4Cl is treated with slaked lime Ca(OH)2 (obtained from limestone calcination). Ammonia gas is regenerated and recycled back into the process"),
            ("Calcination of sodium bicarbonate", "IV",
             "2NaHCO3 -> Na2CO3 + CO2 + H2O; thermal decomposition at ~570 K yields soda ash and recyclable CO2",
             "Precipitated NaHCO3 crystals are filtered, washed, and calcined in a rotary furnace to produce anhydrous sodium carbonate (soda ash), recycling CO2 back to the carbonating tower"),
            ("Inapplicability of Solvay process to K2CO3", "II",
             "KHCO3 is too soluble in water to be precipitated by carbonating ammoniacal KCl solution",
             "Potassium hydrogencarbonate (KHCO3) has much higher aqueous solubility than NaHCO3 and fails to precipitate from ammoniacal brine, so K2CO3 must be prepared by the Leblanc process or KOH carbonation")
        ],
        "B"
    ))

    # 066 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_066", t, "intermediate",
        "Match the characteristics of alkali metal solutions in liquid ammonia in List I with their electronic explanations in List II:",
        [
            ("Dilute solution appearance and magnetism", "IV",
             "Deep blue color and paramagnetic due to presence of solitary ammoniated electrons [e(NH3)_y]^-",
             "Alkali metals dissolve readily in liquid ammonia: M + (x+y)NH3 -> [M(NH3)_x]^+ + [e(NH3)_y]^-. The unpaired ammoniated electrons absorb red/near-IR light, imparting a deep blue color and paramagnetism"),
            ("Concentrated solution appearance and magnetism", "II",
             "Bronze / copper-metallic luster and diamagnetic due to pairing of ammoniated electrons into diamagnetic pairs",
             "At concentrations above ~3 M, ammoniated electrons associate in pairs with antiparallel spins: 2e^- ⇌ e2^2-. The paramagnetism disappears (diamagnetic) and conductivity approaches that of pure metals"),
            ("Ammoniated electron broad absorption band", "I",
             "Broad absorption centered in the near-infrared region (~1500 nm), conferring immense reducing power",
             "The solvated electron occupies an open cavity of ~3.3 Å diameter surrounded by polarized NH3 molecules. Transition between cavity states gives an intense near-IR band with standard reduction potential ~ -3.0 V"),
            ("Catalytic decomposition to metal amide", "III",
             "2M + 2NH3 -> 2MNH2 + H2; slow on standing but rapidly catalyzed by transition metal impurities (e.g., Fe/rust)",
             "The blue ammoniacal solution is metastable; on prolonged standing or in the presence of finely divided iron catalyst, it decomposes to form the metal amide (sodamide, NaNH2) with evolution of H2 gas")
        ],
        "A"
    ))

    # 067 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_067", t, "intermediate",
        "Match the thermal decomposition behaviors of s-block oxo-salts in List I with their chemical equations and trends in List II:",
        [
            ("Lithium carbonate (Li2CO3)", "II",
             "Decomposes at ~700 °C: Li2CO3 -> Li2O + CO2; other alkali carbonates are thermally stable and do not decompose",
             "Because of the small size and high polarizing power of Li+, it polarizes the large CO3^2- ion, facilitating its breakdown into the very stable lattice of Li2O and CO2"),
            ("Lithium nitrate (LiNO3)", "IV",
             "Decomposes anomalously: 4LiNO3 -> 2Li2O + 4NO2 + O2, mimicking Group 2 nitrate decomposition",
             "While other alkali nitrates decompose mildly to give nitrites (2MNO3 -> 2MNO2 + O2), LiNO3 decomposes completely to lithium oxide, brown nitrogen dioxide gas, and oxygen, showing diagonal similarity to Mg"),
            ("Sodium nitrate (NaNO3)", "I",
             "Decomposes upon moderate heating to sodium nitrite and oxygen: 2NaNO3 -> 2NaNO2 + O2",
             "Larger alkali metal cations stabilize the polyatomic nitrate anion better; decomposition stops at the nitrite stage without cleavage of the N-O bond to form oxide and NO2"),
            ("Thermal stability of Group 2 carbonates (BeCO3 to BaCO3)", "III",
             "Thermal decomposition temperature increases steadily down the group: BeCO3 < MgCO3 < CaCO3 < SrCO3 < BaCO3",
             "As cation size increases from Be^2+ (31 pm) to Ba^2+ (135 pm), polarizing power declines sharply. The carbonate anion is less distorted, raising the decomposition temperature from <100 °C to >1360 °C")
        ],
        "C"
    ))

    # 068 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_068", t, "intermediate",
        "Match the solubility and hydration trends of alkaline earth metal compounds in List I with their thermodynamic rationales in List II:",
        [
            ("Group 2 hydroxides solubility (Be(OH)2 to Ba(OH)2)", "III",
             "Increases down the group (Ba(OH)2 is most soluble) because lattice enthalpy decreases faster than hydration enthalpy",
             "Hydroxide ion OH^- is small. As cation size increases down the group, lattice energy decreases rapidly while hydration energy drops relatively slowly, making ΔG_solution progressively more negative"),
            ("Group 2 sulfates solubility (BeSO4 to BaSO4)", "I",
             "Decreases down the group (BeSO4 is highly soluble, BaSO4 is insoluble) because hydration enthalpy plummets while lattice enthalpy remains nearly constant",
             "Sulfate SO4^2- is a large polyatomic anion. The sum (r_cation + r_anion) changes little down the group, keeping lattice energy nearly constant, but hydration enthalpy of the cation drops drastically, making BaSO4 insoluble"),
            ("Group 2 fluorides solubility (BeF2 to BaF2)", "IV",
             "Increases from MgF2 to BaF2, while BeF2 is exceptionally soluble due to the immense hydration energy of Be^2+",
             "BeF2 dissolves readily because the tiny Be^2+ cation has an extraordinary hydration enthalpy (-2494 kJ/mol) that easily overcomes its lattice energy, whereas MgF2 is insoluble due to high lattice energy"),
            ("Hydration enthalpies of Group 2 cations", "II",
             "Decreases monotonically down group: Be^2+ (-2494 kJ/mol) > Mg^2+ (-1921 kJ/mol) > Ca^2+ > Sr^2+ > Ba^2+ (-1305 kJ/mol)",
             "Hydration enthalpy is inversely proportional to ionic radius (Δ_hyd H ∝ z^2 / r). As ionic radius expands from Be^2+ to Ba^2+, charge density drops, decreasing the magnitude of hydration enthalpy")
        ],
        "D"
    ))

    # 069 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_069", t, "intermediate",
        "Match the gypsum and plaster of Paris transformations in List I with their structural and chemical conditions in List II:",
        [
            ("Plaster of Paris (CaSO4·0.5H2O) preparation", "III",
             "Heating gypsum (CaSO4·2H2O) at carefully controlled temperature 393 K: 2(CaSO4·2H2O) -> 2(CaSO4·0.5H2O) + 3H2O",
             "Gypsum is heated in kilns at exactly 393 K (120 °C). If temperature exceeds 393 K, further dehydration occurs to produce anhydrous calcium sulfate"),
            ("Dead burnt plaster formation", "I",
             "Heating gypsum above 393-473 K produces anhydrous CaSO4, which completely loses water-setting ability",
             "Above 473 K, all water of crystallization is lost, forming anhydrous calcium sulfate known as 'dead burnt plaster'. It hydrates extremely slowly and will not set into a hard mass"),
            ("Setting of Plaster of Paris", "IV",
             "Exothermic hydration converting hemihydrate into interlocking orthorhombic dihydrate crystals with ~1% volume expansion",
             "When mixed with water, Plaster of Paris forms a plastic paste that sets in 10-15 minutes into a hard mass of gypsum dihydrate crystals. The slight expansion during setting allows sharp casts for molds and surgical bandages"),
            ("Gypsum function in Portland cement", "II",
             "2-3% gypsum is added to cement clinker to retard the rapid flash-setting of tricalcium aluminate (C3A)",
             "Tricalcium aluminate in cement clinker reacts violently with water. Gypsum reacts with C3A to form insoluble calcium sulfoaluminate (ettringite), slowing down initial hydration and controlling setting time")
        ],
        "B"
    ))

    # 070 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_070", t, "intermediate",
        "Match the anomalous chemical behaviors of Beryllium in List I with their underlying chemical rationales in List II:",
        [
            ("Beryllium chloride (BeCl2) structural polymorphism", "IV",
             "Polymeric chlorido-bridged chain in solid state; chlorido-bridged dimer in vapor at ~1000 K; linear monomer at >1200 K",
             "In solid BeCl2, each Be atom forms two covalent bonds and accepts two coordinate bonds from chlorine lone pairs, adopting sp3 hybridization in an infinite chain. In vapor, it exists as dimer (Cl2Be(μ-Cl)2BeCl2), dissociating to sp linear monomer above 1200 K"),
            ("Amphoteric nature of BeO and Be(OH)2", "II",
             "Reacts with acids to form [Be(H2O)4]^2+ and with strong alkalis to form beryllate [Be(OH)4]^2-",
             "Unlike the purely basic oxides/hydroxides of heavier alkaline earths, BeO and Be(OH)2 dissolve in mineral acids as well as in aqueous NaOH: Be(OH)2 + 2OH^- -> [Be(OH)4]^2-"),
            ("Maximum coordination number of Beryllium", "I",
             "Strictly limited to 4 due to the presence of only four valence orbitals (2s and three 2p) with no accessible d-orbitals",
             "Beryllium belongs to Period 2 where the valence shell has n=2. It cannot expand its coordination sphere beyond 4, forming species like [BeF4]^2- and [Be(H2O)4]^2+, whereas heavier congeners achieve coordination number 6"),
            ("Reaction of Be and Mg with liquid ammonia", "III",
             "Do not readily dissolve in pure liquid ammonia without catalyst due to high sublimation and ionization energies",
             "Due to high lattice and ionization energies, Be and Mg do not dissolve spontaneously in liquid ammonia to form blue solutions. Mg requires the addition of a catalyst (like KNH2) to form hexammines")
        ],
        "A"
    ))

    # 071 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_071", t, "intermediate",
        "Match the supramolecular macrocycles and unusual alkali species in List I with their descriptions in List II:",
        [
            ("18-crown-6 cyclic polyether", "II",
             "Selectively complexes K+ whose ionic radius (1.38 Å) matches the 2.6-3.2 Å cavity size of the crown ether",
             "18-crown-6 has six oxygen donor atoms arranged in a ring. The central cavity diameter of 2.6-3.2 Å provides ideal geometric fit for potassium ion (diameter 2.76 Å), solubilizing KMnO4 in benzene ('purple benzene')"),
            ("Cryptand-222 bicyclic cage ligand", "IV",
             "Three-dimensional bicyclic ligand that completely encapsulates K+ inside a spherical cavity with high stability constant",
             "Cryptand-222 encapsulates alkali metal cations in a 3D cage through coordination by six ether oxygens and two bridgehead nitrogens, providing stability constants 10^4 times higher than monocyclic crown ethers"),
            ("Sodium alkalide (sodide) salt ([Na(cryptand-222)]^+ Na^-)", "I",
             "Crystalline salt containing the genuine sodide anion (Na^-) with a closed-shell [Ne] 3s^2 configuration",
             "By encaging the Na+ cation in cryptand-222, James Dye isolated stable golden crystals containing the sodide ion Na^-, where two electrons occupy the 3s subshell of an alkali metal anion"),
            ("Electride crystals ([Cs(cryptand-222)]^+ e^-)", "III",
             "Paramagnetic crystalline solid where trapped electrons occupy structural lattice voids acting as anions",
             "In electride salts, solvated electrons are trapped inside vacant crystallographic cavities in the absence of a chemical counteranion, acting as stoichiometric anionic quantum dots")
        ],
        "C"
    ))

    # 072 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_072", t, "intermediate",
        "Match the physiological and biological functions in List I with their corresponding s-block cations in List II:",
        [
            ("Sodium-Potassium pump (Na+/K+-ATPase)", "III",
             "Actively pumps 3 Na+ out of the cell and 2 K+ into the cell, consuming more than one-third of resting cellular ATP",
             "The electrogenic Na+/K+ pump maintains membrane potential and osmotic balance in animal cells by actively pumping 3 sodium ions outward and 2 potassium ions inward per hydrolyzed ATP molecule"),
            ("Magnesium (Mg^2+) biological roles", "I",
             "Essential cofactor for all ATP-utilizing kinase enzymes (Mg^2+-ATP complex) and central metal coordinating in chlorophyll",
             "Phosphate transfer in ATP requires coordination to Mg^2+ to shield negative charges. Furthermore, chlorophyll contains Mg^2+ coordinated in a porphyrin-like chlorin ring for photosynthetic light harvesting"),
            ("Calcium (Ca^2+) biological roles", "IV",
             "Critical second messenger in muscle contraction, blood clotting cascade, and structural component of bone hydroxyapatite",
             "Ca^2+ activates troponin C in muscle myofibrils, triggers the blood clotting protease cascade, and forms the mineral matrix of bones and teeth as crystalline hydroxyapatite [Ca3(PO4)2]3·Ca(OH)2"),
            ("Intracellular vs Extracellular distribution", "II",
             "K+ is the primary intracellular cation (~105-150 mM inside), while Na+ is the dominant extracellular cation (~145 mM outside)",
             "The asymmetric distribution maintained by active transport creates the electrical resting membrane potential essential for nerve impulse transmission and secondary active nutrient uptake")
        ],
        "D"
    ))

    # =========================================================================
    # ADVANCED (8 questions: 073 - 080)
    # =========================================================================

    # 073 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_073", t, "advanced",
        "Match the diagonal relationship manifestations between Lithium and Magnesium in List I with their chemical properties in List II:",
        [
            ("Organometallic alkyl compounds", "III",
             "Both form covalent, hydrocarbon-soluble alkyls (RLi and RMgX) exhibiting strong carbanionic nucleophilic reactivity",
             "Due to high polarizing power and similar electronegativity (Li = 1.0, Mg = 1.2), alkyllithiums (e.g., n-BuLi) and Grignard reagents (RMgX) have covalent M-C bonds and are soluble in organic solvents"),
            ("Nitrate thermal decomposition products", "I",
             "Both decompose to yield metal monoxide, brown NO2 gas, and O2: 4LiNO3 -> 2Li2O + 4NO2 + O2; 2Mg(NO3)2 -> 2MgO + 4NO2 + O2",
             "Unlike heavier alkali nitrates which yield nitrites, LiNO3 and Mg(NO3)2 undergo complete thermal breakdown to oxides and NO2 because the small cations strongly polarize the nitrate anion"),
            ("Chloride deliquescence and dehydration behavior", "IV",
             "Both form hydrated deliquescent chlorides (LiCl·2H2O and MgCl2·6H2O) that undergo partial hydrolysis on heating",
             "Due to high hydration enthalpies, LiCl and MgCl2 absorb atmospheric moisture greedily; heating hydrates causes partial hydrolysis to basic chlorides (LiOH / Mg(OH)Cl) with evolution of HCl gas"),
            ("Carbonate thermal stability and solubility", "II",
             "Both form carbonates that are sparingly soluble in water and decompose to oxides and CO2 at moderate temperatures",
             "Li2CO3 and MgCO3 have low aqueous solubility and decompose on heating (Li2CO3 decomposes at ~700 °C, MgCO3 at ~540 °C), unlike Na2CO3 and K2CO3 which melt without decomposing")
        ],
        "B"
    ))

    # 074 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_074", t, "advanced",
        "Match the thermodynamic terms in the Born-Haber cycle for standard reduction potentials (E°_M+/M) of Group 1 in List I with their trends in List II:",
        [
            ("Sublimation enthalpy (Δ_sub H°)", "IV",
             "Decreases monotonically from Li (+161 kJ/mol) to Cs (+76 kJ/mol) as metallic bonding weakens with larger atomic size",
             "Sublimation requires overcoming metallic bonding in the solid crystal. Smaller Li atoms pack more tightly with stronger metallic bonding, requiring twice the sublimation energy of large Cs atoms"),
            ("First ionization enthalpy (Δ_i H°)", "II",
             "Decreases monotonically from Li (+520 kJ/mol) to Cs (+376 kJ/mol) due to increasing distance and inner-shell shielding",
             "As principal quantum number increases from n=2 (Li) to n=6 (Cs), the valence electron is further from the nucleus and shielded by extra electron shells, lowering the ionization enthalpy"),
            ("Hydration enthalpy (Δ_hyd H°)", "I",
             "Li+ has an immense hydration enthalpy (-506 kJ/mol) compared to Cs+ (-264 kJ/mol) due to high charge density",
             "Hydration enthalpy is inversely proportional to ionic radius (Δ_hyd H ∝ 1/r+). The tiny Li+ cation (76 pm) coordinates water molecules with enormous exothermic energy release (-506 kJ/mol)"),
            ("Overall standard reduction potential anomaly (E° = -3.04 V for Li)", "III",
             "Li is the most powerful reducing agent in aqueous solution because huge hydration energy completely overcomes its high ionization and sublimation energies",
             "ΔG° = Δ_sub H° + Δ_i H° + Δ_hyd H°. Even though Li has the most endothermic sublimation and ionization enthalpies, its massive negative hydration energy makes ΔG° for Li+(aq) + e^- -> Li(s) the most positive, giving E° = -3.04 V")
        ],
        "A"
    ))

    # 075 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_075", t, "advanced",
        "Match the reactions and magnetic behaviors of alkali metal peroxides and superoxides in List I with their descriptions in List II:",
        [
            ("Reaction of potassium superoxide (KO2) with CO2", "II",
             "4KO2 + 2CO2 -> 2K2CO3 + 3O2; used in submarines and space capsules to scrub exhaled CO2 while generating O2",
             "Superoxide reacts with CO2 to generate potassium carbonate and pure oxygen gas: 4KO2 + 2CO2 -> 2K2CO3 + 3O2, providing an autonomous life-support oxygen generator and carbon dioxide scrubber"),
            ("Reaction of sodium peroxide (Na2O2) with cold water", "IV",
             "Na2O2 + 2H2O (cold) -> 2NaOH + H2O2; produces hydrogen peroxide without evolution of oxygen gas",
             "In ice-cold water, sodium peroxide undergoes hydrolysis to yield sodium hydroxide and hydrogen peroxide. Only on warming does H2O2 decompose catalytically to liberate oxygen gas"),
            ("Magnetic comparison of KO2 and Na2O2", "I",
             "KO2 is paramagnetic with 1 unpaired electron in π*2p of O2^-, while Na2O2 is diamagnetic with fully filled π*2p in O2^2-",
             "Molecular orbital theory shows that the superoxide ion O2^- has 11 valence electrons with 1 unpaired electron in (π*2px, π*2py), making KO2 paramagnetic. Peroxide O2^2- has 12 electrons, all paired"),
            ("Thermal stability order of alkali superoxides (KO2, RbO2, CsO2)", "III",
             "Thermal stability increases with cation radius: KO2 < RbO2 < CsO2 due to lattice energy stabilization of the bulky O2^- anion",
             "Large cations have low charge density and do not polarize the large superoxide anion, stabilizing the crystal lattice against decomposition into monoxide and oxygen")
        ],
        "C"
    ))

    # 076 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_076", t, "advanced",
        "Match the alkali metal polysulfides and polyhalides in List I with their chemical properties and stabilities in List II:",
        [
            ("Reaction of elemental sulfur with aqueous sodium sulfide", "III",
             "Na2S + (x-1)S -> Na2S_x (x = 2 to 5); dissolves sulfur to form zigzag polysulfide chains (S_x^2-)",
             "Boiling elemental sulfur with aqueous Na2S dissolves sulfur via nucleophilic cleavage of S8 rings, forming sodium polysulfides containing bridging S-S single bonds (e.g., Na2S4, Na2S5)"),
            ("Formation of triiodide in aqueous potassium iodide", "I",
             "KI + I2 -> KI3; forms linear [I3]^- complex which increases elemental iodine solubility by orders of magnitude",
             "I2 has very low solubility in pure water, but dissolves readily in aqueous KI by forming the stable triiodide anion [I3]^- through coordinate bonding of iodide lone pair into the empty σ* orbital of I2"),
            ("Stability of Cesium polyhalides (CsI3, CsICl2)", "IV",
             "Forms stable crystalline salts because large Cs+ cation has low polarizing power and does not decompose bulky polyhalide anions",
             "Large polyatomic anions like [I3]^- or [ICl2]^- are best stabilized in crystal lattices by large cations of low charge density like Cs+, preventing polarization-induced dissociation into CsCl and ICl"),
            ("Instability of polyhalides with small alkali cations (Li+, Na+)", "II",
             "Li+ and Na+ have high polarizing power, causing polyhalides to dissociate into simple monohalides and halogen",
             "The high charge-to-radius ratio of Li+ strongly polarizes the polyhalide anion, driving its spontaneous decomposition: LiI3 -> LiI + I2, so lithium polyhalides cannot be isolated at room temperature")
        ],
        "D"
    ))

    # 077 - Correct Answer: B
    qs.append(make_matrix_q(
        f"{prefix}_077", t, "advanced",
        "Match the electrochemical components of the Castner-Kellner and chlor-alkali cells in List I with their chemical reactions in List II:",
        [
            ("Castner-Kellner mercury cathode reaction", "III",
             "Na+ + e^- + Hg -> Na/Hg; mercury cathode suppresses H2 evolution due to high overpotential, discharging sodium amalgam",
             "Although H+ has a more positive standard reduction potential than Na+, the overpotential for hydrogen discharge on mercury is exceptionally high (~0.8 V), making reduction of Na+ to form sodium amalgam kinetically favored"),
            ("Denuder chamber reaction of sodium amalgam", "I",
             "2Na/Hg + 2H2O -> 2NaOH + H2 + 2Hg; decomposes amalgam with water over graphite blocks, producing chloride-free pure NaOH",
             "In the separate denuder compartment, the sodium amalgam reacts with water in the presence of graphite packing to produce 50% pure NaOH solution, dihydrogen gas, and regenerated liquid mercury"),
            ("Diaphragm cell (Nelson cell) function", "IV",
             "Porous asbestos diaphragm separates cathode and anode, preventing Cl2 from reacting with NaOH to form chlorate/hypochlorite",
             "Chlorine gas evolved at the anode must be physically prevented from contacting OH^- ions generated at the cathode (which would react to form ClO^- and ClO3^-); the asbestos diaphragm allows percolation of brine while separating products"),
            ("Role of hydrogen overpotential on mercury", "II",
             "Shifts the discharge potential of H+ by ~0.8 V more negative, rendering Na+ discharge thermodynamically/kinetically preferred",
             "On a mercury surface, hydrogen atom recombination to form H2 has a very high activation energy barrier. This kinetic overpotential shifts the effective discharge potential of H+ below -2.1 V, allowing Na+ to discharge at -1.8 V")
        ],
        "B"
    ))

    # 078 - Correct Answer: A
    qs.append(make_matrix_q(
        f"{prefix}_078", t, "advanced",
        "Match the Portland cement clinker mineral phases in List I with their hydration kinetics and structural roles in List II:",
        [
            ("Tricalcium silicate (3CaO·SiO2, C3S, 50-60%)", "IV",
             "Hydrates rapidly, responsible for early compressive strength development (within 7 to 28 days) with moderate heat of hydration",
             "C3S undergoes rapid hydration to form amorphous calcium silicate hydrate (C-S-H gel, tobermorite) and crystalline Ca(OH)2, providing the majority of strength development during the first 4 weeks"),
            ("Dicalcium silicate (2CaO·SiO2, C2S, 20-30%)", "II",
             "Hydrates very slowly, responsible for progressive long-term strength gain (after 28 days up to years) with lowest heat of hydration",
             "C2S reacts sluggishly with water, contributing little to early strength but continuously generating C-S-H gel over months, ensuring ultimate durability and resistance to chemical attack"),
            ("Tricalcium aluminate (3CaO·Al2O3, C3A, 8-12%)", "I",
             "Fastest hydrating clinker phase with highest heat of hydration; causes initial flash-setting unless retarded by gypsum",
             "C3A reacts almost instantaneously with water releasing ~865 J/g of heat. Gypsum must be added during clinker grinding to form protective ettringite needles and prevent premature stiffening"),
            ("Tetracalcium aluminoferrite (4CaO·Al2O3·Fe2O3, C4AF, 6-10%)", "III",
             "Hydrates rapidly with low heat of hydration; contributes negligibly to strength and imparts characteristic grey color to cement",
             "C4AF acts as a flux during rotary kiln sintering to lower the clinkering temperature. It hydrates to form hydrated calcium aluminoferrite with minimal mechanical strength contribution")
        ],
        "A"
    ))

    # 079 - Correct Answer: C
    qs.append(make_matrix_q(
        f"{prefix}_079", t, "advanced",
        "Match the coordination complexes and organometallics of s-block elements in List I with their structural geometries in List II:",
        [
            ("Beryllium fluoro-complex [BeF4]^2-", "II",
             "Tetrahedral complex with sp3 hybridization, exceptionally stable due to high charge density of Be^2+",
             "Be^2+ utilizes its 2s and three 2p orbitals to accept coordinate bonds from four F^- ligands. The resulting tetrahedral complex has high thermodynamic stability with negligible dissociation"),
            ("Magnesium in chlorophyll", "IV",
             "Coordinated to four pyrrole nitrogen atoms of a substituted chlorin ring in a planar/pyramidal coordination geometry",
             "Mg^2+ occupies the central cavity of the chlorin macrocycle, bonded to four nitrogen atoms. The rigid geometry and precise electronic coupling optimize solar photon absorption and energy transfer"),
            ("Grignard reagent solvation in diethyl ether", "I",
             "Exists as dietherate complex RMgX·2Et2O with tetrahedral geometry around magnesium in solution",
             "Magnesium in RMgX has only 4 valence electrons. Two molecules of diethyl ether donate lone pairs to empty Mg 3s/3p orbitals, completing a tetrahedral octet and preventing Schlenk disproportionation"),
            ("15-crown-5 selectivity for Na+", "III",
             "Cyclic polyether with cavity diameter 1.7-2.2 Å, matching the 2.04 Å ionic diameter of Na+ for optimal binding",
             "The five oxygen atoms of 15-crown-5 define an equatorial cavity that snugly coordinates Na+ with negligible ligand conformational strain, demonstrating high selectivity over Li+ and K+")
        ],
        "C"
    ))

    # 080 - Correct Answer: D
    qs.append(make_matrix_q(
        f"{prefix}_080", t, "advanced",
        "Match the anomalous solubility behaviors of alkali halides in List I with their lattice vs hydration enthalpy balances in List II:",
        [
            ("Lithium fluoride (LiF) low water solubility", "III",
             "Both Li+ and F^- are very small, generating an immense lattice enthalpy (+1036 kJ/mol) that exceeds the sum of hydration enthalpies",
             "Because of the tiny ionic radii of both Li+ and F^-, the interionic distance is very short, resulting in an exceptionally large lattice enthalpy. The negative hydration enthalpy is insufficient to overcome it, making LiF sparingly soluble"),
            ("Cesium iodide (CsI) low water solubility", "I",
             "Both Cs+ and I^- are very large, resulting in small hydration enthalpies that fail to overcome the lattice enthalpy",
             "Because both Cs+ and I^- have large radii and low charge density, their hydration enthalpies are low (-264 and -293 kJ/mol). Even though lattice enthalpy is modest (+600 kJ/mol), the net ΔH_solution is endothermic"),
            ("Lithium iodide (LiI) high water solubility", "IV",
             "The tiny Li+ ion provides a colossal hydration enthalpy (-506 kJ/mol) that easily overcomes the moderate lattice enthalpy",
             "In LiI, the large size of I^- expands the interionic distance, significantly lowering the lattice enthalpy compared to LiF. The enormous hydration enthalpy of Li+ easily compensates, giving high solubility"),
            ("Cesium fluoride (CsF) high water solubility", "II",
             "The small F^- ion provides a massive hydration enthalpy (-515 kJ/mol) that easily overcomes the relatively low lattice enthalpy",
             "In CsF, the small fluoride ion provides a very large hydration enthalpy, while the large Cs+ keeps the lattice enthalpy relatively modest (+744 kJ/mol). The resulting dissolution process is highly favorable")
        ],
        "D"
    ))

    return qs

get_questions = get_sblock_questions
