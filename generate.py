import random

from solve import solve
from square import Square


class SearchError(Exception):
    pass

def random_letter(dictionary):
    return random.choice(dictionary.letters)

def generate_square(dictionary):
    size = 4
    min_words = 30
    max_words = 60
    min_longest = 7
    base = ''
    base_solve = {}
    while True:
        try:
            base_solve = {}
            base = ''
            while len(base_solve) < min_words or len(base_solve) > max_words or len(max(base_solve, key=len)) < min_longest:
                base = "-".join(["".join([random_letter(dictionary) for _ in range(size)]) for _ in range(size)])
                base_square = Square(base)
                base_solve = solve(dictionary, base_square)

            base_len = len(base_solve)
            for _ in range(3):
                for i in range(16):
                    index = i + int(i / 4)
                    tmp = list(base)
                    tmp[index] = '#'
                    tmp = ''.join(tmp)
                    tmp_square = Square(tmp)
                    tmp_solve = solve(dictionary, tmp_square)
                    tmp = base
                    k = 0
                    while len(tmp_solve) == base_len:
                        k += 1
                        if k > 100:
                            raise SearchError(f'unused: {index}')
                        tmp = list(base)
                        tmp[index] = random_letter(dictionary)
                        tmp = ''.join(tmp)
                        tmp_square = Square(tmp)
                        tmp_solve = solve(dictionary, tmp_square)
                    if base != tmp:
                        base = tmp
                        base_solve = tmp_solve
                        base_len = len(base_solve)
            if len(base_solve) < min_words or len(base_solve) > max_words or len(
                    max(base_solve, key=len)) < min_longest:
                raise SearchError(f'not enough words: {len(base_solve)}, retry')
            for i in range(16):
                index = i + int(i / 4)
                tmp = list(base)
                tmp[index] = '#'
                tmp = ''.join(tmp)
                tmp_square = Square(tmp)
                tmp_solve = solve(dictionary, tmp_square)
                if len(tmp_solve) == base_len:
                    raise SearchError(f'unused: {index}, retry')
            break
        except SearchError as e:
            # print(e)
            continue
    # print(base, base_solve)
    base_square = Square(base)
    words_info = solve(dictionary, base_square, True)
    return {
        'square': base,
        'words': list(sorted(base_solve)),
        'words_info': words_info,
        'size': size,
    }
