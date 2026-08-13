text = "HELLO"
pattern = "LL"

n = len(text)
m = len(pattern)

print("Pattern found at positions:")

for i in range(n - m + 1):
    if text[i:i + m] == pattern:
        print(i)