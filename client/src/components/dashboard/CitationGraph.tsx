import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as d3 from 'd3';

interface Node {
  id: string;
  title: string;
  group: number;
}

interface Link {
  source: string;
  target: string;
}

interface CitationGraphProps {
  nodes: Node[];
  links: Link[];
  title?: string;
  height?: number;
  onViewFullGraph?: () => void;
}

const CitationGraph: React.FC<CitationGraphProps> = ({
  nodes,
  links,
  title = "Citation Graph Preview",
  height = 300,
  onViewFullGraph
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = svgRef.current.clientWidth;
    
    // Create a simulation with forces
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links as any).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));
    
    // Add links
    const link = svg.append("g")
      .attr("stroke", "#ccc")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5,5")
      .selectAll("line")
      .data(links)
      .join("line");
    
    // Create a group for each node
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation) as any);
    
    // Add circles for nodes
    const nodeGroups = {
      1: { fill: "#EFF6FF", stroke: "#2563EB" }, // Primary color for main papers
      2: { fill: "#EDE9FE", stroke: "#7C3AED" }  // Purple for referenced papers
    };
    
    node.append("circle")
      .attr("r", (d: any) => d.group === 1 ? 30 : 25)
      .attr("fill", (d: any) => nodeGroups[d.group as keyof typeof nodeGroups].fill)
      .attr("stroke", (d: any) => nodeGroups[d.group as keyof typeof nodeGroups].stroke)
      .attr("stroke-width", 2);
    
    // Add text labels
    node.append("text")
      .text((d: any) => d.title.length > 15 ? d.title.substring(0, 15) + "..." : d.title)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", "10px")
      .attr("pointer-events", "none");
    
    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Drag functionality
    function drag(simulation: any) {
      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      
      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
    
    return () => {
      simulation.stop();
    };
  }, [nodes, links, height]);
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        {onViewFullGraph && (
          <Button 
            variant="link" 
            className="text-primary-600 hover:text-primary-700 p-0"
            onClick={onViewFullGraph}
          >
            View Full Graph
          </Button>
        )}
      </div>
      
      <div className={`w-full bg-neutral-50 p-4`} style={{ height: `${height}px` }}>
        <svg ref={svgRef} width="100%" height="100%"></svg>
      </div>
      
      <div className="p-4 bg-white border-t border-neutral-200">
        <p className="text-sm text-neutral-600">
          This visualization shows the citation relationships between your papers. 
          Explore the full graph to discover more connections.
        </p>
      </div>
    </Card>
  );
};

export default CitationGraph;
