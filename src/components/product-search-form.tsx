import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProductSearchFormProps = {
  query: string;
};

export function ProductSearchForm({ query }: ProductSearchFormProps) {
  return (
    <form action="/products" className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
        />
        <Input
          className="pl-9"
          defaultValue={query}
          name="q"
          placeholder="Search products"
          type="search"
        />
      </div>
      <Button className="sm:w-28" type="submit">
        Search
      </Button>
    </form>
  );
}
