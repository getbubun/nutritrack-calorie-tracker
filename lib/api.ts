const API_BASE_URL = 'https://flybackend-misty-feather-6458.fly.dev';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CaloriesRequest {
  dish_name: string;
  servings: number;
}

export interface CaloriesResponse {
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const recentSearches = new Set<string>();
const MAX_RECENT_SEARCHES = 10;

export const api = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new ApiError(response.status, error.message || 'Registration failed');
    }

    return response.json();
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new ApiError(response.status, error.message || 'Login failed');
    }

    return response.json();
  },

  async getCalories(data: CaloriesRequest, token: string): Promise<CaloriesResponse> {
    const response = await fetch(`${API_BASE_URL}/get-calories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch calories' }));
      throw new ApiError(response.status, error.message || 'Failed to fetch calories');
    }

    const result = await response.json();

    if (recentSearches.size >= MAX_RECENT_SEARCHES) {
      const firstItem = recentSearches.values().next().value;
      recentSearches.delete(firstItem);
    }
    recentSearches.add(result.dish_name.toLowerCase());

    return result;
  },

  getAutocompleteSuggestions(query: string): string[] {
    if (!query || query.length < 2) {
      return Array.from(recentSearches).slice(-5).reverse();
    }

    const lowerQuery = query.toLowerCase();
    const matched = Array.from(recentSearches).filter(dish =>
      dish.toLowerCase().includes(lowerQuery)
    );

    const commonDishes = [
      'chicken salad', 'caesar salad', 'greek salad', 'garden salad',
      'grilled chicken', 'fried chicken', 'chicken breast', 'chicken wings',
      'beef burger', 'cheeseburger', 'hamburger',
      'pizza margherita', 'pepperoni pizza', 'cheese pizza',
      'spaghetti carbonara', 'spaghetti bolognese', 'pasta alfredo',
      'salmon fillet', 'grilled salmon', 'tuna steak',
      'brown rice', 'white rice', 'fried rice',
      'scrambled eggs', 'fried egg', 'boiled egg', 'omelette',
      'french fries', 'mashed potatoes', 'baked potato',
      'chocolate cake', 'cheesecake', 'apple pie',
      'protein shake', 'smoothie bowl', 'green smoothie',
      'avocado toast', 'peanut butter sandwich', 'turkey sandwich'
    ];

    const commonMatched = commonDishes.filter(dish =>
      dish.toLowerCase().includes(lowerQuery)
    );

    const combined = Array.from(new Set([...matched, ...commonMatched]));
    return combined.slice(0, 8);
  },
};
