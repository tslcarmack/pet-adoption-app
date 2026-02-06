"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  photos: string[];
}

interface User {
  name?: string | null;
  email?: string | null;
}

interface FormProps {
  pet: Pet;
  user: User;
}

export function AdoptionApplicationForm({ pet, user }: FormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: user.name || "",
    email: user.email || "",
    phone: "",
    address: "",
    housingType: "OWN" as "OWN" | "RENT",
    livingSituation: "HOUSE" as "HOUSE" | "APARTMENT" | "OTHER",
    householdMembers: 1,
    occupation: "",
    monthlyIncome: "",
    hasYard: false,
    hasPetExperience: false,
    previousPetType: "",
    yearsOfExperience: 0,
    previousPetOutcome: "",
    hasCurrentPets: false,
    currentPetsInfo: "",
    motivation: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === "number") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.motivation.length < 50) {
      setError("请至少输入50个字符说明领养理由");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          petId: pet.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "提交失败");
        return;
      }

      // Redirect to application confirmation
      router.push(`/applications/${data.application.id}`);
    } catch (error) {
      setError("提交失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pet Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <Image
                src={pet.photos[0] || "/placeholder-pet.jpg"}
                alt={pet.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{pet.name}</h3>
              <p className="text-sm text-muted-foreground">{pet.breed}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>个人信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">姓名 *</Label>
              <Input
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="email">邮箱 *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">手机号 *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="13800138000"
              />
            </div>
            <div>
              <Label htmlFor="occupation">职业</Label>
              <Input
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">居住地址 *</Label>
            <Input
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="城市 + 详细地址"
            />
          </div>
        </CardContent>
      </Card>

      {/* Housing Information */}
      <Card>
        <CardHeader>
          <CardTitle>居住环境</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="housingType">住房类型 *</Label>
              <select
                id="housingType"
                name="housingType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.housingType}
                onChange={handleChange}
                required
              >
                <option value="OWN">自有</option>
                <option value="RENT">租赁</option>
              </select>
            </div>
            <div>
              <Label htmlFor="livingSituation">居住类型 *</Label>
              <select
                id="livingSituation"
                name="livingSituation"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.livingSituation}
                onChange={handleChange}
                required
              >
                <option value="HOUSE">独栋房屋</option>
                <option value="APARTMENT">公寓</option>
                <option value="OTHER">其他</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="householdMembers">家庭成员数量 *</Label>
              <Input
                id="householdMembers"
                name="householdMembers"
                type="number"
                min="1"
                required
                value={formData.householdMembers}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="hasYard"
                name="hasYard"
                checked={formData.hasYard}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <Label htmlFor="hasYard">有院子</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pet Experience */}
      <Card>
        <CardHeader>
          <CardTitle>宠物经验</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasPetExperience"
              name="hasPetExperience"
              checked={formData.hasPetExperience}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <Label htmlFor="hasPetExperience">我之前养过宠物</Label>
          </div>

          {formData.hasPetExperience && (
            <div className="space-y-4 pl-6 border-l-2">
              <div>
                <Label htmlFor="previousPetType">之前养过什么宠物？</Label>
                <Input
                  id="previousPetType"
                  name="previousPetType"
                  value={formData.previousPetType}
                  onChange={handleChange}
                  placeholder="例如：狗、猫"
                />
              </div>
              <div>
                <Label htmlFor="yearsOfExperience">养宠经验（年）</Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="previousPetOutcome">之前的宠物现在怎么样了？</Label>
                <Textarea
                  id="previousPetOutcome"
                  name="previousPetOutcome"
                  value={formData.previousPetOutcome}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasCurrentPets"
              name="hasCurrentPets"
              checked={formData.hasCurrentPets}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <Label htmlFor="hasCurrentPets">我现在养着宠物</Label>
          </div>

          {formData.hasCurrentPets && (
            <div className="pl-6 border-l-2">
              <Label htmlFor="currentPetsInfo">请描述您现在的宠物</Label>
              <Textarea
                id="currentPetsInfo"
                name="currentPetsInfo"
                value={formData.currentPetsInfo}
                onChange={handleChange}
                placeholder="品种、数量、是否接种疫苗等"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motivation */}
      <Card>
        <CardHeader>
          <CardTitle>领养理由 *</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="motivation">
            为什么想领养 {pet.name}？（至少50个字符）
          </Label>
          <Textarea
            id="motivation"
            name="motivation"
            required
            value={formData.motivation}
            onChange={handleChange}
            rows={6}
            className="mt-2"
            placeholder="请详细说明您的领养理由、养宠计划等..."
          />
          <div className="text-xs text-muted-foreground mt-1">
            {formData.motivation.length}/50 字符
          </div>
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
        <Button
          type="submit"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? "提交中..." : "提交申请"}
        </Button>
      </div>
    </form>
  );
}
