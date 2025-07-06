import { useState, useEffect } from "react"
import Header from "./Header"
import { type Leaderboard, Options, getLeaderboard, play, listenEvent, getBestPlayers } from "./Web3Service";

function App() {
  const [message, setMessage] = useState("");
  const [leaderboard, setLeaderboard] = useState<Leaderboard>();

  useEffect(() => {
    getLeaderboard()
      .then(leaderboard => setLeaderboard(leaderboard))
      .catch(error => setMessage(error.message));

      listenEvent((status: string) => {
        getBestPlayers()
          .then(players => setLeaderboard({
            players, 
            status 
          } as Leaderboard))
          .catch(error => setMessage(error.message));
      });
  }, []);

  function onPlay(option: Options) {
    setLeaderboard({...leaderboard, status: 'Enviando sua jogada...'});

    play(option)
      .catch(error => setMessage(error.message));
  }

  return (
      <div className="container">
        <Header />
        <main>
          <div className="py-2 text-center">
            <img className="d-block mx-auto mb-4" src="/assets/images/logo512.png" alt="JoKenPo" width="72" />
            <h2>Leaderboard</h2>
            <p className="lead">Veja os melhores jogadores, pontuação e faça seu jogo.</p>
            <p className="lead text-danger">{message}</p>
          </div>
          <div className="col-md-8 col-lg-12">
            <div className="row">
              <div className="col-sm-6">
                 <h4 className="mb-3">Ranking dos Melhores Jogadores</h4>
                 <div className="card card-body border-0 shadow table-wraper table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th className="border-gray-200">Jogador</th>
                        <th className="border-gray-200">Vitórias</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        leaderboard && leaderboard.players && leaderboard.players.length
                        ? leaderboard.players.map(
                          p => (<tr key={p.wallet}><td>{p.wallet}</td><td>{p.wins}</td></tr>))
                        : <tr><td colSpan={2}>Carregando..</td></tr>
                      }
                    </tbody>
                  </table>
                 </div>
              </div>
              <div className="col-sm-6">
                <h4 className="mb-3">Jogos</h4>
                <div className="card card-body border-0 shadow">
                  <h5 className="mb-3 text-primary">Status atual:</h5>
                  <div className="alert alert-success">
                    {leaderboard && leaderboard?.status ? leaderboard?.status : 'Aguardando Jogada Inicial...'}
                  </div>
                  <h5 className="mb-3 text-primary">
                    {
                      (leaderboard && (leaderboard?.status?.indexOf('venceu') !== -1 || !leaderboard?.status))
                      ? 'Comece um novo Jogo!'
                      : 'Faça sua jogada'
                    }
                  </h5>
                  <div className="d-flex">
                    <div className="col-sm-4">
                      <div className="alert alert-info me-3 play-button" onClick={() => onPlay(Options.ROCK)}>
                        <img src="/assets/images/rock.png" width={100} alt="Pedra" />
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="alert alert-info play-button" onClick={() => onPlay(Options.PAPER)}>
                        <img src="/assets/images/paper.png" width={100} alt="Papel" />
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="alert alert-info ms-3 play-button" onClick={() => onPlay(Options.SCISSORS)}>
                        <img src="/assets/images/scissors.png" width={100} alt="Tesoura" />
                      </div>
                    </div>                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}

export default App
