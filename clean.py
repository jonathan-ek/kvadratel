def main():
    files = [
        ('lib/SAOL.csv', 'lib/sv.txt', "abcdefghijklmnopqrstuvwxyzåäö"),
        ('lib/words.txt', 'lib/en.txt', "abcdefghijklmnopqrstuvwxyz"),
    ]
    for in_file, out_file, letters in files:
        with open(in_file, 'r') as f:
            with open(out_file, 'w') as f_out:
                while line := f.readline():
                    if '|' in line:
                        line = line.split('|')[0] + '\n'
                    has_special_char = False
                    for char in line.strip():
                        if char not in letters:
                            has_special_char = True
                            break
                    if has_special_char:
                        continue
                    if line.lower() != line:
                        continue
                    if len(line.strip()) < 4 or len(line.strip()) > 16:
                        continue
                    f_out.write(line)


if __name__ == '__main__':
    main()