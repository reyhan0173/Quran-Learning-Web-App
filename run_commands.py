import subprocess

def run_commands_from_file(filename):
    with open(filename, 'r') as file:
        for line in file:
            command = line.strip()
            if command:
                try:
                    print(f"Running command: {command}")
                    result = subprocess.run(command, shell=True, check=True, text=True)
                    print(result.stdout)
                except subprocess.CalledProcessError as e:
                    print(f"Error running command '{command}': {e}")

if __name__ == "__main__":
    run_commands_from_file('installedPackages.txt')
