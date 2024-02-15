import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import CheckAuthToken from '../utils/checkauth';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // Estado para armazenar a mensagem de erro

  const RegisterPage = () => {
    navigate('/register');
  };

  useEffect(() => {
    const authToken = Cookies.get('authToken');

    if (authToken) {
      navigate('/dashboard');
    } else {
      console.log('Nenhum token encontrado nos cookies.');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      Cookies.set('authToken', data.token, { expires: 1 });

      navigate('/dashboard');
    } else {
      const errorData = await response.json();
      console.error('Erro ao fazer login:', errorData.error);
      setErrorMessage(errorData.error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col fundo">
      <Header />

      <div className="flex flex-col items-center justify-start flex-grow text-white z-10 ">
        <CheckAuthToken />
        <div className="bg-black p-10 rounded-md shadow-md w-full max-w-md mt-10 md:mt-24 lg:mt-48 mx-auto">
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} {/* Renderiza a mensagem de erro se houver */}
          <h2 className="text-3xl font-bold mb-4 text-white">Entrar</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="email">
                Seu email:
              </label>
              <input
                className="border rounded w-full py-3 px-3 text-gray-800"
                type="email"
                id="email"
                name="email"
                placeholder="Insira seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="password">
                Sua senha:
              </label>
              <input
                className="border rounded w-full py-3 px-3 text-gray-800"
                type="password"
                id="password"
                name="password"
                placeholder="Insira sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className='flex flex-col md:flex-row items-center justify-between'>
              <button
                className="bg-red-700 w-full md:w-auto hover:bg-red-700 text-white font-bold py-4 px-4 rounded mb-4 md:mb-0"
                type="submit"
              >
                Entrar
              </button>
              <h1 onClick={RegisterPage} className='text-center cursor-pointer text-white'>Criar nova conta</h1>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
