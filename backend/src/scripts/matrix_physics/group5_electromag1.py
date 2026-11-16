from builder import make_matrix_q

def get_questions():
    qs = []

    # ==========================================
    # TOPIC: Electrostatics
    # ==========================================
    t = "Electrostatics"
    prefix = "phy_mat_es"

    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the fundamental properties of electric charge in List I with their physical descriptions in List II:",
        [
            ("Quantization of charge", "III", "Charge on any object is an integral multiple of elementary charge: q = ± n e", "Quantization implies charge is transferred in discrete packets of magnitude e"),
            ("Conservation of charge", "I", "Total electric charge of an isolated system remains constant over time", "Conservation states charge can neither be created nor destroyed in isolation"),
            ("Relativistic invariance", "IV", "Magnitude of electric charge is independent of the reference frame speed", "Charge is invariant under Lorentz transformation unlike mass and time"),
            ("Additivity of charge", "II", "Total charge of a system is the algebraic sum of all individual point charges", "Charges add like real scalar numbers taking into account their algebraic signs"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Two point charges q1 and q2 are separated by a distance r. Match the electrostatic quantities in List I with their expressions or SI units in List II:",
        [
            ("Electrostatic force in vacuum", "II", "F0 = (1 / (4πε0)) * (|q1 q2| / r²)", "Coulomb's law in vacuum gives F0 = (1 / (4πε0)) * (|q1 q2| / r²)"),
            ("Electrostatic force in a dielectric medium of relative permittivity εr", "IV", "F_med = F0 / εr", "The dielectric medium reduces the electrostatic force by a factor of εr"),
            ("Force between the charges when separation is doubled in vacuum", "I", "F' = F0 / 4", "Force is inversely proportional to distance squared, so doubling r reduces force to F0 / 4"),
            ("SI unit of electric permittivity ε0", "III", "C² / (N·m²)", "From F = q1 q2 / (4πε0 r²), ε0 has units C² / (N·m²)"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the electrostatic field and dipole quantities in List I with their respective formulas in List II:",
        [
            ("Electric field at distance r from an isolated point charge q", "IV", "E = (1 / (4πε0)) * (q / r²)", "Point charge field follows inverse square law: E = kq / r²"),
            ("Electric dipole moment p of charges ±q separated by distance 2a", "III", "p = 2 q a (directed from -q to +q)", "Dipole moment is a vector directed from negative to positive charge with magnitude 2qa"),
            ("Electric flux Φ through planar area A in uniform field E", "II", "Φ = E · A = E A cos θ", "Electric flux is the dot product of electric field and area vector"),
            ("Acceleration of a charged particle (mass m, charge q) in electric field E", "I", "a = q E / m", "Newton's second law with electrostatic force F = qE gives a = qE / m"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the electrostatic field line characteristics in List I with their physical justifications in List II:",
        [
            ("Tangent to an electric field line at any point", "I", "Gives the direction of resultant electric field vector at that point", "The direction of electric field is tangent to the line of force"),
            ("Two electric field lines never intersect each other", "IV", "Intersection would imply two distinct directions of electric field at one point", "Since field vector is unique at each point, lines cannot intersect"),
            ("Electric field lines meet a conducting surface at right angles", "II", "Any parallel component would cause surface charge currents in static equilibrium", "In electrostatics, conductor surface is an equipotential, so field must be purely normal"),
            ("Electric field lines inside a static conductor", "III", "Completely absent because the electrostatic field inside is zero", "Charges reside exclusively on the outer surface, making interior electrostatic field zero"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "An electric dipole of moment p is placed in a uniform electric field E at an angle θ with the field direction. Match List I with List II:",
        [
            ("Torque acting on the dipole", "II", "τ = p E sin θ", "Torque is given by the cross product τ = p × E, magnitude p E sin θ"),
            ("Electrostatic potential energy of the dipole", "III", "U = -p E cos θ", "Potential energy is given by U = -p · E = -p E cos θ"),
            ("Orientation of stable equilibrium", "IV", "θ = 0° (dipole aligned parallel to field E)", "At θ = 0°, torque is zero and potential energy is at its minimum U = -pE"),
            ("Work done by external torque in turning the dipole from θ = 0° to θ = 180°", "I", "W = 2 p E", "Work done W = U(180°) - U(0°) = -pE(-1) - (-pE) = 2pE"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "For a short electric dipole of dipole moment p, match the field quantities at distance r in List I with their expressions in List II (k = 1 / (4πε0)):",
        [
            ("Electric field at an axial point (end-on position)", "III", "E_axial = (2 k p) / r³", "Axial field is directed along the dipole moment with magnitude 2kp / r³"),
            ("Electric field at an equatorial point (broadside-on position)", "I", "E_equatorial = (k p) / r³", "Equatorial field is antiparallel to the dipole moment with magnitude kp / r³"),
            ("Magnitude of electric field at general point (r, θ)", "IV", "E = (k p / r³) √(1 + 3 cos² θ)", "General field magnitude is given by resolving into radial and transverse components"),
            ("Angle α between resultant electric field and position vector r", "II", "tan α = (1 / 2) tan θ", "The ratio of transverse to radial field gives tan α = E_θ / E_r = (1/2) tan θ"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Three identical charges +q are placed at the vertices of an equilateral triangle of side a. Match the electrostatic situations in List I with their values in List II (k = 1 / (4πε0)):",
        [
            ("Net electrostatic force on any one of the vertex charges", "IV", "F_net = (√3 k q²) / a²", "Two forces each of magnitude kq²/a² at 60° add vectorially to √3 kq²/a²"),
            ("Resultant electric field at the centroid of the triangle", "II", "E = 0", "By threefold symmetry, the three equal electric field vectors cancel completely at the centroid"),
            ("Force experienced by a charge +Q placed at the centroid", "I", "F = 0", "Since the electric field at the centroid is zero, the force on any charge placed there is zero"),
            ("Net electrostatic force on one vertex charge if one of the other charges is replaced by -q", "III", "F_net = (k q²) / a²", "Two equal forces of magnitude kq²/a² at 120° give a resultant equal to kq²/a²"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match each continuous charge distribution in List I with its corresponding electric field characteristic in List II:",
        [
            ("Uniformly charged infinite straight line of linear density λ at distance r", "I", "E = λ / (2πε0 r)", "Applying Gauss's law over a coaxial cylinder gives E = λ / (2πε0 r)"),
            ("Uniformly charged infinite non-conducting plane sheet of surface density σ", "III", "E = σ / (2ε0)", "Applying Gauss's law over a pillbox yields uniform field E = σ / (2ε0)"),
            ("Uniformly charged ring of radius R, total charge Q, at axial distance x from center", "IV", "E = (k Q x) / (x² + R²)^(3/2)", "Integrating components along the axis gives E = kQx / (x² + R²)^(3/2)"),
            ("Axial position x where electric field of the uniformly charged ring is maximum", "II", "x = R / √2", "Setting dE/dx = 0 yields x = R / √2 for peak electric field"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "A point charge q is placed at different locations relative to a closed cube of edge length L. Match the total electric flux Φ through the cube in List I with List II:",
        [
            ("Charge q placed at the center of the cube", "II", "Φ = q / ε0", "By Gauss's law, the entire charge is enclosed by the cube, so flux is q / ε0"),
            ("Charge q placed at the center of one face of the cube", "IV", "Φ = q / (2ε0)", "By symmetry, constructing a second identical cube encloses the charge, so flux is q / (2ε0)"),
            ("Charge q placed at one vertex (corner) of the cube", "I", "Φ = q / (8ε0)", "Symmetrically 8 cubes meeting at the vertex enclose the charge, so flux is q / (8ε0)"),
            ("Charge q placed at the midpoint of an edge of the cube", "III", "Φ = q / (4ε0)", "Symmetrically 4 cubes meeting along the edge enclose the charge, so flux is q / (4ε0)"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "A thin spherical conducting shell of radius R carries a total charge Q uniformly distributed on its surface (surface charge density σ). Match List I with List II (k = 1 / (4πε0)):",
        [
            ("Electric field at an internal point r < R", "III", "E = 0", "Gauss's law enclosing zero charge inside the shell gives E = 0"),
            ("Electric field just outside the surface at r = R+", "I", "E = σ / ε0 = k Q / R²", "Boundary condition at conductor surface gives E = σ / ε0 = kQ / R²"),
            ("Electric field at an external point r > R", "IV", "E = k Q / r²", "By spherical symmetry, the shell acts as a point charge Q at the center for r > R"),
            ("Electrostatic pressure (mechanical outward force per unit area) on the shell surface", "II", "P = σ² / (2ε0)", "Electrostatic pressure equals average field times surface charge: P = (1/2) σ (σ / ε0) = σ² / (2ε0)"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "A particle of mass m and charge q enters horizontally with velocity v0 between two parallel plates of length L with a uniform upward electric field E. Match List I with List II:",
        [
            ("Vertical acceleration of the particle between the plates", "IV", "a_y = q E / m", "The vertical electric force F_y = qE produces acceleration a_y = qE / m"),
            ("Trajectory equation of the particle inside the electric field", "II", "y = (q E / (2 m v0²)) x²", "Combining x = v0 t and y = (1/2) a_y t² yields a parabolic trajectory"),
            ("Vertical deflection y_L of the particle upon emerging at x = L", "III", "y_L = (q E L²) / (2 m v0²)", "Substituting x = L into the trajectory equation gives y_L = (qEL²) / (2mv0²)"),
            ("Vertical velocity component v_y of the particle at the exit of the plates", "I", "v_y = (q E L) / (m v0)", "Using v_y = a_y t with transit time t = L / v0 gives v_y = (qEL) / (mv0)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "A non-conducting solid sphere of radius R has a total charge Q distributed uniformly throughout its volume (charge density ρ). Match the electric field in List I with List II (k = 1 / (4πε0)):",
        [
            ("Electric field at the center r = 0", "I", "E = 0", "By spherical symmetry, electric fields from all volume elements cancel at the center"),
            ("Electric field at an interior point r < R", "IV", "E = (k Q r) / R³ = (ρ r) / (3ε0)", "Gauss's law gives 4πr² E = q_enc / ε0 where q_enc = Q(r³/R³), yielding E = kQr / R³"),
            ("Electric field at the surface r = R", "II", "E = k Q / R² = (ρ R) / (3ε0)", "At r = R, E = kQ / R² which matches both interior and exterior formulas"),
            ("Electric field at an exterior point r > R", "III", "E = k Q / r²", "Outside the sphere, Gauss's law treats the entire charge Q as concentrated at the center"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A non-conducting solid sphere of radius R has non-uniform volume charge density ρ(r) = ρ0 (r / R) for r ≤ R and ρ = 0 for r > R. Match List I with List II:",
        [
            ("Total charge Q enclosed by the sphere", "II", "Q = π ρ0 R³", "Q = ∫_0^R ρ(r) 4πr² dr = (4πρ0 / R) ∫_0^R r³ dr = (4πρ0 / R)(R⁴ / 4) = π ρ0 R³"),
            ("Electric field inside the sphere at distance r < R", "III", "E = (ρ0 r²) / (4ε0 R)", "q_enc = ∫_0^r (ρ0 r'/R) 4πr'² dr' = π ρ0 r⁴ / R. By Gauss's law, 4πr² E = q_enc/ε0 => E = ρ0 r² / (4ε0 R)"),
            ("Electric field at the surface r = R", "IV", "E = (ρ0 R) / (4ε0)", "Substituting r = R into the internal field gives E = ρ0 R / (4ε0) = kQ / R²"),
            ("Electric field outside the sphere at distance r > R", "I", "E = (ρ0 R³) / (4ε0 r²)", "For r > R, E = Q / (4πε0 r²) = (π ρ0 R³) / (4πε0 r²) = (ρ0 R³) / (4ε0 r²)"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "A non-conducting solid sphere with uniform volume charge density ρ has a spherical cavity of radius a inside it. The displacement vector from the center of the sphere to the center of the cavity is d. Match List I with List II:",
        [
            ("Electric field at any point inside the cavity", "III", "E = (ρ d) / (3ε0) (uniform in magnitude and direction)", "By superposition, E = E_sphere - E_cavity = (ρ r1)/(3ε0) - (ρ r2)/(3ε0) = ρ(r1 - r2)/(3ε0) = (ρ d)/(3ε0)"),
            ("Electrostatic force on a point charge q placed anywhere inside the cavity", "IV", "F = (q ρ d) / (3ε0) along vector d", "Since the field inside the cavity is uniform, the force F = qE is uniform and independent of position"),
            ("Electric field at the center of the original sphere (cavity center at d)", "II", "E = -(ρ a³ d) / (3ε0 |d|³)", "Superposition at sphere center gives 0 - field from cavity charge -(4/3)π a³ ρ at distance d"),
            ("Dipole moment of the charge configuration created by the cavity", "I", "p = -(4 / 3) π a³ ρ d", "The cavity acts as a sphere of negative charge -q_cavity = -(4/3)π a³ ρ displaced by vector d"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Two concentric thin spherical conducting shells have radii a and b (b > a). The inner shell carries charge q1 and the outer shell carries charge q2. Match List I with List II (k = 1 / (4πε0)):",
        [
            ("Electric field in the region r < a", "IV", "E = 0", "No charge is enclosed inside the inner conducting shell, so field is zero"),
            ("Electric field in the intermediate region a < r < b", "I", "E = k q1 / r²", "Gauss's law encloses only charge q1 of the inner shell, so E = kq1 / r²"),
            ("Induced charge on the inner surface of the outer shell", "II", "q_inner = -q1", "Field inside the conductor of the outer shell is zero, so enclosed charge must be q1 + q_inner = 0 => q_inner = -q1"),
            ("Total charge on the outer surface of the outer shell", "III", "q_outer = q1 + q2", "By charge conservation on outer shell, q_outer = q2 - q_inner = q1 + q2"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Match the electrostatic dipole interactions and non-uniform field behaviors in List I with their expressions in List II (k = 1 / (4πε0)):",
        [
            ("Force on a dipole of moment p aligned along x-axis in field E = E(x) i", "I", "F = p (dE / dx)", "Force on dipole in non-uniform field is F = (p · ∇)E = p (dE/dx)"),
            ("Interaction force between two collinear identical short dipoles p separated by distance r", "III", "F = (6 k p²) / r⁴", "Force F = -dU/dr where U = -2kp²/r³, giving attractive force 6kp² / r⁴"),
            ("Electrostatic potential energy of two collinear identical short dipoles p separated by distance r", "IV", "U = -(2 k p²) / r³", "Field of first dipole is E = 2kp/r³ along p; energy U = -p · E = -2kp² / r³"),
            ("Interaction force between two parallel broadside-on identical short dipoles p separated by distance r", "II", "F = (3 k p²) / r⁴", "Field of first dipole is kp/r³ antiparallel to p, U = kp²/r³; repulsive force F = -dU/dr = 3kp² / r⁴"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Two equal fixed positive charges +Q are placed at (d, 0) and (-d, 0) on the x-axis. A small test charge q of mass m is placed at the origin. Match List I with List II:",
        [
            ("Small displacement of positive test charge +q along the y-axis", "II", "Executes SHM with restoring force F_y ≈ -(2 k q Q / d³) y", "Net force along y is 2 * (kqQ / (d² + y²)) * (-y / √(d² + y²)) ≈ -(2kqQ/d³)y"),
            ("Angular frequency of oscillation ω_y for positive test charge +q along the y-axis", "I", "ω_y = √((q Q) / (2πε0 m d³))", "Equating m ω² = 2kqQ/d³ with k = 1/(4πε0) gives ω_y = √(qQ / (2πε0 m d³))"),
            ("Small displacement of positive test charge +q along the x-axis", "IV", "Unstable equilibrium; repelled away from the origin", "Along x-axis, net force is directed away from origin (F_x ≈ +(4kqQ/d³)x), so equilibrium is unstable"),
            ("Small displacement of negative test charge -q along the x-axis", "III", "Executes SHM with angular frequency ω_x = √((q Q) / (πε0 m d³))", "Restoring force on -q is F_x ≈ -(4kqQ/d³)x = -(qQ / (πε0 d³))x, yielding ω_x = √(qQ / (πε0 m d³))"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "A point charge +q is located at distance d from an infinite grounded conducting plane (z = 0) at (0, 0, d). Match List I with List II (k = 1 / (4πε0)):",
        [
            ("Image charge equivalent for the region z > 0", "III", "A fictitious charge -q placed at (0, 0, -d)", "By method of images, a charge -q at (0, 0, -d) satisfies the boundary condition V(z=0) = 0"),
            ("Electrostatic attractive force between the charge +q and the conducting plane", "II", "F = q² / (16πε0 d²)", "The force equals the Coulomb attraction between +q and image charge -q at separation 2d: F = q²/(4πε0(2d)²))"),
            ("Maximum magnitude of induced surface charge density σ_max on the plane (at origin)", "I", "σ_max = q / (2π d²)", "Surface charge density σ = ε0 E_z = -q d / (2π(r² + d²)^(3/2)); at r = 0, |σ_max| = q / (2π d²)"),
            ("Total induced charge on the infinite conducting plane", "IV", "q_total = -q", "Integrating σ over the entire infinite plane yields total induced charge equal to -q"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Thin non-conducting wires are bent into various planar circular arcs of radius R with uniform linear charge density λ. Match the electric field at the center of curvature in List I with List II (k = 1 / (4πε0)):",
        [
            ("Semicircular wire (subtending angle π at center)", "IV", "E = (2 k λ) / R", "Integrating dE = (k λ R dθ / R²) cos θ from -π/2 to π/2 gives E = (2kλ) / R"),
            ("Quarter-circular wire (subtending angle π/2 at center)", "III", "E = (√2 k λ) / R", "Perpendicular components E_x = E_y = kλ/R add vectorially to E = √(E_x² + E_y²) = (√2 kλ) / R"),
            ("Circular arc subtending an arbitrary angle θ at center", "II", "E = (2 k λ / R) sin(θ / 2)", "By symmetry, E = ∫ dE cos α = (2kλ / R) sin(θ/2) directed along the angle bisector"),
            ("Complete circular ring of radius R", "I", "E = 0", "By circular symmetry, fields from diametrically opposite elements cancel, giving E = 0"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match each cylindrical charge distribution in List I with its electric field at radial distance r from the axis in List II:",
        [
            ("Infinite conducting cylinder of radius R with surface charge density σ (field at r > R)", "I", "E = (σ R) / (ε0 r)", "Gauss's law on cylinder of radius r: E(2πr L) = (σ 2πR L)/ε0 gives E = σR / (ε0 r)"),
            ("Infinite non-conducting cylinder of radius R with uniform volume density ρ (field at r < R)", "II", "E = (ρ r) / (2ε0)", "Gauss's law on cylinder of radius r: E(2πr L) = (ρ πr² L)/ε0 gives E = ρr / (2ε0)"),
            ("Infinite non-conducting cylinder of radius R with uniform volume density ρ (field at r > R)", "IV", "E = (ρ R²) / (2ε0 r)", "Gauss's law: E(2πr L) = (ρ πR² L)/ε0 gives E = ρR² / (2ε0 r)"),
            ("Coaxial cylindrical cable: inner cylinder of charge +λ per unit length, outer shell of -λ (field at r between cylinders)", "III", "E = λ / (2πε0 r)", "Enclosing only inner cylinder: E(2πr L) = (λ L)/ε0 gives E = λ / (2πε0 r)"),
        ], "D"))

    # ==========================================
    # TOPIC: Electric Potential and Capacitance
    # ==========================================
    t = "Electric Potential and Capacitance"
    prefix = "phy_mat_epc"

    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the basic electric potential quantities in List I with their definitions or units in List II:",
        [
            ("Electric potential at distance r from an isolated point charge q", "II", "V = (1 / (4πε0)) * (q / r)", "Potential from infinity to distance r is V = kq / r"),
            ("Work done by external agent in moving charge q from potential V_A to V_B", "IV", "W_ext = q (V_B - V_A)", "Work done against electrostatic force is W_ext = ΔU = q ΔV"),
            ("SI unit of electric potential (Volt)", "I", "1 Joule / Coulomb", "By definition, 1 Volt is equal to 1 Joule per Coulomb"),
            ("Energy gained by an electron accelerated through a potential difference of 1 Volt", "III", "1 electron-volt (1 eV = 1.6 × 10^(-19) J)", "By definition, 1 eV = e * 1 V = 1.6 × 10^(-19) Joules"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the fundamental capacitor formulas in List I with their expressions in List II:",
        [
            ("Definition of capacitance of a conductor", "III", "C = Q / V", "Capacitance is the ratio of stored charge to electric potential difference"),
            ("Capacitance of an air-filled parallel plate capacitor of area A and separation d", "I", "C0 = (ε0 A) / d", "Using E = σ/ε0 and V = Ed, C0 = Q/V = ε0 A / d"),
            ("Electrostatic energy stored in a charged capacitor of capacitance C at voltage V", "IV", "U = (1 / 2) C V²", "Integrating V dq gives U = (1/2) C V² = Q² / (2C) = (1/2) Q V"),
            ("SI unit of capacitance (Farad)", "II", "1 Coulomb / Volt", "From C = Q/V, 1 Farad is 1 Coulomb per Volt"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "For two capacitors C1 and C2 connected together, match the combination characteristics in List I with List II:",
        [
            ("Equivalent capacitance when connected in series", "IV", "C_eq = (C1 C2) / (C1 + C2)", "In series, 1/C_eq = 1/C1 + 1/C2 => C_eq = C1 C2 / (C1 + C2)"),
            ("Equivalent capacitance when connected in parallel", "II", "C_eq = C1 + C2", "In parallel, total charge Q = Q1 + Q2 = (C1 + C2)V => C_eq = C1 + C2"),
            ("Charge distribution when connected in series across a voltage source V", "I", "Equal charge Q = C_eq V resides on both capacitors", "Series components carry the same charge displaced through the circuit"),
            ("Potential difference across each capacitor when connected in parallel across voltage V", "III", "Equal potential difference V across both capacitors", "Parallel branches share the same common pair of electrical nodes"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the characteristics of equipotential surfaces in List I with their physical properties in List II:",
        [
            ("Angle between electric field lines and equipotential surfaces", "I", "90° (they are mutually orthogonal everywhere)", "Since dV = -E · dr = 0 along equipotential, E must be perpendicular to dr"),
            ("Work done by electrostatic force in moving a charge along an equipotential surface", "III", "Zero work done", "W = -q ΔV = -q(0) = 0"),
            ("Geometric shape of equipotential surfaces around an isolated point charge", "IV", "Concentric spherical surfaces centered at the charge", "V = kq/r is constant whenever r is constant, forming concentric spheres"),
            ("Spacing of equipotential surfaces having constant potential differences", "II", "Closer together in regions of stronger electric field", "Since E = -ΔV/Δr, larger E means smaller spacing Δr for constant ΔV"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each charged body in List I with its electric potential at the specified location in List II (k = 1 / (4πε0)):",
        [
            ("Uniformly charged ring of radius R, charge Q, at axial distance x from center", "II", "V = (k Q) / √(R² + x²)", "All charge elements are equidistant at r = √(R² + x²), so V = kQ / √(R² + x²)"),
            ("Uniformly charged disc of radius R, surface charge density σ, at axial distance x", "IV", "V = (σ / (2ε0)) * (√(R² + x²) - x)", "Integrating concentric rings from 0 to R gives V = (σ / (2ε0)) * (√(R² + x²) - x)"),
            ("Uniformly charged spherical shell of radius R, charge Q, at an interior point r < R", "III", "V = k Q / R (uniform throughout the cavity)", "Inside shell E = 0, so potential is constant and equals surface potential kQ / R"),
            ("Uniformly charged spherical shell of radius R, charge Q, at an exterior point r > R", "I", "V = k Q / r", "Outside shell, potential is the same as if all charge were concentrated at center"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Match the relation between electric field and potential in List I with its formulation in List II:",
        [
            ("Electric field component along x-direction from potential function V(x, y, z)", "III", "E_x = -∂V / ∂x", "Electric field is negative gradient of potential: E_x = -∂V/∂x"),
            ("Potential difference V_A - V_B between two points in a uniform electric field E", "I", "V_A - V_B = E · (r_B - r_A)", "Integrating -E · dr gives V_A - V_B = E · Δr"),
            ("Potential V(r) relative to reference V(∞) = 0 for arbitrary field E(r)", "II", "V(r) = -∫_∞^r E · dr", "By definition of electrostatic potential with zero at infinity"),
            ("Relation between field vector E and spatial rate of potential change", "IV", "E = -(∂V/∂x i + ∂V/∂y j + ∂V/∂z k) = -∇V", "Electric field vector equals negative gradient of the scalar potential"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "For a short electric dipole of dipole moment p, match the potential and work quantities in List I with List II (k = 1 / (4πε0)):",
        [
            ("Electric potential at an axial point at distance r from dipole", "IV", "V = (k p) / r²", "At axial point θ = 0, V = kp cos(0) / r² = kp / r²"),
            ("Electric potential at an equatorial point at distance r from dipole", "II", "V = 0", "At equatorial plane θ = 90°, cos(90°) = 0, so V = 0"),
            ("Electric potential at a general point (r, θ)", "I", "V = (k p cos θ) / r²", "Dipole potential V = (k p · r̂) / r² = (kp cos θ) / r²"),
            ("Work done by external agent to rotate dipole from θ = 0° to θ = 90° in uniform field E", "III", "W = p E", "W = U(90°) - U(0°) = 0 - (-pE) = pE"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match the electrostatic self-energy or system potential energy in List I with its formula in List II (k = 1 / (4πε0)):",
        [
            ("Electrostatic self-energy of a uniformly charged thin spherical shell (radius R, charge Q)", "I", "U = (k Q²) / (2 R)", "Integrating (1/2)ε0 E² from R to ∞ gives U = kQ² / (2R)"),
            ("Electrostatic self-energy of a uniformly charged non-conducting solid sphere (radius R, charge Q)", "IV", "U = (3 k Q²) / (5 R)", "Integrating inside and outside energy densities yields U = (3/5) kQ² / R"),
            ("Potential energy of two point charges q1 and q2 separated by distance r", "II", "U = (k q1 q2) / r", "By Coulomb's law, pair interaction energy is kq1 q2 / r"),
            ("Total electrostatic potential energy of three equal charges q at vertices of equilateral triangle of side a", "III", "U = (3 k q²) / a", "Summing pairwise potential energy for 3 pairs gives U = 3 * (kq² / a)"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "A parallel plate capacitor (initial capacitance C0, charge Q0, voltage V0, energy U0) is connected to a battery. A dielectric slab of constant K completely fills the gap with BATTERY REMAINING CONNECTED. Match List I with List II:",
        [
            ("Final potential difference across the capacitor plates", "II", "V = V0 (remains constant)", "Battery maintains fixed potential difference V0 across the plates"),
            ("Final capacitance of the capacitor", "III", "C = K C0", "Presence of dielectric increases capacitance by dielectric constant factor K"),
            ("Final charge stored on the capacitor plates", "IV", "Q = K Q0", "Since Q = C V = (K C0) V0 = K Q0, charge increases by factor K"),
            ("Final electrostatic energy stored in the capacitor", "I", "U = K U0", "U = (1/2) C V² = (1/2) (K C0) V0² = K U0, energy increases by factor K"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "A parallel plate capacitor (initial capacitance C0, charge Q0, voltage V0, energy U0) is charged and then the BATTERY IS DISCONNECTED. A dielectric slab of constant K completely fills the gap. Match List I with List II:",
        [
            ("Final charge stored on the capacitor plates", "III", "Q = Q0 (remains constant)", "Isolated plates cannot exchange charge, so charge Q0 is conserved"),
            ("Final capacitance of the capacitor", "I", "C = K C0", "Dielectric increases capacitance by factor K regardless of battery connection"),
            ("Final potential difference across the capacitor plates", "IV", "V = V0 / K", "Since V = Q / C = Q0 / (K C0) = V0 / K, voltage decreases by factor K"),
            ("Final electrostatic energy stored in the capacitor", "II", "U = U0 / K", "U = Q² / (2C) = Q0² / (2 K C0) = U0 / K, energy decreases by factor K"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Match each capacitor geometry in List I with its capacitance expression in List II:",
        [
            ("Isolated conducting sphere of radius R in vacuum", "IV", "C = 4πε0 R", "With reference at infinity, C = Q / V = Q / (Q / (4πε0 R)) = 4πε0 R"),
            ("Concentric spherical capacitor of radii a and b (b > a) with outer shell grounded", "II", "C = 4πε0 (a b) / (b - a)", "V = kq(1/a - 1/b) gives C = q / V = 4πε0 ab / (b - a)"),
            ("Coaxial cylindrical capacitor of radii a and b (b > a) per unit length", "III", "C / L = (2πε0) / ln(b / a)", "V = (λ / 2πε0) ln(b/a) gives capacitance per length C/L = 2πε0 / ln(b/a)"),
            ("Parallel plate capacitor of area A filled with two dielectrics K1 and K2 each occupying half area A/2", "I", "C = (ε0 A / (2 d)) * (K1 + K2)", "The two halves act as two capacitors in parallel: C = C1 + C2 = ε0(A/2)K1/d + ε0(A/2)K2/d"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Two capacitors C1 charged to potential V1 and C2 charged to potential V2 are connected in parallel with plates of like polarity joined together. Match List I with List II:",
        [
            ("Common potential V_c across the parallel combination", "I", "V_c = (C1 V1 + C2 V2) / (C1 + C2)", "Total charge Q = C1 V1 + C2 V2 shared across C_eq = C1 + C2 gives V_c = Q / C_eq"),
            ("Final charge q1' on capacitor C1", "III", "q1' = C1 (C1 V1 + C2 V2) / (C1 + C2)", "q1' = C1 V_c = C1 (C1 V1 + C2 V2) / (C1 + C2)"),
            ("Loss of electrostatic energy ΔU during charge redistribution", "IV", "ΔU = (C1 C2 (V1 - V2)²) / (2 (C1 + C2))", "Calculating U_initial - U_final yields energy loss dissipated as heat and radiation"),
            ("Ratio of final charges q1' / q2' on the two capacitors", "II", "q1' / q2' = C1 / C2", "Since both capacitors share common potential V_c, q1'/q2' = (C1 V_c)/(C2 V_c) = C1/C2"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Two concentric conducting spherical shells have radii a and b (b > a). Match the earthing configuration in List I with its outcome in List II (k = 1 / (4πε0)):",
        [
            ("Inner shell carries charge Q, outer shell is grounded (earthed)", "II", "Outer shell acquires charge -Q; potential of inner shell is kQ(1/a - 1/b)", "Grounding outer shell sets V_b = 0, inducing charge -Q on inner surface of outer shell"),
            ("Outer shell carries charge Q, inner shell is grounded (earthed)", "IV", "Inner shell acquires induced charge q = -(a / b) Q", "Setting V_inner = kq/a + kQ/b = 0 gives induced charge q = -(a/b)Q"),
            ("Potential of a conducting shell connected to Earth", "I", "V = 0 (by definition of ground reference)", "Earthing maintains the electrical potential of the connected conductor at zero"),
            ("Capacitance of system when inner shell is charged and outer shell is grounded", "III", "C = 4πε0 (a b) / (b - a)", "Standard spherical capacitor with outer shell grounded has C = 4πε0 ab / (b - a)"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "A parallel plate capacitor has plate area A and separation d. Match the dielectric configuration in List I with the equivalent capacitance in List II:",
        [
            ("Dielectric slab of thickness t < d and constant K inserted between plates", "III", "C = (ε0 A) / (d - t + t / K)", "Capacitance formula with partial dielectric slab: C = ε0 A / (d - t + t/K)"),
            ("Conducting metal plate of thickness t < d inserted between plates", "I", "C = (ε0 A) / (d - t)", "For a conductor K → ∞, so d - t + t/K becomes d - t"),
            ("Two dielectric slabs of thickness d/2 with constants K1 and K2 in series", "IV", "C = (2 ε0 A / d) * ((K1 K2) / (K1 + K2))", "Two capacitors in series C1 = 2K1 ε0 A/d and C2 = 2K2 ε0 A/d give series combination"),
            ("Dielectric slab where dielectric constant varies continuously as K(x) = K0 + α x across thickness d", "II", "C = (ε0 A α) / ln(1 + α d / K0)", "Integrating d(1/C) = dx / (ε0 A K(x)) from 0 to d gives 1/C = ln(1 + αd/K0) / (ε0 A α)"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Match the electrostatic force and energy density concepts in List I with their expressions in List II:",
        [
            ("Electrostatic energy density u in an electric field E in vacuum", "IV", "u = (1 / 2) ε0 E²", "Energy density is energy per unit volume u = (1/2) ε0 E²"),
            ("Attractive force F between two oppositely charged plates of a parallel plate capacitor", "III", "F = Q² / (2 ε0 A) = (1 / 2) Q E", "Each plate experiences field E/2 due to the other plate, so force F = Q(E/2) = Q²/(2ε0 A)"),
            ("Inward force on a dielectric slab (width w) partially inserted at constant voltage V", "I", "F = (1 / 2) (K - 1) ε0 w V² / d", "Force F = (1/2) V² dC/dx where dC/dx = (K - 1) ε0 w / d"),
            ("Electrostatic mechanical pressure P on the charged surface of a conductor", "II", "P = σ² / (2 ε0)", "Outward mechanical stress on conductor surface is P = (1/2) σ E_surface = σ² / (2ε0)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Parallel identical conducting plates each of area A are arranged with equal spacing d. Match the plate configuration in List I with its equivalent capacitance in List II (C0 = ε0 A / d):",
        [
            ("4 identical equidistant plates with alternate plates connected (plates 1 & 3 to A, plates 2 & 4 to B)", "I", "C_eq = 3 C0", "Forms 3 identical parallel capacitors in parallel: C_eq = 3 C0"),
            ("4 identical equidistant plates with outer two connected to A and inner two connected to B", "IV", "C_eq = 2 C0", "Between 1 and 2 is C0, between 3 and 4 is C0; space between 2 and 3 has zero field, so C_eq = 2 C0"),
            ("N equidistant identical plates alternately connected to two terminals", "II", "C_eq = (N - 1) C0", "N plates form (N - 1) capacitors all connected in parallel: C_eq = (N - 1) C0"),
            ("3 identical equidistant plates with outer two connected to terminal A and middle plate to terminal B", "III", "C_eq = 2 C0", "Forms 2 capacitors in parallel between terminals A and B: C_eq = 2 C0"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match the capacitor circuit networks in List I with their equivalent capacitance across input terminals in List II:",
        [
            ("Infinite ladder network with series capacitor C and shunt capacitor C", "II", "C_eq = ((√5 - 1) / 2) C", "C_eq = C(C + C_eq)/(2C + C_eq) yields quadratic C_eq² + C C_eq - C² = 0, C_eq = ((√5 - 1)/2) C"),
            ("Infinite ladder network with series capacitor C and shunt capacitor 2C", "III", "C_eq = (√3 - 1) C", "C_eq = C(2C + C_eq)/(3C + C_eq) yields C_eq² + 2C C_eq - 2C² = 0, C_eq = (√3 - 1) C"),
            ("Symmetric Wheatstone bridge of 5 identical capacitors each of capacitance C", "IV", "C_eq = C", "Bridge is balanced, central capacitor carries no charge, two parallel branches of 2 series capacitors give C/2 + C/2 = C"),
            ("Delta (Δ) network of three capacitors each equal to C converted into equivalent Star (Y) network", "I", "Each star arm has capacitance C_Y = 3 C", "Star-delta conversion for capacitances gives C_Y = 3 C_Δ"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "An uncharged capacitor C is connected in series with resistor R and battery of EMF V0 at t = 0 (charging RC circuit). Match List I with List II:",
        [
            ("Charge q(t) on the capacitor as a function of time", "III", "q(t) = C V0 (1 - e^(-t / RC))", "Solving differential equation R dq/dt + q/C = V0 gives q(t) = C V0 (1 - e^(-t/RC))"),
            ("Charging current i(t) as a function of time", "IV", "i(t) = (V0 / R) e^(-t / RC)", "Differentiating q(t) gives i(t) = dq/dt = (V0/R) e^(-t/RC)"),
            ("Total work done by the battery during the complete charging process", "I", "W_battery = C V0²", "Work done by battery W = Q_final * V0 = (C V0) * V0 = C V0²"),
            ("Total heat energy dissipated in the resistor R during complete charging", "II", "H = (1 / 2) C V0²", "H = W_battery - U_stored = C V0² - (1/2) C V0² = (1/2) C V0²"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "A capacitor C carrying initial charge Q0 is discharged through a resistor R at t = 0 (discharging RC circuit). Match List I with List II:",
        [
            ("Charge q(t) on the capacitor as a function of time", "IV", "q(t) = Q0 e^(-t / RC)", "Differential equation R dq/dt + q/C = 0 gives q(t) = Q0 e^(-t/RC)"),
            ("Time constant τ of the RC discharge circuit", "I", "τ = R C", "At t = τ = RC, charge decreases to Q0 / e ≈ 0.368 Q0"),
            ("Time t_half taken for the capacitor charge to drop to half its initial value", "II", "t_half = R C ln 2", "Setting q(t) = Q0 / 2 gives e^(-t/RC) = 1/2 => t = RC ln 2"),
            ("Fraction of initial electrostatic energy remaining in the capacitor at t = τ", "III", "U(τ) / U0 = e^(-2) ≈ 0.135", "Energy U ∝ q² ∝ e^(-2t/RC); at t = RC, fraction is e^(-2) ≈ 0.135"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match the electrostatic boundary condition and polarization quantities in List I with their mathematical statements in List II:",
        [
            ("Electric displacement vector D in a linear dielectric medium", "I", "D = ε0 E + P = ε_r ε0 E", "Definition of electric displacement in terms of electric field and polarization"),
            ("Boundary condition for normal component of D across a charge-free dielectric interface", "II", "D1n = D2n", "Gauss's law on thin pillbox at interface without free charge gives continuity of D_n"),
            ("Boundary condition for tangential component of E across any dielectric interface", "III", "E1t = E2t", "Conservative nature of electric field ∮ E · dl = 0 gives continuity of E_t"),
            ("Bound surface charge density σ_b on the boundary of a polarized dielectric", "IV", "σ_b = P · n̂", "Polarization vector produces bound surface charge density σ_b = P · n̂"),
        ], "D"))

    # ==========================================
    # TOPIC: Current Electricity
    # ==========================================
    t = "Current Electricity"
    prefix = "phy_mat_ce"

    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the microscopic conduction quantities in List I with their expressions in List II:",
        [
            ("Electric current I in terms of drift velocity v_d", "II", "I = n e A v_d", "Current is charge passing per second: I = n e A v_d"),
            ("Drift velocity v_d of electrons in terms of relaxation time τ and field E", "IV", "v_d = (e E τ) / m", "Acceleration a = eE/m over average relaxation time τ gives v_d = eEτ/m"),
            ("Electron mobility μ definition", "I", "μ = v_d / E = (e τ) / m", "Mobility is drift speed per unit electric field: μ = v_d / E = eτ / m"),
            ("Current density vector j in terms of conductivity σ", "III", "j = I / A = σ E", "Current density j = n e v_d = (n e² τ / m) E = σ E"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the resistance and conductivity parameters in List I with their formulas or definitions in List II:",
        [
            ("Resistance R of a cylindrical conductor (length L, cross-sectional area A)", "III", "R = (ρ L) / A", "Resistance is directly proportional to length and inversely to area: R = ρL / A"),
            ("Microscopic formula for electrical resistivity ρ", "I", "ρ = m / (n e² τ)", "From Ohm's law microscopically, ρ = 1/σ = m / (n e² τ)"),
            ("Electrical conductivity σ of a conductor", "IV", "σ = 1 / ρ = (n e² τ) / m", "Conductivity is the reciprocal of resistivity: σ = n e² τ / m"),
            ("Electrical conductance G of a conductor", "II", "G = 1 / R (measured in Siemens or Ω^(-1))", "Conductance is the reciprocal of resistance, SI unit Siemens"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the resistor color codes and temperature parameters in List I with their values in List II:",
        [
            ("Tolerance band color Gold", "IV", "± 5% tolerance", "Gold Fourth band represents ±5% tolerance"),
            ("Tolerance band color Silver", "II", "± 10% tolerance", "Silver Fourth band represents ±10% tolerance"),
            ("Temperature dependence of resistance R(T) with temperature coefficient α", "I", "R(T) = R0 (1 + α ΔT)", "Linear approximation of resistance with temperature change ΔT"),
            ("Carbon resistor with color bands Yellow, Violet, Orange", "III", "47 × 10³ Ω = 47 kΩ", "Yellow = 4, Violet = 7, Orange = 10³, giving 47 kΩ"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the electrical energy and power quantities in List I with their expressions in List II:",
        [
            ("Joule's heating power P dissipated in a resistor of resistance R carrying current I", "I", "P = I² R", "Joule's law states heat generated per second is P = I² R"),
            ("Electric power expressed in terms of voltage V and resistance R", "III", "P = V² / R", "Using Ohm's law I = V/R, power is P = V² / R"),
            ("Electrical energy equivalent of 1 kilowatt-hour (1 kWh)", "IV", "3.6 × 10⁶ Joules", "1 kWh = 1000 W * 3600 s = 3.6 × 10⁶ J"),
            ("Equivalent power of two bulbs rated P1 and P2 connected in series across rated mains voltage", "II", "P_eq = (P1 P2) / (P1 + P2)", "In series, R_total = R1 + R2 => V²/P_eq = V²/P1 + V²/P2 => P_eq = P1 P2 / (P1 + P2)"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "A cell of EMF E and internal resistance r is connected to an external circuit. Match List I with List II:",
        [
            ("Terminal potential difference V when cell delivers current I to load resistance R", "II", "V = E - I r = (E R) / (R + r)", "During discharge, terminal voltage is reduced by internal drop: V = E - Ir"),
            ("Terminal potential difference V when cell is being charged by external current I", "IV", "V = E + I r", "During charging, terminal voltage must overcome both EMF and internal resistance: V = E + Ir"),
            ("Terminal potential difference under open-circuit condition (I = 0)", "I", "V = E", "With zero current drawn, terminal potential equals the EMF: V = E"),
            ("Current delivered by the cell under short-circuit condition (R = 0)", "III", "I_sc = E / r", "With zero external resistance, maximum short-circuit current is I_sc = E / r"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "For groupings of identical cells each of EMF E and internal resistance r, match List I with List II:",
        [
            ("Current through load R when n identical cells are connected in series", "III", "I = (n E) / (R + n r)", "Series cells add EMFs to nE and internal resistances to nr: I = nE / (R + nr)"),
            ("Current through load R when m identical cells are connected in parallel", "I", "I = E / (R + r / m)", "Parallel identical cells maintain EMF E with equivalent internal resistance r/m: I = E / (R + r/m)"),
            ("Condition for maximum power in mixed grouping of m rows with n series cells each", "IV", "External resistance R = (n r) / m", "Maximum power transfer occurs when load resistance equals net internal resistance nr/m"),
            ("Maximum power delivered to the external load in optimal mixed grouping", "II", "P_max = (m n E²) / (4 r)", "P_max = E_total² / (4 R_internal) = (n E)² / (4 nr/m) = (mn E²) / (4r)"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Twelve identical resistors of resistance R form the edges of a cube. Match the equivalent resistance in List I with List II:",
        [
            ("Across body diagonally opposite corners of the cube", "IV", "R_eq = (5 / 6) R", "Symmetry dividing current into paths of 1/3, 1/6, 1/3 gives V = (1/3 + 1/6 + 1/3)IR = (5/6)IR"),
            ("Across face diagonally opposite corners of the cube", "III", "R_eq = (3 / 4) R", "Using symmetry across face diagonal yields equivalent resistance (3/4) R"),
            ("Across two adjacent corners along an edge of the cube", "II", "R_eq = (7 / 12) R", "Using superposition and symmetry for adjacent edge vertices yields (7/12) R"),
            ("Equivalent resistance of 3 identical resistors R in Delta (Δ) converted to Star (Y)", "I", "R_Y = R / 3", "Delta-Wye transformation for identical resistors gives each star branch R_Y = R / 3"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Match Kirchhoff's circuit laws and sign conventions in List I with their physical principles or rules in List II:",
        [
            ("Kirchhoff's First Rule (Junction Rule: ∑ I = 0)", "I", "Based on conservation of electric charge", "No charge can accumulate at a junction in steady state"),
            ("Kirchhoff's Second Rule (Loop Rule: ∑ ΔV = 0)", "IV", "Based on conservation of energy", "Work done in traversing a closed loop in a conservative electrostatic field is zero"),
            ("Potential change ΔV when traversing a resistor R in the direction of current I", "II", "ΔV = -I R (potential drops in direction of current)", "Current flows from higher to lower potential across a passive resistor"),
            ("Potential change ΔV when traversing a battery from negative to positive terminal", "III", "ΔV = +E (potential rises from low to high terminal)", "Traversing from negative to positive plate increases potential by EMF E"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "A Wheatstone bridge consists of four resistance arms P, Q, R, S with galvanometer G. Match List I with List II:",
        [
            ("Balanced bridge condition", "II", "P / Q = R / S", "When P/Q = R/S, potentials at galvanometer nodes are equal"),
            ("Current through galvanometer branch when bridge is balanced", "III", "I_g = 0", "Zero potential difference across the galvanometer branch gives I_g = 0"),
            ("Equivalent resistance across supply terminals when all four arms equal r0 and bridge is balanced", "IV", "R_eq = r0", "Two parallel branches each of resistance 2r0 give R_eq = (2r0 * 2r0) / (4r0) = r0"),
            ("Condition for maximum sensitivity of a Wheatstone bridge", "I", "All four resistances are approximately equal: P ≈ Q ≈ R ≈ S", "Galvanometer shows maximum deflection per fractional change when arms are of comparable magnitude"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "A meter bridge (slide wire bridge) has a 100 cm uniform wire. Known resistance R is in left gap, unknown resistance X is in right gap, and balance length is l cm from left end. Match List I with List II:",
        [
            ("Unknown resistance X expression", "III", "X = R * (100 - l) / l", "By Wheatstone bridge principle, R / X = l / (100 - l) => X = R * (100 - l) / l"),
            ("Working principle of the meter bridge", "I", "Balanced Wheatstone bridge principle", "The meter bridge is a practical laboratory realization of a Wheatstone bridge"),
            ("Reason for choosing standard resistance R such that balance point l is near 50 cm", "IV", "Minimizes the fractional percentage error in determining X", "Fractional error dl/l + dl/(100-l) has a minimum at l = 50 cm"),
            ("Physical origin of end errors in meter bridge", "II", "Resistance of copper connecting strips and contact resistance at wire ends", "Thick copper strips at ends introduce small non-negligible resistances not measured by meter rule"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "A potentiometer wire of length L and resistance R_w is connected to driver cell E0 and rheostat R_h. Match List I with List II:",
        [
            ("Potential gradient k along the potentiometer wire", "IV", "k = (E0 R_w) / ((R_w + R_h + r) L)", "Potential gradient is voltage across wire divided by length: k = V_wire / L"),
            ("Comparison of EMFs of two cells giving balance lengths l1 and l2", "II", "E1 / E2 = l1 / l2", "Since E1 = k l1 and E2 = k l2, their ratio is E1 / E2 = l1 / l2"),
            ("Primary advantage of potentiometer over an ordinary voltmeter", "I", "Draws zero current at the null point, measuring ideal open-circuit EMF", "A voltmeter draws current and measures terminal voltage; potentiometer is an ideal null detector"),
            ("Method to increase the sensitivity of a potentiometer", "III", "Decrease potential gradient by increasing wire length L or decreasing driver current", "Smaller k means larger shift in balance length for a given change in potential"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "In a potentiometer experiment to find internal resistance r of a cell of EMF E, balance length is l1 on open circuit and l2 when shunted by resistance R. Match List I with List II:",
        [
            ("Formula for internal resistance r of the cell", "I", "r = R * (l1 / l2 - 1)", "E = k l1, V = k l2 => E / V = l1 / l2; with r = R(E/V - 1), r = R(l1/l2 - 1)"),
            ("Potential difference V across the cell when shunted by resistance R", "III", "V = E * (l2 / l1) = (E R) / (R + r)", "The shunted balance length l2 is directly proportional to terminal voltage V"),
            ("Effect on balance length l2 when shunt resistance R is decreased", "IV", "l2 decreases because terminal voltage V decreases", "Smaller R increases current I, increasing internal drop Ir and lowering V = E - Ir"),
            ("Result if driver cell EMF is less than the test cell EMF E", "II", "No balance point can be found on the potentiometer wire", "Potentiometer wire total voltage cannot balance a larger EMF, so galvanometer deflects to one side only"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A conductor of length L and resistivity ρ has the shape of a truncated circular cone with end radii a and b (a < b). A steady current I flows through it. Match List I with List II:",
        [
            ("Total electrical resistance of the truncated cone", "II", "R = (ρ L) / (π a b)", "Integrating dR = ρ dx / (π r(x)²) where r(x) = a + (b - a)x/L yields R = ρL / (π a b)"),
            ("Ratio of current density at the narrow end to wide end (j_a / j_b)", "IV", "j_a / j_b = (b / a)²", "Since current I is constant, j = I / (π r²) => j_a / j_b = (π b²) / (π a²) = (b/a)²"),
            ("Ratio of electric field at the narrow end to wide end (E_a / E_b)", "I", "E_a / E_b = (b / a)²", "From Ohm's law in point form E = ρ j, E_a / E_b = j_a / j_b = (b / a)²"),
            ("Ratio of electron drift velocity at the narrow end to wide end (v_da / v_db)", "III", "v_da / v_db = (b / a)²", "Since j = n e v_d, drift velocity is directly proportional to current density: v_da / v_db = (b/a)²"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match the infinite resistor ladder networks in List I with their equivalent resistances across input terminals in List II:",
        [
            ("Infinite ladder with series resistors R and shunt resistors R", "III", "R_eq = ((1 + √5) / 2) R", "R_eq = R + (R R_eq)/(R + R_eq) => R_eq² - R R_eq - R² = 0 => R_eq = ((1 + √5)/2) R"),
            ("Infinite ladder with series resistors R and shunt resistors 2R", "I", "R_eq = 2 R", "R_eq = R + (2R R_eq)/(2R + R_eq) => R_eq² - R R_eq - 2R² = 0 => (R_eq - 2R)(R_eq + R) = 0 => R_eq = 2R"),
            ("Infinite ladder with series resistors 2R and shunt resistors R", "IV", "R_eq = (1 + √3) R", "R_eq = 2R + (R R_eq)/(R + R_eq) => R_eq² - 2R R_eq - 2R² = 0 => R_eq = (1 + √3) R"),
            ("Infinite ladder with series resistors R and shunt resistors 3R", "II", "R_eq = ((1 + √13) / 2) R", "R_eq = R + (3R R_eq)/(3R + R_eq) => R_eq² - R R_eq - 3R² = 0 => R_eq = ((1 + √13)/2) R"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "A DC source has open-circuit EMF E_th and internal Thevenin resistance R_th connected to a variable load resistor R_L. Match List I with List II:",
        [
            ("Condition for maximum power transfer to the load resistor", "IV", "R_L = R_th", "Maximum power transfer theorem requires load resistance to match Thevenin source resistance"),
            ("Maximum power delivered to the load resistor", "II", "P_max = E_th² / (4 R_th)", "Substituting R_L = R_th into P = I² R_L = (E_th / (2 R_th))² R_th = E_th² / (4 R_th)"),
            ("Efficiency η of power transfer at the maximum power condition", "III", "η = 50%", "At R_L = R_th, power dissipated in internal resistance equals load power, so efficiency is 50%"),
            ("Power delivered to the load when R_L = 2 R_th", "I", "P = (2 / 9) * (E_th² / R_th)", "P = (E_th / (3 R_th))² * (2 R_th) = (2/9) E_th² / R_th"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "A galvanometer of coil resistance G and full-scale deflection current I_g is converted into measurement meters. Match List I with List II:",
        [
            ("Shunt resistance S required to convert into ammeter of range 0 to I (I > I_g)", "I", "S = (I_g G) / (I - I_g)", "Voltage across shunt equals voltage across galvanometer: (I - I_g) S = I_g G => S = I_g G / (I - I_g)"),
            ("Series resistance R required to convert into voltmeter of range 0 to V", "III", "R = (V / I_g) - G", "Total resistance R + G must satisfy I_g (R + G) = V => R = V / I_g - G"),
            ("Effective resistance of the converted ammeter", "IV", "R_A = (G S) / (G + S) < S", "Parallel combination of G and S gives R_A = GS / (G + S), which is less than S"),
            ("Effective resistance of the converted voltmeter", "II", "R_V = G + R > G", "Series combination of G and R gives high input resistance R_V = G + R"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Match the non-linear electrical components in List I with their conduction characteristics in List II:",
        [
            ("Filament incandescent lamp at high operating temperatures", "II", "Resistance increases with temperature (V-I curve bends toward voltage axis)", "Positive temperature coefficient of metals causes resistance to rise as current heats the filament"),
            ("Semiconductor thermistor with negative temperature coefficient (NTC)", "IV", "Resistance decreases exponentially with temperature", "Thermal generation of charge carriers increases carrier concentration exponentially"),
            ("Dynamic resistance r_d of a non-linear device at operating point (V0, I0)", "I", "r_d = dV / dI at (V0, I0)", "Dynamic resistance is the reciprocal slope of the V-I characteristic at that operating point"),
            ("Ideal p-n junction diode in reverse bias prior to breakdown", "III", "Very small saturation current (dynamic resistance approaches infinity)", "Minority carrier drift current is negligible, presenting extremely high dynamic resistance"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Match the thermoelectric phenomena in List I with their physical formulas or descriptions in List II:",
        [
            ("Thermoelectric EMF E as a quadratic function of temperature difference T", "III", "E = α T + (1 / 2) β T²", "Empirical parabolic relation for thermoelectric EMF where α and β are thermoelectric constants"),
            ("Neutral temperature T_n where thermoelectric EMF attains maximum value", "I", "T_n = -α / β", "Setting dE/dT = α + β T = 0 gives neutral temperature T_n = -α / β"),
            ("Inversion temperature T_i where thermoelectric EMF drops to zero", "IV", "T_i = 2 T_n - T_c = -2α / β - T_c", "By symmetry of parabola about T_n, T_i - T_n = T_n - T_c => T_i = 2 T_n - T_c"),
            ("Thomson second relation connecting Peltier coefficient Π and Seebeck coefficient S", "II", "Π = S T", "Thermodynamic relation derived by Kelvin relating Peltier heat to Seebeck coefficient"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Two resistors R1 and R2 have temperature coefficients of resistance α1 and α2. Match List I with List II:",
        [
            ("Effective temperature coefficient α_s when connected in series", "IV", "α_s = (R1 α1 + R2 α2) / (R1 + R2)", "R_s(T) = R1(1 + α1 ΔT) + R2(1 + α2 ΔT) = (R1 + R2)(1 + α_s ΔT) where α_s = (R1 α1 + R2 α2)/(R1 + R2)"),
            ("Effective temperature coefficient α_p when connected in parallel", "II", "α_p = (R1 α2 + R2 α1) / (R1 + R2)", "1/R_p = 1/R1 + 1/R2; differentiating gives α_p = (R1 α2 + R2 α1)/(R1 + R2)"),
            ("Condition for a temperature-independent series combination (α_s = 0)", "III", "R1 α1 + R2 α2 = 0 (one coefficient must be negative)", "Setting α_s = 0 requires R1 α1 = -R2 α2, commonly achieved with carbon and copper"),
            ("Fractional change in series resistance per unit temperature rise", "I", "ΔR_s / (R_s0 ΔT) = α_s", "Definition of effective temperature coefficient of resistance"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match the infinite 2D resistor grids of identical resistors R with the equivalent resistance between specified nodes in List II:",
        [
            ("Between two immediately adjacent nodes of an infinite 2D square grid", "I", "R_eq = R / 2", "By injecting current I at one node and removing from infinity, current in branch is I/4; superposition of -I gives I/2 through branch, so V = (I/2)R => R_eq = R/2"),
            ("Between two diagonally opposite nodes across a single square in an infinite 2D grid", "III", "R_eq = (2 / π) R", "Using Fourier integral or superposition methods yields R_eq = (2 / π) R"),
            ("Between two immediately adjacent nodes of an infinite 2D triangular grid", "IV", "R_eq = R / 3", "Each node in triangular grid connects 6 branches; injecting I gives I/6, superposition gives branch current I/3, so R_eq = R/3"),
            ("Between two immediately adjacent nodes of an infinite 2D hexagonal (honeycomb) grid", "II", "R_eq = (2 / 3) R", "Each node connects 3 branches; injecting I gives I/3, superposition gives branch current 2I/3, so R_eq = (2/3) R"),
        ], "D"))

    return qs
