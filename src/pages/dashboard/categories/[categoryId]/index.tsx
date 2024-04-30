import SmartBreadcrumb from '@/components/smart-breadcrumb';
import { Button } from '@/components/ui/button';
import { useCategory } from '@/hooks/use-category';
import { useCategoryItems } from '@/hooks/use-category-items';
import { useReceipt } from '@/hooks/use-receipt';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface CategoryPageProps {}

export function CategoryPage({ ...props }: CategoryPageProps) {
  const { categoryId } = useParams();

  const navigate = useNavigate();

  const { data: category } = useCategory(categoryId);

  const { data: items } = useCategoryItems(categoryId);
  console.log(items);

  if (!category) return <div>Loading...</div>;

  return (
    <DashboardLayout
      breadcrumbs={<SmartBreadcrumb />}
      content={
        <div className="space-y-4 mx-auto">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="icon"
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 truncate text-xl font-semibold tracking-tight">
              {`Category ${category.label}`}
            </h1>
          </div>
        </div>
      }
    />
  );
}
