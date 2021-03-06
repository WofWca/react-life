import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

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
      <td className={"cell " + (this.props.alive ? "alive" : "dead")}
        onMouseOver={() => this.props.onMouseOver(this.props.rowI, this.props.columnI)}
        onMouseDown={() => this.props.onMouseDown(this.props.rowI, this.props.columnI)}
      />
    );
  }
}

class Grid extends React.Component {
  /* This is just a grid representation component.
  The source of truth is located in `Game` component. */
  render() {
    return (
      <table className="grid">
        <tbody>
          {this.props.cells.map((row, rowI) => (
            <tr key={rowI.toString()}>
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
    this.gridHeight = 41;
    this.gridWidth = 37;
    let cells = create2DArrayOf(this.gridHeight, this.gridWidth, false);
    this.state = {
      // TODO replace with 1D?
      cells: cells, // A 2D array of bool.
      frequency: "frequency" in props ? props.frequency : 4,  // In seconds
      paused: true,
      generationNum: 0
    };
    this._nextStateCells = create2DArrayOf(this.gridHeight, this.gridWidth, false);
  }

  render() {
    let pauseUnpauseButton;
    if (this.state.paused) {
      pauseUnpauseButton = <button onClick={this.unpause}>Unpause</button>;
    } else {
      pauseUnpauseButton = <button onClick={this.pause}>Pause</button>;
    }
    return (
      <div>
        <div className="control-panel">
          {pauseUnpauseButton}
          <input type="range" min="0.5" max="60"
            value={this.state.frequency}
            onChange={this.handleSpeedChange}
          />
          <span>{this.state.generationNum}</span>
        </div>
        <Grid
          cells={this.state.cells}
          onCellToggle={this.toggleCell}
        />
      </div>
    );
  }

  pause = () => {
    clearInterval(this.timer);
    this.setState({ paused: true });
  }

  unpause = () => {
    this.timer = setInterval(() => this.step(), 1 / this.state.frequency * 1000);
    this.setState({ paused: false });
  }

  handleSpeedChange = (event) => {
    const newFrequency = event.target.value;
    if (!this.state.paused) {
      clearInterval(this.timer);
      this.timer = setInterval(() => this.step(), 1 / newFrequency * 1000);
    }
    this.setState({ frequency: newFrequency });
  }

  cellIsAlive(cellsArray, rowI, columnI) {
    const height = cellsArray.length;
    const width = cellsArray[0].length;
    if (rowI < 0 || rowI >= height ||
      columnI < 0 || columnI >= width) {
      return false;
    }
    if (cellsArray[rowI][columnI] === false) {
      return false;
    }
    return true;
  }

  cellIsAliveToroidal(cellsArray, rowI, columnI) {
    const height = cellsArray.length;
    const width = cellsArray[0].length;
    let translatedRowI, translatedColumnI;
    if (rowI === -1) {
      translatedRowI = height - 1;
    } else if (rowI === height) {
      translatedRowI = 0;
    } else {
      translatedRowI = rowI;
    }
    if (columnI === -1) {
      translatedColumnI = width - 1;
    } else if (columnI === width) {
      translatedColumnI = 0;
    } else {
      translatedColumnI = columnI;
    }
    return cellsArray[translatedRowI][translatedColumnI];
  }

  cellGetNumNeighbors(cellsArray, rowI, columnI, cellIsAliveFunction) { 
    let numNeighbors = 0;
    if (cellIsAliveFunction(cellsArray, rowI - 1, columnI - 1)) numNeighbors++;
    if (cellIsAliveFunction(cellsArray, rowI - 1, columnI)) numNeighbors++;
    if (cellIsAliveFunction(cellsArray, rowI - 1, columnI + 1)) numNeighbors++;
    if (cellIsAliveFunction(cellsArray, rowI, columnI - 1)) numNeighbors++;
    if (cellIsAliveFunction(cellsArray, rowI, columnI + 1)) numNeighbors++;
    if (cellIsAliveFunction(cellsArray, rowI + 1, columnI - 1)) numNeighbors++;
    if (cellIsAliveFunction(cellsArray, rowI + 1, columnI)) numNeighbors++;
    if (cellIsAliveFunction(cellsArray, rowI + 1, columnI + 1)) numNeighbors++;
    return numNeighbors;
  }

  updateCells(updater) {
    /* If an update needs to be done to cells, this function must be called.
    `updater` must be a function like:
    `(currStateCells, nextStateCells) => { ... }`, which defines the way the
    cells must be updated. currStateCells must not be modified.
    `nextStateCells` will be assigned to the current state upon execution. */
    this.setState((state, props) => {
      // Copy the current state.
      const height = state.cells.length, width = state.cells[0].length;
      for (let rowI = 0; rowI < height; rowI++) {
        for (let columnI = 0; columnI < width; columnI++) {
          this._nextStateCells[rowI][columnI] = state.cells[rowI][columnI];
        }
      }
      updater(state.cells, this._nextStateCells);

      // The array pointed to by `this._nextStateCells` becomes a new state
      // The array pointed to by `state.cells` is new considered to
      // contain waste and is assigned to this._nextStateCells for further
      // rewriting to avoid memory reallocation.
      const newCells = this._nextStateCells;
      this._nextStateCells = state.cells;
      return { cells: newCells };
    });
  }

  step () {
    /* TODO calculate the next step before the time has passed?
    Recalculate if the user drew something.*/
    // TODO only calcualte cells whose neighbours have changed.
    this.updateCells((currStateCells, nextStateCells) => {
      currStateCells.forEach((row, rowI) => {
        row.forEach((currCellAlive, columnI) => {
          // Now, the actual game logic
          let numNeighbors = this.cellGetNumNeighbors(
            currStateCells,
            rowI,
            columnI,
            this.cellIsAliveToroidal);
          if (
            numNeighbors === 3 ||
            (numNeighbors === 2 && currCellAlive)
          ) {
            nextStateCells[rowI][columnI] = true;
          } else {
            nextStateCells[rowI][columnI] = false;
          }
        });
      });
    });
    this.setState((state, props) => ({generationNum: state.generationNum + 1}));
  }

  toggleCell = (rowI, columnI) => {
    this.updateCells((currStateCells, nextStateCells) => {
      nextStateCells[rowI][columnI] = !currStateCells[rowI][columnI];
    });
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
  <Game />,
  document.getElementById("root")
);
