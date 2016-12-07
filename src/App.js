import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to WineCeller</h2>
        </div>
        <div className="Main-View">
            <Cellar/>
        </div>
      </div>
    );
  }
}

function Square(props)
{
    const bgColor = props.clicked ? "gray" : "white";

    return (
        <button className="square" style={{backgroundColor: bgColor}} onClick={() => props.onClick()}/>
    );
}

class Rack extends Component {
    renderSquare(row, col)
    {
        var clicked = false;
        if(this.props.selectedBottle)
        {
            clicked = this.props.selectedBottle.row == row && this.props.selectedBottle.column == col;
        }
        return <Square row={row} col={col} clicked={clicked} onClick={() => this.props.onClick(row, col)}/>;
    }
    handleClick(i)
    {
        this.setState({
            selectedItem: i,
        });
    }
    renderRow(rowNumber, columns){
        var squares = [];
        for(var i=0; i<columns; i++) {
            squares.push(this.renderSquare(rowNumber, i));
        }
        return (<div className="rack-row">{squares}</div>);
    }
    render() {
        const status = this.props.selectedBottle ? "Bottle" : "No Bottle";
        var rows = []
        for (var i=0; i<this.props.height; i++) {
            rows.push(this.renderRow(i, this.props.width))
        }
        return (
            <div>
                <div className="status">{status}</div>
                <div>{rows}</div>
            </div>
        )
    }
}

class RackForm extends Component
{
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        this.props.onSubmit(this.name.value, this.rows.value, this.cols.value);
        event.preventDefault();
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" ref={(name) => this.name = name}/>
                        <label>Rows:</label>
                        <input type="number" min="1" max="10" ref={(r) => this.rows=r}/>
                        <label>Columns:</label>
                        <input type="number" min="1" max="10" ref={(c) => this.cols=c}/>
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </form>
        );
    }
}

// TODO add volume?
class WineForm extends Component
{
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        const formValues = {
            vineyard: this.vineyard.value,
            varietal: this.varietal.value,
            region: this.region.value,
            country: this.country.value,
            year: this.year.value,
        }
        this.props.onSubmit(formValues);
        event.preventDefault();
    }
    render(){
        const bottle = this.props.bottle;
        var bottleVineyard = "";
        var bottleVarietal = "";
        var bottleRegion = "";
        var bottleCountry = "";
        var bottleYear = "";
        if(bottle != null){
            bottleVineyard = bottle.vineyard;
            bottleVarietal = bottle.varietal;
            bottleRegion = bottle.region;
            bottleCountry = bottle.country;
            bottleYear = bottle.year;
        }
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <div className="form-group">
                        <label>Vineyard:</label>
                        <input type="text" ref={(vineyard) => this.vineyard = vineyard} placeholder={bottleVineyard}/>
                        <label>Varietal:</label>
                        <input type="text" ref={(varietal) => this.varietal = varietal} placeholder={bottleVarietal}/>
                        <label>Region:</label>
                        <input type="text" ref={(region) => this.region = region} placeholder={bottleRegion}/>
                        <label>Country:</label>
                        <input type="text" ref={(country) => this.country = country} placeholder={bottleCountry}/>
                        <label>Year:</label>
                        <input type="number" ref={(year) => this.year = year} placeholder={bottleYear}/>
                    </div>
                    <div>
                        <button type="submit">Save</button>
                    </div>
                </div>
            </form>
        );
    }
}

function RackPicker(props)
{
    var rackNameButtonList = props.rackList.map(function(rackDef, rackNum){
                return(
                        <button className="rack-button" onClick={() => props.onClick(rackNum)}>{rackDef.name}</button>
                );
            });

    return (
        <div className="rack-picker">{rackNameButtonList}</div>
    )
}

class Cellar extends Component{
    constructor(){
        super();
        this.state = {
            rackList: [
                {
                    name: 'rack1',
                    rows: 8,
                    columns: 5,
                    bottles: new Map(), // Map of maps of bottles
                }
            ],
            selectedRack: 0,
            selectedBottle: null,
        }
    }

    getBottle(r, c) {
        const rowMap = this.state.rackList[this.state.selectedRack].bottles.get(r)
        if (rowMap != null) {
            return rowMap.get(c);
        }
        return null;
    }

    getSelectedBottle() {
        const selectedBottle = this.state.selectedBottle;
        if (selectedBottle == null) {
            return null;
        }
        return this.getBottle(selectedBottle.row, selectedBottle.column);
    }

    createNewRack(name, r, c) {
        const newRack = {
            name: name,
            rows: r,
            columns: c,
            bottles: new Map(), // Map of maps of bottles
        }
        const rackList = this.state.rackList.slice();
        const newRackNumber = rackList.push(newRack) -1;
        this.setState({
            rackList: rackList,
            selectedRack:  newRackNumber,
            selectedBottle: null,
        });
    }

    bottleClick(r, c) {
        this.setState({
            selectedBottle: {
                row: r,
                column: c,
            }
        })
    }

    saveBottle(bottleData) {
        const rackList = this.state.rackList.slice();
        const selectedBottle = this.state.selectedBottle;
        if(selectedBottle == null) {
            alert("Select a space for this bottle");
            return;
        }
        var rowMap = rackList[this.state.selectedRack].bottles.get(selectedBottle.row);
        if (rowMap == null) {
            rowMap = new Map();
        }
        rowMap.set(selectedBottle.column, bottleData);
        rackList[this.state.selectedRack].bottles.set(selectedBottle.row, rowMap);

        this.setState({
            rackList: rackList,
        })
    }

    rackClick(i) {
        this.setState({
            selectedRack: i,
        })
    }

    render() {
        var rackList = this.state.rackList;
        var rack = rackList[this.state.selectedRack];
        var bottle = this.getSelectedBottle();
        return (
            <div>
                <div className='Cellar-View'>
                    <RackForm
                        onSubmit={(name, r, c) => this.createNewRack(name, r, c)}
                    />
                    <Rack width={rack.columns} height={rack.rows}
                        selectedBottle={this.state.selectedBottle}
                        onClick={(r,c) => this.bottleClick(r,c)}
                    />
                    <WineForm
                        bottleData={bottle}
                        onSubmit={(bottleData) => this.saveBottle(bottleData)}
                    />
                </div>
                <div>
                    <RackPicker rackList={rackList} onClick={(i) => this.rackClick(i)}/>
                </div>
            </div>
        )
    }
}

export default App;
