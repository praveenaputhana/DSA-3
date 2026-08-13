with open("problems.txt", "r", encoding="utf-8") as file:
    problems = file.readlines()

print("Problem Mapping\n")
for line in problems:
    problem = line.strip()
    if not problem:
        continue
    lower = problem.lower()
    if "search" in lower:
        algo = "String Matching"
    elif "sort" in lower:
        algo = "Sorting"
    elif "shortest" in lower:
        algo = "Graph Algorithm"
    elif "duplicate" in lower:
        algo = "Document Similarity"
    elif "sudoku" in lower:
        algo = "Backtracking"
    elif "compress" in lower:
        algo = "Greedy"
    else:
        continue  # skip unknown problems
    print(f"Problem : {problem}")
    print(f"Algorithm : {algo}")
    print("-" * 29)