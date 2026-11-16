from builder import make_matrix_q

def get_questions():
    qs = []

    # ==========================================
    # TOPIC: Statistics (20 questions)
    # ==========================================
    t = "Statistics"
    prefix = "math_mat_stat"

    # 001 beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the statistical measures in List I with their values in List II for the data set: 3, 7, 8, 8, 12, 14, 18, 26:",
        [
            ("Mean of the data set", "II", "12", "Sum of 8 observations is 96, so mean is 96/8 = 12"),
            ("Median of the data set", "IV", "10", "4th and 5th terms are 8 and 12, so median is (8 + 12)/2 = 10"),
            ("Mode of the data set", "I", "8", "Value 8 appears with highest frequency (twice)"),
            ("Range of the data set", "III", "23", "Difference between maximum and minimum: 26 - 3 = 23")
        ], "A"))

    # 002 beginner
    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "Match the statistical dispersion metrics in List I with their values in List II for the data set: 2, 4, 6, 8, 10:",
        [
            ("Mean deviation about the mean", "III", "2.4", "Mean is 6; deviations are 4, 2, 0, 2, 4; sum is 12; MD = 12/5 = 2.4"),
            ("Variance σ²", "I", "8", "Sum of squared deviations is 16 + 4 + 0 + 4 + 16 = 40; variance = 40/5 = 8"),
            ("Standard deviation σ", "IV", "2√2", "Square root of variance: √8 = 2√2"),
            ("Coefficient of variation (CV)", "II", "(100√2)/3 %", "CV = (σ / mean) * 100 = (2√2 / 6) * 100 = (100√2)/3 %")
        ], "B"))

    # 003 beginner
    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "A data set has mean x̄ = 20 and variance σ² = 16 (standard deviation σ = 4). Match the transformed variables in List I with their statistical parameters in List II:",
        [
            ("Mean of y = 3x - 5", "IV", "55", "Mean(3x - 5) = 3(20) - 5 = 55"),
            ("Variance of y = 3x - 5", "III", "144", "Var(3x - 5) = 3² * Var(x) = 9 * 16 = 144"),
            ("Standard deviation of y = 3x - 5", "II", "12", "SD(3x - 5) = 3 * 4 = 12"),
            ("Standard deviation of z = -2x + 10", "I", "8", "SD(-2x + 10) = |-2| * 4 = 8")
        ], "C"))

    # 004 beginner
    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match each statistical formula in List I with its correct algebraic definition in List II:",
        [
            ("Population variance σ² of ungrouped data", "I", "(1/n) ∑ x_i² - (x̄)²", "Standard formula: mean of squares minus square of mean"),
            ("Mean deviation about median M", "II", "(1/n) ∑ |x_i - M|", "Arithmetic mean of the absolute deviations from median"),
            ("Coefficient of variation (CV)", "IV", "(σ / x̄) × 100", "Ratio of standard deviation to mean expressed as percentage"),
            ("Combined mean x̄_c of two samples", "III", "(n1 x̄1 + n2 x̄2) / (n1 + n2)", "Weighted arithmetic mean of the two individual sample means")
        ], "D"))

    # 005 intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Match each set of natural numbers in List I with its variance in List II (using Var = (n² - 1)/12):",
        [
            ("First 5 natural numbers {1, 2, 3, 4, 5}", "II", "2", "(5² - 1)/12 = 24/12 = 2"),
            ("First 7 natural numbers {1, 2, ..., 7}", "I", "4", "(7² - 1)/12 = 48/12 = 4"),
            ("First 9 natural numbers {1, 2, ..., 9}", "IV", "20/3", "(9² - 1)/12 = 80/12 = 20/3"),
            ("First 11 natural numbers {1, 2, ..., 11}", "III", "10", "(11² - 1)/12 = 120/12 = 10")
        ], "A"))

    # 006 intermediate
    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "The mean of 6 observations {2, 4, 6, 8, x, y} is 6 and the variance is 20/3. Match the algebraic quantities in List I with their values in List II:",
        [
            ("Sum x + y", "III", "16", "Total sum is 6 * 6 = 36; known sum is 20, so x + y = 16"),
            ("Sum of squares x² + y²", "IV", "136", "Total ∑ x² = 6*(20/3 + 36) = 256; known sum of squares is 120, so x² + y² = 136"),
            ("Product xy", "I", "60", "2xy = (x + y)² - (x² + y²) = 256 - 136 = 120, so xy = 60"),
            ("Absolute difference |x - y|", "II", "4", "|x - y| = √((x + y)² - 4xy) = √(256 - 240) = 4")
        ], "B"))

    # 007 intermediate
    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Group 1 has n1 = 40, mean x̄1 = 50, variance σ1² = 10. Group 2 has n2 = 60, mean x̄2 = 60, variance σ2² = 15. Match the combined group parameters in List I with their values in List II:",
        [
            ("Combined mean x̄_c", "IV", "56", "(40*50 + 60*60)/100 = (2000 + 3600)/100 = 56"),
            ("Squared deviation d1² = (x̄1 - x̄_c)²", "II", "36", "(50 - 56)² = (-6)² = 36"),
            ("Squared deviation d2² = (x̄2 - x̄_c)²", "III", "16", "(60 - 56)² = 4² = 16"),
            ("Combined variance σ_c²", "I", "37", "[40(10 + 36) + 60(15 + 16)]/100 = (1840 + 1860)/100 = 37")
        ], "C"))

    # 008 intermediate
    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "A set of 20 observations has mean 40 and variance 25. Later it was found that an observation 25 was wrongly read as 45. Match the corrected statistics in List I with their values in List II:",
        [
            ("Corrected mean", "I", "39", "Corrected sum = 20*40 - 45 + 25 = 780; corrected mean = 780/20 = 39"),
            ("Corrected sum of squares ∑ x_i²", "IV", "31100", "Old sum of squares = 20*(25 + 1600) = 32500; corrected = 32500 - 45² + 25² = 31100"),
            ("Corrected variance", "II", "34", "31100/20 - 39² = 1555 - 1521 = 34"),
            ("Corrected standard deviation", "III", "√34", "Square root of corrected variance: √34")
        ], "D"))

    # 009 intermediate
    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "For the discrete frequency distribution with values x = {2, 4, 6, 8, 10} and frequencies f = {3, 9, 8, 6, 4} (total N = 30), match the quantities in List I with their values in List II:",
        [
            ("Mode of the distribution", "II", "4", "The value 4 has the highest frequency (f = 9)"),
            ("Median of the distribution", "III", "6", "N/2 = 15; cumulative frequency reaches 12 at x = 4 and 20 at x = 6, so median is 6"),
            ("Sum of absolute deviations about median ∑ f_i |x_i - 6|", "IV", "58", "3(4) + 9(2) + 8(0) + 6(2) + 4(4) = 12 + 18 + 0 + 12 + 16 = 58"),
            ("Mean deviation about median", "I", "29/15", "Mean deviation = 58 / 30 = 29/15")
        ], "A"))

    # 010 intermediate
    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "For a distribution with midpoints x = {10, 20, 30, 40, 50} and frequencies f = {3, 5, 8, 3, 1} (total N = 20), using step-deviation u = (x - 30)/10, match the quantities in List I with their values in List II:",
        [
            ("Mean of u", "III", "-0.3", "∑ f_i u_i = 3(-2) + 5(-1) + 8(0) + 3(1) + 1(2) = -6; mean of u = -6/20 = -0.3"),
            ("Mean of x", "I", "27", "x̄ = 30 + 10(-0.3) = 27"),
            ("Variance of u", "II", "1.11", "∑ f_i u_i² = 24; Var(u) = 24/20 - (-0.3)² = 1.20 - 0.09 = 1.11"),
            ("Variance of x", "IV", "111", "Var(x) = 10² * Var(u) = 100 * 1.11 = 111")
        ], "B"))

    # 011 intermediate
    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Using Pearson's empirical formula Mode = 3 Median - 2 Mean, match the given distribution conditions in List I with the calculated values in List II:",
        [
            ("Mode when Mean = 24 and Median = 22", "IV", "18", "Mode = 3(22) - 2(24) = 66 - 48 = 18"),
            ("Median when Mode = 15 and Mean = 27", "I", "23", "Median = (15 + 2*27)/3 = 69/3 = 23"),
            ("Mean when Mode = 30 and Median = 25", "III", "22.5", "Mean = (3*25 - 30)/2 = 45/2 = 22.5"),
            ("Value of (Mean - Median) when (Mean - Mode) = 18", "II", "6", "Mean - Mode = 3(Mean - Median) => Mean - Median = 18/3 = 6")
        ], "C"))

    # 012 intermediate
    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match the employee salary statistics of four company departments in List I with their Coefficients of Variation (CV = (σ / x̄) * 100) in List II:",
        [
            ("Dept A: Mean = $500, SD = $25", "I", "5%", "CV = (25 / 500) * 100 = 5%"),
            ("Dept B: Mean = $400, SD = $32", "III", "8%", "CV = (32 / 400) * 100 = 8%"),
            ("Dept C: Mean = $600, SD = $36", "IV", "6%", "CV = (36 / 600) * 100 = 6%"),
            ("Dept D: Mean = $800, SD = $32", "II", "4%", "CV = (32 / 800) * 100 = 4%")
        ], "D"))

    # 013 advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "The mean and variance of 7 observations are 8 and 16. Five of the observations are 2, 4, 10, 12, 14. If the remaining two observations are a and b with a ≤ b, match the algebraic expressions in List I with their values in List II:",
        [
            ("Sum a + b", "II", "14", "Total sum is 7*8 = 56; sum of known 5 is 42, so a + b = 14"),
            ("Product ab", "IV", "48", "∑ x² = 7*(16+64) = 560; sum of known squares is 460 => a² + b² = 100; 2ab = 196 - 100 = 96 => ab = 48"),
            ("Difference b - a", "III", "2", "Roots of t² - 14t + 48 = 0 are 6 and 8, so b - a = 8 - 6 = 2"),
            ("Sum of cubes a³ + b³", "I", "728", "6³ + 8³ = 216 + 512 = 728")
        ], "A"))

    # 014 advanced
    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Match each 10-term Arithmetic Progression in List I with its variance in List II (using Var = d²(n² - 1)/12 = d² * 99 / 12):",
        [
            ("AP: 3, 7, 11, ..., 39 (common difference d = 4)", "III", "132", "Var = 16 * 99 / 12 = 132"),
            ("AP: 5, 8, 11, ..., 32 (common difference d = 3)", "II", "74.25", "Var = 9 * 99 / 12 = 297/4 = 74.25"),
            ("AP: 10, 12, 14, ..., 28 (common difference d = 2)", "IV", "33", "Var = 4 * 99 / 12 = 33"),
            ("AP: 1, 6, 11, ..., 46 (common difference d = 5)", "I", "206.25", "Var = 25 * 99 / 12 = 2475/12 = 206.25")
        ], "B"))

    # 015 advanced
    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "A data set has mean 10, variance 4 (standard deviation 2), median 8, and quartile deviation 3. Match the statistical metrics of the transformed variable y = -3x - 5 in List I with their values in List II:",
        [
            ("New mean of y", "IV", "-35", "Mean(y) = -3(10) - 5 = -35"),
            ("New variance of y", "III", "36", "Var(y) = (-3)² * 4 = 36"),
            ("New standard deviation of y", "I", "6", "SD(y) = |-3| * 2 = 6"),
            ("New quartile deviation of y", "II", "9", "QD(y) = |-3| * 3 = 9")
        ], "C"))

    # 016 advanced
    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Two series of sizes n1 = 10 and n2 = 15 have means x̄1 = 20, x̄2 = 25 and standard deviations σ1 = 2, σ2 = 3. Match the combined series parameters in List I with their values in List II:",
        [
            ("Combined mean x̄_c", "I", "23", "(10*20 + 15*25)/25 = 575/25 = 23"),
            ("Squared deviation d1² = (x̄1 - x̄_c)²", "II", "9", "(20 - 23)² = 9"),
            ("Squared deviation d2² = (x̄2 - x̄_c)²", "III", "4", "(25 - 23)² = 4"),
            ("Combined variance σ_c²", "IV", "13", "[10(4 + 9) + 15(9 + 4)]/25 = [130 + 195]/25 = 325/25 = 13")
        ], "D"))

    # 017 advanced
    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "For a sample of 20 observations where ∑ x_i = 80 and ∑ x_i² = 500, match the sample statistics in List I with their values in List II:",
        [
            ("Sample mean x̄", "II", "4", "80 / 20 = 4"),
            ("Sample variance σ²", "I", "9", "500/20 - 4² = 25 - 16 = 9"),
            ("Standard deviation σ", "III", "3", "Square root of variance: √9 = 3"),
            ("Coefficient of variation (CV)", "IV", "75%", "(3 / 4) * 100 = 75%")
        ], "A"))

    # 018 advanced
    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "For the data set {1, 3, 5, 7, 9, 11} of n = 6 observations, match the optimization and dispersion metrics in List I with their values in List II:",
        [
            ("Value of a minimizing f(a) = ∑ (x_i - a)²", "III", "6", "Sum of squared deviations is minimized at the mean: 36/6 = 6"),
            ("Minimum value of f(a)", "IV", "70", "(-5)² + (-3)² + (-1)² + 1² + 3² + 5² = 25 + 9 + 1 + 1 + 9 + 25 = 70"),
            ("Variance of the data", "II", "35/3", "70 / 6 = 35/3"),
            ("Mean deviation about the mean", "I", "3", "(5 + 3 + 1 + 1 + 3 + 5)/6 = 18/6 = 3")
        ], "B"))

    # 019 advanced
    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "For the data set {11, 13, 15, 17, 19} with mean 15 and variance 8, match the transformed and secondary metrics in List I with their values in List II:",
        [
            ("New mean if 3 is added to each of the first 3 observations and 2 is subtracted from each of the last 2", "IV", "16", "New sum = 75 + 3(3) - 2(2) = 80; new mean = 80/5 = 16"),
            ("Mean of the squares (1/5) ∑ x_i²", "I", "233", "Var + (mean)² = 8 + 225 = 233"),
            ("Standard deviation", "II", "2√2", "Square root of variance: √8 = 2√2"),
            ("Variance of transformed data y = 3x + 4", "III", "72", "3² * Var(x) = 9 * 8 = 72")
        ], "C"))

    # 020 advanced
    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Consider the weighted mean x̄_w = ∑ w_i x_i / ∑ w_i of the first n natural numbers with weights w_i = i (formula x̄_w = (2n + 1)/3). Match the expressions in List I with their evaluated values in List II:",
        [
            ("Weighted mean for n = 4", "I", "3", "(2*4 + 1)/3 = 9/3 = 3"),
            ("Weighted mean for n = 7", "IV", "5", "(2*7 + 1)/3 = 15/3 = 5"),
            ("Arithmetic mean of first 15 natural numbers", "III", "8", "(15 + 1)/2 = 8"),
            ("Variance of first 7 natural numbers", "II", "4", "(7² - 1)/12 = 48/12 = 4")
        ], "D"))

    # ==========================================
    # TOPIC: Probability (20 questions)
    # ==========================================
    t = "Probability"
    prefix = "math_mat_prob"

    # 001 beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the dice events in List I with their theoretical probabilities in List II:",
        [
            ("Getting a prime number on a single roll of a fair die", "II", "1/2", "Outcomes {2, 3, 5} give 3/6 = 1/2"),
            ("Getting a sum of 7 when rolling two fair dice", "IV", "1/6", "6 favorable pairs {(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)} out of 36 give 6/36 = 1/6"),
            ("Getting a sum of 9 when rolling two fair dice", "I", "1/9", "4 favorable pairs {(3,6),(4,5),(5,4),(6,3)} out of 36 give 4/36 = 1/9"),
            ("Getting a sum of 11 when rolling two fair dice", "III", "1/18", "2 favorable pairs {(5,6),(6,5)} out of 36 give 2/36 = 1/18")
        ], "A"))

    # 002 beginner
    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "A single card is drawn at random from a well-shuffled standard pack of 52 cards. Match the card-drawing events in List I with their probabilities in List II:",
        [
            ("Drawing a King or a Queen", "III", "2/13", "4 Kings + 4 Queens = 8 cards; probability = 8/52 = 2/13"),
            ("Drawing a Spade or an Ace", "I", "4/13", "13 Spades + 4 Aces - 1 Ace of Spades = 16 cards; probability = 16/52 = 4/13"),
            ("Drawing a red face card", "IV", "3/26", "2 red suits * 3 face cards = 6 cards; probability = 6/52 = 3/26"),
            ("Drawing a black card or a King", "II", "7/13", "26 black cards + 4 Kings - 2 black Kings = 28 cards; probability = 28/52 = 7/13")
        ], "B"))

    # 003 beginner
    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Let A and B be independent events with P(A) = 2/5 and P(B) = 1/3. Match the compound events in List I with their probabilities in List II:",
        [
            ("P(A ∩ B)", "IV", "2/15", "P(A)*P(B) = (2/5)*(1/3) = 2/15"),
            ("P(A ∪ B)", "III", "3/5", "P(A) + P(B) - P(A ∩ B) = 2/5 + 1/3 - 2/15 = 9/15 = 3/5"),
            ("P(A ∩ B′)", "II", "4/15", "P(A)*P(B′) = (2/5)*(2/3) = 4/15"),
            ("P(A′ ∩ B′)", "I", "2/5", "P(A′)*P(B′) = (3/5)*(2/3) = 6/15 = 2/5")
        ], "C"))

    # 004 beginner
    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match the odds and probability specifications in List I with their values in List II:",
        [
            ("Odds in favor of event E if P(E) = 3/7", "I", "3 : 4", "P(E) : P(E′) = 3/7 : 4/7 = 3 : 4"),
            ("Odds against event E if P(E) = 5/9", "II", "4 : 5", "P(E′) : P(E) = 4/9 : 5/9 = 4 : 5"),
            ("P(E) if odds in favor of E are 2 : 5", "IV", "2/7", "Probability = 2 / (2 + 5) = 2/7"),
            ("P(E) if odds against E are 3 : 7", "III", "7/10", "Probability = 7 / (3 + 7) = 7/10")
        ], "D"))

    # 005 intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "Two fair six-sided dice are rolled. Match the conditional probability events in List I with their values in List II:",
        [
            ("P(sum = 8 | first die is 4)", "II", "1/6", "Given first die is 4, only the outcome (4,4) yields sum 8, so probability is 1/6"),
            ("P(sum is even | first die is 4)", "I", "1/2", "Given first die is 4, second die must be even {2, 4, 6}, giving 3/6 = 1/2"),
            ("P(first die is 4 | sum = 8)", "IV", "1/5", "Sum 8 has 5 outcomes {(2,6),(3,5),(4,4),(5,3),(6,2)}; (4,4) is 1 outcome, so 1/5"),
            ("P(sum = 8 | sum ≥ 7)", "III", "5/21", "Sums ≥ 7 comprise 6 + 5 + 4 + 3 + 2 + 1 = 21 outcomes; 5 outcomes give sum 8, so 5/21")
        ], "A"))

    # 006 intermediate
    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Three students A, B, and C independently attempt to solve a problem with probabilities 1/2, 1/3, and 1/4 respectively. Match the events in List I with their probabilities in List II:",
        [
            ("Probability that none of them solves the problem", "III", "1/4", "(1 - 1/2)*(1 - 1/3)*(1 - 1/4) = (1/2)*(2/3)*(3/4) = 1/4"),
            ("Probability that the problem is solved", "IV", "3/4", "1 - P(none solves) = 1 - 1/4 = 3/4"),
            ("Probability that exactly one student solves the problem", "I", "11/24", "(1/2)(2/3)(3/4) + (1/2)(1/3)(3/4) + (1/2)(2/3)(1/4) = 6/24 + 3/24 + 2/24 = 11/24"),
            ("Probability that all three students solve the problem", "II", "1/24", "(1/2)*(1/3)*(1/4) = 1/24")
        ], "B"))

    # 007 intermediate
    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "Three urns contain colored balls: Urn 1 has 4 white and 2 black balls, Urn 2 has 3 white and 3 black balls, Urn 3 has 1 white and 5 black balls. An urn is selected at random with equal probability 1/3. Match the ball-drawing events in List I with their probabilities in List II:",
        [
            ("Overall probability of drawing a white ball", "IV", "4/9", "(1/3)*(4/6 + 3/6 + 1/6) = (1/3)*(8/6) = 4/9"),
            ("Overall probability of drawing a black ball", "II", "5/9", "1 - 4/9 = 5/9"),
            ("Probability of drawing 2 white balls without replacement from Urn 1", "III", "2/5", "C(4,2)/C(6,2) = 6/15 = 2/5"),
            ("Probability of drawing 2 white balls without replacement from Urn 2", "I", "1/5", "C(3,2)/C(6,2) = 3/15 = 1/5")
        ], "C"))

    # 008 intermediate
    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "Let A, B, and C be mutually independent events with probabilities P(A) = 0.3, P(B) = 0.4, and P(C) = 0.5. Match the compound events in List I with their probabilities in List II:",
        [
            ("P(A ∩ B ∩ C)", "I", "0.06", "P(A)*P(B)*P(C) = 0.3 * 0.4 * 0.5 = 0.06"),
            ("Probability that none of the events occur", "IV", "0.21", "(1 - 0.3)*(1 - 0.4)*(1 - 0.5) = 0.7 * 0.6 * 0.5 = 0.21"),
            ("Probability that at least one event occurs", "II", "0.79", "1 - 0.21 = 0.79"),
            ("Probability that exactly one event occurs", "III", "0.44", "0.3(0.6)(0.5) + (0.7)(0.4)(0.5) + (0.7)(0.6)(0.5) = 0.09 + 0.14 + 0.21 = 0.44")
        ], "D"))

    # 009 intermediate
    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Two cards are drawn successively without replacement from a standard 52-card deck. Match the events in List I with their probabilities in List II:",
        [
            ("Both cards are Aces", "II", "1/221", "(4/52) * (3/51) = 1/221"),
            ("Both cards are hearts", "III", "1/17", "(13/52) * (12/51) = (1/4) * (4/17) = 1/17"),
            ("First card is a King and second card is a Queen", "IV", "4/663", "(4/52) * (4/51) = (1/13) * (4/51) = 4/663"),
            ("One card is a King and the other is a Queen (in any order)", "I", "8/663", "2 * (4/663) = 8/663")
        ], "A"))

    # 010 intermediate
    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "Let A and B be two events such that P(A) = 3/8, P(B) = 5/8, and P(A ∪ B) = 3/4. Match the probability expressions in List I with their evaluated values in List II:",
        [
            ("P(A ∩ B)", "III", "1/4", "P(A) + P(B) - P(A ∪ B) = 3/8 + 5/8 - 6/8 = 2/8 = 1/4"),
            ("P(A | B)", "I", "2/5", "P(A ∩ B) / P(B) = (1/4) / (5/8) = 2/5"),
            ("P(B | A)", "II", "2/3", "P(A ∩ B) / P(A) = (1/4) / (3/8) = 2/3"),
            ("P(A △ B) = P(A ∪ B) - P(A ∩ B)", "IV", "1/2", "3/4 - 1/4 = 1/2")
        ], "B"))

    # 011 intermediate
    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "Box 1 contains 2 gold and 3 silver coins. Box 2 contains 3 gold and 3 silver coins. A coin is transferred at random from Box 1 to Box 2, and then a coin is drawn from Box 2. Match the events in List I with their probabilities in List II:",
        [
            ("Probability that the transferred coin is gold", "IV", "2/5", "Box 1 has 2 gold out of 5 coins: 2/5"),
            ("Probability that the transferred coin is silver", "I", "3/5", "Box 1 has 3 silver out of 5 coins: 3/5"),
            ("P(coin drawn from Box 2 is gold | transferred coin was gold)", "III", "4/7", "Box 2 then contains 4 gold out of 7 coins: 4/7"),
            ("Overall probability that the coin drawn from Box 2 is gold", "II", "17/35", "(2/5)*(4/7) + (3/5)*(3/7) = 8/35 + 9/35 = 17/35")
        ], "C"))

    # 012 intermediate
    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "A pair of fair six-sided dice is thrown. Match the divisibility conditions for the sum in List I with their probabilities in List II:",
        [
            ("Probability that the sum is a multiple of 3", "I", "1/3", "Sums {3, 6, 9, 12} have 2 + 5 + 4 + 1 = 12 outcomes; 12/36 = 1/3"),
            ("Probability that the sum is a multiple of 4", "III", "1/4", "Sums {4, 8, 12} have 3 + 5 + 1 = 9 outcomes; 9/36 = 1/4"),
            ("Probability that the sum is a multiple of 12", "IV", "1/36", "Only the pair (6,6) gives sum 12; 1/36"),
            ("Probability that the sum is a multiple of 3 or 4", "II", "5/9", "(12 + 9 - 1)/36 = 20/36 = 5/9")
        ], "D"))

    # 013 advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "A and B take turns rolling a pair of fair dice. A wins if he rolls a sum of 6 before B rolls a sum of 7; B wins if he rolls a sum of 7 before A rolls a sum of 6. Player A throws first. Match the game outcomes in List I with their exact probabilities in List II:",
        [
            ("Probability that A wins on his 1st roll", "II", "5/36", "P(sum = 6) = 5/36"),
            ("Probability that B wins on his 1st roll", "IV", "31/216", "(1 - 5/36)*(6/36) = (31/36)*(1/6) = 31/216"),
            ("Overall probability that A wins the game", "III", "30/61", "(5/36) / [1 - (31/36)*(5/6)] = (5/36) / (61/216) = 30/61"),
            ("Overall probability that B wins the game", "I", "31/61", "1 - 30/61 = 31/61")
        ], "A"))

    # 014 advanced
    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Three distinct numbers are chosen at random without replacement from {1, 2, 3, ..., 10}. Match the combinatorial events in List I with their probabilities in List II:",
        [
            ("The three numbers form an Arithmetic Progression", "III", "1/6", "Number of APs is 8 + 6 + 4 + 2 = 20; probability = 20/C(10,3) = 20/120 = 1/6"),
            ("All three numbers chosen are odd", "II", "1/12", "C(5,3) / 120 = 10/120 = 1/12"),
            ("Product of the three numbers is even", "IV", "11/12", "1 - P(all odd) = 1 - 1/12 = 11/12"),
            ("The minimum of the three chosen numbers is 4", "I", "1/8", "Choosing 4 and two numbers from {5..10}: C(6,2)/120 = 15/120 = 1/8")
        ], "B"))

    # 015 advanced
    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "Two numbers x and y are selected independently and uniformly at random from the interval [0, 1]. Match the geometric probability events in List I with their probabilities in List II:",
        [
            ("P(x + y ≤ 1)", "IV", "1/2", "Area of triangle with vertices (0,0), (1,0), (0,1) = 1/2"),
            ("P(y ≥ x²)", "III", "2/3", "Area = 1 - ∫_0^1 x² dx = 1 - 1/3 = 2/3"),
            ("P(|x - y| ≤ 1/2)", "I", "3/4", "Area = 1 - 2 * (1/2 * (1/2)²) = 1 - 1/4 = 3/4"),
            ("P(x² + y² ≤ 1)", "II", "π/4", "Area of the quarter unit circle in the first quadrant = π/4")
        ], "C"))

    # 016 advanced
    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "Four addressed letters are placed into four directed envelopes at random (total 4! = 24 arrangements). Match the letter-matching events in List I with their probabilities in List II:",
        [
            ("Probability that no letter is placed in the correct envelope", "I", "3/8", "Derangement number !4 = 9; probability = 9/24 = 3/8"),
            ("Probability that exactly 1 letter is placed in the correct envelope", "II", "1/3", "C(4,1)*!3 / 24 = 4*2 / 24 = 8/24 = 1/3"),
            ("Probability that exactly 2 letters are placed in the correct envelopes", "III", "1/4", "C(4,2)*!2 / 24 = 6*1 / 24 = 6/24 = 1/4"),
            ("Probability that all 4 letters are placed in the correct envelopes", "IV", "1/24", "1 / 24")
        ], "D"))

    # 017 advanced
    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Four individuals independently choose a day of the week (Monday through Sunday) at random. Match the coincidence events in List I with their exact probabilities in List II:",
        [
            ("Probability that all four choose distinct days", "II", "120/343", "(7 * 6 * 5 * 4) / 7⁴ = 840 / 2401 = 120 / 343"),
            ("Probability that at least two individuals choose the same day", "I", "223/343", "1 - 120/343 = 223/343"),
            ("Probability that all four individuals choose the exact same day", "III", "1/343", "7 / 7⁴ = 1 / 343"),
            ("Probability that exactly two individuals choose the same day and the other two choose distinct days", "IV", "180/343", "C(4,2) * 7 * 6 * 5 / 7⁴ = 6 * 210 / 2401 = 180 / 343")
        ], "A"))

    # 018 advanced
    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Person A speaks the truth in 75% of cases and Person B speaks the truth in 80% of cases. Match the conversational scenarios in List I with their probabilities in List II:",
        [
            ("They contradict each other when stating the same fact", "III", "35%", "(3/4)(1/5) + (1/4)(4/5) = 3/20 + 4/20 = 7/20 = 35%"),
            ("They agree with each other when stating the same fact", "IV", "65%", "(3/4)(4/5) + (1/4)(1/5) = 12/20 + 1/20 = 13/20 = 65%"),
            ("Both individuals speak the truth", "II", "60%", "(3/4)*(4/5) = 12/20 = 60%"),
            ("Both individuals lie", "I", "5%", "(1/4)*(1/5) = 1/20 = 5%")
        ], "B"))

    # 019 advanced
    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Three coins are placed in a box: Coin 1 is two-headed (P(H) = 1), Coin 2 is biased with P(H) = 3/4, and Coin 3 is fair (P(H) = 1/2). One coin is chosen at random and tossed once. Match the probability outcomes in List I with their values in List II:",
        [
            ("Total probability that the toss results in Heads", "IV", "3/4", "(1/3)*(1 + 3/4 + 1/2) = (1/3)*(9/4) = 3/4"),
            ("Total probability that the toss results in Tails", "I", "1/4", "1 - 3/4 = 1/4"),
            ("P(Coin 1 was chosen | toss shows Heads)", "II", "4/9", "(1/3 * 1) / (3/4) = (1/3)*(4/3) = 4/9"),
            ("P(Coin 3 was chosen | toss shows Heads)", "III", "2/9", "(1/3 * 1/2) / (3/4) = (1/6)*(4/3) = 2/9")
        ], "C"))

    # 020 advanced
    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "A fair coin is tossed 5 times independently. Match the coin-tossing events in List I with their exact probabilities in List II:",
        [
            ("Probability of obtaining exactly 3 Heads", "I", "5/16", "C(5,3) / 32 = 10/32 = 5/16"),
            ("Probability of obtaining at least 4 Heads", "IV", "3/16", "(C(5,4) + C(5,5)) / 32 = (5 + 1)/32 = 6/32 = 3/16"),
            ("Probability of obtaining no two consecutive Heads", "III", "13/32", "Valid sequences match Fibonacci F_7 = 13; probability = 13/32"),
            ("Probability of obtaining Heads on both the first and fifth toss", "II", "1/4", "1 * 2³ * 1 / 32 = 8/32 = 1/4")
        ], "D"))

    # ==========================================
    # TOPIC: Probability (Bayes and Random Variables) (20 questions)
    # ==========================================
    t = "Probability (Bayes and Random Variables)"
    prefix = "math_mat_bayes"

    # 001 beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "For a Binomial random variable X ~ B(n, p) with n = 5 trials and probability of success p = 1/5, match the distribution parameters and probabilities in List I with their values in List II:",
        [
            ("Mean E(X)", "II", "1", "Mean = np = 5 * (1/5) = 1"),
            ("Variance Var(X)", "IV", "4/5", "Variance = npq = 5 * (1/5) * (4/5) = 4/5"),
            ("Probability P(X = 0)", "I", "1024/3125", "P(X = 0) = q⁵ = (4/5)⁵ = 1024/3125"),
            ("Probability P(X = 5)", "III", "1/3125", "P(X = 5) = p⁵ = (1/5)⁵ = 1/3125")
        ], "A"))

    # 002 beginner
    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "A discrete random variable X has probability distribution P(X = x) = k, 2k, 3k, 4k for x = 0, 1, 2, 3 respectively. Match the statistical metrics in List I with their evaluated values in List II:",
        [
            ("Constant k", "III", "1/10", "Sum of probabilities k + 2k + 3k + 4k = 10k = 1 => k = 1/10"),
            ("Expected value E(X)", "I", "2", "E(X) = 0(k) + 1(2k) + 2(3k) + 3(4k) = 20k = 20/10 = 2"),
            ("Second moment E(X²)", "IV", "5", "E(X²) = 0 + 1(2k) + 4(3k) + 9(4k) = 50k = 50/10 = 5"),
            ("Variance Var(X)", "II", "1", "Var(X) = E(X²) - [E(X)]² = 5 - 2² = 1")
        ], "B"))

    # 003 beginner
    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "A manufacturing plant has Machine A producing 60% of daily output with 2% defect rate, and Machine B producing 40% with 4% defect rate. Match the events in List I with their probabilities in List II:",
        [
            ("Overall probability an item chosen at random is defective", "IV", "7/250", "P(D) = 0.60(0.02) + 0.40(0.04) = 0.012 + 0.016 = 0.028 = 7/250"),
            ("P(Item from Machine A | item is defective)", "III", "3/7", "0.012 / 0.028 = 12/28 = 3/7"),
            ("P(Item from Machine B | item is defective)", "II", "4/7", "0.016 / 0.028 = 16/28 = 4/7"),
            ("Probability that an item chosen at random is non-defective", "I", "243/250", "1 - 7/250 = 243/250")
        ], "C"))

    # 004 beginner
    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Match each theoretical identity of probability distributions and Bayes' theorem in List I with its formula in List II:",
        [
            ("Expected value E(X) of a discrete random variable", "I", "∑ x_i P(X = x_i)", "Definition of mathematical expectation for a discrete random variable"),
            ("Variance Var(X) of a random variable", "II", "E(X²) - [E(X)]²", "Standard formulation of variance as mean of square minus square of mean"),
            ("Variance of sum Var(X + Y) for independent random variables", "IV", "Var(X) + Var(Y)", "Additivity of variance for independent random variables"),
            ("Posterior probability P(E1 | A) via Bayes' Theorem", "III", "P(E1)P(A|E1) / ∑ P(Ei)P(A|Ei)", "Bayes' inversion rule for updating prior probabilities given evidence A")
        ], "D"))

    # 005 intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "A rare medical condition has a prevalence of 0.001 in a population. A screening test has a sensitivity of 0.99 (P(T+|D) = 0.99) and a false-positive rate of 0.02 (P(T+|D′) = 0.02). Match the joint and conditional probabilities in List I with their values in List II:",
        [
            ("P(D ∩ T+)", "II", "0.00099", "0.001 * 0.99 = 0.00099"),
            ("P(D′ ∩ T+)", "I", "0.01998", "0.999 * 0.02 = 0.01998"),
            ("Total probability of a positive test P(T+)", "IV", "0.02097", "0.00099 + 0.01998 = 0.02097"),
            ("Posterior probability P(D | T+)", "III", "33/699", "0.00099 / 0.02097 = 99 / 2097 = 33 / 699")
        ], "A"))

    # 006 intermediate
    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "Two cards are drawn simultaneously at random without replacement from a standard deck of 52 cards. Let X be the random variable denoting the number of Aces drawn. Match the probabilities and moments in List I with their values in List II:",
        [
            ("P(X = 0)", "III", "188/221", "C(48,2)/C(52,2) = 1128/1326 = 188/221"),
            ("P(X = 1)", "IV", "32/221", "C(4,1)*C(48,1)/1326 = 192/1326 = 32/221"),
            ("P(X = 2)", "I", "1/221", "C(4,2)/1326 = 6/1326 = 1/221"),
            ("Expected value E(X)", "II", "2/13", "0*(188/221) + 1*(32/221) + 2*(1/221) = 34/221 = 2/13")
        ], "B"))

    # 007 intermediate
    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "For a Binomial distribution X ~ B(n, p), the mean is 4 and the variance is 4/3. Match the parameters and probabilities in List I with their values in List II:",
        [
            ("Number of trials n", "IV", "6", "q = (4/3)/4 = 1/3 => p = 2/3. n = 4 / (2/3) = 6"),
            ("Probability of success p", "II", "2/3", "p = 1 - 1/3 = 2/3"),
            ("P(X = 0)", "III", "1/729", "q⁶ = (1/3)⁶ = 1/729"),
            ("P(X = 1)", "I", "4/243", "C(6,1) * (2/3) * (1/3)⁵ = 12/729 = 4/243")
        ], "C"))

    # 008 intermediate
    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "A discrete random variable X takes values {1, 2, 3, 4} with probabilities k, 2k, 3k, 4k respectively. Match the statistical values in List I with their computed quantities in List II:",
        [
            ("Value of constant k", "I", "0.1", "10k = 1 => k = 0.1"),
            ("Expected value E(X)", "IV", "3.0", "1(0.1) + 2(0.2) + 3(0.3) + 4(0.4) = 0.1 + 0.4 + 0.9 + 1.6 = 3.0"),
            ("Second raw moment E(X²)", "II", "10.0", "1(0.1) + 4(0.2) + 9(0.3) + 16(0.4) = 0.1 + 0.8 + 2.7 + 6.4 = 10.0"),
            ("Variance Var(X)", "III", "1.0", "Var(X) = 10.0 - 3.0² = 10.0 - 9.0 = 1.0")
        ], "D"))

    # 009 intermediate
    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Three urns contain: Urn 1 has 1 white and 2 black balls; Urn 2 has 2 white and 1 black ball; Urn 3 has 3 white balls and 0 black balls. One urn is chosen at random with probability 1/3 and a ball drawn is found to be white. Match the posterior probabilities in List I with their values in List II:",
        [
            ("Total probability of drawing a white ball", "II", "2/3", "(1/3)*(1/3 + 2/3 + 3/3) = (1/3)*(2) = 2/3"),
            ("P(Urn 1 was chosen | white ball drawn)", "III", "1/6", "(1/3 * 1/3) / (2/3) = (1/9) / (2/3) = 1/6"),
            ("P(Urn 2 was chosen | white ball drawn)", "IV", "1/3", "(1/3 * 2/3) / (2/3) = (2/9) / (2/3) = 1/3"),
            ("P(Urn 3 was chosen | white ball drawn)", "I", "1/2", "(1/3 * 1) / (2/3) = (1/3) / (2/3) = 1/2")
        ], "A"))

    # 010 intermediate
    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "A fair coin is tossed 6 times. Let X denote the number of Heads obtained (X ~ B(6, 1/2)). Match the probabilities in List I with their values in List II:",
        [
            ("P(X = 3)", "III", "5/16", "C(6,3) / 64 = 20/64 = 5/16"),
            ("P(X = 2)", "I", "15/64", "C(6,2) / 64 = 15/64"),
            ("P(X = 1)", "II", "3/32", "C(6,1) / 64 = 6/64 = 3/32"),
            ("P(X ≥ 5)", "IV", "7/64", "(C(6,5) + C(6,6)) / 64 = (6 + 1)/64 = 7/64")
        ], "B"))

    # 011 intermediate
    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "A game involves rolling a pair of fair dice. The player receives $10 if a doublet appears, and loses $2 otherwise. Let X be the net gain in dollars. Match the distribution metrics in List I with their values in List II:",
        [
            ("P(X = 10)", "IV", "1/6", "6 doublets out of 36 outcomes = 6/36 = 1/6"),
            ("P(X = -2)", "I", "5/6", "30 non-doublets out of 36 outcomes = 30/36 = 5/6"),
            ("Expected payoff E(X)", "III", "0", "10*(1/6) + (-2)*(5/6) = (10 - 10)/6 = 0"),
            ("Variance of payoff Var(X)", "II", "20", "100*(1/6) + 4*(5/6) = 120/6 = 20")
        ], "C"))

    # 012 intermediate
    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "A man speaks the truth 3 out of 4 times. He throws a fair 6-sided die and reports that the number obtained is a six. Match the probabilities in List I with their values in List II:",
        [
            ("P(Die is 6 and he reports 6)", "I", "1/8", "P(Die = 6)*P(Truth) = (1/6)*(3/4) = 3/24 = 1/8"),
            ("P(Die is not 6 and he reports 6)", "III", "5/24", "P(Die ≠ 6)*P(Lie) = (5/6)*(1/4) = 5/24"),
            ("Total probability that he reports 6", "IV", "1/3", "3/24 + 5/24 = 8/24 = 1/3"),
            ("Posterior probability that the die is actually a six", "II", "3/8", "(3/24) / (8/24) = 3/8")
        ], "D"))

    # 013 advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "For a Binomial distribution with n = 5 independent trials, the sum of its mean and variance is 1.8. Match the parameters and probabilities in List I with their values in List II:",
        [
            ("Probability of success p", "II", "1/5", "5p + 5p(1 - p) = 1.8 => 25p² - 50p + 9 = 0 => (5p - 1)(5p - 9) = 0 => p = 1/5"),
            ("Mean np", "IV", "1", "Mean = 5 * (1/5) = 1"),
            ("Variance npq", "III", "4/5", "Variance = 5 * (1/5) * (4/5) = 4/5"),
            ("P(X = 1)", "I", "256/625", "C(5,1) * (1/5) * (4/5)⁴ = 256/625")
        ], "A"))

    # 014 advanced
    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Three coins are placed in a box: Coin 1 is two-headed (P(H) = 1), Coin 2 is biased with P(H) = 2/3, and Coin 3 is fair (P(H) = 1/2). One coin is chosen at random and tossed twice, showing Heads both times. Match the probabilities in List I with their values in List II:",
        [
            ("P(2 Heads | Coin 1)", "III", "1", "1² = 1"),
            ("P(2 Heads | Coin 2)", "II", "4/9", "(2/3)² = 4/9"),
            ("Total probability of getting 2 Heads", "IV", "61/108", "(1/3)*(1 + 4/9 + 1/4) = (1/3)*(61/36) = 61/108"),
            ("Posterior probability that Coin 1 was selected", "I", "36/61", "(1/3 * 1) / (61/108) = (36/108) / (61/108) = 36/61")
        ], "B"))

    # 015 advanced
    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "A Binomial random variable X ~ B(n, p) has mean E(X) = 10 and variance Var(X) = 8. Match the quantities in List I with their values in List II:",
        [
            ("Number of trials n", "IV", "50", "q = 8/10 = 4/5 => p = 1/5; n = 10 / (1/5) = 50"),
            ("Probability of success p", "III", "1/5", "p = 1 - 4/5 = 1/5"),
            ("Second moment E(X²)", "I", "108", "Var(X) + [E(X)]² = 8 + 100 = 108"),
            ("Expected value E((X - 2)²)", "II", "72", "E(X² - 4X + 4) = 108 - 4(10) + 4 = 72")
        ], "C"))

    # 016 advanced
    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "A card is lost from a standard pack of 52 cards. From the remaining 51 cards, two cards are drawn at random and both are found to be spades. Match the probabilities in List I with their values in List II:",
        [
            ("P(lost card is spade and 2 spades drawn)", "I", "11/850", "(1/4) * [C(12,2)/C(51,2)] = (1/4)*(22/425) = 11/850"),
            ("P(lost card not spade and 2 spades drawn)", "II", "39/850", "(3/4) * [C(13,2)/C(51,2)] = (3/4)*(26/425) = 39/850"),
            ("Total probability that the 2 drawn cards are spades", "III", "1/17", "11/850 + 39/850 = 50/850 = 1/17"),
            ("Posterior probability that the lost card was a spade", "IV", "11/50", "(11/850) / (50/850) = 11/50")
        ], "D"))

    # 017 advanced
    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Three independent biased coins each having P(H) = 1/3 are tossed together. Let X be the random variable representing the number of Heads. Match the probability values in List I with their exact values in List II:",
        [
            ("P(X = 0)", "II", "8/27", "(2/3)³ = 8/27"),
            ("P(X = 1)", "I", "4/9", "3 * (1/3) * (4/9) = 12/27 = 4/9"),
            ("P(X = 2)", "III", "2/9", "3 * (1/9) * (2/3) = 6/27 = 2/9"),
            ("P(X = 3)", "IV", "1/27", "(1/3)³ = 1/27")
        ], "A"))

    # 018 advanced
    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "Let X be a random variable with mean E(X) = 5 and variance Var(X) = 4. Let Y = 3X - 7. Match the moments of Y in List I with their values in List II:",
        [
            ("Mean E(Y)", "III", "8", "E(3X - 7) = 3(5) - 7 = 8"),
            ("Variance Var(Y)", "IV", "36", "Var(3X - 7) = 3² * 4 = 36"),
            ("Standard deviation of Y", "II", "6", "Square root of variance: √36 = 6"),
            ("Second moment E(Y²)", "I", "100", "Var(Y) + [E(Y)]² = 36 + 64 = 100")
        ], "B"))

    # 019 advanced
    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "A marksman hits a target with probability p = 1/4 on each shot. Match the probability thresholds for hitting the target at least once in List I with the minimum number of shots n required in List II:",
        [
            ("Probability of at least one hit > 1/2", "IV", "3", "1 - (3/4)³ = 37/64 > 1/2 (since (3/4)² = 9/16 > 1/2, n = 3)"),
            ("Probability of at least one hit > 2/3", "I", "4", "(3/4)⁴ = 81/256 < 1/3, so n = 4"),
            ("Probability of at least one hit > 3/4", "II", "5", "(3/4)⁵ = 243/1024 < 1/4, so n = 5"),
            ("Probability of at least one hit > 9/10", "III", "9", "(3/4)⁸ ≈ 0.1001 > 0.1, (3/4)⁹ ≈ 0.075 < 0.1, so n = 9")
        ], "C"))

    # 020 advanced
    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "The mode of a Binomial distribution B(n, p) is the value of k maximizing P(X = k), given by [(n + 1)p] when non-integer. Match each Binomial distribution in List I with its unique mode in List II:",
        [
            ("Distribution B(10, 1/3)", "I", "3", "(10 + 1)/3 = 11/3 ≈ 3.67 => Mode = 3"),
            ("Distribution B(13, 1/3)", "IV", "4", "(13 + 1)/3 = 14/3 ≈ 4.67 => Mode = 4"),
            ("Distribution B(16, 1/3)", "III", "5", "(16 + 1)/3 = 17/3 ≈ 5.67 => Mode = 5"),
            ("Distribution B(19, 1/3)", "II", "6", "(19 + 1)/3 = 20/3 ≈ 6.67 => Mode = 6")
        ], "D"))

    # ==========================================
    # TOPIC: Linear Programming (20 questions)
    # ==========================================
    t = "Linear Programming"
    prefix = "math_mat_lpp"

    # 001 beginner
    qs.append(make_matrix_q(f"{prefix}_001", t, "beginner",
        "Match the foundational concepts of Linear Programming in List I with their formal definitions in List II:",
        [
            ("Objective function", "II", "Linear function Z = ax + by to be optimized", "The linear expression of decision variables to be maximized or minimized"),
            ("Feasible region", "IV", "Common region satisfying all constraints and non-negativity restrictions", "The set of all points satisfying every linear constraint simultaneously"),
            ("Corner point", "I", "Point of intersection of boundary lines bounding the feasible region", "A vertex of the polygonal convex feasible region"),
            ("Optimal solution", "III", "Feasible point yielding the extreme (max or min) value of Z", "A feasible point where the objective function attains its optimal value")
        ], "A"))

    # 002 beginner
    qs.append(make_matrix_q(f"{prefix}_002", t, "beginner",
        "The corner points of a feasible region are (0, 0), (4, 0), (2, 3), and (0, 5). Match the vertices in List I with the evaluated values of Z = 4x + 3y in List II:",
        [
            ("Value of Z at (0, 0)", "III", "0", "Z = 4(0) + 3(0) = 0"),
            ("Value of Z at (4, 0)", "I", "16", "Z = 4(4) + 3(0) = 16"),
            ("Value of Z at (2, 3)", "IV", "17", "Z = 4(2) + 3(3) = 8 + 9 = 17"),
            ("Value of Z at (0, 5)", "II", "15", "Z = 4(0) + 3(5) = 15")
        ], "B"))

    # 003 beginner
    qs.append(make_matrix_q(f"{prefix}_003", t, "beginner",
        "Match the linear inequalities in List I with the geometric description of their corresponding half-planes in List II:",
        [
            ("2x + 3y ≤ 6", "IV", "Closed half-plane containing origin", "2(0) + 3(0) = 0 ≤ 6 is satisfied; boundary line included"),
            ("x - y ≥ 4", "III", "Closed half-plane not containing origin", "0 - 0 = 0 ≥ 4 is false; boundary line included"),
            ("3x + 4y > 12", "II", "Open half-plane not containing origin", "3(0) + 4(0) = 0 > 12 is false; boundary line excluded"),
            ("x + y < 5", "I", "Open half-plane containing origin", "0 + 0 = 0 < 5 is satisfied; boundary line excluded")
        ], "C"))

    # 004 beginner
    qs.append(make_matrix_q(f"{prefix}_004", t, "beginner",
        "Consider the feasible region determined by the constraints x + y ≤ 4, x ≥ 0, y ≥ 0. Match the geometric and optimization attributes in List I with their values in List II:",
        [
            ("Geometric shape of the feasible region", "I", "Bounded triangular region", "Region enclosed by the coordinate axes and line x + y = 4 in the first quadrant"),
            ("Number of corner points", "II", "3", "The vertices are (0, 0), (4, 0), and (0, 4)"),
            ("Area of the feasible region", "IV", "8", "Area = (1/2) * base * height = (1/2) * 4 * 4 = 8"),
            ("Maximum value of Z = 5x + 3y", "III", "20", "Z(4,0) = 20, Z(0,4) = 12, Z(0,0) = 0 => Maximum is 20")
        ], "D"))

    # 005 intermediate
    qs.append(make_matrix_q(f"{prefix}_005", t, "intermediate",
        "The feasible region of an LPP is defined by x + 2y ≤ 10, 3x + y ≤ 15, x ≥ 0, y ≥ 0, having corner points (0, 0), (5, 0), (4, 3), and (0, 5). Match the corner points in List I with the values of Z = 6x + 5y in List II:",
        [
            ("Value at (0, 0)", "II", "0", "Z = 6(0) + 5(0) = 0"),
            ("Value at (5, 0)", "I", "30", "Z = 6(5) + 5(0) = 30"),
            ("Value at (4, 3)", "IV", "39", "Z = 6(4) + 5(3) = 24 + 15 = 39"),
            ("Value at (0, 5)", "III", "25", "Z = 6(0) + 5(5) = 25")
        ], "A"))

    # 006 intermediate
    qs.append(make_matrix_q(f"{prefix}_006", t, "intermediate",
        "A feasible region has corner points (0, 3), (3, 0), (4, 2), and (2, 4). Match the corner points in List I with the values of Z = 2x - 3y in List II:",
        [
            ("Value at (0, 3)", "III", "-9", "Z = 2(0) - 3(3) = -9"),
            ("Value at (3, 0)", "IV", "6", "Z = 2(3) - 3(0) = 6"),
            ("Value at (4, 2)", "I", "2", "Z = 2(4) - 3(2) = 8 - 6 = 2"),
            ("Value at (2, 4)", "II", "-8", "Z = 2(2) - 3(4) = 4 - 12 = -8")
        ], "B"))

    # 007 intermediate
    qs.append(make_matrix_q(f"{prefix}_007", t, "intermediate",
        "An LPP has a constraint boundary line 2x + 5y = 20. Match the objective functions or parameters in List I with their optimality characteristics in List II:",
        [
            ("Objective function Z = 4x + 10y", "IV", "Infinite optimal solutions along boundary segment", "Slope -4/10 = -2/5 matches the constraint line slope; Z is parallel to the boundary edge"),
            ("Objective function Z = 2x - 5y", "II", "Unique vertex optimal solution", "Slope 2/5 is distinct from the boundary line slope -2/5"),
            ("Value of k if Z = kx + 15y is parallel to 2x + 5y = 20", "III", "6", "Parallel condition: k / 2 = 15 / 5 => k = 6"),
            ("Value of m if Z = 8x + my is parallel to 2x + 5y = 20", "I", "20", "Parallel condition: 8 / 2 = m / 5 => m = 20")
        ], "C"))

    # 008 intermediate
    qs.append(make_matrix_q(f"{prefix}_008", t, "intermediate",
        "An unbounded feasible region is bounded by 2x + y ≥ 8, x + 2y ≥ 10, x ≥ 0, y ≥ 0 with corner points (0, 8), (2, 4), and (10, 0). Objective function is Z = 3x + 4y. Match the items in List I with the values in List II:",
        [
            ("Value of Z at (0, 8)", "I", "32", "Z = 3(0) + 4(8) = 32"),
            ("Value of Z at (10, 0)", "IV", "30", "Z = 3(10) + 4(0) = 30"),
            ("Value of Z at (2, 4)", "II", "22", "Z = 3(2) + 4(4) = 6 + 16 = 22"),
            ("Open half-plane to check for unbounded minimum", "III", "3x + 4y < 22", "The minimum M = 22 is valid if the open half-plane 3x + 4y < 22 has no points in common with the feasible region")
        ], "D"))

    # 009 intermediate
    qs.append(make_matrix_q(f"{prefix}_009", t, "intermediate",
        "Match each system of linear constraints in List I with its feasible region classification in List II:",
        [
            ("System: x + y ≤ 2 and x + y ≥ 4, x ≥ 0, y ≥ 0", "II", "Infeasible with empty feasible region", "The half-planes x + y ≤ 2 and x + y ≥ 4 are disjoint parallel strips"),
            ("System: x + y ≤ 5 and 2x + 2y ≤ 8, x ≥ 0, y ≥ 0", "III", "Contains redundant constraint x + y ≤ 5", "Constraint 2x + 2y ≤ 8 simplifies to x + y ≤ 4, making x + y ≤ 5 redundant"),
            ("System: x - y ≥ 0 and y - x ≥ 2, x ≥ 0, y ≥ 0", "IV", "Inconsistent parallel half-planes", "Requires y ≤ x and y ≥ x + 2 simultaneously, which has no intersection"),
            ("System: x ≥ 0, y ≥ 0, x ≤ 10", "I", "Unbounded feasible region in y-direction", "Variable y can increase without upper bound")
        ], "A"))

    # 010 intermediate
    qs.append(make_matrix_q(f"{prefix}_010", t, "intermediate",
        "A diet problem requires at least 8 units of vitamin A and 12 units of vitamin B. Food F1 ($50/kg) has 2 units A, 3 units B; Food F2 ($60/kg) has 4 units A, 2 units B. Match the LPP components in List I with their algebraic forms in List II:",
        [
            ("Cost objective function to minimize", "III", "Z = 50x + 60y", "Total purchase cost for x kg of F1 and y kg of F2"),
            ("Vitamin A requirement constraint", "I", "2x + 4y ≥ 8", "Total vitamin A supplied must be at least 8 units"),
            ("Vitamin B requirement constraint", "II", "3x + 2y ≥ 12", "Total vitamin B supplied must be at least 12 units"),
            ("Non-negativity restrictions", "IV", "x ≥ 0, y ≥ 0", "Food quantities cannot be negative")
        ], "B"))

    # 011 intermediate
    qs.append(make_matrix_q(f"{prefix}_011", t, "intermediate",
        "A workshop produces products A and B on machines M1 and M2. Product A needs 2 hr on M1, 1 hr on M2; Product B needs 1 hr on M1, 2 hr on M2. M1 has 16 hrs max, M2 has 14 hrs max. Corner points are (0, 0), (8, 0), (6, 4), (0, 7). Profit is Z = 40x + 30y. Match the corner points in List I with their profit values in List II:",
        [
            ("Profit at (0, 0)", "IV", "0", "Z = 40(0) + 30(0) = 0"),
            ("Profit at (8, 0)", "I", "320", "Z = 40(8) + 30(0) = 320"),
            ("Profit at (6, 4)", "III", "360", "Z = 40(6) + 30(4) = 240 + 120 = 360"),
            ("Profit at (0, 7)", "II", "210", "Z = 40(0) + 30(7) = 210")
        ], "C"))

    # 012 intermediate
    qs.append(make_matrix_q(f"{prefix}_012", t, "intermediate",
        "Match each constraint system in List I with the number of corner points of its feasible region in List II:",
        [
            ("x + y ≤ 4, x ≥ 0, y ≥ 0", "I", "3 corner points", "The vertices are (0, 0), (4, 0), (0, 4)"),
            ("x + 2y ≤ 8, 2x + y ≤ 8, x ≥ 0, y ≥ 0", "III", "4 corner points", "The vertices are (0, 0), (4, 0), (8/3, 8/3), (0, 4)"),
            ("x + y ≤ 6, x ≤ 4, y ≤ 4, x ≥ 0, y ≥ 0", "IV", "5 corner points", "The vertices are (0, 0), (4, 0), (4, 2), (2, 4), (0, 4)"),
            ("x + y ≥ 2, x ≥ 0, y ≥ 0 (unbounded)", "II", "2 corner points", "The vertices on the axes are (2, 0) and (0, 2)")
        ], "D"))

    # 013 advanced
    qs.append(make_matrix_q(f"{prefix}_013", t, "advanced",
        "The corner points of a feasible region are (0, 4), (2, 5), (6, 3), and (7, 0). If the maximum of Z = px + qy (p, q > 0) occurs at two corner points, match the point pairs in List I with the relationship between p and q in List II:",
        [
            ("Maximum at both (2, 5) and (6, 3)", "II", "q = 2p", "2p + 5q = 6p + 3q => 2q = 4p => q = 2p"),
            ("Maximum at both (6, 3) and (7, 0)", "IV", "p = 3q", "6p + 3q = 7p + 0 => p = 3q"),
            ("Maximum at both (0, 4) and (6, 3)", "III", "q = 6p", "0 + 4q = 6p + 3q => q = 6p"),
            ("Maximum at both (2, 5) and (7, 0)", "I", "p = q", "2p + 5q = 7p + 0 => 5q = 5p => p = q")
        ], "A"))

    # 014 advanced
    qs.append(make_matrix_q(f"{prefix}_014", t, "advanced",
        "Consider the objective function Z = α x + y on a feasible region with corner points (4, 0), (3, 3), (1, 4), and (0, 3). Match the parameters or conditions in List I with the resulting optimal vertex or value in List II:",
        [
            ("Optimal vertex maximizing Z when α = 0.2", "III", "(1, 4)", "Z(1,4) = 4.2, Z(3,3) = 3.6, Z(4,0) = 0.8 => optimal at (1, 4)"),
            ("Optimal vertex maximizing Z when α = 1", "II", "(3, 3)", "Z(3,3) = 6, Z(1,4) = 5, Z(4,0) = 4 => optimal at (3, 3)"),
            ("Optimal vertex maximizing Z when α = 5", "IV", "(4, 0)", "Z(4,0) = 20, Z(3,3) = 18, Z(1,4) = 9 => optimal at (4, 0)"),
            ("Value of α for which Z is maximized along the entire line segment connecting (1, 4) and (3, 3)", "I", "1/2", "α(1) + 4 = α(3) + 3 => 2α = 1 => α = 1/2")
        ], "B"))

    # 015 advanced
    qs.append(make_matrix_q(f"{prefix}_015", t, "advanced",
        "For the unbounded feasible region determined by 2x + y ≥ 8, x + 2y ≥ 8, x ≥ 0, y ≥ 0, and objective function Z = 2x + 4y to be minimized, match the analysis items in List I with their descriptions in List II:",
        [
            ("Corner points of the feasible region", "IV", "(0, 8), (8/3, 8/3), and (8, 0)", "Intersection of boundary lines with each other and with the axes"),
            ("Minimum value of Z", "III", "16", "Z(8/3, 8/3) = 16 and Z(8, 0) = 16"),
            ("Set of points where minimum value is attained", "I", "Every point on the segment joining (8/3, 8/3) and (8, 0)", "The line 2x + 4y = 16 is identical to the boundary line x + 2y = 8"),
            ("Open half-plane condition to confirm optimality of minimum", "II", "2x + 4y < 16 has no common point with feasible region", "The open half-plane 2x + 4y < 16 is disjoint from the feasible region")
        ], "C"))

    # 016 advanced
    qs.append(make_matrix_q(f"{prefix}_016", t, "advanced",
        "A feasible region is defined by x + 2y ≤ 120, x + y ≥ 60, x - 2y ≥ 0, x ≥ 0, y ≥ 0, having corner points (40, 20), (60, 30), (120, 0), and (60, 0). Match the corner points in List I with the values of Z = 3x + 9y in List II:",
        [
            ("Value at (40, 20)", "I", "300", "Z = 3(40) + 9(20) = 120 + 180 = 300"),
            ("Value at (60, 30)", "II", "450", "Z = 3(60) + 9(30) = 180 + 270 = 450"),
            ("Value at (120, 0)", "III", "360", "Z = 3(120) + 9(0) = 360"),
            ("Value at (60, 0)", "IV", "180", "Z = 3(60) + 9(0) = 180")
        ], "D"))

    # 017 advanced
    qs.append(make_matrix_q(f"{prefix}_017", t, "advanced",
        "Consider the LPP: Maximize Z = 3x + 5y subject to x + 2y ≤ 10, x + y ≤ 6, x ≥ 0, y ≥ 0, having corner points (0, 0), (6, 0), (2, 4), and (0, 5). Match the optimization and sensitivity parameters in List I with their values in List II:",
        [
            ("Maximum value of Z", "II", "26", "At optimal corner point (2, 4): Z = 3(2) + 5(4) = 26"),
            ("Value of Z at vertex (0, 5)", "I", "25", "Z = 3(0) + 5(5) = 25"),
            ("Value of Z at vertex (6, 0)", "III", "18", "Z = 3(6) + 5(0) = 18"),
            ("Increase in maximum Z when the RHS of x + 2y ≤ 10 is increased by 1 (shadow price)", "IV", "2", "New intersection of x + 2y = 11 and x + y = 6 is (1, 5); new Z = 28; increase = 28 - 26 = 2")
        ], "A"))

    # 018 advanced
    qs.append(make_matrix_q(f"{prefix}_018", t, "advanced",
        "The corner points of a feasible region are A(1, 1), B(4, 1), C(3, 4), and D(1, 3). Match the vertices in List I with the value of f(x, y) = x² + y² (square of distance from origin) in List II:",
        [
            ("Value of f at A(1, 1)", "III", "2", "f(1, 1) = 1² + 1² = 2"),
            ("Value of f at B(4, 1)", "IV", "17", "f(4, 1) = 4² + 1² = 17"),
            ("Value of f at C(3, 4)", "II", "25", "f(3, 4) = 3² + 4² = 25"),
            ("Value of f at D(1, 3)", "I", "10", "f(1, 3) = 1² + 3² = 10")
        ], "B"))

    # 019 advanced
    qs.append(make_matrix_q(f"{prefix}_019", t, "advanced",
        "Match each system of inequalities in List I with the geometric nature of its feasible region in List II:",
        [
            ("System: x + y ≤ 4, x ≥ 1, y ≥ 1", "IV", "Triangular region with 3 vertices", "Bounded triangular region with vertices (1, 1), (3, 1), and (1, 3)"),
            ("System: 2x + y ≥ 4, x + 2y ≥ 4, x ≥ 0, y ≥ 0", "I", "Unbounded polygonal region in first quadrant", "Unbounded region with corner points (0, 4), (4/3, 4/3), and (4, 0)"),
            ("System: x + y ≤ 2, x + y ≥ 5, x ≥ 0, y ≥ 0", "II", "Empty set with no feasible points", "No points can satisfy x + y ≤ 2 and x + y ≥ 5 simultaneously"),
            ("System: 0 ≤ x ≤ 3, 0 ≤ y ≤ 5", "III", "Rectangular region with 4 vertices", "Bounded rectangular region with vertices (0,0), (3,0), (3,5), (0,5)")
        ], "C"))

    # 020 advanced
    qs.append(make_matrix_q(f"{prefix}_020", t, "advanced",
        "Maximize Z = 10x + 6y subject to 5x + 3y ≤ 30, x + 2y ≤ 14, x ≤ 5, x ≥ 0, y ≥ 0, having corner points (0, 0), (5, 0), (5, 5/3), (18/7, 40/7), and (0, 7). Match the optimization metrics in List I with their values or characterizations in List II:",
        [
            ("Maximum value of Z", "I", "60", "Attained at both (5, 5/3) and (18/7, 40/7): 10(5) + 6(5/3) = 60"),
            ("Value of Z at (5, 0)", "IV", "50", "Z = 10(5) + 6(0) = 50"),
            ("Value of Z at (0, 7)", "III", "42", "Z = 10(0) + 6(7) = 42"),
            ("Nature of the optimal solution set", "II", "Infinitely many optimal solutions along boundary segment", "Objective function 10x + 6y is parallel to constraint line 5x + 3y = 30; all points on the segment are optimal")
        ], "D"))

    return qs
