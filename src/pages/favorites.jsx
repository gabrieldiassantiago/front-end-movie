import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import axios from 'axios';

const useFavoriteStore = create((set) => ({
  favorites: [], // Initialize favorites as an empty array
  setFavorites: (newFavorites) => set({ favorites: newFavorites }),
}));

function Favorites() {
  const { favorites, setFavorites } = useFavoriteStore();
  const [successAlert, setSuccessAlert] = useState(false); // Estado para controlar o alerta de sucesso

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('https://backend-movie-ashy.vercel.app/api/favorites', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Cookies.get('authToken')
          },
        });

        if (response.status === 200) {
          setFavorites(response.data);
        } else {
          console.error('Erro ao obter filmes favoritos');
        }
      } catch (error) {
        console.error('Erro ao obter filmes favoritos:', error);
      }
    };

    fetchFavorites();
  }, [setFavorites]);

  const removeFromFavorites = async (movieId) => {
    try {
      const authToken = Cookies.get('authToken');
      const response = await axios.delete(`https://backend-movie-ashy.vercel.app/api/deletefavorite/${movieId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken
        },
      });

      if (response.status === 200) {
        const favoritesResponse = await axios.get('https://backend-movie-ashy.vercel.app/api/favorites', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Cookies.get('authToken')
          },
        });

        if (favoritesResponse.status === 200) {
          setFavorites(favoritesResponse.data);
          setSuccessAlert(true);

          // Remover o alerta de sucesso após 3 segundos
          setTimeout(() => {
            setSuccessAlert(false);
          }, 3000);
        } else {
          console.error('Erro ao obter filmes favoritos após remoção');
        }
      } else {
        console.error('Erro ao excluir filme dos favoritos');
      }
    } catch (error) {
      console.error('Erro ao excluir filme dos favoritos:', error.message);
    }
  };

  return (
    <div className='relative h-screen flex flex-col'>
      <h1 className='text-white text-center font-bold text-3xl p-12 pb-0'>Filmes Favoritos</h1>

      <div className='flex flex-wrap justify-center'>
        {favorites.length === 0 ? ( // Verificar se não há favoritos
          <p className='text-white text-2xl'>Não há filmes favoritos.</p>
        ) : (
          favorites.map((movieId, index) => (
            <FavoriteMovie key={index} movieId={movieId} removeFromFavorites={removeFromFavorites} successAlert={successAlert} setSuccessAlert={setSuccessAlert} />
          ))
        )}
      </div>
    </div>
  );
}

const FavoriteMovie = ({ movieId, removeFromFavorites, successAlert, setSuccessAlert }) => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=9772ebae19e854dd86f2d89c7089351c`);
        if (response.status === 200) {
          setMovie(response.data);
        } else {
          console.error('Erro ao obter detalhes do filme');
        }
      } catch (error) {
        console.error('Erro ao obter detalhes do filme:', error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return (
    <div className='m-4 bg-white rounded-xl w-64 p-4 shadow-md relative'>
      {movie && movie.poster_path ? (
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      ) : (
        <div className="no-image-placeholder">
          <p>Imagem não disponível</p>
        </div>
      )}
      {movie && (
        <>
          <h2 className='text-xl font-semibold'>{movie.title}</h2>
          <button onClick={() => removeFromFavorites(movie.id)} className='absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-md'>Remover dos favoritos</button>
          <p>{movie.overview}</p>
        </>
      )}
      <div>
        {successAlert && (
          <div className="fixed inset-x-0 top-0 flex items-center justify-center h-16 bg-green-500 text-white text-lg font-bold">
            Filme removido com sucesso
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
