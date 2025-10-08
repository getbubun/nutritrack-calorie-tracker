"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { CaloriesCalculator } from '@/components/calories/calories-calculator';
import { MealHistory } from '@/components/meals/meal-history';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { MealTypeCards } from '@/components/dashboard/meal-type-cards';
import { mealService } from '@/lib/meal-service';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogOut, Calculator, History, Home as HomeIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useCallback, useState } from 'react';

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [dailySummary, setDailySummary] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  const loadDailySummary = useCallback(async () => {
    if (!user?.email) return;
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const summary = await mealService.getDailySummary(user.email, today);
      setDailySummary(summary);
    } catch (error) {
      console.error('Failed to load daily summary:', error);
    }
  }, [user?.email]);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      loadDailySummary();
    }
  }, [isAuthenticated, user, loadDailySummary]);

  const handleMealTypeSelect = () => {
    setActiveTab('calculator');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NutriTrack</h1>
                {/* <p className="text-sm text-muted-foreground">Hello, {user?.firstName}</p> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={logout} className="rounded-full">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 px-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 h-12">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <StatsOverview
              currentCalories={dailySummary?.totalCalories || 0}
              currentWater={0}
              currentExercise={0}
            />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Calorie counting</h2>
              <MealTypeCards
                breakfastCalories={dailySummary?.byMealType?.breakfast || 0}
                lunchCalories={dailySummary?.byMealType?.lunch || 0}
                dinnerCalories={dailySummary?.byMealType?.dinner || 0}
                snackCalories={dailySummary?.byMealType?.snack || 0}
                onMealTypeSelect={handleMealTypeSelect}
              />
            </div>
          </TabsContent>

          <TabsContent value="calculator">
            <CaloriesCalculator />
          </TabsContent>

          <TabsContent value="history">
            <MealHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}