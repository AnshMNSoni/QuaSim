from qiskit import QuantumCircuit, Aer, execute
import matplotlib.pyplot as plt
from qiskit.visualization import plot_bloch_multivector, plot_histogram
from sympy import pretty_print
from rich.console import Console
import time, pyfiglet


def wait():
    print("Next in:", end=" ", flush=True) 
    for i in range(5, 0, -1):
        time.sleep(1)
        print(i, end=" ", flush=True)
    print("\n")


def find(quantum_circuit):    
    try:
        while True:
            Console().clear()
            print(ascii_art)
        
            print("Choose:\n1. Bloch Sphere Visualization\n2. Histogram\n3. Operator\n4. Circuit Visualization\n5. Measurement Circuit\n6. Goto Gate Selection")
        
            user_find = int(input("Enter your choice: "))
            
            if(user_find == 1):
                backend = Aer.get_backend('statevector_simulator')
                result = execute(quantum_circuit, backend).result().get_statevector(quantum_circuit)
                plot_bloch_multivector(result)
                plt.show()
                wait()
            
            elif(user_find == 2):
                quantum_circuit.measure_all()
                backend = Aer.get_backend('qasm_simulator')
                result = execute(quantum_circuit, backend, shots=1000).result().get_counts(quantum_circuit)
                plot_histogram(result)
                plt.show()
                wait()
            
            elif(user_find == 3):
                backend = Aer.get_backend('unitary_simulator')
                result = execute(quantum_circuit, backend).result().get_unitary(quantum_circuit, decimals=3)
                pretty_print(result)
                wait()
                
                
            elif(user_find == 4):
                quantum_circuit.draw('mpl')
                plt.show()
                wait()
            
            elif(user_find == 5):
                quantum_circuit.measure_all()
                quantum_circuit.draw('mpl')
                plt.show()
                wait()
                
            elif(user_find == 6):
                break
            
            else:
                print("Enter Valid Input!")
                wait()
                
    except ValueError:
        Console().clear()
        print(ascii_art)
        
        print("Enter Valid Input!")

        
ascii_art = pyfiglet.figlet_format("QISKIT")

while True:
    try:
        Console().clear()
        
        print(ascii_art)
        
        print("Choose Gate:\n1. Pauli's X Gate\n2. Pauli's Y Gate\n3. Pauli's Z Gate\n4. Exit")
        gate = int(input("Enter your choice: "))
        
        if(gate == 4):
            print("Exiting...")
            time.sleep(2)
            break
        
        if(gate == 5):
            Console().clear()
            print(ascii_art)
            
            print("Enter Valid Input!")
            wait()

        qr = int(input("Enter the number of qubits: "))    
        qc = QuantumCircuit(qr)
        
        if(qr == 0):
            Console().clear()
            print(ascii_art)
            
            print("Note: Number of qubits cannot be 0")
            wait()
        
        if(gate == 1):
            measure = int(input("Enter the qubit on which you want to apply X Gate: "))
            if(measure <= qr):
                qc.x(measure)
                find(qc)
            else:
                Console().clear()
                print(ascii_art)
                
                print(f"Note! Number of qubits must <= {measure}")
                wait()
        
        elif(gate == 2):
            measure = int(input("Enter the qubit on which you want to apply Y Gate: "))
            if(measure <= qr):
                qc.y(measure)
                find(qc)
            else:
                Console().clear()
                print(ascii_art)
                
                print(f"Note! Number of qubits must <= {measure}")
                wait()
        
        elif(gate == 3):
            measure = int(input("Enter the qubit on which you want to apply Z Gate: "))
            if(measure <= qr):
                qc.z(measure)
                find(qc)
            else:
                Console().clear()
                print(ascii_art)
                
                print(f"Note! Number of qubits must <= {measure}")
                wait()
            
    except ValueError:
        Console().clear()
        print(ascii_art)
        
        print("Enter Valid Input!")