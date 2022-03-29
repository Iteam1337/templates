import logo from './logo.svg';

function App() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <header className="w-full max-w-md flex flex-col items-center">
        <img className="animate-spin-slow" src={logo} alt="logo" />
        <h1 className="text-2xl font-bold">Hello Vite + React!</h1>
      </header>
    </div>
  );
}

export default App;
