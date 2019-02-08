import React from "react";
import ReactDOM from "react-dom";

class Cell extends React.Component {
  render() {
    return (
      <td className="square"
        style={{
          backgroundColor: (this.props.alive ? "black" : "white"),
          // TODO define sizes somewhere else?
          width: "10px",
          height: "10px",
          border: "solid gray 1px"
        }}
      />
    );
  }
}

class Grid extends React.Component {
  /* This is just a grid representation component.
  The source of truth is located in `Game` component. */
  render() {
    return (
      <table style={{borderCollapse: "collapse"}}>
        <tbody>
          {this.props.cells.map((row, row_i) => (
            <tr className="grid_row" key={`${row_i}`}>
              {row.map((cell_val, column_i) => (
                <Cell alive={cell_val} key={`${row_i}:${column_i}`}/>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

class Game extends React.Component {
  // TODO implement using Redux?
  constructor (props) {
    super(props);
    this.state = {
      // TODO replace with 1D?
      cells: props.cells, // A 2D array of bool.
    };
    this.generation_num = 0;
    this.frequency = "frequency" in props ? props.frequency : 2;  // In seconds
    this.grid_height = props.cells.length;
    this.grid_width = props.cells[0].length;
    this.next_gen_cells = [];
    this.next_gen_cells.length = this.grid_height;
    for (let row_i = 0; row_i < this.next_gen_cells.length; row_i++) {
      let new_row = []; new_row.length = this.grid_width;
      new_row.fill(false, 0, new_row.length);
      this.next_gen_cells[row_i] = new_row;
    }
  }

  cell_is_alive(row_i, column_i) {
    if (row_i < 0 || row_i >= this.grid_height ||
      column_i < 0 || column_i >= this.grid_width) {
      return false;
    }
    if (this.state.cells[row_i][column_i] === false) {
      return false;
    }
    return true;
  }

  cell_get_num_neighbors (row_i, column_i) { 
    let num_neighbors = 0;
    if (this.cell_is_alive(row_i - 1, column_i - 1)) num_neighbors++;
    if (this.cell_is_alive(row_i - 1, column_i)) num_neighbors++;
    if (this.cell_is_alive(row_i - 1, column_i + 1)) num_neighbors++;
    if (this.cell_is_alive(row_i, column_i - 1)) num_neighbors++;
    if (this.cell_is_alive(row_i, column_i + 1)) num_neighbors++;
    if (this.cell_is_alive(row_i + 1, column_i - 1)) num_neighbors++;
    if (this.cell_is_alive(row_i + 1, column_i)) num_neighbors++;
    if (this.cell_is_alive(row_i + 1, column_i + 1)) num_neighbors++;
    return num_neighbors;
  }

  step () {
    // TODO calculate the next step before the time has passed
    // TODO only calcualte cells whose neighbours have changed.

    // Copy the from the old state.
    // You can't just `this.next_gen_cells = this.state.cells.slice()`, as this is
    // a shallow copy.
    for (let row_i = 0; row_i < this.next_gen_cells.length; row_i++) {
      this.next_gen_cells[row_i] = this.state.cells[row_i].slice();
    }

    // TODO these forEach(..., this) are ugly.
    this.state.cells.forEach((row, row_i) => {
      row.forEach((curr_cell_alive, column_i) => {
        // Now, the actual game logic
        let num_neighbors = this.cell_get_num_neighbors(row_i, column_i);
        if (
          num_neighbors === 3 ||
          (num_neighbors === 2 && curr_cell_alive)
        ) {
          this.next_gen_cells[row_i][column_i] = true;
        } else {
          this.next_gen_cells[row_i][column_i] = false;
        }
      }, this);
    }, this);
    // Exchange the current state and the buffer for the next one.
    let old_cells_gen_arr = this.state.cells;
    this.setState({ cells: this.next_gen_cells });
    this.next_gen_cells = old_cells_gen_arr;
  }

  render() {
    return (
      <Grid cells={this.state.cells}/>
    );
  }

  componentDidMount() {
    this.timer = setInterval(() => this.step(), 1 / this.frequency * 1000);
  }
}

let cells = [
  [false, true, false, false, false, true, false],
  [false, false, true, false, false, true, false],
  [true, true, true, false, false, true, false],
  [false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false],
];
ReactDOM.render(
  <Game cells={cells}/>,
  document.getElementById("root")
);