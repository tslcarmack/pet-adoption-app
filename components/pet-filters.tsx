"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { MobileFilterSheet } from "@/components/mobile-filter-sheet";

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

export function PetFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const activeFilters = {
    species: searchParams.get("species"),
    gender: searchParams.get("gender"),
    size: searchParams.get("size"),
    age: searchParams.get("age"),
    location: searchParams.get("location"),
    q: searchParams.get("q"),
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

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
    setSearchQuery("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("q", searchQuery || null);
  };

  const removeFilter = (key: string) => {
    if (key === "q") {
      setSearchQuery("");
    }
    updateFilter(key, null);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索宠物名字、品种..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" size="default" className="hidden sm:flex">搜索</Button>
            <Button type="submit" size="icon" className="sm:hidden">
              <Search className="h-4 w-4" />
            </Button>
            
            {/* Desktop Filter Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden md:flex"
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
              {activeFilterCount > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            
            {/* Mobile Filter Sheet */}
            <MobileFilterSheet />
          </form>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">当前筛选:</span>
          
          {activeFilters.species && (
            <Badge variant="secondary" className="gap-1">
              {speciesOptions.find((o) => o.value === activeFilters.species)?.label}
              <button
                onClick={() => removeFilter("species")}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {activeFilters.gender && (
            <Badge variant="secondary" className="gap-1">
              {genderOptions.find((o) => o.value === activeFilters.gender)?.label}
              <button
                onClick={() => removeFilter("gender")}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {activeFilters.size && (
            <Badge variant="secondary" className="gap-1">
              {sizeOptions.find((o) => o.value === activeFilters.size)?.label}
              <button
                onClick={() => removeFilter("size")}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {activeFilters.age && (
            <Badge variant="secondary" className="gap-1">
              {ageOptions.find((o) => o.value === activeFilters.age)?.label}
              <button
                onClick={() => removeFilter("age")}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {activeFilters.location && (
            <Badge variant="secondary" className="gap-1">
              {activeFilters.location}
              <button
                onClick={() => removeFilter("location")}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {activeFilters.q && (
            <Badge variant="secondary" className="gap-1">
              &quot;{activeFilters.q}&quot;
              <button
                onClick={() => removeFilter("q")}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7"
          >
            清除全部
          </Button>
        </div>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">高级筛选</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Species */}
            <div>
              <Label className="text-sm font-medium mb-3 block">物种</Label>
              <div className="flex flex-wrap gap-2">
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
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <Label className="text-sm font-medium mb-3 block">性别</Label>
              <div className="flex flex-wrap gap-2">
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
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <Label className="text-sm font-medium mb-3 block">体型</Label>
              <div className="flex flex-wrap gap-2">
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
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div>
              <Label className="text-sm font-medium mb-3 block">年龄</Label>
              <div className="flex flex-wrap gap-2">
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
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-sm font-medium mb-3 block">
                地区
              </Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="输入城市或地区"
                  value={activeFilters.location || ""}
                  onChange={(e) => updateFilter("location", e.target.value || null)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
