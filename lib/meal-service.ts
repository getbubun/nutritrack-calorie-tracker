// In-memory storage for meals
let meals: Meal[] = [];

export interface Meal {
  id: string;
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal_date: string;
  user_email: string;
  created_at: string;
}

export interface MealLog {
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal_date: string;
  user_email: string;
}

export const mealService = {
  async logMeal(mealData: MealLog): Promise<Meal> {
    const newMeal: Meal = {
      ...mealData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    
    meals.unshift(newMeal);
    return newMeal;
  },

  async getMeals(userEmail: string, date?: string): Promise<Meal[]> {
    let filteredMeals = meals.filter(meal => meal.user_email === userEmail);
    
    if (date) {
      filteredMeals = filteredMeals.filter(meal => meal.meal_date === date);
    }
    
    return filteredMeals;
  },

  async deleteMeal(id: string): Promise<void> {
    const index = meals.findIndex(meal => meal.id === id);
    if (index !== -1) {
      meals.splice(index, 1);
    }
  },

  async getDailySummary(userEmail: string, date: string) {
    const dailyMeals = await this.getMeals(userEmail, date);

    const totalCalories = dailyMeals.reduce((sum, meal) => sum + meal.total_calories, 0);
    const mealCount = dailyMeals.length;

    const byMealType = dailyMeals.reduce((acc, meal) => {
      acc[meal.meal_type] = (acc[meal.meal_type] || 0) + meal.total_calories;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCalories,
      mealCount,
      byMealType,
    };
  },

  async getWeeklySummary(userEmail: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    const recentMeals = meals.filter(meal => 
      meal.user_email === userEmail && 
      meal.meal_date >= sevenDaysAgoStr
    );

    const totalCalories = recentMeals.reduce((sum, meal) => sum + meal.total_calories, 0);

    const dailyMap = recentMeals.reduce((acc, meal) => {
      acc[meal.meal_date] = (acc[meal.meal_date] || 0) + meal.total_calories;
      return acc;
    }, {} as Record<string, number>);

    const days = Object.entries(dailyMap).map(([date, calories]) => ({
      date,
      calories,
    }));

    const dailyAverage = days.length > 0 ? totalCalories / days.length : 0;

    return {
      totalCalories,
      dailyAverage,
      days,
    };
  },
};
