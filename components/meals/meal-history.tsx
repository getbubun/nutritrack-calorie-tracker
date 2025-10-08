"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { mealService, Meal } from '@/lib/meal-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader as Loader2, Trash2, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export function MealHistory() {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dailySummary, setDailySummary] = useState<any>(null);

  const loadMeals = async (date?: Date) => {
    if (!user?.email) return;

    setIsLoading(true);
    setError('');

    try {
      const dateStr = date ? format(date, 'yyyy-MM-dd') : format(selectedDate, 'yyyy-MM-dd');
      const [mealsData, summaryData] = await Promise.all([
        mealService.getMeals(user.email, dateStr),
        mealService.getDailySummary(user.email, dateStr),
      ]);

      setMeals(mealsData);
      setDailySummary(summaryData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load meals');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeals();
  }, [user, selectedDate]);

  const handleDelete = async (id: string) => {
    try {
      await mealService.deleteMeal(id);
      loadMeals();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lunch':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dinner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'snack':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Meal History
        </CardTitle>
        <CardDescription>Track your daily calorie intake</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {dailySummary && (
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Total Calories</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {Math.round(dailySummary.totalCalories)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Meals Logged</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {dailySummary.mealCount}
                  </p>
                </div>
              </div>
              {Object.keys(dailySummary.byMealType).length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    {Object.entries(dailySummary.byMealType).map(([type, calories]) => (
                      <div key={type} className="flex justify-between items-center">
                        <Badge variant="outline" className={getMealTypeColor(type)}>
                          {type}
                        </Badge>
                        <span className="text-sm font-medium">{Math.round(calories as number)} kcal</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No meals logged for this day
          </div>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <Card key={meal.id} className="bg-white">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={getMealTypeColor(meal.meal_type)}>
                          {meal.meal_type}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {format(new Date(meal.created_at), 'h:mm a')}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900">{meal.dish_name}</h4>
                      <div className="flex gap-4 mt-2 text-sm text-slate-600">
                        <span>{meal.servings} serving{meal.servings !== 1 ? 's' : ''}</span>
                        <span>{meal.calories_per_serving} kcal/serving</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 mt-1">
                        {meal.total_calories} kcal total
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(meal.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
