"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const speciesOptions = [
  { value: "DOG", label: "狗" },
  { value: "CAT", label: "猫" },
  { value: "OTHER", label: "其他" },
];

const genderOptions = [
  { value: "MALE", label: "公" },
  { value: "FEMALE", label: "母" },
];

const sizeOptions = [
  { value: "SMALL", label: "小型" },
  { value: "MEDIUM", label: "中型" },
  { value: "LARGE", label: "大型" },
];

const ageOptions = [
  { value: "young", label: "幼年 (0-1岁)" },
  { value: "adult", label: "成年 (1-7岁)" },
  { value: "senior", label: "老年 (7岁+)" },
];

export function MobileFilterSheet() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFilters = {
    species: searchParams.get("species"),
    gender: searchParams.get("gender"),
    size: searchParams.get("size"),
    age: searchParams.get("age"),
    location: searchParams.get("location"),
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filters change
    params.set("page", "1");
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative md:hidden">
          <Filter className="h-4 w-4 mr-2" />
          筛选
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center" variant="secondary">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>筛选条件</span>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
              >
                清除全部
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Species */}
          <div>
            <Label className="text-base font-semibold mb-3 block">物种</Label>
            <div className="grid grid-cols-3 gap-2">
              {speciesOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilters.species === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    updateFilter(
                      "species",
                      activeFilters.species === option.value ? null : option.value
                    )
                  }
                  className="w-full"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Gender */}
          <div>
            <Label className="text-base font-semibold mb-3 block">性别</Label>
            <div className="grid grid-cols-2 gap-2">
              {genderOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilters.gender === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    updateFilter(
                      "gender",
                      activeFilters.gender === option.value ? null : option.value
                    )
                  }
                  className="w-full"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Size */}
          <div>
            <Label className="text-base font-semibold mb-3 block">体型</Label>
            <div className="grid grid-cols-3 gap-2">
              {sizeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilters.size === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    updateFilter(
                      "size",
                      activeFilters.size === option.value ? null : option.value
                    )
                  }
                  className="w-full"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Age */}
          <div>
            <Label className="text-base font-semibold mb-3 block">年龄</Label>
            <div className="flex flex-col gap-2">
              {ageOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilters.age === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    updateFilter(
                      "age",
                      activeFilters.age === option.value ? null : option.value
                    )
                  }
                  className="w-full"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div>
            <Label htmlFor="mobile-location" className="text-base font-semibold mb-3 block">
              地区
            </Label>
            <Input
              id="mobile-location"
              placeholder="输入城市或地区"
              value={activeFilters.location || ""}
              onChange={(e) => updateFilter("location", e.target.value || null)}
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t sticky bottom-0 bg-background">
          <SheetClose asChild>
            <Button className="w-full" size="lg">
              查看结果
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
