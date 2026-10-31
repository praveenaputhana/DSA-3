def preprocess_text(text):
    text = text.lower()

    punctuation = ".,!?;:()[]{}\"'"

    for symbol in punctuation:
        text = text.replace(symbol, "")

    return text.split()


def search_words(words, query):
    results = []

    for i, word in enumerate(words):
        if query.lower() in word:
            results.append(i)

    return results


text = input("Enter text: ")

words = preprocess_text(text)

print("\n========== PROCESSED TEXT ==========")
print(words)

query = input("\nEnter search word: ")

positions = search_words(words, query)

print("\n========== SEARCH RESULT ==========")

if positions:
    print("Word found at positions:", positions)
else:
    print("Word not found.")