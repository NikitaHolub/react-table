import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "./Button";

class Table extends Component {
  constructor(props) {

    super(props);

    this.cellSize = {
      width: `${this.props.cellSize}px`,
      height: `${this.props.cellSize}px`,
      minWidth: `${this.props.cellSize}px`,
    };

    this.timerHideButtons = {};

    this.state = {
      style: {
        buttonMinusRow: {
          top: "0px",
          visibility: "hidden",
        },
        buttonMinusColumn: {
          left: "0px",
          visibility: "hidden",
        },
      },

      table: [],

      trKey: 1,
      tdKey: 1,

      currentRowNum: 0,
      currentColumnNum: 0,
      
    };
  }

    componentDidMount = () => {
      this.buildInitialTable();
    }

    buildInitialTable = () => {
      const table = [];
      const {
        initialWidth,
        initialHeight,
      } = this.props;

      let {
        trKey,
        tdKey,
      } = this.state;

      for (let i = 0; i < initialHeight; i++) {
        const tr = [];
        tr.id = (trKey++).toString();

        table.push(tr);
      }

      for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < initialWidth; j++) {
          const td = {};
          td.id = (tdKey++).toString();

          table[i].push(td);
        }
      }

      this.setState({
        table,
        trKey,
        tdKey,
      });
    }

    addRow = () => {
      const { table } = this.state;
      let {
        trKey,
        tdKey,
      } = this.state;
      const tr = [];
      tr.id = (trKey++).toString();
      table.push(tr);

      for (let i = 0; i < table[0].length; i++) {
        const td = {};
        td.id = (tdKey++).toString();
        table[table.length - 1].push(td);
      }

      this.setState({
        table,
        trKey,
        tdKey,
      });
    }

    addColumn = () => {
      const { table } = this.state;
      let { tdKey } = this.state;
      for (let i = 0; i < table.length; i++) {
        const td = {};
        td.id = (tdKey++).toString();
        table[i].push(td);
      }

      this.setState({
        table,
        tdKey,
      });
    }

    deleteRow = () => {
      const {
        table,
        currentRowNum,
      } = this.state;

      if (table.length !== 1) {
        table.splice(currentRowNum, 1);

        this.hideMinusButtons();
        this.setState({
          table,
        });
      }
    }

    deleteColumn = () => {
      const {
        table,
        currentColumnNum,
      } = this.state;

      if (table[0].length !== 1) {
        for (let i = 0; i < table.length; i++) {
          table[i].splice(currentColumnNum, 1);
        }

        this.hideMinusButtons();

        this.setState({
          table,
        });
      }
    }

    makeTable = () => {
      const {
        table,
      } = this.state;

      const cellSize = this.cellSize;

      return (
        <tbody>
          { table.map(row => (
            <tr key={row.id}>
              {row.map(cell => (
                <td key={cell.id} style={cellSize} />
              ))}
            </tr>
          )) }
        </tbody>
      );
    }

    tableOnMouseOverHandler = (event) => {
      const { target } = event;

      this.clearTimerHideButtons();

      if (target.tagName !== "TD") return;

      this.setState({
        currentRowNum: target.parentNode.rowIndex,
        currentColumnNum: target.cellIndex,
      });

      this.showMinusButtons(target.offsetLeft, target.offsetTop);
    }

    hideMinusButtons = () => {
      const {
        buttonMinusColumn,
        buttonMinusRow,
      } = this.state;

      this.setState({
        style: {
          buttonMinusColumn: {
            ...buttonMinusColumn,
            visibility: "hidden",
          },
          buttonMinusRow: {
            ...buttonMinusRow,
            visibility: "hidden",
          },
        },
      });
    }

    showMinusButtons = (minusColumnOffset, minusRowOffset) => {
      const {
        table,
        style,
      } = this.state;
      const rowsInTable = table.length;
      const columnsInTable = table[0].length;
      const {
        style: {
          buttonMinusRow,
          buttonMinusColumn,
        },
      } = this.state;

      if (rowsInTable !== 1 && columnsInTable !== 1) {
        
        this.setState({
          style: {
            buttonMinusRow: {
              ...buttonMinusRow,
              visibility: "visible",
              top: minusRowOffset,
            },
            buttonMinusColumn: {
              ...buttonMinusColumn,
              visibility: "visible",
              left: minusColumnOffset,
            },
          },
        });
        
        return;
      }
      if (rowsInTable !== 1) {
        this.setState({
          style: {
            ...style,
            buttonMinusRow: {
              ...buttonMinusRow,
              visibility: "visible",
              top: minusRowOffset,
            },
          },
        });
        return;
      } 
      if (columnsInTable !== 1) {
        this.setState({
          style: {
            ...style,
            buttonMinusColumn: {
              ...buttonMinusColumn,
              visibility: "visible",
              left: minusColumnOffset,
            },
          },
        });
        return;
      }
    }

    setTimerHideButtons = () => {
      this.timerHideButtons = setTimeout(this.hideMinusButtons, 300);
    }

    clearTimerHideButtons = () => {
      clearTimeout(this.timerHideButtons);
    }

    render() {
      const {
        style: {
          buttonMinusRow,
          buttonMinusColumn,
        },
      } = this.state;

      const cellSize = this.cellSize;

      const {
        className,
      } = this.props;

      return (
        <div className="Module">
          <Button
            buttonPosition="BtnTop"
            buttonType="ButtonMinus"
            style={buttonMinusColumn}
            onMouseOver={() => this.clearTimerHideButtons()}
            onMouseOut={() => this.setTimerHideButtons()}
            onClick={() => this.deleteColumn()}
          >
            <div>-</div>
          </Button>

          <Button
            buttonPosition="BtnLeft"
            buttonType="ButtonMinus"
            style={buttonMinusRow}
            onMouseOver={() => this.clearTimerHideButtons()}
            onMouseOut={() => this.setTimerHideButtons()}
            onClick={() => this.deleteRow()}
          >
            <div>-</div>
          </Button>

          <Button
            buttonPosition="BtnBottom"
            buttonType="ButtonPlus"
            style={cellSize}
            onClick={() => this.addRow()}
          >
            <div>+</div>
          </Button>

          <Button
            buttonPosition="BtnRight"
            buttonType="ButtonPlus"
            style={cellSize}
            onClick={() => this.addColumn()}
          >
            <div>+</div>
          </Button>

          <table
            className={className}
            onMouseOver={this.tableOnMouseOverHandler}
            onMouseOut={() => this.setTimerHideButtons()}
          >
            {this.makeTable()}
          </table>
        </div>
      );
    }
}

Table.propTypes = {
  className: PropTypes.string,
  initialHeight: PropTypes.number,
  initialWidth: PropTypes.number,
  cellSize: PropTypes.number,
};

Table.defaultProps = {
  className: "Table",
  initialHeight: 4,
  initialWidth: 4,
  cellSize: 50,
};

export default Table;
