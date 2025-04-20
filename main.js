import * as d3 from 'd3'              // ES‑module import

const svg   = d3.select('#hist')
const width = +svg.attr('width')
const height = +svg.attr('height')
const margin = {top: 20, right: 20, bottom: 30, left: 40}

const g = svg.append('g')
             .attr('transform', `translate(${margin.left},${margin.top})`)
const innerW = width  - margin.left - margin.right
const innerH = height - margin.top  - margin.bottom

const x = d3.scaleLinear().range([0, innerW])
const y = d3.scaleLinear().range([innerH, 0])
const xAxis = g.append('g').attr('transform', `translate(0,${innerH})`)
const yAxis = g.append('g')

const slider = document.getElementById('n')
const nLabel = document.getElementById('n‑label')
slider.addEventListener('input', () => update(+slider.value))

update(1)   // initial draw

function update(n){
  nLabel.textContent = n

  // --- simulate 10 000 sample means of size n from Uniform(0,1) ---
  const means = Array.from({length: 10000}, () =>
    d3.mean(Array.from({length: n}, d3.randomUniform(0,1)))
  )

  const bins = d3.bin().domain([0,1]).thresholds(30)(means)
  x.domain([0,1])
  y.domain([0, d3.max(bins, d => d.length)])

  // JOIN + UPDATE + EXIT pattern
  const rects = g.selectAll('rect').data(bins)
  rects.exit().remove()
  rects.enter().append('rect')
       .merge(rects)
       .attr('x', d => x(d.x0))
       .attr('y', d => y(d.length))
       .attr('width', d => x(d.x1) - x(d.x0) - 1)
       .attr('height', d => innerH - y(d.length))
       .attr('fill', '#69b3a2')

  xAxis.call(d3.axisBottom(x))
  yAxis.call(d3.axisLeft(y))
}

