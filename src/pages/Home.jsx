

import logo from '../images/logofig.svg';
import Header from '../components/header';
import { useEffect } from 'react';
import Cookies from 'js-cookie';


const Home = () => {

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        if (authToken) {
          window.location.href = '/dashboard'; // Redireciona para o painel se o token de autenticação existir
        }
      }, []);

    const LoginPage = () => {
        window.location.href = '/signup';
      };

      const RegisterPage = () => {
        window.location.href = '/register';

      }

  
    return (
        <div className="relative h-screen flex flex-col fundo">
            <Header /> 
            <div className="flex flex-col items-center justify-center flex-grow text-center text-white z-10">
                <img src={logo} width={400} alt="Logo" className="mx-auto mb-4" />

                <h1 className="text-4xl font-bold mb-2">Filmes ilimitados para você assistir.</h1>
                <span className="block mb-4">Assista onde estiver. Cancela quando quiser.</span>

                <div className="flex gap-10 p-2">
                  <button onClick={LoginPage}  className='bg-white text-black p-2 rounded-xl font-semibold'>Entrar na minha conta</button>
                  <button onClick={RegisterPage} className=' border-white border-2 p-3 rounded-xl'>Criar nova conta</button>
                </div>

               
            </div>
        </div>
    );
}

export default Home;
