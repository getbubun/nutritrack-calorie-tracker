"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CaloriesResponse } from '@/lib/api';

interface NutritionBreakdownProps {
  calorieData: CaloriesResponse;
}

export function NutritionBreakdown({ calorieData }: NutritionBreakdownProps) {
  const estimatedProtein = Math.round(calorieData.calories_per_serving * 0.15 / 4);
  const estimatedCarbs = Math.round(calorieData.calories_per_serving * 0.55 / 4);
  const estimatedFat = Math.round(calorieData.calories_per_serving * 0.30 / 9);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">Per serving estimate</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-medium">Calories</span>
          </div>
          <span className="font-bold">{calorieData.calories_per_serving}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-medium">Protein</span>
          </div>
          <span className="font-bold">{estimatedProtein}g</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="font-medium">Carbs</span>
          </div>
          <span className="font-bold">{estimatedCarbs}g</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="font-medium">Fat</span>
          </div>
          <span className="font-bold">{estimatedFat}g</span>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {calorieData.servings}x
                </span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Total: {calorieData.total_calories} kcal
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
