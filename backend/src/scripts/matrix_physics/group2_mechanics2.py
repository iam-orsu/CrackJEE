from builder import make_matrix_q

def get_questions():
    qs = []

    # ==========================================
    # TOPIC: Work Energy and Power (20 questions)
    # ==========================================
    t = "Work Energy and Power"
    prefix = "phy_mat_wep"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "A constant force F = (3i + 4j - 2k) N acts on a particle. Match the displacements in List I with the work done by the force in List II:",
        [
            ("Displacement d1 = (2i + 3j + 1k) m", "III", "16 J", "W = F . d1 = 3(2) + 4(3) - 2(1) = 6 + 12 - 2 = 16 J"),
            ("Displacement d2 = (2i + 0j + 3k) m", "I", "0 J", "W = F . d2 = 3(2) + 4(0) - 2(3) = 6 + 0 - 6 = 0 J"),
            ("Displacement d3 = (4i - 1j + 2k) m", "IV", "4 J", "W = F . d3 = 3(4) + 4(-1) - 2(2) = 12 - 4 - 4 = 4 J"),
            ("Displacement d4 = (-2i + 2j + 5k) m", "II", "-8 J", "W = F . d4 = 3(-2) + 4(2) - 2(5) = -6 + 8 - 10 = -8 J"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "A linear spring of stiffness k = 200 N/m is attached to a block. Match the spring displacements from equilibrium (x = 0) in List I with the work done by the spring force in List II:",
        [
            ("Stretching from x = 0 to x = +0.1 m", "IV", "-1.0 J", "Ws = (1/2)k(xi^2 - xf^2) = 0.5 * 200 * (0 - 0.01) = -1.0 J"),
            ("Stretching further from x = +0.1 m to x = +0.2 m", "I", "-3.0 J", "Ws = 0.5 * 200 * (0.01 - 0.04) = 100 * (-0.03) = -3.0 J"),
            ("Releasing from compression x = -0.2 m to x = 0 m", "II", "+4.0 J", "Ws = 0.5 * 200 * (0.04 - 0) = +4.0 J"),
            ("Compressing from x = 0 to x = -0.05 m", "III", "-0.25 J", "Ws = 0.5 * 200 * (0 - 0.0025) = -0.25 J"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each potential energy function U(x) in List I with the nature of equilibrium of a particle at x = 0 in List II:",
        [
            ("U(x) = U0 + (1/2) k x^2 (k > 0)", "II", "Stable equilibrium", "dU/dx = kx = 0 at x=0 and d^2U/dx^2 = k > 0, corresponding to a local potential energy minimum"),
            ("U(x) = U0 - (1/2) k x^2 (k > 0)", "IV", "Unstable equilibrium", "dU/dx = -kx = 0 at x=0 and d^2U/dx^2 = -k < 0, corresponding to a local potential energy maximum"),
            ("U(x) = U0 (constant for all x)", "I", "Neutral equilibrium", "dU/dx = 0 and d^2U/dx^2 = 0 everywhere, so the particle remains in equilibrium upon displacement"),
            ("U(x) = U0 - F0 x (F0 != 0)", "III", "Non-equilibrium (accelerating state)", "dU/dx = -F0 != 0, so a constant net force acts on the particle preventing equilibrium"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the physical quantities related to work, energy, and power in List I with their SI units and dimensional formulas in List II:",
        [
            ("Mechanical Work / Kinetic Energy", "I", "Joule (J) and [M L^2 T^(-2)]", "Work is force times displacement: N * m = kg m^2 s^(-2), dimensions [M L^2 T^(-2)]"),
            ("Instantaneous Power", "III", "Watt (W) and [M L^2 T^(-3)]", "Power is rate of work: J/s = kg m^2 s^(-3), dimensions [M L^2 T^(-3)]"),
            ("Spring stiffness constant k", "IV", "N/m and [M T^(-2)]", "Stiffness k = Force/displacement: N/m = kg s^(-2), dimensions [M L^0 T^(-2)]"),
            ("Linear momentum p", "II", "kg m/s and [M L T^(-1)]", "Linear momentum is mass times velocity: kg m s^(-1), dimensions [M L T^(-1)]"),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "A variable force F(x) = (6x^2 - 4x + 2) N acts along the x-axis on a 2 kg body. Match the displacement intervals in List I with the work done by F in List II:",
        [
            ("From x = 0 m to x = 1 m", "III", "2 J", "Integral of (6x^2 - 4x + 2)dx is [2x^3 - 2x^2 + 2x]. Evaluated from 0 to 1 gives 2 - 2 + 2 = 2 J"),
            ("From x = 0 m to x = 2 m", "I", "12 J", "Evaluated from 0 to 2 gives 2(8) - 2(4) + 2(2) = 16 - 8 + 4 = 12 J"),
            ("From x = 1 m to x = 3 m", "IV", "40 J", "At x=3: 2(27) - 2(9) + 2(3) = 54 - 18 + 6 = 42 J. Subtracting value at x=1 (2 J) gives 40 J"),
            ("From x = -1 m to x = 1 m", "II", "8 J", "At x=-1: 2(-1) - 2(1) + 2(-1) = -6 J. Value at x=1 is 2 J. Work = 2 - (-6) = 8 J"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "A particle of mass m is tied to a light string of length L and whirls in a vertical circle. Match the parameters at critical threshold in List I with their exact values in List II:",
        [
            ("Minimum speed at lowest point to complete full circle", "IV", "sqrt(5gL)", "At top, mg provides centripetal force: v_top = sqrt(gL). By conservation of energy, u = sqrt(gL + 4gL) = sqrt(5gL)"),
            ("Speed at highest point when launched with critical speed sqrt(5gL)", "I", "sqrt(gL)", "Energy conservation: (1/2)m u^2 = (1/2)m v_top^2 + 2mgL gives v_top = sqrt(5gL - 4gL) = sqrt(gL)"),
            ("Speed when string is horizontal when launched with sqrt(5gL)", "II", "sqrt(3gL)", "Energy conservation: (1/2)m u^2 = (1/2)m v_horiz^2 + mgL gives v_horiz = sqrt(5gL - 2gL) = sqrt(3gL)"),
            ("Difference between lowest and highest string tensions (T_low - T_high)", "III", "6mg", "T_low = mg + m(5gL)/L = 6mg; T_high = m(gL)/L - mg = 0; thus T_low - T_high = 6mg"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "The interatomic potential energy between two atoms is modeled by U(r) = U0 * [(r0/r)^12 - 2*(r0/r)^6]. Match the physical properties in List I with their expressions in List II:",
        [
            ("Equilibrium separation where net force is zero", "II", "r0", "dU/dr = U0 * [-12 r0^12 / r^13 + 12 r0^6 / r^7] = 0 implies r^6 = r0^6, so r = r0"),
            ("Depth of the potential well (dissociation/binding energy)", "IV", "U0", "U(r0) = U0 * [1 - 2] = -U0. The binding energy required to separate atoms to infinity is U0"),
            ("Separation distance r at which potential energy U(r) = 0", "I", "r0 / 2^(1/6)", "Setting (r0/r)^12 - 2(r0/r)^6 = 0 yields (r0/r)^6 = 2, so r = r0 / 2^(1/6)"),
            ("Effective harmonic force constant k_eff for small oscillations about r0", "III", "72 * U0 / r0^2", "d^2U/dr^2 at r0: U0 * [156/r0^2 - 84/r0^2] = 72 U0 / r0^2"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "A vehicle of mass m starts from rest and is driven by an engine delivering constant mechanical power P0. Match the kinematic quantities in List I with their proportionalities in List II:",
        [
            ("Speed as a function of time, v(t)", "I", "proportional to t^(1/2)", "P0 = d/dt (1/2 m v^2) => (1/2) m v^2 = P0 t => v(t) = sqrt(2 P0 t / m) proportional to t^(1/2)"),
            ("Displacement as a function of time, x(t)", "III", "proportional to t^(3/2)", "Integrating v(t) dt gives x(t) = (2/3) sqrt(2 P0 / m) t^(3/2) proportional to t^(3/2)"),
            ("Acceleration as a function of time, a(t)", "IV", "proportional to t^(-1/2)", "Differentiating v(t) gives a(t) = sqrt(P0 / (2m t)) proportional to t^(-1/2)"),
            ("Tractive driving force as a function of speed, F(v)", "II", "proportional to v^(-1)", "Since Power P0 = F * v, driving force is F = P0 / v proportional to v^(-1)"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match each physical scenario in List I with the work done by the specified force in List II:",
        [
            ("Kinetic friction on a block sliding to rest on a fixed rough horizontal floor", "III", "Negative work dissipating mechanical energy into thermal energy", "Kinetic friction opposes sliding displacement (theta = 180 deg), doing negative work -f_k * d and generating heat"),
            ("Static friction on the driving wheels of a car accelerating forward without slip", "I", "Positive work increasing translational kinetic energy", "Static friction at the road contact acts in the direction of vehicle acceleration, doing positive work on the car"),
            ("Normal reaction on a block sliding down a fixed smooth inclined plane", "IV", "Zero work because force is perpendicular to displacement", "The normal contact force is always normal to the inclined surface (theta = 90 deg), so W = N . d = 0"),
            ("Gravitational force on a projectile during upward flight to maximum height h", "II", "Negative work equal to -m g h", "Gravity acts downward while displacement is upward (theta = 180 deg), so work done is -m g h"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Consider vertical circular motion for a particle of mass m attached to a light rigid rod of length R versus a light inextensible string of length R. Match the quantities in List I with their values in List II:",
        [
            ("Minimum speed at bottom for rod system to reach the top", "IV", "2*sqrt(gR)", "A rigid rod can support compression, so velocity at top can be 0. (1/2)m u^2 = mg(2R) => u = sqrt(4gR) = 2*sqrt(gR)"),
            ("Minimum speed at bottom for string system to complete full circle", "I", "sqrt(5gR)", "A string requires tension T >= 0 at top, demanding v_top >= sqrt(gR). Energy conservation gives u = sqrt(5gR)"),
            ("Tension in rod at highest point when launched with u = 2*sqrt(gR)", "II", "Zero", "At the top v = 0, so centripetal acceleration is zero. Radial equilibrium gives T + mg = 0? Actually normal thrust N = mg, so tension is zero"),
            ("Tension in string at lowest point when launched with critical speed sqrt(5gR)", "III", "6mg", "T_bottom = mg + m u^2 / R = mg + m(5gR)/R = 6mg"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Two blocks of masses m1 = 2 kg and m2 = 3 kg lie on a frictionless horizontal table connected by a spring of stiffness k = 600 N/m. The spring is compressed by 0.1 m and released from rest. Match List I with List II:",
        [
            ("Total initial potential energy stored in the spring", "II", "3.0 J", "U = (1/2) k x0^2 = 0.5 * 600 * (0.1)^2 = 3.0 J"),
            ("Kinetic energy of block m1 when spring reaches natural length", "IV", "1.8 J", "Momentum conservation gives p1 = p2. K1/K2 = m2/m1 = 3/2. Thus K1 = (3/5) * 3.0 J = 1.8 J"),
            ("Kinetic energy of block m2 when spring reaches natural length", "I", "1.2 J", "Since K1 + K2 = 3.0 J, K2 = (2/5) * 3.0 J = 1.2 J"),
            ("Maximum speed attained by the center of mass of the two-block system", "III", "0 m/s", "No external horizontal forces act on the system, so the velocity of the center of mass remains zero throughout"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match each 2D force field F(x, y) in List I with its physical characteristic and potential energy function U(x, y) (with reference U(0,0)=0) in List II:",
        [
            ("F = (2xy) i + (x^2) j", "I", "Conservative with U(x,y) = -x^2 y", "Curl F = d/dx(x^2) - d/dy(2xy) = 2x - 2x = 0. Force is conservative; U = -integral (2xy dx + x^2 dy) = -x^2 y"),
            ("F = y i - x j", "III", "Non-conservative with non-zero curl", "Curl F = d/dx(-x) - d/dy(y) = -1 - 1 = -2 k != 0. The force is non-conservative and cannot have a scalar potential"),
            ("F = (3x^2) i + (4y^3) j", "IV", "Conservative with U(x,y) = -(x^3 + y^4)", "Curl F = 0. Integrating -F . dr gives U(x,y) = -x^3 - y^4"),
            ("F = -k(x i + y j)", "II", "Conservative central force with U(r) = (1/2) k r^2", "Curl F = 0. The force is isotropic and directed towards origin; U(r) = (1/2) k (x^2 + y^2) = (1/2) k r^2"),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A small particle of mass m rests at the apex of a fixed smooth sphere of radius R. Given an infinitesimal nudge, it slides down. Match the quantities at zenith angle theta in List I with their values in List II:",
        [
            ("Speed of the particle as a function of angle theta", "III", "sqrt(2gR(1 - cos theta))", "From energy conservation: (1/2)m v^2 = mgR(1 - cos theta) => v = sqrt(2gR(1 - cos theta))"),
            ("Normal reaction force N(theta) exerted by sphere on particle", "I", "mg(3 cos theta - 2)", "Radial equation: mg cos theta - N = m v^2 / R = 2mg(1 - cos theta) => N = mg(3 cos theta - 2)"),
            ("Cosine of the critical angle at which the particle detaches from sphere", "IV", "2/3", "Detachment occurs when normal reaction vanishes: N = 0 => 3 cos theta_c - 2 = 0 => cos theta_c = 2/3"),
            ("Height above the horizontal base where the particle loses contact", "II", "(5/3) R", "Height from center is R cos theta_c = (2/3)R. Total height from sphere base is R + (2/3)R = (5/3)R"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "A particle of mass m moves along the x-axis in a potential well given by U(x) = (a/2) x^2 - (b/4) x^4, where a, b > 0. Match List I with List II:",
        [
            ("Positions of unstable equilibrium points", "IV", "x = +- sqrt(a/b)", "dU/dx = ax - bx^3 = x(a - bx^2) = 0. Points x = +-sqrt(a/b) have d^2U/dx^2 = a - 3b(a/b) = -2a < 0 (unstable maxima)"),
            ("Angular frequency of small oscillations about the stable origin x = 0", "I", "sqrt(a/m)", "At x = 0, d^2U/dx^2 = a > 0 (stable minimum). The small oscillation frequency is omega = sqrt(U''(0)/m) = sqrt(a/m)"),
            ("Height of the potential barrier (energy required to escape from well)", "II", "a^2 / (4b)", "Potential barrier is U(+-sqrt(a/b)) - U(0) = (a/2)(a/b) - (b/4)(a^2/b^2) = a^2/(2b) - a^2/(4b) = a^2/(4b)"),
            ("Value of the restoring force at small displacement x << sqrt(a/b)", "III", "-a x", "Restoring force F(x) = -dU/dx = -ax + bx^3. For x << sqrt(a/b), bx^3 is negligible, leaving F approx -ax"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "A block of mass m is attached to the lower end of a vertical spring of stiffness k. Initially, the spring is at its natural length and the block is released from rest. Match List I with List II:",
        [
            ("Extension of the spring at the equilibrium position", "II", "mg / k", "At equilibrium, upward spring force balances gravity: k x_eq = mg => x_eq = mg / k"),
            ("Maximum extension of the spring below the release point", "IV", "2mg / k", "By energy conservation: mg x_max = (1/2) k x_max^2 => x_max = 2mg / k"),
            ("Maximum speed achieved by the falling block", "I", "g * sqrt(m / k)", "Maximum speed occurs at equilibrium x = mg/k: (1/2)m v_max^2 = mg(mg/k) - (1/2)k(mg/k)^2 = (1/2)m^2 g^2 / k => v_max = g sqrt(m/k)"),
            ("Work done by gravity during displacement from release to maximum extension", "III", "2m^2 g^2 / k", "Wg = mg * x_max = mg * (2mg/k) = 2m^2 g^2 / k"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "A body of mass m enters a resistive fluid medium at x = 0 with speed v0, experiencing a drag force F = -k v^2. Match the kinematic expressions in List I with List II:",
        [
            ("Speed as a function of distance travelled, v(x)", "I", "v0 * exp(-k x / m)", "m v dv/dx = -k v^2 => dv/v = -(k/m) dx. Integrating gives ln(v/v0) = -kx/m => v(x) = v0 exp(-kx/m)"),
            ("Speed as a function of time elapsed, v(t)", "III", "v0 / (1 + (k v0 / m) t)", "m dv/dt = -k v^2 => -dv/v^2 = (k/m) dt. Integrating gives 1/v - 1/v0 = (k/m)t => v(t) = v0 / (1 + k v0 t / m)"),
            ("Displacement as a function of time, x(t)", "IV", "(m/k) * ln(1 + (k v0 / m) t)", "x(t) = integral v(t) dt = integral [v0 / (1 + k v0 t / m)] dt = (m/k) ln(1 + k v0 t / m)"),
            ("Total work done by the resistive drag force as t -> infinity", "II", "-(1/2) m v0^2", "By the work-energy theorem, W_drag = K_final - K_initial = 0 - (1/2) m v0^2 = -(1/2) m v0^2"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "A particle of mass m is whirled in a vertical circle of radius R with bottom speed u = sqrt(4gR). Match the parameters at and after string slackening in List I with List II:",
        [
            ("Cosine of angle theta from upward vertical where string slacks (T = 0)", "III", "2/3", "Speed v^2 = u^2 - 2gR(1 + cos theta_up). Radial eq: T + mg cos theta_up = m v^2 / R. For T=0: 3 cos theta_up = (u^2 - 2gR)/(gR) = 2 => cos theta_up = 2/3"),
            ("Speed of the particle at the instant string slacks", "I", "sqrt((2/3) gR)", "v_s^2 = gR cos theta_up = (2/3) gR => v_s = sqrt((2/3) gR)"),
            ("Vertical height of the particle above the lowest launch point when string slacks", "IV", "(5/3) R", "Height from lowest point is R + R cos theta_up = R(1 + 2/3) = (5/3) R"),
            ("Maximum extra vertical height achieved as a projectile after slacking", "II", "(5/27) R", "Vertical projectile speed is v_s sin theta_up. Extra height h = (v_s sin theta_up)^2 / (2g) = ((2/3)gR * (1 - 4/9)) / (2g) = (5/27) R"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "A uniform flexible rope of mass M and length L lies on a frictionless horizontal table with 1/n-th of its length hanging over the edge. It is released from rest. Match List I with List II:",
        [
            ("Initial gravitational potential energy (table top as reference U = 0)", "IV", "-M g L / (2 n^2)", "Hanging mass is M/n with center of mass at depth L/(2n). U_i = -(M/n) g (L/(2n)) = -MgL / (2n^2)"),
            ("Gravitational potential energy when the entire rope just slips off the table", "I", "-M g L / 2", "When fully vertical, center of mass of the entire rope of mass M is at depth L/2. U_f = -MgL / 2"),
            ("Speed of the rope at the instant the last link slips off the table", "II", "sqrt(gL * (1 - 1/n^2))", "By energy conservation: (1/2) M v^2 = U_i - U_f = (MgL/2)(1 - 1/n^2) => v = sqrt(gL(1 - 1/n^2))"),
            ("Total work done by gravity during the slipping process", "III", "(M g L / 2) * (1 - 1/n^2)", "Work done by gravity is -(U_f - U_i) = (MgL/2) - (MgL / 2n^2) = (MgL/2)(1 - 1/n^2)"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "A vehicle of mass m accelerates from rest along a straight horizontal track. Its engine delivers power proportional to instantaneous speed: P(v) = c * v, where c is a constant. Match List I with List II:",
        [
            ("Tractive driving force exerted on the vehicle", "II", "Constant force c", "Power P = F * v => c * v = F * v => F = c (constant force independent of speed)"),
            ("Acceleration of the vehicle", "IV", "Constant acceleration c / m", "By Newton's second law, a = F / m = c / m, which is constant in time"),
            ("Speed of the vehicle after covering a distance s from rest", "I", "sqrt(2 c s / m)", "Using v^2 = 2 a s for constant acceleration gives v(s) = sqrt(2 (c/m) s) = sqrt(2 c s / m)"),
            ("Time required for the vehicle to attain a speed v1 from rest", "III", "m * v1 / c", "Using v1 = a t gives t = v1 / a = v1 / (c/m) = m v1 / c"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "A particle of mass m moves in a central potential U_eff(r) = (k/2) r^2 + L0^2 / (2 m r^2), where L0 is constant angular momentum and k > 0. Match List I with List II:",
        [
            ("Radius r0 of the stable circular orbit (minimum of effective potential)", "I", "(L0^2 / (m k))^(1/4)", "dU_eff/dr = kr - L0^2/(m r^3) = 0 => kr^4 = L0^2/m => r0 = (L0^2 / (mk))^(1/4)"),
            ("Minimum value of the effective potential energy U_eff(r0)", "III", "L0 * sqrt(k / m)", "Substitute r0^2 = L0/sqrt(mk): U_eff = (k/2)(L0/sqrt(mk)) + (L0^2/(2m))(sqrt(mk)/L0) = L0 sqrt(k/m)"),
            ("Second derivative d^2 U_eff / dr^2 evaluated at r = r0", "IV", "4k", "d^2U/dr^2 = k + 3 L0^2 / (m r0^4) = k + 3 L0^2 / (m (L0^2/mk)) = k + 3k = 4k"),
            ("Angular frequency omega_r of small radial oscillations about r0", "II", "2 * sqrt(k / m)", "omega_r = sqrt(U_eff''(r0) / m) = sqrt(4k / m) = 2 sqrt(k/m)"),
        ], "D"))

    # ==========================================
    # TOPIC: Rotational Motion (20 questions)
    # ==========================================
    t = "Rotational Motion"
    prefix = "phy_mat_rot"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the uniform rigid bodies of mass M and radius R in List I with their moments of inertia about the specified symmetry axis in List II:",
        [
            ("Thin circular ring about central axis perpendicular to its plane", "III", "M R^2", "All mass elements are at distance R from the central axis: I = integral r^2 dm = M R^2"),
            ("Uniform circular disc about central axis perpendicular to its plane", "I", "(1/2) M R^2", "Integrating concentric rings gives I = integral (r^2)(2 pi r sigma dr) = (1/2) M R^2"),
            ("Uniform solid sphere about any diametrical axis", "IV", "(2/5) M R^2", "Integrating concentric spherical shells or thin circular discs yields I = (2/5) M R^2"),
            ("Thin spherical shell about any diametrical axis", "II", "(2/3) M R^2", "Integrating over the spherical surface gives I = (2/3) M R^2"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the rigid bodies in List I with their moments of inertia obtained via parallel or perpendicular axis theorems in List II:",
        [
            ("Uniform circular disc (mass M, radius R) about a diameter in its plane", "IV", "(1/4) M R^2", "Perpendicular axis theorem: Ix + Iy = Iz = (1/2)MR^2. By symmetry Ix = Iy = (1/4) M R^2"),
            ("Uniform circular disc (mass M, radius R) about a tangent line in its plane", "I", "(5/4) M R^2", "Parallel axis theorem: I_tan = I_dia + M R^2 = (1/4)MR^2 + MR^2 = (5/4) M R^2"),
            ("Thin uniform rod (mass M, length L) about an axis through one end perpendicular to rod", "II", "(1/3) M L^2", "Parallel axis theorem: I_end = I_cm + M(L/2)^2 = (1/12)ML^2 + (1/4)ML^2 = (1/3) M L^2"),
            ("Thin uniform rod (mass M, length L) about an axis through center perpendicular to rod", "III", "(1/12) M L^2", "Direct integration: integral_{-L/2}^{L/2} x^2 (M/L) dx = (1/12) M L^2"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "A constant force F = (2i + 3j - 1k) N acts at various points r. Match each position vector r in List I with the resulting torque tau = r x F about the origin in List II:",
        [
            ("Position vector r1 = (1i + 0j + 0k) m", "II", "(1j + 3k) N m", "tau = i x (2i + 3j - k) = 3(i x j) - 1(i x k) = 3k + j = (1j + 3k) N m"),
            ("Position vector r2 = (0i + 1j + 0k) m", "IV", "(-1i - 2k) N m", "tau = j x (2i + 3j - k) = 2(j x i) - 1(j x k) = -2k - i = (-1i - 2k) N m"),
            ("Position vector r3 = (0i + 0j + 1k) m", "I", "(-3i + 2j) N m", "tau = k x (2i + 3j - k) = 2(k x i) + 3(k x j) = 2j - 3i = (-3i + 2j) N m"),
            ("Position vector r4 = (1i + 1j + 0k) m", "III", "(-1i + 1j + 1k) N m", "tau = (i + j) x (2i + 3j - k) = (j + 3k) + (-i - 2k) = (-1i + 1j + 1k) N m"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "A flywheel starts from rest and rotates with constant angular acceleration alpha = 4 rad/s^2. Match the kinematic rotational variables in List I with their values in List II:",
        [
            ("Angular velocity after t = 3 seconds", "I", "12 rad/s", "omega = omega0 + alpha * t = 0 + 4 * 3 = 12 rad/s"),
            ("Total angular displacement after t = 3 seconds", "III", "18 rad", "theta = omega0 * t + 0.5 * alpha * t^2 = 0 + 0.5 * 4 * 9 = 18 rad"),
            ("Average angular velocity over the first 3 seconds", "IV", "6 rad/s", "omega_avg = (omega0 + omega) / 2 = (0 + 12) / 2 = 6 rad/s"),
            ("Angular velocity after completing an angular displacement of 8 rad", "II", "8 rad/s", "omega^2 = omega0^2 + 2 * alpha * theta = 0 + 2 * 4 * 8 = 64 => omega = 8 rad/s"),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each symmetric body of mass M and radius R in List I with its radius of gyration k about its central axis in List II:",
        [
            ("Thin circular ring of radius R", "III", "R", "I = M R^2 = M k^2 => k = R"),
            ("Uniform solid circular disc of radius R", "I", "R / sqrt(2)", "I = (1/2) M R^2 = M k^2 => k = R / sqrt(2)"),
            ("Uniform solid sphere of radius R", "IV", "sqrt(2/5) * R", "I = (2/5) M R^2 = M k^2 => k = sqrt(2/5) * R"),
            ("Thin hollow spherical shell of radius R", "II", "sqrt(2/3) * R", "I = (2/3) M R^2 = M k^2 => k = sqrt(2/3) * R"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "A projectile of mass m is fired from the origin with initial speed u at angle theta to the horizontal. Match the quantities related to its angular momentum about the origin in List I with List II:",
        [
            ("Magnitude of angular momentum at the highest point of trajectory", "IV", "(m u^3 sin^2(theta) cos(theta)) / (2g)", "At peak: r = (R/2) i + H j, v = (u cos theta) i. L = m * (u cos theta) * H = m(u cos theta)(u^2 sin^2 theta / 2g)"),
            ("Magnitude of angular momentum just before landing on the ground", "I", "(2m u^3 sin^2(theta) cos(theta)) / g", "At landing: r = R i, v = (u cos theta) i - (u sin theta) j. L = m * R * (u sin theta) = 2m u^3 sin^2(theta) cos(theta) / g"),
            ("Torque due to gravity about the origin as a function of time t", "II", "m g u t cos(theta)", "tau = r x (m g) = (u cos theta * t) i x (-m g j) = -m g u t cos theta k. Magnitude is m g u t cos theta"),
            ("Torque due to gravity about the origin at the highest point", "III", "(1/2) m u^2 sin(2*theta)", "At highest point x = R/2 = u^2 sin(2 theta) / (2g). Torque tau = m g * (R/2) = (1/2) m u^2 sin(2 theta)"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Match the scenarios involving conservation of angular momentum in List I with the resulting physical state in List II:",
        [
            ("A figure skater spinning at omega1 with moment of inertia I1 pulls arms in reducing inertia to I1/2", "II", "Final angular velocity doubles to 2 * omega1", "I1 * omega1 = (I1/2) * omega_f => omega_f = 2 * omega1"),
            ("The rotational kinetic energy of the figure skater after pulling arms inward", "IV", "Kinetic energy doubles to 2 * K1", "K_f = (1/2)(I1/2)(2 omega1)^2 = I1 omega1^2 = 2 * ((1/2) I1 omega1^2) = 2 K1"),
            ("A rotating disc of inertia I1 and angular speed omega1 dropped onto a coaxial stationary disc of inertia I2", "I", "Common angular speed becomes I1*omega1 / (I1 + I2)", "Total angular momentum conservation: I1 omega1 = (I1 + I2) omega_common => omega_common = I1 omega1 / (I1 + I2)"),
            ("A man of mass m standing on the rim of a disc (mass M, radius R) spinning at omega0 walks to the center", "III", "Angular velocity increases by factor (M + 2m) / M", "Initial I = (1/2)MR^2 + mR^2 = (M/2 + m)R^2. Final I = (1/2)MR^2. Ratio omega_f / omega0 = (M + 2m) / M"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Blocks m1 = 3 kg and m2 = 1 kg hang from a light cord passing over a pulley of mass M = 2 kg and radius R (I = 1/2 M R^2). Cord does not slip. Match List I with List II:",
        [
            ("Linear acceleration a of the hanging blocks", "I", "0.4 g", "Effective inertia I_eff = m1 + m2 + M/2 = 3 + 1 + 1 = 5 kg. Net driving force = (m1 - m2)g = 2g. a = 2g / 5 = 0.4 g"),
            ("Tension T1 in the cord segment supporting mass m1 = 3 kg", "III", "1.8 g (in Newtons)", "For descending block: m1 g - T1 = m1 a => T1 = 3(g - 0.4g) = 1.8 g N"),
            ("Tension T2 in the cord segment supporting mass m2 = 1 kg", "IV", "1.4 g (in Newtons)", "For ascending block: T2 - m2 g = m2 a => T2 = 1(g + 0.4g) = 1.4 g N"),
            ("Net torque acting on the pulley about its axle", "II", "0.4 g R (in N m)", "Net torque = (T1 - T2) R = (1.8g - 1.4g) R = 0.4 g R N m"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Uniform bodies roll down an inclined plane of inclination angle theta without slipping. Match each body in List I with its linear acceleration a_cm in List II:",
        [
            ("Uniform solid sphere (k^2/R^2 = 2/5)", "III", "(5/7) g sin(theta)", "a = g sin theta / (1 + k^2/R^2) = g sin theta / (1 + 2/5) = (5/7) g sin theta"),
            ("Uniform solid cylinder / disc (k^2/R^2 = 1/2)", "I", "(2/3) g sin(theta)", "a = g sin theta / (1 + 1/2) = (2/3) g sin theta"),
            ("Thin spherical shell (k^2/R^2 = 2/3)", "IV", "(3/5) g sin(theta)", "a = g sin theta / (1 + 2/3) = (3/5) g sin theta"),
            ("Thin circular ring / hollow cylinder (k^2/R^2 = 1)", "II", "(1/2) g sin(theta)", "a = g sin theta / (1 + 1) = (1/2) g sin theta"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the rolling bodies of mass M and radius R in List I with the minimum coefficient of static friction mu_min required to prevent slipping on an incline of angle theta in List II:",
        [
            ("Thin circular ring (k^2/R^2 = 1)", "IV", "(1/2) tan(theta)", "mu_min = tan theta / (1 + R^2/k^2) = tan theta / (1 + 1) = (1/2) tan theta"),
            ("Uniform solid disc (k^2/R^2 = 1/2)", "I", "(1/3) tan(theta)", "mu_min = tan theta / (1 + 2) = (1/3) tan theta"),
            ("Thin spherical shell (k^2/R^2 = 2/3)", "II", "(2/5) tan(theta)", "mu_min = tan theta / (1 + 3/2) = tan theta / (5/2) = (2/5) tan theta"),
            ("Uniform solid sphere (k^2/R^2 = 2/5)", "III", "(2/7) tan(theta)", "mu_min = tan theta / (1 + 5/2) = tan theta / (7/2) = (2/7) tan theta"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "A uniform thin rod of mass M and length L is pivoted horizontally at one end and released from rest. Match List I with List II:",
        [
            ("Initial angular acceleration alpha at the moment of release", "II", "3g / (2L)", "Torque about pivot: Mg(L/2) = I alpha = (1/3 ML^2) alpha => alpha = 3g / (2L)"),
            ("Initial linear acceleration of the free tip of the rod", "IV", "1.5 g", "a_tip = L * alpha = L * (3g / (2L)) = 1.5 g"),
            ("Angular velocity omega when the rod swings through the vertical position", "I", "sqrt(3g / L)", "Energy conservation: Mg(L/2) = (1/2)(1/3 ML^2) omega^2 => omega = sqrt(3g / L)"),
            ("Vertical reaction force exerted by the hinge when rod passes through vertical", "III", "(5/2) Mg", "N - Mg = M a_cm = M omega^2 (L/2) = M(3g/L)(L/2) = 1.5 Mg => N = 2.5 Mg = (5/2) Mg"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "A uniform solid cube of mass M and side edge 'a' rests on a rough horizontal floor (coefficient of static friction mu). A horizontal force F is applied at the top edge. Match List I with List II:",
        [
            ("Critical horizontal force F_topple required to topple the cube", "I", "(1/2) Mg", "Torque balance about front tipping edge: F * a = Mg * (a/2) => F_topple = (1/2) Mg"),
            ("Maximum static friction available to prevent sliding", "III", "mu * Mg", "Normal reaction on flat floor is N = Mg; max static friction is f_s,max = mu * N = mu * Mg"),
            ("Condition on friction coefficient mu for the cube to topple before slipping", "IV", "mu > 0.5", "Topple before slip requires F_topple < f_s,max => 0.5 Mg < mu Mg => mu > 0.5"),
            ("Condition on friction coefficient mu for the cube to slip before toppling", "II", "mu < 0.5", "Slip before topple requires f_s,max < F_topple => mu Mg < 0.5 Mg => mu < 0.5"),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A uniform solid sphere of mass M and radius R is given initial forward velocity v0 on a rough horizontal floor with zero initial spin (omega0 = 0). Match List I with List II:",
        [
            ("Time t_p taken to achieve pure rolling without slipping", "III", "2*v0 / (7*mu*g)", "Friction f = mu Mg backwards. dv/dt = -mu g, R domega/dt = 5 mu g / 2. Pure rolling: v = R omega => v0 - mu g t = 2.5 mu g t => t = 2v0 / (7 mu g)"),
            ("Linear velocity v_p of the sphere when pure rolling is established", "I", "(5/7) v0", "v_p = v0 - mu g t_p = v0 - mu g (2v0 / (7 mu g)) = (5/7) v0"),
            ("Angular velocity omega_p when pure rolling is established", "IV", "5*v0 / (7*R)", "omega_p = v_p / R = (5/7) v0 / R = 5 v0 / (7 R)"),
            ("Fraction of initial kinetic energy dissipated as heat during transition", "II", "2/7 of initial kinetic energy", "Initial K = 1/2 M v0^2. Final K = 1/2 M v_p^2 (1 + 2/5) = 7/10 M (25/49 v0^2) = 5/14 M v0^2. Loss = 1/2 - 5/14 = 2/14 = 1/7 of M v0^2 = 2/7 of K_initial"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match each physical planar motion in List I with the location of its Instantaneous Axis of Rotation (IAOR) in List II:",
        [
            ("Uniform cylinder rolling without slipping on a fixed horizontal surface", "IV", "The instantaneous line of contact with the ground", "For pure rolling on stationary floor, contact points have zero instantaneous velocity, defining the IAOR"),
            ("Uniform ladder sliding down with ends in contact with perpendicular wall and floor", "I", "Intersection of perpendicular normals to the wall and floor at the ladder ends", "Velocity of top end is along wall and bottom end along floor; IAOR lies at intersection of line normals to velocities"),
            ("Uniform cylinder of radius R rolling without slipping on a cart moving with speed vc", "II", "Line of contact between cylinder and cart moving at velocity vc", "Points along the contact line move at velocity vc relative to ground and zero velocity relative to cart"),
            ("A free body with center of mass velocity v_cm and angular velocity omega in plane motion", "III", "Point displaced from CM by vector r = (omega x v_cm) / omega^2", "v_P = v_cm + omega x r = 0 implies r = (omega x v_cm) / omega^2 perpendicular to v_cm"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "A uniform thin rod of mass M and length L is pivoted at one end on a frictionless vertical axis. A bullet of mass m (m << M) with speed v0 hits the rod perpendicularly at distance x from the pivot and embeds. Match List I with List II:",
        [
            ("Moment of inertia of the combined system about the pivot axle", "II", "(1/3) M L^2 + m x^2", "I_total = I_rod + I_bullet = (1/3) M L^2 + m x^2"),
            ("Angular velocity omega immediately after collision", "IV", "m v0 x / ((1/3) M L^2 + m x^2)", "Conservation of angular momentum about pivot: m v0 x = I_total omega => omega = m v0 x / ((1/3) M L^2 + m x^2)"),
            ("Impact distance x from pivot (center of percussion) yielding zero hinge reaction impulse", "I", "(2/3) L", "Hinge impulse J = M v_cm - m v0 = M (omega L/2) - m v0 = 0. Substituting omega gives x = 2L/3"),
            ("Hinge reaction impulse when bullet strikes at the extreme tip x = L (with m << M)", "III", "(1/2) m v0 in the forward direction", "With x = L: omega = 3 m v0 / (M L). Hinge impulse J = M(omega L/2) - m v0 = 1.5 m v0 - m v0 = 0.5 m v0 forward"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "A solid cylinder of mass M and radius R rests on a horizontal plank which accelerates horizontally at constant a0. The cylinder rolls without slipping on the plank. Match List I with List II:",
        [
            ("Acceleration of the center of mass of the cylinder relative to ground", "I", "a0 / 3", "M a_cm = f_s and f_s R = (1/2) M R^2 alpha. Kinematic condition: a_rel = a_cm - a0 = -R alpha = -2 a_cm => 3 a_cm = a0 => a_cm = a0 / 3"),
            ("Acceleration of the center of mass of the cylinder relative to the plank", "III", "-2*a0 / 3", "a_rel = a_cm - a0 = a0/3 - a0 = -2 a0 / 3 (cylinder lags behind plank)"),
            ("Magnitude of the static friction force acting between cylinder and plank", "IV", "(1/3) M a0", "f_s = M a_cm = M (a0 / 3) = (1/3) M a0"),
            ("Minimum coefficient of static friction mu_min required to prevent slipping", "II", "a0 / (3g)", "Condition f_s <= mu * M g requires (1/3) M a0 <= mu M g => mu_min = a0 / (3g)"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "A uniform solid billiard sphere of mass M and radius R is struck horizontally by a cue delivering horizontal impulse J at height h above the center. Match List I with List II:",
        [
            ("Height h above center for the sphere to roll without slipping immediately", "III", "(2/5) R", "v = J/M, omega = J h / I = 5 J h / (2 M R^2). Pure rolling v = R omega gives J/M = 5 J h / (2 M R) => h = 2R/5"),
            ("Direction of initial friction force if struck at height h > (2/5) R", "I", "Forward along direction of cue impulse", "For h > 2R/5, R omega > v, bottom point slips backward relative to table, so friction acts forward"),
            ("Direction of initial friction force if struck at height h < (2/5) R", "IV", "Backward opposing direction of cue impulse", "For h < 2R/5, v > R omega, bottom point slips forward relative to table, so friction acts backward"),
            ("Initial center-of-mass linear velocity immediately after cue impact", "II", "J / M regardless of impact height h", "Linear impulse equation integral F dt = M delta v gives v_cm = J / M independent of the line of action"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "A uniform solid cylinder of radius r rolls without slipping inside a fixed cylindrical cavity of radius R (R > r). Match List I with List II for small oscillations about equilibrium:",
        [
            ("Effective radius of the path traced by the center of mass of the cylinder", "IV", "R - r", "The center of mass moves in a circular arc of radius (R - r) about the cavity center"),
            ("Ratio of rotational kinetic energy to translational kinetic energy during pure rolling", "I", "1/2", "K_rot / K_trans = (1/2 I omega^2) / (1/2 M v^2) = (k^2 / r^2) = 1/2 for a solid cylinder"),
            ("Angular frequency omega_osc of small oscillations about the bottom", "II", "sqrt(2g / (3*(R - r)))", "Total energy E = (3/4) M (R - r)^2 theta_dot^2 + (1/2) M g (R - r) theta^2. omega_osc = sqrt(M g (R - r) / (1.5 M (R - r)^2)) = sqrt(2g / (3(R - r)))"),
            ("Time period T of small oscillations about the bottom", "III", "2*pi * sqrt(3*(R - r) / (2g))", "Time period T = 2 pi / omega_osc = 2 pi sqrt(3(R - r) / (2g))"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "A symmetric top of mass M with spin moment of inertia I_s spins rapidly with spin angular velocity omega_s about its symmetry axis, pivoted at distance d from its center of mass. Match List I with List II:",
        [
            ("Magnitude of the gravitational torque acting about the pivot", "II", "M g d", "Gravity acts at distance d from pivot with torque tau = M g d sin(theta); for horizontal axis theta = 90 deg, tau = M g d"),
            ("Magnitude of the spin angular momentum L_s about the symmetry axis", "IV", "I_s * omega_s", "The intrinsic spin angular momentum of the top is given by L_s = I_s * omega_s"),
            ("Precession angular velocity Omega_p of the top axis about the vertical", "I", "M g d / (I_s * omega_s)", "Precession frequency Omega_p = tau / L_s = M g d / (I_s omega_s) in the steady precession limit"),
            ("Direction of the precession angular velocity vector Omega_p", "III", "Vertically upward along the precession axis", "Omega_p = tau x L / |L|^2 points along the vertical axis of precession perpendicular to torque and spin"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "A uniform thin rod of mass M and length L stands vertically on a frictionless horizontal floor. Given a slight disturbance, it falls under gravity. Match List I with List II:",
        [
            ("Trajectory traced by the center of mass of the rod during the fall", "I", "Strictly vertical straight line", "No horizontal external force acts on the system (frictionless floor), so horizontal acceleration of CM is zero"),
            ("Moment of inertia of the rod about its center of mass", "III", "(1/12) M L^2", "Standard moment of inertia of a uniform rod about an axis passing through its midpoint perpendicular to length"),
            ("Angular velocity omega when the rod makes angle theta with the vertical", "IV", "sqrt(12g*(1 - cos theta) / (L*(1 + 3*sin^2 theta)))", "Conservation of energy: Mg(L/2)(1 - cos theta) = (1/2) M v_cm^2 + (1/2) I_cm omega^2. With v_cm = (L/2) sin theta omega"),
            ("Speed of the center of mass at the instant the rod becomes horizontal", "II", "(1/2) * sqrt(3gL)", "At theta = 90 deg: omega = sqrt(12g / 4L) = sqrt(3g/L). Then v_cm = (L/2) omega = (1/2) sqrt(3gL)"),
        ], "D"))

    # ==========================================
    # TOPIC: System of Particles (20 questions)
    # ==========================================
    t = "System of Particles"
    prefix = "phy_mat_sop"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the uniform planar or thin symmetric bodies of radius R in List I with the height of their center of mass y_cm above the base diameter in List II:",
        [
            ("Semicircular thin wire / ring of radius R", "III", "2*R / pi", "Integrating along circular arc: y_cm = (1/pi) integral_0^pi R sin(theta) dtheta = 2R / pi"),
            ("Semicircular uniform lamina / disc of radius R", "I", "4*R / (3*pi)", "Integrating concentric semicircular strips: y_cm = (2/(pi R^2)) integral (pi r) (2r/pi) dr = 4R / (3 pi)"),
            ("Thin hemispherical shell of radius R", "IV", "R / 2", "Integrating circular rings over hemisphere surface: y_cm = (1 / 2 pi R^2) integral (2 pi R sin theta) R dtheta (R cos theta) = R / 2"),
            ("Uniform solid hemisphere of radius R", "II", "3*R / 8", "Integrating thin circular discs: y_cm = (1 / (2/3 pi R^3)) integral_0^R pi (R^2 - y^2) y dy = 3R / 8"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Four particles of masses 1 kg, 2 kg, 3 kg, and 4 kg are placed at vertices (0,0), (1,0), (1,1), and (0,1) of a unit square (in meters). Match List I with List II:",
        [
            ("x-coordinate of the center of mass, x_cm", "IV", "0.5 m", "Total mass M = 10 kg. x_cm = [1(0) + 2(1) + 3(1) + 4(0)] / 10 = 5 / 10 = 0.5 m"),
            ("y-coordinate of the center of mass, y_cm", "I", "0.7 m", "y_cm = [1(0) + 2(0) + 3(1) + 4(1)] / 10 = 7 / 10 = 0.7 m"),
            ("Distance of the center of mass from the origin (0, 0)", "II", "sqrt(0.74) m", "r_cm = sqrt(x_cm^2 + y_cm^2) = sqrt(0.5^2 + 0.7^2) = sqrt(0.25 + 0.49) = sqrt(0.74) m"),
            ("Ratio of coordinates y_cm / x_cm", "III", "1.4", "y_cm / x_cm = 0.7 / 0.5 = 1.4"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each type of collision in List I with its physical defining characteristic in List II:",
        [
            ("Perfectly elastic collision (coefficient of restitution e = 1)", "II", "Total momentum and total kinetic energy are both conserved", "Relative speed of separation equals relative speed of approach; no kinetic energy is converted to heat or deformation"),
            ("Inelastic collision (coefficient of restitution 0 < e < 1)", "IV", "Total momentum is conserved, kinetic energy is partially lost", "Relative speed of separation is less than speed of approach; mechanical energy is partly dissipated"),
            ("Perfectly inelastic collision (coefficient of restitution e = 0)", "I", "Bodies coalesce and move together with maximum kinetic energy loss", "Bodies stick together at common velocity; maximum possible kinetic energy consistent with momentum conservation is lost"),
            ("Superelastic collision (coefficient of restitution e > 1)", "III", "Total kinetic energy increases due to release of internal potential energy", "Stored chemical or nuclear energy is released during the impact, boosting kinetic energy"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the force-time interactions on a 2 kg particle initially at rest in List I with the resulting impulse J = delta p in List II:",
        [
            ("A constant force of 10 N acting for 3 seconds", "I", "30 N s", "Impulse J = F * delta_t = 10 * 3 = 30 N s"),
            ("A triangular force pulse with peak 20 N and total base duration 2 seconds", "III", "20 N s", "Impulse is area under F-t curve: J = 0.5 * base * height = 0.5 * 2 * 20 = 20 N s"),
            ("A linear time-varying force F(t) = 6t N acting from t = 0 to t = 2 seconds", "IV", "12 N s", "Impulse J = integral_0^2 6t dt = [3t^2]_0^2 = 3(4) = 12 N s"),
            ("A constant force of 5 N acting for 8 seconds", "II", "40 N s", "Impulse J = F * delta_t = 5 * 8 = 40 N s"),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match the uniform geometric solids in List I with the height of their center of mass above their flat circular base in List II:",
        [
            ("Uniform solid right circular cone of height h", "III", "h / 4", "Integration of circular slices of radius r(y) = R(1 - y/h) gives y_cm = h / 4"),
            ("Uniform hollow right circular cone (thin conical shell) of height h", "I", "h / 3", "Integration of circular rings of slant height gives y_cm = h / 3"),
            ("Uniform solid hemisphere of radius R", "IV", "3*R / 8", "y_cm = (3/8) R from the flat circular equatorial base"),
            ("Uniform hollow hemispherical shell of radius R", "II", "R / 2", "y_cm = (1/2) R from the flat equatorial rim"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "A man of mass m = 60 kg stands at one end of a stationary boat of mass M = 140 kg and length L = 5 m in still water. He walks to the opposite end. Match List I with List II:",
        [
            ("Magnitude of displacement of the boat relative to the water", "IV", "1.5 m opposite to the man's walking direction", "Delta x_boat = m * L / (M + m) = 60 * 5 / 200 = 1.5 m opposite to walk"),
            ("Magnitude of displacement of the man relative to the water", "I", "3.5 m along the walking direction", "Delta x_man = L - Delta x_boat = 5 - 1.5 = 3.5 m in the direction of walk"),
            ("Displacement of the center of mass of the (man + boat) system", "II", "0 m", "No external horizontal force acts on the system, so the center of mass remains completely stationary"),
            ("Ratio of boat displacement to man displacement relative to water", "III", "3 / 7", "Ratio = Delta x_boat / Delta x_man = 1.5 / 3.5 = 3 / 7"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "A particle of mass m1 moving with speed u1 collides head-on elastically with stationary mass m2 (u2 = 0). Match the mass ratios in List I with the outcome in List II:",
        [
            ("Equal masses m1 = m2", "II", "v1 = 0 and v2 = u1 (complete velocity exchange)", "v1 = (m1 - m2)u1 / (m1 + m2) = 0; v2 = 2m1 u1 / (m1 + m2) = u1"),
            ("Incident mass much heavier: m1 >> m2", "IV", "v1 approx u1 and v2 approx 2*u1", "v1 = (m1 - m2)/(m1 + m2) u1 approx u1; v2 = 2m1 / (m1 + m2) u1 approx 2 u1"),
            ("Target mass much heavier: m1 << m2", "I", "v1 approx -u1 (rebounds) and v2 approx 0", "v1 = (m1 - m2)/(m1 + m2) u1 approx -u1; v2 = 2m1 / (m1 + m2) u1 approx 0"),
            ("Target mass three times incident mass: m2 = 3*m1", "III", "Fraction of kinetic energy transferred is 75%", "Fraction transferred = 4 m1 m2 / (m1 + m2)^2 = 4(1)(3) / 16 = 12/16 = 75%"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "A body of mass m moving with speed u collides head-on with an identical stationary body of mass m with coefficient of restitution e. Match List I with List II:",
        [
            ("Velocity of the incident body after collision, v1", "I", "(1 - e) * u / 2", "v1 = [(1 - e)u1 + (1 + e)u2] / 2 = (1 - e) u / 2"),
            ("Velocity of the target body after collision, v2", "III", "(1 + e) * u / 2", "v2 = [(1 + e)u1 + (1 - e)u2] / 2 = (1 + e) u / 2"),
            ("Fraction of initial kinetic energy dissipated during collision", "IV", "(1 - e^2) / 2", "Delta K / K_i = [1/2 (m/2) u^2 (1 - e^2)] / [1/2 m u^2] = (1 - e^2) / 2"),
            ("Velocity of the center of mass throughout the collision", "II", "u / 2", "v_cm = (m u + m*0) / (2m) = u / 2, constant as internal collision forces cancel"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "A projectile of mass M fired with speed u at angle theta explodes at its apex into two equal fragments of mass M/2. Fragment 1 falls vertically to rest. Match List I with List II:",
        [
            ("Horizontal velocity of fragment 2 immediately after explosion", "III", "2 * u * cos(theta)", "Momentum conservation: M (u cos theta) = (M/2)(0) + (M/2) v2 => v2 = 2 u cos theta"),
            ("Distance from launch point where fragment 2 lands (normal range = R)", "I", "1.5 * R", "Apex is at R/2. Time to ground is T/2. Fragment 2 travels (2 u cos theta)(T/2) = R. Landing distance = R/2 + R = 1.5 R"),
            ("Distance from launch point of the center of mass when fragments land", "IV", "R", "Center of mass continues along unaltered parabolic trajectory under gravity alone, landing at normal range R"),
            ("Horizontal velocity of fragment 1 relative to fragment 2 after explosion", "II", "-2 * u * cos(theta)", "v_rel = v1 - v2 = 0 - 2 u cos theta = -2 u cos theta"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "A rocket of initial mass m0 ejects propellant at exhaust speed v_r at constant consumption rate r = -dm/dt in gravity-free space. Match List I with List II:",
        [
            ("Thrust force F_thrust exerted on the rocket", "IV", "r * v_r", "F_thrust = v_r |dm/dt| = r * v_r"),
            ("Instantaneous rocket speed v(m) after mass decreases to m (starting from rest)", "I", "v_r * ln(m0 / m)", "Tsiolkovsky rocket equation: v(m) = v0 + v_r ln(m0 / m) = v_r ln(m0 / m)"),
            ("Instantaneous acceleration of the rocket when mass is m", "II", "r * v_r / m", "a = F_thrust / m = r v_r / m"),
            ("Mass ratio m0 / m required to accelerate rocket to final speed v_r", "III", "e (Euler's number approx 2.718)", "v = v_r ln(m0 / m) = v_r => ln(m0 / m) = 1 => m0 / m = e approx 2.718"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "A ball is dropped from height H above a fixed horizontal floor with coefficient of restitution e. Match List I with List II:",
        [
            ("Rebound height achieved after the 1st bounce", "II", "e^2 * H", "Speed after 1st bounce is v1 = e sqrt(2gH). Height h1 = v1^2 / (2g) = e^2 H"),
            ("Rebound height achieved after the n-th bounce", "IV", "e^(2n) * H", "By induction, speed after n-th bounce is v_n = e^n sqrt(2gH), giving h_n = e^(2n) H"),
            ("Total vertical distance traveled by the ball before coming to rest", "I", "H * (1 + e^2) / (1 - e^2)", "D = H + 2 sum_{k=1}^infty h_k = H + 2H [e^2 / (1 - e^2)] = H (1 + e^2) / (1 - e^2)"),
            ("Total time elapsed until the ball completely ceases bouncing", "III", "sqrt(2H / g) * (1 + e) / (1 - e)", "T = t0 + 2 sum_{k=1}^infty t_k = t0 [1 + 2e / (1 - e)] = sqrt(2H/g) (1 + e) / (1 - e)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Two blocks of masses m1 and m2 are connected by a spring of stiffness k on a frictionless horizontal floor. Match List I with List II:",
        [
            ("Reduced mass mu of the two-block system", "I", "m1 * m2 / (m1 + m2)", "In relative motion coordinates, the effective single inertial mass is mu = m1 m2 / (m1 + m2)"),
            ("Time period of relative harmonic oscillation of the two blocks", "III", "2*pi * sqrt(m1 * m2 / (k * (m1 + m2)))", "T = 2 pi sqrt(mu / k) = 2 pi sqrt(m1 m2 / (k(m1 + m2)))"),
            ("Position of the node (stationary point of the spring during oscillation)", "IV", "At the center of mass, dividing length in ratio L1 / L2 = m2 / m1", "The center of mass is stationary, serving as a virtual fixed boundary dividing the spring into segments"),
            ("Effective spring stiffness k1 governing the motion of mass m1 alone about CM", "II", "k * (m1 + m2) / m2", "Spring constant is inversely proportional to segment length: k1 = k * (L / L1) = k (m1 + m2) / m2"),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "Two identical smooth spheres of mass m undergo an oblique elastic collision in a plane. Sphere 1 has initial velocity u and sphere 2 is initially at rest. Match List I with List II:",
        [
            ("Angle between final velocity vectors v1 and v2 after collision", "III", "Exactly 90 degrees (pi / 2 rad)", "Energy conservation: v1^2 + v2^2 = u^2. Momentum: v1 + v2 = u => |v1 + v2|^2 = v1^2 + v2^2 + 2(v1 . v2) = u^2. Hence v1 . v2 = 0"),
            ("Component of velocity of sphere 1 along the line of impact after collision", "I", "Zero (completely transferred to sphere 2)", "Head-on component between identical masses exchanges completely: v1_normal = 0 and v2_normal = u_normal"),
            ("Component of velocity of sphere 1 perpendicular to line of impact after collision", "IV", "Unchanged from its pre-collision tangential value", "Frictionless spherical contact exerts impulse strictly along normal, leaving tangential velocity unaltered"),
            ("Direction of final velocity vector v2 of the initially stationary sphere", "II", "Directed strictly along the line of centers at impact", "Sphere 2 receives impulse exclusively along the normal line of centers connecting the sphere centers"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "A block of mass m slides down the smooth inclined face of a wedge of mass M (angle theta) free to slide on a frictionless horizontal floor. Match List I with List II:",
        [
            ("Horizontal displacement of wedge when block moves horizontal distance d relative to wedge", "IV", "m * d / (M + m) in opposite direction", "No external horizontal force acts on (M + m): M Delta X_W + m(Delta X_W - d) = 0 => Delta X_W = m d / (M + m)"),
            ("Horizontal acceleration of the wedge during sliding", "I", "(m g sin theta cos theta) / (M + m sin^2 theta)", "Newton's laws in horizontal direction: M a_W = N sin theta, where N = M m g cos theta / (M + m sin^2 theta)"),
            ("Acceleration of the block relative to the inclined face of the wedge", "II", "((M + m) g sin theta) / (M + m sin^2 theta)", "Solving coupled equations of motion in wedge reference frame yields a_rel = (M + m) g sin theta / (M + m sin^2 theta)"),
            ("Normal reaction force N between block and wedge", "III", "(M m g cos theta) / (M + m sin^2 theta)", "Perpendicular force balance on block: N = m(g cos theta - a_W sin theta) = M m g cos theta / (M + m sin^2 theta)"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "A uniform flexible chain of linear mass density lambda and length L is released from rest vertically above a scale pan. When length x has landed, match List I with List II:",
        [
            ("Static weight of the portion of the chain already resting on the pan", "II", "lambda * x * g", "Mass of resting chain is lambda * x; gravitational force is lambda * x * g"),
            ("Dynamic force on the pan due to rate of destruction of momentum of incoming links", "IV", "2 * lambda * x * g", "Speed of incoming link is v = sqrt(2gx). F_dynamic = v (dm/dt) = v (lambda v) = lambda v^2 = 2 lambda x g"),
            ("Total instantaneous force reading on the scale pan at length x", "I", "3 * lambda * x * g", "F_total = F_static + F_dynamic = lambda x g + 2 lambda x g = 3 lambda x g"),
            ("Peak force registered by the scale just as the last link strikes the pan", "III", "3 * M * g", "At x = L, total mass M = lambda L. Peak force is 3 lambda L g = 3 M g (three times total weight)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Sand drops vertically at a constant rate mu = dm/dt onto a horizontal conveyor belt driven at constant speed v. Match List I with List II:",
        [
            ("Horizontal driving force required to maintain constant belt speed", "I", "mu * v", "Sand must be accelerated from vx = 0 to vx = v. F = d(m v)/dt = v (dm/dt) = mu * v"),
            ("Power delivered by the electric motor driving the conveyor belt", "III", "mu * v^2", "P = F * v = (mu * v) * v = mu * v^2"),
            ("Rate of increase of kinetic energy of the sand deposited on the belt", "IV", "(1/2) * mu * v^2", "dK/dt = (1/2) (dm/dt) v^2 = (1/2) mu v^2"),
            ("Fraction of electrical work done by the motor that is converted into kinetic energy", "II", "1/2 (50 percent)", "Efficiency = (dK/dt) / P = (0.5 mu v^2) / (mu v^2) = 1/2; remaining 50% is dissipated as heat"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Three identical spheres A, B, C of mass m lie on a line. B and C are at rest. Sphere A is projected at speed u toward B with restitution e for all collisions. Match List I with List II:",
        [
            ("Speed of sphere B immediately after the first collision with sphere A", "III", "((1 + e) / 2) * u", "1D collision: v_B = [(1 + e) m u] / (2m) = (1 + e) u / 2"),
            ("Speed of sphere A immediately after the first collision with sphere B", "I", "((1 - e) / 2) * u", "1D collision: v_A = [(m - e m) u] / (2m) = (1 - e) u / 2"),
            ("Speed of sphere C after being subsequently struck by sphere B", "IV", "((1 + e)^2 / 4) * u", "Sphere B approaches C with speed v_B. v_C = (1 + e)/2 * v_B = (1 + e)/2 * [(1 + e)/2 u] = ((1 + e)^2 / 4) u"),
            ("Speed of sphere B after its collision with sphere C", "II", "((1 - e^2) / 4) * u", "v_B' = (1 - e)/2 * v_B = (1 - e)/2 * [(1 + e)/2 u] = ((1 - e^2) / 4) u"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "A ball is dropped from height H onto a smooth fixed plane inclined at angle theta to the horizontal. Restitution coefficient is e. Match List I with List II:",
        [
            ("Normal component of rebound velocity immediately after the first impact", "IV", "e * sqrt(2gH) * cos(theta)", "Impact speed is v0 = sqrt(2gH). Normal component is v0 cos theta; rebound is e v0 cos theta = e sqrt(2gH) cos theta"),
            ("Tangential component of rebound velocity along the incline", "I", "sqrt(2gH) * sin(theta)", "Since plane is frictionless, no tangential impulse acts; tangential speed remains v0 sin theta = sqrt(2gH) sin theta"),
            ("Time of flight T1 between the first bounce and the second bounce", "II", "2e * sqrt(2H / g)", "T1 = 2 v_normal / (g cos theta) = 2 (e sqrt(2gH) cos theta) / (g cos theta) = 2e sqrt(2H / g)"),
            ("Distance L1 traveled along the incline between the 1st and 2nd bounces", "III", "4e * (1 + e) * H * sin(theta)", "L1 = v_tang * T1 + (1/2) g sin theta T1^2 = (sqrt(2gH) sin theta)(2e sqrt(2H/g)) + 0.5 g sin theta (8 e^2 H / g) = 4e(1 + e) H sin theta"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "In a 2-body collision of masses m1, m2 with initial velocities u1, u2 and relative velocity u_rel = u1 - u2, match List I with List II in the center of mass frame:",
        [
            ("Velocity of the center of mass frame relative to the laboratory frame", "II", "(m1 * u1 + m2 * u2) / (m1 + m2)", "Standard center of mass definition: v_cm = (m1 u1 + m2 u2) / (m1 + m2)"),
            ("Total linear momentum of the two-particle system in the CM frame", "IV", "Strictly zero vector", "In the CM frame, p1_cm + p2_cm = m1(u1 - v_cm) + m2(u2 - v_cm) = 0 by definition"),
            ("Initial kinetic energy of the system in the CM frame", "I", "(1/2) * mu * u_rel^2", "K_cm = 1/2 m1 u1_cm^2 + 1/2 m2 u2_cm^2 = (1/2) mu u_rel^2 where mu = m1 m2 / (m1 + m2)"),
            ("Kinetic energy lost during inelastic collision with restitution e", "III", "(1/2) * mu * u_rel^2 * (1 - e^2)", "Only internal CM kinetic energy can be dissipated: Delta K = K_cm_i - K_cm_f = (1/2) mu u_rel^2 (1 - e^2)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "A railroad freight car of initial mass M0 rolls frictionlessly on horizontal tracks at speed v0. Rain begins falling vertically into it at rate dm/dt = sigma. Match List I with List II:",
        [
            ("Total horizontal momentum of the freight car system as rain accumulates", "I", "Conserved constant equal to M0 * v0", "Rain falls strictly vertically with zero horizontal momentum, so no net external horizontal force acts on the car"),
            ("Horizontal velocity of the car v(t) as a function of elapsed time t", "III", "M0 * v0 / (M0 + sigma * t)", "Momentum conservation: (M0 + sigma t) v(t) = M0 v0 => v(t) = M0 v0 / (M0 + sigma t)"),
            ("Retarding force exerted on the car due to collecting stationary rain", "IV", "-sigma * M0 * v0 / (M0 + sigma * t)", "F = m dv/dt = (M0 + sigma t) * [-M0 v0 sigma / (M0 + sigma t)^2] = -sigma v(t) = -sigma M0 v0 / (M0 + sigma t)"),
            ("Behavior of velocity if water subsequently leaks vertically out of a bottom drain", "II", "Speed remains constant (dv/dt = 0)", "Leaking water leaves with the horizontal velocity of the car, carrying away momentum at rate v(dm/dt), so car speed is unaffected"),
        ], "D"))

    # ==========================================
    # TOPIC: Gravitation (20 questions)
    # ==========================================
    t = "Gravitation"
    prefix = "phy_mat_grav"

    # 4 Beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the gravitational physical quantities in List I with their SI units and dimensional formulas in List II:",
        [
            ("Universal gravitational constant G", "III", "N m^2 / kg^2 and [M^(-1) L^3 T^(-2)]", "F = G m1 m2 / r^2 => G = F r^2 / (m1 m2) => dimensions [M^(-1) L^3 T^(-2)]"),
            ("Acceleration due to gravity g", "I", "m / s^2 and [M^0 L^1 T^(-2)]", "Acceleration has standard units m/s^2 and dimensions [M^0 L^1 T^(-2)]"),
            ("Gravitational potential V", "IV", "J / kg and [M^0 L^2 T^(-2)]", "Potential is potential energy per unit mass: J/kg = m^2 s^(-2), dimensions [M^0 L^2 T^(-2)]"),
            ("Gravitational potential energy U", "II", "Joule (J) and [M^1 L^2 T^(-2)]", "Gravitational potential energy has units of Joules and dimensions [M^1 L^2 T^(-2)]"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the location relative to Earth (mass M, radius R, surface gravity g0) in List I with the local acceleration due to gravity in List II:",
        [
            ("At height h << R above the surface", "IV", "g0 * (1 - 2h / R)", "Taylor expansion of g0 / (1 + h/R)^2 for h << R gives g0 (1 - 2h/R)"),
            ("At depth d below the surface", "I", "g0 * (1 - d / R)", "Inside a solid sphere, g(d) = GM(R - d)/R^3 = g0 (1 - d/R)"),
            ("At the center of the Earth (d = R)", "II", "Zero", "At r = 0, mass enclosed is zero and by spherical symmetry net gravitational field is zero"),
            ("At altitude h = R above the surface", "III", "g0 / 4", "g(R) = GM / (R + R)^2 = GM / (4 R^2) = g0 / 4"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match each of Kepler's empirical laws in List I with its fundamental physical statement in List II:",
        [
            ("Kepler's First Law (Law of Orbits)", "II", "Planets move in elliptical orbits with the Sun at one focal point", "Planetary orbits are non-circular conics (ellipses) with the central star at one of the two foci"),
            ("Kepler's Second Law (Law of Areas)", "IV", "A line joining planet and Sun sweeps equal areas in equal intervals of time", "Areal velocity dA/dt = L / (2m) is constant due to zero torque from central gravitational force"),
            ("Kepler's Third Law (Law of Periods)", "I", "Square of orbital period is proportional to cube of semi-major axis (T^2 proportional to a^3)", "T^2 = (4 pi^2 / (GM)) * a^3 for any closed Keplerian orbit around central mass M"),
            ("Newton's Synthesis of Kepler's Laws", "III", "Inverse square law of universal gravitation explains all three planetary laws", "Newton showed that F proportional to 1/r^2 mathematically yields conic sections, areal conservation, and T^2 proportional to a^3"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the parameters associated with satellite and projectile motion near Earth (radius R, surface gravity g) in List I with List II:",
        [
            ("Escape speed from Earth's surface", "I", "sqrt(2gR) approx 11.2 km/s", "Setting total energy (1/2)m v_e^2 - GMm/R = 0 gives v_e = sqrt(2GM/R) = sqrt(2gR) approx 11.2 km/s"),
            ("Orbital speed of a satellite in low-Earth circular orbit (h << R)", "III", "sqrt(gR) approx 7.9 km/s", "Centripetal acceleration m v_o^2 / R = mg gives v_o = sqrt(gR) approx 7.9 km/s"),
            ("Ratio of escape speed to low-Earth orbital speed (v_e / v_o)", "IV", "sqrt(2) approx 1.414", "v_e / v_o = sqrt(2gR) / sqrt(gR) = sqrt(2) approx 1.414"),
            ("Dependence of escape speed on the mass of the launched projectile", "II", "Completely independent of projectile mass", "Gravitational mass cancels inertial mass in the energy equation, making v_e independent of m"),
        ], "D"))

    # 8 Intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Consider a thin uniform spherical shell of mass M and radius R. Match the field and potential quantities in List I with List II:",
        [
            ("Gravitational field E(r) at an interior point (r < R)", "III", "Zero", "By Gauss's law for gravity, enclosed mass inside spherical shell is zero, so E(r) = 0 everywhere inside"),
            ("Gravitational potential V(r) at an interior point (r < R)", "I", "-GM / R (constant throughout interior)", "Since E = -dV/dr = 0 inside, V(r) is constant and equal to its surface value -GM/R"),
            ("Gravitational field magnitude E(r) at an exterior point (r > R)", "IV", "GM / r^2", "Outside the shell, the entire mass M acts as if concentrated at the center: E = GM / r^2"),
            ("Gravitational potential V(r) at an exterior point (r > R)", "II", "-GM / r", "Integrating exterior field from infinity gives standard point-mass potential V(r) = -GM / r"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "For a uniform solid sphere of mass M and radius R, match the gravitational quantities in List I with List II:",
        [
            ("Gravitational potential at the center of the sphere (r = 0)", "IV", "-1.5 * GM / R", "V(r) = -GM/(2R^3) * (3R^2 - r^2). At r = 0, V(0) = -3GM / (2R) = -1.5 GM / R"),
            ("Gravitational potential at the surface of the sphere (r = R)", "I", "-GM / R", "At r = R, V(R) = -GM / R"),
            ("Gravitational field magnitude inside the sphere at distance r < R", "II", "GM * r / R^3", "Mass enclosed is M(r/R)^3, giving E(r) = G M(r/R)^3 / r^2 = GM r / R^3"),
            ("Ratio of potential at the center to potential at the surface |V_center / V_surface|", "III", "1.5 (or 3/2)", "Ratio is (-1.5 GM/R) / (-GM/R) = 1.5 = 3/2"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Consider a uniform circular ring of mass M and radius R. Match the axial quantities at distance x from the ring center in List I with List II:",
        [
            ("Gravitational potential V(x) on the ring axis", "II", "-GM / sqrt(R^2 + x^2)", "All points on the ring are at equal distance sqrt(R^2 + x^2) from the axial point"),
            ("Magnitude of the gravitational field E(x) on the ring axis", "IV", "GM * x / (R^2 + x^2)^(3/2)", "E(x) = -dV/dx = GM x / (R^2 + x^2)^(3/2) directed toward ring center"),
            ("Axial distance x where the gravitational field E(x) reaches its maximum", "I", "R / sqrt(2)", "dE/dx = 0 requires (R^2 + x^2) - 3x^2 = 0 => x^2 = R^2 / 2 => x = R / sqrt(2)"),
            ("Maximum gravitational field magnitude E_max on the ring axis", "III", "2 * GM / (3*sqrt(3) * R^2)", "Substitute x = R/sqrt(2) into E(x): GM (R/sqrt(2)) / (3/2 R^2)^(3/2) = 2 GM / (3 sqrt(3) R^2)"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Due to Earth's rotation with angular speed omega, effective gravity varies with latitude lambda as g' = g0 - omega^2 R cos^2(lambda). Match List I with List II:",
        [
            ("Effective gravity at the equator (lambda = 0 deg)", "I", "g0 - omega^2 * R", "At lambda = 0 deg, cos lambda = 1, so g' = g0 - omega^2 R"),
            ("Effective gravity at the poles (lambda = 90 deg)", "III", "g0", "At lambda = 90 deg, cos lambda = 0, so centrifugal acceleration vanishes: g' = g0"),
            ("Effective gravity at latitude lambda = 60 deg", "IV", "g0 - 0.25 * omega^2 * R", "At lambda = 60 deg, cos 60 deg = 0.5, cos^2(60 deg) = 0.25, so g' = g0 - 0.25 omega^2 R"),
            ("Angular speed omega required for objects at the equator to feel weightless", "II", "sqrt(g0 / R)", "Setting g0 - omega^2 R = 0 gives omega = sqrt(g0 / R) approx 17 times current rotation rate"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "A satellite of mass m orbits Earth (mass M) in a stable circular orbit of radius r. Match the energetic quantities in List I with List II:",
        [
            ("Kinetic energy K of the orbiting satellite", "III", "+GMm / (2r)", "Orbital velocity v_o = sqrt(GM/r). K = (1/2) m v_o^2 = GMm / (2r)"),
            ("Gravitational potential energy U of the satellite-Earth system", "I", "-GMm / r", "Standard zero reference at infinity gives U = -GMm / r"),
            ("Total mechanical energy E of the orbiting satellite", "IV", "-GMm / (2r)", "E = K + U = GMm/(2r) - GMm/r = -GMm / (2r)"),
            ("Ratio of kinetic energy to potential energy (K / U)", "II", "-1/2", "Ratio = [GMm / (2r)] / [-GMm / r] = -1/2"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Match the orbital characteristics of satellites in List I with their defining parameters in List II:",
        [
            ("Orbital period of a geostationary satellite", "IV", "24 hours (synchronous with Earth's rotation)", "Matches Earth's sidereal rotation period so satellite stays fixed over one equatorial meridian"),
            ("Orbital period of a typical low-Earth polar satellite", "I", "Approximately 90 to 100 minutes", "At altitude h approx 500-800 km, T = 2 pi sqrt(r^3 / GM) approx 95 minutes"),
            ("Orbital altitude of a geostationary satellite above Earth's surface", "II", "Approximately 35,800 km", "r = (GM T^2 / (4 pi^2))^(1/3) approx 42,200 km; altitude h = r - R approx 35,800 km"),
            ("Plane of orbit for a geostationary satellite", "III", "Strictly in the equatorial plane (inclination 0 deg)", "Any other orbital plane would cause the ground track to oscillate north and south daily"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "A particle of mass m is dropped into a smooth diametrical tunnel through uniform Earth (radius R, surface gravity g). Match List I with List II:",
        [
            ("Restoring force acting on particle at distance r from Earth center", "II", "-m * (g / R) * r", "F(r) = -G M(r) m / r^2 = -GMm r / R^3 = -m(g/R) r, proving motion is SHM"),
            ("Time period of oscillation of the particle through the tunnel", "IV", "2*pi * sqrt(R / g) approx 84.6 minutes", "omega = sqrt(g / R) => T = 2 pi sqrt(R/g) approx 84.6 minutes"),
            ("Speed of the particle as it passes through the center of the Earth", "I", "sqrt(gR) approx 7.9 km/s", "Energy conservation: (1/2)m v_c^2 = (1/2)m omega^2 R^2 => v_c = omega R = sqrt(gR)"),
            ("Acceleration of the particle at the midpoint between surface and center (r = R/2)", "III", "g / 2", "a = omega^2 r = (g/R)(R/2) = g / 2"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Let ve be the escape velocity from Earth (radius R, mass M). Match the hypothetical planets in List I with their escape velocity in List II:",
        [
            ("Planet with same mass as Earth but radius R' = R / 2", "I", "sqrt(2) * ve", "v_e' = sqrt(2G M / (R/2)) = sqrt(2) * sqrt(2GM/R) = sqrt(2) * ve"),
            ("Planet with same radius as Earth but mass M' = 4*M", "III", "2 * ve", "v_e' = sqrt(2G(4M) / R) = 2 * sqrt(2GM/R) = 2 * ve"),
            ("Planet with same mean density as Earth but radius R' = 3*R", "IV", "3 * ve", "v_e proportional to R * sqrt(rho). With rho' = rho and R' = 3R, v_e' = 3 * ve"),
            ("Celestial body with mass M' = M / 16 and radius R' = R / 4", "II", "0.5 * ve", "v_e' = sqrt(2G(M/16) / (R/4)) = sqrt(1/4) * sqrt(2GM/R) = 0.5 * ve"),
        ], "D"))

    # 8 Advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A planet of mass m moves in an elliptical orbit around the Sun (mass M) with perihelion distance rp and aphelion distance ra. Match List I with List II:",
        [
            ("Semi-major axis a of the elliptical orbit", "III", "(rp + ra) / 2", "By geometry of ellipse, total major axis 2a = rp + ra => a = (rp + ra)/2"),
            ("Eccentricity e of the elliptical orbit", "I", "(ra - rp) / (ra + rp)", "rp = a(1 - e) and ra = a(1 + e) => ra - rp = 2ae, ra + rp = 2a => e = (ra - rp)/(ra + rp)"),
            ("Ratio of speeds at perihelion and aphelion (v_p / v_a)", "IV", "ra / rp", "By conservation of angular momentum: m v_p rp = m v_a ra => v_p / v_a = ra / rp"),
            ("Total orbital mechanical energy of the planet", "II", "-GMm / (rp + ra)", "Total energy E = -GMm / (2a) = -GMm / (rp + ra)"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Gravitational self-energy is the work required to assemble a body from infinitesimal masses brought from infinity. Match List I with List II:",
        [
            ("Gravitational self-energy of a uniform solid sphere of mass M and radius R", "IV", "- (3/5) * G M^2 / R", "U_self = integral_0^M (-G m / r) dm = - (3/5) G M^2 / R"),
            ("Gravitational self-energy of a thin uniform spherical shell of mass M, radius R", "I", "- (1/2) * G M^2 / R", "U_self = - (1/2) G M^2 / R for a thin spherical shell"),
            ("Minimum work required to completely disperse a uniform solid sphere to infinity", "II", "(3/5) * G M^2 / R", "Work W = U_infinity - U_self = 0 - (-3/5 G M^2 / R) = (3/5) G M^2 / R"),
            ("Ratio of self-energy magnitude of solid sphere to that of spherical shell", "III", "6 / 5 (or 1.2)", "Ratio = (3/5 G M^2/R) / (1/2 G M^2/R) = (3/5) / (1/2) = 6/5 = 1.2"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "A spacecraft transfers between coplanar circular orbits of radii r1 and r2 (r1 < r2) around Earth (mass M) via a Hohmann elliptical orbit. Match List I with List II:",
        [
            ("Semi-major axis a_t of the transfer ellipse", "II", "(r1 + r2) / 2", "The transfer orbit has periapsis r1 and apoapsis r2, so major axis 2 a_t = r1 + r2 => a_t = (r1 + r2)/2"),
            ("Transfer flight time from orbit 1 to orbit 2", "IV", "pi * sqrt((r1 + r2)^3 / (8*G*M))", "Flight time is half the Keplerian orbital period: t = T_t / 2 = pi sqrt(a_t^3 / GM) = pi sqrt((r1 + r2)^3 / (8GM))"),
            ("Speed on the transfer ellipse at periapsis r1", "I", "sqrt(2*G*M*r2 / (r1*(r1 + r2)))", "Vis-viva equation: v^2 = GM(2/r1 - 1/a_t) = GM(2/r1 - 2/(r1+r2)) = 2GM r2 / (r1(r1+r2))"),
            ("Speed on the transfer ellipse at apoapsis r2", "III", "sqrt(2*G*M*r1 / (r2*(r1 + r2)))", "Vis-viva equation: v^2 = GM(2/r2 - 2/(r1+r2)) = 2GM r1 / (r2(r1+r2))"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "A projectile is launched vertically from Earth's surface (radius R) with speed v = alpha * ve (alpha < 1), where ve = sqrt(2gR). Match List I with List II:",
        [
            ("Maximum height h reached when launched with alpha = 1/2", "I", "R / 3", "Energy conservation: h = [alpha^2 / (1 - alpha^2)] R. For alpha = 1/2: h = (1/4)/(3/4) R = R / 3"),
            ("Maximum height h reached when launched with alpha = 1 / sqrt(2)", "III", "R", "For alpha = 1/sqrt(2): alpha^2 = 1/2, so h = (1/2)/(1/2) R = R"),
            ("Maximum height h reached when launched with alpha = sqrt(3) / 2", "IV", "3*R", "For alpha = sqrt(3)/2: alpha^2 = 3/4, so h = (3/4)/(1/4) R = 3R"),
            ("Fractional discrepancy (h_flat - h) / h if constant-g flat-Earth formula is used for alpha = 1/sqrt(2)", "II", "-50 percent (underestimates true height by half)", "Flat formula gives h_flat = v^2/(2g) = (0.5 ve^2)/(2g) = 0.5 R. True h = R. Error = (0.5R - R)/R = -50%"),
        ], "D"))

    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "A binary star system consists of two stars of masses M1 and M2 separated by distance d orbiting their common center of mass. Match List I with List II:",
        [
            ("Orbital radius r1 of star M1 about the center of mass", "III", "M2 * d / (M1 + M2)", "Center of mass definition: M1 r1 = M2 r2 and r1 + r2 = d => r1 = M2 d / (M1 + M2)"),
            ("Orbital radius r2 of star M2 about the center of mass", "I", "M1 * d / (M1 + M2)", "Similarly, r2 = M1 d / (M1 + M2)"),
            ("Orbital period T of mutual circular revolution", "IV", "2*pi * sqrt(d^3 / (G*(M1 + M2)))", "Gravitational force G M1 M2 / d^2 = M1 omega^2 r1 => omega^2 = G(M1 + M2) / d^3 => T = 2 pi sqrt(d^3 / (G(M1 + M2)))"),
            ("Ratio of orbital speeds (v1 / v2)", "II", "M2 / M1", "v1 / v2 = (omega r1) / (omega r2) = r1 / r2 = M2 / M1"),
        ], "B"))

    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "A spherical cavity of radius b is hollowed out of a uniform solid sphere of mass density rho and radius R. The cavity center is at displacement 'a' from the sphere center. Match List I with List II:",
        [
            ("Nature of the gravitational field E inside the cavity", "IV", "Completely uniform in magnitude and direction", "Superposition: E_total = E_solid - E_cavity = -4/3 pi G rho r - (-4/3 pi G rho (r - a)) = -4/3 pi G rho a, which is constant"),
            ("Magnitude of the uniform gravitational field inside the cavity", "I", "(4/3) * pi * G * rho * a", "Magnitude is constant and equals (4/3) pi G rho a directed anti-parallel to displacement vector a"),
            ("Gravitational force on a test mass m placed inside the cavity", "II", "(4/3) * pi * G * rho * m * a", "Force F = m E = (4/3) pi G rho m a, uniform throughout the cavity volume"),
            ("Dependence of field inside cavity on cavity radius b", "III", "Completely independent of cavity radius b", "The cavity field expression depends only on density rho and separation vector a, entirely independent of b"),
        ], "A"))

    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match the Lagrange points in the circular restricted three-body problem (e.g. Sun-Earth system) in List I with their descriptions in List II:",
        [
            ("Lagrange point L1", "II", "Located between Sun and Earth where gravitational pulls oppose each other", "L1 lies along the inter-body axis between the primaries; solar observatories like SOHO reside here"),
            ("Lagrange point L2", "IV", "Located beyond Earth along the Sun-Earth line, ideal for deep space observatories", "L2 lies outside Earth's orbit on the shadow side; host to the James Webb Space Telescope"),
            ("Lagrange points L4 and L5", "I", "Form equilateral triangles with Sun and Earth, dynamically stable for M1/M2 > 24.96", "L4 and L5 lead and trail the secondary by 60 degrees in its orbit, hosting Trojan asteroids stably"),
            ("Effective potential in the co-rotating frame", "III", "Includes gravitational potentials of both bodies plus centrifugal potential -(1/2)*omega^2*r^2", "Phi_eff(r) = -GM1/r1 - GM2/r2 - (1/2) omega^2 r^2; Lagrange points are stationary points of Phi_eff"),
        ], "C"))

    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Match the tidal phenomena and Roche limit parameters in List I with their physical expressions and effects in List II:",
        [
            ("Differential tidal force across a small moon of radius r and mass m at distance d from planet M", "I", "2 * G * M * m * r / d^3", "Delta F = dF/dd * (2r) = 2 G M m r / d^3 (inverse-cube distance dependence)"),
            ("Dependence of tidal stretching force on orbital distance d", "III", "Proportional to d^(-3)", "Tidal force is the gradient of gravitational force, scaling as d^(-3) rather than d^(-2)"),
            ("Rigid body Roche limit radius d_R for moon of density rho_m orbiting planet of radius R_M and density rho_M", "IV", "R_M * (2 * rho_M / rho_m)^(1/3)", "Equating self-gravity to tidal force yields d_R = R_M (2 rho_M / rho_m)^(1/3)"),
            ("Ocean tidal cycles on Earth", "II", "Two tidal bulges causing two high tides and two low tides per day", "Differential gravitational pull creates two opposite bulges on opposite sides of Earth"),
        ], "D"))

    return qs
