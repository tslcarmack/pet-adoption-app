import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FavoriteButton } from "@/components/favorite-button";

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
}

interface PetCardProps {
  pet: Pet;
  isFavorited?: boolean;
  showFavorite?: boolean;
}

const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
  AVAILABLE: { label: "可领养", variant: "default" },
  PENDING: { label: "待审核", variant: "secondary" },
  ADOPTED: { label: "已领养", variant: "outline" },
};

const speciesMap: { [key: string]: string } = {
  DOG: "狗",
  CAT: "猫",
  OTHER: "其他",
};

const genderMap: { [key: string]: string } = {
  MALE: "公",
  FEMALE: "母",
};

export function PetCard({ pet, isFavorited = false, showFavorite = true }: PetCardProps) {
  const ageYears = Math.floor(pet.age / 12);
  const ageMonths = pet.age % 12;
  const ageText =
    ageYears > 0
      ? `${ageYears}岁${ageMonths > 0 ? ageMonths + "个月" : ""}`
      : `${ageMonths}个月`;

  const primaryPhoto = pet.photos[0] || "/placeholder-pet.jpg";
  const status = statusMap[pet.status] || statusMap.AVAILABLE;

  return (
    <Link href={`/pets/${pet.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={primaryPhoto}
            alt={pet.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          {showFavorite && (
            <div className="absolute top-2 left-2">
              <FavoriteButton
                petId={pet.id}
                initialIsFavorited={isFavorited}
                size="sm"
                variant="outline"
              />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{pet.name}</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              {speciesMap[pet.species] || pet.species} · {pet.breed}
            </p>
            <p>
              {ageText} · {genderMap[pet.gender] || pet.gender}
            </p>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {pet.location}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
