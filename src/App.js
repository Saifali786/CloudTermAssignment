import "./App.css";
import { ThemeProvider } from "@material-ui/core";
import theme from "./Theme";
import { SentimentAnalysis } from "./SentimentAnalysis";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <SentimentAnalysis />
      </div>
      ;
    </ThemeProvider>
  );
}

export default App;
