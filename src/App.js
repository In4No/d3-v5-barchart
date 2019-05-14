import React from 'react';
import './App.css';
const d3 = require('d3');

console.log(d3);

const data1 = [
  {
    diastolic_blood_pressure: 90,
    heart_rate: [102, 108, 120, 68],
    on_date: 1557211104,
    systolic_blood_pressure: 140,
  },
  {
    diastolic_blood_pressure: 88,
    heart_rate: [120, 117],
    on_date: 1557830912,
    systolic_blood_pressure: 162,
  },
  {
    diastolic_blood_pressure: 94,
    heart_rate: [68],
    on_date: 1557838112,
    systolic_blood_pressure: 104,
  },
]
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { logs: [], showDrawer: false }; // <- set up react state
  }

  componentDidMount = () => {
    let svg = d3.select("svg");
    let margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    }
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    let formatTime = d3.timeFormat("%d-%b-%y");
    let x = d3.scaleBand()
              .rangeRound([0, width])
              .padding(0.1);
    let y = d3.scaleLinear()
              .rangeRound([height, 0]);
    x.domain(data1.map(function (d) {
      let date = new Date(0);
      date.setUTCSeconds(d.on_date);
      console.log(date, formatTime(date));
      return (
        d.on_date
      );
    }));
    y.domain([0, d3.max(data1, function (d) {
      return Number(d.systolic_blood_pressure);
    })]);
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")

    g.selectAll(".bar")
      .data(data1)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.on_date);
      })
      .attr("y", function (d) {
        return y(Number(d.systolic_blood_pressure));
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(Number(d.systolic_blood_pressure - d.diastolic_blood_pressure));
      });


      data1.map(function (data){
        return data.heart_rate.map(function(dotData){
          console.log("here", data, dotData);
          return g.append("circle")
            .data(data1)
            .attr("class", "circle")
            .attr("transform", function () {
              return "translate(" + x(data.on_date) + ", 0)";
            })
            .attr("cx", function (d) {
              return x(d.on_date);
            })
            .attr("cy", y(Number(dotData)))
            .attr("r","5")
            .attr("height", "20");
        });
      })
  }

  render(){
    console.log(data1);
    return (
      <svg width="960" height="500"></svg>
    );
  }
}

export default App;
