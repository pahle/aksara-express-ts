import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const destinationData: Prisma.DestinationCreateInput[] = [
  {
    id: "1b28ace8-e752-489f-9612-a12efc84b7f0",
    name: "Pantai Kuta",
    location: "Kuta, Bali",
    description: "Pantai Kuta adalah salah satu tempat wisata yang paling terkenal di Bali...",
    address: "Jl. Pantai Kuta, Kuta, Kabupaten Badung, Bali",
    hours: "24 jam",
    prices: ["Rp 100.000"],
    contact: "081234567890",
    facilities: ["Toilet, Warung, Tempat Parkir"],
    images: ["https://picsum.photos/500", "https://picsum.photos/500", "https://picsum.photos/500"],
  },
  {
    id: "ea595f34-8a38-40db-adc7-74664b2b6d42",
    name: "Pantai Sanur",
    location: "Sanur, Bali",
    description: "Pantai Sanur adalah salah satu pantai yang terletak di sebelah timur Denpasar...",
    address: "Jl. Pantai Sanur, Sanur, Kabupaten Gianyar, Bali",
    hours: "24 jam",
    prices: ["Rp 50.000"],
    contact: "081234567890",
    facilities: ["Toilet, Warung, Tempat Parkir"],
    images: ["https://picsum.photos/500", "https://picsum.photos/500", "https://picsum.photos/500"],
  },
  {
    id: "94e1eebe-9bf9-4f5e-9142-703fbfc9a13c",
    name: "Pantai Lovina",
    location: "Lovina, Bali",
    description: "Pantai Lovina adalah salah satu pantai yang terletak di sebelah utara Bali...",
    address: "Jl. Pantai Lovina, Lovina, Kabupaten Buleleng, Bali",
    hours: "24 jam",
    prices: ["Rp 75.000"],
    contact: "081234567890",
    facilities: ["Toilet, Warung, Tempat Parkir"],
    images: ["https://picsum.photos/500", "https://picsum.photos/500", "https://picsum.photos/500"],
  },
];

const eventData: Prisma.EventCreateInput[] = [
  {
    id: "486b486e-26db-49a9-9fed-8aabb8e45272",
    name: "Bali Kite Festival",
    description: "Bali Kite Festival adalah festival layang-layang yang diadakan setiap tahun di Bali...",
    address: "Padang Galak Beach, Sanur, Bali",
    hours: "08.00 - 17.00",
    prices: ["Gratis"],
    contact: "081234567890",
    images: ["https://picsum.photos/500", "https://picsum.photos/500", "https://picsum.photos/500"],
  },
  {
    id: "ee89e63c-f782-4d84-8def-2f2a09ed5940",
    name: "Bali Arts Festival",
    description: "Bali Arts Festival adalah festival seni yang diadakan setiap tahun di Bali...",
    address: "Taman Werdhi Budaya, Denpasar, Bali",
    hours: "08.00 - 17.00",
    prices: ["Gratis"],
    contact: "081234567890",
    images: ["https://picsum.photos/500", "https://picsum.photos/500", "https://picsum.photos/500"],
  },
  {
    id: "8176abd4-a082-426b-ae47-0480f160fda4",
    name: "Bali Food Festival",
    description: "Bali Food Festival adalah festival makanan yang diadakan setiap tahun di Bali...",
    address: "Lapangan Puputan Badung, Denpasar, Bali",
    hours: "08.00 - 17.00",
    prices: ["Gratis"],
    contact: "081234567890",
    images: ["https://picsum.photos/500", "https://picsum.photos/500", "https://picsum.photos/500"],
  },
];

const userData: Prisma.UserCreateInput[] = [
  {
    id: "b6c711b0-3cdb-49cc-bc4f-b22205bc857d",
    email: "user@user.com",
    phone: "621234567890",
    password: "$2b$10$CIQhjJu7EqgxJDQHw./Z3.PJGvETDKTgjjjExJP56aq2Q19B.OwGK", // Assume hashed password
    verifiedAt: null,
    profile: {
      create: {
        username: "user",
        name: "user",
        image: "https://i.pravatar.cc/150?u=user",
        bio: "Halo saya user",
        reviews: {
          create: [
            {
              rating: 5,
              comment: "Great destination!",
              destination: {
                connect: { id: "1b28ace8-e752-489f-9612-a12efc84b7f0" }, // Existing destination ID
              },
            },
            {
              rating: 4,
              comment: "Amazing event!",
              event: {
                connect: { id: "486b486e-26db-49a9-9fed-8aabb8e45272" }, // Existing event ID
              },
            },
          ],
        },
      },
    },
  },
];

async function main() {
  console.log(`Clearing existing data...`);

  // Clear existing records
  await prisma.review.deleteMany();
  await prisma.user.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.event.deleteMany();

  // 1. Seed Destination Data first
  console.log(`Seeding destinations...`);
  for (const d of destinationData) {
    const destination = await prisma.destination.create({
      data: d,
    });
    console.log(`Created destination with id: ${destination.id}`);
  }

  // 2. Seed Event Data second
  console.log(`Seeding events...`);
  for (const e of eventData) {
    const event = await prisma.event.create({
      data: e,
    });
    console.log(`Created event with id: ${event.id}`);
  }

  // 3. Seed User Data (with nested reviews) last
  console.log(`Seeding users...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  console.log(`Seeding completed.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
