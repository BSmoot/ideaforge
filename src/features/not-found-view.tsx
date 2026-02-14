import { Link } from 'react-router';
import { Button } from '@/components/ui';

export function NotFoundView(): React.ReactElement {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground-disabled">404</h1>
        <p className="mt-4 text-lg text-foreground-secondary">Page not found</p>
        <Link to="/ideas" className="mt-6 inline-block">
          <Button variant="primary">Back to Ideas</Button>
        </Link>
      </div>
    </div>
  );
}
