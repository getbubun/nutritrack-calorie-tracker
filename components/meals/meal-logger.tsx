"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { mealService } from '@/lib/meal-service';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CaloriesResponse } from '@/lib/api';
import { Loader as Loader2, Calendar as CalendarIcon, Check } from 'lucide-react';
import { format } from 'date-fns';

interface MealLoggerProps {
  calorieData: CaloriesResponse;
  onLogged: () => void;
}

export function MealLogger({ calorieData, onLogged }: MealLoggerProps) {
  const { user } = useAuth();
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [mealDate, setMealDate] = useState<Date>(new Date());
  const [error, setError] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogMeal = async () => {
    if (!user?.email) return;

    setError('');
    setSuccess(false);
    setIsLogging(true);

    try {
      await mealService.logMeal({
        dish_name: calorieData.dish_name,
        servings: calorieData.servings,
        calories_per_serving: calorieData.calories_per_serving,
        total_calories: calorieData.total_calories,
        source: calorieData.source,
        meal_type: mealType,
        meal_date: format(mealDate, 'yyyy-MM-dd'),
        user_email: user.email,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onLogged();
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to log meal');
      }
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-900">Log This Meal</CardTitle>
        <CardDescription className="text-blue-700">
          Save this meal to your food diary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900">
              Meal logged successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="mealType" className="text-blue-900">Meal Type</Label>
          <Select value={mealType} onValueChange={(value: any) => setMealType(value)}>
            <SelectTrigger id="mealType" className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-blue-900">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(mealDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={mealDate}
                onSelect={(date) => date && setMealDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          onClick={handleLogMeal}
          className="w-full"
          disabled={isLogging || success}
        >
          {isLogging && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {success ? 'Logged!' : 'Log Meal'}
        </Button>
      </CardContent>
    </Card>
  );
}
