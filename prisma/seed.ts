import { PrismaClient, PetSpecies, PetGender, PetSize, PetStatus, VaccinationStatus, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始填充数据...');

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedPassword,
      name: '张三',
      phone: '13800138000',
      role: UserRole.ADOPTER,
      emailVerified: new Date(),
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: '管理员',
      phone: '13900139000',
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  console.log('用户创建完成');

  // 创建示例宠物
  const pets = [
    {
      name: '小白',
      species: PetSpecies.DOG,
      breed: '金毛',
      age: 12,
      gender: PetGender.MALE,
      size: PetSize.LARGE,
      description: '温顺友善的金毛犬，非常喜欢和人玩耍，适合有小孩的家庭。已完成基础训练，会坐下、握手等指令。',
      healthStatus: '健康状况良好，无遗传疾病',
      vaccinationStatus: VaccinationStatus.COMPLETE,
      location: '北京',
      status: PetStatus.AVAILABLE,
      photos: [
        'https://images.unsplash.com/photo-1633644228327-caaf962a3f13?w=800',
        'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800',
      ],
    },
    {
      name: '小花',
      species: PetSpecies.CAT,
      breed: '英短',
      age: 8,
      gender: PetGender.FEMALE,
      size: PetSize.MEDIUM,
      description: '可爱的英短小母猫，性格温顺，喜欢安静的环境。已绝育，适合公寓饲养。',
      healthStatus: '健康，已绝育',
      vaccinationStatus: VaccinationStatus.COMPLETE,
      location: '上海',
      status: PetStatus.AVAILABLE,
      photos: [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
        'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800',
      ],
    },
    {
      name: '大黄',
      species: PetSpecies.DOG,
      breed: '柴犬',
      age: 24,
      gender: PetGender.MALE,
      size: PetSize.MEDIUM,
      description: '活泼的柴犬，精力充沛，需要每天运动。对主人忠诚，但对陌生人有些警惕。',
      healthStatus: '健康',
      vaccinationStatus: VaccinationStatus.PARTIAL,
      location: '深圳',
      status: PetStatus.AVAILABLE,
      photos: [
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
      ],
    },
    {
      name: '咪咪',
      species: PetSpecies.CAT,
      breed: '橘猫',
      age: 6,
      gender: PetGender.FEMALE,
      size: PetSize.SMALL,
      description: '亲人的小橘猫，非常活泼，喜欢追逐玩具。适合第一次养猫的家庭。',
      healthStatus: '健康',
      vaccinationStatus: VaccinationStatus.COMPLETE,
      location: '广州',
      status: PetStatus.AVAILABLE,
      photos: [
        'https://images.unsplash.com/photo-1615789591457-74a63395c990?w=800',
      ],
    },
    {
      name: '小黑',
      species: PetSpecies.DOG,
      breed: '拉布拉多',
      age: 18,
      gender: PetGender.MALE,
      size: PetSize.LARGE,
      description: '友善的拉布拉多，喜欢游泳和户外活动。性格温和，适合有小孩的家庭。',
      healthStatus: '健康，定期体检',
      vaccinationStatus: VaccinationStatus.COMPLETE,
      location: '杭州',
      status: PetStatus.PENDING,
      photos: [
        'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800',
      ],
    },
    {
      name: '雪球',
      species: PetSpecies.CAT,
      breed: '波斯猫',
      age: 10,
      gender: PetGender.FEMALE,
      size: PetSize.MEDIUM,
      description: '优雅的波斯猫，毛发柔软，需要定期梳理。性格安静，喜欢躺在阳光下。',
      healthStatus: '健康',
      vaccinationStatus: VaccinationStatus.COMPLETE,
      location: '成都',
      status: PetStatus.AVAILABLE,
      photos: [
        'https://images.unsplash.com/photo-1535148875520-1e0c13b2e2e4?w=800',
      ],
    },
    {
      name: '豆豆',
      species: PetSpecies.DOG,
      breed: '泰迪',
      age: 15,
      gender: PetGender.FEMALE,
      size: PetSize.SMALL,
      description: '可爱的小泰迪，性格活泼，非常聪明。适合公寓饲养，不需要太大空间。',
      healthStatus: '健康',
      vaccinationStatus: VaccinationStatus.COMPLETE,
      location: '北京',
      status: PetStatus.AVAILABLE,
      photos: [
        'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800',
      ],
    },
    {
      name: '虎子',
      species: PetSpecies.CAT,
      breed: '美短',
      age: 20,
      gender: PetGender.MALE,
      size: PetSize.MEDIUM,
      description: '独立的美短，喜欢探索环境。对主人温柔，但需要自己的空间。',
      healthStatus: '健康，已绝育',
      vaccinationStatus: VaccinationStatus.COMPLETE,
      location: '上海',
      status: PetStatus.ADOPTED,
      adoptedAt: new Date('2024-01-15'),
      photos: [
        'https://images.unsplash.com/photo-1573865526739-10c1dd7adea6?w=800',
      ],
    },
  ];

  for (const pet of pets) {
    await prisma.pet.create({
      data: pet,
    });
  }

  console.log('宠物创建完成');

  // 创建一个示例申请
  await prisma.adoptionApplication.create({
    data: {
      userId: testUser.id,
      petId: (await prisma.pet.findFirst({ where: { name: '小黑' } }))!.id,
      fullName: '张三',
      email: 'user@example.com',
      phone: '13800138000',
      address: '北京市朝阳区某某街道',
      housingType: 'OWN',
      livingSituation: 'HOUSE',
      householdMembers: 3,
      occupation: '软件工程师',
      monthlyIncome: '15000-25000',
      hasYard: true,
      hasPetExperience: true,
      previousPetType: '狗',
      yearsOfExperience: 5,
      previousPetOutcome: '前一只宠物因年老去世',
      hasCurrentPets: false,
      motivation: '我从小就喜欢狗狗，之前养过多年，有丰富的经验。看到小黑的信息后非常喜欢，希望能给它一个温暖的家。我有稳定的工作和收入，能够为它提供良好的生活条件。',
    },
  });

  console.log('申请创建完成');

  // 创建一些收藏
  const availablePets = await prisma.pet.findMany({
    where: { status: PetStatus.AVAILABLE },
    take: 3,
  });

  for (const pet of availablePets) {
    await prisma.favorite.create({
      data: {
        userId: testUser.id,
        petId: pet.id,
      },
    });
  }

  console.log('收藏创建完成');
  console.log('数据填充完成！');
  console.log('测试账号: user@example.com / password123');
  console.log('管理员账号: admin@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
