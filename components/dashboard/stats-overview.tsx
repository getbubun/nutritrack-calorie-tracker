"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Utensils, Droplet, Activity } from 'lucide-react';

interface StatsOverviewProps {
  dailyGoal?: number;
  waterGoal?: number;
  exerciseGoal?: number;
  currentCalories?: number;
  currentWater?: number;
  currentExercise?: number;
}

export function StatsOverview({
  dailyGoal = 2000,
  waterGoal = 8,
  exerciseGoal = 30,
  currentCalories = 0,
  currentWater = 0,
  currentExercise = 0,
}: StatsOverviewProps) {
  const caloriePercent = Math.round((currentCalories / dailyGoal) * 100);
  const waterPercent = Math.round((currentWater / waterGoal) * 100);
  const exercisePercent = Math.round((currentExercise / exerciseGoal) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Utensils className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Calories</p>
                <p className="text-2xl font-bold">{caloriePercent}%</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(caloriePercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {currentCalories} / {dailyGoal} kcal
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/20">
                <Droplet className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Drink Water</p>
                <p className="text-2xl font-bold">{waterPercent}%</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${Math.min(waterPercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {currentWater} / {waterGoal} glasses
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-orange-500/10 border-orange-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-500/20">
                <Activity className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Exercise</p>
                <p className="text-2xl font-bold">{exercisePercent}%</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${Math.min(exercisePercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {currentExercise} / {exerciseGoal} min
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
