"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface Pet {
  id?: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  description: string;
  healthStatus: string | null;
  vaccinationStatus: string;
  location: string;
  photos: string[];
  status?: string;
}

interface PetFormProps {
  pet?: Pet;
}

export function PetForm({ pet }: PetFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [formData, setFormData] = useState<Partial<Pet>>({
    name: pet?.name || "",
    species: pet?.species || "DOG",
    breed: pet?.breed || "",
    age: pet?.age || 0,
    gender: pet?.gender || "MALE",
    size: pet?.size || "MEDIUM",
    description: pet?.description || "",
    healthStatus: pet?.healthStatus || "",
    vaccinationStatus: pet?.vaccinationStatus || "NONE",
    location: pet?.location || "",
    photos: pet?.photos || [],
    status: pet?.status || "AVAILABLE",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddPhoto = () => {
    if (photoUrl && photoUrl.trim()) {
      setFormData({
        ...formData,
        photos: [...(formData.photos || []), photoUrl.trim()],
      });
      setPhotoUrl("");
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: formData.photos?.filter((_, i) => i !== index) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.photos || formData.photos.length === 0) {
      setError("至少需要一张照片");
      return;
    }

    setIsLoading(true);

    try {
      const url = pet?.id
        ? `/api/admin/pets/${pet.id}`
        : "/api/admin/pets";
      
      const method = pet?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "操作失败");
        return;
      }

      // Redirect to pets list
      router.push("/admin/pets");
      router.refresh();
    } catch (error) {
      setError("操作失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">宠物名字 *</Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="例如：小白"
              />
            </div>
            <div>
              <Label htmlFor="breed">品种 *</Label>
              <Input
                id="breed"
                name="breed"
                required
                value={formData.breed}
                onChange={handleChange}
                placeholder="例如：金毛寻回犬"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="species">物种 *</Label>
              <select
                id="species"
                name="species"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.species}
                onChange={handleChange}
                required
              >
                <option value="DOG">狗</option>
                <option value="CAT">猫</option>
                <option value="OTHER">其他</option>
              </select>
            </div>
            <div>
              <Label htmlFor="gender">性别 *</Label>
              <select
                id="gender"
                name="gender"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="MALE">公</option>
                <option value="FEMALE">母</option>
              </select>
            </div>
            <div>
              <Label htmlFor="size">体型 *</Label>
              <select
                id="size"
                name="size"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.size}
                onChange={handleChange}
                required
              >
                <option value="SMALL">小型</option>
                <option value="MEDIUM">中型</option>
                <option value="LARGE">大型</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">年龄（月） *</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="0"
                required
                value={formData.age}
                onChange={handleChange}
                placeholder="例如：24（表示2岁）"
              />
            </div>
            <div>
              <Label htmlFor="location">所在地区 *</Label>
              <Input
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="例如：北京市朝阳区"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">描述 *</Label>
            <Textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="描述宠物的性格、习惯、特点等..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Health Information */}
      <Card>
        <CardHeader>
          <CardTitle>健康信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vaccinationStatus">疫苗接种状态 *</Label>
              <select
                id="vaccinationStatus"
                name="vaccinationStatus"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.vaccinationStatus}
                onChange={handleChange}
                required
              >
                <option value="NONE">未接种</option>
                <option value="PARTIAL">部分接种</option>
                <option value="COMPLETE">已完成接种</option>
              </select>
            </div>
            {pet && (
              <div>
                <Label htmlFor="status">状态 *</Label>
                <select
                  id="status"
                  name="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="AVAILABLE">可领养</option>
                  <option value="PENDING">待审核</option>
                  <option value="ADOPTED">已领养</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="healthStatus">健康状况</Label>
            <Textarea
              id="healthStatus"
              name="healthStatus"
              value={formData.healthStatus || ""}
              onChange={handleChange}
              rows={3}
              placeholder="例如：健康状况良好，无遗传疾病"
            />
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle>照片 *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="输入图片URL"
            />
            <Button
              type="button"
              onClick={handleAddPhoto}
              disabled={!photoUrl.trim()}
            >
              添加
            </Button>
          </div>

          {formData.photos && formData.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            提示：您可以使用 Unsplash 等免费图片网站的图片URL
          </p>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          取消
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "提交中..." : pet ? "保存修改" : "添加宠物"}
        </Button>
      </div>
    </form>
  );
}
