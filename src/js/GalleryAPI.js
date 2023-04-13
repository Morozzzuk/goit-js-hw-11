import axios from 'axios';

//^Add library 
import axios from 'axios';

export class GalleryAPI {
  //* Приватні властивості
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '35381512-dde9d5be5a6a0ea2b84aeda4e';
  #query = '';
    
    //^Add functions
getPopularPhotos(page) {
    return axios.get(`${this.#BASE_URL}/search/photos`, {
      params: {
        query: 'random',
        page,
        per_page: 12,
        client_id: this.#API_KEY,
      },
    });
}
    
    fetchPhotosByQuery(page) {
    return axios.get(`${this.#BASE_URL}/search/photos`, {
      params: {
        query: this.#query,
        page,
        per_page: 24,
        client_id: this.#API_KEY,
      },
    });
  }
set query(newQuery){
    this.#query = newQuery;
  }
}
