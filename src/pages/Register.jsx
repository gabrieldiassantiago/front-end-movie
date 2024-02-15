import React, { useState } from 'react';
import Header from '../components/header';
import CheckAuthToken from '../utils/checkauth';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Novo estado
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const response = await fetch('https://backend-movie-ashy.vercel.app/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    });

    setTimeout(() => {
      if (response.ok) {
        navigate('/dashboard');
      } else {
        const errorData = response.json();
        console.error('Erro ao registrar usuário:', errorData.error);
      }
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="relative min-h-screen flex flex-col fundo">
      <Header />

      <div className="flex flex-col items-center justify-start flex-grow text-white z-10">
        <CheckAuthToken />
        <div className="bg-black p-10 rounded-md shadow-md w-full max-w-md mt-10 md:mt-24 lg:mt-48 mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">Registro</h2>
          <form className="space-y-4" onSubmit={handleRegister}>
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
            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="username">
                Seu username:
              </label>
              <input
                className="border rounded w-full py-3 px-3 text-gray-800"
                type="username"
                id="username"
                name="username"
                placeholder="Insira seu username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <button
              className={`bg-red-700 w-full hover:bg-red-700 text-white font-bold py-4 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
