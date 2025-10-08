"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Sun, Moon, Apple, Plus } from 'lucide-react';

interface MealTypeCardsProps {
  breakfastCalories: number;
  lunchCalories: number;
  dinnerCalories: number;
  snackCalories: number;
  onMealTypeSelect: (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
}

export function MealTypeCards({
  breakfastCalories,
  lunchCalories,
  dinnerCalories,
  snackCalories,
  onMealTypeSelect,
}: MealTypeCardsProps) {
  const meals = [
    {
      type: 'breakfast' as const,
      label: 'Breakfast',
      calories: breakfastCalories,
      icon: Coffee,
      gradient: 'from-yellow-400 to-orange-400',
    },
    {
      type: 'lunch' as const,
      label: 'Lunch',
      calories: lunchCalories,
      icon: Sun,
      gradient: 'from-blue-400 to-cyan-400',
    },
    {
      type: 'dinner' as const,
      label: 'Dinner',
      calories: dinnerCalories,
      icon: Moon,
      gradient: 'from-purple-400 to-pink-400',
    },
    {
      type: 'snack' as const,
      label: 'Snack',
      calories: snackCalories,
      icon: Apple,
      gradient: 'from-green-400 to-emerald-400',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {meals.map((meal) => (
        <Card
          key={meal.type}
          className="bg-gradient-to-br hover:shadow-lg transition-all cursor-pointer border-0"
          onClick={() => onMealTypeSelect(meal.type)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${meal.gradient}`}>
                <meal.icon className="h-6 w-6 text-white" />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onMealTypeSelect(meal.type);
                }}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <h3 className="font-semibold text-lg mb-1">{meal.label}</h3>
            <p className="text-2xl font-bold text-primary">
              {meal.calories} <span className="text-sm font-normal text-muted-foreground">kcal</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
