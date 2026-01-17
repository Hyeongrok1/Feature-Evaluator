import { useEffect, useState } from "react";
import * as d3 from "d3";
import Scatterplot from "./scatter";
import { get_scatter_data } from '../explain/static';

let scatterplot;
let features;

export default function Tagging({X, Y}) {
  const [data, setData] = useState(null);
  const [model, setModel] = useState('hugging-quants');
  useEffect(() => {
      const fetchData = async () => {
          try {
              const result = await get_scatter_data(X, Y);
              console.log("Fetched Data:", result);
              setData(result); 
          } catch (error) {
              console.error("Error: fetch failed", error);
              setData(null); 
          }
      }; 
      fetchData();
  }, [X, Y]); 
  useEffect(() => {
    if (!data) return;
        features = data.features;
        features = features.filter((d) => d.model.includes(model));

        const svg = d3.select("#scatterplot");
        scatterplot = new Scatterplot(svg, features);

        svg.selectAll("*").remove();
        
        scatterplot.initialize()

        let xVar = X; let yVar = Y;

        scatterplot.update(xVar, yVar);
    
  }, [model, X, Y]);

  return (
    <>        
        <div className=" p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100%' }} class="row pt-2 align-items-center">
            <div className="dropdown mb-4">
                <button className="btn btn-outline-dark dropdown-toggle px-4 fw-bold" style={{ width: '200px' }}>
                    LLM Selection
                </button>
                <div className="dropdown-content shadow-sm">
                    <a href="#" onClick={(e) => { e.preventDefault(); setModel('hugging-quants'); }}>hugging-quants</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setModel('Qwen'); }}>Qwen</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setModel('openai'); }}>openai</a>
                </div>
            </div>
            <svg width="300" height="300" id="scatterplot"></svg>

        </div>
    </>
  );
}