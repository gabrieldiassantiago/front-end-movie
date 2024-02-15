import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function CheckAuthToken() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = Cookies.get('authToken');

    // Verificar se o token existe e se não expirou
    if (authToken) {
      const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
      const tokenExpiration = tokenPayload.exp * 1000; // Multiplicar por 1000 para converter segundos em milissegundos
      const currentTime = new Date().getTime();

      // Se o tempo atual for maior que o tempo de expiração do token, remover o token
      if (currentTime > tokenExpiration) {
        Cookies.remove('authToken');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated;
}

export default CheckAuthToken;
