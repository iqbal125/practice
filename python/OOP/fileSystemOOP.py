class Node:
    """Base class for file system nodes."""
    def __init__(self, name):
        self.name = name


class File(Node):
    """Represents a file, which just stores content."""
    def __init__(self, name, content):
        super().__init__(name)
        self.content = content


class Directory(Node):
    """Represents a directory, containing child files/directories."""
    def __init__(self, name):
        super().__init__(name)
        self.children = {}  # dict: name → Node

    def get_child(self, name):
        return self.children.get(name)

    def add_child(self, node):
        self.children[node.name] = node


class FileSystem:
    def __init__(self):
        self.root = Directory("/")

    # ---------------------------------------------------
    # Helper: navigate to a directory and return (dir_node, last_token)
    # ---------------------------------------------------
    def _traverse(self, path):
        """
        Traverse the path and return the directory that should contain
        the final item, and the last token (file or directory name).
        """
        tokens = [p for p in path.split("/") if p]

        node = self.root
        for token in tokens[:-1]:   # all but final
            child = node.get_child(token)
            if child is None:
                # auto-create directories for CREATE_FILE
                new_dir = Directory(token)
                node.add_child(new_dir)
                child = new_dir
            if isinstance(child, File):
                return None, None  # folder expected, got file
            node = child

        return node, tokens[-1] if tokens else ""

    # ---------------------------------------------------
    # CREATE_FILE
    # ---------------------------------------------------
    def create_file(self, path, content):
        dir_node, filename = self._traverse(path)
        if dir_node is None:
            return  # invalid path
        dir_node.children[filename] = File(filename, content)

    # ---------------------------------------------------
    # READ_FILE
    # ---------------------------------------------------
    def read_file(self, path):
        dir_node, filename = self._traverse(path)
        if dir_node is None:
            return "FILE_NOT_FOUND"
        file = dir_node.get_child(filename)
        if file is None or not isinstance(file, File):
            return "FILE_NOT_FOUND"
        return file.content


# ---------------------------------------------------
# Command Processor (same interface as your original)
# ---------------------------------------------------
def process_operations(ops):
    fs = FileSystem()
    output = []

    for op in ops:
        parts = op.split(" ")
        cmd = parts[0]

        if cmd == "CREATE_FILE":
            path = parts[1]
            content = parts[2]
            fs.create_file(path, content)

        elif cmd == "READ_FILE":
            path = parts[1]
            output.append(fs.read_file(path))

    return output


# Test
ops = [
    "CREATE_FILE /notes/dir1/todo.txt buy_milk",
    "READ_FILE /notes/todo.txt",
    "READ_FILE /notes/missing.txt",
    "CREATE_FILE /notes/todo.txt overwrite",
]

print(process_operations(ops))
