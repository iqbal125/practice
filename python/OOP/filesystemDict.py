def process_operations(ops):
    fs = {}

    for item in ops:
        parsedArr = item.split(" ")
        cmd = parsedArr[0]

        if cmd == "CREATE_FILE":
            path = parsedArr[1]
            content = parsedArr[2]

            tokens = [p for p in path.split("/") if p]
   
            node = fs
            for folder in tokens[:-1]:
                if folder not in node:
                    node[folder] = {}
                if isinstance(node[folder], str):
                    node = None
                    break
                node = node[folder]



    pass




ops = [
    "CREATE_FILE /notes/dir1/todo.txt buy_milk",
    "READ_FILE /notes/todo.txt",
    "READ_FILE /notes/missing.txt",
    "CREATE_FILE /notes/todo.txt overwrite",
]

print(process_operations(ops))