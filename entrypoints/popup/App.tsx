import wxtLogo from "/wxt.svg";

function App() {
  return (
    <main className="main">
      <div className="title">
        <h5>نمونه های آماده رایانامه</h5>
        <img src={wxtLogo} className="logo" alt="WXT logo" />
      </div>

      <p>
        create by <span style={{ color: "red" }}>♥</span>
      </p>
    </main>
  );
}

export default App;
