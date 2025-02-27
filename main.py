import json
import random

from dictionary import Dictionary
from generate import generate_square
from solve import solve
from square import Square

lang = 'sv'
dictionary = Dictionary(lang)


def main():
    res = generate_square(dictionary)
    res['wordsInfo'] = res['words_info']
    del res['words_info']
    print(json.dumps(res, ensure_ascii=False,))
    # with open('game.txt', 'r') as f:
    #     square_inp = f.readlines()[0]
    #     square = Square(square_inp)
    #
    # solve(dictionary, square)

if __name__ == '__main__':
    main()