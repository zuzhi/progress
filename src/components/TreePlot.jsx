import * as d3 from "d3"
import { useRef, useEffect } from "react"
import { useSelector } from "react-redux"

export default function TreePlot() {
  const project = useSelector(state => state.projects.selected)
  const data = transformToTreeData(project)

  const svgRef = useRef()

  function transformToTreeData(project) {
    return {
      name: project?.name,
      children: project?.topics
        ? project.topics.map(topic => transformToTreeData(topic))
        : []
    }
  }

  useEffect(() => {
    const width = 768

    const root = d3.hierarchy(data)
    const dx = 10
    const dy = width / (root.height + 1)

    const treeLayout = d3.tree().nodeSize([dx, dy])
    treeLayout(root)

    // Compute the extent of the tree. Note that x and y are swapped here
    // because in the tree layout, x is the breadth, but when displayed, the
    // tree extends right rather than down.
    let x0 = Infinity
    let x1 = -x0
    root.each(d => {
      if (d.x > x1) x1 = d.x
      if (d.x < x0) x0 = d.x
    })
    const height = x1 - x0 + dx * 2

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-dy / 2.5, x0 - dx, width * 1.2, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")

    svg.selectAll("*").remove() // Clear previous content

    const g = svg.append("g")
    // Render the links (paths connecting nodes)
    g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))

    // Render the nodes (circles and text)
    const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`)

    node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5)

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -6 : 6)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .attr("stroke", "white")
      .attr("paint-order", "stroke")
  }, [data])

  return <svg ref={svgRef}></svg>
}
