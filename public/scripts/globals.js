export const pizzasUrl =  getApiUrl('api/pizzas');
export const ingredientsUrl = getApiUrl('api/ingredients');
export const numOfSkeletons = 4;

function getApiUrl(endpoint) {
  const isProduction = window.location.hostname.includes('prog-pizza-website.netlify');
  const baseUrl = isProduction ? '' : 'http://localhost:3000/';
  return `${baseUrl}${endpoint}`;
}