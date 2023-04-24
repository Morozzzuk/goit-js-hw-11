//^Add library 
import axios from 'axios';

//^Add consts 
const API_KEY = '35381512-dde9d5be5a6a0ea2b84aeda4e';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;

export default class GalleryAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = PER_PAGE;
  }
  async getPopularPhotos() {
   const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
    );
    const data = await response.data;
  }

  incrementPage() {
    this.page += 1;
  }
  
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}