import SmartBreadcrumb from '@/components/smart-breadcrumb';
import { Button } from '@/components/ui/button';
import { useCategory } from '@/queries/categories';
import { useCategoryItems } from '@/queries/categories';
import { useReceipt } from '@/queries/receipts';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { ChevronLeft } from 'lucide-react';
import { LoadingState } from '@/components/loading-state';
import { useNavigate, useParams } from 'react-router-dom';

interface CategoryPageProps {}

export function CategoryPage({ ...props }: CategoryPageProps) {
  const { categoryId } = useParams();

  const navigate = useNavigate();

  const { data: category } = useCategory(categoryId);

  const { data: items } = useCategoryItems(categoryId);

  if (!category) return <LoadingState />;

  return (
    <DashboardLayout
      breadcrumbs={<SmartBreadcrumb />}
      content={
        <div className="space-y-4 mx-auto">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="secondary"
              size="icon"
              >
              <ChevronLeft aria-hidden />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="type-h2 min-w-0 flex-1 truncate">
              {`Category ${category.label}`}
            </h1>
          </div>
        </div>
      }
    />
  );
}
