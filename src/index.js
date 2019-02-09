import React from "react";
import ReactDOM from "react-dom";

class Cell extends React.Component {
  render() {
    return (
      <td className="square"
        onMouseOver={() => this.props.onMouseOver(this.props.rowI, this.props.columnI)}
        onMouseDown={() => this.props.onMouseDown(this.props.rowI, this.props.columnI)}
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
          {this.props.cells.map((row, rowI) => (
            <tr className="gridRow" key={rowI.toString()}>
              {row.map((cellVal, columnI) => (
                <Cell
                  rowI={rowI}
                  columnI={columnI}
                  alive={cellVal}
                  key={`${rowI}:${columnI}`}
                  onMouseOver={this.onMouseOverCell}
                  onMouseDown={this.props.onCellToggle}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  onMouseOverCell = (rowI, columnI) => {
    this.mouseOverCell = { rowI, columnI };
    if (mouseDown) {
      this.props.onCellToggle(rowI, columnI);
    }
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
    this.generationNum = 0;
    this.frequency = "frequency" in props ? props.frequency : 2;  // In seconds
    this.gridHeight = props.cells.length;
    this.gridWidth = props.cells[0].length;
    this.nextGenCells = [];
    this.nextGenCells.length = this.gridHeight;
    for (let rowI = 0; rowI < this.nextGenCells.length; rowI++) {
      let newRow = []; newRow.length = this.gridWidth;
      newRow.fill(false, 0, newRow.length);
      this.nextGenCells[rowI] = newRow;
    }
  }

  render() {
    return (
      <Grid
        cells={this.state.cells}
        onCellToggle={this.toggleCell}
      />
    );
  }

  cellIsAlive(rowI, columnI) {
    if (rowI < 0 || rowI >= this.gridHeight ||
      columnI < 0 || columnI >= this.gridWidth) {
      return false;
    }
    if (this.state.cells[rowI][columnI] === false) {
      return false;
    }
    return true;
  }

  cellGetNumNeighbors (rowI, columnI) { 
    let numNeighbors = 0;
    if (this.cellIsAlive(rowI - 1, columnI - 1)) numNeighbors++;
    if (this.cellIsAlive(rowI - 1, columnI)) numNeighbors++;
    if (this.cellIsAlive(rowI - 1, columnI + 1)) numNeighbors++;
    if (this.cellIsAlive(rowI, columnI - 1)) numNeighbors++;
    if (this.cellIsAlive(rowI, columnI + 1)) numNeighbors++;
    if (this.cellIsAlive(rowI + 1, columnI - 1)) numNeighbors++;
    if (this.cellIsAlive(rowI + 1, columnI)) numNeighbors++;
    if (this.cellIsAlive(rowI + 1, columnI + 1)) numNeighbors++;
    return numNeighbors;
  }

  step () {
    // TODO calculate the next step before the time has passed
    // TODO only calcualte cells whose neighbours have changed.

    // Copy the from the old state.
    // You can't just `this.nextGenCells = this.state.cells.slice()`, as this is
    // a shallow copy.
    for (let rowI = 0; rowI < this.nextGenCells.length; rowI++) {
      this.nextGenCells[rowI] = this.state.cells[rowI].slice();
    }

    // TODO these forEach(..., this) are ugly.
    this.state.cells.forEach((row, rowI) => {
      row.forEach((currCellAlive, columnI) => {
        // Now, the actual game logic
        let numNeighbors = this.cellGetNumNeighbors(rowI, columnI);
        if (
          numNeighbors === 3 ||
          (numNeighbors === 2 && currCellAlive)
        ) {
          this.nextGenCells[rowI][columnI] = true;
        } else {
          this.nextGenCells[rowI][columnI] = false;
        }
      }, this);
    }, this);
    // Exchange the current state and the buffer for the next one.
    let coldCellsGenArr = this.state.cells;
    this.setState({ cells: this.nextGenCells });
    this.nextGenCells = coldCellsGenArr;
  }

  toggleCell = (rowI, columnI) => {
    let newCells = this.state.cells;
    newCells[rowI][columnI] = !newCells[rowI][columnI];
    this.setState({cells: newCells});
  }

  componentDidMount() {
    this.timer = setInterval(() => this.step(), 1 / this.frequency * 1000);
  }
}

var mouseDown = false;
document.onmousedown = function() {
  mouseDown = true;
};
document.onmouseup = function () {
  mouseDown = false;
};

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