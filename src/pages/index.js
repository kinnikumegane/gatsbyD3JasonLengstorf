import React, {useState, useEffect} from "react"

import * as D3 from 'd3'
import {useD3} from 'd3blackbox'

const getRandomData = () => 
  D3.range(20).map(() => ({ x: Math.random(), y: Math.random() }))

const Axis = ({x, y, scale, axisType, ticks = 10}) => {

  const fnName = axisType === 'left' ? 'axisLeft' : 'axisBottom'

  const ref = useD3(el => D3.select(el).call(D3[fnName](scale).ticks(ticks)))

  return <g transform={`translate(${x}, ${y})`} ref={ref} />
}

const Datapoint = ({ cx, cy, r, index }) => {

  const [degrees, setDegrees] = useState(0)

  const data = getRandomData();
  const width = r;
  const height = r;

  // 0 is going to be mapped in 0 position, and 1 is going to be mapped in 100 position. And D3 is going to figure out everything else.
  const xScale = D3.scaleLinear().domain([0, 1]).range([0, width]);

  // in svg, defalut y axis show top is 0, and bottom is max
  const yScale = D3.scaleLinear().domain([0, 1]).range([height, 0]);

  useEffect(() =>{
    D3.selection().transition('spinner-${cx}${cy}').tween('spinning', ()=>{
      const interpolate = D3.interpolate(0, 360)

      return t => setDegrees(Math.round(interpolate(t)))
    }).duration(1000).ease(D3.easeBounceOut).delay(100 * index)
  }, [])
  // d3 use svg
  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${degrees})`}>

      {/* create scatterplot of the actual data */}
      {data.map((d, i) => (
          <circle key={`datapoint-${i}`} cx={xScale(d.x)} cy={yScale(d.y)} r={1} />
      ))}
      <Axis x={0} y={0} scale={yScale} axisType="left" ticks={2} />
      <Axis x={0} y={height} scale={xScale} axixType="bottom" ticks={2} />
    </g>
  )

}

export default () => {
  const data = getRandomData();
  const width = 400;
  const height = 400;

  // 0 is going to be mapped in 0 position, and 1 is going to be mapped in 100 position. And D3 is going to figure out everything else.
  const xScale = D3.scaleLinear().domain([0, 1]).range([45, width - 10]);

  // in svg, defalut y axis show top is 0, and bottom is max
  const yScale = D3.scaleLinear().domain([0, 1]).range([height -45, 5]);

  // d3 use svg
  return (
    <svg width={width} height={height}>

      {/* create scatterplot of the actual data */}
      {data.map((d,i) => (
          <Datapoint key={`${d.x}${d.y}`} cx={xScale(d.x)} cy={yScale(d.y)} r={40} index={i} />
      ))}
      <Axis x={40} y={0} scale={yScale} axisType="left" />
      <Axis x={0} y={height - 40} scale={xScale} axixType="bottom" />
    </svg>
  )
}
