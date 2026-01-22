/**
 * Header Component
 */

import { CheckSquare } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">TaskFlow</span>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          Modern Task Management
        </div>
      </div>
    </header>
  );
}
