
def solve(dictionary, square, freq=False):
    words = set()
    words_info = {}
    for i in range(square.size):
        for j in range(square.size):
            try:
                index = dictionary.letters.index(square.grid[i][j])
            except ValueError:
                continue
            if dictionary.root.children[index]:
                find_words(dictionary, dictionary.root.children[index], square, i, j, square.grid[i][j], words, words_info, ((i, j), ))
    # print("\n".join(sorted(words)), f'\n{len(words)}')
    if freq:
        return words_info
    return words

def convert_visited_to_list_of_visited_positions(visited):
    visited_positions = []
    for i in range(len(visited)):
        for j in range(len(visited[0])):
            if visited[i][j]:
                visited_positions.append((i, j))
    return visited_positions

def find_words(dictionary, node, square, i, j, word, words, words_info, path):
    if node.is_end_of_word:
        if word not in words:
            words_info[word] = path
        words.add(word)
    for x, y in square.neighbors[(i, j)]:
        if (x, y) in path:
            continue
        try:
            index = dictionary.letters.index(square.grid[x][y])
        except ValueError:
            continue
        if node.children[index]:
            # clone visited
            find_words(dictionary, node.children[index], square, x, y, word + square.grid[x][y], words, words_info, (*path, (x, y)))