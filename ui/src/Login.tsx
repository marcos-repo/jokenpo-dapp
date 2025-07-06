import { useState, useEffect } from "react";
import { doLogin, getLoginData } from "./Web3Service.ts";

import { useNavigate } from 'react-router-dom';

function Login() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const loginData = getLoginData();
    if(loginData) {
      redirectAfterLogin(loginData.isAdmin);
    }
  },[]);

  function redirectAfterLogin(isAdmin : boolean) {
    if(isAdmin)
      navigate('/admin');
    else
      navigate('/app');
  }

  function onBtnClick() {
    setMessage("Efetuando Login...");
    doLogin()
        .then(result => {
          redirectAfterLogin(result.isAdmin);
        })
        .catch(error => setMessage(error.message));
  }

  return (
    <>
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="mb-auto">
          <div>
            <h3 className="float-md-start mb-0">JoKenPo DAPP</h3>
            <nav className="nav nav-masthead justify-content-center float-md-end">
              <a
                className="nav-link fw-bold py-1 px-0 active"
                aria-current="page"
                href="#"
              >
                Home
              </a>
              <a className="nav-link fw-bold py-1 px-0" href="#">
                About
              </a>
            </nav>
          </div>
        </header>
        <main className="px-3">
          <h1>Faça login e jogue com a comunidade</h1>
          <p className="lead">
            Jogue Pedra-Papel-Tesoura e ganhe prêmios!
          </p>
          <p className="lead">
            <a
              href="#"
              onClick={onBtnClick}
              className="btn btn-lg btn-light fw-bold border-white bg-white"
            >
              <img
                src="/assets/images/metamask.svg"
                width="48"
                alt="Metamask Logo"
              />
              Faça Login com sua Metamask!
            </a>
          </p>
          <p className="lead">{message}</p>
        </main>
        <footer className="mt-auto text-white-50">
          <p>
            Criado por{" "}
            <a href="https://github.com/marcos-repo" className="text-white">
              Marcos
            </a>
            .
          </p>
        </footer>
      </div>
    </>
  );
}

export default Login;