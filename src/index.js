import React from "react";
import ReactDOM from "react-dom";

function create2DArrayOf(height, width, val) {
  let newArr = [];
  newArr.length = height;
  for (let rowI = 0; rowI < height; rowI++) {
    let newRow = []; newRow.length = width;
    newRow.fill(val, 0, newRow.length);
    newArr[rowI] = newRow;
  }
  return newArr;
}

class Cell extends React.PureComponent {
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
    if (mouseDown) {
      this.props.onCellToggle(rowI, columnI);
    }
  }
}

class Game extends React.Component {
  // TODO implement using Redux?
  constructor (props) {
    super(props);
    // Grid generation
    this.gridHeight = "gridDimensions" in props ? props.gridDimensions.height : 20;
    this.gridWidth = "gridDimensions" in props ? props.gridDimensions.width : 20;
    let cells = create2DArrayOf(this.gridHeight, this.gridWidth, false);
    this.state = {
      // TODO replace with 1D?
      cells: cells, // A 2D array of bool.
      frequency: "frequency" in props ? props.frequency : 4,  // In seconds
      paused: true
    };

    this.generationNum = 0;
    this.nextGenCells = create2DArrayOf(this.gridHeight, this.gridWidth, false);
  }

  render() {
    return (
      <div>
        <div className="controls">
          <button onClick={this.togglePaused}>
            {this.state.paused ? "Unpause" : "Pause"}
          </button>
          <input type="range" min="0.5" max="20"
            value={this.state.frequency}
            onChange={this.handleSpeedChange}
          />
        </div>
        <Grid
          cells={this.state.cells}
          onCellToggle={this.toggleCell}
        />
      </div>
    );
  }

  togglePaused = () => {
    let newPaused;
    if (this.state.paused) {
      this.timer = setInterval(() => this.step(), 1 / this.state.frequency * 1000);
      newPaused = false;
    } else {
      clearInterval(this.timer);
      newPaused = true;
    }
    this.setState({ ...this.state, paused: newPaused });
  }

  handleSpeedChange = (event) => {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.step(), 1 / event.target.value * 1000);
    // TODO can we maybe make this slider a separate component so we don't have
    // to update the whole game every time it is changed?
    this.setState({ ...this.state, frequency: event.target.value });
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
    let oldCellsGenArr = this.state.cells;
    this.setState({...this.state, cells: this.nextGenCells });
    this.nextGenCells = oldCellsGenArr;
  }

  toggleCell = (rowI, columnI) => {
    let newCells = this.state.cells;
    newCells[rowI][columnI] = !newCells[rowI][columnI];
    this.setState({...this.state, cells: newCells});
  }
}

var mouseDown = false;
document.onmousedown = function() {
  mouseDown = true;
};
document.onmouseup = function () {
  mouseDown = false;
};

ReactDOM.render(
  <Game gridDimensions={{ height: 30, width: 30 }} />,
  document.getElementById("root")
);