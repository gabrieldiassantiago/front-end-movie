import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import searchIcon from '../images/search.svg';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const navigate = useNavigate();
  const [successAlert, setSuccessAlert] = useState(false); // Estado para controlar o alerta de sucesso


  const fetchUserData = async () => {
    try {
      const authToken = Cookies.get('authToken');

      if (!authToken) {
        console.error('Token de autenticação não encontrado nos cookies.');
        navigate('/signup');
        return;
      }

      const response = await fetch('https://https://backend-movie-ashy.vercel.app/api/user-data', {
        method: 'GET',
        headers: {
          Authorization: `${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Erro ao obter dados do usuário:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error.message);
    } finally {
      setLoading(false); // Defina o estado de carregamento como falso após o término da solicitação
    }
  };

  const addToFavorites = async (movieId) => {
    try {
      const authToken = Cookies.get('authToken');
  
      if (!authToken) {
        console.error('Token de autenticação não encontrado nos cookies.');
        navigate('/signup');
        return;
      }
  
      const response = await fetch('https://backend-movie-ashy.vercel.app/api/addfavorites', {
        method: 'POST',
        headers: {
          Authorization: `${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('Filme adicionado aos favoritos com sucesso!');
          setSuccessAlert(true);
          setTimeout(() => {
            setSuccessAlert(false)
          }, 3000);

        } else {
          console.error('Erro ao adicionar filme aos favoritos:', data.error);
        }
      } else {
        console.error('Erro ao adicionar filme aos favoritos:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao adicionar filme aos favoritos:', error.message);
    }
  };
  

  const fetchMoviesData = async (searchTerm) => {
    try {
      const authToken = Cookies.get('authToken');

      if (!authToken) {
        console.error('Token de autenticação não encontrado nos cookies.');
        navigate('/signup');
        return;
      }

      const apiUrl = 'https://api.themoviedb.org/3/search/movie';
      const apiKey = '9772ebae19e854dd86f2d89c7089351c';

      const response = await fetch(`${apiUrl}?query=${encodeURIComponent(searchTerm)}&api_key=${apiKey}`, {
        method: 'GET',
        headers: {
          Authorization: `${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMovies(data.results);
      } else {
        console.error('Erro ao obter dados dos filmes:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao obter dados dos filmes:', error.message);
    } finally {
      setLoading(false); // Defina o estado de carregamento como falso após o término da solicitação
    }
  };


  

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true); // Defina o estado de carregamento como verdadeiro ao enviar a pesquisa
    await fetchMoviesData(searchTerm);
  };

  useEffect(() => {
    const authToken = Cookies.get('authToken');

    if (!authToken || isTokenExpired(authToken)) {
      navigate('/signup');
      return;
    }

    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const isTokenExpired = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the payload
      const currentTimestamp = Math.floor(Date.now() / 1000);
      return decodedToken.exp <= currentTimestamp;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return true; 
    }
  };

  const chunkArray = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  return (
    <div className='relative h-screen flex flex-col '>
      <Header isAuthenticated={userData !== null} />
      {loading ? ( // Verificar se a página está carregando
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        userData ? (
          <div>
            <h1 className='text-white text-center font-bold text-3xl p-12 pb-0'>Olá, {userData.username}, vamos buscar?</h1>

            <div className='flex justify-center items-center m-10'>
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='bg-white p-4 pl-8 pr-40 m-2 rounded-xl border border-gray-300 focus:outline-none focus:border-indigo-500'
                    type='text'
                    id='buscar'
                    placeholder='Busque algo aqui...'
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src={searchIcon} alt='Ícone de busca' className='w-5 h-10 m-1' />
                  </div>
                  <button type="submit" className='bg-red-600 text-2xl text-white p-4 m-2 rounded-xl focus:outline-none hover:bg-red-500'>
                    Pesquisar
                  </button>
                </form>
              </div>
            </div>

            <div className='grid grid-cols-auto gap-4 justify-center'>
              {chunkArray(movies, 5).map((movieGroup, index) => (
                <div key={index} className='flex'>
                  {movieGroup.map((movie) => (
                    <div key={movie.id} className='m-4 bg-white rounded-xl w-64 p-4 shadow-md'>
                      {movie.poster_path ? (
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                      ) : (
                        <div className="no-image-placeholder">
                          <p>Imagem não</p>
                        </div>
                        
                      )}
                      <h2 className='text-xl font-semibold'>{movie.title}</h2>
                      <button onClick={() => addToFavorites(movie.id)}>Adicionar aos favoritos</button>

                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Carregando dados do usuário...</p>
        )
      )}
       {successAlert && (
        <div className="fixed inset-x-0 top-0 flex items-center justify-center h-16 bg-green-500 text-white text-lg font-bold">
          Filme adicionado aos favoritos com sucesso!
        </div>
      )}
    </div>
  );
}

export default Dashboard;
