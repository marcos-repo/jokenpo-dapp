import { useState } from "react"
import Header from "./Header"
import type { Dashboard } from "./Web3Service";

function Admin() {
  const [message, setMessage] = useState("");
  const [dashboard, setDashboard] = useState<Dashboard>();

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDashboard(prevState => ({
      ...prevState, 
      [event.target.id]: event.target.value 
    }));
  }

  function onChangeBidClick() {
    
  }

  function onChangeComissionClick() {
    
  }

  function onUpgradeClick() {
    
  }  

  return (
      <div className="container">
        <Header />
        <main>
          <div className="py-5 text-center">
            <img className="d-block mx-auto mb-4" src="/assets/images/logo512.png" alt="JoKenPo" width="72" />
            <h2>Painel Administrativo</h2>
            <p className="lead">Configure o valor das apostas, sua comissão e atualize o contrato.</p>
            <p className="lead text-danger">{message}</p>
          </div>
          <div className="col-md-8 col-lg-12">
            <div className="row">
              <div className="col-sm-6">
                <label htmlFor="bid" className="form-label">Valor da aposta(Wei):</label>
                <div className="input-group">
                    <input type="number" className="form-control" id="bid" value={dashboard?.bid || ''} onChange={onInputChange} />
                    <span className="input-group-text bg-secondary">wei</span>
                    <button type="button" className="btn btn-primary d-inline-flex align-items-center" onClick={onChangeBidClick}>Alterar Aposta</button>
                </div>

              </div>
              <div className="col-sm-6">
                <label htmlFor="comission" className="form-label">Percentual de comissão:</label>
                <div className="input-group">
                    <input type="number" className="form-control" id="comission" value={dashboard?.comission || ''} onChange={onInputChange} />
                    <span className="input-group-text bg-secondary">%</span>
                    <button type="button" className="btn btn-primary d-inline-flex align-items-center" onClick={onChangeComissionClick}>Alterar Comissão</button>
                </div>

              </div>
            </div>
            <div className="row py-5">
              <div className="col-sm-12">
                <label htmlFor="address" className="form-label">Endereço do novo contrato:</label>
                <div className="input-group">
                    <input type="number" className="form-control" id="address" value={dashboard?.address || ''} onChange={onInputChange} />
                    <button type="button" className="btn btn-primary d-inline-flex align-items-center" onClick={onUpgradeClick}>Atualizar Contrato</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}

export default Admin
