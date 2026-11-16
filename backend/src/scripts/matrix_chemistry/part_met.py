import sys
import os

# Add current directory to path if needed
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from builder import make_matrix_q

TOPIC = "General Principles of Metallurgy"

def get_metallurgy_questions():
    questions = []

    # ----------------------------------------------------
    # Beginner Questions (chem_app_001 - chem_app_004)
    # ----------------------------------------------------

    # chem_app_001 (Beginner, Ans: A)
    pairs_001 = [
        ("Iron", "II", "Haematite (Fe2O3)", 
         "The principal oxide ore of iron from which pig iron is extracted is Haematite, Fe2O3"),
        ("Copper", "III", "Malachite (CuCO3·Cu(OH)2)", 
         "Malachite is a basic copper carbonate mineral with formula CuCO3·Cu(OH)2, known for its green color"),
        ("Aluminium", "IV", "Bauxite (AlOx(OH)3-2x)", 
         "Bauxite is the primary aluminium ore comprising hydrated aluminium oxide, AlOx(OH)3-2x (where 0 < x < 1)"),
        ("Zinc", "I", "Calamine (ZnCO3)", 
         "Calamine is zinc carbonate (ZnCO3), which yields ZnO upon calcination")
    ]
    questions.append(make_matrix_q(
        "chem_app_001", TOPIC, "beginner",
        "Match each metal in List I with its principal ore in List II:",
        pairs_001, "A"
    ))

    # chem_app_002 (Beginner, Ans: B)
    pairs_002 = [
        ("CuFeS2", "III", "Copper pyrites (Chalcopyrite)", 
         "CuFeS2 is copper pyrites or chalcopyrite, the most abundant sulfide ore of copper"),
        ("ZnS", "IV", "Zinc blende (Sphalerite)", 
         "ZnS crystallizes in zinc blende or sphalerite structure and is the principal source of zinc"),
        ("PbS", "I", "Galena", 
         "PbS is galena, the chief sulfide ore of lead with a rock-salt cubic crystal lattice"),
        ("SnO2", "II", "Cassiterite (Tinstone)", 
         "SnO2 is cassiterite or tinstone, the major oxide ore of tin concentrated by gravity separation")
    ]
    questions.append(make_matrix_q(
        "chem_app_002", TOPIC, "beginner",
        "Match each chemical formula in List I with the common mineral/ore name in List II:",
        pairs_002, "B"
    ))

    # chem_app_003 (Beginner, Ans: C)
    pairs_003 = [
        ("Gravity separation", "IV", "Difference in specific gravities of ore and gangue particles", 
         "Gravity separation (hydraulic washing) relies on density differences, causing lighter gangue particles to wash away in a stream of water while heavier ore particles settle"),
        ("Magnetic separation", "I", "Difference in magnetic susceptibilities of ore and gangue components", 
         "Magnetic separation exploits differences in magnetic properties, such as separating magnetic wolframite (FeWO4) from non-magnetic cassiterite (SnO2)"),
        ("Froth flotation", "II", "Preferential wetting of mineral particles by oil and gangue by water", 
         "Froth flotation works because sulfide mineral particles are preferentially wetted by pine oil/xanthate collectors, whereas siliceous gangue is wetted by water"),
        ("Leaching", "III", "Selective dissolution of the ore in a suitable chemical reagent leaving insoluble gangue", 
         "Leaching is a hydrometallurgical method where the ore selectively dissolves in aqueous acid or base, leaving behind undissolved gangue")
    ]
    questions.append(make_matrix_q(
        "chem_app_003", TOPIC, "beginner",
        "Match the concentration/ore dressing technique in List I with its working principle in List II:",
        pairs_003, "C"
    ))

    # chem_app_004 (Beginner, Ans: D)
    pairs_004 = [
        ("Distillation refining", "I", "Zinc (Zn)", 
         "Distillation is used for refining volatile metals with low boiling points like Zinc (b.p. ~1180 K) and Mercury (b.p. ~630 K)"),
        ("Liquation refining", "II", "Tin (Sn)", 
         "Liquation is applied to metals with low melting points like Tin (m.p. ~505 K) and Lead on a sloping reverberatory furnace hearth"),
        ("Mond process", "III", "Nickel (Ni)", 
         "The Mond process purifies nickel via formation of volatile nickel tetracarbonyl Ni(CO)4 at 330-350 K, followed by thermal decomposition at 450-470 K"),
        ("Van Arkel process", "IV", "Zirconium (Zr)", 
         "The Van Arkel-de Boer method purifies metals like Zr and Ti by forming volatile tetraiodides (ZrI4) on heating with I2, followed by decomposition on a hot tungsten filament")
    ]
    questions.append(make_matrix_q(
        "chem_app_004", TOPIC, "beginner",
        "Match each refining method in List I with the metal typically refined by it in List II:",
        pairs_004, "D"
    ))

    # ----------------------------------------------------
    # Intermediate Questions (chem_app_005 - chem_app_012)
    # ----------------------------------------------------

    # chem_app_005 (Intermediate, Ans: A)
    pairs_005 = [
        ("Sodium ethyl xanthate", "II", "Collector that enhances non-wettability of mineral particles", 
         "Xanthates are collectors having polar head groups that attach to sulfide surfaces and hydrophobic hydrocarbon tails that make the mineral water-repellent"),
        ("Pine oil / Cresol", "I", "Froth stabilizer / foaming agent that stabilizes the froth bubbles", 
         "Cresols and aniline serve as froth stabilizers, enhancing bubble persistence so that the mineral-bearing froth can be skimmed off"),
        ("Sodium cyanide (NaCN)", "IV", "Depressant used to selectively separate ZnS from PbS ore", 
         "NaCN acts as a depressant by converting ZnS into the water-soluble complex Na2[Zn(CN)4], preventing ZnS from floating while PbS forms froth"),
        ("Copper sulfate (CuSO4)", "III", "Activator used to activate floating of depressed ZnS particles", 
         "CuSO4 acts as an activator for depressed ZnS; Cu2+ ions displace Zn2+ on the surface forming CuS, restoring floatability with collectors")
    ]
    questions.append(make_matrix_q(
        "chem_app_005", TOPIC, "intermediate",
        "Match the reagent used in the froth flotation process in List I with its specific role/example in List II:",
        pairs_005, "A"
    ))

    # chem_app_006 (Intermediate, Ans: B)
    pairs_006 = [
        ("ZnCO3 (s) -> ZnO (s) + CO2 (g)", "III", "Calcination of carbonate ore", 
         "Thermal decomposition of calamine (ZnCO3) in the absence or limited supply of air below melting point is calcination"),
        ("2CuFeS2 + O2 -> Cu2S + 2FeS + SO2", "I", "Roasting of sulfide ore", 
         "Heating sulfide ore in excess air below its melting point in a reverberatory furnace converts chalcopyrite to Cu2S and FeS while driving off SO2, which is roasting"),
        ("FeO + SiO2 -> FeSiO3 (molten)", "IV", "Slag formation during pyrometallurgy", 
         "Basic ferrous oxide reacts with acidic silica flux in the smelting stage to form fusible iron silicate slag (FeSiO3), which floats on the copper matte"),
        ("2Cu2O + Cu2S -> 6Cu + SO2", "II", "Auto-reduction (Self-reduction) in Bessemer converter", 
         "In the Bessemer converter, unoxidized Cu2S reacts directly with formed Cu2O without external reducing agent to yield metallic copper, an auto-reduction process")
    ]
    questions.append(make_matrix_q(
        "chem_app_006", TOPIC, "intermediate",
        "Match the chemical transformation in List I with the metallurgical operation name in List II:",
        pairs_006, "B"
    ))

    # chem_app_007 (Intermediate, Ans: C)
    pairs_007 = [
        ("Zone of combustion (1900 - 2200 K)", "IV", "C + O2 -> CO2 (highly exothermic, providing thermal energy)", 
         "Near the tuyeres of the blast furnace, coke burns intensely in preheated blast air to CO2, generating temperatures up to 2200 K and driving the furnace heat"),
        ("High temperature reduction zone (900 - 1500 K)", "III", "FeO + C -> Fe + CO (direct reduction by carbon)", 
         "At temperatures above ~1000 K, carbon (coke) directly reduces FeO to Fe because the Ellingham line for 2C + O2 -> 2CO lies below Fe/FeO"),
        ("Low temperature reduction zone (500 - 800 K)", "II", "3Fe2O3 + CO -> 2Fe3O4 + CO2 (indirect reduction by carbon monoxide)", 
         "In the upper cooler stack of the blast furnace, indirect reduction of haematite to magnetite and then FeO is carried out by ascending CO gas"),
        ("Zone of slag formation (1000 - 1200 K)", "I", "CaO + SiO2 -> CaSiO3 (flux basic oxide neutralizes acidic silica)", 
         "Limestone decomposes to CaO (flux), which combines with gangue SiO2 to produce molten slag CaSiO3, floating over molten pig iron")
    ]
    questions.append(make_matrix_q(
        "chem_app_007", TOPIC, "intermediate",
        "Match each temperature zone in the Blast Furnace for iron extraction in List I with the predominant chemical reaction occurring in that zone in List II:",
        pairs_007, "C"
    ))

    # chem_app_008 (Intermediate, Ans: D)
    pairs_008 = [
        ("Pig iron", "II", "Contains ~4% carbon with high brittleness directly obtained from blast furnace", 
         "Pig iron is the crude product tapped directly from the blast furnace hearth, containing ~4% carbon along with impurities (S, P, Si, Mn), making it hard and brittle"),
        ("Cast iron", "IV", "Contains ~3% carbon, extremely hard and brittle, made by melting pig iron with scrap iron and coke", 
         "Cast iron is manufactured by melting pig iron with scrap iron and coke in a cupola furnace; it has slightly lower carbon (~3%) and expands on solidification"),
        ("Wrought iron", "I", "Purest commercial form containing <0.2% carbon, malleable and ductile", 
         "Wrought iron or malleable iron contains less than 0.2% carbon; it is prepared by puddling pig iron in a reverberatory furnace lined with haematite"),
        ("Steel", "III", "Intermediate alloy with 0.1-1.5% carbon with high tensile strength and elasticity", 
         "Steel contains 0.1 to 1.5% carbon, exhibiting high tensile strength, elasticity, and responsiveness to heat treatments like quenching and tempering")
    ]
    questions.append(make_matrix_q(
        "chem_app_008", TOPIC, "intermediate",
        "Match the commercial variety/intermediate form of iron in List I with its carbon content and characteristic in List II:",
        pairs_008, "D"
    ))

    # chem_app_009 (Intermediate, Ans: A)
    pairs_009 = [
        ("Digestion with concentrated NaOH at 473-523 K and 35-36 bar", "II", "Leaching of bauxite ore to form soluble sodium aluminate [Na[Al(OH)4]]", 
         "In Bayer's process, bauxite is digested with hot concentrated caustic soda at 473-523 K and 35-36 bar, dissolving Al2O3 as sodium aluminate while Fe2O3 and TiO2 remain insoluble red mud"),
        ("Reaction with dilute NaCN in presence of air (O2)", "IV", "Leaching of argentite or native gold to form dicyano complex [M(CN)2]-", 
         "In the MacArthur-Forrest cyanide process, native Au or Ag is oxidized by atmospheric O2 in dilute NaCN solution to soluble [Au(CN)2]- or [Ag(CN)2]- complexes"),
        ("Reaction of sodium aluminate solution with CO2 gas", "I", "Precipitation of hydrated alumina (Al2O3·xH2O) by neutralization", 
         "Bubbling CO2 gas through the filtered sodium aluminate solution neutralizes excess alkali and precipitates pure hydrated alumina (Al2O3·xH2O), seeded with fresh Al(OH)3"),
        ("Displacement of [Au(CN)2]- or [Ag(CN)2]- by zinc dust", "III", "Hydrometallurgical recovery of precious metal by reduction", 
         "Zinc acts as a strong reducing agent (E° Zn2+/Zn = -0.76 V) to displace gold or silver from cyano complexes: 2[Au(CN)2]- + Zn -> [Zn(CN)4]2- + 2Au")
    ]
    questions.append(make_matrix_q(
        "chem_app_009", TOPIC, "intermediate",
        "Match the leaching reaction/process in List I with the species or metal involved in List II:",
        pairs_009, "A"
    ))

    # chem_app_010 (Intermediate, Ans: B)
    pairs_010 = [
        ("Zone refining", "III", "Fractional crystallization based on difference in solubility of impurities in molten vs solid states", 
         "Zone refining utilizes the principle that impurities are substantially more soluble in the molten melt than in the solid state; a circular moving heater sweeps impurities to one end"),
        ("Mond process", "IV", "Formation of volatile nickel tetracarbonyl at low T and its thermal decomposition at high T", 
         "Crude nickel is treated with CO at 330-350 K to form volatile Ni(CO)4 vapour, which is conveyed to a chamber at 450-470 K where it decomposes into pure Ni and CO gas"),
        ("Cupellation", "I", "Selective oxidation of base metal impurities (like lead) leaving noble metal (silver) unoxidized", 
         "In cupellation, impure silver containing lead is heated in an oval porous cupel made of bone ash; lead oxidizes to molten litharge (PbO) and is absorbed, leaving pure silver"),
        ("Poling", "II", "Reduction of metal oxide impurities (like Cu2O) by hydrocarbon gases from green wood poles", 
         "Molten copper containing dissolved Cu2O is stirred with green wood poles; hydrocarbon gases released reduce cuprous oxide back to metallic copper")
    ]
    questions.append(make_matrix_q(
        "chem_app_010", TOPIC, "intermediate",
        "Match the refining technique in List I with the underlying chemical/physical principle in List II:",
        pairs_010, "B"
    ))

    # chem_app_011 (Intermediate, Ans: C)
    pairs_011 = [
        ("Cryolite (Na3AlF6) in Hall-Héroult cell", "IV", "Lowers melting point of alumina from 2320 K to ~1140 K and increases electrical conductivity", 
         "Pure Al2O3 is a poor electrical conductor with a melting point above 2300 K; adding cryolite forms a lower-melting eutectic mixture (~1140 K) and enhances ionic conductivity"),
        ("Fluorspar (CaF2) in aluminium electrolysis", "I", "Enhances fluidity and conductivity of the fused electrolyte melt", 
         "Calcium fluoride (CaF2) is added in minor quantities to the Hall-Héroult electrolyte to further lower viscosity, boost bath fluidity, and reduce electrical resistivity"),
        ("Silica (SiO2) in copper smelting", "II", "Acts as an acidic flux to bind FeO as molten iron silicate slag (FeSiO3)", 
         "Roasted copper ore contains basic FeO; silica serves as an acidic flux, reacting as FeO + SiO2 -> FeSiO3 to form molten slag easily separable from copper matte"),
        ("Limestone (CaCO3) in iron blast furnace", "III", "Decomposes to basic CaO flux to remove gangue SiO2 as slag (CaSiO3)", 
         "CaCO3 calcines to CaO, which acts as a basic flux to scavenge acidic gangue SiO2 into fusible calcium silicate slag CaSiO3")
    ]
    questions.append(make_matrix_q(
        "chem_app_011", TOPIC, "intermediate",
        "Match the specific substance/component in metallurgy in List I with its operational function in List II:",
        pairs_011, "C"
    ))

    # chem_app_012 (Intermediate, Ans: D)
    pairs_012 = [
        ("Reverberatory furnace", "III", "Smelting of roasted copper ore and calcination/roasting where fuel is not in direct contact with charge", 
         "In a reverberatory furnace, flames and hot flue gases from the firebox are deflected (reverberated) off the curved roof onto the charge, avoiding direct fuel contact"),
        ("Bessemer converter", "IV", "Converting copper matte into blister copper via air blast and auto-reduction", 
         "A pear-shaped, silica-lined Bessemer converter receives molten copper matte; an air blast oxidizes FeS to FeO and triggers auto-reduction to yield blister copper"),
        ("Blast furnace", "I", "Reduction of iron oxide ores to produce pig iron continuously using coke", 
         "A tall refractory-lined blast furnace operates continuously with a counter-current flow of descending iron ore/coke charge and ascending hot reducing gases"),
        ("Hall-Héroult electrolytic cell", "II", "Electrolytic reduction of alumina using carbon anodes and graphite lining cathode", 
         "A steel box lined with graphite cathode holds the fused Al2O3-Na3AlF6 bath with suspended carbon anode rods, reducing Al3+ to liquid aluminium")
    ]
    questions.append(make_matrix_q(
        "chem_app_012", TOPIC, "intermediate",
        "Match each metallurgical furnace/converter in List I with its primary extraction application in List II:",
        pairs_012, "D"
    ))

    # ----------------------------------------------------
    # Advanced Questions (chem_app_013 - chem_app_020)
    # ----------------------------------------------------

    # chem_app_013 (Advanced, Ans: A)
    pairs_013 = [
        ("Positive slope (dΔG°/dT > 0) of metal oxidation lines", "II", "Entropy decreases (ΔS° < 0) because gaseous O2 is consumed to form solid metal oxide", 
         "Since ΔG° = ΔH° - TΔS°, the slope of the Ellingham plot is -ΔS°. In oxidation reactions like 2M(s) + O2(g) -> 2MO(s), one mole of gas is converted to solid, so ΔS° is negative and the slope -ΔS° is positive"),
        ("Abrupt increase in slope of ΔG° vs T curve at a specific temperature", "I", "Phase transition (melting or vaporization) of the reactant metal where entropy of reactant increases", 
         "When a metal melts or boils, its standard entropy S°(reactant) surges, making ΔS°(reaction) = S°(MO) - S°(M) - S°(O2) significantly more negative, causing a sharp upward bend in slope"),
        ("Negative slope (dΔG°/dT < 0) of the reaction 2C + O2 -> 2CO", "IV", "Entropy increases (ΔS° > 0) due to net increase from 1 mol to 2 mol of gas", 
         "For the reaction 2C(s) + O2(g) -> 2CO(g), 1 mole of gas forms 2 moles of gas. Hence ΔS° is positive, giving a negative slope (-ΔS° < 0) on the Ellingham diagram"),
        ("Temperature where the ΔG° curve for C -> CO intersects the M -> MO curve", "III", "Temperature above which carbon becomes thermodynamically capable of reducing the metal oxide", 
         "At temperatures higher than the intersection point, the ΔG° line for carbon oxidation lies below that of the metal oxidation, ensuring ΔrG° for MO + C -> M + CO is negative and spontaneous")
    ]
    questions.append(make_matrix_q(
        "chem_app_013", TOPIC, "advanced",
        "Match each thermodynamic feature of an Ellingham diagram in List I with its physical/chemical interpretation in List II:",
        pairs_013, "A"
    ))

    # chem_app_014 (Advanced, Ans: B)
    pairs_014 = [
        ("Below 710 °C (983 K) for Fe-C-O system", "III", "CO is a more effective reducing agent than C because ΔG°(CO -> CO2) is more negative than ΔG°(C -> CO)", 
         "Below 983 K in the blast furnace, the Ellingham curve for 2CO + O2 -> 2CO2 lies lower than the 2C + O2 -> 2CO curve, making carbon monoxide the thermodynamically favored reducing agent"),
        ("Above 710 °C (983 K) for Fe-C-O system", "IV", "Carbon (coke) is a better reducing agent than CO as ΔG° for 2C + O2 -> 2CO lies lower", 
         "Above 983 K, the downward-sloping 2C + O2 -> 2CO line dips below both Fe/FeO and CO/CO2 lines, making direct reduction by solid carbon thermodynamically predominant"),
        ("Intersection of Mg-MgO line and Al-Al2O3 line at ~1623 K", "I", "Above 1623 K, Al can reduce MgO, but below 1623 K, Mg can reduce Al2O3", 
         "At temperatures below 1623 K, the Mg/MgO line lies below the Al/Al2O3 line (so Mg reduces Al2O3); above 1623 K (due to boiling of Mg, which shifts its slope sharply upward), the Al/Al2O3 line lies lower, allowing Al to reduce MgO"),
        ("Zinc oxide reduction by carbon", "II", "Occurs above ~1000 °C (1270 K) where ΔG°(C -> CO) falls below ΔG°(Zn -> ZnO) and Zn is formed in vapour phase", 
         "The Ellingham line for 2C + O2 -> 2CO crosses below the 2Zn + O2 -> 2ZnO line at ~1270 K (above the boiling point of Zn, 1180 K), producing zinc metal directly as vapour")
    ]
    questions.append(make_matrix_q(
        "chem_app_014", TOPIC, "advanced",
        "Match the critical temperature condition / thermodynamic feasibility in Ellingham diagram in List I with the metallurgical deduction in List II:",
        pairs_014, "B"
    ))

    # chem_app_015 (Advanced, Ans: C)
    pairs_015 = [
        ("Anode mud formation in electrolytic refining of copper", "IV", "Noble metals (Ag, Au, Pt) with higher standard reduction potential than Cu remain unoxidized and settle below the anode", 
         "During electrolytic refining of blister copper, metals like Ag, Au, and Pt have higher reduction potentials (E° > 0.34 V) and do not oxidize into solution, settling beneath the anode as valuable anode mud"),
        ("Carbon anode consumption in Hall-Héroult cell (~0.5 kg C / kg Al)", "I", "Evolved oxygen gas at the anode reacts with carbon at ~1200 K producing CO and CO2 gases", 
         "At ~1200 K, the oxide ions discharge at the carbon anode releasing O2, which instantly attacks the carbon: C + O2 -> CO2 and C + CO2 -> 2CO, consuming ~0.5 kg of carbon per kg of Al produced"),
        ("Use of mercury cathode in Castner-Kellner cell", "II", "Lowers discharge potential of Na+ by forming sodium amalgam (Na-Hg), preventing H2 evolution", 
         "Sodium ions discharge at the mercury cathode at a lower potential than H+ due to large overvoltage of hydrogen on mercury and formation of stable sodium amalgam (Na-Hg)"),
        ("Addition of CaCl2 to NaCl in Down's cell", "III", "Lowers the melting point of electrolyte from 1074 K to ~873 K and prevents vaporization of sodium", 
         "Pure NaCl melts at 1074 K, close to the boiling point of sodium (1156 K); adding CaCl2 forms a eutectic mixture melting at ~873 K, drastically reducing metal vaporization and corrosion")
    ]
    questions.append(make_matrix_q(
        "chem_app_015", TOPIC, "advanced",
        "Match each electrolytic extraction/refining phenomenon in List I with its detailed electrochemical explanation in List II:",
        pairs_015, "C"
    ))

    # chem_app_016 (Advanced, Ans: D)
    pairs_016 = [
        ("Separation of PbS and ZnS occurring together in lead-zinc ore", "I", "Addition of NaCN depressant forming soluble [Zn(CN)4]2- while PbS floats with xanthate", 
         "NaCN selectively complexes Zn2+ on the surface of ZnS particles to form water-soluble [Zn(CN)4]2-, leaving PbS particles free to adsorb collector xanthate and float in the froth"),
        ("Removal of arsenic and antimony impurities from copper ores", "II", "Roasting in reverberatory furnace converts them to volatile oxides As2O3 and Sb2O3 which escape", 
         "During roasting in an oxidizing atmosphere, volatile non-metallic impurities like sulfur, arsenic, and antimony are oxidized to gaseous SO2, As2O3, and Sb2O3, escaping in flue gases"),
        ("Preventing Al2O3 dissolution loss as sodium silicate during Bayer process", "III", "Digest bauxite with concentrated NaOH where silica reacts to form insoluble hydrated sodium aluminium silicate", 
         "Reactive silica (kaolinite) reacts with NaOH and Al2O3 to precipitate an insoluble sodium aluminium silicate desilication product (DSP), locking silica in red mud"),
        ("High affinity of titanium and zirconium for nitrogen and oxygen at high temperatures", "IV", "Van Arkel process using iodine under high vacuum to transport metal as volatile MI4 vapor", 
         "Because Ti and Zr react vigorously with O2, N2, and C at high temperatures forming embrittling interstitial compounds, thermal dissociation of volatile iodides on a white-hot filament under vacuum is used")
    ]
    questions.append(make_matrix_q(
        "chem_app_016", TOPIC, "advanced",
        "Match the metallurgical problem/challenge in List I with the precise chemical strategy used to overcome it in List II:",
        pairs_016, "D"
    ))

    # chem_app_017 (Advanced, Ans: A)
    pairs_017 = [
        ("[Au(CN)2]-", "II", "Water-soluble aurocyanide complex formed during oxidative leaching of native gold by cyanide", 
         "In the MacArthur-Forrest process, gold dissolves according to 4Au + 8CN- + 2H2O + O2 -> 4[Au(CN)2]- + 4OH-, yielding the linear coordination complex dicyanoaurate(I)"),
        ("[Zn(CN)4]2-", "IV", "Tetrahedral cyano complex formed when Zn reduces [Au(CN)2]- or when ZnS is depressed", 
         "During precipitation of gold by zinc dust, zinc is oxidized to tetrahedral tetracyanozincate(II): 2[Au(CN)2]- + Zn + 2CN- -> [Zn(CN)4]2- + 2Au"),
        ("Ni(CO)4", "I", "Diamagnetic tetrahedral volatile coordination complex boiling at 43 °C used in Mond process", 
         "Nickel reacts with CO at 330-350 K to form nickel tetracarbonyl Ni(CO)4, a sp3 hybridized zero-valent tetrahedral complex with b.p. 43 °C"),
        ("[Al(OH)4]-", "III", "Soluble tetrahydroxidoaluminate(III) complex formed by dissolving bauxite in concentrated NaOH", 
         "Amphoteric alumina dissolves in aqueous NaOH at 473-523 K to form sodium tetrahydroxidoaluminate(III), Na[Al(OH)4], separating Al from basic iron oxide gangue")
    ]
    questions.append(make_matrix_q(
        "chem_app_017", TOPIC, "advanced",
        "Match the complex ion / chemical intermediate formed during extraction in List I with its role/formula in List II:",
        pairs_017, "A"
    ))

    # chem_app_018 (Advanced, Ans: B)
    pairs_018 = [
        ("Magnesite (MgO) lining", "III", "Basic refractory lining used to remove acidic phosphorus and silicon impurities in steel making", 
         "Magnesite (calcined MgO) and dolomite (CaO·MgO) provide a basic refractory lining in basic Bessemer/LD converters, reacting with acidic P2O5 and SiO2 to form slag"),
        ("Silica (SiO2) bricks", "I", "Acidic refractory lining used in furnaces when basic oxides (like FeO) need to be scorified into slag", 
         "Acidic furnace linings made of silica bricks (SiO2) withstand acidic environments and react with basic FeO during copper converting to form iron silicate"),
        ("Chromite (FeCr2O4) bricks", "IV", "Neutral refractory lining that does not react with either acidic or basic slags at high temperatures", 
         "Chromite and carborundum are neutral refractories that neither react with basic oxides (CaO, FeO) nor acidic oxides (SiO2, P2O5), making them versatile separating courses"),
        ("Graphite / Carbon lining", "II", "Inert reducing refractory lining serving as cathode in the Hall-Héroult cell", 
         "The bottom of the electrolytic cell for aluminium extraction is lined with carbon/graphite blocks, which resist molten fluoride corrosion and act as the cathode")
    ]
    questions.append(make_matrix_q(
        "chem_app_018", TOPIC, "advanced",
        "Match the refractory material / furnace lining in List I with its chemical nature and application in List II:",
        pairs_018, "B"
    ))

    # chem_app_019 (Advanced, Ans: C)
    pairs_019 = [
        ("2Cu2O + Cu2S -> 6Cu + SO2", "IV", "Cuprous sulfide acts as reducing agent for cuprous oxide in Bessemer converter generating blister copper", 
         "In copper pyrometallurgy, cuprous sulfide partially oxidizes to Cu2O; the unreacted Cu2S then acts as internal reductant reducing Cu2O to metallic copper"),
        ("2PbO + PbS -> 3Pb + SO2", "III", "Lead monoxide reacts with remaining galena at elevated temperature without external reducing agent", 
         "In lead roasting-reduction, partial roasting converts part of galena to PbO; raising temperature causes PbS to reduce PbO directly to molten lead"),
        ("PbSO4 + PbS -> 2Pb + 2SO2", "II", "Lead sulfate formed during partial roasting reacts with residual sulfide to yield metallic lead", 
         "Any lead sulfate formed during low-temperature oxidation reacts with residual lead sulfide at higher temperatures: PbSO4 + PbS -> 2Pb + 2SO2"),
        ("HgS + 2HgO -> 3Hg + SO2", "I", "Mercuric sulfide reacts with mercuric oxide upon heating cinnabar in air to give metallic mercury", 
         "When cinnabar (HgS) is roasted in air, HgO forms and spontaneously auto-reduces with unreacted HgS to give mercury vapour, which is condensed")
    ]
    questions.append(make_matrix_q(
        "chem_app_019", TOPIC, "advanced",
        "Match the auto-reduction / self-reduction reaction in List I with its stoichiometric and thermodynamic description in List II:",
        pairs_019, "C"
    ))

    # chem_app_020 (Advanced, Ans: D)
    pairs_020 = [
        ("Aluminium cannot be extracted by carbon reduction of Al2O3", "I", "Extremely high temperature (>2000 °C) required where aluminium carbide (Al4C3) forms and Al boils off", 
         "The Ellingham line for C -> CO lies below Al2O3 only above 2000 °C; at such temperatures aluminium boils off, and carbon reacts with Al to form brittle Al4C3"),
        ("Magnesium cannot be reduced by carbon at ordinary blast furnace temperatures", "II", "Requires temperature >2000 K where reduction reaction is reversible upon cooling (shock cooling required)", 
         "Reduction of MgO by carbon requires T > 2270 K; because the reaction MgO + C <=> Mg + CO is reversible, cooling must be instantaneous (shock cooling with hydrogen or oil) to avoid back-reaction"),
        ("Titanium cannot be reduced from TiO2 using carbon", "III", "Carbon forms extremely stable and brittle interstitial titanium carbide (TiC) rather than pure metal", 
         "Attempting to reduce TiO2 with carbon produces titanium carbide (TiC) rather than metal; hence titanium is extracted via the Kroll process reducing TiCl4 with Mg in argon"),
        ("Iron oxide (FeO) can be reduced by carbon at temperatures >1000 K", "IV", "Ellingham curve for 2C + O2 -> 2CO drops below Fe + 1/2 O2 -> FeO making ΔG° negative", 
         "Above ~1000 K (710 °C), the 2C + O2 -> 2CO curve has a negative slope and drops below the Fe/FeO curve, rendering FeO + C -> Fe + CO thermodynamically feasible with negative ΔG°")
    ]
    questions.append(make_matrix_q(
        "chem_app_020", TOPIC, "advanced",
        "Match the metal extraction pathway in List I with the specific Ellingham / reduction constraint in List II:",
        pairs_020, "D"
    ))

    return questions
