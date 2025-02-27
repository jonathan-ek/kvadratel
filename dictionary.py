import pickle
from typing import List, Optional

letters = {"en": "abcdefghijklmnopqrstuvwxyz", "sv": "abcdefghijklmnopqrstuvwxyzåäö"}
files = {"en": "lib/en.txt", "sv": "lib/sv.txt"}

class Dictionary:
    class TrieNode:
        def __init__(self, length):
            self.children: List[Optional[Dictionary.TrieNode]] = [None] * length
            self.is_end_of_word = False

    def __init__(self, lang):
        self.lang = lang
        self.letters = letters[lang]
        # Load from pickle if exists
        try:
            self.root = pickle.load(open(f"lib/dictionary_{lang}.pkl", "rb"))
        except FileNotFoundError:
            self.root = Dictionary.TrieNode(len(self.letters))
            with open(files[lang], 'r') as f:
                while line := f.readline():
                    self.insert(line.strip())
            pickle.dump(self.root, open(f"lib/dictionary_{lang}.pkl", "wb"))


    def insert(self, key):
        curr = self.root
        for c in key:
            index = self.letters.index(c)
            if curr.children[index] is None:
                new_node = Dictionary.TrieNode(len(self.letters))
                curr.children[index] = new_node
            curr = curr.children[index]
        curr.is_end_of_word = True

    def search(self, key):
        curr = self.root
        for c in key:
            index = self.letters.index(c)
            if curr.children[index] is None:
                return False
            curr = curr.children[index]
        return curr.is_end_of_word
