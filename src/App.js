import React from "react";
import "./App.css";
import Table from "./Table";

const App = props => (
  <div>
   <Table initialHeight={4} initialWidth={4} cellSize={50} />
   <Table initialHeight={4} initialWidth={4} cellSize={50} />
  </div>
  
);

export default App;
