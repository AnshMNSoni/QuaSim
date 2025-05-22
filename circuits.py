import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Rectangle, Circle, Polygon, Arc, Ellipse, PathPatch
from matplotlib.path import Path
import matplotlib.patheffects as path_effects

class Gate:
    def __init__(self, gate_type, position, inputs=None, label=None):
        self.gate_type = gate_type  # AND, OR, NOT, XOR, etc.
        self.position = position    # (x, y) position
        self.inputs = inputs or []  # List of input connections (gate_id, output_idx) or None for external inputs
        self.label = label          # Optional label for the gate
        self.width = 2              # Width of the gate
        self.height = 1.5           # Height of the gate
        self.output_positions = []  # Will be calculated when drawn

    def evaluate(self, input_values):
        """Evaluate the gate with the given input values."""
        if self.gate_type == "AND":
            return int(all(input_values))
        elif self.gate_type == "OR":
            return int(any(input_values))
        elif self.gate_type == "NOT":
            return int(not input_values[0])
        elif self.gate_type == "XOR":
            return int(sum(input_values) % 2 == 1)
        elif self.gate_type == "XNOR":
            return int(sum(input_values) % 2 == 0)
        elif self.gate_type == "NAND":
            return int(not all(input_values))
        elif self.gate_type == "NOR":
            return int(not any(input_values))
        return None

class Circuit:
    def __init__(self):
        self.gates = {}        # Dictionary of gates {id: Gate}
        self.inputs = []       # List of input positions [(x, y)]
        self.outputs = []      # List of output connections (gate_id, output_idx)
        self.connections = []  # List of connections [(from_gate_id, to_gate_id, from_output_idx, to_input_idx)]
        self.next_gate_id = 0  # Counter for generating gate IDs

    def add_gate(self, gate_type, position, inputs=None, label=None):
        """Add a gate to the circuit."""
        gate_id = self.next_gate_id
        self.gates[gate_id] = Gate(gate_type, position, inputs, label)
        self.next_gate_id += 1
        return gate_id

    def add_connection(self, from_gate_id, to_gate_id, from_output_idx=0, to_input_idx=0):
        """Add a connection between gates."""
        self.connections.append((from_gate_id, to_gate_id, from_output_idx, to_input_idx))
        # Update the inputs of the destination gate
        if to_gate_id in self.gates:
            while len(self.gates[to_gate_id].inputs) <= to_input_idx:
                self.gates[to_gate_id].inputs.append(None)
            self.gates[to_gate_id].inputs[to_input_idx] = (from_gate_id, from_output_idx)

    def add_input(self, position, gate_id, input_idx=0):
        """Add an external input to the circuit."""
        self.inputs.append(position)
        input_id = len(self.inputs) - 1
        # Update the inputs of the gate
        if gate_id in self.gates:
            while len(self.gates[gate_id].inputs) <= input_idx:
                self.gates[gate_id].inputs.append(None)
            self.gates[gate_id].inputs[input_idx] = (None, input_id)

    def add_output(self, gate_id, output_idx=0):
        """Add an output from the circuit."""
        self.outputs.append((gate_id, output_idx))

    def evaluate(self, input_values):
        """Evaluate the circuit with the given input values."""
        # Dictionary to store the output of each gate
        gate_outputs = {}
        
        # Function to recursively evaluate a gate
        def evaluate_gate(gate_id):
            if gate_id in gate_outputs:
                return gate_outputs[gate_id]
            
            gate = self.gates[gate_id]
            input_vals = []
            
            for input_conn in gate.inputs:
                if input_conn is None:
                    # External input not connected
                    input_vals.append(0)
                elif input_conn[0] is None:
                    # External input
                    input_idx = input_conn[1]
                    if input_idx < len(input_values):
                        input_vals.append(input_values[input_idx])
                    else:
                        input_vals.append(0)
                else:
                    # Gate input
                    from_gate_id, from_output_idx = input_conn
                    from_gate_output = evaluate_gate(from_gate_id)
                    input_vals.append(from_gate_output)
            
            output = gate.evaluate(input_vals)
            gate_outputs[gate_id] = output
            return output
        
        # Evaluate all output gates
        outputs = []
        for gate_id, output_idx in self.outputs:
            outputs.append(evaluate_gate(gate_id))
        
        return outputs

class LogicGate:
    def __init__(self, name, function, symbol):
        self.name = name
        self.function = function
        self.symbol = symbol

def AND(inputs):
    return int(all(inputs))

def OR(inputs):
    return int(any(inputs))

def NOT(inputs):
    # NOT gate only takes one input
    return int(not inputs[0])

def XOR(inputs):
    return int(sum(inputs) % 2 == 1)

def XNOR(inputs):
    return int(sum(inputs) % 2 == 0)

def NAND(inputs):
    return int(not all(inputs))

def NOR(inputs):
    return int(not any(inputs))

def draw_and_gate(ax, x, y, width, height, color='blue'):
    """Draw an AND gate."""
    # Create the path for the AND gate
    verts = [
        (x, y - height/2),  # Start at bottom left
        (x, y + height/2),  # Line to top left
        (x + width*0.7, y + height/2),  # Line to top right
        (x + width*0.7, y - height/2),  # Line to bottom right
        (x, y - height/2),  # Close the path
    ]
    
    codes = [Path.MOVETO, Path.LINETO, Path.LINETO, Path.LINETO, Path.CLOSEPOLY]
    
    path = Path(verts, codes)
    patch = PathPatch(path, facecolor='white', edgecolor=color, lw=1.5)
    ax.add_patch(patch)
    
    # Add the curved part
    arc = Arc((x + width*0.7, y), height, height, 
              theta1=270, theta2=90, 
              lw=1.5, color=color)
    ax.add_patch(arc)
    
    # Return the output position
    return (x + width, y)

def draw_or_gate(ax, x, y, width, height, color='blue'):
    """Draw an OR gate."""
    # Create the curved input side
    arc1 = Arc((x + width*0.3, y), width*0.6, height, 
              theta1=270, theta2=90, 
              lw=1.5, color=color)
    ax.add_patch(arc1)
    
    # Create the curved output side
    arc2 = Arc((x - width*0.2, y), width*1.4, height, 
              theta1=270, theta2=90, 
              lw=1.5, color=color)
    ax.add_patch(arc2)
    
    # Connect the arcs at top and bottom
    ax.plot([x - width*0.2, x + width*0.3], [y - height/2, y - height/2], color=color, lw=1.5)
    ax.plot([x - width*0.2, x + width*0.3], [y + height/2, y + height/2], color=color, lw=1.5)
    
    # Return the output position
    return (x + width, y)

def draw_not_gate(ax, x, y, width, height, color='blue'):
    """Draw a NOT gate (triangle with circle)."""
    # Create the triangle
    triangle = Polygon([(x, y - height/2), (x, y + height/2), (x + width*0.7, y)], 
                       facecolor='white', edgecolor=color, lw=1.5)
    ax.add_patch(triangle)
    
    # Add the bubble
    bubble_radius = height/6
    bubble = Circle((x + width*0.7 + bubble_radius), y, radius=bubble_radius, 
                   facecolor='white', edgecolor=color, lw=1.5)
    ax.add_patch(bubble)
    
    # Return the output position
    return (x + width, y)

def draw_xor_gate(ax, x, y, width, height, color='blue'):
    """Draw an XOR gate."""
    # First draw the OR gate
    draw_or_gate(ax, x, y, width, height, color)
    
    # Add the extra curve for XOR
    arc = Arc((x - width*0.1, y), width*0.2, height, 
              theta1=270, theta2=90, 
              lw=1.5, color=color)
    ax.add_patch(arc)
    
    # Return the output position
    return (x + width, y)

def draw_nand_gate(ax, x, y, width, height, color='blue'):
    """Draw a NAND gate."""
    # Draw the AND gate
    draw_and_gate(ax, x, y, width*0.8, height, color)
    
    # Add the bubble
    bubble_radius = height/6
    bubble = Circle((x + width*0.8 + bubble_radius), y, radius=bubble_radius, 
                   facecolor='white', edgecolor=color, lw=1.5)
    ax.add_patch(bubble)
    
    # Return the output position
    return (x + width, y)

def draw_nor_gate(ax, x, y, width, height, color='blue'):
    """Draw a NOR gate."""
    # Draw the OR gate
    draw_or_gate(ax, x, y, width*0.8, height, color)
    
    # Add the bubble
    bubble_radius = height/6
    bubble = Circle((x + width*0.8 + bubble_radius), y, radius=bubble_radius, 
                   facecolor='white', edgecolor=color, lw=1.5)
    ax.add_patch(bubble)
    
    # Return the output position
    return (x + width, y)

def draw_xnor_gate(ax, x, y, width, height, color='blue'):
    """Draw an XNOR gate."""
    # Draw the XOR gate
    draw_xor_gate(ax, x, y, width*0.8, height, color)
    
    # Add the bubble
    bubble_radius = height/6
    bubble = Circle((x + width*0.8 + bubble_radius), y, radius=bubble_radius, 
                   facecolor='white', edgecolor=color, lw=1.5)
    ax.add_patch(bubble)
    
    # Return the output position
    return (x + width, y)

def draw_gate(ax, gate, color='blue'):
    """Draw a gate based on its type."""
    x, y = gate.position
    width, height = gate.width, gate.height
    
    if gate.gate_type == "AND":
        output_pos = draw_and_gate(ax, x, y, width, height, color)
    elif gate.gate_type == "OR":
        output_pos = draw_or_gate(ax, x, y, width, height, color)
    elif gate.gate_type == "NOT":
        output_pos = draw_not_gate(ax, x, y, width, height, color)
    elif gate.gate_type == "XOR":
        output_pos = draw_xor_gate(ax, x, y, width, height, color)
    elif gate.gate_type == "NAND":
        output_pos = draw_nand_gate(ax, x, y, width, height, color)
    elif gate.gate_type == "NOR":
        output_pos = draw_nor_gate(ax, x, y, width, height, color)
    elif gate.gate_type == "XNOR":
        output_pos = draw_xnor_gate(ax, x, y, width, height, color)
    else:
        # Default to a simple rectangle
        rect = Rectangle((x, y - height/2), width, height, 
                        facecolor='white', edgecolor=color, lw=1.5)
        ax.add_patch(rect)
        output_pos = (x + width, y)
    
    # Store the output position
    gate.output_positions = [output_pos]
    
    # Add label if provided
    if gate.label:
        ax.text(x + width/2, y + height/2 + 0.3, gate.label, 
                ha='center', va='center', fontsize=10, color=color)
    
    return output_pos

def draw_circuit(circuit, fig_width=12, fig_height=8):
    """Draw the complete circuit."""
    fig, ax = plt.subplots(figsize=(fig_width, fig_height))
    
    # Set axis limits based on gate positions
    min_x, max_x = float('inf'), float('-inf')
    min_y, max_y = float('inf'), float('-inf')
    
    for gate in circuit.gates.values():
        x, y = gate.position
        min_x = min(min_x, x)
        max_x = max(max_x, x + gate.width)
        min_y = min(min_y, y - gate.height/2)
        max_y = max(max_y, y + gate.height/2)
    
    for x, y in circuit.inputs:
        min_x = min(min_x, x)
        max_x = max(max_x, x)
        min_y = min(min_y, y)
        max_y = max(max_y, y)
    
    # Add some padding
    padding = 2
    ax.set_xlim(min_x - padding, max_x + padding)
    ax.set_ylim(min_y - padding, max_y + padding)
    
    # Remove axis ticks
    ax.set_xticks([])
    ax.set_yticks([])
    
    # Draw gates
    for gate_id, gate in circuit.gates.items():
        draw_gate(ax, gate, color='blue')
    
    # Draw inputs
    for i, (x, y) in enumerate(circuit.inputs):
        # Draw input point
        circle = Circle((x, y), 0.1, facecolor='black', edgecolor='blue', lw=1.5)
        ax.add_patch(circle)
        
        # Add input label
        ax.text(x - 0.5, y, f"Input {i+1}", ha='right', va='center', fontsize=10)
    
    # Draw connections
    for from_gate_id, to_gate_id, from_output_idx, to_input_idx in circuit.connections:
        if from_gate_id in circuit.gates and to_gate_id in circuit.gates:
            from_gate = circuit.gates[from_gate_id]
            to_gate = circuit.gates[to_gate_id]
            
            if from_output_idx < len(from_gate.output_positions):
                from_pos = from_gate.output_positions[from_output_idx]
                to_pos = (to_gate.position[0], to_gate.position[1])
                
                # Draw connection line
                ax.plot([from_pos[0], to_pos[0]], [from_pos[1], to_pos[1]], 'blue', lw=1.5)
    
    # Draw connections from inputs to gates
    for gate_id, gate in circuit.gates.items():
        for i, input_conn in enumerate(gate.inputs):
            if input_conn is not None and input_conn[0] is None:
                # External input
                input_idx = input_conn[1]
                if input_idx < len(circuit.inputs):
                    input_pos = circuit.inputs[input_idx]
                    gate_input_pos = (gate.position[0], gate.position[1])
                    
                    # Draw connection line
                    ax.plot([input_pos[0], gate_input_pos[0]], [input_pos[1], gate_input_pos[1]], 'blue', lw=1.5)
    
    # Draw outputs
    for i, (gate_id, output_idx) in enumerate(circuit.outputs):
        if gate_id in circuit.gates:
            gate = circuit.gates[gate_id]
            if output_idx < len(gate.output_positions):
                output_pos = gate.output_positions[output_idx]
                
                # Draw output line
                ax.plot([output_pos[0], output_pos[0] + 1], [output_pos[1], output_pos[1]], 'blue', lw=1.5)
                
                # Add output label
                ax.text(output_pos[0] + 1.5, output_pos[1], f"Output {i+1}", ha='left', va='center', fontsize=10)
    
    plt.title("Logic Circuit Diagram", fontsize=14)
    plt.tight_layout()
    plt.show()

def create_example_circuit():
    """Create an example circuit similar to the one in the image."""
    circuit = Circuit()
    
    # Add gates
    not_gate = circuit.add_gate("NOT", (2, 4), label="NOT")
    and_gate1 = circuit.add_gate("AND", (5, 4), label="AND")
    and_gate2 = circuit.add_gate("AND", (5, 2), label="AND")
    or_gate = circuit.add_gate("OR", (8, 3), label="OR")
    
    # Add inputs
    circuit.add_input((1, 4), not_gate, 0)  # Input to NOT gate
    circuit.add_input((1, 2), and_gate2, 0)  # Direct input to second AND gate
    
    # Add connections between gates
    circuit.add_connection(not_gate, and_gate1, 0, 0)  # NOT output to AND1 input
    circuit.add_connection(not_gate, and_gate2, 0, 1)  # NOT output to AND2 input
    circuit.add_connection(and_gate1, or_gate, 0, 0)   # AND1 output to OR input
    circuit.add_connection(and_gate2, or_gate, 0, 1)   # AND2 output to OR input
    
    # Add output
    circuit.add_output(or_gate, 0)
    
    return circuit

def create_custom_circuit():
    """Allow the user to create a custom circuit."""
    circuit = Circuit()
    
    print("\nCreating a custom circuit:")
    print("You'll add gates, inputs, and connections to build your circuit.")
    
    # Add gates
    while True:
        print("\nAvailable gate types:")
        gate_types = ["AND", "OR", "NOT", "XOR", "XNOR", "NAND", "NOR"]
        for i, gate_type in enumerate(gate_types, 1):
            print(f"{i}. {gate_type}")
        
        try:
            choice = input("\nSelect a gate type to add (or 'done' to finish adding gates): ")
            if choice.lower() == 'done':
                break
            
            gate_idx = int(choice) - 1
            if gate_idx < 0 or gate_idx >= len(gate_types):
                print("Invalid choice. Please try again.")
                continue
            
            gate_type = gate_types[gate_idx]
            
            x = float(input(f"Enter x position for the {gate_type} gate: "))
            y = float(input(f"Enter y position for the {gate_type} gate: "))
            label = input("Enter a label for the gate (optional, press Enter to skip): ")
            
            if not label:
                label = None
            
            gate_id = circuit.add_gate(gate_type, (x, y), label=label)
            print(f"Added {gate_type} gate with ID {gate_id}")
            
        except ValueError:
            print("Invalid input. Please enter a number.")
        except Exception as e:
            print(f"An error occurred: {e}")
    
    # Add inputs
    while True:
        try:
            choice = input("\nDo you want to add an input? (y/n): ")
            if choice.lower() != 'y':
                break
            
            x = float(input("Enter x position for the input: "))
            y = float(input("Enter y position for the input: "))
            
            print("\nAvailable gates:")
            for gate_id, gate in circuit.gates.items():
                print(f"{gate_id}. {gate.gate_type} gate at position {gate.position}")
            
            gate_id = int(input("Enter the ID of the gate to connect this input to: "))
            if gate_id not in circuit.gates:
                print("Invalid gate ID. Please try again.")
                continue
            
            input_idx = int(input("Enter the input index of the gate (0 for first input, 1 for second, etc.): "))
            
            circuit.add_input((x, y), gate_id, input_idx)
            print(f"Added input at position ({x}, {y}) connected to gate {gate_id}")
            
        except ValueError:
            print("Invalid input. Please enter a number.")
        except Exception as e:
            print(f"An error occurred: {e}")
    
    # Add connections between gates
    while True:
        try:
            choice = input("\nDo you want to add a connection between gates? (y/n): ")
            if choice.lower() != 'y':
                break
            
            print("\nAvailable gates:")
            for gate_id, gate in circuit.gates.items():
                print(f"{gate_id}. {gate.gate_type} gate at position {gate.position}")
            
            from_gate_id = int(input("Enter the ID of the source gate: "))
            if from_gate_id not in circuit.gates:
                print("Invalid gate ID. Please try again.")
                continue
            
            to_gate_id = int(input("Enter the ID of the destination gate: "))
            if to_gate_id not in circuit.gates:
                print("Invalid gate ID. Please try again.")
                continue
            
            from_output_idx = int(input("Enter the output index of the source gate (usually 0): "))
            to_input_idx = int(input("Enter the input index of the destination gate (0 for first input, 1 for second, etc.): "))
            
            circuit.add_connection(from_gate_id, to_gate_id, from_output_idx, to_input_idx)
            print(f"Added connection from gate {from_gate_id} to gate {to_gate_id}")
            
        except ValueError:
            print("Invalid input. Please enter a number.")
        except Exception as e:
            print(f"An error occurred: {e}")
    
    # Add outputs
    while True:
        try:
            choice = input("\nDo you want to add an output? (y/n): ")
            if choice.lower() != 'y':
                break
            
            print("\nAvailable gates:")
            for gate_id, gate in circuit.gates.items():
                print(f"{gate_id}. {gate.gate_type} gate at position {gate.position}")
            
            gate_id = int(input("Enter the ID of the gate to use as output: "))
            if gate_id not in circuit.gates:
                print("Invalid gate ID. Please try again.")
                continue
            
            output_idx = int(input("Enter the output index of the gate (usually 0): "))
            
            circuit.add_output(gate_id, output_idx)
            print(f"Added output from gate {gate_id}")
            
        except ValueError:
            print("Invalid input. Please enter a number.")
        except Exception as e:
            print(f"An error occurred: {e}")
    
    return circuit

def main():
    print("Welcome to the Advanced Logic Circuit Builder!")
    print("This tool allows you to create and visualize complex logic circuits with multiple gates.")
    
    while True:
        try:
            print("\nOptions:")
            print("1. Create an example circuit (similar to the image)")
            print("2. Create a custom circuit")
            print("3. Exit")
            
            choice = input("\nSelect an option: ")
            
            if choice == '1':
                # Create and draw an example circuit
                circuit = create_example_circuit()
                print("\nDrawing the example circuit...")
                draw_circuit(circuit)
                
                # Option to test the circuit
                test_choice = input("\nWould you like to test the circuit with inputs? (y/n): ").lower()
                if test_choice == 'y':
                    num_inputs = len(circuit.inputs)
                    inputs = []
                    for i in range(num_inputs):
                        bit = int(input(f"Enter value for Input {i+1} (0 or 1): "))
                        if bit not in [0, 1]:
                            print("Invalid input. Using 0 as default.")
                            bit = 0
                        inputs.append(bit)
                    
                    # Evaluate the circuit
                    outputs = circuit.evaluate(inputs)
                    print("\nCircuit Outputs:")
                    for i, output in enumerate(outputs):
                        print(f"Output {i+1}: {output}")
                
            elif choice == '2':
                # Create and draw a custom circuit
                circuit = create_custom_circuit()
                print("\nDrawing your custom circuit...")
                draw_circuit(circuit)
                
                # Option to test the circuit
                test_choice = input("\nWould you like to test the circuit with inputs? (y/n): ").lower()
                if test_choice == 'y':
                    num_inputs = len(circuit.inputs)
                    inputs = []
                    for i in range(num_inputs):
                        bit = int(input(f"Enter value for Input {i+1} (0 or 1): "))
                        if bit not in [0, 1]:
                            print("Invalid input. Using 0 as default.")
                            bit = 0
                        inputs.append(bit)
                    
                    # Evaluate the circuit
                    outputs = circuit.evaluate(inputs)
                    print("\nCircuit Outputs:")
                    for i, output in enumerate(outputs):
                        print(f"Output {i+1}: {output}")
                
            elif choice == '3':
                print("Thank you for using the Advanced Logic Circuit Builder. Goodbye!")
                break
                
            else:
                print("Invalid choice. Please try again.")
                
        except ValueError:
            print("Invalid input. Please enter a number.")
        except Exception as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
