"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError, CaloriesResponse } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calculator, Sparkles } from 'lucide-react';
import { AutocompleteInput } from './autocomplete-input';
import { MealLogger } from '@/components/meals/meal-logger';
import { NutritionBreakdown } from '@/components/nutrition/nutrition-breakdown';

export function CaloriesCalculator() {
  const { token } = useAuth();
  const [dishName, setDishName] = useState('');
  const [servings, setServings] = useState('1');
  const [result, setResult] = useState<CaloriesResponse | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setIsLoading(true);

    try {
      if (!token) {
        throw new Error('Not authenticated');
      }

      const servingsNum = parseFloat(servings);
      if (isNaN(servingsNum) || servingsNum < 0.1 || servingsNum > 1000) {
        throw new Error('Servings must be between 0.1 and 1000');
      }

      const response = await api.getCalories(
        { dish_name: dishName, servings: servingsNum },
        token
      );
      setResult(response);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError('Dish not found or no nutrition data available');
        } else {
          setError(err.message);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            Calorie Calculator
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            Enter a dish name and servings to estimate calories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dishName">Dish Name</Label>
              <AutocompleteInput
                value={dishName}
                onChange={setDishName}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                step="0.1"
                min="0.1"
                max="1000"
                placeholder="1"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Calculate Calories
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {result.dish_name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Source: {result.source}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-primary">{result.total_calories}</p>
                        <p className="text-sm text-muted-foreground">kcal</p>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-sm font-bold shadow-lg">
                      {result.servings}x
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground">Per Serving</p>
                    <p className="text-2xl font-bold">{result.calories_per_serving}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground">Servings</p>
                    <p className="text-2xl font-bold">{result.servings}</p>
                    <p className="text-xs text-muted-foreground">portion{result.servings !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <MealLogger
              calorieData={result}
              onLogged={() => {
                setResult(null);
                setDishName('');
                setServings('1');
              }}
            />
          </div>

          <div>
            <NutritionBreakdown calorieData={result} />
          </div>
        </div>
      )}
    </div>
  );
}
