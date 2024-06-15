import { BarSeries } from '@/components/charts/interfaces';
import { NivoBarChart } from '@/components/charts/nivo-bar-chart';
import { SubcategoriesChart } from '@/components/charts/subcategories-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubcategoryTotalsResult } from '@/lib/types';
import { useMemo } from 'react';

interface SubcategoriesCardProps {
  data: SubcategoryTotalsResult[];
  loading: boolean;
  className?: string;
}

export function SubcategoriesCard({
  className,
  ...props
}: SubcategoriesCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top Item Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <SubcategoriesChart {...props} />
      </CardContent>
    </Card>
  );
}
