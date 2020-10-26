import './App.css';
import React, {Component} from 'react';
import { unstable_concurrentAct } from 'react-dom/cjs/react-dom-test-utils.production.min';
/*import ReactDOM from 'react-dom';*/

function Square (props){
  const classes = "square" + (props.selected? " selected" : "")
    return (
      <button className={classes} onClick={props.onClick}>
          {props.value}
      </button>
    );
}

class Board extends Component {

  renderSquare() {
      let table=[];
      for(let i=0;i<3;i++){
        let children=[];
        for(let j=0;j<3;j++){
          let squareNum=3*i+j;
          children.push(
            <td>
              <Square 
                value={this.props.current.squares[squareNum]} 
                onClick={()=>this.props.onClick(squareNum)}
                selected={
                  this.props.current.buttonclicked===squareNum || 
                  (this.props.winline?this.props.winline.some(el=>el===squareNum):false)}
              />
            </td>)
        }
        table.push(<tr>{children}</tr>)
      }
      return table;
  }

  render() {
    return (
      <table>
        {this.renderSquare()}
      </table>
    );
  }
}

class Game extends Component {
  constructor(props){
    super(props);
    this.state={
      history: [{
        squares: Array(9).fill(null),
        buttonclicked:-1,
      }],
      stepNumber:0,
      xIsNext:true,

    };
  }
  
  handleClick(i){
    const history=this.state.history.slice(0, this.state.stepNumber + 1);
    const current=history[history.length-1];
    const squares = current.squares.slice();
    let winner=calculateWinner(squares)
    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext? 'X' : 'O';
    this.setState({
      history: history.concat({squares:squares, buttonclicked:i}),
      stepNumber:history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber:step,
      xIsNext:(step%2)===0
    })
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    let winner = calculateWinner(current.squares);

    const moves = history.map((step,move) => {
      let [riga, colonna]=[Math.floor(step.buttonclicked/3)+1, step.buttonclicked%3+1]
      
      const desc = move ?
        'Go to move #' + move+' ('+ riga+' '+colonna+')':
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(this.state.stepNumber==9){
      status='Pareggio'
    }
    else if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            current={current}
            onClick={(i)=>this.handleClick(i)}
            winline={winner?winner.winline:null}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner:squares[a], winline:lines[i]};
    }
  }
  return null;
}


export default Game;
