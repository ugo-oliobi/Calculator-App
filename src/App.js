import React, { useState } from "react";

function App() {
  // State to hold calculator data
  const [data, setData] = useState({
    display: "",
    formula: "",
    isClicked: false,
  });
  const symbols = ["+", "-", "/", "*", "="];
  const regex = /[+\-*/]/;
  // List of operator symbols
  function inputDigits(e) {
    setData((preState) => {
      // If display is an operator, remove it
      if (symbols.includes(preState.display)) {
        setData((preState) => {
          return {
            ...preState,
            display: preState.display.slice(1),
          };
        });
      }
      // If formula already has result, start new calculation
      if (preState.formula.includes("=")) {
        setData((preState) => {
          return {
            ...preState,
            display: e.target.value,
            formula: symbols.includes(e.target.value)
              ? data.display + e.target.value
              : e.target.value,
          };
        });
      }
      // Prevent multiple leading zeros
      if (preState.display === "0") {
        setData((preState) => {
          return {
            ...preState,
            display: data.display.slice(1) + e.target.value,
            formula: data.formula.slice(1) + e.target.value,
          };
        });
      }
      // Default digit input
      const digits = symbols.includes(e.target.value)
        ? e.target.value
        : preState.display + e.target.value;
      return {
        ...preState,
        display: digits,
        formula: preState.formula + e.target.value,
        isClicked: true,
      };
    });
  }
  // Handles "=" button click to calculate result
  function getResult(e) {
    // Prevent calculation if already calculated or invalid start
    if (data.formula.includes("=")) return;
    if (data.formula.slice(0, 1) === "*" || data.formula.slice(0, 1) === "/")
      return;
    // Evaluate the formula using Function constructor
    const result = new Function(
      `return ${
        symbols.includes(data.display) || data.display === ""
          ? "'NAN'"
          : data.formula
      }`
    )();
    setData((preState) => {
      return {
        ...preState,
        display: result,
        formula:
          result === "NAN" ? "NAN" : preState.formula + e.target.value + result,
        isClicked: true,
      };
    });
  }
  // Resets calculator to initial state
  function resetValues() {
    setData((preState) => {
      return {
        ...preState,
        display: "",
        formula: "",
        isClicked: false,
      };
    });
  }
  // Handles decimal point input
  function handleDecimal(e) {
    // Prevent multiple decimals in display
    if (data.display.includes(".")) return;
    setData((preState) => {
      return {
        ...preState,
        display:
          data.display === ""
            ? "0" + e.target.value
            : preState.display + e.target.value,
        formula:
          data.display === ""
            ? "0" + e.target.value
            : preState.formula + e.target.value,
        isClicked: true,
      };
    });
  }
  // Handles zero button click, prevents multiple leading zeros
  function handleZeroClick(e) {
    if (data.display === "0") return;
    setData((preState) => {
      return {
        ...preState,
        display: data.display.replace(regex, "") + e.target.value,
        formula: preState.formula + e.target.value,
        isClicked: true,
      };
    });
  }
  // Handles operator button clicks (+, -, *, /)
  function arthmeticInput(e) {
    if (data.display === e.target.value) return;
    const regex = /^[-\+\*\/]$/;
    // If formula already has result, start new calculation with operator
    if (data.formula.includes("=")) {
      setData((preState) => {
        return {
          ...preState,
          display: e.target.value,
          formula: data.display + e.target.value,
        };
      });
      return;
    }
    setData((preState) => {
      return {
        ...preState,
        display: e.target.value,
        formula:
          data.display === ""
            ? data.display + e.target.value
            : preState.formula + e.target.value,
        isClicked: true,
      };
    });
    // Replace last operator if user enters two in a row
    if (regex.test(data.typing)) {
      setData((preState) => {
        return {
          ...preState,
          display: e.target.value,
          formula: data.formula.replace(/-|\+|\*|\//, e.target.value),
        };
      });
      return;
    }
    // Handle special cases like "*-" or "+-"
    if (/\*-/.test(data.formula) || /\+-/.test(data.formula)) {
      setData((preState) => {
        return {
          ...preState,
          display: e.target.value,
          formula: data.formula.replace(/\*-|\+-/, e.target.value),
        };
      });
      return;
    }
  }
  // Render calculator UI
  return (
    <div className="app">
      <div id="calculator">
        <div className="myFormula" id="formula">
          {data.formula}
        </div>
        <div className="myDisplay" id="display">
          {data.isClicked ? data.display : "0"}
        </div>
        <div>
          <button
            className="jumbo"
            id="clear"
            style={{ background: "rgb(172, 57, 57)" }}
            value="AC"
            onClick={resetValues}
          >
            AC
          </button>
          <button id="divide" value="/" onClick={arthmeticInput}>
            /
          </button>
          <button id="multiply" value="*" onClick={arthmeticInput}>
            x
          </button>
          <button id="seven" value="7" onClick={inputDigits}>
            7
          </button>
          <button id="eight" value="8" onClick={inputDigits}>
            8
          </button>
          <button id="nine" value="9" onClick={inputDigits}>
            9
          </button>
          <button id="subtract" value="-" onClick={arthmeticInput}>
            -
          </button>
          <button id="four" value="4" onClick={inputDigits}>
            4
          </button>
          <button id="five" v value="5" onClick={inputDigits}>
            5
          </button>
          <button id="six" value="6" onClick={inputDigits}>
            6
          </button>
          <button id="add" value="+" onClick={arthmeticInput}>
            +
          </button>
          <button id="one" value="1" onClick={inputDigits}>
            1
          </button>
          <button id="two" value="2" onClick={inputDigits}>
            2
          </button>
          <button id="three" value="3" onClick={inputDigits}>
            3
          </button>
          <button
            className="jumbo"
            id="zero"
            value="0"
            onClick={handleZeroClick}
          >
            0
          </button>
          <button id="decimal" value="." onClick={handleDecimal}>
            .
          </button>
          <button
            id="equals"
            style={{
              backgroundColor: "rgb(0, 68, 102)",
            }}
            value={"="}
            onClick={getResult}
          >
            =
          </button>
        </div>
      </div>
      <div id="author">
        Designed and Coded By
        <br /> Ugonna Oliobi
      </div>
    </div>
  );
}
export default App;
