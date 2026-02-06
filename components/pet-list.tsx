import { PetCard } from "@/components/pet-card";
import { Pagination } from "@/components/pagination";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  location: string;
  status: string;
  photos: string[];
  description: string;
}

interface PetListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function fetchPets(searchParams: { [key: string]: string | string[] | undefined }) {
  const params = new URLSearchParams();
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, String(value));
    }
  });

  const res = await fetch(
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/pets?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch pets");
  }

  return res.json();
}

export async function PetList({ searchParams }: PetListProps) {
  const data = await fetchPets(searchParams);
  const { pets, pagination } = data;

  return (
    <div className="space-y-6">
      {pets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">暂无符合条件的宠物</p>
          <p className="text-sm text-muted-foreground mt-2">
            试试调整筛选条件或稍后再来查看
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {pets.map((pet: Pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
            />
          )}
        </>
      )}
    </div>
  );
}
