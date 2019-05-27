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
          visibility: "hidden",
        },
        buttonMinusColumn: {
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

      this.showMinusButtons(target.offsetLeft, target.offsetTop);

      this.setState({
        currentRowNum: target.parentNode.rowIndex,
        currentColumnNum: target.cellIndex,
      });
    }

    hideMinusButtons = () => {
      const {
        ButtonMinusColumn,
        ButtonMinusRow,
      } = this.state;

      this.setState({
        style: {
          ButtonMinusColumn: {
            ...ButtonMinusColumn,
            visibility: "hidden",
          },
          ButtonMinusRow: {
            ...ButtonMinusRow,
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
          ButtonMinusRow,
          ButtonMinusColumn,
        },
      } = this.state;

      if (rowsInTable !== 1 && columnsInTable !== 1) {
        this.setState({
          style: {
            ButtonMinusRow: {
              ...ButtonMinusRow,
              visibility: "visible",
              top: minusRowOffset,
            },
            ButtonMinusColumn: {
              ...ButtonMinusColumn,
              visibility: "visible",
              left: minusColumnOffset,
            },
          },
        });
      } else if (rowsInTable !== 1) {
        this.setState({
          style: {
            ...style,
            ButtonMinusRow: {
              ...ButtonMinusRow,
              visibility: "visible",
              top: minusRowOffset,
            },
          },
        });
      } else if (columnsInTable !== 1) {
        this.setState({
          style: {
            ...style,
            ButtonMinusColumn: {
              ...ButtonMinusColumn,
              visibility: "visible",
              left: minusColumnOffset,
            },
          },
        });
      }
    }

    setTimerHideButtons = () => {
      this.timerHideButtons = setTimeout(this.hideMinusButtons, 300);
    }

    clearTimerHideButtons = () => {
      clearTimeout(this.timerHideButtons);
    }

    render() {
      console.log('sss');
      const {
        style: {
          ButtonMinusRow,
          ButtonMinusColumn,
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
            style={ButtonMinusColumn}
            onMouseOver={() => this.clearTimerHideButtons()}
            onMouseOut={() => this.setTimerHideButtons()}
            onClick={() => this.deleteColumn()}
          >
            -
          </Button>

          <Button
            buttonPosition="BtnLeft"
            buttonType="ButtonMinus"
            style={ButtonMinusRow}
            onMouseOver={() => this.clearTimerHideButtons()}
            onMouseOut={() => this.setTimerHideButtons()}
            onClick={() => this.deleteRow()}
          >
            -
          </Button>

          <Button
            buttonPosition="BtnBottom"
            buttonType="ButtonPlus"
            style={cellSize}
            onClick={() => this.addRow()}
          >
            +
          </Button>

          <Button
            buttonPosition="BtnRight"
            buttonType="ButtonPlus"
            style={cellSize}
            onClick={() => this.addColumn()}
          >
            +
          </Button>

          <table
            className={className}
            onMouseOver={this.tableOnMouseOverHandler.bind(this)}
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
