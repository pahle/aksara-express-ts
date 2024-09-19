import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    id: "b6c711b0-3cdb-49cc-bc4f-b22205bc857d",
    email: "user@user.com",
    phone: "621234567890",
    password:
      "$2b$10$CIQhjJu7EqgxJDQHw./Z3.PJGvETDKTgjjjExJP56aq2Q19B.OwGK",
    verifiedAt: null,
    profile: {
      create: {
        username: "user",
        name: "user",
        image: "https://i.pravatar.cc/150?u=user",
        bio: "Halo saya user",
      },
    },
  },
];

const destinationData: Prisma.DestinationCreateInput[] = [
  {
    id: "1b28ace8-e752-489f-9612-a12efc84b7f0",
    name: "Pantai Kuta",
    location: "Kuta, Bali",
    description:
      "Pantai Kuta adalah salah satu tempat wisata yang paling terkenal di Bali. Pantai ini terletak di sebelah barat Denpasar, ibukota Bali, dan merupakan salah satu tempat yang paling sering dikunjungi oleh wisatawan asing.",
    address:
      "Jl. Pantai Kuta, Kuta, Kabupaten Badung, Bali",
    hours: "24 jam",
    prices: ["Rp 100.000"],
    contact: "081234567890",
    facilities: ["Toilet, Warung, Tempat Parkir"],
    images: [
      "https://picsum.photos/500",
      "https://picsum.photos/500",
      "https://picsum.photos/500",
    ],
  },
  {
    id: "ea595f34-8a38-40db-adc7-74664b2b6d42",
    name: "Pantai Sanur",
    location: "Sanur, Bali",
    description:
      "Pantai Sanur adalah salah satu pantai yang terletak di sebelah timur Denpasar, ibukota Bali. Pantai ini terkenal dengan keindahan matahari terbitnya.",
    address:
      "Jl. Pantai Sanur, Sanur, Kabupaten Gianyar, Bali",
    hours: "24 jam",
    prices: ["Rp 50.000"],
    contact: "081234567890",
    facilities: ["Toilet, Warung, Tempat Parkir"],
    images: [
      "https://picsum.photos/500",
      "https://picsum.photos/500",
      "https://picsum.photos/500",
    ],
  },
  {
    id: "94e1eebe-9bf9-4f5e-9142-703fbfc9a13c",
    name: "Pantai Lovina",
    location: "Lovina, Bali",
    description:
      "Pantai Lovina adalah salah satu pantai yang terletak di sebelah utara Bali. Pantai ini terkenal dengan keindahan matahari terbenamnya.",
    address:
      "Jl. Pantai Lovina, Lovina, Kabupaten Buleleng, Bali",
    hours: "24 jam",
    prices: ["Rp 75.000"],
    contact: "081234567890",
    facilities: ["Toilet, Warung, Tempat Parkir"],
    images: [
      "https://picsum.photos/500",
      "https://picsum.photos/500",
      "https://picsum.photos/500",
    ],
  },
];

const eventData: Prisma.EventCreateInput[] = [
  {
    id: "486b486e-26db-49a9-9fed-8aabb8e45272",
    name: "Bali Kite Festival",
    description:
      "Bali Kite Festival adalah festival layang-layang yang diadakan setiap tahun di Bali. Festival ini diikuti oleh peserta dari berbagai daerah di Bali.",
    address: "Padang Galak Beach, Sanur, Bali",
    hours: "08.00 - 17.00",
    prices: ["Gratis"],
    contact: "081234567890",
    images: [
      "https://picsum.photos/500",
      "https://picsum.photos/500",
      "https://picsum.photos/500",
    ],
  },
  {
    id: "ee89e63c-f782-4d84-8def-2f2a09ed5940",
    name: "Bali Arts Festival",
    description:
      "Bali Arts Festival adalah festival seni yang diadakan setiap tahun di Bali. Festival ini diikuti oleh seniman dari berbagai daerah di Bali.",
    address: "Taman Werdhi Budaya, Denpasar, Bali",
    hours: "08.00 - 17.00",
    prices: ["Gratis"],
    contact: "081234567890",
    images: [
      "https://picsum.photos/500",
      "https://picsum.photos/500",
      "https://picsum.photos/500",
    ],
  },
  {
    id: "8176abd4-a082-426b-ae47-0480f160fda4",
    name: "Bali Food Festival",
    description:
      "Bali Food Festival adalah festival makanan yang diadakan setiap tahun di Bali. Festival ini diikuti oleh pedagang makanan dari berbagai daerah di Bali.",
    address: "Lapangan Puputan Badung, Denpasar, Bali",
    hours: "08.00 - 17.00",
    prices: ["Gratis"],
    contact: "081234567890",
    images: [
      "https://picsum.photos/500",
      "https://picsum.photos/500",
      "https://picsum.photos/500",
    ],
  },
];

async function main() {
  console.log(`Clearing existing data...`);

  // Delete all records from the tables
  await prisma.user.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.event.deleteMany();
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  for (const d of destinationData) {
    const destination = await prisma.destination.create({
      data: d,
    });
    console.log(
      `Created destination with id: ${destination.id}`
    );
  }
  for (const e of eventData) {
    const event = await prisma.event.create({
      data: e,
    });
    console.log(`Created event with id: ${event.id}`);
  }
  console.log(`Seeding finished.`);
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
