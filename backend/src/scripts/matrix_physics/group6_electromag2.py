from builder import make_matrix_q

def get_questions():
    qs = []
    
    # ==========================================
    # TOPIC 1: Moving Charges and Magnetism (20 questions: 4 beg, 8 inter, 8 adv)
    # ==========================================
    t1 = "Moving Charges and Magnetism"
    p1 = "phy_mat_mcm"
    
    # 4 Beginner
    qs.append(make_matrix_q(f"{p1}_001", t1, "beginner",
        "Match the motion of a charge q with velocity v in a uniform magnetic field B in List I with the magnetic force magnitude in List II:",
        [
            ("Charge moving parallel to the magnetic field (θ = 0°)", "I", "0", "Since θ = 0°, F = q v B sin(0°) = 0"),
            ("Charge moving perpendicular to the magnetic field (θ = 90°)", "IV", "q v B", "Since θ = 90°, sin(90°) = 1, so F = q v B is maximum"),
            ("Charge moving at an angle θ = 30° to the magnetic field", "II", "q v B / 2", "Since sin(30°) = 1/2, F = (1/2) q v B"),
            ("Charge moving at an angle θ = 45° to the magnetic field", "III", "q v B / √2", "Since sin(45°) = 1/√2, F = q v B / √2")
        ], "A"))

    qs.append(make_matrix_q(f"{p1}_002", t1, "beginner",
        "Match the current-carrying geometries carrying steady current I in List I with the magnetic field magnitude B at the specified observation point in List II:",
        [
            ("Center of a full circular loop of radius R", "III", "μ₀ I / (2R)", "At the center of a circular loop, B = μ₀ I / (2R)"),
            ("Center of a semicircular arc of radius R", "I", "μ₀ I / (4R)", "For a semicircle of arc angle π, B = (π / 2π)[μ₀ I / (2R)] = μ₀ I / (4R)"),
            ("Center of a quarter-circular arc of radius R", "IV", "μ₀ I / (8R)", "For a quarter-circle of arc angle π/2, B = (1/4)[μ₀ I / (2R)] = μ₀ I / (8R)"),
            ("Perpendicular distance R from an infinitely long straight wire", "II", "μ₀ I / (2π R)", "By Ampere's circuital law, B = μ₀ I / (2π R)")
        ], "B"))

    qs.append(make_matrix_q(f"{p1}_003", t1, "beginner",
        "Charged particles are projected perpendicularly into a uniform magnetic field B with equal kinetic energy K. Match each particle in List I with its orbital radius in List II (r₀ = √(2mK) / (qB)):",
        [
            ("Proton (mass m, charge q)", "II", "r₀", "r = √(2mK)/(qB) = r₀"),
            ("Deuteron (mass 2m, charge q)", "IV", "√2 r₀", "r = √(2(2m)K)/(qB) = √2 r₀"),
            ("Tritium nucleus (mass 3m, charge q)", "I", "√3 r₀", "r = √(2(3m)K)/(qB) = √3 r₀"),
            ("Hypothetical tetra-proton ion (mass 4m, charge q)", "III", "2 r₀", "r = √(2(4m)K)/(qB) = 2 r₀")
        ], "C"))

    qs.append(make_matrix_q(f"{p1}_004", t1, "beginner",
        "Match the regular polygonal loops of side length a carrying steady current I in List I with the magnetic field magnitude at their respective geometric centers in List II:",
        [
            ("Square loop of side a", "III", "2√2 μ₀ I / (π a)", "Square has 4 sides at distance d = a/2: B = 4 × [μ₀ I / (4π(a/2))](2 sin 45°) = 2√2 μ₀ I / (π a)"),
            ("Equilateral triangular loop of side a", "I", "9 μ₀ I / (2π a)", "Triangle has 3 sides at distance d = a/(2√3): B = 3 × [μ₀ I / (4π(a/(2√3)))](2 sin 60°) = 9 μ₀ I / (2π a)"),
            ("Regular hexagonal loop of side a", "IV", "√3 μ₀ I / (π a)", "Hexagon has 6 sides at distance d = (√3/2)a: B = 6 × [μ₀ I / (4π(√3 a/2))](2 sin 30°) = √3 μ₀ I / (π a)"),
            ("Regular octagonal loop of side a", "II", "2(√2 + 1) μ₀ I / (π a)", "Octagon has 8 sides at d = a(1+√2)/2: B = 8 × [μ₀ I / (4π d)](2 sin 22.5°) = 2(√2 + 1) μ₀ I / (π a)")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{p1}_005", t1, "intermediate",
        "A particle of mass m and charge q enters a uniform magnetic field B along the z-axis with velocity v = v_perp i + v_parallel k. Match the helical trajectory parameters in List I with their expressions in List II:",
        [
            ("Radius of helical path", "I", "m v_perp / (q B)", "Centripetal force is provided by magnetic force: q v_perp B = m v_perp² / r => r = m v_perp / (q B)"),
            ("Pitch of the helix", "IV", "2π m v_parallel / (q B)", "Pitch = v_parallel × T = v_parallel × (2π m / (q B))"),
            ("Time period of one revolution", "II", "2π m / (q B)", "Time period T = 2π r / v_perp = 2π m / (q B), which is independent of speed"),
            ("Total kinetic energy of the particle", "III", "(1/2) m (v_perp² + v_parallel²)", "Total kinetic energy is (1/2) m v² = (1/2) m (v_perp² + v_parallel²)")
        ], "A"))

    qs.append(make_matrix_q(f"{p1}_006", t1, "intermediate",
        "A long solid cylindrical wire of radius R carries a steady current I uniformly distributed over its cross-section. Match the radial distances r from the cylinder axis in List I with the magnetic field magnitude B(r) in List II:",
        [
            ("At the central axis (r = 0)", "II", "0", "At r = 0, enclosed current is zero, so B = 0"),
            ("Inside the wire at r = R/3", "IV", "μ₀ I / (6π R)", "Inside, B(r) = μ₀ I r / (2π R²); for r = R/3, B = μ₀ I / (6π R)"),
            ("At the wire surface (r = R)", "I", "μ₀ I / (2π R)", "At surface r = R, B = μ₀ I / (2π R)"),
            ("Outside the wire at r = 2R", "III", "μ₀ I / (4π R)", "Outside, B(r) = μ₀ I / (2π r); for r = 2R, B = μ₀ I / (4π R)")
        ], "B"))

    qs.append(make_matrix_q(f"{p1}_007", t1, "intermediate",
        "Two long straight parallel wires separated by distance d carry currents I₁ and I₂. Match the current arrangements in List I with the magnetic force per unit length F/L and interaction nature in List II:",
        [
            ("I₁ = I, I₂ = I, same direction", "IV", "μ₀ I² / (2π d) (attractive)", "F/L = μ₀ I₁ I₂ / (2π d); currents in the same direction attract each other"),
            ("I₁ = 2I, I₂ = I, opposite direction", "I", "μ₀ I² / (π d) (repulsive)", "F/L = μ₀(2I)(I) / (2π d) = μ₀ I² / (π d); opposite currents repel each other"),
            ("I₁ = 3I, I₂ = 2I, same direction", "II", "3μ₀ I² / (π d) (attractive)", "F/L = μ₀(3I)(2I) / (2π d) = 3μ₀ I² / (π d); attractive interaction"),
            ("I₁ = 4I, I₂ = 2I, opposite direction", "III", "4μ₀ I² / (π d) (repulsive)", "F/L = μ₀(4I)(2I) / (2π d) = 4μ₀ I² / (π d); repulsive interaction")
        ], "C"))

    qs.append(make_matrix_q(f"{p1}_008", t1, "intermediate",
        "A galvanometer has coil resistance G = 99 Ω and full-scale deflection current I_g = 1 mA. Match the target measurement instrument specification in List I with the required resistance in List II:",
        [
            ("Ammeter of range 0 to 100 mA", "II", "1 Ω in parallel", "Shunt S = I_g G / (I - I_g) = (1 mA × 99 Ω) / (99 mA) = 1 Ω in parallel"),
            ("Ammeter of range 0 to 10 mA", "IV", "11 Ω in parallel", "Shunt S = (1 mA × 99 Ω) / (9 mA) = 11 Ω in parallel"),
            ("Voltmeter of range 0 to 1 V", "I", "901 Ω in series", "Series R = V / I_g - G = 1 / (10⁻³) - 99 = 1000 - 99 = 901 Ω in series"),
            ("Voltmeter of range 0 to 10 V", "III", "9901 Ω in series", "Series R = 10 / (10⁻³) - 99 = 10000 - 99 = 9901 Ω in series")
        ], "D"))

    qs.append(make_matrix_q(f"{p1}_009", t1, "intermediate",
        "A planar circular loop of radius R carrying current I is placed in a uniform magnetic field B. Match the physical quantities in List I with their expressions in List II:",
        [
            ("Magnetic dipole moment magnitude of the loop", "I", "I π R²", "Magnetic dipole moment M = I A = I π R²"),
            ("Maximum torque experienced by the loop in field B", "III", "I π R² B", "τ_max = M B sin(90°) = I π R² B"),
            ("Work done to rotate loop from θ = 0° (stable equilibrium) to θ = 180°", "IV", "2 I π R² B", "W = M B [cos(0°) - cos(180°)] = 2 M B = 2 I π R² B"),
            ("Potential energy of the loop when M is perpendicular to B (θ = 90°)", "II", "0", "U = -M · B = -M B cos(90°) = 0")
        ], "A"))

    qs.append(make_matrix_q(f"{p1}_010", t1, "intermediate",
        "Match the straight wire configurations carrying steady current I in List I with the magnetic field magnitude at the specified point P in List II:",
        [
            ("Semi-infinite wire from x = 0 to ∞, point P at distance d along perpendicular bisector from x = 0", "IV", "μ₀ I / (4π d)", "B = (μ₀ I / 4π d)(sin 90° + sin 0°) = μ₀ I / (4π d)"),
            ("Infinite straight wire from -∞ to +∞ at perpendicular distance d", "II", "μ₀ I / (2π d)", "B = (μ₀ I / 4π d)(sin 90° + sin 90°) = μ₀ I / (2π d)"),
            ("Finite wire of length L at perpendicular distance d = L/2 from its midpoint", "I", "√2 μ₀ I / (2π L)", "α = β = 45°, B = (μ₀ I / 4π(L/2))(2 sin 45°) = √2 μ₀ I / (2π L)"),
            ("Finite wire subtending angles α = 30° and β = 60° at perpendicular distance d", "III", "(1 + √3) μ₀ I / (8π d)", "B = (μ₀ I / 4π d)(sin 30° + sin 60°) = (1 + √3) μ₀ I / (8π d)")
        ], "B"))

    qs.append(make_matrix_q(f"{p1}_011", t1, "intermediate",
        "Match the magnetic field expressions in List I with their corresponding locations for solenoids and toroids carrying steady current I in List II:",
        [
            ("Inside an infinitely long ideal solenoid with n turns per unit length", "II", "μ₀ n I", "Far from ends of an ideal solenoid, field is uniform: B = μ₀ n I"),
            ("At the center of an end face of a semi-infinite solenoid with n turns per unit length", "IV", "μ₀ n I / 2", "By symmetry, field at the end face is half that of an infinite solenoid: B = μ₀ n I / 2"),
            ("Inside the core of a toroid of mean radius r with N total turns", "I", "μ₀ N I / (2π r)", "By Ampere's circuital law, 2π r B = μ₀ N I => B = μ₀ N I / (2π r)"),
            ("In the open central cavity enclosed by the toroid ring", "III", "0", "No current is enclosed by an Amperian loop in the inner empty cavity, so B = 0")
        ], "C"))

    qs.append(make_matrix_q(f"{p1}_012", t1, "intermediate",
        "A cyclotron accelerates particles of charge q and mass m in a magnetic field B between dees of radius R. Match the cyclotron operational parameters in List I with their expressions in List II:",
        [
            ("Cyclotron oscillation frequency f", "III", "q B / (2π m)", "f = 1/T = q B / (2π m), which is independent of particle speed"),
            ("Maximum speed v_max of particles exiting the dees", "I", "q B R / m", "Centripetal balance at Dee radius R gives m v_max² / R = q v_max B => v_max = q B R / m"),
            ("Maximum kinetic energy K_max of particles exiting the dees", "IV", "q² B² R² / (2m)", "K_max = (1/2) m v_max² = q² B² R² / (2m)"),
            ("Time spent by particle inside a dee during one half-turn", "II", "π m / (q B)", "Half period t = T/2 = π m / (q B)")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{p1}_013", t1, "advanced",
        "A coaxial cable has an inner solid cylindrical conductor of radius a and a thin outer coaxial cylindrical shell of radius b (b > a). Equal and opposite currents I flow in the inner conductor (uniformly distributed) and outer shell. Match the radial distance r from the axis in List I with the magnetic field B(r) in List II:",
        [
            ("r < a (inside the inner solid conductor)", "I", "μ₀ I r / (2π a²)", "By Ampere's law: 2π r B = μ₀ I (π r² / π a²) => B = μ₀ I r / (2π a²)"),
            ("a < r < b (in the annular space between conductors)", "III", "μ₀ I / (2π r)", "Amperian loop encloses only the inner current I: 2π r B = μ₀ I => B = μ₀ I / (2π r)"),
            ("r > b (outside the entire coaxial cable)", "II", "0", "Net enclosed current I_enc = I - I = 0, so B = 0"),
            ("Inside an off-axis cylindrical cavity with axis displacement d in a conductor of current density J", "IV", "μ₀ J d / 2", "By vector superposition: B = (μ₀ J / 2)|r₁ - r₂| = μ₀ J d / 2 (uniform field)")
        ], "A"))

    qs.append(make_matrix_q(f"{p1}_014", t1, "advanced",
        "A regular n-sided polygon carrying current I is inscribed in a circle of radius R. Match the polygon geometry in List I with the exact magnetic field at its center in List II (B_n = (n μ₀ I / (2π R)) tan(π/n)):",
        [
            ("Equilateral triangle (n = 3)", "IV", "3√3 μ₀ I / (2π R)", "For n = 3: tan(π/3) = √3, so B = (3 μ₀ I / 2π R) √3 = 3√3 μ₀ I / (2π R)"),
            ("Square (n = 4)", "I", "2 μ₀ I / (π R)", "For n = 4: tan(π/4) = 1, so B = (4 μ₀ I / 2π R)(1) = 2 μ₀ I / (π R)"),
            ("Regular hexagon (n = 6)", "II", "√3 μ₀ I / (π R)", "For n = 6: tan(π/6) = 1/√3, so B = (6 μ₀ I / 2π R)(1/√3) = √3 μ₀ I / (π R)"),
            ("Regular octagon (n = 8)", "III", "4(√2 - 1) μ₀ I / (π R)", "For n = 8: tan(π/8) = √2 - 1, so B = (8 μ₀ I / 2π R)(√2 - 1) = 4(√2 - 1) μ₀ I / (π R)")
        ], "B"))

    qs.append(make_matrix_q(f"{p1}_015", t1, "advanced",
        "A conducting wire carrying steady current I is placed in a uniform magnetic field B directed perpendicular to the wire plane. Match the wire geometry in List I with the magnitude of net magnetic force experienced in List II:",
        [
            ("Closed circular loop of radius R", "II", "0", "For any closed loop in a uniform field, vector displacement L' = 0, so F = I(L' × B) = 0"),
            ("Semicircular wire of radius R connecting two endpoints", "IV", "2 I B R", "Effective vector displacement is diameter L' = 2R, so F = I(2R)B = 2 I B R"),
            ("Quarter-circular arc of radius R connecting two endpoints", "I", "√2 I B R", "Chord connecting endpoints has length L' = √(R² + R²) = √2 R, so F = √2 I B R"),
            ("Three sides of a square of side R connecting adjacent corners", "III", "I B R", "Vector displacement connecting start to end equals the missing fourth side of length R, so F = I B R")
        ], "C"))

    qs.append(make_matrix_q(f"{p1}_016", t1, "advanced",
        "A particle of mass m and positive charge q is released from rest at the origin (0, 0, 0) in crossed uniform fields E = E j and B = B k. Match the cycloidal trajectory characteristics in List I with their expressions in List II:",
        [
            ("Maximum y-coordinate reached (y_max)", "III", "2 m E / (q B²)", "Trajectory is a cycloid generated by rolling circle of radius r = m E / (q B²); y_max = 2r = 2 m E / (q B²)"),
            ("Maximum speed attained by the particle", "I", "2 E / B", "Speed at top of cycloid: v_max = 2 v_drift = 2(E/B)"),
            ("Time taken to reach the first crest (y = y_max)", "IV", "π m / (q B)", "Time to crest is half the cyclotron period: t = π/ω = π m / (q B)"),
            ("Net drift velocity along the x-direction", "II", "E / B i", "Guiding center drifts along (E × B) direction with drift speed v_d = E / B")
        ], "D"))

    qs.append(make_matrix_q(f"{p1}_017", t1, "advanced",
        "A long solid cylindrical conductor of radius R carries a non-uniform current density J(r) = J₀ (r/R) along its axis, where r is the radial distance. Match the physical quantities in List I with their values in List II:",
        [
            ("Total current I carried by the conductor", "I", "(2/3) π J₀ R²", "I = ∫₀ᴿ J(r) 2π r dr = (2π J₀ / R) ∫₀ᴿ r² dr = (2/3) π J₀ R²"),
            ("Magnetic field at r = R/2 inside the conductor", "III", "μ₀ J₀ R / 12", "I_enc(R/2) = (2π J₀ / R)(R³/24) = π J₀ R² / 12; B = μ₀ I_enc / (2π(R/2)) = μ₀ J₀ R / 12"),
            ("Magnetic field at the surface r = R", "IV", "μ₀ J₀ R / 3", "At r = R, B = μ₀ I / (2π R) = μ₀ ((2/3)π J₀ R²) / (2π R) = μ₀ J₀ R / 3"),
            ("Magnetic field at r = 2R outside the conductor", "II", "μ₀ J₀ R / 6", "At r = 2R, B = μ₀ I / (2π(2R)) = μ₀ ((2/3)π J₀ R²) / (4π R) = μ₀ J₀ R / 6")
        ], "A"))

    qs.append(make_matrix_q(f"{p1}_018", t1, "advanced",
        "Two identical concentric circular coils each of radius R carry steady current I. Match the coil orientations in List I with the net magnetic field magnitude at their common center in List II (B₀ = μ₀ I / (2R)):",
        [
            ("Co-planar with currents in opposite directions", "II", "0", "Fields are equal and opposite: B_net = B₀ - B₀ = 0"),
            ("Co-planar with currents in the same direction", "IV", "2 B₀", "Fields add constructively: B_net = B₀ + B₀ = 2 B₀"),
            ("Planes mutually perpendicular (inclination angle 90°)", "I", "√2 B₀", "Fields are perpendicular vectors: B_net = √(B₀² + B₀²) = √2 B₀"),
            ("Planes inclined at 60° to each other with same current direction", "III", "√3 B₀", "B_net = 2 B₀ cos(60°/2) = 2 B₀ cos(30°) = √3 B₀")
        ], "B"))

    qs.append(make_matrix_q(f"{p1}_019", t1, "advanced",
        "A small magnetic dipole M = M i is placed in different magnetic fields. Match the magnetic field configuration in List I with the resulting net force and potential energy in List II:",
        [
            ("Uniform magnetic field B = B i", "IV", "Net force = 0, U = -M B (stable equilibrium)", "Uniform field has zero net force; U = -M · B = -M B (minimum energy)"),
            ("Uniform magnetic field B = -B i", "I", "Net force = 0, U = +M B (unstable equilibrium)", "Uniform field has zero net force; U = -M · (-B i) = +M B (maximum energy)"),
            ("Uniform magnetic field B = B j", "II", "Net force = 0, U = 0, torque = M B k", "Torque τ = M × B = M B k; potential energy U = -M · B = 0"),
            ("Non-uniform magnetic field B = (C x) i", "III", "Net force = M C i, torque = 0", "Force F = ∇(M · B) = ∂(M B_x)/∂x i = M C i; torque is zero since M is parallel to B")
        ], "C"))

    qs.append(make_matrix_q(f"{p1}_020", t1, "advanced",
        "A particle of mass m, charge q, and velocity v enters perpendicularly into a region of uniform magnetic field B of width d. The cyclotron radius is R = m v / (q B). Match the region width d in List I with the angle of deflection θ or behavior in List II:",
        [
            ("d = R / 2", "II", "θ = 30°", "sin θ = d / R = 1/2 => θ = 30°"),
            ("d = R / √2", "IV", "θ = 45°", "sin θ = d / R = 1/√2 => θ = 45°"),
            ("d = (√3 / 2) R", "I", "θ = 60°", "sin θ = d / R = √3/2 => θ = 60°"),
            ("d ≥ R (field occupies half-space x > 0)", "III", "θ = 180° (turns back into initial medium)", "Since d ≥ R, the particle completes a semicircular path and exits through the same boundary, deflecting by 180°")
        ], "D"))


    # ==========================================
    # TOPIC 2: Magnetism and Matter (20 questions: 4 beg, 8 inter, 8 adv)
    # ==========================================
    t2 = "Magnetism and Matter"
    p2 = "phy_mat_magmat"

    # 4 Beginner
    qs.append(make_matrix_q(f"{p2}_001", t2, "beginner",
        "Match the elements of Earth's magnetism in List I with their physical definitions in List II:",
        [
            ("Magnetic Declination", "I", "Angle between geographic meridian and magnetic meridian", "Declination is the horizontal angle between geographic north and magnetic north"),
            ("Angle of Dip (Magnetic Inclination)", "IV", "Angle made by total magnetic field with the horizontal plane", "Dip is the angle between Earth's resultant magnetic field and the horizontal"),
            ("Horizontal Component (B_H)", "II", "B cos(δ), component of field along horizontal in magnetic meridian", "B_H = B cos δ, where δ is the angle of dip"),
            ("Magnetic Equator", "III", "Locus of points on Earth's surface where dip angle is 0°", "At the magnetic equator, the magnetic needle rests completely horizontal, so δ = 0°")
        ], "A"))

    qs.append(make_matrix_q(f"{p2}_002", t2, "beginner",
        "Match the classes of magnetic materials in List I with their magnetic susceptibility (χ) characteristics in List II:",
        [
            ("Diamagnetic materials", "III", "Small and negative, independent of temperature", "Diamagnetism arises from orbital electron motion and has small negative χ independent of T"),
            ("Paramagnetic materials", "I", "Small and positive, inversely proportional to absolute temperature", "Paramagnetism obeys Curie's law: χ = C/T"),
            ("Ferromagnetic materials", "IV", "Very large and positive, exhibits hysteresis and domain structure", "Ferromagnets have strong exchange coupling and χ >> 1"),
            ("Superconductors in Meissner state", "II", "χ = -1, exhibits perfect diamagnetism", "Meissner effect expels all flux, giving B = 0 and χ = -1")
        ], "B"))

    qs.append(make_matrix_q(f"{p2}_003", t2, "beginner",
        "Match the magnetic physical quantities in List I with their standard SI units in List II:",
        [
            ("Magnetic dipole moment (M)", "II", "A·m²", "M = I A, so unit is Ampere-meter squared (A·m²)"),
            ("Magnetic intensity / Magnetizing field (H)", "IV", "A/m", "H has dimensions of current per unit length, so A/m"),
            ("Magnetic permeability of vacuum (μ₀)", "I", "T·m/A or H/m", "From B = μ₀ H, μ₀ has unit Tesla-meter/Ampere (T·m/A) or Henry/meter"),
            ("Magnetic susceptibility (χ)", "III", "Dimensionless (unitless)", "χ = M / H, ratio of two quantities with unit A/m, hence dimensionless")
        ], "C"))

    qs.append(make_matrix_q(f"{p2}_004", t2, "beginner",
        "A thin bar magnet has magnetic length 2l, pole strength m, and magnetic moment M = 2ml. Match the geometric modifications in List I with the resulting net magnetic dipole moment in List II:",
        [
            ("Cut transversely at the center into two equal halves", "II", "M / 2", "Length becomes l, pole strength remains m: M' = m l = M / 2"),
            ("Cut longitudinally along its length into three equal thin strips", "IV", "M / 3", "Pole strength becomes m/3, length remains 2l: M' = (m/3)(2l) = M / 3"),
            ("Bent at the midpoint into an L-shape at 90°", "I", "M / √2", "Each arm has length l; distance between poles becomes √(l² + l²) = √2 l: M' = m(√2 l) = M / √2"),
            ("Bent into a semicircular arc of radius R", "III", "2 M / π", "Arc length π R = 2l => 2R = 4l / π; distance between poles is 2R: M' = m(4l / π) = 2 M / π")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{p2}_005", t2, "intermediate",
        "A short bar magnet has magnetic dipole moment M. Match the observation points at distance r from its center (r >> length) in List I with the magnetic field magnitude in List II:",
        [
            ("On the axial line (end-on position)", "I", "μ₀ (2M) / (4π r³)", "Axial field of a short dipole is B_axial = (μ₀/4π)(2M/r³)"),
            ("On the equatorial line (broadside-on position)", "III", "μ₀ M / (4π r³)", "Equatorial field of a short dipole is B_eq = (μ₀/4π)(M/r³)"),
            ("At an angle θ = 60° to the dipole axis", "IV", "√7 μ₀ M / (8π r³)", "B = (μ₀ M / 4π r³) √(1 + 3 cos² 60°) = (μ₀ M / 4π r³) √(1 + 3/4) = √7 μ₀ M / (8π r³)"),
            ("At an angle θ = 45° to the dipole axis", "II", "√10 μ₀ M / (8π r³)", "B = (μ₀ M / 4π r³) √(1 + 3 cos² 45°) = (μ₀ M / 4π r³) √(1 + 3/2) = √10 μ₀ M / (8π r³)")
        ], "A"))

    qs.append(make_matrix_q(f"{p2}_006", t2, "intermediate",
        "A magnetic needle of moment of inertia I and magnetic moment M oscillates in a horizontal magnetic field B_H with time period T = 2π √(I / (M B_H)). Match the modifications in List I with the new time period in List II:",
        [
            ("Magnetic moment is quadrupled (M' = 4M)", "III", "T / 2", "T' ∝ 1/√M' = 1/√4 = 1/2, so T' = T/2"),
            ("Moment of inertia is quadrupled (I' = 4I)", "I", "2 T", "T' ∝ √I' = √4 = 2, so T' = 2T"),
            ("Magnetic moment is reduced to M/9", "IV", "3 T", "T' ∝ 1/√(1/9) = 3, so T' = 3T"),
            ("Magnetic moment quadrupled and field halved (M' = 4M, B_H' = B_H / 2)", "II", "T / √2", "M' B_H' = 2 M B_H => T' = T / √2")
        ], "B"))

    qs.append(make_matrix_q(f"{p2}_007", t2, "intermediate",
        "Match the fundamental relationships and laws of magnetism in List I with their algebraic forms in List II:",
        [
            ("Relation between magnetic flux density B, magnetizing field H, and magnetization M", "II", "B = μ₀ (H + M)", "Constitutive relation in magnetic media: B = μ₀ (H + M)"),
            ("Relation between relative permeability μ_r and magnetic susceptibility χ", "IV", "μ_r = 1 + χ", "Since B = μ₀(1 + χ)H = μ₀ μ_r H, we have μ_r = 1 + χ"),
            ("Curie-Weiss Law for ferromagnetic materials above Curie temperature T_c", "I", "χ = C / (T - T_c)", "Above T_c, ferromagnetic materials become paramagnetic obeying χ = C / (T - T_c)"),
            ("Curie's Law for ideal paramagnetic substances", "III", "χ = C / T", "Susceptibility of paramagnetic materials is inversely proportional to absolute temperature T")
        ], "C"))

    qs.append(make_matrix_q(f"{p2}_008", t2, "intermediate",
        "The true angle of dip at a location is δ. A dip circle is set up in a vertical plane making an angle θ with the magnetic meridian. The apparent dip δ' satisfies tan(δ') = tan(δ) / cos(θ). Match the angle θ in List I with the apparent dip relation in List II:",
        [
            ("θ = 60°", "II", "tan(δ') = 2 tan(δ)", "cos(60°) = 1/2 => tan(δ') = tan(δ) / (1/2) = 2 tan(δ)"),
            ("θ = 45°", "IV", "tan(δ') = √2 tan(δ)", "cos(45°) = 1/√2 => tan(δ') = √2 tan(δ)"),
            ("θ = 30°", "I", "tan(δ') = (2 / √3) tan(δ)", "cos(30°) = √3/2 => tan(δ') = 2 tan(δ) / √3"),
            ("θ = 90° (plane perpendicular to magnetic meridian)", "III", "δ' = 90°", "cos(90°) = 0 => tan(δ') -> ∞, so the needle stands vertically (δ' = 90°)")
        ], "D"))

    qs.append(make_matrix_q(f"{p2}_009", t2, "intermediate",
        "Match the magnetic application / component in List I with the most crucial magnetic property required for the material in List II:",
        [
            ("Permanent magnet (e.g., Alnico, Steel)", "I", "High retentivity and high coercivity", "Permanent magnets must retain magnetization strongly and resist demagnetization"),
            ("Transformer core", "III", "High permeability and low hysteresis loss", "Transformer cores require easy magnetization and low energy dissipation per AC cycle"),
            ("Electromagnet core (e.g., Soft iron)", "IV", "High initial permeability and low retentivity", "Electromagnets should magnetize strongly when energized and demagnetize rapidly when switched off"),
            ("Magnetic shielding enclosure", "II", "Very high permeability to divert flux lines", "Shielding materials channel external magnetic field lines through themselves, protecting the interior")
        ], "A"))

    qs.append(make_matrix_q(f"{p2}_010", t2, "intermediate",
        "Match the location on Earth's surface or condition in List I with the corresponding dip angle δ and field characteristics in List II:",
        [
            ("Magnetic poles of Earth", "IV", "δ = 90°, B_H = 0, B = B_V", "At magnetic poles, Earth's field is purely vertical, so B_H = 0 and δ = 90°"),
            ("Magnetic equator of Earth", "II", "δ = 0°, B_V = 0, B = B_H", "At magnetic equator, Earth's field is purely horizontal, so B_V = 0 and δ = 0°"),
            ("Location where B_H = B_V", "I", "δ = 45°, B = √2 B_H", "tan δ = B_V / B_H = 1 => δ = 45°; B = √(B_H² + B_V²) = √2 B_H"),
            ("Location where B_V = √3 B_H", "III", "δ = 60°, B = 2 B_H", "tan δ = B_V / B_H = √3 => δ = 60°; B = B_H / cos(60°) = 2 B_H")
        ], "B"))

    qs.append(make_matrix_q(f"{p2}_011", t2, "intermediate",
        "A long solenoid of length 2L, radius a, and total turns N carries current I. It behaves as an equivalent bar magnet. Match the physical quantities in List I with their expressions in List II:",
        [
            ("Equivalent magnetic dipole moment M", "II", "N I π a²", "Dipole moment M = N I A = N I π a²"),
            ("Field at large axial distance r from the center (r >> L, a)", "IV", "μ₀ (2 N I π a²) / (4π r³)", "Matches the axial field of an equivalent magnetic dipole: B = (μ₀/4π)(2M/r³)"),
            ("Magnetic field inside along axis away from ends", "I", "μ₀ N I / (2L)", "Inside a solenoid of length 2L, n = N/(2L), so B = μ₀ n I = μ₀ N I / (2L)"),
            ("Magnetic field at the center of an end face", "III", "μ₀ N I / (4L)", "At the end face of a long solenoid, field is half the internal field: B = (1/2) μ₀ n I = μ₀ N I / (4L)")
        ], "C"))

    qs.append(make_matrix_q(f"{p2}_012", t2, "intermediate",
        "Match the materials in List I with their characteristic magnetic susceptibility (χ) values at room temperature in List II:",
        [
            ("Bismuth (diamagnetic)", "III", "-1.6 × 10⁻⁴ (small and negative)", "Diamagnetic materials have small, negative susceptibility (repelled by magnetic fields)"),
            ("Aluminium (paramagnetic)", "I", "+2.3 × 10⁻⁵ (small and positive)", "Paramagnetic materials have small, positive susceptibility (weakly attracted)"),
            ("Soft iron (ferromagnetic)", "IV", "+5000 (very large and positive)", "Ferromagnetic materials have high domain alignment giving susceptibility in thousands"),
            ("Lead below its critical temperature (T < 7.2 K)", "II", "-1 (exact negative unity)", "Superconductors in Meissner state have χ = -1, exhibiting complete flux expulsion")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{p2}_013", t2, "advanced",
        "Two identical bar magnets, each of magnetic moment M and moment of inertia I, oscillate together in a vibration magnetometer in Earth's field B_H. The period of a single magnet is T₀ = 2π √(I / (M B_H)). Match the two-magnet configurations in List I with the resulting oscillation period in List II:",
        [
            ("Placed one over the other with like poles together (sum position)", "I", "T₀", "I_net = 2I, M_net = 2M => T = 2π √(2I / (2M B_H)) = T₀"),
            ("Placed one over the other with opposite poles together (difference position)", "III", "∞ (no oscillation)", "M_net = M - M = 0 => restoring torque is zero, T -> ∞"),
            ("Fixed mutually perpendicular forming a cross (T- or +-shaped)", "IV", "2^(1/4) T₀", "I_net = 2I, M_net = √(M² + M²) = √2 M => T = 2π √(2I / (√2 M B_H)) = 2^(1/4) T₀"),
            ("One magnet paired with an identical non-magnetic brass bar", "II", "√2 T₀", "I_net = 2I, M_net = M => T = 2π √(2I / (M B_H)) = √2 T₀")
        ], "A"))

    qs.append(make_matrix_q(f"{p2}_014", t2, "advanced",
        "A short bar magnet of magnetic moment M is placed in the magnetic meridian in Earth's horizontal field B_H. Match the arrangement and neutral point parameters in List I with their descriptions in List II:",
        [
            ("North pole pointing North: location of neutral points", "IV", "Two points on the broadside-on (equatorial) line at distance d_eq = (μ₀ M / (4π B_H))^(1/3)", "On equatorial line, magnet's field is Southwards, exactly cancelling Northward B_H"),
            ("North pole pointing South: location of neutral points", "II", "Two points on the end-on (axial) line at distance d_ax = (2 μ₀ M / (4π B_H))^(1/3)", "On axial line, magnet's field points Southwards, cancelling Northward B_H"),
            ("Ratio of equatorial to axial neutral point distances (d_eq / d_ax)", "I", "1 / 2^(1/3)", "Since d_eq³ = μ₀ M / (4π B_H) and d_ax³ = 2 μ₀ M / (4π B_H), d_eq / d_ax = 1 / 2^(1/3)"),
            ("Magnetic field at distance d_eq along axial line when N-pole points North", "III", "3 B_H", "B_axial = 2 B_eq = 2 B_H; total field B_total = B_axial + B_H = 3 B_H")
        ], "B"))

    qs.append(make_matrix_q(f"{p2}_015", t2, "advanced",
        "A magnetic dipole with moment M = M₀(i + √3 j) is placed in a uniform magnetic field B = B₀(√3 i + j). Match the dipole interaction parameters in List I with their values in List II:",
        [
            ("Potential energy U = -M · B of the dipole", "II", "-2√3 M₀ B₀", "M · B = M₀ B₀ (1·√3 + √3·1) = 2√3 M₀ B₀; U = -M · B = -2√3 M₀ B₀"),
            ("Magnitude of the torque |τ| = |M × B|", "IV", "2 M₀ B₀", "M × B = M₀ B₀ (1·1 - √3·√3) k = -2 M₀ B₀ k => |τ| = 2 M₀ B₀"),
            ("Angle θ between dipole moment M and magnetic field B", "I", "30°", "cos θ = (M · B) / (|M| |B|) = 2√3 / (2 × 2) = √3/2 => θ = 30°"),
            ("Work done by external agent to rotate the dipole to anti-parallel orientation", "III", "4√3 M₀ B₀", "W = U_final - U_initial = (+2√3 M₀ B₀) - (-2√3 M₀ B₀) = 4√3 M₀ B₀")
        ], "C"))

    qs.append(make_matrix_q(f"{p2}_016", t2, "advanced",
        "Let δ be the true angle of dip, and let δ₁ and δ₂ be the apparent dip angles observed in two mutually perpendicular vertical planes (cot²(δ) = cot²(δ₁) + cot²(δ₂)). Match the given apparent dip angles in List I with the true dip in List II:",
        [
            ("δ₁ = 45° and δ₂ = 45°", "III", "tan(δ) = 1 / √2", "cot² δ = cot² 45° + cot² 45° = 1 + 1 = 2 => cot δ = √2 => tan δ = 1/√2"),
            ("δ₁ = 30° and δ₂ = 60°", "I", "tan(δ) = √(3/10)", "cot² δ = (√3)² + (1/√3)² = 3 + 1/3 = 10/3 => tan² δ = 3/10 => tan δ = √(3/10)"),
            ("δ₁ = 30° and δ₂ = 45°", "IV", "tan(δ) = 1/2", "cot² δ = (√3)² + (1)² = 3 + 1 = 4 => cot δ = 2 => tan δ = 1/2"),
            ("True dip δ = 45° and δ₁ = 60° (find apparent dip δ₂)", "II", "tan(δ₂) = √(3/2)", "cot² 45° = cot² 60° + cot² δ₂ => 1 = 1/3 + cot² δ₂ => cot² δ₂ = 2/3 => tan δ₂ = √(3/2)")
        ], "D"))

    qs.append(make_matrix_q(f"{p2}_017", t2, "advanced",
        "A toroid of mean circumference 2π r = 1 m has N = 1000 turns carrying current I = 2 A. Its core is filled with iron of relative permeability μ_r = 500. Match the magnetic quantities in List I with their values in List II:",
        [
            ("Magnetizing field H", "I", "2000 A/m", "H = N I / (2π r) = 1000 × 2 / 1 = 2000 A/m"),
            ("Magnetic susceptibility χ of the iron core", "III", "499", "χ = μ_r - 1 = 500 - 1 = 499"),
            ("Magnetization M of the iron core", "IV", "9.98 × 10⁵ A/m", "M = χ H = 499 × 2000 = 9.98 × 10⁵ A/m"),
            ("Total magnetic flux density B inside the core", "II", "0.4π T (≈ 1.257 T)", "B = μ₀ μ_r H = (4π × 10⁻⁷)(500)(2000) = 0.4π T")
        ], "A"))

    qs.append(make_matrix_q(f"{p2}_018", t2, "advanced",
        "A bar magnet of magnetic dipole moment M is placed in a uniform magnetic field B. Match the angular rotation in List I with the work done by the external torque W = M B (cos θ₁ - cos θ₂) in List II:",
        [
            ("Rotated from θ₁ = 0° to θ₂ = 60°", "IV", "0.5 M B", "W = M B (cos 0° - cos 60°) = M B (1 - 0.5) = 0.5 M B"),
            ("Rotated from θ₁ = 0° to θ₂ = 90°", "I", "M B", "W = M B (cos 0° - cos 90°) = M B (1 - 0) = M B"),
            ("Rotated from θ₁ = 0° to θ₂ = 180°", "III", "2 M B", "W = M B (cos 0° - cos 180°) = M B (1 - (-1)) = 2 M B"),
            ("Rotated from θ₁ = 60° to θ₂ = 180°", "II", "1.5 M B", "W = M B (cos 60° - cos 180°) = M B (0.5 - (-1)) = 1.5 M B")
        ], "B"))

    qs.append(make_matrix_q(f"{p2}_019", t2, "advanced",
        "Match the temperature-dependent magnetic phenomena in List I with their physical description in List II:",
        [
            ("Ferromagnetic behavior above the Curie temperature T_c", "II", "Transitions to paramagnetic state following χ = C / (T - T_c)", "Thermal agitation destroys long-range domain order, causing transition to paramagnetism"),
            ("Paramagnetic susceptibility as temperature approaches T -> 0 K", "IV", "Increases sharply and tends toward saturation", "According to Curie's law χ = C/T, susceptibility grows as thermal disorder decreases"),
            ("Diamagnetic susceptibility as temperature increases from 100 K to 500 K", "I", "Remains practically unchanged", "Diamagnetism is an induced orbital effect independent of thermal agitation"),
            ("Antiferromagnetic substance above Néel temperature T_N", "III", "Transitions to paramagnetic behavior", "Above the Néel temperature T_N, antiparallel spin ordering collapses into paramagnetism")
        ], "C"))

    qs.append(make_matrix_q(f"{p2}_020", t2, "advanced",
        "A ferromagnetic core of volume V = 2 × 10⁻³ m³ is cycled around its hysteresis loop at frequency f = 50 Hz. The area of the B-H loop is 400 J/m³. Match the energy loss quantities in List I with their values in List II:",
        [
            ("Hysteresis loss per unit volume per cycle", "III", "400 J/m³", "Area of the B-H loop represents the energy dissipated per unit volume per cycle: 400 J/m³"),
            ("Power loss per unit volume (power loss density)", "I", "20 kW/m³", "Power density = Area × f = 400 J/m³ × 50 s⁻¹ = 20,000 W/m³ = 20 kW/m³"),
            ("Total power dissipated as heat in the entire core", "IV", "40 W", "P = Power density × V = 20,000 W/m³ × 2 × 10⁻³ m³ = 40 W"),
            ("Total heat generated in the core during 5 minutes (300 s) of operation", "II", "12 kJ", "Q = P × t = 40 W × 300 s = 12,000 J = 12 kJ")
        ], "D"))


    # ==========================================
    # TOPIC 3: Electromagnetic Induction (20 questions: 4 beg, 8 inter, 8 adv)
    # ==========================================
    t3 = "Electromagnetic Induction"
    p3 = "phy_mat_emi"

    # 4 Beginner
    qs.append(make_matrix_q(f"{p3}_001", t3, "beginner",
        "A coil of N turns and electrical resistance R experiences a change in magnetic flux ΔΦ in time interval Δt. Match the induction quantities in List I with their expressions in List II:",
        [
            ("Magnitude of induced electromotive force (EMF)", "I", "N |ΔΦ / Δt|", "By Faraday's law, induced EMF magnitude is ε = N |dΦ/dt| = N |ΔΦ/Δt|"),
            ("Magnitude of induced electric current", "IV", "(N / R) |ΔΦ / Δt|", "By Ohm's law, induced current is I = ε / R = (N / R) |ΔΦ/Δt|"),
            ("Total induced electric charge passing through the coil", "II", "N ΔΦ / R", "Total charge Δq = ∫ I dt = (N/R) ∫ dΦ = N ΔΦ / R, completely independent of Δt"),
            ("Rate of Joule heat dissipation in the coil", "III", "(N² / R) (ΔΦ / Δt)²", "Power P = I² R = ε² / R = (N² / R)(ΔΦ/Δt)²")
        ], "A"))

    qs.append(make_matrix_q(f"{p3}_002", t3, "beginner",
        "Match the physical situations involving a closed conducting ring in List I with the direction and nature of the induced current by Lenz's law in List II:",
        [
            ("North pole of a bar magnet moves downward toward the ring from above", "III", "Counter-clockwise (viewed from above), producing a repelling North pole", "Induced current opposes the approach of the North pole by creating an upward magnetic field (counter-clockwise)"),
            ("North pole of a bar magnet moves upward away from the ring", "I", "Clockwise (viewed from above), producing an attracting South pole", "Induced current opposes the recession of the North pole by creating a downward magnetic field (clockwise)"),
            ("A coplanar straight wire carrying current I to the right has increasing current", "IV", "Clockwise in a ring placed above the wire", "Wire's field above is out of page and increasing; ring creates inward field to oppose, hence clockwise"),
            ("Ring moves with constant velocity inside a region of uniform magnetic field", "II", "Zero induced current", "Magnetic flux through the ring remains constant, so dΦ/dt = 0 and induced EMF is zero")
        ], "B"))

    qs.append(make_matrix_q(f"{p3}_003", t3, "beginner",
        "Match the induction and inductance parameters in List I with their formulas in List II:",
        [
            ("Self-inductance of a long solenoid of length l, area A, and N total turns", "II", "μ₀ N² A / l", "L = Φ / I = (μ₀ (N/l) I A N) / I = μ₀ N² A / l"),
            ("Energy stored in an inductor L carrying steady current I", "IV", "(1/2) L I²", "Work done to establish current I against back-EMF is U = (1/2) L I²"),
            ("Magnetic energy density in a region of magnetic field B", "I", "B² / (2 μ₀)", "Energy stored per unit volume of magnetic field is u_B = B² / (2μ₀)"),
            ("Inductive time constant of an LR circuit", "III", "L / R", "Current growth follows I = I₀(1 - e^(-t/τ)) where τ = L/R")
        ], "C"))

    qs.append(make_matrix_q(f"{p3}_004", t3, "beginner",
        "Match the moving conducting elements in a uniform perpendicular magnetic field B in List I with the induced motional EMF in List II:",
        [
            ("Straight rod of length L translating with speed v perpendicular to its length", "III", "B v L", "Motional EMF is ε = (v × B) · L = B v L"),
            ("Straight rod of length L rotating with angular speed ω about one end", "I", "(1/2) B ω L²", "ε = ∫₀ᴸ B (ω r) dr = (1/2) B ω L²"),
            ("Circular conducting disc of radius R rotating with angular speed ω about its central axis", "IV", "(1/2) B ω R²", "Radial EMF between center and rim is ε = ∫₀ᴿ B ω r dr = (1/2) B ω R²"),
            ("Straight rod of length L translating parallel to the magnetic field B", "II", "0", "Since velocity v is parallel to B, v × B = 0, so no motional EMF is induced")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{p3}_005", t3, "intermediate",
        "An LR circuit consisting of inductor L = 2 H and resistor R = 10 Ω is connected across an ideal battery of EMF V₀ = 20 V at t = 0. Match the circuit parameters in List I with their values in List II:",
        [
            ("Inductive time constant τ of the circuit", "I", "0.2 s", "τ = L / R = 2 / 10 = 0.2 s"),
            ("Steady-state current I₀ as t -> ∞", "IV", "2 A", "In DC steady state, the inductor acts as a short circuit: I₀ = V₀ / R = 20 / 10 = 2 A"),
            ("Rate of change of current dI/dt at t = 0⁺", "II", "10 A/s", "At t = 0⁺, I = 0, so entire battery voltage drops across inductor: L (dI/dt) = V₀ => dI/dt = 20 / 2 = 10 A/s"),
            ("Potential drop across the inductor at t = τ", "III", "20 / e V (≈ 7.36 V)", "V_L(t) = V₀ e^(-t/τ); at t = τ, V_L = V₀ / e = 20 / e V")
        ], "A"))

    qs.append(make_matrix_q(f"{p3}_006", t3, "intermediate",
        "An LR circuit with L = 0.5 H and R = 5 Ω carrying a steady current I₀ = 4 A is disconnected from the battery and shorted across the resistor at t = 0. Match the decay parameters in List I with their values in List II:",
        [
            ("Total magnetic energy initially stored in the inductor", "IV", "4 J", "U₀ = (1/2) L I₀² = (1/2)(0.5)(16) = 4 J"),
            ("Time constant τ of current decay", "I", "0.1 s", "τ = L / R = 0.5 / 5 = 0.1 s"),
            ("Current flowing through the circuit at t = (0.1 ln 2) s", "III", "2 A", "I(t) = I₀ e^(-t/τ); for t = τ ln 2, I = I₀ e^(-ln 2) = I₀ / 2 = 4 / 2 = 2 A"),
            ("Magnitude of initial induced back-EMF at t = 0⁺", "II", "20 V", "|ε| = I₀ R = 4 × 5 = 20 V")
        ], "B"))

    qs.append(make_matrix_q(f"{p3}_007", t3, "intermediate",
        "Two inductive coils have self-inductances L₁ = 4 H and L₂ = 9 H. Match the mutual induction scenarios in List I with the resulting parameter in List II:",
        [
            ("Maximum possible mutual inductance M_max (perfect coupling, k = 1)", "II", "6 H", "M_max = √(L₁ L₂) = √(4 × 9) = 6 H"),
            ("Equivalent inductance when connected in series aiding with coupling coefficient k = 0.5", "IV", "19 H", "M = k √(L₁ L₂) = 0.5 × 6 = 3 H; L_eq = L₁ + L₂ + 2M = 4 + 9 + 6 = 19 H"),
            ("Equivalent inductance when connected in series opposing with coupling coefficient k = 0.5", "I", "7 H", "L_eq = L₁ + L₂ - 2M = 4 + 9 - 6 = 7 H"),
            ("Coupling coefficient k when measured mutual inductance is M = 1.5 H", "III", "0.25", "k = M / √(L₁ L₂) = 1.5 / 6 = 0.25")
        ], "C"))

    qs.append(make_matrix_q(f"{p3}_008", t3, "intermediate",
        "An AC generator has a rectangular coil of N = 100 turns, each of area A = 0.05 m², rotating at angular speed ω = 100 rad/s in a uniform magnetic field B = 0.2 T. Match the generator output parameters in List I with their values in List II:",
        [
            ("Maximum magnetic flux linked with the entire coil", "III", "1 Wb", "Φ_max = N B A = 100 × 0.2 × 0.05 = 1 Wb"),
            ("Peak induced electromotive force ε₀", "I", "100 V", "ε₀ = N B A ω = 100 × 0.2 × 0.05 × 100 = 100 V"),
            ("RMS value of induced EMF (ε_rms)", "IV", "50√2 V (≈ 70.7 V)", "ε_rms = ε₀ / √2 = 100 / √2 = 50√2 V"),
            ("Instantaneous EMF when the coil plane is perpendicular to magnetic field lines", "II", "0 V", "When coil plane is perpendicular to B, flux is maximum and dΦ/dt = 0, so ε = 0 V")
        ], "D"))

    qs.append(make_matrix_q(f"{p3}_009", t3, "intermediate",
        "A cylindrical region of radius R contains a uniform magnetic field B(t) directed along its axis, changing at a constant rate dB/dt = α. Match the induced non-conservative electric field quantities in List I with their expressions in List II:",
        [
            ("Induced electric field at radial distance r < R (inside field region)", "I", "α r / 2", "∮ E · dl = |dΦ/dt| => E (2π r) = π r² α => E = α r / 2"),
            ("Induced electric field at the outer boundary r = R", "IV", "α R / 2", "At r = R, E = α R / 2"),
            ("Induced electric field at radial distance r > R (outside field region)", "II", "α R² / (2r)", "∮ E · dl = |dΦ/dt| => E (2π r) = π R² α => E = α R² / (2r)"),
            ("Line integral ∮ E · dl around a circular loop of radius r < R", "III", "π r² α", "By Faraday's law in integral form, ∮ E · dl = dΦ/dt = π r² α")
        ], "A"))

    qs.append(make_matrix_q(f"{p3}_010", t3, "intermediate",
        "A conducting rod of mass m, length L, and electrical resistance R slides at constant speed v on frictionless horizontal parallel conducting rails connected by a zero-resistance wire in a vertical uniform magnetic field B. Match the dynamical and electrical quantities in List I with their expressions in List II:",
        [
            ("Induced electric current in the rod", "IV", "B v L / R", "Induced EMF is ε = B v L, so I = ε / R = B v L / R"),
            ("Magnetic retarding force on the rod", "I", "B² L² v / R", "F_mag = I L B = (B v L / R) L B = B² L² v / R"),
            ("Mechanical power required to maintain constant speed v", "III", "B² L² v² / R", "P_mech = F_ext v = (B² L² v / R) v = B² L² v² / R"),
            ("Instantaneous deceleration of the rod if released freely with speed v", "II", "B² L² v / (m R)", "a = F_mag / m = B² L² v / (m R)")
        ], "B"))

    qs.append(make_matrix_q(f"{p3}_011", t3, "intermediate",
        "Match the varying magnetic flux situations in List I with the resulting induced EMF or charge in List II:",
        [
            ("Magnetic flux Φ(t) = 3t² + 4t + 1 Wb through a coil: induced EMF at t = 2 s", "II", "16 V", "|ε| = |dΦ/dt| = |6t + 4|; at t = 2 s, |ε| = 6(2) + 4 = 16 V"),
            ("Circular loop expanding as r(t) = r₀ + α t in uniform perpendicular field B: EMF at t = 0", "IV", "2π r₀ α B", "Φ = B π r²; |ε| = B 2π r (dr/dt); at t = 0, |ε| = 2π r₀ α B"),
            ("Rectangular loop of width w pulled with velocity v from uniform field B", "I", "B v w", "Motional EMF along the moving side of length w is ε = B v w"),
            ("Closed loop of resistance R experiencing flux change from B A to 0: total charge transferred", "III", "B A / R", "Total charge Δq = ΔΦ / R = B A / R")
        ], "C"))

    qs.append(make_matrix_q(f"{p3}_012", t3, "intermediate",
        "Match the coupled conductor geometries in List I with their mutual inductance M in List II:",
        [
            ("Two concentric coplanar circular loops of radii r and R (r << R)", "III", "μ₀ π r² / (2R)", "Field of large loop at center is B = μ₀ I / (2R); flux through small loop is Φ = B π r² => M = μ₀ π r² / (2R)"),
            ("Two long coaxial solenoids of length l, turns N₁, N₂, and inner radius r₁", "I", "μ₀ N₁ N₂ π r₁² / l", "M = μ₀ n₁ n₂ A₁ l = μ₀ (N₁/l)(N₂/l)(π r₁²) l = μ₀ N₁ N₂ π r₁² / l"),
            ("Small circular loop of radius r at the center of a large square loop of side a (r << a)", "IV", "2√2 μ₀ π r² / a", "Field of square at center is 2√2 μ₀ I / (π a); flux through circle is Φ = B π r² => M = 2√2 μ₀ π r² / a"),
            ("Long straight wire and coplanar square loop of side a with nearest edge at distance d", "II", "(μ₀ a / 2π) ln(1 + a/d)", "Flux Φ = ∫_d^{d+a} (μ₀ I / 2π x) a dx = (μ₀ I a / 2π) ln((d+a)/d) => M = (μ₀ a / 2π) ln(1 + a/d)")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{p3}_013", t3, "advanced",
        "A conducting rod of mass m, length L, and resistance R falls vertically under gravity along smooth, vertical parallel rails connected by a resistor of negligible resistance at the top, in a horizontal uniform magnetic field B. Match the dynamical parameters in List I with their expressions in List II:",
        [
            ("Terminal velocity v_t reached by the rod", "I", "m g R / (B² L²)", "At terminal velocity, downward gravity balances magnetic retarding force: m g = B² L² v_t / R => v_t = m g R / (B² L²)"),
            ("Induced current flowing through the rod at terminal velocity", "III", "m g / (B L)", "I = B v_t L / R = B (m g R / B² L²) L / R = m g / (B L)"),
            ("Rate of heat dissipation in the circuit at terminal velocity", "IV", "m² g² R / (B² L²)", "P = I² R = (m g / B L)² R = m² g² R / (B² L²), which equals mechanical power m g v_t"),
            ("Initial acceleration of the rod at the moment of release (t = 0)", "II", "g", "At t = 0, speed v = 0, so magnetic force is zero; acceleration is solely due to gravity: a = g")
        ], "A"))

    qs.append(make_matrix_q(f"{p3}_014", t3, "advanced",
        "A circuit contains an ideal 12 V battery connected across a parallel combination of Branch 1 (pure resistor R₁ = 4 Ω) and Branch 2 (resistor R₂ = 6 Ω in series with an inductor L = 2 H). Switch is closed at t = 0. Match the circuit responses in List I with their values in List II:",
        [
            ("Total current drawn from the battery at t = 0⁺", "IV", "3 A", "At t = 0⁺, inductor behaves as an open circuit (I₂ = 0); I_total = I₁ = 12 V / 4 Ω = 3 A"),
            ("Current flowing through Branch 2 as t -> ∞", "I", "2 A", "As t -> ∞, inductor behaves as a short circuit: I₂ = 12 V / 6 Ω = 2 A"),
            ("Total current drawn from the battery as t -> ∞", "II", "5 A", "At steady state, I_total = I₁ + I₂ = (12/4) + (12/6) = 3 + 2 = 5 A"),
            ("Total magnetic energy stored in the inductor at steady state", "III", "4 J", "U = (1/2) L I₂² = (1/2)(2 H)(2 A)² = 4 J")
        ], "B"))

    qs.append(make_matrix_q(f"{p3}_015", t3, "advanced",
        "A conducting rod is rotated in a plane perpendicular to a uniform magnetic field B with constant angular speed ω. Match the pivoting condition in List I with the induced potential difference between its two endpoints in List II:",
        [
            ("Rod of length L pivoted at one of its ends", "II", "(1/2) B ω L²", "Potential difference between end and pivot: V = ∫₀ᴸ B ω r dr = (1/2) B ω L²"),
            ("Rod of length 2L pivoted at its exact midpoint", "IV", "0", "By symmetry, both ends are at the same potential: V_end1 - V_mid = V_end2 - V_mid => V_end1 - V_end2 = 0"),
            ("Rod of length L pivoted at a distance L/3 from one end", "I", "(1/6) B ω L²", "V₁ = (1/2) B ω (2L/3)² = 2/9 B ω L²; V₂ = (1/2) B ω (L/3)² = 1/18 B ω L²; ΔV = (2/9 - 1/18) B ω L² = (1/6) B ω L²"),
            ("Rod of length L pivoted at a distance L/4 from one end", "III", "(1/4) B ω L²", "ΔV = (1/2) B ω [(3L/4)² - (L/4)²] = (1/2) B ω (8/16 L²) = (1/4) B ω L²")
        ], "C"))

    qs.append(make_matrix_q(f"{p3}_016", t3, "advanced",
        "An ideal LC circuit has inductor L = 40 mH and capacitor C = 25 μF. The capacitor is initially charged to Q₀ = 200 μC and released at t = 0. Match the oscillation parameters in List I with their values in List II:",
        [
            ("Natural angular frequency ω₀ of oscillation", "III", "1000 rad/s", "ω₀ = 1 / √(L C) = 1 / √(40 × 10⁻³ × 25 × 10⁻⁶) = 1 / √(10⁻⁶) = 1000 rad/s"),
            ("Total electrostatic energy initially stored in the circuit", "I", "0.8 mJ", "U₀ = Q₀² / (2C) = (200 × 10⁻⁶)² / (2 × 25 × 10⁻⁶) = 8 × 10⁻⁴ J = 0.8 mJ"),
            ("Maximum current I_max flowing through the inductor", "IV", "0.2 A", "I_max = ω₀ Q₀ = 1000 × 200 × 10⁻⁶ = 0.2 A"),
            ("Earliest time t > 0 at which electrical and magnetic energies are equal", "II", "π / 4 ms (≈ 0.785 ms)", "Energy is equally divided when q = Q₀ / √2 => cos(ω₀ t) = 1/√2 => ω₀ t = π/4 => t = π / 4000 s = π/4 ms")
        ], "D"))

    qs.append(make_matrix_q(f"{p3}_017", t3, "advanced",
        "Match the technological applications of eddy currents in List I with their core operational physical mechanisms in List II:",
        [
            ("Electromagnetic damping in galvanometers", "I", "Eddy currents induced in the metallic coil frame generate an opposing Lorentz torque that brings the coil to rest quickly", "Dead-beat galvanometer uses eddy current damping in the metallic frame to eliminate oscillatory ringing"),
            ("Induction furnace for smelting metals", "III", "Rapidly changing high-frequency magnetic fields induce large circulating eddy currents that produce intense Joule heating", "High frequency AC generates large eddy currents in metal charges, melting them efficiently without direct flame contact"),
            ("Magnetic braking in high-speed electric trains", "IV", "Rotating metal discs in magnetic fields experience retarding forces from eddy currents without mechanical friction or wear", "Non-contact braking where kinetic energy is converted directly to thermal energy via eddy currents"),
            ("Laminated cores in electrical transformers", "II", "Thin sheets of silicon steel separated by insulating varnish restrict eddy current loops, minimizing power loss", "Lamination breaks up large circulating current loops, drastically reducing I²R eddy current power losses")
        ], "A"))

    qs.append(make_matrix_q(f"{p3}_018", t3, "advanced",
        "A conducting rod of mass m and length L slides on two frictionless horizontal rails in a uniform vertical magnetic field B. A capacitor C is connected across the rails. A constant external horizontal force F₀ is applied to the rod at t = 0. Match the dynamical variables in List I with their expressions in List II:",
        [
            ("Acceleration a of the sliding rod", "IV", "F₀ / (m + C B² L²)", "Induced EMF ε = B L v, q = C B L v, I = dq/dt = C B L a. Force equation: F₀ - I L B = m a => F₀ = (m + C B² L²) a"),
            ("Effective inertial mass of the system", "I", "m + C B² L²", "The system accelerates as if the rod possesses an additional electrical inertia C B² L²"),
            ("Magnetic retarding force on the rod", "III", "C B² L² F₀ / (m + C B² L²)", "F_mag = I L B = C B² L² a = C B² L² F₀ / (m + C B² L²)"),
            ("Charge on the capacitor as a function of rod speed v", "II", "C B L v", "Charge q = C ε = C B L v")
        ], "B"))

    qs.append(make_matrix_q(f"{p3}_019", t3, "advanced",
        "A circular conducting loop of radius R and resistance r is subjected to different magnetic conditions. Match the magnetic scenario in List I with the peak induced EMF or charge flow in List II:",
        [
            ("Placed stationary in a time-varying field B(t) = B₀ + β t", "II", "π R² β", "ε = |dΦ/dt| = A (dB/dt) = π R² β"),
            ("Rotates with constant angular velocity ω about a coplanar diameter in uniform field B₀", "IV", "π R² B₀ ω", "Φ = B₀ π R² cos(ω t) => ε = π R² B₀ ω sin(ω t), so peak EMF is π R² B₀ ω"),
            ("Moves with speed v along x in a magnetic field with spatial gradient B(x) = α x", "I", "π R² α v", "dΦ/dt = (dB/dx)(dx/dt) A = α v π R²"),
            ("Placed in field B₀ and flipped completely by 180°: total induced charge flow", "III", "2 π R² B₀ / r", "ΔΦ = B₀ A - (-B₀ A) = 2 B₀ A = 2 π R² B₀; Δq = ΔΦ / r = 2 π R² B₀ / r")
        ], "C"))

    qs.append(make_matrix_q(f"{p3}_020", t3, "advanced",
        "A conducting rod of mass m and length L slides frictionlessly on horizontal rails connected to an ideal inductor L₀ in a uniform vertical field B. The rod is projected with initial speed v₀ at x = 0. Match the oscillatory parameters in List I with their expressions in List II:",
        [
            ("Natural angular frequency of oscillation ω", "III", "B L / √(m L₀)", "Induced EMF ε = B L v = L₀ (dI/dt) => I = B L x / L₀. F = -I L B = -(B² L² / L₀) x = m d²x/dt² => ω = B L / √(m L₀)"),
            ("Maximum displacement (amplitude) of the rod", "I", "v₀ √(m L₀) / (B L)", "Amplitude x_max = v₀ / ω = v₀ √(m L₀) / (B L)"),
            ("Maximum current I_max through the inductor", "IV", "v₀ √(m / L₀)", "By conservation of energy: (1/2) L₀ I_max² = (1/2) m v₀² => I_max = v₀ √(m / L₀)"),
            ("Maximum magnetic energy stored in the inductor", "II", "(1/2) m v₀²", "Entire initial kinetic energy of the rod converts into magnetic energy at maximum displacement: U_max = (1/2) m v₀²")
        ], "D"))


    # ==========================================
    # TOPIC 4: Alternating Current (20 questions: 4 beg, 8 inter, 8 adv)
    # ==========================================
    t4 = "Alternating Current"
    p4 = "phy_mat_ac"

    # 4 Beginner
    qs.append(make_matrix_q(f"{p4}_001", t4, "beginner",
        "An AC voltage source is described by the equation V(t) = 200√2 sin(100π t) V. Match the voltage and waveform parameters in List I with their values in List II:",
        [
            ("Peak voltage V₀", "I", "200√2 V (≈ 282.8 V)", "Peak amplitude is the coefficient of the sine function: V₀ = 200√2 V"),
            ("Root-mean-square (RMS) voltage V_rms", "IV", "200 V", "V_rms = V₀ / √2 = (200√2) / √2 = 200 V"),
            ("Frequency f of the AC voltage source", "II", "50 Hz", "Angular frequency ω = 100π rad/s => f = ω / (2π) = 100π / (2π) = 50 Hz"),
            ("Time period T of the alternating voltage cycle", "III", "0.02 s", "T = 1 / f = 1 / 50 = 0.02 s")
        ], "A"))

    qs.append(make_matrix_q(f"{p4}_002", t4, "beginner",
        "Match the ideal AC circuit element in List I with its phase relationship between voltage V(t) and current I(t) in List II:",
        [
            ("Pure resistor (R)", "III", "Current and voltage are completely in phase (phase angle φ = 0)", "In a pure resistor, V = I R, so current and voltage reach peaks and zeros simultaneously"),
            ("Pure inductor (L)", "I", "Voltage leads current by π/2 (current lags voltage by 90°)", "In an inductor, V = L (dI/dt); current lags behind voltage by a quarter cycle"),
            ("Pure capacitor (C)", "IV", "Current leads voltage by π/2 (voltage lags current by 90°)", "In a capacitor, I = C (dV/dt); current leads voltage by a quarter cycle"),
            ("Series LCR circuit at resonant frequency", "II", "Current and voltage are in phase as net inductive and capacitive reactances cancel", "At resonance X_L = X_C, so the circuit is purely resistive and φ = 0")
        ], "B"))

    qs.append(make_matrix_q(f"{p4}_003", t4, "beginner",
        "Match the circuit property in List I with its frequency (f) dependence in an AC circuit in List II:",
        [
            ("Inductive reactance X_L", "II", "Directly proportional to frequency (X_L ∝ f)", "X_L = ω L = 2π f L, which increases linearly with frequency"),
            ("Capacitive reactance X_C", "IV", "Inversely proportional to frequency (X_C ∝ 1/f)", "X_C = 1 / (ω C) = 1 / (2π f C), which decreases hyperbolically with frequency"),
            ("Resistance R of an ideal resistor", "I", "Independent of frequency (R ∝ f⁰)", "Ideal ohmic resistance does not depend on the alternating frequency"),
            ("Series resonant frequency f₀ of an LC combination", "III", "Inversely proportional to √(L C)", "f₀ = 1 / (2π √(L C)), depending only on the product L C")
        ], "C"))

    qs.append(make_matrix_q(f"{p4}_004", t4, "beginner",
        "Match the power description in List I with its value or formula in an AC circuit in List II:",
        [
            ("Average power consumed in a purely resistive circuit", "III", "V_rms I_rms", "Since cos φ = cos(0) = 1, P_avg = V_rms I_rms"),
            ("Average power consumed in a purely inductive circuit", "I", "0", "Since φ = π/2, cos φ = 0, so average power is zero (wattless current)"),
            ("Average power consumed in a general series LCR circuit", "IV", "V_rms I_rms cos φ", "P_avg = V_rms I_rms cos φ, where cos φ = R/Z is the power factor"),
            ("Power factor cos φ of a series LCR circuit at resonance", "II", "1 (unity)", "At resonance Z = R, so cos φ = R/R = 1")
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{p4}_005", t4, "intermediate",
        "Match the AC series circuit components in List I with their total impedance Z in List II:",
        [
            ("Pure resistor R = 50 Ω", "I", "50 Ω", "Z = R = 50 Ω"),
            ("Series RL circuit with R = 60 Ω, X_L = 80 Ω", "III", "100 Ω", "Z = √(R² + X_L²) = √(60² + 80²) = 100 Ω"),
            ("Series RC circuit with R = 90 Ω, X_C = 120 Ω", "IV", "150 Ω", "Z = √(R² + X_C²) = √(90² + 120²) = 150 Ω"),
            ("Series LCR circuit with R = 120 Ω, X_L = 200 Ω, X_C = 40 Ω", "II", "200 Ω", "Net reactance |X_L - X_C| = 160 Ω; Z = √(120² + 160²) = 200 Ω")
        ], "A"))

    qs.append(make_matrix_q(f"{p4}_006", t4, "intermediate",
        "A series LCR circuit with L = 0.5 H, C = 2 μF, and R = 20 Ω is connected across an AC supply of V_rms = 100 V. Match the resonant parameters in List I with their values in List II:",
        [
            ("Resonant angular frequency ω₀", "IV", "1000 rad/s", "ω₀ = 1 / √(L C) = 1 / √(0.5 × 2 × 10⁻⁶) = 1 / √(10⁻⁶) = 1000 rad/s"),
            ("Impedance Z of the circuit at resonance", "I", "20 Ω", "At resonance, inductive and capacitive reactances cancel: Z = R = 20 Ω"),
            ("RMS current I_rms flowing through the circuit at resonance", "III", "5 A", "I_rms = V_rms / Z = 100 V / 20 Ω = 5 A"),
            ("Quality factor Q of the circuit", "II", "25", "Q = ω₀ L / R = (1000 × 0.5) / 20 = 500 / 20 = 25")
        ], "B"))

    qs.append(make_matrix_q(f"{p4}_007", t4, "intermediate",
        "In a series LCR circuit connected to an AC source, RMS voltage drops across individual components are V_R = 60 V, V_L = 100 V, and V_C = 20 V. Match the circuit parameters in List I with their values in List II:",
        [
            ("Net reactive voltage magnitude |V_L - V_C|", "II", "80 V", "|V_L - V_C| = |100 - 20| = 80 V"),
            ("Total RMS source voltage V", "IV", "100 V", "V = √(V_R² + (V_L - V_C)²) = √(60² + 80²) = 100 V"),
            ("Power factor cos φ of the circuit", "I", "0.6", "cos φ = V_R / V = 60 / 100 = 0.6"),
            ("Tangent of phase angle tan φ", "III", "4/3", "tan φ = (V_L - V_C) / V_R = (100 - 20) / 60 = 80 / 60 = 4/3")
        ], "C"))

    qs.append(make_matrix_q(f"{p4}_008", t4, "intermediate",
        "A series LCR circuit has resonant angular frequency ω₀ = 2000 rad/s, inductance L = 50 mH, and resistance R = 10 Ω. Match the resonance curve parameters in List I with their values in List II:",
        [
            ("Quality factor Q of the circuit", "III", "10", "Q = ω₀ L / R = (2000 × 0.05) / 10 = 100 / 10 = 10"),
            ("Bandwidth Δω of the resonance curve", "I", "200 rad/s", "Δω = R / L = 10 / 0.05 = 200 rad/s"),
            ("Lower half-power angular frequency ω₁", "IV", "1900 rad/s", "ω₁ = ω₀ - Δω / 2 = 2000 - 100 = 1900 rad/s"),
            ("Upper half-power angular frequency ω₂", "II", "2100 rad/s", "ω₂ = ω₀ + Δω / 2 = 2000 + 100 = 2100 rad/s")
        ], "D"))

    qs.append(make_matrix_q(f"{p4}_009", t4, "intermediate",
        "An ideal step-down transformer has primary voltage V_p = 2200 V, secondary voltage V_s = 220 V, primary coil turns N_p = 1000, and supplies a secondary resistive load drawing I_s = 10 A. Match the transformer parameters in List I with their values in List II:",
        [
            ("Number of secondary coil turns N_s", "I", "100 turns", "N_s = N_p (V_s / V_p) = 1000 × (220 / 2200) = 100 turns"),
            ("Primary current I_p drawn from the source", "III", "1 A", "For an ideal transformer, V_p I_p = V_s I_s => I_p = (220 × 10) / 2200 = 1 A"),
            ("Power delivered to the secondary load", "IV", "2200 W", "P = V_s I_s = 220 V × 10 A = 2200 W"),
            ("Equivalent load resistance connected across secondary", "II", "22 Ω", "R_L = V_s / I_s = 220 V / 10 A = 22 Ω")
        ], "A"))

    qs.append(make_matrix_q(f"{p4}_010", t4, "intermediate",
        "Match the current waveforms in List I with their root-mean-square (RMS) values in terms of peak value I₀ in List II:",
        [
            ("Sinusoidal current I(t) = I₀ sin(ω t)", "IV", "I₀ / √2", "I_rms = √( (1/T) ∫₀ᵀ I₀² sin²(ω t) dt ) = I₀ / √2"),
            ("Symmetrical square wave alternating between +I₀ and -I₀", "I", "I₀", "Since I² = I₀² at all times, I_rms = √(I₀²) = I₀"),
            ("Symmetrical triangular wave of peak value I₀", "III", "I₀ / √3", "For a linear triangle rising from 0 to I₀, the mean square is I₀²/3, so I_rms = I₀ / √3"),
            ("Half-wave rectified sine wave of peak value I₀", "II", "I₀ / 2", "Conducts for half cycle: I_rms = √( (1/2)(I₀²/2) ) = I₀ / 2")
        ], "B"))

    qs.append(make_matrix_q(f"{p4}_011", t4, "intermediate",
        "An AC electrical circuit operates at V_rms = 200 V, drawing a current of I_rms = 10 A that lags the voltage by phase angle φ = 60°. Match the AC power quantities in List I with their values in List II:",
        [
            ("Power factor of the circuit", "II", "0.5", "Power factor = cos(60°) = 0.5"),
            ("Active (true) average power consumed P", "IV", "1000 W", "P = V_rms I_rms cos φ = 200 × 10 × 0.5 = 1000 W"),
            ("Reactive (wattless) power Q", "I", "1000√3 VAR (≈ 1732 VAR)", "Q = V_rms I_rms sin φ = 200 × 10 × sin(60°) = 2000 × (√3/2) = 1000√3 VAR"),
            ("Wattless component of the electric current", "III", "5√3 A (≈ 8.66 A)", "I_wattless = I_rms sin φ = 10 × sin(60°) = 5√3 A")
        ], "C"))

    qs.append(make_matrix_q(f"{p4}_012", t4, "intermediate",
        "In an ideal LC oscillatory circuit, the total stored energy is U₀ = 16 mJ. Match the instantaneous circuit states in List I with the energy stored in the inductor U_L in List II:",
        [
            ("When charge on capacitor is Q₀ / 2", "III", "12 mJ", "U_C = (Q₀/2)² / (2C) = U₀ / 4 = 4 mJ => U_L = U₀ - U_C = 16 - 4 = 12 mJ"),
            ("When current through inductor is I₀ / √2", "I", "8 mJ", "U_L = (1/2) L (I₀/√2)² = (1/2) U₀ = 16 / 2 = 8 mJ"),
            ("When current through inductor reaches its peak value I₀", "IV", "16 mJ", "When current is maximum, capacitor charge is zero, so entire energy resides in inductor: U_L = U₀ = 16 mJ"),
            ("When charge on capacitor reaches its peak value Q₀", "II", "0 mJ", "When capacitor charge is maximum, current is zero, so magnetic energy U_L = 0 mJ")
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{p4}_013", t4, "advanced",
        "A non-ideal coil (choke coil) draws 10 A when connected to a 100 V DC supply. When connected to a 100 V, 50 Hz AC supply, it draws 6 A. Match the coil parameters in List I with their values in List II:",
        [
            ("Resistance R of the coil", "I", "10 Ω", "Under DC supply, inductor offers zero reactance: R = V_dc / I_dc = 100 / 10 = 10 Ω"),
            ("Inductive reactance X_L of the coil", "III", "(40/3) Ω (≈ 13.33 Ω)", "Impedance Z = V_ac / I_ac = 100 / 6 = 50/3 Ω. X_L = √(Z² - R²) = √((50/3)² - 10²) = 40/3 Ω"),
            ("Power factor cos φ of the coil on the AC supply", "IV", "0.6", "cos φ = R / Z = 10 / (50/3) = 30 / 50 = 0.6"),
            ("Average power dissipated in the coil on the AC supply", "II", "360 W", "P_avg = V_rms I_rms cos φ = 100 × 6 × 0.6 = 360 W")
        ], "A"))

    qs.append(make_matrix_q(f"{p4}_014", t4, "advanced",
        "A series LCR circuit has R = 100 Ω, L = 0.2 H, and C = 20 μF, giving resonant angular frequency ω₀ = 500 rad/s. Match the driving frequency ω of the AC source in List I with the circuit behavior and phase in List II:",
        [
            ("ω = 500 rad/s (at resonance)", "IV", "Purely resistive behavior, impedance is minimum (Z = 100 Ω), phase difference is 0", "At ω = ω₀, X_L = X_C = 100 Ω, reactances cancel completely"),
            ("ω = 1000 rad/s (ω > ω₀)", "I", "Inductive behavior, voltage leads current (tan φ = 1.5)", "X_L = 200 Ω, X_C = 50 Ω => X_L > X_C, so circuit is inductive with voltage leading"),
            ("ω = 250 rad/s (ω < ω₀)", "III", "Capacitive behavior, current leads voltage (tan φ = -1.5)", "X_L = 50 Ω, X_C = 200 Ω => X_C > X_L, so circuit is capacitive with current leading"),
            ("ω -> 0 (DC limit)", "II", "Capacitive block: impedance tends to infinity, steady current is 0", "Capacitor blocks direct current as X_C -> ∞")
        ], "B"))

    qs.append(make_matrix_q(f"{p4}_015", t4, "advanced",
        "An electric current flowing through a resistor R = 10 Ω is given by the superposition of DC and AC components: I(t) = 3 + 4 sin(100π t) A. Match the current and power characteristics in List I with their values in List II:",
        [
            ("Root-mean-square (RMS) value of the total current", "II", "√17 A (≈ 4.12 A)", "I_rms = √(I_dc² + I_ac,rms²) = √(3² + (4/√2)²) = √(9 + 8) = √17 A"),
            ("Peak (maximum instantaneous) current", "IV", "7 A", "I_max = 3 + 4 = 7 A"),
            ("Minimum instantaneous current", "I", "-1 A", "I_min = 3 - 4 = -1 A (current briefly reverses direction)"),
            ("Average value of current over one complete AC cycle", "III", "3 A", "Average of sinusoidal component over full cycle is zero: I_avg = 3 + 0 = 3 A")
        ], "C"))

    qs.append(make_matrix_q(f"{p4}_016", t4, "advanced",
        "A parallel resonant circuit (rejector circuit) consists of an inductor with resistance r and inductance L in parallel with a capacitor C. Match the parallel resonance parameters in List I with their expressions in List II:",
        [
            ("Resonant angular frequency ω_r", "III", "√(1/(L C) - r² / L²)", "Condition for net susceptance to vanish yields ω_r = √(1/(LC) - r²/L²)"),
            ("Dynamic resistance (impedance at resonance for small r)", "I", "L / (C r)", "At resonance, the equivalent impedance is purely resistive and given by Z_d = L / (C r)"),
            ("Source current drawn at resonance", "IV", "Minimum (approaching 0 as r -> 0)", "Impedance is maximum at parallel resonance, hence source current is minimum"),
            ("Quality factor Q of the parallel circuit (for small r)", "II", "(1/r) √(L / C)", "Q = ω_r L / r ≈ (1 / √(LC))(L / r) = (1/r) √(L/C)")
        ], "D"))

    qs.append(make_matrix_q(f"{p4}_017", t4, "advanced",
        "A real single-phase transformer has efficiency η = 80% and operates with primary voltage V_p = 2000 V and secondary voltage V_s = 200 V. It delivers P_out = 4000 W to a purely resistive load (power factor = 1.0). Match the operational parameters in List I with their values in List II:",
        [
            ("Input electric power supplied to the primary coil", "I", "5000 W", "P_in = P_out / η = 4000 / 0.8 = 5000 W"),
            ("Rate of internal energy dissipation (power loss) in the transformer", "III", "1000 W", "P_loss = P_in - P_out = 5000 - 4000 = 1000 W"),
            ("Primary current I_p (assuming primary power factor is 1.0)", "IV", "2.5 A", "I_p = P_in / V_p = 5000 W / 2000 V = 2.5 A"),
            ("Secondary load current I_s", "II", "20 A", "I_s = P_out / V_s = 4000 W / 200 V = 20 A")
        ], "A"))

    qs.append(make_matrix_q(f"{p4}_018", t4, "advanced",
        "An alternating voltage V(t) = 100√2 sin(100 t) V is applied across an RL series circuit containing resistor R = 30 Ω and inductor L = 0.4 H. Match the electrical parameters in List I with their values in List II:",
        [
            ("Total circuit impedance Z", "IV", "50 Ω", "ω = 100 rad/s => X_L = ω L = 100 × 0.4 = 40 Ω. Z = √(30² + 40²) = 50 Ω"),
            ("Peak voltage across the inductor V_L,0", "I", "80√2 V (≈ 113.1 V)", "Peak current I₀ = V₀ / Z = 100√2 / 50 = 2√2 A. V_L,0 = I₀ X_L = 2√2 × 40 = 80√2 V"),
            ("Peak voltage across the resistor V_R,0", "III", "60√2 V (≈ 84.9 V)", "V_R,0 = I₀ R = 2√2 × 30 = 60√2 V"),
            ("Phase difference φ by which voltage leads current", "II", "tan⁻¹(4/3) (≈ 53.1°)", "tan φ = X_L / R = 40 / 30 = 4/3 => φ = tan⁻¹(4/3)")
        ], "B"))

    qs.append(make_matrix_q(f"{p4}_019", t4, "advanced",
        "In a series LCR circuit connected to a variable-frequency AC source of constant voltage amplitude V₀, match the resonant and response phenomena in List I with the corresponding angular frequency or voltage in List II:",
        [
            ("Frequency at which current amplitude is maximum", "II", "1 / √(L C)", "Current resonance occurs when X_L = X_C, i.e., ω = 1/√(LC)"),
            ("Frequency at which voltage amplitude across capacitor is maximum", "IV", "√( 1/(L C) - R² / (2L²) )", "Maximizing V_C(ω) = I(ω) / (ω C) yields ω_C = √(1/(LC) - R²/(2L²))"),
            ("Frequency at which voltage amplitude across inductor is maximum", "I", "1 / √( L C - R² C² / 2 )", "Maximizing V_L(ω) = I(ω) ω L yields ω_L = 1 / √(LC - R²C²/2)"),
            ("Peak voltage across resistor at current resonance", "III", "V₀", "At resonance Z = R, so entire source voltage appears across the resistor: V_R = V₀")
        ], "C"))

    qs.append(make_matrix_q(f"{p4}_020", t4, "advanced",
        "A damped LCR circuit with low resistance R < 2√(L/C) executes underdamped electrical oscillations. Match the oscillation characteristics in List I with their expressions in List II:",
        [
            ("Damped oscillation angular frequency ω'", "III", "√( 1/(L C) - R² / (4L²) )", "Differential equation d²q/dt² + (R/L) dq/dt + q/(LC) = 0 yields ω' = √(1/(LC) - R²/(4L²))"),
            ("Time constant τ_q for charge amplitude to decay to 1/e of its initial value", "I", "2L / R", "Charge amplitude envelope decays as e^(-R t / (2L)), so time constant is 2L/R"),
            ("Critical damping resistance R_critical", "IV", "2 √(L / C)", "Critical damping condition is R²/(4L²) = 1/(LC) => R = 2√(L/C)"),
            ("Time constant τ_E for total stored energy to decay to 1/e of its initial value", "II", "L / R", "Energy is proportional to amplitude squared: E(t) ∝ e^(-R t / L), so energy decay time constant is L/R")
        ], "D"))

    return qs
